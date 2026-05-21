"use client";

import { useActionState, useState } from "react";
import type { Vehicle } from "@prisma/client";
import { updateVehicleStatus } from "@/lib/actions/vehicle";
import type { ActionState } from "@/lib/actions/service";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { VehicleDischargeForm } from "@/components/forms/vehicle-discharge-form";
import { VehicleDischargeReturnForm } from "@/components/forms/vehicle-discharge-return-form";

const statusLabels: Record<string, string> = {
  DISPONIVEL: "Disponível",
  EM_USO: "Em uso",
  BAIXADA: "Baixada",
};

const statusColors: Record<string, string> = {
  DISPONIVEL: "bg-[#e6efe2] text-[#385f36] ring-[#bdd2b7]",
  EM_USO: "bg-[#e6edf3] text-[#315f7d] ring-[#bfd0dc]",
  BAIXADA: "bg-secondary/10 text-secondary ring-secondary/20",
};

const initialState: ActionState = { success: false, message: "" };

function DischargedVehicleActions({ vehicle }: { vehicle: Vehicle }) {
  const [returnOpen, setReturnOpen] = useState(false);
  const [returnKey, setReturnKey] = useState(0);

  return (
    <>
      <Button type="button" onClick={() => setReturnOpen(true)}>
        Retorno da baixa
      </Button>

      <Modal
        open={returnOpen}
        onClose={() => setReturnOpen(false)}
        title={`Retorno da baixa — ${vehicle.prefixo}`}
      >
        <VehicleDischargeReturnForm
          key={returnKey}
          vehicle={vehicle}
          onSuccess={() => {
            setReturnOpen(false);
            setReturnKey((current) => current + 1);
          }}
          onCancel={() => setReturnOpen(false)}
        />
      </Modal>
    </>
  );
}

function StatusForm({ vehicle }: { vehicle: Vehicle }) {
  const [state, formAction, pending] = useActionState(
    updateVehicleStatus,
    initialState
  );
  const [selectedStatus, setSelectedStatus] = useState(vehicle.status);
  const [dischargeOpen, setDischargeOpen] = useState(false);
  const [dischargeKey, setDischargeKey] = useState(0);

  const handleStatusChange = (nextStatus: Vehicle["status"]) => {
    if (nextStatus === "BAIXADA" && vehicle.status !== "BAIXADA") {
      setDischargeOpen(true);
      return;
    }
    setSelectedStatus(nextStatus);
  };

  const handleDischargeClose = () => {
    setDischargeOpen(false);
    setSelectedStatus(vehicle.status);
  };

  const handleDischargeSuccess = () => {
    setDischargeOpen(false);
    setDischargeKey((current) => current + 1);
  };

  if (vehicle.status === "BAIXADA") {
    return <DischargedVehicleActions vehicle={vehicle} />;
  }

  return (
    <>
      <form action={formAction} className="flex flex-wrap items-center gap-2">
        <input type="hidden" name="vehicleId" value={vehicle.id} />
        <select
          name="status"
          value={selectedStatus}
          onChange={(event) =>
            handleStatusChange(event.target.value as Vehicle["status"])
          }
          className="min-h-11 rounded-xl border border-border bg-panel/85 px-3 text-sm font-medium text-primary transition duration-200 focus:border-primary/50"
        >
          <option value="DISPONIVEL">Disponível</option>
          <option value="EM_USO">Em uso</option>
          <option value="BAIXADA">Baixada</option>
        </select>
        <button
          type="submit"
          disabled={pending || selectedStatus === vehicle.status}
          className="min-h-11 cursor-pointer rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm shadow-primary/10 transition duration-200 hover:bg-[#332822] active:translate-y-px disabled:translate-y-0 disabled:opacity-50"
        >
          {pending ? "..." : "Atualizar"}
        </button>
        {state.message && (
          <span
            className={`text-xs ${state.success ? "text-[#346538]" : "text-secondary"}`}
          >
            {state.message}
          </span>
        )}
      </form>

      <Modal
        open={dischargeOpen}
        onClose={handleDischargeClose}
        title={`Baixa — ${vehicle.prefixo}`}
      >
        <VehicleDischargeForm
          key={dischargeKey}
          vehicle={vehicle}
          onSuccess={handleDischargeSuccess}
          onCancel={handleDischargeClose}
        />
      </Modal>
    </>
  );
}

export function VehicleList({ vehicles }: { vehicles: Vehicle[] }) {
  if (vehicles.length === 0) {
    return (
      <p className="rounded-2xl bg-panel/70 p-5 text-muted ring-1 ring-border/70">
        Nenhuma viatura cadastrada.
      </p>
    );
  }

  return (
    <div className="grid gap-3">
      {vehicles.map((v) => (
        <article
          key={v.id}
          className="rounded-2xl bg-panel/85 p-4 shadow-[0_14px_40px_rgba(60,42,30,0.08)] ring-1 ring-border/70 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_55px_rgba(60,42,30,0.12)] sm:flex sm:items-center sm:justify-between sm:gap-4"
        >
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-mono text-lg font-semibold tracking-tight text-primary">
                {v.prefixo}
              </h3>
              <span
                className={`rounded-md px-2 py-0.5 text-xs font-semibold uppercase tracking-[0.16em] ring-1 ${statusColors[v.status]}`}
              >
                {statusLabels[v.status]}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted">
              {v.modelo} · {v.patrimonio} · {v.placa}
            </p>
          </div>
          <StatusForm vehicle={v} />
        </article>
      ))}
    </div>
  );
}
