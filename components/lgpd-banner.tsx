"use client";

import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { useCallback, useState, useSyncExternalStore } from "react";

const LGPD_KEY = "vidaplus-lgpd-consent";

function useHasConsent() {
  const subscribe = useCallback((cb: () => void) => {
    window.addEventListener("storage", cb);
    return () => window.removeEventListener("storage", cb);
  }, []);
  return useSyncExternalStore(
    subscribe,
    () => localStorage.getItem(LGPD_KEY) !== null,
    () => true,
  );
}

export function LgpdBanner() {
  const hasConsent = useHasConsent();
  const [dismissed, setDismissed] = useState(false);

  function accept() {
    localStorage.setItem(LGPD_KEY, "accepted");
    setDismissed(true);
  }

  if (hasConsent || dismissed) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-card p-4 shadow-lg">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-3 sm:flex-row">
        <Shield className="h-6 w-6 shrink-0 text-primary" />
        <div className="flex-1 text-center sm:text-left">
          <p className="text-sm font-medium">
            Proteção de Dados — LGPD (Lei 13.709/2018)
          </p>
          <p className="text-xs text-muted-foreground">
            Este sistema é um ambiente de demonstração acadêmica. Não
            armazenamos dados pessoais reais. Ao continuar, você concorda com o
            uso de dados fictícios para fins educacionais conforme a Lei Geral
            de Proteção de Dados.
          </p>
        </div>
        <Button size="sm" onClick={accept} className="shrink-0">
          Entendi e aceito
        </Button>
      </div>
    </div>
  );
}
