import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BarChart3, Users, Calendar, FileText, Pill } from "lucide-react";

export default async function RelatoriosPage() {
  await requireRole(["ADMIN"]);

  const [
    totalPatients,
    totalProfessionals,
    totalAppointments,
    scheduledCount,
    completedCount,
    cancelledCount,
    totalRecords,
    totalPrescriptions,
    recentAppointments,
    topProfessionals,
  ] = await Promise.all([
    prisma.patient.count(),
    prisma.user.count({ where: { role: "PROFESSIONAL" } }),
    prisma.appointment.count(),
    prisma.appointment.count({ where: { status: "SCHEDULED" } }),
    prisma.appointment.count({ where: { status: "COMPLETED" } }),
    prisma.appointment.count({ where: { status: "CANCELLED" } }),
    prisma.medicalRecord.count(),
    prisma.prescription.count(),
    prisma.appointment.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        patient: { select: { name: true } },
        professional: { select: { name: true } },
      },
    }),
    prisma.user.findMany({
      where: { role: "PROFESSIONAL" },
      include: {
        _count: { select: { appointmentsAsPro: true } },
      },
      orderBy: { appointmentsAsPro: { _count: "desc" } },
      take: 5,
    }),
  ]);

  const statusVariant = {
    SCHEDULED: "default" as const,
    COMPLETED: "outline" as const,
    CANCELLED: "secondary" as const,
  };
  const statusLabel = {
    SCHEDULED: "Agendada",
    COMPLETED: "Concluída",
    CANCELLED: "Cancelada",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Relatórios</h1>
        <p className="text-muted-foreground">
          Visão geral da operação VidaPlus
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pacientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalPatients}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Profissionais</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalProfessionals}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Registros clínicos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalRecords}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Receitas emitidas</CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalPrescriptions}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Consultas — Resumo
          </CardTitle>
          <CardDescription>
            {totalAppointments} consulta(s) no total
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="rounded-lg border p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">{scheduledCount}</p>
              <p className="text-xs text-muted-foreground">Agendadas</p>
            </div>
            <div className="rounded-lg border p-4 text-center">
              <p className="text-2xl font-bold text-emerald-600">{completedCount}</p>
              <p className="text-xs text-muted-foreground">Concluídas</p>
            </div>
            <div className="rounded-lg border p-4 text-center">
              <p className="text-2xl font-bold text-red-600">{cancelledCount}</p>
              <p className="text-xs text-muted-foreground">Canceladas</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Últimas consultas</CardTitle>
            <CardDescription>5 mais recentes</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Paciente</TableHead>
                  <TableHead>Profissional</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentAppointments.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">
                      {a.patient.name}
                    </TableCell>
                    <TableCell>{a.professional.name}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[a.status]}>
                        {statusLabel[a.status]}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profissionais mais ativos</CardTitle>
            <CardDescription>Por número de consultas</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Consultas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topProfessionals.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {p._count.appointmentsAsPro}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
