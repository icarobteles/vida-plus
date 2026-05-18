"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPrescription } from "@/app/actions/prescriptions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { FilePlus } from "lucide-react";

interface Patient {
  id: string;
  name: string;
}

export function PrescriptionFormDialog({
  patients,
}: {
  patients: Patient[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [patientId, setPatientId] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    fd.set("patientId", patientId);
    const result = await createPrescription(fd);
    setLoading(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Receita emitida com sucesso.");
    setOpen(false);
    setPatientId("");
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
        <FilePlus className="h-4 w-4" />
        Nova receita
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Emitir receita digital</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="patient">Paciente</Label>
            <Select value={patientId} onValueChange={setPatientId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o paciente">
                  {patients.find((p) => p.id === patientId)?.name}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {patients.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="medication">Medicamento</Label>
            <Input
              id="medication"
              name="medication"
              required
              placeholder="Ex.: Amoxicilina 500mg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dosage">Posologia</Label>
            <Input
              id="dosage"
              name="dosage"
              required
              placeholder="Ex.: 1 comprimido a cada 8 horas"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="instructions">Instruções</Label>
            <Textarea
              id="instructions"
              name="instructions"
              required
              rows={3}
              placeholder="Orientações complementares..."
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading || !patientId}>
            {loading ? "Emitindo..." : "Emitir receita"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
