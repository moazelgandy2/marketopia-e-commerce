"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Coupon } from "@/types/coupon";

export const CouponInfo = ({
  coupon,
  formatPrice,
}: {
  coupon: Coupon;
  formatPrice: (price: number | string) => string;
}) => {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Coupon Applied
        </h3>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 font-bold text-xs">%</span>
            </div>
            <div>
              <p className="font-medium text-green-900 text-sm">
                {coupon.code}
              </p>
              <p className="text-xs text-green-700">
                {coupon.discount_type === "percentage"
                  ? `${coupon.discount_value}% off`
                  : `${formatPrice(coupon.discount_value)} off`}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
