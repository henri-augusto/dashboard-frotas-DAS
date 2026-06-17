"use client";

import { useState } from "react";
import type { Vehicle } from "@prisma/client";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { VehicleForm } from "@/components/forms/vehicle-form";

export function EditVehicleModal({
  vehicle,
  compact = false,
}: {
  vehicle: Vehicle;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const handleClose = () => setOpen(false);

  const handleSuccess = () => {
    setFormKey((current) => current + 1);
    setOpen(false);
  };

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        fullWidth={!compact}
        className={compact ? "min-h-9 shrink-0 px-3 text-sm" : undefined}
        onClick={() => setOpen(true)}
      >
        {compact ? "Editar" : "Editar dados"}
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        title={`Editar viatura — ${vehicle.prefixo}`}
      >
        <VehicleForm key={formKey} vehicle={vehicle} onSuccess={handleSuccess} />
      </Modal>
    </>
  );
}
