import { authClient } from "@/lib/auth-client"; //import the auth client
import { useRouter } from "next/navigation";
import { z } from "zod";

interface SignUpProps {
  setIsLoading: (isLoading: boolean) => void;
  setErrorMessage: (errorMessage: string | undefined) => void;
  setNameError: (nameError: string | undefined) => void;
  setEmailError: (emailError: string | undefined) => void;
  setPasswordError: (passwordError: string | undefined) => void;
  e: React.FormEvent<HTMLFormElement>;
}

export default function useSignUp() {
  const router = useRouter();
  const SignUp = async ({
    setIsLoading,
    setErrorMessage,
    setNameError,
    setEmailError,
    setPasswordError,
    e,
  }: SignUpProps) => {
    e.preventDefault();
    setIsLoading(true);
    const form = new FormData(e.currentTarget);
    const email = form.get("email") as string;
    const password = form.get("password") as string;
    const name = form.get("name") as string;
    console.log(name, email, password);
    const schema = z.object({
      name: z
        .string()
        .nonempty({ message: "name cannot be empty!" })
        .min(3, { message: "name must be more than 3 characters!" })
        .max(50, { message: "name must be less than 50 characters!" }),
      email: z
        .string()
        .nonempty({ message: "email cannot be empty!" })
        .email({ message: "Invalid email address!" }),
      password: z
        .string()
        .nonempty({ message: "password cannot be empty!" })
        .min(8, { message: "password must be more than 8 characters!" })
        .max(100, { message: "password must be less than 100 characters!" }),
    });
    const result = schema.safeParse({
      name: name,
      email: email,
      password: password,
    });
    if (!result.success) {
      const errors = result.error.format();
      setNameError(errors.name?._errors[0] ?? undefined);
      setEmailError(errors.email?._errors[0] ?? undefined);
      setPasswordError(errors.password?._errors[0] ?? undefined);
      setIsLoading(false);
      return;
    }

    const { data, error } = await authClient.signUp.email(
      {
        email, // user email address
        password, // user password -> min 8 characters by default
        name, // user display name
      },
      {
        onRequest: () => {
          setIsLoading(true);
        },
        onSuccess: () => {
          router.push("/user/account-list");
          router.refresh();
          setIsLoading(false);
        },
        onError: (ctx) => {
          setErrorMessage(ctx.error.message);
          setIsLoading(false);
        },
      },
    );
    return { data, error };
  };
  return { SignUp };
}
