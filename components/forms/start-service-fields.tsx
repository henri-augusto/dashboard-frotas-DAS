"use client";

import { useMemo, useState } from "react";
import type { Vehicle } from "@prisma/client";
import type { ActionState, ServiceLookupState } from "@/lib/actions/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export function StartServiceFields({
  vehicles,
  lookupState,
  state,
  formAction,
  pending,
  onReset,
}: {
  vehicles: Vehicle[];
  lookupState: ServiceLookupState;
  state: ActionState;
  formAction: (payload: FormData) => void;
  pending: boolean;
  onReset: () => void;
}) {
  const [selectedId, setSelectedId] = useState("");

  const selected = useMemo(
    () => vehicles.find((v) => v.id === selectedId),
    [vehicles, selectedId]
  );

  const vehicleOptions = [
    { value: "", label: "Selecione o prefixo" },
    ...vehicles.map((v) => ({ value: v.id, label: v.prefixo })),
  ];

  return (
    <form
      action={formAction}
      className="surface-noise rounded-2xl bg-panel/90 p-5 shadow-[0_18px_50px_rgba(60,42,30,0.10)] ring-1 ring-border/70 sm:p-6"
    >
      <div className="mb-4 rounded-xl border border-[#bdd2b7] bg-[#e6efe2] px-3.5 py-2 text-sm font-medium text-[#385f36]">
        {lookupState.message}
      </div>

      {state.message && !state.success && (
        <p className="mb-4 rounded-xl border border-secondary/25 bg-secondary/10 px-3.5 py-2 text-sm font-medium text-secondary">
          {state.message}
        </p>
      )}

      <div className="relative flex flex-col gap-4">
        <Input
          name="reMilitar"
          label="RE do Militar"
          value={lookupState.reMilitar ?? ""}
          readOnly
          className="bg-surface/70"
          required
          error={state.errors?.reMilitar?.[0]}
        />

        <Input
          name="nomeGuerra"
          label="Nome de guerra"
          placeholder="Ex: Cb Silva"
          required
          error={state.errors?.nomeGuerra?.[0]}
        />

        <Select
          name="vehicleId"
          label="Prefixo da viatura"
          options={vehicleOptions}
          required
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          error={state.errors?.vehicleId?.[0]}
        />

        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            name="modelo"
            label="Modelo"
            value={selected?.modelo ?? ""}
            readOnly
            className="bg-surface/70"
            tabIndex={-1}
          />
          <Input
            name="patrimonio"
            label="Patrimônio"
            value={selected?.patrimonio ?? ""}
            readOnly
            className="bg-surface/70"
            tabIndex={-1}
          />
          <Input
            name="placa"
            label="Placa"
            value={selected?.placa ?? ""}
            readOnly
            className="bg-surface/70"
            tabIndex={-1}
          />
        </div>

        <Input
          name="kmInicial"
          label="KM inicial"
          inputMode="numeric"
          pattern="\d{6}"
          maxLength={6}
          required
          error={state.errors?.kmInicial?.[0]}
        />
        <Input
          name="destino"
          label="Destino"
          placeholder="DPC/DCI"
          required
          error={state.errors?.destino?.[0]}
        />
        <Input
          name="missao"
          label="Missão"
          placeholder="Ex: Entrega de documentação ao P1 / Retirada de materiais no P4"
          required
          error={state.errors?.missao?.[0]}
        />
        <Input
          name="encarregado"
          label="Encarregado"
          required
          error={state.errors?.encarregado?.[0]}
        />
        <Textarea
          name="observacoes"
          label="Observações"
          placeholder="Ex: Viatura com 1/2 tanque de combustível; Viatura sem a tampa do reservatório do líquido de arrefecimento."
        />

        <Button type="submit" fullWidth loading={pending}>
          Iniciar serviço
        </Button>

        <button
          type="button"
          onClick={onReset}
          className="text-center text-sm font-semibold text-muted transition-colors hover:text-primary"
        >
          Consultar outro RE
        </button>
      </div>
    </form>
  );
}
