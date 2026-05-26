import { getCurrentUser, verifySession } from "@/lib/auth/dal";
import ProtectedSidebar from "../_components/ProtectedSidebar";
import ProtectedTopbar from "../_components/ProtectedTopbar";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await verifySession();
  const user = await getCurrentUser();

  return (
    <div className="bg-background min-h-screen lg:pl-64">
      <ProtectedSidebar user={user} />
      <div className="min-w-0">
        <ProtectedTopbar user={user} />
        <div className="min-h-[calc(100vh-57px)]">{children}</div>
      </div>
    </div>
  );
}
