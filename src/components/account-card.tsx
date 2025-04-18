import { type accountProps } from "@/lib/interface";

import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardAction,
} from "./ui/card";
import { currency } from "@/lib/utils";
import { AlertDeleteAccount } from "./alert-delete-account";
import { CreateAccount } from "./create-account";
import Link from "next/link";
import { getISOByParam } from "iso-country-currency";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import DropdownDeleteEdit from "./dropdown-delete-edit";

const AccountCard = ({
  setLoading,
  account,
}: Readonly<{
  setLoading: (loading: boolean) => void;
  account: accountProps;
}>) => {
  return (
    <Link
      key={account.id}
      href={`/user/dashboard/${account.id}`}
      prefetch
      shallow
      onClick={() => setLoading(true)}
    >
      <Card className="@container/card flex h-full w-[20rem] flex-col justify-center gap-1 text-justify">
        <CardHeader>
          <CardDescription className="text-foreground text-base">
            {account.name}
          </CardDescription>
          <CardTitle className="text-base font-semibold break-all tabular-nums @[250px]/card:text-2xl">
            {account.currency_type}
            {currency(Number(account.balance))}
          </CardTitle>
          <CardAction
            onSelect={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            <DropdownDeleteEdit
              editContent={
                <CreateAccount
                  account_balance={account.balance}
                  account_id={account.id}
                  account_name={account.name}
                  currency_type={getISOByParam("symbol", account.currency_type)}
                  isUpdate={true}
                  user_account_type_id={account.user_account_type_id.toString()}
                  user_id={account.user_id}
                  icon={<IconEdit className="h-4 w-4" />}
                  setLoading={setLoading}
                />
              }
              deleteContent={
                <AlertDeleteAccount
                  account_id={account.id}
                  setLoading={setLoading}
                  icon={<IconTrash className="h-4 w-4" />}
                />
              }
            />
          </CardAction>
        </CardHeader>
      </Card>
    </Link>
  );
};

export default AccountCard;
