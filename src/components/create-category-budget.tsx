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
import { handleSubmitCategoryBudget } from "@/hooks/budget-hook";
import { useState } from "react";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { Card, CardDescription } from "./ui/card";
import { DiamondPlus } from "lucide-react";
import { fetchCategoryTypeByUserId } from "@/hooks/user-hook";
import { toast } from "sonner";
import { Skeleton } from "./ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import AddCategory from "./add-category";
import DropdownDeleteEdit from "./dropdown-delete-edit";
import { AlertDeleteCategory } from "./alert-delete-category";

interface BudgetProps {
  user_id: string | undefined;
  setLoading: (loading: boolean) => void;
  isUpdate?: boolean;
  defaultAmount?: string;
  placeholder?: string;
  category_id?: string;
  budget_id?: string;
  icon?: React.ReactNode;
}

export default function CreateCategoryBudget({
  user_id,
  setLoading,
  isUpdate,
  defaultAmount,
  category_id,
  placeholder,
  budget_id,
  icon,
}: Readonly<BudgetProps>) {
  const [open, setOpen] = useState<boolean>(false);
  const { categoryTypes, isPending, isFetched, isError } =
    fetchCategoryTypeByUserId(user_id ?? "");
  const { createCategoryBudget } = handleSubmitCategoryBudget(
    setLoading,
    setOpen,
  );
  const [selectOpen, setSelectOpen] = useState(false);

  if (isError) {
    toast.error("Error fetching category types");
  }
  if (isPending || !isFetched) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {isUpdate ? (
            <DropdownMenuItem
              onSelect={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
              className="flex cursor-pointer flex-row items-center gap-2 rounded-sm p-1 hover:bg-blue-500 hover:text-white"
            >
              {icon}
              Edit
            </DropdownMenuItem>
          ) : (
            <Card className="@container/card flex h-[9rem] w-[22rem] cursor-pointer flex-col items-center justify-center gap-1 text-center">
              <DiamondPlus className="h-7 w-7" />
              <CardDescription className="text-foreground text-base">
                {isUpdate ? "Update" : "Add"} Category Budget
              </CardDescription>
            </Card>
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
            <DropdownMenuItem
              onSelect={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
              className="flex cursor-pointer flex-row items-center gap-2 rounded-sm p-1 hover:bg-blue-500 hover:text-white"
            >
              {icon}
              Edit
            </DropdownMenuItem>
          ) : (
            <Card className="@container/card flex h-[9rem] w-[22rem] cursor-pointer flex-col items-center justify-center gap-1 text-center">
              <DiamondPlus className="h-7 w-7" />
              <CardDescription className="text-foreground text-base">
                {isUpdate ? "Update" : "Add"} Category Budget
              </CardDescription>
            </Card>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (isUpdate) {
                createCategoryBudget(e, user_id ?? "", budget_id);
              } else {
                createCategoryBudget(e, user_id ?? "");
              }
            }}
          >
            <DialogHeader>
              <DialogTitle>{placeholder ?? "Make"} Category Budget</DialogTitle>
              <DialogDescription>
                {placeholder ?? "Make a"} Category budget for your account to
                track your expenses and income.
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
              <div className="flex flex-col gap-2">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Select
                  name="category"
                  defaultValue={category_id}
                  open={selectOpen}
                  onOpenChange={() => setSelectOpen(true)}
                  defaultOpen={false}
                  onValueChange={(value) => {
                    if (isNaN(Number(value))) {
                      setSelectOpen(true);
                    } else {
                      setSelectOpen(false);
                    }
                  }}
                >
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
