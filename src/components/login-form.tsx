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

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );
  const [loading, setLoading] = useState<boolean>(false);
  const { signIn } = useSignIn();
  return (
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
                setErrorMessage: setErrorMessage,
              })
            }
          >
            <div className='flex flex-col gap-6'>
              <div className='grid gap-3'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  name='email'
                  type='email'
                  placeholder='m@example.com'
                  required
                  disabled={loading}
                />
              </div>
              <div className='grid gap-3'>
                <div className='flex items-center'>
                  <Label htmlFor='password'>Password</Label>
                  <Link
                    href='#'
                    className='ml-auto inline-block text-sm underline-offset-4 hover:underline'
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id='password'
                  name='password'
                  type='password'
                  required
                  disabled={loading}
                />
              </div>
              <div className='flex flex-row gap-2'>
                <input
                  id='rememberMe'
                  name='rememberMe'
                  type='checkbox'
                  disabled={loading}
                  className='w-4 h-4'
                />
                <Label htmlFor='rememberMe'>Remember Me</Label>
              </div>
              <div className='text-center'>
                <span className='text-red-500'>{errorMessage ?? ""}</span>
              </div>
              <div className='flex flex-col gap-3'>
                <Button type='submit' className='w-full' disabled={loading}>
                  Login
                </Button>
                <Button variant='outline' className='w-full' disabled={loading}>
                  Login with Google
                </Button>
              </div>
            </div>
            <div className='mt-4 text-center text-sm'>
              Don&apos;t have an account?{" "}
              <Link
                href='/auth/register'
                className='underline underline-offset-4'
              >
                Register
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
