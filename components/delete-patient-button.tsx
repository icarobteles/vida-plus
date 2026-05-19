"use client";

import { deletePatient } from "@/app/actions/patients";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function DeletePatientButton({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const router = useRouter();

  async function handleDelete() {
    const result = await deletePatient(id);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Paciente excluído.");
    router.refresh();
  }

  return (
    <ConfirmDialog
      title="Excluir paciente"
      description={`Tem certeza que deseja excluir "${name}"? Todos os agendamentos e registros associados serão removidos. Esta ação não pode ser desfeita.`}
      confirmLabel="Excluir paciente"
      onConfirm={handleDelete}
      trigger={
        <Tooltip content="Excluir paciente">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Excluir paciente"
            className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </Tooltip>
      }
    />
  );
}
