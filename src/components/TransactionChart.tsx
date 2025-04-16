"use client";
import { useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { eachDayOfInterval, format } from "date-fns";

export default function TransactionChart({
  income,
  expense,
}: Readonly<{
  income: {
    totalIncome: string | null;
    transaction_date: string;
  }[];
  expense: {
    totalExpense: string | null;
    transaction_date: string;
  }[];
}>) {
  const [days, setDays] = useState<number | string>(90);

  const normalizedIncome = income.map((item) => ({
    date: item.transaction_date,
    income: Number(item.totalIncome) || 0,
    expense: 0, // No expense for income entries
  }));

  const normalizedExpense = expense.map((item) => ({
    date: item.transaction_date,
    income: 0, // No income for expense entries
    expense: Number(item.totalExpense) || 0,
  }));

  const combinedData = [...normalizedIncome, ...normalizedExpense].reduce(
    (acc, item) => {
      const existing = acc.find((entry) => entry.date === item.date);

      if (existing) {
        // Merge income and expense for the same date
        existing.income += item.income;
        existing.expense += item.expense;
      } else {
        // Add a new entry
        acc.push(item);
      }

      return acc;
    },
    [] as { date: string; income: number; expense: number }[],
  );

  const dateRange = eachDayOfInterval({
    start: new Date(
      Math.min(...combinedData.map((item) => new Date(item.date).getTime())),
    ),
    end: new Date(),
  }).map((date) => format(date, "yyyy-MM-dd"));

  // Sort the combined data by date in ascending order

  // Reverse the data to maintain the original order if needed
  const chartConfig = {
    income: {
      label: "Income",
    },
    expense: {
      label: "Expense",
    },
  } satisfies ChartConfig;

  const filledData = dateRange.map((date) => {
    const existing = combinedData.find((item) => item.date === date);
    return (
      existing ?? {
        date,
        income: 0,
        expense: 0,
      }
    );
  });

  const sortedData = filledData.slice().sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateA - dateB; // Ascending order
  });

  const filteredData = sortedData.filter((item) => {
    const date = new Date(item.date);
    const today = new Date();
    if (days === -1) return true; // Overall
    const diffDays = Math.floor(
      (today.getTime() - date.getTime()) / (1000 * 3600 * 24),
    );
    return diffDays <= Number(days); // Filter by days
  });

  return (
    <Card>
      <CardHeader className="flex flex-col items-center gap-3 space-y-0 border-b py-5 sm:flex-row">
        <div className="gap-1 text-center sm:text-left">
          <CardTitle>Area Chart - Interactive</CardTitle>
          <CardDescription>
            Showing total visitors for the last 3 months
          </CardDescription>
        </div>
        <Select value={days.toString() ?? "90"} onValueChange={setDays}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="7" className="rounded-lg">
              Last 7 days
            </SelectItem>
            <SelectItem value="30" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="90" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="-1" className="rounded-lg">
              Overall
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="red" stopOpacity={0.8} />
                <stop offset="95%" stopColor="red" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="green" stopOpacity={0.8} />
                <stop offset="95%" stopColor="green" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />
            <YAxis
              domain={[0, "auto"]} // Ensure the y-axis starts at 0
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="income"
              type="monotone"
              fill="url(#fillMobile)"
              stroke="green"
            />
            <Area
              dataKey="expense"
              type="monotone"
              fill="url(#fillDesktop)"
              stroke="red"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
