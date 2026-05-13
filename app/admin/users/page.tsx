import AppShell from "@/components/shared/AppShell";
import UserManagementClient from "@/components/admin/users/UserManagementClient";
import { requireAdmin } from "@/lib/admin-auth";

export default async function AdminUsersPage() {
  const session = await requireAdmin();

  return (
    <AppShell variant="admin">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <UserManagementClient adminId={session.user?.id ?? ""} />
      </div>
    </AppShell>
  );
}
