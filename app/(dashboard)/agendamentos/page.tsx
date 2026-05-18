import { AppointmentFormDialog } from "@/components/appointment-form";
import { CancelAppointmentButton } from "@/components/cancel-appointment-button";
import { CompleteAppointmentButton } from "@/components/complete-appointment-button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { Tooltip } from "@/components/ui/tooltip";
import { Video } from "lucide-react";
import Link from "next/link";

const statusMap = {
  SCHEDULED: { label: "Agendada", variant: "default" as const },
  CANCELLED: { label: "Cancelada", variant: "secondary" as const },
  COMPLETED: { label: "Concluída", variant: "outline" as const },
};

export default async function AgendamentosPage() {
  const user = await requireRole(["PATIENT", "ADMIN", "PROFESSIONAL"]);

  const professionals = await prisma.user.findMany({
    where: { role: "PROFESSIONAL" },
    select: { id: true, name: true },
  });

  const patients =
    user.role === "ADMIN"
      ? await prisma.patient.findMany({
          select: { id: true, name: true },
          orderBy: { name: "asc" },
        })
      : undefined;

  const canSchedule = user.role === "PATIENT" || user.role === "ADMIN";

  const where =
    user.role === "PATIENT" && user.patientId
      ? { patientId: user.patientId }
      : user.role === "PROFESSIONAL"
        ? { professionalId: user.id }
        : {};

  const appointments = await prisma.appointment.findMany({
    where,
    include: {
      patient: { select: { name: true } },
      professional: { select: { name: true } },
    },
    orderBy: { scheduledAt: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Agendamentos</h1>
          <p className="text-muted-foreground">
            {canSchedule
              ? "Agende ou cancele consultas online"
              : "Suas consultas agendadas"}
          </p>
        </div>
        {canSchedule && (
          <AppointmentFormDialog
            professionals={professionals}
            patients={patients}
            defaultPatientId={user.patientId}
          />
        )}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Consultas</CardTitle>
          <CardDescription>{appointments.length} registro(s)</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Paciente</TableHead>
                <TableHead>Profissional</TableHead>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((a) => {
                const st = statusMap[a.status];
                return (
                  <TableRow key={a.id}>
                    <TableCell>{a.patient.name}</TableCell>
                    <TableCell>{a.professional.name}</TableCell>
                    <TableCell>
                      {new Date(a.scheduledAt).toLocaleString("pt-BR")}
                    </TableCell>
                    <TableCell>
                      <Badge variant={st.variant}>{st.label}</Badge>
                    </TableCell>
                    <TableCell className="flex gap-2">
                      {a.status === "SCHEDULED" && canSchedule && (
                        <CancelAppointmentButton id={a.id} />
                      )}
                      {a.status === "SCHEDULED" &&
                        user.role === "PROFESSIONAL" && (
                          <CompleteAppointmentButton id={a.id} />
                        )}
                      {a.status === "SCHEDULED" &&
                        (user.role === "PATIENT" ||
                          user.role === "PROFESSIONAL") && (
                          <Tooltip content="Teleconsulta">
                            <Link
                              href="/telemedicina"
                              className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
                            >
                              <Video className="h-4 w-4" />
                            </Link>
                          </Tooltip>
                        )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
