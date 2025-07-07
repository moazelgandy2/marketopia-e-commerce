import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "./globals.css";
import ReactQueryProvider from "@/providers/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Header } from "@/components/elements/header";
import { Footer } from "@/components/footer";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body>
        <ReactQueryProvider>
          <ReactQueryDevtools initialIsOpen={false} />

          <NextIntlClientProvider>
            <Header />

            {children}
            <Footer />
          </NextIntlClientProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
