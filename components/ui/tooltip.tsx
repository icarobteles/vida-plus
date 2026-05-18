"use client";

import { cn } from "@/lib/utils";
import { useRef, useState } from "react";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  side?: "top" | "bottom";
}

export function Tooltip({ content, children, side = "top" }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  function show() {
    timeoutRef.current = setTimeout(() => setVisible(true), 300);
  }

  function hide() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setVisible(false);
  }

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      {children}
      {visible && (
        <div
          role="tooltip"
          className={cn(
            "absolute left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground px-2.5 py-1 text-xs text-background shadow-md animate-in fade-in-0 zoom-in-95",
            side === "top" ? "bottom-full mb-2" : "top-full mt-2",
          )}
        >
          {content}
          <span
            className={cn(
              "absolute left-1/2 -translate-x-1/2 border-4 border-transparent",
              side === "top"
                ? "top-full border-t-foreground"
                : "bottom-full border-b-foreground",
            )}
          />
        </div>
      )}
    </div>
  );
}
