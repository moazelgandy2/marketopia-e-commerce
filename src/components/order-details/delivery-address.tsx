"use client";

import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Phone } from "lucide-react";
import { Address } from "@/types/address";
import { useTranslations } from "next-intl";

export const DeliveryAddress = ({ address }: { address: Address }) => {
  const t = useTranslations("OrderDetails.delivery");
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
            <MapPin className="h-5 w-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{t("title")}</h3>
        </div>
        <div className="space-y-2 text-sm">
          <p className="font-medium text-gray-900">{address.name}</p>
          <p className="text-gray-600 flex items-center gap-2">
            <Phone className="h-3 w-3" />
            {address.phone}
          </p>
          <p className="text-gray-600">
            {address.address}
            <br />
            <span className="text-gray-500">
              {address.city?.name || "Unknown City"}
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
