import { notFound } from "next/navigation";
import Link from "next/link";
import { requireSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { MedicalRecordFormDialog } from "@/components/medical-record-form";

export default async function ProntuarioDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireSession();

  if (user.role === "PATIENT" && user.patientId !== id) {
    notFound();
  }

  const patient = await prisma.patient.findUnique({
    where: { id },
    include: {
      medicalRecords: {
        include: { professional: { select: { name: true } } },
        orderBy: { recordedAt: "desc" },
      },
    },
  });

  if (!patient) notFound();

  return (
    <div className="space-y-6">
      <Link
        href="/prontuario"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar
      </Link>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Prontuário — {patient.name}</h1>
          <p className="text-sm text-muted-foreground">
            CPF: {patient.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")}
          </p>
        </div>
        {user.role === "PROFESSIONAL" && (
          <MedicalRecordFormDialog patientId={id} />
        )}
      </div>
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertTitle>Proteção de dados (LGPD)</AlertTitle>
        <AlertDescription>
          Informações de demonstração. Em produção, acesso auditado e criptografia em repouso.
        </AlertDescription>
      </Alert>
      <div className="space-y-4">
        {patient.medicalRecords.length === 0 ? (
          <p className="text-muted-foreground">Nenhum registro clínico.</p>
        ) : (
          patient.medicalRecords.map((r) => (
            <Card key={r.id}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base">{r.type}</CardTitle>
                <Badge variant="outline">
                  {new Date(r.recordedAt).toLocaleDateString("pt-BR")}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{r.description}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {r.professional.name}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
