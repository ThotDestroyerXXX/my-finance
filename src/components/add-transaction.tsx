import { IconCalendar, IconPlus } from "@tabler/icons-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { fetchCategoryTypeByUserId } from "@/hooks/user-hook";
import { toast } from "sonner";
import { Skeleton } from "./ui/skeleton";
import { Textarea } from "./ui/textarea";
import { Calendar } from "./ui/calendar";
import { Popover } from "./ui/popover";
import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { handleSubmitCreateIncome } from "@/hooks/account-hook";
import Spinner from "./ui/spinner";

export default function AddTransaction({
  user_id,
  account_id,
}: Readonly<{ user_id: string | undefined; account_id: string | undefined }>) {
  const { categoryTypes, isPending, isFetched, isError } =
    fetchCategoryTypeByUserId(user_id ?? "");
  const [date, setDate] = useState<Date | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { createIncome } = handleSubmitCreateIncome(setLoading, setOpen);
  if (isError) {
    toast.error("Error fetching category types");
  }
  if (isPending || !isFetched) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>
            <IconPlus />
            Add Transaction
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle hidden></DialogTitle>
            <Skeleton className="h-7 w-28" />
            <Skeleton className="h-7 w-full" />
          </DialogHeader>
          <div className="flex flex-col gap-5 py-4">
            <Skeleton className="h-7 w-full" />
            <Skeleton className="h-7 w-full" />
            <Skeleton className="h-7 w-full" />
            <Skeleton className="h-7 w-full" />
          </div>
          <DialogFooter>
            <Skeleton className="h-7 w-20" />
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  } else {
    return (
      <>
        {loading && <Spinner />}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <IconPlus />
              Add Transaction
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Transaction</DialogTitle>
              <DialogDescription>
                Add a new transaction to keep track of your expenses and income.
              </DialogDescription>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                createIncome(e, date, account_id ?? "", user_id ?? "");
              }}
            >
              <div className="flex flex-col gap-5 py-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name" className="text-right">
                    Transaction Type
                  </Label>
                  <Select name="transaction_type">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Transaction Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Income">Income</SelectItem>
                      <SelectItem value="Expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="category" className="text-right">
                    Category
                  </Label>
                  <Select name="category">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Transaction Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryTypes?.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id.toString()}
                        >
                          {category.icon_image}
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="amount" className="text-right">
                    Amount
                  </Label>
                  <Input name="amount" placeholder="transaction amount" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    name="description"
                    placeholder="transaction description"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Popover>
                    <PopoverTrigger asChild className="flex justify-between">
                      <Button
                        variant={"outline"}
                        className={cn(!date && "text-muted-foreground")}
                      >
                        {date?.toDateString() ?? "Transaction Date"}
                        <IconCalendar />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="bg-background outline-popover-foreground rounded-md outline-1">
                      <Calendar
                        mode="single"
                        selected={date ?? undefined}
                        onSelect={(date) => setDate(date ?? null)}
                        disabled={(date) => date > new Date()}
                        className="z-[10]"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </>
    );
  }
}
