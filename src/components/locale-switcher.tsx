"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Languages, LoaderCircleIcon } from "lucide-react";
import React, { useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { Locale, useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

const locales = [
  { value: "en", label: "English" },
  { value: "ar", label: "العربيه" },
] as const;

type LocaleValue = (typeof locales)[number]["value"];

export function LocaleSwitcherDropdown() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale();

  function onChange(value: LocaleValue) {
    const nextLocale = value as Locale;

    startTransition(() => {
      router.replace(
        {
          pathname,
          query: Object.fromEntries(searchParams.entries()),
        },
        {
          locale: nextLocale,
        }
      );
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="w-full justify-between h-9 px-3 text-sm"
          variant={"outline"}
          disabled={isPending}
          size="sm"
        >
          <Languages className="size-4" />

          {isPending ? (
            <LoaderCircleIcon className="size-4 animate-spin" />
          ) : (
            <span className="uppercase text-xs font-medium">
              {locales.find((l) => l.value === locale)?.value ?? "en"}
            </span>
          )}
          <ChevronDown className="size-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-40"
      >
        <DropdownMenuRadioGroup
          className="w-full"
          defaultValue={locale}
          value={locale}
          onValueChange={onChange as (value: string) => void}
        >
          {locales.map((val) => (
            <DropdownMenuRadioItem
              key={val.value}
              value={val.value}
              className="w-full cursor-pointer"
            >
              {val.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
