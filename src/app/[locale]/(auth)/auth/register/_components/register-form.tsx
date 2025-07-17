// app/[locale]/register/_components/register-form.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useLocale } from "next-intl";
import { RegisterFormValues, registerSchema } from "@/validation/auth";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  const locale = useLocale();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    try {
      setIsLoading(true);
      setLoginError(null);
      setIsSuccess(false);

      const res = await fetch(`/${locale}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Registration failed");
      }

      setIsSuccess(true);
      setTimeout(() => {
        form.reset();
        setIsSuccess(false);
        router.push(`/${locale}/`);
      }, 2000);
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setIsLoading(false);
      router.refresh();
    }
  }

  return (
    <div className="w-full  mx-auto">
      {isSuccess && (
        <div className="mb-2 p-2 bg-green-50 border border-green-200 rounded flex items-center gap-1 text-xs">
          <CheckCircle2 className="h-3 w-3 text-green-600" />
          <span>Registration Successful!</span>
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
          {["name", "email", "phone", "password", "confirmPassword"].map(
            (fieldName) => (
              <FormField
                key={fieldName}
                control={form.control}
                name={fieldName as keyof RegisterFormValues}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">
                      {fieldName === "confirmPassword"
                        ? "Confirm"
                        : fieldName.charAt(0).toUpperCase() +
                          fieldName.slice(1)}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        {fieldName === "name" && (
                          <User className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
                        )}
                        {fieldName === "email" && (
                          <Mail className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
                        )}
                        {fieldName === "phone" && (
                          <Phone className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
                        )}
                        {["password", "confirmPassword"].includes(
                          fieldName
                        ) && (
                          <Lock className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
                        )}
                        <Input
                          type={
                            fieldName === "password" ||
                            fieldName === "confirmPassword"
                              ? fieldName === "password"
                                ? showPassword
                                  ? "text"
                                  : "password"
                                : showConfirmPassword
                                ? "text"
                                : "password"
                              : fieldName === "email"
                              ? "email"
                              : "text"
                          }
                          placeholder={
                            fieldName === "name"
                              ? "Full name"
                              : fieldName === "email"
                              ? "Email"
                              : fieldName === "phone"
                              ? "Phone"
                              : fieldName === "password"
                              ? "Password"
                              : "Confirm"
                          }
                          className="pl-7 pr-7 h-7 text-xs"
                          {...field}
                        />
                        {["password", "confirmPassword"].includes(
                          fieldName
                        ) && (
                          <button
                            type="button"
                            onClick={() =>
                              fieldName === "password"
                                ? setShowPassword(!showPassword)
                                : setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {(
                              fieldName === "password"
                                ? showPassword
                                : showConfirmPassword
                            ) ? (
                              <EyeOff className="h-3 w-3" />
                            ) : (
                              <Eye className="h-3 w-3" />
                            )}
                          </button>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            )
          )}

          <Button
            disabled={isLoading}
            type="submit"
            className="w-full h-7 text-xs bg-purple-600 hover:bg-purple-700"
          >
            {isLoading ? "Creating..." : "Create Account"}
          </Button>
        </form>
      </Form>

      <p className="text-[10px] text-gray-500 text-center mt-2">
        By signing up, you agree to our{" "}
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
}
