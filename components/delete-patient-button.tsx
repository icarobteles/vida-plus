"use client";

import { useRouter } from "next/navigation";
import { deletePatient } from "@/app/actions/patients";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

export function DeletePatientButton({ id, name }: { id: string; name: string }) {
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
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      }
    />
  );
}
