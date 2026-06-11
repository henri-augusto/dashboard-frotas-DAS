"use client";

import { useActionState, useEffect } from "react";
import { createVehicle } from "@/lib/actions/vehicle";
import { ACTION_INITIAL_STATE } from "@/lib/actions/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export function VehicleForm({ onSuccess }: { onSuccess?: () => void }) {
  const [state, formAction, pending] = useActionState(
    createVehicle,
    ACTION_INITIAL_STATE
  );

  useEffect(() => {
    if (state.success) onSuccess?.();
  }, [state.success, onSuccess]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.message && (
        <p
          className={`rounded-xl px-3.5 py-2 text-sm font-medium ${state.success ? "border border-[#bdd2b7] bg-[#e6efe2] text-[#385f36]" : "border border-secondary/25 bg-secondary/10 text-secondary"}`}
        >
          {state.message}
        </p>
      )}
      <Input name="prefixo" label="Prefixo" required error={state.errors?.prefixo?.[0]} />
      <Input name="modelo" label="Modelo" required error={state.errors?.modelo?.[0]} />
      <Input
        name="patrimonio"
        label="Patrimônio"
        required
        error={state.errors?.patrimonio?.[0]}
      />
      <Input name="placa" label="Placa" required error={state.errors?.placa?.[0]} />
      <Select
        name="status"
        label="Status inicial"
        options={[
          { value: "DISPONIVEL", label: "Disponível" },
          { value: "BAIXADA", label: "Baixada (inutilizável)" },
        ]}
      />
      <Button type="submit" loading={pending}>
        Cadastrar viatura
      </Button>
    </form>
  );
}
