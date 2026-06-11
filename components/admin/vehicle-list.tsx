"use client";

import { useActionState, useState } from "react";
import type { Vehicle } from "@prisma/client";
import { updateVehicleStatus } from "@/lib/actions/vehicle";
import { ACTION_INITIAL_STATE } from "@/lib/actions/types";
import {
  VEHICLE_STATUS_COLORS,
  VEHICLE_STATUS_LABELS,
  VEHICLE_STATUS_OPTIONS,
} from "@/lib/constants/vehicle-status";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { VehicleDischargeForm } from "@/components/forms/vehicle-discharge-form";
import { VehicleDischargeReturnForm } from "@/components/forms/vehicle-discharge-return-form";

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
    ACTION_INITIAL_STATE
  );
  const [selectedStatus, setSelectedStatus] = useState(vehicle.status);
  const [dischargeOpen, setDischargeOpen] = useState(false);
  const [dischargeKey, setDischargeKey] = useState(0);

  const statusOptions = VEHICLE_STATUS_OPTIONS.map((opt) => ({
    value: opt.value,
    label: opt.label,
  }));

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
      <form action={formAction} className="flex flex-wrap items-end gap-2">
        <input type="hidden" name="vehicleId" value={vehicle.id} />
        <div className="min-w-[10rem] flex-1">
          <Select
            name="status"
            label="Status"
            options={statusOptions}
            value={selectedStatus}
            onChange={(event) =>
              handleStatusChange(event.target.value as Vehicle["status"])
            }
          />
        </div>
        <Button
          type="submit"
          disabled={pending || selectedStatus === vehicle.status}
        >
          {pending ? "..." : "Atualizar"}
        </Button>
        {state.message && (
          <span
            className={`w-full text-xs ${state.success ? "text-[#346538]" : "text-secondary"}`}
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
                className={`rounded-md px-2 py-0.5 text-xs font-semibold uppercase tracking-[0.16em] ring-1 ${VEHICLE_STATUS_COLORS[v.status]}`}
              >
                {VEHICLE_STATUS_LABELS[v.status]}
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
