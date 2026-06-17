import { z } from "zod";

export const vehicleSchema = z.object({
  prefixo: z.string().min(1, "Informe o prefixo"),
  modelo: z.string().min(1, "Informe o modelo"),
  patrimonio: z.string().min(1, "Informe o patrimônio"),
  placa: z.string().min(7, "Informe a placa"),
  status: z.enum(["DISPONIVEL", "EM_USO", "BAIXADA"]).default("DISPONIVEL"),
});

export const updateVehicleSchema = z.object({
  vehicleId: z.string().min(1),
  prefixo: z.string().min(1, "Informe o prefixo"),
  modelo: z.string().min(1, "Informe o modelo"),
  patrimonio: z.string().min(1, "Informe o patrimônio"),
  placa: z.string().min(7, "Informe a placa"),
});

export const updateVehicleStatusSchema = z.object({
  vehicleId: z.string().min(1),
  status: z.enum(["DISPONIVEL", "EM_USO", "BAIXADA"]),
});

export const vehicleDischargeSchema = z.object({
  vehicleId: z.string().min(1),
  dischargedAt: z.coerce.date({ invalid_type_error: "Informe a data da baixa" }),
  motivo: z.string().min(1, "Informe o motivo"),
  numeroProcesso: z.string().min(1, "Informe o número do processo"),
  autorBaixa: z.string().min(1, "Informe o autor da baixa"),
  destino: z.string().min(1, "Informe o destino"),
});

export const vehicleDischargeReturnSchema = z.object({
  vehicleId: z.string().min(1),
  returnedAt: z.coerce.date({
    invalid_type_error: "Informe a data de retorno da baixa",
  }),
});

export type VehicleInput = z.infer<typeof vehicleSchema>;
export type VehicleDischargeInput = z.infer<typeof vehicleDischargeSchema>;
export type VehicleDischargeReturnInput = z.infer<typeof vehicleDischargeReturnSchema>;
