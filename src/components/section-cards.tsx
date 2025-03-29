import { IconTrendingUp } from "@tabler/icons-react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  calculateExpense,
  calculateIncome,
  calculateRate,
  currency,
} from "@/lib/utils";

export function SectionCards({
  income,
  expense,
  currencyType,
}: Readonly<{
  income: {
    totalIncome: string | null;
    transaction_date: string;
  }[];
  expense: {
    totalExpense: string | null;
    transaction_date: string;
  }[];
  currencyType: string;
}>) {
  return (
    <div className="data-[slot=card]:*:from-primary/5 data-[slot=card]:*:to-card dark:data-[slot=card]:*:bg-card grid grid-cols-1 gap-4 px-4 data-[slot=card]:*:bg-linear-to-t data-[slot=card]:*:shadow-2xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Net Income This Month</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {currencyType}
            {currency(calculateIncome(income) - calculateExpense(expense))}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {calculateIncome(income) - calculateExpense(expense) < 0
              ? "Expenses are higher than incomes"
              : "Incomes are higher than expenses"}
          </div>
          <div className="text-muted-foreground">
            {calculateIncome(income) - calculateExpense(expense) < 0
              ? "Be mindful of your expenses"
              : "Great job keeping your expenses low!"}
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Income This Month</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {currencyType}
            {currency(calculateIncome(income))}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {`${calculateRate(income.map(({ totalIncome, transaction_date }) => ({ totalTransaction: totalIncome, transaction_date })))}% from last month`}
          </div>
          <div className="text-muted-foreground">
            {`${calculateRate(income.map(({ totalIncome, transaction_date }) => ({ totalTransaction: totalIncome, transaction_date }))) < 0 ? "Don't give up! Keep working!" : "Great job increasing your income"}`}
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Expense This Month</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {currencyType}
            {currency(calculateExpense(expense))}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {`${calculateRate(expense.map(({ totalExpense, transaction_date }) => ({ totalTransaction: totalExpense, transaction_date })))}% from last month`}
          </div>
          <div className="text-muted-foreground">{`${calculateRate(expense.map(({ totalExpense, transaction_date }) => ({ totalTransaction: totalExpense, transaction_date }))) > 100 ? "Be mindful of your expenses" : "great job reducing your expenses"}`}</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Growth Rate</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            4.5%
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Compared to last month <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Meets growth projections</div>
        </CardFooter>
      </Card>
    </div>
  );
}
