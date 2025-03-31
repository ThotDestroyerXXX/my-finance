import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
} from "./ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";

export default function DropdownDeleteEdit({
  editContent,
  deleteContent,
}: Readonly<{
  editContent: React.ReactNode;
  deleteContent: React.ReactNode;
}>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <EllipsisVertical className="h-4 w-4 cursor-pointer" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        >
          {editContent}
          {deleteContent}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
