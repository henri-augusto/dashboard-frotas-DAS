import { ReactNode } from "react";

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`surface-noise rounded-2xl bg-panel/90 p-4 shadow-[0_18px_50px_rgba(60,42,30,0.10)] ring-1 ring-border/70 backdrop-blur sm:p-6 ${className}`}
    >
      {children}
    </div>
  );
}

const valueAccentClasses = {
  default: "text-primary",
  secondary: "text-secondary",
  disponivel: "text-[#385f36]",
  emUso: "text-[#315f7d]",
  baixada: "text-secondary",
} as const;

export function StatCard({
  label,
  value,
  accent = "default",
}: {
  label: string;
  value: number;
  accent?: keyof typeof valueAccentClasses;
}) {
  return (
    <Card>
      <p className="text-sm font-medium text-muted">{label}</p>
      <p
        className={`tabular mt-2 font-mono text-4xl font-semibold tracking-tight ${valueAccentClasses[accent]}`}
      >
        {value}
      </p>
    </Card>
  );
}
