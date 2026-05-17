import { Activity } from "lucide-react";
import { LoginForm } from "@/components/login-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Shield } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-emerald-50 to-slate-100 p-4 dark:from-slate-950 dark:to-slate-900">
      <div className="mb-8 flex flex-col items-center gap-2 text-center">
        <Activity className="h-12 w-12 text-primary" />
        <h1 className="text-2xl font-bold">MedFlow</h1>
        <p className="text-sm text-muted-foreground">
          Sistema de Gestão Hospitalar — VidaPlus
        </p>
      </div>
      <LoginForm />
      <Alert className="mt-6 max-w-md border-emerald-200 bg-emerald-50/80">
        <Shield className="h-4 w-4" />
        <AlertTitle className="text-sm">LGPD</AlertTitle>
        <AlertDescription className="text-xs">
          Ambiente de demonstração. Não utilize dados reais de pacientes.
        </AlertDescription>
      </Alert>
    </div>
  );
}
