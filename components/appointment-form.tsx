"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAppointment } from "@/app/actions/appointments";
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
import { toast } from "sonner";

type Professional = { id: string; name: string };
type PatientOption = { id: string; name: string };

const selectClass =
  "flex h-9 w-full cursor-pointer items-center rounded-lg border border-input bg-transparent px-3 py-2 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30";

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

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const result = await createAppointment(new FormData(e.currentTarget));
    setLoading(false);
    if (result.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Consulta agendada com sucesso.");
    setOpen(false);
    router.refresh();
  }

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
              <Label htmlFor="patientId">Paciente</Label>
              <select
                id="patientId"
                name="patientId"
                required
                defaultValue={defaultPatientId ?? ""}
                className={selectClass}
              >
                <option value="" disabled>
                  Selecione o paciente
                </option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          {defaultPatientId && !patients && (
            <input type="hidden" name="patientId" value={defaultPatientId} />
          )}
          <div className="space-y-2">
            <Label htmlFor="professionalId">Profissional</Label>
            <select
              id="professionalId"
              name="professionalId"
              required
              defaultValue=""
              className={selectClass}
            >
              <option value="" disabled>
                Selecione o médico
              </option>
              {professionals.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
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
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Agendando..." : "Confirmar agendamento"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
