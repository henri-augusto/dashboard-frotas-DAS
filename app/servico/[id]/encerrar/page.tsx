import { notFound } from "next/navigation";
import { getServiceForEnd } from "@/lib/actions/service";
import { EndServiceForm } from "@/components/forms/end-service-form";
import { PageHeader } from "@/components/layout/page-header";

export default async function EncerrarServicoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const service = await getServiceForEnd(id);

  if (!service) notFound();
  if (service.status === "ENCERRADO") {
    return (
      <main id="conteudo-principal" className="mx-auto min-h-dvh max-w-xl px-4 py-8">
        <PageHeader title="Serviço encerrado" backHref="/" />
        <div className="surface-noise rounded-2xl bg-panel/90 p-6 text-center shadow-[0_18px_50px_rgba(60,42,30,0.10)] ring-1 ring-border/70">
          <p className="text-muted">Este serviço já foi finalizado.</p>
          <a
            href={`/servico/${service.id}/relatorio`}
            download
            className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-secondary px-4 py-2.5 font-semibold text-white shadow-sm shadow-secondary/20 transition duration-200 hover:bg-[#9f2c33] active:translate-y-px"
          >
            Baixar relatório em PDF
          </a>
        </div>
      </main>
    );
  }

  return (
    <main id="conteudo-principal" className="mx-auto min-h-dvh max-w-xl px-4 py-8 pb-12">
      <PageHeader
        title="Encerrar serviço"
        subtitle={`${service.nomeGuerra || "Militar"} · RE ${service.reMilitar}`}
        backHref="/"
      />
      <EndServiceForm
        serviceId={service.id}
        kmInicial={service.kmInicial}
        prefixo={service.vehicle.prefixo}
      />
    </main>
  );
}
