import { getCurrentUser } from "@/lib/auth/dal";
import ProtectedSidebar from "./_components/ProtectedSidebar";
import ProtectedTopbar from "./_components/ProtectedTopbar";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <div className="bg-background min-h-screen lg:pl-64">
      <ProtectedSidebar user={user} />
      <div className="min-w-0">
        <ProtectedTopbar />
        <div className="min-h-[calc(100vh-57px)]">{children}</div>
      </div>
    </div>
  );
}
