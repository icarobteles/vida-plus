"use client";

import { useRouter } from "next/navigation";
import { completeAppointment } from "@/app/actions/appointments";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";

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
    <Tooltip content="Concluir consulta">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-emerald-600 hover:bg-emerald-600/10 hover:text-emerald-600"
        onClick={handleComplete}
      >
        <CheckCircle className="h-4 w-4" />
      </Button>
    </Tooltip>
  );
}
