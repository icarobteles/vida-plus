import { DeletePatientButton } from "@/components/delete-patient-button";
import { EditPatientDialog } from "@/components/edit-patient-dialog";
import { PatientFormDialog } from "@/components/patient-form";
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

function formatCpf(cpf: string) {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

export default async function PacientesPage() {
  await requireRole(["ADMIN"]);
  const patients = await prisma.patient.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pacientes</h1>
          <p className="text-muted-foreground">
            Cadastro e gestão de pacientes VidaPlus
          </p>
        </div>
        <PatientFormDialog />
      </div>

      {/* Desktop */}
      <Card className="hidden md:block">
        <CardHeader>
          <CardTitle>Lista de pacientes</CardTitle>
          <CardDescription>{patients.length} cadastrado(s)</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead>Nascimento</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>{formatCpf(p.cpf)}</TableCell>
                  <TableCell>
                    {new Date(p.birthDate).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell>{p.phone ?? p.email ?? "—"}</TableCell>
                  <TableCell className="flex gap-1">
                    <EditPatientDialog
                      patient={{
                        id: p.id,
                        name: p.name,
                        cpf: p.cpf,
                        birthDate: p.birthDate.toISOString().split("T")[0],
                        phone: p.phone,
                        email: p.email,
                      }}
                    />
                    <DeletePatientButton id={p.id} name={p.name} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Mobile */}
      <div className="space-y-3 md:hidden">
        <p className="text-sm text-muted-foreground">
          {patients.length} cadastrado(s)
        </p>
        {patients.map((p) => (
          <div key={p.id} className="relative rounded-lg border bg-card p-4">
            <div className="absolute right-3 top-3 flex gap-1">
              <EditPatientDialog
                patient={{
                  id: p.id,
                  name: p.name,
                  cpf: p.cpf,
                  birthDate: p.birthDate.toISOString().split("T")[0],
                  phone: p.phone,
                  email: p.email,
                }}
              />
              <DeletePatientButton id={p.id} name={p.name} />
            </div>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-xs text-muted-foreground">Nome</dt>
                <dd className="font-medium">{p.name}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">CPF</dt>
                <dd>{formatCpf(p.cpf)}</dd>
              </div>
              <div className="flex gap-6">
                <div>
                  <dt className="text-xs text-muted-foreground">Nascimento</dt>
                  <dd>{new Date(p.birthDate).toLocaleDateString("pt-BR")}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Contato</dt>
                  <dd>{p.phone ?? p.email ?? "—"}</dd>
                </div>
              </div>
            </dl>
          </div>
        ))}
      </div>
    </div>
  );
}
