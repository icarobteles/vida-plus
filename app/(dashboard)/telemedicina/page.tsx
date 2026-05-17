"use client";

import { useState } from "react";
import { Video, Mic, MicOff, VideoOff, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

export default function TelemedicinaPage() {
  const [connected, setConnected] = useState(false);
  const [videoOn, setVideoOn] = useState(true);
  const [micOn, setMicOn] = useState(true);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Telemedicina</h1>
        <p className="text-muted-foreground">
          Sala de teleconsulta simulada — VidaPlus
        </p>
      </div>
      <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950/30">
        <Shield className="h-4 w-4" />
        <AlertTitle>Simulação educacional</AlertTitle>
        <AlertDescription>
          Integração real exigiria API segura (ex.: Zoom Healthcare). Esta tela demonstra o fluxo de teleconsulta conforme o estudo de caso SGHSS.
        </AlertDescription>
      </Alert>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Sala de atendimento
          </CardTitle>
          <CardDescription>
            {connected ? "Conectado à sala virtual" : "Aguardando conexão"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className={`flex aspect-video items-center justify-center rounded-lg border-2 border-dashed ${
              connected
                ? "bg-emerald-950/20 border-emerald-500"
                : "bg-muted border-muted-foreground/30"
            }`}
          >
            {connected ? (
              <div className="text-center">
                <Badge className="mb-2">Em atendimento</Badge>
                <p className="text-lg font-medium">Dra. Ana Silva</p>
                <p className="text-sm text-muted-foreground">
                  {videoOn ? "Vídeo ativo" : "Vídeo desligado"} ·{" "}
                  {micOn ? "Áudio ativo" : "Áudio mudo"}
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground">Clique para iniciar a teleconsulta</p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {!connected ? (
              <Button onClick={() => setConnected(true)}>
                <Video className="mr-2 h-4 w-4" />
                Iniciar teleconsulta
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => setVideoOn(!videoOn)}
                >
                  {videoOn ? (
                    <VideoOff className="mr-2 h-4 w-4" />
                  ) : (
                    <Video className="mr-2 h-4 w-4" />
                  )}
                  {videoOn ? "Desligar vídeo" : "Ligar vídeo"}
                </Button>
                <Button variant="outline" onClick={() => setMicOn(!micOn)}>
                  {micOn ? (
                    <MicOff className="mr-2 h-4 w-4" />
                  ) : (
                    <Mic className="mr-2 h-4 w-4" />
                  )}
                  {micOn ? "Mutar" : "Ativar mic"}
                </Button>
                <Button variant="destructive" onClick={() => setConnected(false)}>
                  Encerrar chamada
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
