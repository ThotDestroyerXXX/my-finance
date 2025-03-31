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
import { useState } from "react";
import { DropdownMenuItem } from "./ui/dropdown-menu";

interface BudgetProps {
  account_id: string | undefined;
  setLoading: (loading: boolean) => void;
  isUpdate?: boolean;
  defaultAmount?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  budget_id?: string;
  dropdown?: boolean;
}

export default function CreateBudget({
  account_id,
  setLoading,
  isUpdate,
  defaultAmount,
  placeholder,
  budget_id,
  dropdown,
}: Readonly<BudgetProps>) {
  const [open, setOpen] = useState<boolean>(false);
  const { createBudget } = handleSubmitMonthlyBudget(setLoading, setOpen);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {dropdown ? (
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            {placeholder ?? "Create"} Budget
          </DropdownMenuItem>
        ) : (
          <Button variant="default">{placeholder ?? "Create"} Budget</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form
          onSubmit={(e) => {
            e.stopPropagation();
            e.preventDefault();
            if (!isUpdate) {
              createBudget(e, account_id ?? "");
            } else {
              createBudget(e, account_id ?? "", isUpdate, budget_id);
            }
          }}
        >
          <DialogHeader>
            <DialogTitle>{placeholder ?? "Make"} Monthly Budget</DialogTitle>
            <DialogDescription>
              {placeholder ?? "Make a"} monthly budget for your account to track
              your expenses and income.
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
                defaultValue={defaultAmount ?? ""}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={(e) => e.stopPropagation()}>
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
