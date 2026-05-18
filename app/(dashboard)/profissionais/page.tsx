import { DeleteProfessionalButton } from "@/components/delete-professional-button";
import { ProfessionalFormDialog } from "@/components/professional-form";
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

export default async function ProfissionaisPage() {
  await requireRole(["ADMIN"]);

  const professionals = await prisma.user.findMany({
    where: { role: "PROFESSIONAL" },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          appointmentsAsPro: true,
          medicalRecords: true,
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Profissionais</h1>
          <p className="text-muted-foreground">
            Gestão de profissionais de saúde VidaPlus
          </p>
        </div>
        <ProfessionalFormDialog />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Equipe médica</CardTitle>
          <CardDescription>
            {professionals.length} profissional(is)
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Consultas</TableHead>
                <TableHead>Registros</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {professionals.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell>{p.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {p._count.appointmentsAsPro}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{p._count.medicalRecords}</Badge>
                  </TableCell>
                  <TableCell className="flex gap-1">
                    <ProfessionalFormDialog
                      professional={{
                        id: p.id,
                        name: p.name,
                        email: p.email,
                      }}
                    />
                    <DeleteProfessionalButton id={p.id} name={p.name} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
