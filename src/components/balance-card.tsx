import { type accountProps } from "@/lib/interface";
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
import { currency } from "@/lib/utils";
import { Button } from "./ui/button";

const BalanceCard = (account: accountProps) => {
  return (
    <Card className="@container/card flex h-full w-full flex-col justify-center gap-5 text-justify">
      <CardHeader>
        <CardDescription className="text-foreground text-base">
          {account.name}
        </CardDescription>
        <CardTitle className="text-base font-semibold tabular-nums @[250px]/card:text-3xl">
          {account.currency_type}
          {currency(Number(account.balance))}
        </CardTitle>
        <CardAction className="flex flex-row gap-4 max-[25rem]:flex-col max-[25rem]:gap-2">
          <Badge
            variant="outline"
            className="h-7 w-20 text-sm max-[25rem]:text-xs"
          >
            <IconTrendingUp />
            Income
          </Badge>
          <Badge
            variant="outline"
            className="h-7 w-20 text-sm max-[25rem]:text-xs"
          >
            <IconTrendingDown />
            Expense
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-3 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          No monthly budget yet.
        </div>
        <div className="text-muted-foreground">
          <Button variant="default">Create Budget</Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default BalanceCard;
