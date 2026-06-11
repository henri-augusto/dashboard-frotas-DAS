"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import type { DashboardStats } from "./types";

export async function getAllVehicles() {
  await requireAdmin();
  return prisma.vehicle.findMany({ orderBy: { prefixo: "asc" } });
}

function daysSinceDischarge(dischargedAt: Date): number {
  const now = new Date();
  const diffMs = now.getTime() - dischargedAt.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return Math.max(1, days);
}

export async function getDashboardStats(): Promise<DashboardStats> {
  await requireAdmin();

  const [
    total,
    baixadas,
    disponiveis,
    emUso,
    relatoriosAbertos,
    relatoriosEncerrados,
    usageCounts,
    activeDischarges,
  ] = await Promise.all([
    prisma.vehicle.count(),
    prisma.vehicle.count({ where: { status: "BAIXADA" } }),
    prisma.vehicle.count({ where: { status: "DISPONIVEL" } }),
    prisma.vehicle.count({ where: { status: "EM_USO" } }),
    prisma.serviceReport.count({ where: { status: "ABERTO" } }),
    prisma.serviceReport.count({ where: { status: "ENCERRADO" } }),
    prisma.serviceReport.groupBy({
      by: ["vehicleId"],
      _count: { vehicleId: true },
      orderBy: { _count: { vehicleId: "desc" } },
      take: 1,
    }),
    prisma.vehicleDischarge.findMany({
      where: { returnedAt: null },
      include: { vehicle: { select: { prefixo: true } } },
      orderBy: { dischargedAt: "desc" },
    }),
  ]);

  let viaturaMaisUsada: { prefixo: string; totalUsos: number } | null = null;

  if (usageCounts.length > 0) {
    const top = usageCounts[0];
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: top.vehicleId },
      select: { prefixo: true },
    });
    if (vehicle) {
      viaturaMaisUsada = {
        prefixo: vehicle.prefixo,
        totalUsos: top._count.vehicleId,
      };
    }
  }

  const viaturasBaixadas = activeDischarges.map((discharge) => ({
    id: discharge.id,
    prefixo: discharge.vehicle.prefixo,
    diasBaixada: daysSinceDischarge(discharge.dischargedAt),
  }));

  return {
    total,
    baixadas,
    disponiveis,
    emUso,
    relatoriosAbertos,
    relatoriosEncerrados,
    viaturaMaisUsada,
    viaturasBaixadas,
  };
}
