"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Share2 } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";

export const OrderHeader = ({
  orderId,
  createdAt,
  shareOrder,
}: {
  orderId: string;
  createdAt: string;
  shareOrder: () => void;
}) => {
  const t = useTranslations("OrderDetails.header");
  const params = useParams();
  const locale = params.locale as string;
  const router = useRouter();
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="flex items-center gap-2 hover:bg-white"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("back")}
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t("orderNumber")} #{orderId.slice(-8).toUpperCase()}
          </h1>
          <p className="text-sm text-gray-500">
            {t("placedOn")}{" "}
            {new Date(createdAt).toLocaleDateString(
              locale === "ar" ? "ar-EG" : "en-US",
              {
                month: "long",
                day: "numeric",
                year: "numeric",
              }
            )}
          </p>
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={shareOrder}
        className="hidden sm:flex items-center gap-2"
      >
        <Share2 className="h-4 w-4" />
        {t("share")}
      </Button>
    </div>
  );
};
