import AppShell from "@/components/shared/AppShell";
import DatasetClient from "@/components/admin/dataset/DatasetClient";
import { requireAdmin } from "@/lib/admin-auth";

export default async function AdminDatasetPage() {
  await requireAdmin();

  return (
    <AppShell variant="admin">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <DatasetClient />
      </div>
    </AppShell>
  );
}
