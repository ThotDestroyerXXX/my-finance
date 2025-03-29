"use client";
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardFooter,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { currency } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";
import { type accountProps } from "@/lib/interface";
import Link from "next/link";

interface BalanceCardProps {
  account: accountProps | null | undefined;
  isPending: boolean;
  isFetched: boolean;
  setLoading: (loading: boolean) => void;
}

const BalanceCard = ({
  account,
  isPending,
  isFetched,
  setLoading,
}: BalanceCardProps) => {
  return (
    <>
      {isPending || !isFetched ? (
        <Skeleton className="block h-[13rem] w-full" />
      ) : (
        <Card className="@container/card flex h-full w-full flex-col justify-center gap-5 py-6 text-justify">
          <CardHeader>
            <CardDescription className="text-foreground text-sm @md/card:text-base">
              {account?.name}
            </CardDescription>
            <CardTitle className="text-lg font-semibold break-all tabular-nums @md/card:text-3xl">
              {account?.currency_type}
              {currency(Number(account?.balance))}
            </CardTitle>
          </CardHeader>
          <CardFooter className="text-md flex-col items-start gap-3">
            <div className="flex justify-between gap-2">
              <Link
                href={`/user/dashboard/${account?.id}/income`}
                onClick={() => setLoading(true)}
                prefetch
                shallow
              >
                <Badge
                  variant="outline"
                  className="hover:bg-muted h-7 w-full text-sm max-[28rem]:text-xs"
                >
                  <IconTrendingUp />
                  Income
                </Badge>
              </Link>
              <Link
                href={`/user/dashboard/${account?.id}/expense`}
                onClick={() => setLoading(true)}
                prefetch
                shallow
              >
                <Badge
                  variant="outline"
                  className="hover:bg-muted h-7 w-full text-sm max-[28rem]:text-xs"
                >
                  <IconTrendingDown />
                  Expense
                </Badge>
              </Link>
            </div>
          </CardFooter>
        </Card>
      )}
    </>
  );
};

export default BalanceCard;
