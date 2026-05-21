import Link from "next/link";
import { logoutAdmin } from "@/lib/actions/auth";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/viaturas", label: "Viaturas" },
  { href: "/admin/relatorios", label: "Relatórios" },
];

export function AdminShell({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh">
      <header className="border-b border-border/70 bg-panel/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-secondary">
              DAS · DTIC
            </p>
            <h1 className="mt-1 text-xl font-semibold tracking-tight text-primary">
              Painel Administrativo
            </h1>
            <p className="font-mono text-xs text-muted">Bem vindo administrador</p>
          </div>
          <form action={logoutAdmin}>
            <button
              type="submit"
              className="min-h-11 cursor-pointer rounded-xl border border-border bg-surface/70 px-4 py-2 text-sm font-semibold text-primary transition duration-200 hover:border-primary/30 hover:bg-panel active:translate-y-px"
            >
              Sair
            </button>
          </form>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-4 pb-4 sm:px-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="min-h-11 shrink-0 rounded-xl px-4 py-2 text-sm font-semibold text-primary transition duration-200 hover:bg-surface active:translate-y-px"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main id="conteudo-principal" className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        {children}
      </main>
    </div>
  );
}
