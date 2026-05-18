"use client";

import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Tooltip } from "@/components/ui/tooltip";

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
}

export function NotificationsPopover({
  notifications,
}: {
  notifications: Notification[];
}) {
  const [open, setOpen] = useState(false);
  const count = notifications.length;

  return (
    <>
      <Tooltip content="Notificações">
        <button
          onClick={() => setOpen(true)}
          className="relative inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-input bg-background hover:bg-muted"
          aria-label={`${count} notificação(ões)`}
        >
          <Bell className="h-4 w-4" />
          {count > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-white">
              {count}
            </span>
          )}
        </button>
      </Tooltip>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notificações</DialogTitle>
          </DialogHeader>
          {notifications.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              Nenhuma notificação no momento.
            </p>
          ) : (
            <div className="max-h-80 space-y-3 overflow-y-auto">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="flex items-start gap-3 rounded-lg border p-3"
                >
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Bell className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{n.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {n.description}
                    </p>
                    <Badge variant="outline" className="mt-1 text-[10px]">
                      {n.time}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
