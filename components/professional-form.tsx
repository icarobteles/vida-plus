"use client";

import {
  createProfessional,
  updateProfessional,
} from "@/app/actions/professionals";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip } from "@/components/ui/tooltip";
import { Pencil, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface Professional {
  id: string;
  name: string;
  email: string;
}

export function ProfessionalFormDialog({
  professional,
}: {
  professional?: Professional;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const isEdit = !!professional;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const result = isEdit
      ? await updateProfessional(professional!.id, fd)
      : await createProfessional(fd);
    setLoading(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success(
      isEdit ? "Profissional atualizado." : "Profissional cadastrado.",
    );
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {isEdit ? (
        <Tooltip content="Editar profissional">
          <DialogTrigger className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-input bg-background hover:bg-muted">
            <Pencil className="h-3.5 w-3.5" />
          </DialogTrigger>
        </Tooltip>
      ) : (
        <DialogTrigger className="inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <UserPlus className="h-4 w-4" />
          Novo profissional
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Editar profissional" : "Cadastrar profissional"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome completo</Label>
            <Input
              id="name"
              name="name"
              required
              defaultValue={professional?.name ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              defaultValue={professional?.email ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">
              {isEdit ? "Nova senha (deixe vazio para manter)" : "Senha"}
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder={isEdit ? "••••••" : "Mínimo 6 caracteres"}
              {...(!isEdit && { required: true })}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading
              ? "Salvando..."
              : isEdit
                ? "Salvar alterações"
                : "Cadastrar"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
