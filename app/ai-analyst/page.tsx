import { requireUser } from "@/lib/user-auth";
import AIAnalystClient from "./client";
import AppShell from "@/components/shared/AppShell";

export const metadata = {
  title: "AI Analyst | Eco Recycle",
  description: "Analisis sampah dengan AI model",
};

export default async function AIAnalystPage() {
  const session = await requireUser();

  return (
    <AppShell variant="user" userName={session.user?.name ?? "User"}>
      <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8 sm:py-8">
        <AIAnalystClient />
      </div>
    </AppShell>
  );
}