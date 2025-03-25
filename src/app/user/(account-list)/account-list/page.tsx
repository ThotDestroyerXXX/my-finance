"use client";
import AccountCard from "@/components/account-card";
import { CreateAccount } from "@/components/create-account";
import { Skeleton } from "@/components/ui/skeleton";
import Spinner from "@/components/ui/spinner";
import { useSession } from "@/hooks/use-session";
import { api } from "@/trpc/react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function AccountList() {
  const session = useSession();
  const {
    data: accounts,
    isPending,
    error,
  } = api.account.getAccountList.useQuery({
    user_id: session?.data?.user.id ?? "",
  });
  const [isNavigating, setIsNavigating] = useState(false);
  if (error) {
    toast.error(error.message);
  }
  return (
    <div className="flex flex-row flex-wrap justify-center gap-5 py-5">
      {isNavigating && <Spinner />}
      {isPending ? (
        <>
          <Skeleton className="h-[10rem] w-[20rem]" />
          <Skeleton className="h-[10rem] w-[20rem]" />
          <Skeleton className="h-[10rem] w-[20rem]" />
          <Skeleton className="h-[10rem] w-[20rem]" />
        </>
      ) : (
        <>
          {!error && <CreateAccount user_id={session?.data?.user.id} />}

          {accounts?.map((account) => (
            <Link
              key={account.id}
              href={`/user/dashboard/${account.id}`}
              onClick={() => setIsNavigating(true)}
            >
              <AccountCard key={account.id} {...account} />
            </Link>
          ))}
        </>
      )}
    </div>
  );
}
