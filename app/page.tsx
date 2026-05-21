import { getAvailableVehicles } from "@/lib/actions/service";
import { StartServiceForm } from "@/components/forms/start-service-form";
import { PageHeader } from "@/components/layout/page-header";

export default async function HomePage() {
  const vehicles = await getAvailableVehicles();

  return (
    <main id="conteudo-principal" className="mx-auto min-h-dvh max-w-xl px-4 py-8 pb-12">
      <header className="surface-noise mb-8 rounded-3xl bg-panel/80 p-6 shadow-[0_24px_70px_rgba(60,42,30,0.12)] ring-1 ring-border/70 backdrop-blur">
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-secondary">
            DAS · DTIC
          </p>
          <PageHeader
            title="Controle de viaturas"
            subtitle="Relatório de serviços para controle do apoio administrativo. Sempre encerre o relatório após a missão."
          />
        </div>
      </header>

      <StartServiceForm vehicles={vehicles} />
    </main>
  );
}
