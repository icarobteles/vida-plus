"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Video, VideoOff, Mic, MicOff, PhoneOff } from "lucide-react";

interface MockVideoProps {
  roomName: string;
  userName: string;
  onLeave: () => void;
}

export function MockVideoRoom({ roomName, userName, onLeave }: MockVideoProps) {
  const [videoOn, setVideoOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(elapsed / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (elapsed % 60).toString().padStart(2, "0");

  return (
    <div className="space-y-4">
      <div className="relative aspect-video overflow-hidden rounded-lg border-2 border-emerald-500/50 bg-emerald-950/20">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            {videoOn ? (
              <>
                <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-600 text-3xl font-bold text-white">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <p className="text-lg font-medium text-white">{userName}</p>
              </>
            ) : (
              <>
                <VideoOff className="mx-auto mb-2 h-12 w-12 text-slate-500" />
                <p className="text-sm text-slate-400">Câmera desligada</p>
              </>
            )}
            <p className="mt-1 text-xs text-slate-400">
              {micOn ? "Microfone ativo" : "Microfone mudo"}
            </p>
          </div>
        </div>
        <div className="absolute left-3 top-3 flex gap-2">
          <Badge variant="secondary" className="bg-amber-600/80 text-white">
            Modo simulação
          </Badge>
        </div>
        <div className="absolute right-3 top-3">
          <Badge
            variant="secondary"
            className="bg-black/60 font-mono text-white"
          >
            {minutes}:{seconds}
          </Badge>
        </div>
        <div className="absolute bottom-3 left-3">
          <p className="text-xs text-slate-400">Sala: {roomName}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => setVideoOn(!videoOn)}>
          {videoOn ? (
            <VideoOff className="mr-2 h-4 w-4" />
          ) : (
            <Video className="mr-2 h-4 w-4" />
          )}
          {videoOn ? "Desligar câmera" : "Ligar câmera"}
        </Button>
        <Button variant="outline" onClick={() => setMicOn(!micOn)}>
          {micOn ? (
            <MicOff className="mr-2 h-4 w-4" />
          ) : (
            <Mic className="mr-2 h-4 w-4" />
          )}
          {micOn ? "Mutar" : "Ativar mic"}
        </Button>
        <Button variant="destructive" onClick={onLeave}>
          <PhoneOff className="mr-2 h-4 w-4" />
          Encerrar chamada
        </Button>
      </div>
    </div>
  );
}
