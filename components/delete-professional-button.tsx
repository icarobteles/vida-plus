"use client";

import { deleteProfessional } from "@/app/actions/professionals";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
        <Tooltip content="Excluir profissional">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Excluir profissional"
            className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </Tooltip>
      }
    />
  );
}
