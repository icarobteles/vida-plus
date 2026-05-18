"use client";

import { useRouter } from "next/navigation";
import { cancelAppointment } from "@/app/actions/appointments";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Tooltip } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { X } from "lucide-react";

export function CancelAppointmentButton({ id }: { id: string }) {
  const router = useRouter();

  async function handleCancel() {
    const result = await cancelAppointment(id);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Consulta cancelada.");
    router.refresh();
  }

  return (
    <ConfirmDialog
      title="Cancelar consulta"
      description="Tem certeza que deseja cancelar esta consulta? Esta ação não pode ser desfeita."
      confirmLabel="Cancelar consulta"
      onConfirm={handleCancel}
      trigger={
        <Tooltip content="Cancelar consulta">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </Button>
        </Tooltip>
      }
    />
  );
}
