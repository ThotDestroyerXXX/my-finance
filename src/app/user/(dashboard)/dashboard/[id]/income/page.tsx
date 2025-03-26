"use client";
import IncomeTable from "@/components/income-table";
import { useState, useEffect } from "react";

export default function Income({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const [param, setParam] = useState<{ id: string } | null>(null);
  useEffect(() => {
    const fetchParam = async () => {
      return await params;
    };
    fetchParam()
      .then((param) => {
        setParam(param);
      })
      .catch(() => {
        setParam(null);
      });
  }, [params]);

  return (
    <div className="flex h-full w-full flex-col gap-6 p-6">
      <IncomeTable account_id={param?.id} />
    </div>
  );
}
