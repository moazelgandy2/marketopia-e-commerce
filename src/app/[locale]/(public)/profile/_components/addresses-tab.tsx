import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAddresses } from "@/hooks/use-addresses";
import { Address } from "@/types";
import { Plus, Trash2 } from "lucide-react";

export const AddressesTab = () => {
  const { addresses, isAddressesLoading, isAddressesError } = useAddresses();
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Shipping Addresses</CardTitle>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAddressesLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
        ) : isAddressesError ? (
          <div className="text-red-500">
            Failed to load addresses. Please try again later.
          </div>
        ) : (
          addresses?.map((a: Address) => (
            <div
              key={a.id}
              className="border rounded-xl p-4 flex justify-between items-start dark:border-slate-700"
            >
              <div>
                <p className="font-bold">{a.name}</p>
                <p className="text-sm text-slate-600">
                  {a.city.name} ({a.lat}, {a.lng})
                </p>
                <p className="text-sm">{a.phone}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
