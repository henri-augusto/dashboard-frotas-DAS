import { Suspense } from "react";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getServiceReports } from "@/lib/actions/reports";
import { getAllVehicles } from "@/lib/actions/vehicle";
import { ReportsFilter } from "@/components/admin/reports-filter";
import { PageHeader } from "@/components/layout/page-header";

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(d);
}

export default async function AdminRelatoriosPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    vehicleId?: string;
    from?: string;
    to?: string;
  }>;
}) {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const params = await searchParams;
  const [reports, vehicles] = await Promise.all([
    getServiceReports(params),
    getAllVehicles(),
  ]);

  return (
    <section>
      <PageHeader
        title="Relatórios"
        subtitle="Serviços registrados pelos usuários"
      />

      <Suspense fallback={<p className="text-muted">Carregando filtros...</p>}>
        <ReportsFilter vehicles={vehicles} />
      </Suspense>

      <div className="mt-6 grid gap-3">
        {reports.length === 0 ? (
          <p className="rounded-2xl bg-panel/70 p-5 text-muted ring-1 ring-border/70">
            Nenhum relatório encontrado.
          </p>
        ) : (
          reports.map((r) => (
            <article
              key={r.id}
              className="rounded-2xl bg-panel/85 p-4 shadow-[0_14px_40px_rgba(60,42,30,0.08)] ring-1 ring-border/70 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_55px_rgba(60,42,30,0.12)]"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-mono text-base font-semibold tracking-tight text-primary">
                  {r.vehicle.prefixo} · {r.nomeGuerra || "Sem nome de guerra"} · RE {r.reMilitar}
                </h3>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-md px-2 py-0.5 text-xs font-semibold uppercase tracking-[0.16em] ring-1 ${
                      r.status === "ABERTO"
                        ? "bg-[#e6edf3] text-[#315f7d] ring-[#bfd0dc]"
                        : "bg-[#e6efe2] text-[#385f36] ring-[#bdd2b7]"
                    }`}
                  >
                    {r.status === "ABERTO" ? "Aberto" : "Encerrado"}
                  </span>
                  {r.status === "ENCERRADO" && (
                    <a
                      href={`/servico/${r.id}/relatorio`}
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
                  <dd className="inline break-all font-mono">{r.id}</dd>
                </div>
                <div>
                  <dt className="inline font-medium text-primary">Destino: </dt>
                  <dd className="inline">{r.destino}</dd>
                </div>
                <div>
                  <dt className="inline font-medium text-primary">Missão: </dt>
                  <dd className="inline">{r.missao}</dd>
                </div>
                <div>
                  <dt className="inline font-medium text-primary">Encarregado: </dt>
                  <dd className="inline">{r.encarregado}</dd>
                </div>
                <div>
                  <dt className="inline font-medium text-primary">KM: </dt>
                  <dd className="tabular inline font-mono">
                    {r.kmInicial}
                    {r.kmFinal != null ? ` → ${r.kmFinal}` : " (em aberto)"}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="inline font-medium text-primary">Início: </dt>
                  <dd className="inline">{formatDate(r.startedAt)}</dd>
                  {r.endedAt && (
                    <>
                      {" · "}
                      <dt className="inline font-medium text-primary">Fim: </dt>
                      <dd className="inline">{formatDate(r.endedAt)}</dd>
                    </>
                  )}
                </div>
                {r.observacoes && (
                  <div className="sm:col-span-2">
                    <dt className="font-medium text-primary">Observações: </dt>
                    <dd>{r.observacoes}</dd>
                  </div>
                )}
                {r.novidades && (
                  <div className="sm:col-span-2">
                    <dt className="font-medium text-primary">Novidades: </dt>
                    <dd>{r.novidades}</dd>
                  </div>
                )}
              </dl>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
