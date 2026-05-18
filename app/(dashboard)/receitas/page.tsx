import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { PrescriptionFormDialog } from "@/components/prescription-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function ReceitasPage() {
  const user = await requireRole(["PROFESSIONAL"]);

  const patients = await prisma.patient.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  const prescriptions = await prisma.prescription.findMany({
    where: { professionalId: user.id },
    include: {
      patient: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Receitas Digitais</h1>
          <p className="text-muted-foreground">
            Emita receitas para seus pacientes
          </p>
        </div>
        <PrescriptionFormDialog patients={patients} />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Receitas emitidas</CardTitle>
          <CardDescription>{prescriptions.length} registro(s)</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Paciente</TableHead>
                <TableHead>Medicamento</TableHead>
                <TableHead>Posologia</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prescriptions.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.patient.name}</TableCell>
                  <TableCell>{p.medication}</TableCell>
                  <TableCell>{p.dosage}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {new Date(p.createdAt).toLocaleDateString("pt-BR")}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {prescriptions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    Nenhuma receita emitida ainda.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
