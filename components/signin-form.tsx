"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signinSchema, SigninSchemaType } from "@/lib/validation/signinSchema";

import { useState } from "react";
import { useRouter } from "next/navigation";

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

export function SigninForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninSchemaType>({
    resolver: zodResolver(signinSchema),
  });

  const onSubmit = async (data: SigninSchemaType) => {
    setServerError("");
    const res = await fetch("/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    let result;
    try {
      result = await res.json();
    } catch (error) {
      result = {message:"Unexpected error from the server", error}
    }

    if (!res.ok) {
      setServerError(result.message || "signin failed");
    } else {
      await router.push("/dashboard");
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Sign in to your account</CardTitle>
          <CardDescription>Enter your email below to sign in</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            {serverError && (
              <p className="text-sm text-red-500">{serverError}</p>
            )}
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  required
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-xs text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full">
                  Sign in
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don't have an account?{" "}
              <a href="/signup" className="underline underline-offset-4">
                signup
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
