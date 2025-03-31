"use client";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface SignOutProps {
  setIsLoading: (isLoading: boolean) => void;
  setOpenMobile?: (open: boolean) => void;
}

export default function useSignOut() {
  const router = useRouter();
  const signOut = async ({ setIsLoading, setOpenMobile }: SignOutProps) => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onRequest: () => {
            if (setOpenMobile) {
              setOpenMobile(false);
            }
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
