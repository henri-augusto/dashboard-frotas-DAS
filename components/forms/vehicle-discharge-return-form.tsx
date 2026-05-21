"use client";

import { useActionState, useEffect } from "react";
import type { Vehicle } from "@prisma/client";
import { revertVehicleDischarge } from "@/lib/actions/vehicle";
import type { ActionState } from "@/lib/actions/service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const initialState: ActionState = { success: false, message: "" };

function todayInputValue() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const local = new Date(now.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 10);
}

export function VehicleDischargeReturnForm({
  vehicle,
  onSuccess,
  onCancel,
}: {
  vehicle: Vehicle;
  onSuccess?: () => void;
  onCancel: () => void;
}) {
  const [state, formAction, pending] = useActionState(
    revertVehicleDischarge,
    initialState
  );

  useEffect(() => {
    if (state.success) onSuccess?.();
  }, [state.success, onSuccess]);

  if (state.success) {
    return (
      <div className="rounded-xl border border-[#bdd2b7] bg-[#e6efe2] px-3.5 py-3 text-sm font-medium text-[#385f36]">
        {state.message}
      </div>
    );
  }

  return (
    <form action={formAction} className="flex min-h-0 flex-col">
      <input type="hidden" name="vehicleId" value={vehicle.id} />

      <div className="flex flex-col gap-4">
        <div className="rounded-xl border border-border/80 bg-surface/80 px-3.5 py-3 text-sm">
          <p>
            <span className="text-muted">Viatura:</span>{" "}
            <span className="font-mono font-semibold text-primary">{vehicle.prefixo}</span>
          </p>
          <p className="mt-1 text-muted">
            {vehicle.modelo} · {vehicle.patrimonio} · {vehicle.placa}
          </p>
        </div>

        {state.message && (
          <p className="rounded-xl border border-secondary/25 bg-secondary/10 px-3.5 py-2 text-sm font-medium text-secondary">
            {state.message}
          </p>
        )}

        <p className="text-sm text-muted">
          A viatura voltará ao status <strong className="text-primary">Disponível</strong> após
          confirmar o retorno da baixa.
        </p>

        <Input
          name="returnedAt"
          label="Data de retorno da baixa"
          type="date"
          defaultValue={todayInputValue()}
          required
          error={state.errors?.returnedAt?.[0]}
        />
      </div>

      <div className="sticky bottom-0 -mx-5 mt-4 flex flex-col gap-2 border-t border-border/60 bg-panel/95 px-5 py-4 sm:-mx-6 sm:flex-row sm:px-6">
        <Button type="submit" fullWidth loading={pending}>
          Confirmar retorno
        </Button>
        <Button type="button" variant="ghost" fullWidth onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
