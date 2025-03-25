import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface SignInProps {
  e: React.FormEvent<HTMLFormElement>;
  setIsLoading: (isLoading: boolean) => void;
}

export default function useSignIn() {
  const router = useRouter();
  const signIn = async ({ e, setIsLoading }: SignInProps) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;
    const rememberMe = form.get("rememberMe") as string;
    const { data, error } = await authClient.signIn.email(
      {
        email,
        password,
        rememberMe: rememberMe === "true",
      },
      {
        onRequest: () => {
          setIsLoading(true);
        },
        onSuccess: () => {
          router.push("/user/account-list");
          router.refresh();
        },
        onError: () => {
          toast.error("Invalid email or password");
          setIsLoading(false);
        },
      },
    );
    return { data, error };
  };
  return { signIn };
}
