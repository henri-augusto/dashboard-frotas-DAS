export type ActionState = {
  success: boolean;
  message: string;
  serviceId?: string;
  errors?: Record<string, string[]>;
};

export const ACTION_INITIAL_STATE: ActionState = {
  success: false,
  message: "",
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

export const SERVICE_LOOKUP_INITIAL_STATE: ServiceLookupState = {
  success: false,
  message: "",
};

export type DashboardStats = {
  total: number;
  baixadas: number;
  disponiveis: number;
  emUso: number;
  relatoriosAbertos: number;
  relatoriosEncerrados: number;
  viaturaMaisUsada: { prefixo: string; totalUsos: number } | null;
  viaturasBaixadas: { id: string; prefixo: string; diasBaixada: number }[];
};
