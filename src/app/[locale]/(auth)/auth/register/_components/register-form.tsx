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
import { useLocale, useTranslations } from "next-intl";
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
  const t = useTranslations("RegisterForm");

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
          <span>{t("registrationSuccess")}</span>
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">{t("name.label")}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
                    <Input
                      type="text"
                      placeholder={t("name.placeholder")}
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">{t("email.label")}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
                    <Input
                      type="email"
                      placeholder={t("email.placeholder")}
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
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">{t("phone.label")}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Phone className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
                    <Input
                      type="text"
                      placeholder={t("phone.placeholder")}
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
                <FormLabel className="text-xs">{t("password.label")}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder={t("password.placeholder")}
                      className="pl-7 pr-7 h-7 text-xs"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
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

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">
                  {t("confirmPassword.label")}
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder={t("confirmPassword.placeholder")}
                      className="pl-7 pr-7 h-7 text-xs"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
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
            className="w-full h-7 text-xs bg-slate-600 hover:bg-slate-700"
          >
            {isLoading ? t("creating") : t("createButton")}
          </Button>
        </form>
      </Form>

      <p className="text-[10px] text-gray-500 text-center mt-2">
        {t.rich("termsAndPrivacy", {
          terms: (chunks) => (
            <a
              href="#"
              className="text-slate-600 underline"
            >
              {t("terms")}
            </a>
          ),
          privacy: (chunks) => (
            <a
              href="#"
              className="text-slate-600 underline"
            >
              {t("privacy")}
            </a>
          ),
        })}
      </p>
    </div>
  );
}
