import { Activity } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 py-20">
      <Activity className="h-8 w-8 animate-pulse text-primary" />
      <p className="text-sm text-muted-foreground">Carregando...</p>
    </div>
  );
}
