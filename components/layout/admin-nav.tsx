"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/viaturas", label: "Viaturas" },
  { href: "/admin/relatorios", label: "Relatórios" },
];

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-1 flex-col gap-1 px-3" aria-label="Navegação administrativa">
      {navItems.map((item) => {
        const active = isActive(pathname, item.href, item.exact);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`min-h-11 rounded-xl px-4 py-2.5 text-sm font-semibold transition duration-200 active:translate-y-px ${
              active
                ? "bg-surface text-primary"
                : "text-primary hover:bg-surface/60"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
