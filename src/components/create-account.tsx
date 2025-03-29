import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardDescription } from "./ui/card";
import { DiamondPlus } from "lucide-react";
import { ComboboxDemo } from "./combobox";
import { getAllISOCodes } from "iso-country-currency";
import { fetchAllAccountTypes, useCreateAccount } from "@/hooks/account-hook";
import Spinner from "./ui/spinner";
import { useState } from "react";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";

export function CreateAccount({
  user_id,
  account_name,
  account_balance,
  currency_type,
  user_account_type_id,
  account_id,
  isUpdate,
  icon,
}: Readonly<{
  user_id?: string;
  account_name?: string;
  account_balance?: string;
  currency_type?: string;
  user_account_type_id?: string;
  account_id?: string;
  isUpdate?: boolean;
  icon?: React.ReactNode;
}>) {
  const currencyCodes = getAllISOCodes();
  const currencySymbol = currencyCodes.map((currency) => currency.symbol);
  const currencyISO = currencyCodes.map((currency) => currency.iso);
  const accountTypes = fetchAllAccountTypes();
  const accountTypeIds = accountTypes?.accountTypes?.map((type) =>
    type.id.toString(),
  );
  const accountTypeNames = accountTypes?.accountTypes?.map((type) => type.name);
  const [selectedAccountType, setSelectedAccountType] = useState<string | null>(
    user_account_type_id ?? null,
  );
  const [selectedCurrencyType, setSelectedCurrencyType] = useState<
    string | null
  >(currency_type ?? null);
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const createAccount = useCreateAccount(setLoading, setOpen);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isUpdate ? (
          <DropdownMenuItem
            onSelect={(e) => {
              e.stopPropagation();
              e.stopPropagation();
              e.stopPropagation();
              e.preventDefault();
            }}
            className="flex cursor-pointer flex-row items-center gap-2 rounded-sm p-1 hover:bg-blue-500 hover:text-white"
          >
            {icon}
            Edit
          </DropdownMenuItem>
        ) : (
          <Card className="@container/card flex w-[20rem] cursor-pointer flex-col items-center justify-center gap-1 text-center">
            <DiamondPlus className="h-7 w-7" />
            <CardDescription className="text-foreground text-base">
              {isUpdate ? "Update" : "Add"} Account
            </CardDescription>
          </Card>
        )}
      </DialogTrigger>
      {accountTypes.isPending ? (
        <DialogContent className="flex flex-col items-center justify-center sm:max-w-[425px]">
          <DialogTitle hidden></DialogTitle>
          <Spinner />
        </DialogContent>
      ) : (
        <DialogContent className="sm:max-w-[425px]">
          <form
            onSubmit={(e) => {
              e.stopPropagation();
              e.preventDefault();

              if (isUpdate) {
                createAccount(
                  e,
                  user_id,
                  selectedAccountType,
                  selectedCurrencyType,
                  isUpdate,
                  account_id,
                );
              } else {
                createAccount(
                  e,
                  user_id,
                  selectedAccountType,
                  selectedCurrencyType,
                );
              }
            }}
          >
            <DialogHeader hidden={accountTypes.isPending}>
              <DialogTitle>{isUpdate ? "Update" : "Make"} Account</DialogTitle>
              <DialogDescription>
                {isUpdate ? "Update" : "Make a new"} Account to keep track of
                your expenses and income.
              </DialogDescription>
            </DialogHeader>

            <div
              className="flex flex-col gap-4 py-4"
              hidden={accountTypes.isPending}
            >
              <div className="flex flex-col gap-2">
                <Label htmlFor="name" className="text-right">
                  Account Name
                </Label>
                <Input
                  id="name"
                  className="col-span-3"
                  placeholder="Enter account name"
                  type="text"
                  name="name"
                  defaultValue={account_name}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="balance" className="text-right">
                  Account Balance
                </Label>
                <Input
                  id="balance"
                  className="col-span-3"
                  step={0.01}
                  placeholder="Enter initial balance"
                  type="number"
                  name="balance"
                  defaultValue={account_balance}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="currencyType" className="text-right">
                  Currency Type
                </Label>
                <ComboboxDemo
                  values={currencyISO}
                  label={currencySymbol}
                  key={"currency_type"}
                  onSelect={(value) => setSelectedCurrencyType(value)}
                  defaultValue={currency_type}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="accountType" className="text-right">
                  Account Type
                </Label>
                <ComboboxDemo
                  values={accountTypeIds}
                  label={accountTypeNames}
                  key={"user_account_type"}
                  onSelect={(value) => setSelectedAccountType(value)}
                  defaultValue={user_account_type_id}
                />
              </div>
            </div>
            <DialogFooter hidden={accountTypes.isPending}>
              <Button
                type="submit"
                disabled={loading}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      )}
    </Dialog>
  );
}
