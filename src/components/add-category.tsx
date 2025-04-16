"use client";
import { IconPlus } from "@tabler/icons-react";
import EmojiPicker, { Theme } from "emoji-picker-react";
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
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { useRef, useState } from "react";
import { createCategory } from "@/hooks/category-hook";

export default function AddCategory({
  user_id,
  placeholder,
  isUpdate,
  category_id,
  category_name,
  icon,
  setLoading,
}: Readonly<{
  user_id: string | undefined;
  placeholder?: string;
  isUpdate?: boolean;
  category_id?: string;
  category_name?: string;
  icon?: string;
  setLoading: (loading: boolean) => void;
}>) {
  const [open, setOpen] = useState(false);
  const [iconValue, setIconValue] = useState<string>(icon ?? "");
  const categoryNameValue = useRef<string>(category_name ?? "");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { handleCreate } = createCategory(setLoading, setDialogOpen);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen} modal>
      <DialogTrigger asChild>
        {isUpdate ? (
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            {placeholder ?? "Add"}
          </DropdownMenuItem>
        ) : (
          <Button className="w-full" variant="ghost">
            <IconPlus />
            {placeholder ?? "Add"} Category
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
        <div className="flex flex-col gap-5 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name" className="text-right">
              Category Name
            </Label>
            <Input
              name="name"
              placeholder="category name"
              onChange={(e) => (categoryNameValue.current = e.target.value)}
              defaultValue={categoryNameValue.current}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="icon" className="text-right">
              Category Icon
            </Label>
            <Input
              name="icon"
              placeholder="category icon"
              onClick={() => setOpen(true)}
              readOnly
              value={iconValue}
            />
            <EmojiPicker
              lazyLoadEmojis
              open={open}
              searchPlaceHolder="search emoji..."
              theme={Theme.AUTO}
              onEmojiClick={(emoji) => {
                setIconValue(emoji.emoji);
                setOpen(false);
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={(e) => {
              e.preventDefault();
              handleCreate(
                categoryNameValue.current,
                iconValue,
                user_id,
                isUpdate,
                category_id,
              );
            }}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
