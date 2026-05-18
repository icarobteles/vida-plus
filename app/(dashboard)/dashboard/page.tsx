import Link from "next/link";
import { Calendar, FileText, Users, Video } from "lucide-react";
import { requireSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
  const user = await requireSession();

  const patientsCount = await prisma.patient.count();

  const appointmentWhere =
    user.role === "PATIENT" && user.patientId
      ? { status: "SCHEDULED" as const, patientId: user.patientId }
      : user.role === "PROFESSIONAL"
        ? { status: "SCHEDULED" as const, professionalId: user.id }
        : { status: "SCHEDULED" as const };

  const recordsWhere =
    user.role === "PATIENT" && user.patientId
      ? { patientId: user.patientId }
      : user.role === "PROFESSIONAL"
        ? { professionalId: user.id }
        : {};

  const prescriptionsWhere =
    user.role === "PROFESSIONAL" ? { professionalId: user.id } : {};

  const [appointmentsCount, recordsCount, prescriptionsCount] =
    await Promise.all([
      prisma.appointment.count({ where: appointmentWhere }),
      prisma.medicalRecord.count({ where: recordsWhere }),
      prisma.prescription.count({ where: prescriptionsWhere }),
    ]);

  const cards = {
    ADMIN: [
      { title: "Pacientes", value: patientsCount, href: "/pacientes", icon: Users },
      { title: "Consultas agendadas", value: appointmentsCount, href: "/agendamentos", icon: Calendar },
      { title: "Registros clínicos", value: recordsCount, href: "/prontuario", icon: FileText },
    ],
    PATIENT: [
      { title: "Minhas consultas", value: appointmentsCount, href: "/agendamentos", icon: Calendar },
      { title: "Meu prontuário", value: recordsCount, href: "/prontuario", icon: FileText },
      { title: "Telemedicina", value: "—", href: "/telemedicina", icon: Video },
    ],
    PROFESSIONAL: [
      { title: "Minhas consultas", value: appointmentsCount, href: "/agendamentos", icon: Calendar },
      { title: "Prontuários", value: recordsCount, href: "/prontuario", icon: FileText },
      { title: "Receitas emitidas", value: prescriptionsCount, href: "/receitas", icon: FileText },
      { title: "Telemedicina", value: "—", href: "/telemedicina", icon: Video },
    ],
  };

  const items = cards[user.role];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Olá, {user.name.split(" ")[0]}</h1>
        <p className="text-muted-foreground">
          Bem-vindo ao painel MedFlow da rede VidaPlus.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ title, value, href, icon: Icon }) => (
          <Card key={href}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{value}</p>
              <Link
                href={href}
                className="mt-2 inline-block text-sm font-medium text-primary hover:underline"
              >
                Acessar →
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
