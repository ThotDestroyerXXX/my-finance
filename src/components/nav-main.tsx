"use client";

import {
  IconDashboard,
  IconMail,
  IconMoneybagEdit,
  type Icon,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { CreditCard, TrendingDownIcon, TrendingUpIcon } from "lucide-react";

export function NavMain({
  items,
  account_id,
}: Readonly<{
  items: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
  account_id: string;
}>) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <Button>
              <IconMoneybagEdit />
              Review Money
            </Button>
            <Button
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
            >
              <IconMail />
              <span className="sr-only">Inbox</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          <Link href={`/user/dashboard/${account_id}`} prefetch={true} shallow>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <IconDashboard />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </Link>
          <Link
            href={`/user/dashboard/${account_id}/income`}
            prefetch={true}
            shallow
          >
            <SidebarMenuItem>
              <SidebarMenuButton>
                <TrendingUpIcon />
                <span>Income</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </Link>
          <Link
            href={`/user/dashboard/${account_id}/expense`}
            prefetch={true}
            shallow
          >
            <SidebarMenuItem>
              <SidebarMenuButton>
                <TrendingDownIcon />
                <span>Expense</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </Link>
          <Link href={`/user/account-list`} prefetch={true} shallow>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <CreditCard />
                <span>My Accounts</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </Link>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
