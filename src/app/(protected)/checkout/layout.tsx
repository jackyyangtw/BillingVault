import { getCurrentUser } from "@/lib/auth/dal";
import ProtectedTopbar from "../_components/ProtectedTopbar";

export default async function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <div className="bg-background min-h-screen">
      <div className="min-w-0">
        <ProtectedTopbar user={user} />
        <div className="min-h-[calc(100vh-57px)]">{children}</div>
      </div>
    </div>
  );
}
