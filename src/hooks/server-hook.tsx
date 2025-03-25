"use server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const paramHook = async (params: Promise<{ id: string }>) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const param = await params;
  return { session, param };
};
