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
import { EditVehicleModal } from "@/components/admin/edit-vehicle-modal";

function DischargedVehicleActions({ vehicle }: { vehicle: Vehicle }) {
  const [returnOpen, setReturnOpen] = useState(false);
  const [returnKey, setReturnKey] = useState(0);

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        className="min-h-9 shrink-0 px-3 text-sm"
        onClick={() => setReturnOpen(true)}
      >
        Retorno
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
      <div className="flex flex-col items-end gap-1">
        <form action={formAction} className="flex items-center gap-1.5">
          <input type="hidden" name="vehicleId" value={vehicle.id} />
          <div className="w-[7.5rem] [&_label]:sr-only [&_select]:min-h-9 [&_select]:py-1.5 [&_select]:text-sm">
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
            variant="ghost"
            className="min-h-9 shrink-0 px-2.5 text-sm"
            disabled={pending || selectedStatus === vehicle.status}
          >
            {pending ? "..." : "OK"}
          </Button>
        </form>
        {state.message && !state.success && (
          <p className="text-[0.65rem] font-medium text-secondary">{state.message}</p>
        )}
      </div>

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
      <div className="rounded-xl border border-dashed border-border/80 bg-panel/50 px-5 py-10 text-center">
        <p className="text-sm font-semibold text-primary">
          Nenhuma viatura cadastrada
        </p>
        <p className="mx-auto mt-1.5 max-w-xs text-xs text-muted">
          Use &ldquo;Nova viatura&rdquo; no topo para registrar a primeira unidade.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
      {vehicles.map((v) => (
        <article
          key={v.id}
          className="flex flex-col justify-between gap-3 rounded-xl border border-border/70 bg-panel/80 px-3.5 py-3"
        >
          <div className="min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="truncate text-[0.95rem] font-semibold leading-snug tracking-tight text-primary">
                  {v.modelo}
                </h3>
                <p className="mt-0.5 font-mono text-sm font-semibold tracking-tight text-primary/80">
                  {v.prefixo}
                </p>
              </div>
              <span
                className={`shrink-0 rounded px-1.5 py-0.5 text-[0.62rem] font-semibold uppercase tracking-[0.12em] ring-1 ${VEHICLE_STATUS_COLORS[v.status]}`}
              >
                {VEHICLE_STATUS_LABELS[v.status]}
              </span>
            </div>
            <p className="mt-2 truncate text-xs text-muted">
              {v.patrimonio} · {v.placa}
            </p>
          </div>

          <div className="flex items-center justify-end gap-1.5 border-t border-border/50 pt-2.5">
            <EditVehicleModal vehicle={v} compact />
            <StatusForm vehicle={v} />
          </div>
        </article>
      ))}
    </div>
  );
}
