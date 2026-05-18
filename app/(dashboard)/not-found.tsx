import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

export default function DashboardNotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-20">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <FileQuestion className="h-8 w-8 text-muted-foreground" />
      </div>
      <div className="text-center">
        <h2 className="text-lg font-semibold">Página não encontrada</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          O recurso que você procura não existe ou foi removido.
        </p>
      </div>
      <Button variant="outline">
        <Link href="/dashboard">Voltar ao dashboard</Link>
      </Button>
    </div>
  );
}
