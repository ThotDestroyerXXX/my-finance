"use client";
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardAction,
  CardFooter,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { calculateBar, currency } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";
import { type MonthlyBudgetProps, type accountProps } from "@/lib/interface";
import Link from "next/link";
import CreateBudget from "./create-budget";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";

interface BalanceCardProps {
  account: accountProps | null | undefined;
  isPending: boolean;
  isFetched: boolean;
  setLoading: (loading: boolean) => void;
  monthlyBudget: MonthlyBudgetProps | undefined | null;
  monthlyExpense: string | 0 | undefined;
}

const BgColor = (value: string | 0 | undefined, total: string) => {
  if (calculateBar(value, total) >= 75) {
    return "bg-red-400";
  }
  if (calculateBar(value, total) >= 40) {
    return "bg-yellow-400";
  }
  return "bg-green-400";
};

const BalanceCard = ({
  account,
  isPending,
  isFetched,
  setLoading,
  monthlyBudget,
  monthlyExpense,
}: BalanceCardProps) => {
  return (
    <>
      {isPending || !isFetched ? (
        <Skeleton className="block h-[13rem] w-full" />
      ) : (
        <Card className="@container/card flex h-full w-full flex-col justify-center gap-5 text-justify">
          <CardHeader>
            <CardDescription className="text-foreground text-base">
              {account?.name}
            </CardDescription>
            <CardTitle className="text-base font-semibold tabular-nums @[250px]/card:text-3xl">
              {account?.currency_type}
              {currency(Number(account?.balance))}
            </CardTitle>
            <CardAction className="flex flex-row gap-4 max-[28rem]:flex-col max-[25rem]:gap-2">
              <Link
                href={`/user/dashboard/${account?.id}/income`}
                onClick={() => setLoading(true)}
              >
                <Badge
                  variant="outline"
                  className="h-7 w-24 text-sm max-[28rem]:text-xs"
                >
                  <IconTrendingUp />
                  Income
                </Badge>
              </Link>
              <Link
                href={`/user/dashboard/${account?.id}/expense`}
                onClick={() => setLoading(true)}
              >
                <Badge
                  variant="outline"
                  className="h-7 w-24 text-sm max-[28rem]:text-xs"
                >
                  <IconTrendingDown />
                  Expense
                </Badge>
              </Link>
            </CardAction>
          </CardHeader>
          <CardFooter className="text-md flex-col items-start gap-3">
            {monthlyBudget ? (
              <div className="line-clamp-1 flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label className="text-md">Monthly Budget : </Label>
                  <Label
                    className={`text-lg font-semibold ${Number(monthlyExpense) > Number(monthlyBudget.amount_limit) ? "text-red-500" : "text-foreground"}`}
                  >{`${account?.currency_type}${currency(Number(monthlyExpense)) ?? 0} of ${account?.currency_type}${currency(Number(monthlyBudget.amount_limit))}`}</Label>
                </div>
                <div>
                  <Progress
                    className="h-[0.7rem]"
                    indicatorColor={`${BgColor(monthlyExpense, monthlyBudget.amount_limit)}`}
                    value={
                      calculateBar(
                        monthlyExpense,
                        monthlyBudget.amount_limit,
                      ) <= 100
                        ? calculateBar(
                            monthlyExpense,
                            monthlyBudget.amount_limit,
                          )
                        : 100
                    }
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="line-clamp-1 flex gap-2 font-medium">
                  No monthly budget yet.
                </div>
                <CreateBudget
                  account_id={account?.id}
                  setLoading={setLoading}
                />
              </>
            )}
          </CardFooter>
        </Card>
      )}
    </>
  );
};

export default BalanceCard;
