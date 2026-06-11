import type { Vehicle } from "@prisma/client";
import type { ServiceReport } from "@prisma/client";

export const VEHICLE_STATUS_LABELS: Record<Vehicle["status"], string> = {
  DISPONIVEL: "Disponível",
  EM_USO: "Em uso",
  BAIXADA: "Baixada",
};

export const VEHICLE_STATUS_COLORS: Record<Vehicle["status"], string> = {
  DISPONIVEL: "bg-[#e6efe2] text-[#385f36] ring-[#bdd2b7]",
  EM_USO: "bg-[#e6edf3] text-[#315f7d] ring-[#bfd0dc]",
  BAIXADA: "bg-secondary/10 text-secondary ring-secondary/20",
};

export const SERVICE_STATUS_LABELS: Record<ServiceReport["status"], string> = {
  ABERTO: "Aberto",
  ENCERRADO: "Encerrado",
};

export const SERVICE_STATUS_COLORS: Record<ServiceReport["status"], string> = {
  ABERTO: "bg-[#e6edf3] text-[#315f7d] ring-[#bfd0dc]",
  ENCERRADO: "bg-[#e6efe2] text-[#385f36] ring-[#bdd2b7]",
};

export const VEHICLE_STATUS_OPTIONS = [
  { value: "DISPONIVEL", label: VEHICLE_STATUS_LABELS.DISPONIVEL },
  { value: "EM_USO", label: VEHICLE_STATUS_LABELS.EM_USO },
  { value: "BAIXADA", label: VEHICLE_STATUS_LABELS.BAIXADA },
] as const;
