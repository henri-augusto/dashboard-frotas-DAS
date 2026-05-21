import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getAllVehicles } from "@/lib/actions/vehicle";
import { CreateVehicleModal } from "@/components/admin/create-vehicle-modal";
import { VehicleList } from "@/components/admin/vehicle-list";
import { PageHeader } from "@/components/layout/page-header";

export default async function AdminViaturasPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  const vehicles = await getAllVehicles();

  return (
    <section className="flex flex-col gap-8">
      <PageHeader
        title="Viaturas"
        subtitle="Cadastro e monitoramento de status"
        action={<CreateVehicleModal />}
      />

      <div>
        <h2 className="mb-4 text-xl font-semibold tracking-tight text-primary">
          Frota cadastrada
        </h2>
        <VehicleList vehicles={vehicles} />
      </div>
    </section>
  );
}
