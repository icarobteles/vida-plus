import { execSync } from "child_process";
import path from "path";

const ROOT = path.resolve(__dirname, "..");

export default async function globalTeardown() {
  execSync("npx tsx prisma/seed.ts", {
    stdio: "pipe",
    cwd: ROOT,
  });

  console.log("✓ Banco restaurado com seed (pós-testes)");
}
