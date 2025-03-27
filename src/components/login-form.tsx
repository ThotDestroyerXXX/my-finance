"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useState } from "react";
import useSignIn from "@/app/api/sign-in/sign-in";
import Spinner from "./ui/spinner";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [loading, setLoading] = useState<boolean>(false);
  const { signIn } = useSignIn();
  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <Card>
            <CardHeader>
              <CardTitle>Login to your account</CardTitle>
              <CardDescription>
                Enter your email below to login to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) =>
                  signIn({
                    e,
                    setIsLoading: setLoading,
                  })
                }
              >
                <div className="flex flex-col gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="text"
                      placeholder="m@example.com"
                      disabled={loading}
                    />
                  </div>
                  <div className="grid gap-3">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                      <Link
                        href="#"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                        prefetch
                        shallow
                      >
                        Forgot your password?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      disabled={loading}
                    />
                  </div>
                  <div className="flex flex-row gap-2">
                    <input
                      id="rememberMe"
                      name="rememberMe"
                      type="checkbox"
                      disabled={loading}
                      className="h-4 w-4"
                    />
                    <Label htmlFor="rememberMe">Remember Me</Label>
                  </div>
                  <div className="flex flex-col gap-3">
                    <Button type="submit" className="w-full" disabled={loading}>
                      Login
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      disabled={loading}
                    >
                      Login with Google
                    </Button>
                  </div>
                </div>
                <div className="mt-4 text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/auth/register"
                    className="underline underline-offset-4"
                    prefetch
                    shallow
                  >
                    Register
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
