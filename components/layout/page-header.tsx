import Link from "next/link";
import { ReactNode } from "react";

export function PageHeader({
  title,
  subtitle,
  backHref,
  action,
}: {
  title: string;
  subtitle?: string;
  backHref?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-7">
      {backHref && (
        <Link
          href={backHref}
          className="mb-4 inline-flex min-h-11 items-center text-sm font-semibold text-muted transition-colors hover:text-secondary"
        >
          ← Voltar
        </Link>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="max-w-xl text-3xl font-semibold leading-[1.05] tracking-[-0.035em] text-primary text-balance sm:text-4xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 max-w-prose text-base leading-7 text-muted text-pretty">
              {subtitle}
            </p>
          )}
        </div>
        {action}
      </div>
    </div>
  );
}
