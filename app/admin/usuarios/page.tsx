import { requireAdmin } from "@/lib/auth";
import { getAllAdminUsers } from "@/lib/actions/admin-users";
import { AdminUserList } from "@/components/admin/admin-user-list";
import { CreateAdminUserForm } from "@/components/forms/create-admin-user-form";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";

export default async function AdminUsuariosPage() {
  await requireAdmin();

  const admins = await getAllAdminUsers();

  return (
    <section className="flex flex-col gap-8">
      <PageHeader
        title="Usuários"
        subtitle="Cadastro de administradores do sistema"
      />

      <div>
        <h2 className="mb-4 text-xl font-semibold tracking-tight text-primary">
          Novo administrador
        </h2>
        <Card>
          <CreateAdminUserForm />
        </Card>
      </div>

      <div>
        <h2 className="mb-4 text-xl font-semibold tracking-tight text-primary">
          Administradores cadastrados
        </h2>
        <AdminUserList admins={admins} />
      </div>
    </section>
  );
}
