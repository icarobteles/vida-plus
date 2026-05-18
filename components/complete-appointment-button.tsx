"use client";

import { useRouter } from "next/navigation";
import { completeAppointment } from "@/app/actions/appointments";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function CompleteAppointmentButton({ id }: { id: string }) {
  const router = useRouter();

  async function handleComplete() {
    const result = await completeAppointment(id);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Consulta concluída.");
    router.refresh();
  }

  return (
    <Button variant="outline" size="sm" onClick={handleComplete}>
      Concluir
    </Button>
  );
}
