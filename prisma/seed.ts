import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import {
  PrismaClient,
  Role,
  AppointmentStatus,
} from "../app/generated/prisma/client";
import bcrypt from "bcryptjs";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash("123456", 10);

  await prisma.medicalRecord.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.user.deleteMany();

  const admin = await prisma.user.create({
    data: {
      email: "admin@vida.plus",
      name: "Administrador VidaPlus",
      passwordHash,
      role: Role.ADMIN,
    },
  });

  const professional = await prisma.user.create({
    data: {
      email: "medico@vida.plus",
      name: "Dra. Ana Silva",
      passwordHash,
      role: Role.PROFESSIONAL,
    },
  });

  const patientUser = await prisma.user.create({
    data: {
      email: "paciente@vida.plus",
      name: "João Santos",
      passwordHash,
      role: Role.PATIENT,
    },
  });

  const patient = await prisma.patient.create({
    data: {
      name: "João Santos",
      cpf: "52998224725",
      birthDate: new Date("1990-05-15"),
      phone: "(11) 98765-4321",
      email: "paciente@vida.plus",
      userId: patientUser.id,
    },
  });

  await prisma.patient.createMany({
    data: [
      {
        name: "Maria Oliveira",
        cpf: "11144477735",
        birthDate: new Date("1985-03-20"),
        phone: "(11) 91234-5678",
      },
      {
        name: "Carlos Pereira",
        cpf: "39053344705",
        birthDate: new Date("1978-11-08"),
        phone: "(11) 99876-5432",
      },
    ],
  });

  const patients = await prisma.patient.findMany();

  await prisma.appointment.createMany({
    data: [
      {
        patientId: patient.id,
        professionalId: professional.id,
        scheduledAt: new Date(Date.now() + 86400000 * 2),
        status: AppointmentStatus.SCHEDULED,
        notes: "Consulta de rotina",
      },
      {
        patientId: patients[1]?.id ?? patient.id,
        professionalId: professional.id,
        scheduledAt: new Date(Date.now() + 86400000 * 5),
        status: AppointmentStatus.SCHEDULED,
      },
    ],
  });

  await prisma.medicalRecord.createMany({
    data: [
      {
        patientId: patient.id,
        professionalId: professional.id,
        type: "Consulta",
        description: "Paciente relatou dor de cabeça leve. Pressão arterial normal.",
        recordedAt: new Date("2025-01-10"),
      },
      {
        patientId: patient.id,
        professionalId: professional.id,
        type: "Exame",
        description: "Hemograma completo — resultados dentro da normalidade.",
        recordedAt: new Date("2025-02-15"),
      },
    ],
  });

  console.log("Seed OK:", { admin: admin.email, professional: professional.email });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
