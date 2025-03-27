"use client";
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { handleSubmitMonthlyBudget } from "@/hooks/budget-hook";

export default function CreateBudget({
  account_id,
  setLoading,
}: Readonly<{
  account_id: string | undefined;
  setLoading: (loading: boolean) => void;
}>) {
  const { createBudget } = handleSubmitMonthlyBudget(setLoading);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Create Budget</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={(e) => createBudget(e, account_id ?? "")}>
          <DialogHeader>
            <DialogTitle>Make Monthly Budget</DialogTitle>
            <DialogDescription>
              Make a monthly budget for your account to track your expenses and
              income.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="amount" className="text-right">
                Budget Amount
              </Label>
              <Input
                id="amount"
                className="col-span-3"
                placeholder="Enter budget amount"
                type="text"
                name="amount"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
