"use client";

import { useActionState, useEffect } from "react";
import type { Vehicle } from "@prisma/client";
import { dischargeVehicle } from "@/lib/actions/vehicle";
import { ACTION_INITIAL_STATE } from "@/lib/actions/types";
import { todayInputValue } from "@/lib/utils/date";
import { FormSuccessAlert } from "@/components/forms/form-success-alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function VehicleDischargeForm({
  vehicle,
  onSuccess,
  onCancel,
}: {
  vehicle: Vehicle;
  onSuccess?: () => void;
  onCancel: () => void;
}) {
  const [state, formAction, pending] = useActionState(
    dischargeVehicle,
    ACTION_INITIAL_STATE
  );

  useEffect(() => {
    if (state.success) onSuccess?.();
  }, [state.success, onSuccess]);

  if (state.success) {
    return <FormSuccessAlert message={state.message} />;
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

        <Input
          name="dischargedAt"
          label="Data da baixa"
          type="date"
          defaultValue={todayInputValue()}
          required
          error={state.errors?.dischargedAt?.[0]}
        />
        <Textarea
          name="motivo"
          label="Motivo"
          placeholder="Descreva o motivo da baixa"
          required
          error={state.errors?.motivo?.[0]}
        />
        <Input
          name="numeroProcesso"
          label="Número do processo"
          required
          error={state.errors?.numeroProcesso?.[0]}
        />
        <Input
          name="autorBaixa"
          label="Autor da baixa"
          required
          error={state.errors?.autorBaixa?.[0]}
        />
        <Input
          name="destino"
          label="Destino"
          required
          error={state.errors?.destino?.[0]}
        />
      </div>

      <div className="sticky bottom-0 -mx-5 mt-4 flex flex-col gap-2 border-t border-border/60 bg-panel/95 px-5 py-4 sm:-mx-6 sm:flex-row sm:px-6">
        <Button type="submit" variant="secondary" fullWidth loading={pending}>
          Confirmar baixa
        </Button>
        <Button type="button" variant="ghost" fullWidth onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
