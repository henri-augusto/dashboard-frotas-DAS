import { getAdminSession } from "@/lib/auth";
import { AdminShell } from "@/components/layout/admin-shell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getAdminSession();

  if (!admin) {
    return <>{children}</>;
  }

  return <AdminShell>{children}</AdminShell>;
}
