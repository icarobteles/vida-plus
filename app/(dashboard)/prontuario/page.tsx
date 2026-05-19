import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { FileText } from "lucide-react";
import Link from "next/link";

export default async function ProntuarioListPage() {
  const user = await requireSession();

  if (user.role === "PATIENT") {
    if (!user.patientId) {
      return (
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Meu prontuário</h1>
          <p className="text-muted-foreground">
            Perfil de paciente não vinculado. Contate o administrador.
          </p>
        </div>
      );
    }
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Meu prontuário</h1>
        <Link
          href={`/prontuario/${user.patientId}`}
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <FileText className="mr-2 h-4 w-4" />
          Ver histórico clínico
        </Link>
      </div>
    );
  }

  const patients = await prisma.patient.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { medicalRecords: true } } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Prontuários</h1>
        <p className="text-muted-foreground">
          Histórico clínico dos pacientes (dados fictícios — LGPD)
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {patients.map((p) => (
          <Card key={p.id}>
            <CardHeader>
              <CardTitle className="text-lg">{p.name}</CardTitle>
              <CardDescription>
                {p._count.medicalRecords} registro(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href={`/prontuario/${p.id}`}
                className="flex w-full items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-muted"
              >
                Abrir prontuário
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
