"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAppointment } from "@/app/actions/appointments";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

type Professional = { id: string; name: string };
type PatientOption = { id: string; name: string };

export function AppointmentFormDialog({
  professionals,
  patients,
  defaultPatientId,
}: {
  professionals: Professional[];
  patients?: PatientOption[];
  defaultPatientId?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [professionalId, setProfessionalId] = useState("");
  const [patientId, setPatientId] = useState(defaultPatientId ?? "");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    fd.set("professionalId", professionalId);
    if (patientId) fd.set("patientId", patientId);
    const result = await createAppointment(fd);
    setLoading(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Consulta agendada com sucesso.");
    setOpen(false);
    router.refresh();
  }

  const patientLabel = patients?.find((p) => p.id === patientId)?.name;
  const professionalLabel = professionals.find(
    (p) => p.id === professionalId,
  )?.name;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="inline-flex h-9 cursor-pointer items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90">
        Agendar consulta
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova consulta</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          {patients && (
            <div className="space-y-2">
              <Label>Paciente</Label>
              <Select
                value={patientId}
                onValueChange={(v) => setPatientId(v ?? "")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione o paciente">
                    {patientLabel}
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
          )}
          {defaultPatientId && (
            <input type="hidden" name="patientId" value={defaultPatientId} />
          )}
          <div className="space-y-2">
            <Label>Profissional</Label>
            <Select
              value={professionalId}
              onValueChange={(v) => setProfessionalId(v ?? "")}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o médico">
                  {professionalLabel}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {professionals.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="scheduledAt">Data e hora</Label>
            <Input
              id="scheduledAt"
              name="scheduledAt"
              type="datetime-local"
              required
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea id="notes" name="notes" rows={2} />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={loading || !professionalId}
          >
            {loading ? "Agendando..." : "Confirmar agendamento"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
