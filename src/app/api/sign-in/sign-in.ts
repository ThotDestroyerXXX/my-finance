import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface SignInProps {
  e: React.FormEvent<HTMLFormElement>;
  setIsLoading: (isLoading: boolean) => void;
  setErrorMessage: (errorMessage: string | undefined) => void;
}

export default function useSignIn() {
  const router = useRouter();
  const signIn = async ({ e, setIsLoading, setErrorMessage }: SignInProps) => {
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
          setErrorMessage("Invalid email or password");
          setIsLoading(false);
        },
      },
    );
    return { data, error };
  };
  return { signIn };
}
