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
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { IconUserCircle } from "@tabler/icons-react";
import { type Session } from "@/lib/auth";
import Link from "next/link";

export function EditProfile({
  session,
}: Readonly<{ session: Session | null }>) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <IconUserCircle />
          Edit
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit your profile</DialogTitle>
          <DialogDescription>
            Edit your profile information to keep it up to date
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              defaultValue={session?.user.name}
              className="col-span-3"
              type="text"
            />
          </div>
          <div className="flex flex-col gap-2">
            <div>
              <Link href="/user/change-email" className="w-full text-sm">
                Change my email
              </Link>
            </div>
            <div>
              <Link href="/user/change-password" className="w-full text-sm">
                Change my password
              </Link>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
