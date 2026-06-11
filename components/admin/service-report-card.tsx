import Link from "next/link";
import type { ServiceReport, Vehicle } from "@prisma/client";
import {
  SERVICE_STATUS_COLORS,
  SERVICE_STATUS_LABELS,
} from "@/lib/constants/vehicle-status";
import { formatReportDate } from "@/lib/utils/date";

type ReportWithVehicle = ServiceReport & { vehicle: Vehicle };

function StatusBadge({ status }: { status: ServiceReport["status"] }) {
  return (
    <span
      className={`rounded-md px-2 py-0.5 text-xs font-semibold uppercase tracking-[0.16em] ring-1 ${SERVICE_STATUS_COLORS[status]}`}
    >
      {SERVICE_STATUS_LABELS[status]}
    </span>
  );
}

function motoristaLabel(report: ReportWithVehicle) {
  const nome = report.nomeGuerra || "Sem nome de guerra";
  return `${nome} · RE ${report.reMilitar}`;
}

export function ServiceReportCard({
  report,
  variant = "full",
}: {
  report: ReportWithVehicle;
  variant?: "full" | "compact";
}) {
  if (variant === "compact") {
    return (
      <Link
        href="/admin/relatorios"
        className="block rounded-xl bg-panel/60 p-3 ring-1 ring-border/60 transition duration-200 hover:-translate-y-0.5 hover:bg-panel/90 hover:shadow-[0_12px_32px_rgba(60,42,30,0.10)] hover:ring-primary/25 active:translate-y-0"
      >
        <div className="mb-2 flex justify-end">
          <StatusBadge status={report.status} />
        </div>
        <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
          <div>
            <dt className="font-medium text-muted">Viatura</dt>
            <dd className="mt-0.5 font-mono font-semibold text-primary">
              {report.vehicle.prefixo}
            </dd>
          </div>
          <div>
            <dt className="font-medium text-muted">Início</dt>
            <dd className="tabular mt-0.5 text-primary">
              {formatReportDate(report.startedAt)}
            </dd>
          </div>
          <div className="col-span-2">
            <dt className="font-medium text-muted">Motorista</dt>
            <dd className="mt-0.5 text-primary">{motoristaLabel(report)}</dd>
          </div>
          <div className="col-span-2">
            <dt className="font-medium text-muted">Destino</dt>
            <dd className="mt-0.5 text-primary">{report.destino}</dd>
          </div>
        </dl>
      </Link>
    );
  }

  return (
    <article className="rounded-2xl bg-panel/85 p-4 shadow-[0_14px_40px_rgba(60,42,30,0.08)] ring-1 ring-border/70 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_55px_rgba(60,42,30,0.12)]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-mono text-base font-semibold tracking-tight text-primary">
          {report.vehicle.prefixo} · {report.nomeGuerra || "Sem nome de guerra"}{" "}
          · RE {report.reMilitar}
        </h3>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={report.status} />
          {report.status === "ENCERRADO" && (
            <a
              href={`/servico/${report.id}/relatorio`}
              download
              className="inline-flex min-h-9 items-center justify-center rounded-xl bg-secondary px-3 py-2 text-sm font-semibold text-white shadow-sm shadow-secondary/20 transition duration-200 hover:bg-[#9f2c33] active:translate-y-px"
            >
              Baixar PDF
            </a>
          )}
        </div>
      </div>
      <dl className="mt-4 grid gap-2 text-sm text-muted sm:grid-cols-2">
        <div className="sm:col-span-2">
          <dt className="inline font-medium text-primary">ServiceID: </dt>
          <dd className="inline break-all font-mono">{report.id}</dd>
        </div>
        <div>
          <dt className="inline font-medium text-primary">Destino: </dt>
          <dd className="inline">{report.destino}</dd>
        </div>
        <div>
          <dt className="inline font-medium text-primary">Missão: </dt>
          <dd className="inline">{report.missao}</dd>
        </div>
        <div>
          <dt className="inline font-medium text-primary">Encarregado: </dt>
          <dd className="inline">{report.encarregado}</dd>
        </div>
        <div>
          <dt className="inline font-medium text-primary">KM: </dt>
          <dd className="tabular inline font-mono">
            {report.kmInicial}
            {report.kmFinal != null ? ` → ${report.kmFinal}` : " (em aberto)"}
          </dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="inline font-medium text-primary">Início: </dt>
          <dd className="inline">{formatReportDate(report.startedAt)}</dd>
          {report.endedAt && (
            <>
              {" · "}
              <dt className="inline font-medium text-primary">Fim: </dt>
              <dd className="inline">{formatReportDate(report.endedAt)}</dd>
            </>
          )}
        </div>
        {report.observacoes && (
          <div className="sm:col-span-2">
            <dt className="font-medium text-primary">Observações: </dt>
            <dd>{report.observacoes}</dd>
          </div>
        )}
        {report.novidades && (
          <div className="sm:col-span-2">
            <dt className="font-medium text-primary">Novidades: </dt>
            <dd>{report.novidades}</dd>
          </div>
        )}
      </dl>
    </article>
  );
}
