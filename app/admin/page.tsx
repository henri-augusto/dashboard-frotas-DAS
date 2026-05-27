import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getRecentServiceReports } from "@/lib/actions/reports";
import { getDashboardStats } from "@/lib/actions/vehicle";
import { RefreshDashboardButton } from "@/components/admin/refresh-dashboard-button";
import { ServiceReportCard } from "@/components/admin/service-report-card";
import { Card, StatCard } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";

function DashboardSection({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-xl font-semibold tracking-tight text-primary">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-1 text-sm text-muted">{subtitle}</p>
      )}
      <div className="mt-4">{children}</div>
    </div>
  );
}

export default async function AdminDashboardPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const [stats, recentReports] = await Promise.all([
    getDashboardStats(),
    getRecentServiceReports(3),
  ]);

  return (
    <section className="flex flex-col gap-10">
      <PageHeader
        title="Dashboard"
        subtitle="Visão geral da frota de viaturas"
        action={<RefreshDashboardButton />}
      />

      <DashboardSection
        title="Frota"
        subtitle="Situação atual das viaturas cadastradas"
      >
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <StatCard label="Total de viaturas" value={stats.total} />
          <StatCard
            label="Disponíveis"
            value={stats.disponiveis}
            accent="disponivel"
          />
          <StatCard label="Em uso" value={stats.emUso} accent="emUso" />
          <StatCard label="Baixadas" value={stats.baixadas} accent="baixada" />
        </div>

        <div className="mt-3 grid gap-3 sm:mt-4 sm:gap-4 lg:grid-cols-4">
          <Card className="lg:col-span-1">
          <p className="text-sm font-medium text-muted">Viaturas baixadas</p>
          {stats.viaturasBaixadas.length === 0 ? (
            <p className="mt-2 text-sm text-muted">
              Nenhuma viatura baixada no momento.
            </p>
          ) : (
            <ul className="mt-3 flex flex-col gap-2">
              {stats.viaturasBaixadas.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between rounded-xl bg-panel/60 px-3 py-2 ring-1 ring-border/60"
                >
                  <span className="font-mono text-sm font-semibold text-primary">
                    {item.prefixo}
                  </span>
                  <span className="text-sm text-muted">
                    {item.diasBaixada}{" "}
                    {item.diasBaixada === 1 ? "dia" : "dias"} baixada
                  </span>
                </li>
              ))}
            </ul>
          )}
          </Card>
        </div>
      </DashboardSection>

      <DashboardSection
        title="Relatórios de serviço"
        subtitle="Volume e destaques dos serviços registrados"
      >
        <div className="grid gap-3 sm:gap-4 lg:grid-cols-3">
          <StatCard
            label="Relatórios encerrados"
            value={stats.relatoriosEncerrados}
            accent="disponivel"
          />
          <StatCard
            label="Relatórios em aberto"
            value={stats.relatoriosAbertos}
            accent="secondary"
          />
          <Card>
            <p className="text-sm font-medium text-muted">Viatura mais usada</p>
            {stats.viaturaMaisUsada ? (
              <>
                <p className="mt-2 font-mono text-3xl font-semibold tracking-tight text-primary">
                  {stats.viaturaMaisUsada.prefixo}
                </p>
                <p className="mt-1 text-sm text-muted">
                  {stats.viaturaMaisUsada.totalUsos}{" "}
                  {stats.viaturaMaisUsada.totalUsos === 1
                    ? "relatório"
                    : "relatórios"}
                </p>
              </>
            ) : (
              <p className="mt-2 text-sm text-muted">
                Nenhum relatório registrado.
              </p>
            )}
          </Card>
        </div>
      </DashboardSection>

      <DashboardSection
        title="Atividade recente"
        subtitle="Prévia dos últimos serviços registrados"
      >
        {recentReports.length === 0 ? (
          <Card>
            <p className="text-sm text-muted">Nenhum relatório registrado.</p>
          </Card>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {recentReports.map((r) => (
              <ServiceReportCard key={r.id} report={r} variant="compact" />
            ))}
          </div>
        )}
      </DashboardSection>
    </section>
  );
}
