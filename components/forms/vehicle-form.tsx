"use client";

import { useActionState, useEffect } from "react";
import type { Vehicle } from "@prisma/client";
import { createVehicle, updateVehicle } from "@/lib/actions/vehicle";
import { ACTION_INITIAL_STATE } from "@/lib/actions/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

type VehicleFormProps = {
  vehicle?: Vehicle;
  onSuccess?: () => void;
};

export function VehicleForm({ vehicle, onSuccess }: VehicleFormProps) {
  const isEdit = Boolean(vehicle);
  const [state, formAction, pending] = useActionState(
    isEdit ? updateVehicle : createVehicle,
    ACTION_INITIAL_STATE
  );

  useEffect(() => {
    if (state.success) onSuccess?.();
  }, [state.success, onSuccess]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {isEdit && <input type="hidden" name="vehicleId" value={vehicle!.id} />}
      {state.message && (
        <p
          className={`rounded-xl px-3.5 py-2 text-sm font-medium ${state.success ? "border border-[#bdd2b7] bg-[#e6efe2] text-[#385f36]" : "border border-secondary/25 bg-secondary/10 text-secondary"}`}
        >
          {state.message}
        </p>
      )}
      <Input
        name="prefixo"
        label="Prefixo"
        required
        defaultValue={vehicle?.prefixo}
        error={state.errors?.prefixo?.[0]}
      />
      <Input
        name="modelo"
        label="Modelo"
        required
        defaultValue={vehicle?.modelo}
        error={state.errors?.modelo?.[0]}
      />
      <Input
        name="patrimonio"
        label="Patrimônio"
        required
        defaultValue={vehicle?.patrimonio}
        error={state.errors?.patrimonio?.[0]}
      />
      <Input
        name="placa"
        label="Placa"
        required
        defaultValue={vehicle?.placa}
        error={state.errors?.placa?.[0]}
      />
      {!isEdit && (
        <Select
          name="status"
          label="Status inicial"
          options={[
            { value: "DISPONIVEL", label: "Disponível" },
            { value: "BAIXADA", label: "Baixada (inutilizável)" },
          ]}
        />
      )}
      <Button type="submit" loading={pending}>
        {isEdit ? "Salvar alterações" : "Cadastrar viatura"}
      </Button>
    </form>
  );
}
