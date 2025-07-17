import { Header } from "@/components/elements/header";
import { Footer } from "@/components/footer";

export default async function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
