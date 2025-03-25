import { authClient } from "@/lib/auth-client";

export const useSession = () => {
  return authClient.useSession();
};

export const getSession = () => {
  return authClient.getSession();
};
