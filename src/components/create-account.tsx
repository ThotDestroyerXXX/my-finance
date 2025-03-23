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

export function CreateAccount({
  user_id,
}: Readonly<{ user_id: string | undefined }>) {
  const currencyCodes = getAllISOCodes();
  const currencySymbol = currencyCodes.map((currency) => currency.symbol);
  const currencyISO = currencyCodes.map((currency) => currency.iso);
  const accountTypes = fetchAllAccountTypes();
  const accountTypeIds = accountTypes?.accountTypes?.map((type) =>
    type.id.toString(),
  );
  const accountTypeNames = accountTypes?.accountTypes?.map((type) => type.name);
  const [selectedAccountType, setSelectedAccountType] = useState<string | null>(
    null,
  );
  const [selectedCurrencyType, setSelectedCurrencyType] = useState<
    string | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const createAccount = useCreateAccount(setError, setLoading);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="@container/card flex h-[10rem] w-[20rem] cursor-pointer flex-col items-center justify-center gap-1 text-center">
          <DiamondPlus className="h-7 w-7" />
          <CardDescription className="text-foreground text-base">
            Add Account
          </CardDescription>
        </Card>
      </DialogTrigger>
      {accountTypes.isPending ? (
        <DialogContent className="sm:max-w-[425px]">
          <DialogTitle hidden></DialogTitle>
          <Spinner />
        </DialogContent>
      ) : (
        <DialogContent className="sm:max-w-[425px]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              createAccount(
                e,
                user_id,
                selectedAccountType,
                selectedCurrencyType,
              );
            }}
          >
            <DialogHeader hidden={accountTypes.isPending}>
              <DialogTitle>Make Account</DialogTitle>
              <DialogDescription>
                Make a new Account to keep track of your expenses and income.
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
                />
              </div>
              <span className="text-sm text-red-500">{error}</span>
            </div>
            <DialogFooter hidden={accountTypes.isPending}>
              <Button type="submit" disabled={loading}>
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      )}
    </Dialog>
  );
}
