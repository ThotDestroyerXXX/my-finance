"use client";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface SignOutProps {
  setIsLoading: (isLoading: boolean) => void;
}

export default function useSignOut() {
  const router = useRouter();
  const signOut = async ({ setIsLoading }: SignOutProps) => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onRequest: () => {
            setIsLoading(true);
          },
          onSuccess: () => {
            router.push("/auth/login");
            router.refresh();
          },
        },
      });
    } catch (e) {
      console.error(e);
    }
  };
  return { signOut };
}
