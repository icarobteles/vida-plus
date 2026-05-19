import { PrescriptionFormDialog } from "@/components/prescription-form";
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

export default async function ReceitasPage() {
  const user = await requireRole(["PROFESSIONAL", "PATIENT"]);
  const isProfessional = user.role === "PROFESSIONAL";

  const patients = isProfessional
    ? await prisma.patient.findMany({
        select: { id: true, name: true },
        orderBy: { name: "asc" },
      })
    : [];

  const prescriptions = await prisma.prescription.findMany({
    where: isProfessional
      ? { professionalId: user.id }
      : { patientId: user.patientId ?? "" },
    include: {
      patient: { select: { name: true } },
      professional: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Receitas Digitais</h1>
          <p className="text-muted-foreground">
            {isProfessional
              ? "Emita receitas para seus pacientes"
              : "Receitas prescritas para você"}
          </p>
        </div>
        {isProfessional && <PrescriptionFormDialog patients={patients} />}
      </div>

      {/* Desktop */}
      <Card className="hidden md:block">
        <CardHeader>
          <CardTitle>
            {isProfessional ? "Receitas emitidas" : "Minhas receitas"}
          </CardTitle>
          <CardDescription>{prescriptions.length} registro(s)</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {isProfessional ? (
                  <TableHead>Paciente</TableHead>
                ) : (
                  <TableHead>Profissional</TableHead>
                )}
                <TableHead>Medicamento</TableHead>
                <TableHead>Posologia</TableHead>
                <TableHead>Instruções</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prescriptions.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">
                    {isProfessional ? p.patient.name : p.professional.name}
                  </TableCell>
                  <TableCell>{p.medication}</TableCell>
                  <TableCell>{p.dosage}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {p.instructions}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {new Date(p.createdAt).toLocaleDateString("pt-BR")}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {prescriptions.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground"
                  >
                    {isProfessional
                      ? "Nenhuma receita emitida ainda."
                      : "Nenhuma receita prescrita para você."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Mobile */}
      <div className="space-y-3 md:hidden">
        <p className="text-sm text-muted-foreground">
          {prescriptions.length} registro(s)
        </p>
        {prescriptions.map((p) => (
          <div key={p.id} className="rounded-lg border bg-card p-4">
            <dl className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <div>
                  <dt className="text-xs text-muted-foreground">
                    {isProfessional ? "Paciente" : "Profissional"}
                  </dt>
                  <dd className="font-medium">
                    {isProfessional ? p.patient.name : p.professional.name}
                  </dd>
                </div>
                <Badge variant="outline">
                  {new Date(p.createdAt).toLocaleDateString("pt-BR")}
                </Badge>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Medicamento</dt>
                <dd>{p.medication}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Posologia</dt>
                <dd>{p.dosage}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Instruções</dt>
                <dd className="text-muted-foreground">{p.instructions}</dd>
              </div>
            </dl>
          </div>
        ))}
        {prescriptions.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            {isProfessional
              ? "Nenhuma receita emitida ainda."
              : "Nenhuma receita prescrita para você."}
          </p>
        )}
      </div>
    </div>
  );
}
