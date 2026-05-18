"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updatePatient } from "@/app/actions/patients";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tooltip } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { Pencil } from "lucide-react";

interface Patient {
  id: string;
  name: string;
  cpf: string;
  birthDate: string;
  phone: string | null;
  email: string | null;
}

export function EditPatientDialog({ patient }: { patient: Patient }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const result = await updatePatient(patient.id, new FormData(e.currentTarget));
    setLoading(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Paciente atualizado.");
    setOpen(false);
    router.refresh();
  }

  const cpfFormatted = patient.cpf.replace(
    /(\d{3})(\d{3})(\d{3})(\d{2})/,
    "$1.$2.$3-$4",
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip content="Editar paciente">
        <DialogTrigger className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-input bg-background hover:bg-muted">
          <Pencil className="h-3.5 w-3.5" />
        </DialogTrigger>
      </Tooltip>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar paciente</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome completo</Label>
            <Input id="name" name="name" required defaultValue={patient.name} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cpf">CPF</Label>
            <Input id="cpf" name="cpf" required defaultValue={cpfFormatted} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="birthDate">Data de nascimento</Label>
            <Input
              id="birthDate"
              name="birthDate"
              type="date"
              required
              defaultValue={patient.birthDate}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input id="phone" name="phone" defaultValue={patient.phone ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={patient.email ?? ""}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Salvando..." : "Salvar alterações"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
