import { Suspense } from "react";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getServiceReports } from "@/lib/actions/reports";
import { getAllVehicles } from "@/lib/actions/vehicle";
import { ReportsFilter } from "@/components/admin/reports-filter";
import { ServiceReportCard } from "@/components/admin/service-report-card";
import { PageHeader } from "@/components/layout/page-header";

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
          reports.map((r) => <ServiceReportCard key={r.id} report={r} />)
        )}
      </div>
    </section>
  );
}
