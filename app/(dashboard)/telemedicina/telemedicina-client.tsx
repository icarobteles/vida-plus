"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Info, Shield, Video } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";

const JitsiRoom = dynamic(
  () => import("@/components/telemedicina/jitsi-room").then((m) => m.JitsiRoom),
  { ssr: false },
);

interface Appointment {
  id: string;
  patientName: string;
  professionalName: string;
  scheduledAt: string;
}

interface Props {
  userName: string;
  userRole: string;
  appointments: Appointment[];
}

export function TelemedicinaClient({
  userName,
  userRole,
  appointments,
}: Props) {
  const [selectedAppointment, setSelectedAppointment] = useState("");
  const [inSession, setInSession] = useState(false);

  const appointment = appointments.find((a) => a.id === selectedAppointment);

  const roomName = appointment
    ? `VidaPlusTeleconsulta${appointment.id.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8)}`
    : "";

  const otherPerson = appointment
    ? userRole === "PATIENT"
      ? appointment.professionalName
      : appointment.patientName
    : "";

  function handleStart() {
    if (!selectedAppointment) return;
    setInSession(true);
  }

  function handleLeave() {
    setInSession(false);
    setSelectedAppointment("");
  }

  if (inSession && roomName) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Teleconsulta em andamento</h1>
            <p className="text-muted-foreground">
              {userRole === "PATIENT" ? "Profissional" : "Paciente"}:{" "}
              {otherPerson}
            </p>
          </div>
          <Badge variant="default">Jitsi Meet</Badge>
        </div>
        {userRole === "PROFESSIONAL" && (
          <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30">
            <Info className="h-4 w-4" />
            <AlertTitle>Você é o anfitrião</AlertTitle>
            <AlertDescription>
              Como profissional, você inicia a sala. Na primeira vez, o Jitsi
              pode pedir autenticação com Google ou GitHub para criar a sala. O
              paciente entrará automaticamente após você iniciar.
            </AlertDescription>
          </Alert>
        )}
        {userRole === "PATIENT" && (
          <Alert className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/30">
            <Info className="h-4 w-4" />
            <AlertTitle>Aguarde o profissional</AlertTitle>
            <AlertDescription>
              O profissional precisa iniciar a sala primeiro. Se a sala ainda
              não estiver ativa, aguarde alguns instantes e tente novamente.
            </AlertDescription>
          </Alert>
        )}
        <JitsiRoom
          roomName={roomName}
          displayTitle={`Teleconsulta VidaPlus — ${otherPerson}`}
          userName={userName}
          onLeave={handleLeave}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Telemedicina</h1>
        <p className="text-muted-foreground">
          Teleconsulta por vídeo — VidaPlus
        </p>
      </div>

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertTitle>Proteção de dados (LGPD)</AlertTitle>
        <AlertDescription>
          As sessões de teleconsulta utilizam salas seguras Jitsi Meet. Dados de
          vídeo e áudio não são armazenados pelo sistema VidaPlus.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Iniciar teleconsulta
          </CardTitle>
          <CardDescription>
            Selecione uma consulta agendada para entrar na sala de vídeo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {appointments.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhuma consulta agendada disponível para teleconsulta.
            </p>
          ) : (
            <>
              <Select
                value={selectedAppointment}
                onValueChange={(v) => setSelectedAppointment(v ?? "")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a consulta">
                    {appointment
                      ? `${
                          userRole === "PATIENT"
                            ? appointment.professionalName
                            : appointment.patientName
                        } — ${new Date(appointment.scheduledAt).toLocaleString(
                          "pt-BR",
                        )}`
                      : undefined}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {appointments.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {userRole === "PATIENT"
                        ? a.professionalName
                        : a.patientName}{" "}
                      — {new Date(a.scheduledAt).toLocaleString("pt-BR")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                onClick={handleStart}
                disabled={!selectedAppointment}
                className="w-full sm:w-auto"
              >
                <Video className="mr-2 h-4 w-4" />
                Entrar na sala
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
