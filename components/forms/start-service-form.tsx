"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import type { Vehicle } from "@prisma/client";
import {
  lookupOpenServicesByRe,
  startService,
} from "@/lib/actions/service";
import {
  ACTION_INITIAL_STATE,
  SERVICE_LOOKUP_INITIAL_STATE,
} from "@/lib/actions/types";
import { OpenServicesStep } from "@/components/forms/open-services-step";
import { ServiceRelookupStep } from "@/components/forms/service-relookup-step";
import { StartServiceFields } from "@/components/forms/start-service-fields";

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
    SERVICE_LOOKUP_INITIAL_STATE
  );
  const [state, formAction, pending] = useActionState(
    startService,
    ACTION_INITIAL_STATE
  );

  if (state.success && state.serviceId) {
    return (
      <div className="surface-noise rounded-2xl bg-panel/90 p-6 text-center shadow-[0_18px_50px_rgba(60,42,30,0.10)] ring-1 ring-border/70">
        <p className="text-xl font-semibold tracking-tight text-primary">
          Serviço iniciado
        </p>
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
      <ServiceRelookupStep
        lookupAction={lookupAction}
        lookupState={lookupState}
        lookupPending={lookupPending}
      />
    );
  }

  const openServices = lookupState.openServices ?? [];

  if (openServices.length > 0) {
    return <OpenServicesStep lookupState={lookupState} onReset={onReset} />;
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
    <StartServiceFields
      vehicles={vehicles}
      lookupState={lookupState}
      state={state}
      formAction={formAction}
      pending={pending}
      onReset={onReset}
    />
  );
}
