import { z } from "zod";

export const serviceLookupSchema = z.object({
  reMilitar: z
    .string()
    .regex(/^\d{6}$/, "RE deve conter exatamente 6 números"),
});

export const startServiceSchema = z.object({
  reMilitar: z
    .string()
    .regex(/^\d{6}$/, "RE deve conter exatamente 6 números"),
  nomeGuerra: z.string().trim().min(2, "Informe o nome de guerra"),
  vehicleId: z.string().min(1, "Selecione uma viatura"),
  kmInicial: z.coerce
    .number()
    .int("KM inicial deve ser um número inteiro")
    .min(0, "KM inicial inválido"),
  destino: z.string().min(2, "Informe o destino"),
  missao: z.string().min(2, "Informe a missão"),
  encarregado: z.string().min(2, "Informe o encarregado"),
  observacoes: z.string().optional(),
});

export const endServiceSchema = z.object({
  serviceId: z.string().min(1),
  kmFinal: z.coerce
    .number()
    .int("KM final deve ser um número inteiro")
    .min(0, "KM final inválido"),
  novidades: z.string().optional(),
});

export type ServiceLookupInput = z.infer<typeof serviceLookupSchema>;
export type StartServiceInput = z.infer<typeof startServiceSchema>;
export type EndServiceInput = z.infer<typeof endServiceSchema>;
