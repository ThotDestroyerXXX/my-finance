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
import { DropdownMenuItem } from "./ui/dropdown-menu";
import AddCategory from "./add-category";
import DropdownDeleteEdit from "./dropdown-delete-edit";
import { AlertDeleteCategory } from "./alert-delete-category";

interface TransactionProps {
  user_id?: string;
  account_id: string | undefined;
  transaction_type?: string;
  category_id?: string;
  amount?: string;
  transaction_date?: string;
  description?: string;
  placeholder?: string;
  isUpdate?: boolean;
  transaction_id?: string;
  setLoading: (loading: boolean) => void;
}

export default function AddTransaction({
  user_id,
  account_id,
  transaction_type,
  category_id,
  amount,
  transaction_date,
  description,
  placeholder,
  isUpdate,
  transaction_id,
  setLoading,
}: Readonly<TransactionProps>) {
  const { categoryTypes, isPending, isFetched, isError } =
    fetchCategoryTypeByUserId(user_id ?? "");

  const [date, setDate] = useState<Date | null>(
    transaction_date ? new Date(transaction_date) : null,
  );

  const [open, setOpen] = useState<boolean>(false);

  const { createIncome } = handleSubmitCreateIncome(setLoading, setOpen);

  if (isError) {
    toast.error("Error fetching category types");
  }
  if (isPending || !isFetched) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {isUpdate ? (
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              {placeholder ?? "Add"}
            </DropdownMenuItem>
          ) : (
            <Button>
              <IconPlus />
              {placeholder ?? "Add"} Transaction
            </Button>
          )}
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
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {isUpdate ? (
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              {placeholder ?? "Add"}
            </DropdownMenuItem>
          ) : (
            <Button>
              <IconPlus />
              {placeholder ?? "Add"} Transaction
            </Button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{placeholder ?? "Add"} Transaction</DialogTitle>
            <DialogDescription>
              {placeholder ?? "Add a new"} transaction to keep track of your
              expenses and income.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.stopPropagation();
              e.preventDefault();
              if (isUpdate) {
                createIncome(
                  e,
                  date,
                  account_id ?? "",
                  user_id ?? "",
                  isUpdate,
                  transaction_id,
                );
              } else {
                createIncome(e, date, account_id ?? "", user_id ?? "");
              }
            }}
          >
            <div className="flex flex-col gap-5 py-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name" className="text-right">
                  Transaction Type
                </Label>
                <Select name="transaction_type" defaultValue={transaction_type}>
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
                <Select name="category" defaultValue={category_id}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Transaction Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <AddCategory user_id={user_id} setLoading={setLoading} />
                    {categoryTypes?.map((category) => (
                      <div
                        key={category.id}
                        className="hover:bg-accent hover:text-accent-foreground flex w-full cursor-pointer flex-row items-center justify-between rounded-sm px-2 py-1"
                      >
                        <SelectItem
                          value={category.id.toString()}
                          className="cursor-pointer"
                        >
                          {category.icon_image}
                          {category.name}
                        </SelectItem>
                        {category.user_id && (
                          <DropdownDeleteEdit
                            editContent={
                              <AddCategory
                                setLoading={setLoading}
                                user_id={user_id}
                                category_id={category.id.toString()}
                                category_name={category.name}
                                icon={category.icon_image}
                                isUpdate={true}
                                placeholder="Update"
                              />
                            }
                            deleteContent={
                              <AlertDeleteCategory
                                category_id={category.id.toString()}
                                setLoading={setLoading}
                                user_id={user_id}
                              />
                            }
                          />
                        )}
                      </div>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="amount" className="text-right">
                  Amount
                </Label>
                <Input
                  name="amount"
                  placeholder="transaction amount"
                  defaultValue={amount}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  name="description"
                  placeholder="transaction description"
                  defaultValue={description}
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
              <Button type="submit" onClick={(e) => e.stopPropagation()}>
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  }
}
