import { requireAdmin } from "@/lib/auth";
import { getAllVehicles } from "@/lib/actions/vehicle";
import { CreateVehicleModal } from "@/components/admin/create-vehicle-modal";
import { VehicleList } from "@/components/admin/vehicle-list";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/ui/card";
import type { Vehicle } from "@prisma/client";

function countByStatus(vehicles: Vehicle[], status: Vehicle["status"]) {
  return vehicles.filter((vehicle) => vehicle.status === status).length;
}

export default async function AdminViaturasPage() {
  await requireAdmin();

  const vehicles = await getAllVehicles();
  const total = vehicles.length;
  const disponiveis = countByStatus(vehicles, "DISPONIVEL");
  const emUso = countByStatus(vehicles, "EM_USO");
  const baixadas = countByStatus(vehicles, "BAIXADA");

  return (
    <section className="flex flex-col gap-10">
      <PageHeader
        title="Viaturas"
        subtitle="Cadastro, edição e monitoramento de status da frota"
        action={<CreateVehicleModal />}
      />

      <div>
        <h2 className="text-xl font-semibold tracking-tight text-primary">
          Resumo da frota
        </h2>
        <p className="mt-1 text-sm text-muted">
          Situação atual das {total} viaturas cadastradas
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <StatCard label="Total" value={total} />
          <StatCard label="Disponíveis" value={disponiveis} accent="disponivel" />
          <StatCard label="Em uso" value={emUso} accent="emUso" />
          <StatCard label="Baixadas" value={baixadas} accent="baixada" />
        </div>
      </div>

      <div>
        <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-primary">
              Frota cadastrada
            </h2>
            <p className="mt-1 text-sm text-muted">
              {total === 0
                ? "Nenhuma viatura registrada até o momento"
                : `${total} ${total === 1 ? "viatura listada" : "viaturas listadas"} em ordem alfabética`}
            </p>
          </div>
        </div>
        <VehicleList vehicles={vehicles} />
      </div>
    </section>
  );
}
