"use client";

import { useRouter } from "next/navigation";
import { deleteProfessional } from "@/app/actions/professionals";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

export function DeleteProfessionalButton({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const router = useRouter();

  async function handleDelete() {
    const result = await deleteProfessional(id);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Profissional excluído.");
    router.refresh();
  }

  return (
    <ConfirmDialog
      title="Excluir profissional"
      description={`Tem certeza que deseja excluir "${name}"? Consultas e registros vinculados serão afetados. Esta ação não pode ser desfeita.`}
      confirmLabel="Excluir profissional"
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
