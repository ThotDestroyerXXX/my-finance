import { type accountProps } from "@/lib/interface";
import { IconTrendingUp } from "@tabler/icons-react";

import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardFooter,
} from "./ui/card";
import { currency } from "@/lib/utils";

const AccountCard = (account: accountProps) => {
  return (
    <Card className="@container/card flex h-full w-[20rem] flex-col justify-center gap-1 text-justify">
      <CardHeader>
        <CardDescription className="text-foreground text-base">
          {account.name}
        </CardDescription>
        <CardTitle className="text-base font-semibold break-all tabular-nums @[250px]/card:text-2xl">
          {account.currency_type}
          {currency(Number(account.balance))}
        </CardTitle>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          Trending up this month <IconTrendingUp className="size-4" />
        </div>
        <div className="text-muted-foreground">
          Visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
};

export default AccountCard;
