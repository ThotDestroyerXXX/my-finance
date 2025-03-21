"use client";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import useSignOut from "@/app/api/sign-out/sign-out";
import { useState } from "react";
import { type Session } from "@/lib/auth";

export function SiteHeader(session: Readonly<{ session: Session | null }>) {
  const { signOut } = useSignOut();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  console.log(session);
  return (
    <header className="h-(--header-height) group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) flex shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">Documents</h1>
        <div className="ml-auto flex items-center gap-2">
          <ModeToggle />
          {session.session && (
            <Button
              onClick={() => signOut({ setIsLoading })}
              disabled={isLoading}
            >
              Sign Out
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
