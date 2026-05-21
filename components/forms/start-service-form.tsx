"use client";

import { useActionState, useMemo, useState } from "react";
import Link from "next/link";
import type { Vehicle } from "@prisma/client";
import {
  lookupOpenServicesByRe,
  startService,
  type ActionState,
  type ServiceLookupState,
} from "@/lib/actions/service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const initialState: ActionState = { success: false, message: "" };
const initialLookupState: ServiceLookupState = { success: false, message: "" };

function formatStartedAt(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export function StartServiceForm({ vehicles }: { vehicles: Vehicle[] }) {
  const [formKey, setFormKey] = useState(0);

  return (
    <StartServiceFormContent
      key={formKey}
      vehicles={vehicles}
      onReset={() => setFormKey((current) => current + 1)}
    />
  );
}

function StartServiceFormContent({
  vehicles,
  onReset,
}: {
  vehicles: Vehicle[];
  onReset: () => void;
}) {
  const [lookupState, lookupAction, lookupPending] = useActionState(
    lookupOpenServicesByRe,
    initialLookupState
  );
  const [state, formAction, pending] = useActionState(startService, initialState);
  const [selectedId, setSelectedId] = useState("");

  const selected = useMemo(
    () => vehicles.find((v) => v.id === selectedId),
    [vehicles, selectedId]
  );

  const vehicleOptions = [
    { value: "", label: "Selecione o prefixo" },
    ...vehicles.map((v) => ({ value: v.id, label: v.prefixo })),
  ];

  if (state.success && state.serviceId) {
    return (
      <div className="surface-noise rounded-2xl bg-panel/90 p-6 text-center shadow-[0_18px_50px_rgba(60,42,30,0.10)] ring-1 ring-border/70">
        <p className="text-xl font-semibold tracking-tight text-primary">Serviço iniciado</p>
        <p className="mt-2 text-muted">{state.message}</p>
        <Link
          href={`/servico/${state.serviceId}/encerrar`}
          className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-secondary px-4 py-2.5 font-semibold text-white shadow-sm shadow-secondary/20 transition duration-200 hover:bg-[#9f2c33] active:translate-y-px sm:w-auto"
        >
          Encerrar serviço
        </Link>
        <button
          type="button"
          onClick={onReset}
          className="mt-3 block w-full text-sm font-semibold text-muted transition-colors hover:text-primary"
        >
          Iniciar outro serviço
        </button>
      </div>
    );
  }

  if (!lookupState.success) {
    return (
      <form action={lookupAction} className="surface-noise rounded-2xl bg-panel/90 p-5 shadow-[0_18px_50px_rgba(60,42,30,0.10)] ring-1 ring-border/70 sm:p-6">
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

  const openServices = lookupState.openServices ?? [];

  if (openServices.length > 0) {
    return (
      <div className="surface-noise rounded-2xl bg-panel/90 p-5 shadow-[0_18px_50px_rgba(60,42,30,0.10)] ring-1 ring-border/70 sm:p-6">
        <p className="text-xl font-semibold tracking-tight text-primary">
          {lookupState.message}
        </p>
        <p className="mt-2 text-sm text-muted">
          RE {lookupState.reMilitar}. Selecione o serviço para encerrar.
        </p>

        <div className="mt-5 grid gap-3">
          {openServices.map((service) => (
            <Link
              key={service.id}
              href={`/servico/${service.id}/encerrar`}
              className="block rounded-xl border border-border bg-surface/80 p-4 text-left transition duration-200 hover:border-primary/40 hover:bg-panel active:translate-y-px"
            >
              <span className="font-mono text-sm font-semibold text-primary">
                {service.prefixo} · {formatStartedAt(service.startedAt)}
              </span>
              <span className="mt-2 block text-sm text-muted">
                {service.destino} · {service.missao}
              </span>
              <span className="mt-3 inline-flex text-sm font-semibold text-secondary">
                Encerrar serviço
              </span>
            </Link>
          ))}
        </div>

        <button
          type="button"
          onClick={onReset}
          className="mt-5 block w-full text-center text-sm font-semibold text-muted transition-colors hover:text-primary"
        >
          Consultar outro RE
        </button>
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="rounded-2xl bg-panel/90 p-6 text-center shadow-[0_18px_50px_rgba(60,42,30,0.10)] ring-1 ring-border/70">
        <p className="font-semibold text-primary">Nenhuma viatura disponível</p>
        <p className="mt-2 text-sm text-muted">
          Nenhum serviço aberto foi encontrado para o RE {lookupState.reMilitar}.
          Aguarde liberação pelo administrador.
        </p>
        <button
          type="button"
          onClick={onReset}
          className="mt-5 block w-full text-sm font-semibold text-muted transition-colors hover:text-primary"
        >
          Consultar outro RE
        </button>
      </div>
    );
  }

  return (
    <form action={formAction} className="surface-noise rounded-2xl bg-panel/90 p-5 shadow-[0_18px_50px_rgba(60,42,30,0.10)] ring-1 ring-border/70 sm:p-6">
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
