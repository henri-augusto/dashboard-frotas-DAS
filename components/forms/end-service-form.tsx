"use client";

import { useActionState } from "react";
import Link from "next/link";
import { endService, type ActionState } from "@/lib/actions/service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const initialState: ActionState = { success: false, message: "" };

export function EndServiceForm({
  serviceId,
  kmInicial,
  prefixo,
}: {
  serviceId: string;
  kmInicial: number;
  prefixo: string;
}) {
  const [state, formAction, pending] = useActionState(endService, initialState);

  if (state.success) {
    const reportHref = state.serviceId
      ? `/servico/${state.serviceId}/relatorio`
      : null;

    return (
      <div className="surface-noise rounded-2xl bg-panel/90 p-6 text-center shadow-[0_18px_50px_rgba(60,42,30,0.10)] ring-1 ring-border/70">
        <p className="text-xl font-semibold tracking-tight text-primary">Serviço encerrado</p>
        <p className="mt-2 text-muted">{state.message}</p>
        <div className="mt-6 flex flex-col gap-3">
          {reportHref && (
            <a
              href={reportHref}
              download
              className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-secondary px-4 py-2.5 font-semibold text-white shadow-sm shadow-secondary/20 transition duration-200 hover:bg-[#9f2c33] active:translate-y-px"
            >
              Baixar relatório em PDF
            </a>
          )}
          <Link
            href="/"
            className="inline-flex min-h-11 w-full items-center justify-center rounded-xl border border-border bg-surface/70 px-4 py-2.5 font-semibold text-primary transition duration-200 hover:border-primary/30 hover:bg-panel active:translate-y-px"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="surface-noise rounded-2xl bg-panel/90 p-5 shadow-[0_18px_50px_rgba(60,42,30,0.10)] ring-1 ring-border/70 sm:p-6">
      <input type="hidden" name="serviceId" value={serviceId} />

      <div className="relative mb-4 rounded-xl border border-border/80 bg-surface/80 px-3.5 py-3 text-sm shadow-inner shadow-primary/[0.03]">
        <p>
          <span className="text-muted">Viatura:</span> {prefixo}
        </p>
        <p className="tabular font-mono">
          <span className="text-muted">KM inicial:</span> {kmInicial}
        </p>
      </div>

      {state.message && !state.success && (
        <p className="relative mb-4 rounded-xl border border-secondary/25 bg-secondary/10 px-3.5 py-2 text-sm font-medium text-secondary">
          {state.message}
        </p>
      )}

      <div className="relative flex flex-col gap-4">
        <Input
          name="kmFinal"
          label="KM final"
          type="number"
          min={kmInicial}
          required
          error={state.errors?.kmFinal?.[0]}
        />
        <Textarea
          name="novidades"
          label="Novidades"
          placeholder="Ocorrências, observações finais..."
        />

        <Button type="submit" variant="secondary" fullWidth loading={pending}>
          Encerrar serviço
        </Button>
      </div>
    </form>
  );
}
