"use client";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { type accountProps } from "@/lib/interface";
import data from "../data.json";
import Spinner from "@/components/ui/spinner";
import BalanceCard from "@/components/balance-card";

export default function Dashboard({
  account,
}: Readonly<{ account: accountProps | undefined | null }>) {
  return (
    <div className="flex flex-1 flex-col">
      {!account ? (
        <Spinner />
      ) : (
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
              <BalanceCard {...account} />
            </div>
            <SectionCards />
            <DataTable data={data} />
          </div>
        </div>
      )}
    </div>
  );
}
