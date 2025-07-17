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

import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import { useRouter } from "next/navigation";

export const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
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
      setIsSuccess(false);

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

      setIsSuccess(true);
      setTimeout(() => {
        form.reset();
        setIsSuccess(false);
        router.push(`/${locale}/`);
      }, 1500);
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setIsLoading(false);
      router.refresh();
    }
  }

  return (
    <div className="w-full mx-auto">
      {isSuccess && (
        <div className="mb-2 p-2 bg-green-50 border border-green-200 rounded flex items-center gap-1 text-xs">
          <CheckCircle2 className="h-3 w-3 text-green-600" />
          <span>Login Successful!</span>
        </div>
      )}
      {loginError && (
        <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded flex items-center gap-1 text-xs">
          <AlertCircle className="h-3 w-3 text-red-600" />
          <span>{loginError}</span>
        </div>
      )}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-2"
        >
          <FormField
            control={form.control}
            name="identifier"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">Identifier</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Email or Username"
                      className="pl-7 pr-7 h-7 text-xs"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className="pl-7 pr-7 h-7 text-xs"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="h-3 w-3" />
                      ) : (
                        <Eye className="h-3 w-3" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <Button
            disabled={isLoading}
            type="submit"
            className="w-full h-7 text-xs bg-purple-600 hover:bg-purple-700"
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </Form>

      <p className="text-[10px] text-gray-500 text-center mt-2">
        By logging in, you agree to our{" "}
        <a
          href="#"
          className="text-purple-600 underline"
        >
          Terms
        </a>{" "}
        and{" "}
        <a
          href="#"
          className="text-purple-600 underline"
        >
          Privacy
        </a>
      </p>
    </div>
  );
};
