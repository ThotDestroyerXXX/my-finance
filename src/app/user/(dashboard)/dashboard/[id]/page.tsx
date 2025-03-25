import BalanceCard from "@/components/balance-card";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import data from "../data.json";
import { paramHook } from "@/hooks/server-hook";
import { redirect } from "next/navigation";
import { toast } from "sonner";

export default async function Page({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const { session, param } = await paramHook(params);
  if (!session || !param) {
    toast.error("Account not found");
    redirect("/user/account-list");
  } else {
    return (
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
              <BalanceCard param={param} session={session} />
            </div>
            <SectionCards />
            <DataTable data={data} />
          </div>
        </div>
      </div>
    );
  }
}
