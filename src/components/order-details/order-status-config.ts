"use client";

import { CheckCircle, Package, Truck, type LucideIcon } from "lucide-react";
import { OrderStatus } from "@/types/order";

interface StatusConfig {
  key: OrderStatus;
  label: string;
  icon: LucideIcon;
  color: string;
}

export const getOrderStatusConfig = (
  currentStatus: OrderStatus
): StatusConfig[] => {
  const baseStatuses: StatusConfig[] = [
    {
      key: OrderStatus.PENDING,
      label: "Order Placed",
      icon: CheckCircle,
      color: "blue",
    },
    {
      key: OrderStatus.CONFIRMED,
      label: "Order Confirmed",
      icon: CheckCircle,
      color: "green",
    },
    {
      key: OrderStatus.PREPARING,
      label: "Preparing Order",
      icon: Package,
      color: "orange",
    },
    {
      key: OrderStatus.READY,
      label: "Ready for Pickup/Delivery",
      icon: Package,
      color: "yellow",
    },
    {
      key: OrderStatus.ON_DELIVERY,
      label: "Out for Delivery",
      icon: Truck,
      color: "blue",
    },
    {
      key: OrderStatus.DELIVERED,
      label: "Delivered",
      icon: CheckCircle,
      color: "green",
    },
  ];

  if (currentStatus === OrderStatus.CANCELLED) {
    return [
      {
        key: OrderStatus.PENDING,
        label: "Order Placed",
        icon: CheckCircle,
        color: "blue",
      },
      {
        key: OrderStatus.CANCELLED,
        label: "Order Cancelled",
        icon: Package,
        color: "red",
      },
    ];
  }

  return baseStatuses;
};
