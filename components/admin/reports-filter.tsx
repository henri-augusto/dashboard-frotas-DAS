"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { Vehicle } from "@prisma/client";

export function ReportsFilter({ vehicles }: { vehicles: Vehicle[] }) {
  const router = useRouter();
  const params = useSearchParams();

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    router.push(`/admin/relatorios?${next.toString()}`);
  }

  return (
    <div className="surface-noise grid gap-3 rounded-2xl bg-panel/85 p-4 shadow-[0_14px_40px_rgba(60,42,30,0.08)] ring-1 ring-border/70 sm:grid-cols-2 lg:grid-cols-4">
      <label className="relative flex flex-col gap-1.5 text-sm">
        <span className="font-semibold text-ink-soft">Status</span>
        <select
          className="min-h-11 rounded-xl border border-border bg-panel/85 px-3.5 font-medium text-primary transition duration-200 focus:border-primary/50"
          defaultValue={params.get("status") ?? ""}
          onChange={(e) => update("status", e.target.value)}
        >
          <option value="">Todos</option>
          <option value="ABERTO">Aberto</option>
          <option value="ENCERRADO">Encerrado</option>
        </select>
      </label>
      <label className="relative flex flex-col gap-1.5 text-sm">
        <span className="font-semibold text-ink-soft">Viatura</span>
        <select
          className="min-h-11 rounded-xl border border-border bg-panel/85 px-3.5 font-medium text-primary transition duration-200 focus:border-primary/50"
          defaultValue={params.get("vehicleId") ?? ""}
          onChange={(e) => update("vehicleId", e.target.value)}
        >
          <option value="">Todas</option>
          {vehicles.map((v) => (
            <option key={v.id} value={v.id}>
              {v.prefixo}
            </option>
          ))}
        </select>
      </label>
      <label className="relative flex flex-col gap-1.5 text-sm">
        <span className="font-semibold text-ink-soft">De</span>
        <input
          type="date"
          className="min-h-11 rounded-xl border border-border bg-panel/85 px-3.5 font-medium text-primary transition duration-200 focus:border-primary/50"
          defaultValue={params.get("from") ?? ""}
          onChange={(e) => update("from", e.target.value)}
        />
      </label>
      <label className="relative flex flex-col gap-1.5 text-sm">
        <span className="font-semibold text-ink-soft">Até</span>
        <input
          type="date"
          className="min-h-11 rounded-xl border border-border bg-panel/85 px-3.5 font-medium text-primary transition duration-200 focus:border-primary/50"
          defaultValue={params.get("to") ?? ""}
          onChange={(e) => update("to", e.target.value)}
        />
      </label>
    </div>
  );
}
