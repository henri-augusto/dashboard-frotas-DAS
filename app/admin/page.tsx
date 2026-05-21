import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getDashboardStats } from "@/lib/actions/vehicle";
import { RefreshDashboardButton } from "@/components/admin/refresh-dashboard-button";
import { Card, StatCard } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";

export default async function AdminDashboardPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const stats = await getDashboardStats();

  return (
    <section>
      <PageHeader
        title="Dashboard"
        subtitle="Visão geral da frota de viaturas"
        action={<RefreshDashboardButton />}
      />
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

      <div className="mt-6 grid gap-3 sm:gap-4 lg:grid-cols-3">
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
            <p className="mt-2 text-sm text-muted">Nenhum relatório registrado.</p>
          )}
        </Card>

        <StatCard
          label="Relatórios em aberto"
          value={stats.relatoriosAbertos}
          accent="secondary"
        />

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
    </section>
  );
}
