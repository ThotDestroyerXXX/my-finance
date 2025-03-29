import { type MonthlyChart } from "@/lib/interface";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";
import { Pie, PieChart } from "recharts";
import { Skeleton } from "./ui/skeleton";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { currency } from "@/lib/utils";

export default function MonthlyChart({
  transactions,
  isPending,
  isFetched,
  transactionAmount,
  placeholder,
}: Readonly<MonthlyChart>) {
  const chartData2 =
    transactions?.reduce(
      (acc, transaction) => {
        const category = transaction.category.name;
        const existingCategory = acc.find((item) => item.category === category);

        if (existingCategory) {
          // If the category already exists, aggregate the amount
          existingCategory.amount += Number(transaction.transaction.amount);
        } else {
          // If the category doesn't exist, add a new entry
          acc.push({
            category,
            amount: Number(transaction.transaction.amount),
            fill: `var(--chart-${transaction.category.id})`,
          });
        }

        return acc;
      },
      [] as { category: string; amount: number; fill: string }[],
    ) ?? [];

  const chartConfig2 =
    transactions?.reduce((config: ChartConfig, transaction) => {
      config[transaction.category.name] = {
        label: transaction.category.name,
        color: `hsl(var(--chart-${transaction.category.id}))`,
      };
      return config;
    }, {} satisfies ChartConfig) ?? {};

  return (
    <>
      {isPending || !isFetched || !transactions ? (
        <Skeleton className="h-[20rem] w-full" />
      ) : (
        <Card className="flex w-full min-w-[10rem] flex-col gap-5 text-center">
          <CardHeader>
            <CardTitle className="text-muted-foreground text-lg">
              Your {placeholder} This Month
            </CardTitle>
            <CardDescription className="text-foreground text-xl font-semibold break-all tabular-nums">
              {transactions[0]?.user_account.currency_type}
              {currency(Number(transactionAmount))}
            </CardDescription>
          </CardHeader>
          <ChartContainer
            config={chartConfig2 ?? {}}
            className="aspect-square max-h-[10rem] min-h-[5rem]"
          >
            <PieChart width={400} height={400}>
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideLabel
                    className="w-full"
                    currency={transactions[0]?.user_account.currency_type}
                  />
                }
              />
              <Pie
                data={chartData2}
                dataKey="amount"
                nameKey="category"
                innerRadius={60}
                color="#8884d8"
                outerRadius={80}
              />
            </PieChart>
          </ChartContainer>
          <CardFooter className="flex flex-row flex-wrap justify-center gap-3">
            {chartData2.map((entry, index) => (
              <div
                key={`cell-${index}-${entry.category}`}
                className="flex items-center gap-1"
              >
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: entry.fill }}
                ></div>
                <span className="text-xs">{entry.category}</span>
              </div>
            ))}
          </CardFooter>
        </Card>
      )}
    </>
  );
}
