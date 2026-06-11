import type { ServiceLookupState } from "@/lib/actions/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ServiceRelookupStep({
  lookupAction,
  lookupState,
  lookupPending,
}: {
  lookupAction: (payload: FormData) => void;
  lookupState: ServiceLookupState;
  lookupPending: boolean;
}) {
  return (
    <form
      action={lookupAction}
      className="surface-noise rounded-2xl bg-panel/90 p-5 shadow-[0_18px_50px_rgba(60,42,30,0.10)] ring-1 ring-border/70 sm:p-6"
    >
      <div className="relative flex flex-col gap-4">
        <Input
          name="reMilitar"
          label="RE do Militar"
          placeholder="000000"
          inputMode="numeric"
          pattern="\d{6}"
          maxLength={6}
          required
          error={lookupState.errors?.reMilitar?.[0]}
        />
        {lookupState.message && (
          <p className="rounded-xl border border-secondary/25 bg-secondary/10 px-3.5 py-2 text-sm font-medium text-secondary">
            {lookupState.message}
          </p>
        )}
        <Button type="submit" fullWidth loading={lookupPending}>
          Verificar
        </Button>

        <p className="text-center text-xs font-medium text-muted">
          Verifique se não há serviços em aberto no seu RE.
        </p>
      </div>
    </form>
  );
}
