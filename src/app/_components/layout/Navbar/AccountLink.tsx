import Link from "next/link";
import { CircleUserRound } from "lucide-react";

type AccountLinkProps = {
  userName: string;
};

export default function AccountLink({ userName }: AccountLinkProps) {
  return (
    <Link
      href="/account/billing"
      className="flex max-w-36 min-w-0 items-center gap-1.5"
    >
      <CircleUserRound data-icon="inline-start" />
      <span className="truncate">{userName}</span>
    </Link>
  );
}
