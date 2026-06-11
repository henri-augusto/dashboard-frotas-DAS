"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import {
  updateVehicleStatusSchema,
  vehicleDischargeReturnSchema,
  vehicleDischargeSchema,
  vehicleSchema,
} from "@/lib/validations/vehicle";
import type { ActionState } from "./types";
import { revalidateFleetPaths } from "./revalidate";

export async function createVehicle(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const raw = {
    prefixo: formData.get("prefixo"),
    modelo: formData.get("modelo"),
    patrimonio: formData.get("patrimonio"),
    placa: formData.get("placa"),
    status: formData.get("status") || "DISPONIVEL",
  };

  const parsed = vehicleSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      message: "Verifique os campos do formulário.",
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    await prisma.vehicle.create({ data: parsed.data });
    revalidateFleetPaths();
    return { success: true, message: "Viatura cadastrada com sucesso." };
  } catch {
    return {
      success: false,
      message: "Prefixo já cadastrado ou erro ao salvar viatura.",
    };
  }
}

export async function updateVehicleStatus(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const raw = {
    vehicleId: formData.get("vehicleId"),
    status: formData.get("status"),
  };

  const parsed = updateVehicleStatusSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, message: "Dados inválidos." };
  }

  const vehicle = await prisma.vehicle.findUnique({
    where: { id: parsed.data.vehicleId },
  });

  if (!vehicle) {
    return { success: false, message: "Viatura não encontrada." };
  }

  if (parsed.data.status === "BAIXADA") {
    return {
      success: false,
      message: "Use o formulário de baixa para registrar uma viatura como baixada.",
    };
  }

  await prisma.vehicle.update({
    where: { id: parsed.data.vehicleId },
    data: { status: parsed.data.status },
  });

  revalidateFleetPaths();

  return { success: true, message: "Status atualizado." };
}

export async function dischargeVehicle(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const raw = {
    vehicleId: formData.get("vehicleId"),
    dischargedAt: formData.get("dischargedAt"),
    motivo: formData.get("motivo"),
    numeroProcesso: formData.get("numeroProcesso"),
    autorBaixa: formData.get("autorBaixa"),
    destino: formData.get("destino"),
  };

  const parsed = vehicleDischargeSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      message: "Verifique os campos do formulário de baixa.",
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const vehicle = await prisma.vehicle.findUnique({
    where: { id: parsed.data.vehicleId },
  });

  if (!vehicle) {
    return { success: false, message: "Viatura não encontrada." };
  }

  if (vehicle.status === "BAIXADA") {
    return { success: false, message: "Esta viatura já está baixada." };
  }

  try {
    await prisma.$transaction([
      prisma.vehicleDischarge.create({
        data: {
          vehicleId: vehicle.id,
          dischargedAt: parsed.data.dischargedAt,
          motivo: parsed.data.motivo,
          numeroProcesso: parsed.data.numeroProcesso,
          autorBaixa: parsed.data.autorBaixa,
          destino: parsed.data.destino,
        },
      }),
      prisma.vehicle.update({
        where: { id: vehicle.id },
        data: { status: "BAIXADA" },
      }),
    ]);

    revalidateFleetPaths();

    return { success: true, message: "Baixa registrada com sucesso." };
  } catch {
    return { success: false, message: "Erro ao registrar baixa da viatura." };
  }
}

export async function revertVehicleDischarge(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  await requireAdmin();

  const raw = {
    vehicleId: formData.get("vehicleId"),
    returnedAt: formData.get("returnedAt"),
  };

  const parsed = vehicleDischargeReturnSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      message: "Verifique os campos do retorno da baixa.",
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const vehicle = await prisma.vehicle.findUnique({
    where: { id: parsed.data.vehicleId },
  });

  if (!vehicle) {
    return { success: false, message: "Viatura não encontrada." };
  }

  if (vehicle.status !== "BAIXADA") {
    return {
      success: false,
      message: "Somente viaturas baixadas podem ter o retorno registrado.",
    };
  }

  const discharge = await prisma.vehicleDischarge.findFirst({
    where: { vehicleId: vehicle.id, returnedAt: null },
    orderBy: { dischargedAt: "desc" },
  });

  if (!discharge) {
    return {
      success: false,
      message: "Nenhum registro de baixa ativo encontrado para esta viatura.",
    };
  }

  if (parsed.data.returnedAt < discharge.dischargedAt) {
    return {
      success: false,
      message: "A data de retorno não pode ser anterior à data da baixa.",
      errors: { returnedAt: ["Data de retorno inválida"] },
    };
  }

  try {
    await prisma.$transaction([
      prisma.vehicleDischarge.update({
        where: { id: discharge.id },
        data: { returnedAt: parsed.data.returnedAt },
      }),
      prisma.vehicle.update({
        where: { id: vehicle.id },
        data: { status: "DISPONIVEL" },
      }),
    ]);

    revalidateFleetPaths();

    return {
      success: true,
      message: "Retorno da baixa registrado. Viatura disponível.",
    };
  } catch {
    return { success: false, message: "Erro ao registrar retorno da baixa." };
  }
}
