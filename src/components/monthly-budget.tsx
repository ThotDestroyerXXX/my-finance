import { calculateBar, currency } from "@/lib/utils";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";
import { type MonthlyBudgetProps, type accountProps } from "@/lib/interface";
import CreateBudget from "./create-budget";
import Spinner from "./ui/spinner";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import { DeleteAlert } from "./delete-alert";

interface MonthlyProps {
  monthlyBudget: MonthlyBudgetProps | undefined | null;
  monthlyExpense: string | 0 | undefined;
  account: accountProps | null | undefined;
  setLoading: (loading: boolean) => void;
  isPending: boolean;
  isFetched: boolean;
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

export default function MonthlyBudget({
  account,
  monthlyBudget,
  monthlyExpense,
  setLoading,
  isPending,
  isFetched,
}: Readonly<MonthlyProps>) {
  return (
    <>
      {isPending || !isFetched ? (
        <Spinner />
      ) : (
        <Card className="@container/card flex h-full w-full flex-col justify-center gap-5 py-6 text-justify">
          <CardHeader>
            {monthlyBudget ? (
              <>
                <CardDescription className="text-foreground text-sm @md/card:text-base">
                  Monthly Budget
                </CardDescription>
                <CardTitle className="flex flex-col gap-7 text-lg font-semibold break-all tabular-nums @md/card:text-3xl">
                  <div>
                    {`${account?.currency_type}${currency(Number(monthlyExpense)) ?? 0} of ${account?.currency_type}${currency(Number(monthlyBudget.amount_limit))}`}
                  </div>
                  <div>
                    <Progress
                      className="h-[0.7rem] max-sm:h-[0.5rem]"
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
                </CardTitle>
                <CardAction>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <EllipsisVertical className="h-5 w-5 cursor-pointer" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuGroup>
                        <CreateBudget
                          account_id={account?.id}
                          setLoading={setLoading}
                          isUpdate={true}
                          dropdown={true}
                          placeholder="Update"
                          defaultAmount={monthlyBudget.amount_limit}
                          budget_id={monthlyBudget.id}
                        />
                        <DeleteAlert
                          account_id={account?.id}
                          setLoading={setLoading}
                          monthly_budget_id={monthlyBudget.id}
                        />
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  {/* <CreateBudget
                    account_id={account?.id}
                    setLoading={setLoading}
                    isUpdate={true}
                    placeholder="Update"
                    defaultAmount={monthlyBudget.amount_limit}
                    icon={
                      <IconEdit className="h-5 w-5 cursor-pointer @md:h-7 @md:w-7" />
                    }
                    budget_id={monthlyBudget.id}
                  /> */}
                </CardAction>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3">
                <Label className="text-md @md:text-xl">
                  No monthly budget yet.
                </Label>
                <CreateBudget
                  account_id={account?.id}
                  setLoading={setLoading}
                />
              </div>
            )}
          </CardHeader>
        </Card>
      )}
    </>
  );
}
