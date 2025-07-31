// app/[locale]/login/page.tsx
import { getSession } from "@/lib/session";
import { LoginForm } from "./_components/login-form";
import {
  ShoppingBag,
  Shield,
  Users,
  Star,
  Truck,
  CreditCard,
  Headphones,
  UserLock,
} from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

export default async function LoginPage() {
  const session = await getSession();
  const t = await getTranslations("LoginPage");

  return (
    <div className="h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center">
      <div className="container mx-auto px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-4">
            <Image
              src="/images/logo.png"
              alt={t("logoAlt")}
              width={56}
              height={56}
              className="mx-auto mb-2"
            />
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {t("title")}
            </h1>
            <p className="text-sm text-gray-600">{t("subtitle")}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4 items-start">
            {/* Left Column - Benefits */}
            <div className="space-y-4">
              {session ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="h-5 w-5 text-green-600" />
                    <h2 className="text-base font-semibold">
                      {t("sessionActive.title", { name: session.user.name })}
                    </h2>
                  </div>
                  <p className="text-sm text-green-700">
                    {t("sessionActive.subtitle")}
                  </p>
                </div>
              ) : (
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <ShoppingBag className="h-5 w-5 text-purple-600" />
                    <h2 className="text-base font-semibold">
                      {t("continueShopping.title")}
                    </h2>
                  </div>
                  <p className="text-sm text-purple-700">
                    {t("continueShopping.subtitle")}
                  </p>
                </div>
              )}

              <div className="bg-white rounded-xl shadow border p-4">
                <h3 className="text-base font-bold mb-3">
                  {t("whyShopWithUs")}
                </h3>
                <div className="space-y-3 text-sm">
                  {[
                    {
                      icon: Truck,
                      title: t("benefits.freeShipping.title"),
                      desc: t("benefits.freeShipping.description"),
                    },
                    {
                      icon: Shield,
                      title: t("benefits.secureLogin.title"),
                      desc: t("benefits.secureLogin.description"),
                    },
                    {
                      icon: Star,
                      title: t("benefits.bestPrices.title"),
                      desc: t("benefits.bestPrices.description"),
                    },
                    {
                      icon: Headphones,
                      title: t("benefits.support.title"),
                      desc: t("benefits.support.description"),
                    },
                  ].map(({ icon: Icon, title, desc }) => (
                    <div
                      key={title}
                      className="flex items-start gap-2"
                    >
                      <div className="bg-purple-100 p-1.5 rounded-lg">
                        <Icon className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{title}</h4>
                        <p className="text-gray-600 text-xs">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Login Form */}
            <div className="bg-white rounded-xl shadow border px-6 py-5">
              <div className="text-center mb-3">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-purple-600 rounded-full mb-1">
                  <UserLock className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-lg font-bold">{t("signIn.title")}</h2>
                <p className="text-sm text-gray-600">{t("signIn.subtitle")}</p>
              </div>
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
