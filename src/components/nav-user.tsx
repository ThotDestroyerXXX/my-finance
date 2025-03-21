"use client";

import {
  IconCreditCard,
  IconDotsVertical,
  IconLogout,
  IconNotification,
  IconUserCircle,
} from "@tabler/icons-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Session } from "@/lib/auth";
import Link from "next/link";
import { Button } from "./ui/button";
import useSignOut from "@/app/api/sign-out/sign-out";
import { useState } from "react";

export function NavUser({ session }: Readonly<{ session: Session | null }>) {
  const { isMobile } = useSidebar();
  const { signOut } = useSignOut();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {session ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size='lg'
                className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
              >
                <Avatar className='h-8 w-8 rounded-lg grayscale'>
                  <AvatarImage src={"@/app/assets/chad.jpg"} alt='tes' />
                  <AvatarFallback className='rounded-lg'>CN</AvatarFallback>
                </Avatar>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-medium'>
                    {session?.user.name}
                  </span>
                  <span className='text-muted-foreground truncate text-xs'>
                    {session?.user.email}
                  </span>
                </div>
                <IconDotsVertical className='ml-auto size-4' />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
              side={isMobile ? "bottom" : "right"}
              align='end'
              sideOffset={4}
            >
              <DropdownMenuLabel className='p-0 font-normal'>
                <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                  <Avatar className='h-8 w-8 rounded-lg'>
                    <AvatarImage
                      src={"@/app/assets/chad.jpg"}
                      alt={session?.user.name}
                    />
                    <AvatarFallback className='rounded-lg'>CN</AvatarFallback>
                  </Avatar>
                  <div className='grid flex-1 text-left text-sm leading-tight'>
                    <span className='truncate font-medium'>
                      {session?.user.name}
                    </span>
                    <span className='text-muted-foreground truncate text-xs'>
                      {session?.user.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <IconUserCircle />
                  Account
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <IconCreditCard />
                  Billing
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <IconNotification />
                  Notifications
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <IconLogout />
                <Button
                  onClick={() => signOut({ setIsLoading })}
                  disabled={isLoading}
                >
                  Log out
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href={"/auth/login"}>
            <SidebarMenuButton size='lg'>
              <IconUserCircle className='size-4' />
              Sign in
            </SidebarMenuButton>
          </Link>
        )}
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
