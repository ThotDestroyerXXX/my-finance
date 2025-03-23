"use client";
import AccountCard from "@/components/account-card";
import { CreateAccount } from "@/components/create-account";
import Spinner from "@/components/ui/spinner";
import { useSession } from "@/hooks/use-session";
import { api } from "@/trpc/react";

export default function AccountList() {
  const session = useSession();
  const { data: accounts, isPending } = api.account.getAccountList.useQuery({
    user_id: session?.data?.user.id ?? "",
  });

  return (
    <>
      {isPending ? (
        <div className="flex items-center justify-center text-center">
          <Spinner />
        </div>
      ) : (
        <div className="flex flex-row flex-wrap justify-center gap-5 p-5">
          <CreateAccount user_id={session?.data?.user.id} />
          {accounts?.map((account) => (
            <AccountCard key={account.id} {...account} />
          ))}
        </div>
      )}
    </>
  );
}
