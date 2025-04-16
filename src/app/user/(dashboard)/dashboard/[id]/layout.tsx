"use client";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { paramHook } from "@/hooks/server-hook";
import { ParamContext } from "../useContext/context";
import { useEffect, useMemo, useState } from "react";
import { type Session } from "@/lib/auth";
import { redirect } from "next/navigation";
import { toast } from "sonner";

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}>) {
  const [data, setData] = useState<{
    session: Session | null;
    param: { id: string };
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { session, param } = await paramHook(params);
      setData({ session, param });
      console.log("param rendered");
    };
    fetchData().catch(() => {
      toast.error("Account not found");
      return redirect("/user/account-list");
    });
  }, [params]);

  const paramContextValue = useMemo(
    () => ({ id: data?.param.id ?? "" }),
    [data?.param.id],
  );

  if (!data) {
    return null; // or a loading spinner
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 14)",
        } as React.CSSProperties
      }
    >
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <ParamContext.Provider value={paramContextValue}>
          <AppSidebar variant="inset" session={data.session} />
          <SidebarInset>
            <SiteHeader session={data.session} sidebarShow={true} />
            {children}
          </SidebarInset>
        </ParamContext.Provider>
      </ThemeProvider>
    </SidebarProvider>
  );
}
