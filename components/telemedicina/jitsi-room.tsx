"use client";

import { useRef } from "react";
import { JitsiMeeting } from "@jitsi/react-sdk";
import { Badge } from "@/components/ui/badge";

interface JitsiRoomProps {
  roomName: string;
  userName: string;
  onLeave: () => void;
}

export function JitsiRoom({ roomName, userName, onLeave }: JitsiRoomProps) {
  const apiRef = useRef<unknown>(null);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Badge variant="default">Jitsi Meet — Sala ao vivo</Badge>
      </div>
      <div className="overflow-hidden rounded-lg border">
        <JitsiMeeting
          domain="meet.jit.si"
          roomName={roomName}
          userInfo={{ displayName: userName, email: "" }}
          configOverwrite={{
            startWithAudioMuted: true,
            startWithVideoMuted: false,
            prejoinPageEnabled: false,
            disableModeratorIndicator: true,
            toolbarButtons: [
              "microphone",
              "camera",
              "desktop",
              "chat",
              "raisehand",
              "tileview",
              "hangup",
            ],
          }}
          interfaceConfigOverwrite={{
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
            TOOLBAR_ALWAYS_VISIBLE: true,
            DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
          }}
          lang="ptBR"
          getIFrameRef={(node) => {
            node.style.height = "70vh";
            node.style.width = "100%";
          }}
          onApiReady={(api) => {
            apiRef.current = api;
          }}
          onReadyToClose={onLeave}
        />
      </div>
    </div>
  );
}
