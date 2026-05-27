import { logoutAdmin } from "@/lib/actions/auth";
import { AdminNav } from "@/components/layout/admin-nav";

export function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh">
      <aside
        className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border/70 bg-panel/95 backdrop-blur-xl"
        aria-label="Painel administrativo"
      >
        <div className="border-b border-border/70 px-5 py-6">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-secondary">
            DAS · DTIC
          </p>
          <h1 className="mt-1 text-lg font-semibold tracking-tight text-primary">
            Painel Administrativo
          </h1>
          <p className="mt-1 font-mono text-xs text-muted">
            Bem vindo administrador
          </p>
        </div>

        <div className="flex flex-1 flex-col py-4">
          <AdminNav />
        </div>

        <div className="border-t border-border/70 p-4">
          <form action={logoutAdmin}>
            <button
              type="submit"
              className="min-h-11 w-full cursor-pointer rounded-xl border border-border bg-surface/70 px-4 py-2 text-sm font-semibold text-primary transition duration-200 hover:border-primary/30 hover:bg-panel active:translate-y-px"
            >
              Sair
            </button>
          </form>
        </div>
      </aside>

      <main
        id="conteudo-principal"
        className="min-h-dvh pl-64"
      >
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
