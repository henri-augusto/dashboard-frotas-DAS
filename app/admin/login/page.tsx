import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { LoginForm } from "@/components/forms/login-form";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";

export default async function AdminLoginPage() {
  const admin = await getAdminSession();
  if (admin) redirect("/admin");

  return (
    <main id="conteudo-principal" className="flex min-h-dvh items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-secondary">
            DAS · DTIC
          </p>
          <PageHeader
            title="Acesso administrativo"
            subtitle="Entre para gerenciar frota, status e relatórios de serviço."
          />
        </div>
        <Card className="p-5 sm:p-7">
          <LoginForm />
        </Card>
        <Link
          href="/"
          className="mt-5 block text-center text-sm font-semibold text-muted transition-colors hover:text-primary"
        >
          Voltar ao formulário do usuário
        </Link>
      </div>
    </main>
  );
}
