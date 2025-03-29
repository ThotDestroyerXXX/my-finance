"use client";
import AccountCard from "@/components/account-card";
import { CreateAccount } from "@/components/create-account";
import { Skeleton } from "@/components/ui/skeleton";
import Spinner from "@/components/ui/spinner";
import { useSession } from "@/hooks/use-session";
import { api } from "@/trpc/react";
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
  const [loading, setLoading] = useState(false);
  if (error) {
    toast.error(error.message);
  }
  return (
    <div className="flex flex-row flex-wrap justify-center gap-5 py-5">
      {loading && <Spinner />}
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
            <AccountCard
              key={account.id}
              setLoading={setLoading}
              account={account}
            />
          ))}
        </>
      )}
    </div>
  );
}
