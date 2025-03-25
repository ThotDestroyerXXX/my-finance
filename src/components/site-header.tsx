"use client";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import useSignOut from "@/app/api/sign-out/sign-out";
import { useState } from "react";
import { type Session } from "@/lib/auth";
import Link from "next/link";
import Spinner from "./ui/spinner";

export function SiteHeader({
  session,
  sidebarShow,
}: Readonly<{ session: Session | null; sidebarShow: boolean }>) {
  const { signOut } = useSignOut();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  return (
    <header
      className={`flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) ${!sidebarShow && "py-2"}`}
    >
      {isLoading && <Spinner />}
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        {sidebarShow && (
          <>
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mx-2 data-[orientation=vertical]:h-4"
            />
          </>
        )}

        <h1 className="text-base font-medium">Documents</h1>
        <div className="ml-auto flex items-center gap-2">
          <ModeToggle />
          {session?.session ? (
            <Button
              onClick={() => signOut({ setIsLoading })}
              disabled={isLoading}
            >
              Sign Out
            </Button>
          ) : (
            <Link href="/auth/login">
              <Button>Sign In</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
