"use client";

import { useRouter } from "next/navigation";
import { cancelAppointment } from "@/app/actions/appointments";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
    <Button variant="destructive" size="sm" onClick={handleCancel}>
      Cancelar
    </Button>
  );
}
