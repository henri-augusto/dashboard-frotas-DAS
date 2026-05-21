"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { VehicleForm } from "@/components/forms/vehicle-form";

export function CreateVehicleModal() {
  const [open, setOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const handleClose = () => setOpen(false);

  const handleSuccess = () => {
    setFormKey((current) => current + 1);
    setOpen(false);
  };

  return (
    <>
      <Button type="button" onClick={() => setOpen(true)}>
        Nova viatura
      </Button>

      <Modal open={open} onClose={handleClose} title="Nova viatura">
        <VehicleForm key={formKey} onSuccess={handleSuccess} />
      </Modal>
    </>
  );
}
