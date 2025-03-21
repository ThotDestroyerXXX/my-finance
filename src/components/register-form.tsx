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
import useSignUp from "@/app/api/sign-up/sign-up";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [nameError, setNameError] = useState<string | undefined>(undefined);
  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  const [passwordError, setPasswordError] = useState<string | undefined>(
    undefined
  );
  const { SignUp } = useSignUp();
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Resgiter a new account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) =>
              SignUp({
                e,
                setIsLoading: setLoading,
                setErrorMessage: setErrorMessage,
                setNameError: setNameError,
                setEmailError: setEmailError,
                setPasswordError: setPasswordError,
              })
            }
          >
            <div className='flex flex-col gap-6'>
              <div className='grid gap-3'>
                <Label htmlFor='name'>Name</Label>
                <Input
                  id='name'
                  name='name'
                  type='text'
                  placeholder='username'
                  required
                  disabled={loading}
                />
                <span className='text-red-500 text-sm'>{nameError}</span>
              </div>
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
                <span className='text-red-500 text-sm'>{emailError}</span>
              </div>
              <div className='grid gap-3'>
                <div className='flex items-center'>
                  <Label htmlFor='password'>Password</Label>
                </div>
                <Input
                  id='password'
                  name='password'
                  type='password'
                  required
                  disabled={loading}
                />
                <span className='text-red-500 text-sm'>{passwordError}</span>
              </div>
              <div className='text-center'>
                <span className='text-red-500 text-sm'>{errorMessage}</span>
              </div>
              <div className='flex flex-col gap-3'>
                <Button type='submit' className='w-full' disabled={loading}>
                  Register
                </Button>
                <Button variant='outline' className='w-full' disabled={loading}>
                  Login with Google
                </Button>
              </div>
            </div>
            <div className='mt-4 text-center text-sm'>
              Already have an account?{" "}
              <Link href='/auth/login' className='underline underline-offset-4'>
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
