import { headers } from "next/headers";
import TapPayProvider from "@/providers/tappay";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;

  return <TapPayProvider scriptNonce={nonce}>{children}</TapPayProvider>;
}
