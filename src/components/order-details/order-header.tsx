"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";

export const OrderHeader = ({
  orderId,
  createdAt,
  shareOrder,
}: {
  orderId: string;
  createdAt: string;
  shareOrder: () => void;
}) => {
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
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Order #{orderId.slice(-8).toUpperCase()}
          </h1>
          <p className="text-sm text-gray-500">
            Placed on{" "}
            {new Date(createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
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
        Share
      </Button>
    </div>
  );
};
