"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  endServiceSchema,
  serviceLookupSchema,
  startServiceSchema,
} from "@/lib/validations/service";

export type ActionState = {
  success: boolean;
  message: string;
  serviceId?: string;
  errors?: Record<string, string[]>;
};

export type OpenServiceSummary = {
  id: string;
  prefixo: string;
  destino: string;
  missao: string;
  startedAt: string;
};

export type ServiceLookupState = {
  success: boolean;
  message: string;
  reMilitar?: string;
  openServices?: OpenServiceSummary[];
  errors?: Record<string, string[]>;
};

export async function getAvailableVehicles() {
  return prisma.vehicle.findMany({
    where: { status: "DISPONIVEL" },
    orderBy: { prefixo: "asc" },
  });
}

export async function lookupOpenServicesByRe(
  _prev: ServiceLookupState,
  formData: FormData
): Promise<ServiceLookupState> {
  const raw = {
    reMilitar: formData.get("reMilitar"),
  };

  const parsed = serviceLookupSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      message: "Informe um RE válido para consultar.",
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const services = await prisma.serviceReport.findMany({
    where: {
      reMilitar: parsed.data.reMilitar,
      status: "ABERTO",
    },
    include: {
      vehicle: {
        select: { prefixo: true },
      },
    },
    orderBy: { startedAt: "desc" },
  });

  return {
    success: true,
    message:
      services.length > 0
        ? `${services.length} serviço${services.length === 1 ? "" : "s"} aberto${services.length === 1 ? "" : "s"} encontrado${services.length === 1 ? "" : "s"}.`
        : "Nenhum serviço aberto encontrado. Preencha os dados para iniciar um novo serviço.",
    reMilitar: parsed.data.reMilitar,
    openServices: services.map((service) => ({
      id: service.id,
      prefixo: service.vehicle.prefixo,
      destino: service.destino,
      missao: service.missao,
      startedAt: service.startedAt.toISOString(),
    })),
  };
}

export async function startService(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const raw = {
    reMilitar: formData.get("reMilitar"),
    nomeGuerra: formData.get("nomeGuerra"),
    vehicleId: formData.get("vehicleId"),
    kmInicial: formData.get("kmInicial"),
    destino: formData.get("destino"),
    missao: formData.get("missao"),
    encarregado: formData.get("encarregado"),
    observacoes: formData.get("observacoes") || undefined,
  };

  const parsed = startServiceSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      message: "Verifique os campos do formulário.",
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const vehicle = await prisma.vehicle.findUnique({
    where: { id: parsed.data.vehicleId },
  });

  if (!vehicle || vehicle.status !== "DISPONIVEL") {
    return {
      success: false,
      message: "Viatura indisponível. Selecione outra opção.",
    };
  }

  try {
    const service = await prisma.$transaction(async (tx) => {
      const updated = await tx.vehicle.updateMany({
        where: { id: vehicle.id, status: "DISPONIVEL" },
        data: { status: "EM_USO" },
      });

      if (updated.count === 0) {
        throw new Error("Viatura já está em uso.");
      }

      return tx.serviceReport.create({
        data: {
          reMilitar: parsed.data.reMilitar,
          nomeGuerra: parsed.data.nomeGuerra,
          vehicleId: vehicle.id,
          kmInicial: parsed.data.kmInicial,
          destino: parsed.data.destino,
          missao: parsed.data.missao,
          encarregado: parsed.data.encarregado,
          observacoes: parsed.data.observacoes,
        },
      });
    });

    revalidatePath("/");
    revalidatePath("/admin");

    return {
      success: true,
      message: "Serviço iniciado com sucesso.",
      serviceId: service.id,
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro ao iniciar serviço.";
    return { success: false, message };
  }
}

export async function endService(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const raw = {
    serviceId: formData.get("serviceId"),
    kmFinal: formData.get("kmFinal"),
    novidades: formData.get("novidades") || undefined,
  };

  const parsed = endServiceSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      message: "Verifique os campos do formulário.",
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const service = await prisma.serviceReport.findUnique({
    where: { id: parsed.data.serviceId },
    include: { vehicle: true },
  });

  if (!service || service.status !== "ABERTO") {
    return { success: false, message: "Serviço não encontrado ou já encerrado." };
  }

  if (parsed.data.kmFinal < service.kmInicial) {
    return {
      success: false,
      message: "KM final não pode ser menor que o KM inicial.",
      errors: { kmFinal: ["KM final inválido"] },
    };
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.serviceReport.update({
        where: { id: service.id },
        data: {
          kmFinal: parsed.data.kmFinal,
          novidades: parsed.data.novidades,
          status: "ENCERRADO",
          endedAt: new Date(),
        },
      });

      if (service.vehicle.status !== "BAIXADA") {
        await tx.vehicle.update({
          where: { id: service.vehicleId },
          data: { status: "DISPONIVEL" },
        });
      }
    });

    revalidatePath("/");
    revalidatePath("/admin");

    return {
      success: true,
      message: "Serviço encerrado com sucesso.",
      serviceId: service.id,
    };
  } catch {
    return { success: false, message: "Erro ao encerrar serviço." };
  }
}

export async function getServiceForEnd(id: string) {
  return prisma.serviceReport.findUnique({
    where: { id },
    include: { vehicle: true },
  });
}
