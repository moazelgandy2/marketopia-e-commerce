"use client";

import { CheckCircle, Package, Truck, type LucideIcon } from "lucide-react";
import { OrderStatus } from "@/types/order";

interface StatusConfig {
  key: OrderStatus;
  labelKey: string;
  icon: LucideIcon;
  color: string;
}

export const getOrderStatusConfig = (
  currentStatus: OrderStatus
): StatusConfig[] => {
  const baseStatuses: StatusConfig[] = [
    {
      key: OrderStatus.PENDING,
      labelKey: "pending",
      icon: CheckCircle,
      color: "blue",
    },
    {
      key: OrderStatus.CONFIRMED,
      labelKey: "confirmed",
      icon: CheckCircle,
      color: "green",
    },
    {
      key: OrderStatus.PREPARING,
      labelKey: "preparing",
      icon: Package,
      color: "orange",
    },
    {
      key: OrderStatus.READY,
      labelKey: "ready",
      icon: Package,
      color: "yellow",
    },
    {
      key: OrderStatus.ON_DELIVERY,
      labelKey: "on_delivery",
      icon: Truck,
      color: "blue",
    },
    {
      key: OrderStatus.DELIVERED,
      labelKey: "delivered",
      icon: CheckCircle,
      color: "green",
    },
  ];

  if (currentStatus === OrderStatus.CANCELLED) {
    return [
      {
        key: OrderStatus.PENDING,
        labelKey: "pending",
        icon: CheckCircle,
        color: "blue",
      },
      {
        key: OrderStatus.CANCELLED,
        labelKey: "cancelled",
        icon: Package,
        color: "red",
      },
    ];
  }

  return baseStatuses;
};
