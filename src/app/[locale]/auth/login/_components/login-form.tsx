"use client";

import { LoginFormValues, loginSchema } from "@/validation/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useLocale } from "next-intl";
import { useAuth } from "@/hooks/use-auth";
import { logoutAction } from "@/actions/auth";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  // const session = useAuth();
  const router = useRouter();

  const locale = useLocale();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginFormValues) {
    try {
      setIsLoading(true);
      setLoginError(null);

      const res = await fetch(`/${locale}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await res.json();
      console.log("Login successful:", data);
    } catch (error) {
      if (error instanceof Error) {
        setLoginError(error.message);
      } else {
        setLoginError("An unknown error occurred during login.");
      }
      console.error("Error during form submission:", error);
    } finally {
      setIsLoading(false);
      router.refresh();
    }
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
        >
          {loginError && <p className="text-red-500">{loginError}</p>}
          <FormField
            control={form.control}
            name="identifier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Identifier</FormLabel>
                <FormControl>
                  <Input
                    placeholder="shadcn"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    {...field}
                  />
                </FormControl>
                <FormDescription>Your account password.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? "Loading..." : "Submit"}
          </Button>
        </form>
      </Form>
      <Button
        onClick={async () => {
          const res = await logoutAction();
          if (res && res.message) {
            console.log(res.message);
          }
        }}
      >
        Logout
      </Button>
    </>
  );
}
