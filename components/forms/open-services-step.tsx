import Link from "next/link";
import type { ServiceLookupState } from "@/lib/actions/types";
import { formatReportDateFromIso } from "@/lib/utils/date";

export function OpenServicesStep({
  lookupState,
  onReset,
}: {
  lookupState: ServiceLookupState;
  onReset: () => void;
}) {
  const openServices = lookupState.openServices ?? [];

  return (
    <div className="surface-noise rounded-2xl bg-panel/90 p-5 shadow-[0_18px_50px_rgba(60,42,30,0.10)] ring-1 ring-border/70 sm:p-6">
      <p className="text-xl font-semibold tracking-tight text-primary">
        {lookupState.message}
      </p>
      <p className="mt-2 text-sm text-muted">
        RE {lookupState.reMilitar}. Selecione o serviço para encerrar.
      </p>

      <div className="mt-5 grid gap-3">
        {openServices.map((service) => (
          <Link
            key={service.id}
            href={`/servico/${service.id}/encerrar`}
            className="block rounded-xl border border-border bg-surface/80 p-4 text-left transition duration-200 hover:border-primary/40 hover:bg-panel active:translate-y-px"
          >
            <span className="font-mono text-sm font-semibold text-primary">
              {service.prefixo} · {formatReportDateFromIso(service.startedAt)}
            </span>
            <span className="mt-2 block text-sm text-muted">
              {service.destino} · {service.missao}
            </span>
            <span className="mt-3 inline-flex text-sm font-semibold text-secondary">
              Encerrar serviço
            </span>
          </Link>
        ))}
      </div>

      <button
        type="button"
        onClick={onReset}
        className="mt-5 block w-full text-center text-sm font-semibold text-muted transition-colors hover:text-primary"
      >
        Consultar outro RE
      </button>
    </div>
  );
}
