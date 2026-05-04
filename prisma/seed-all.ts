import { seedAdmin } from "./seed";
import { seedQuiz } from "./seed-quiz";

async function main(): Promise<void> {
  await seedAdmin();
  await seedQuiz();

  console.log("✅ Semua seeder berhasil dijalankan");
}

main().catch((error: unknown) => {
  console.error("❌ Seeder gagal:", error);
  process.exit(1);
});