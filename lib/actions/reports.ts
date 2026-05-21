"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function getServiceReports(filters?: {
  status?: string;
  vehicleId?: string;
  from?: string;
  to?: string;
}) {
  await requireAdmin();

  const where: {
    status?: "ABERTO" | "ENCERRADO";
    vehicleId?: string;
    startedAt?: { gte?: Date; lte?: Date };
  } = {};

  if (filters?.status === "ABERTO" || filters?.status === "ENCERRADO") {
    where.status = filters.status;
  }

  if (filters?.vehicleId) {
    where.vehicleId = filters.vehicleId;
  }

  if (filters?.from || filters?.to) {
    where.startedAt = {};
    if (filters.from) {
      where.startedAt.gte = new Date(filters.from);
    }
    if (filters.to) {
      const toDate = new Date(filters.to);
      toDate.setHours(23, 59, 59, 999);
      where.startedAt.lte = toDate;
    }
  }

  return prisma.serviceReport.findMany({
    where,
    include: { vehicle: true },
    orderBy: { startedAt: "desc" },
  });
}
