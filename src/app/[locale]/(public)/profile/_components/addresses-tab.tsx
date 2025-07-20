import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAddresses } from "@/hooks/use-addresses";
import { Address } from "@/types";
import { Plus, Trash2 } from "lucide-react";
import { AddressDialog } from "./address-dialog";
import { AddressesSkeleton } from "./address-skeleton";
import { AddressEmptyState } from "./address-empty-state";
import { AddressErrorState } from "./address-error-state";
import { deleteAddress } from "@/actions/addresses";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { useLocale } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Alert, AlertIcon, AlertTitle } from "@/components/ui/alert";
import { BellIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const AddressesTab = () => {
  const { addresses, isAddressesLoading, isAddressesError, error } =
    useAddresses();
  const { session } = useAuth();
  const locale = useLocale();
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);

  const handleDeleteAddress = async (addressId: number) => {
    if (!session?.token) {
      toast.custom(() => (
        <Alert
          variant="destructive"
          appearance="outline"
          close={true}
        >
          <AlertIcon>
            <BellIcon />
          </AlertIcon>
          <AlertTitle>Please login to delete addresses</AlertTitle>
        </Alert>
      ));
      return;
    }

    setDeletingId(addressId);
    try {
      const result = await deleteAddress(
        session.token,
        locale as "en" | "ar",
        addressId
      );

      if (result.error) {
        throw new Error(result.error);
      }

      // Refresh the addresses list
      await queryClient.invalidateQueries({ queryKey: ["addresses"] });

      toast.custom(() => (
        <Alert
          variant="success"
          appearance="outline"
          close={true}
        >
          <AlertIcon>
            <BellIcon />
          </AlertIcon>
          <AlertTitle>Address deleted successfully</AlertTitle>
        </Alert>
      ));
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.custom(() => (
        <Alert
          variant="destructive"
          appearance="outline"
          close={true}
        >
          <AlertIcon>
            <BellIcon />
          </AlertIcon>
          <AlertTitle>
            {error instanceof Error
              ? error.message
              : "Failed to delete address. Please try again."}
          </AlertTitle>
        </Alert>
      ));
    } finally {
      setDeletingId(null);
    }
  };

  const handleRetry = () => {
    queryClient.invalidateQueries({ queryKey: ["addresses"] });
  };
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Shipping Addresses</CardTitle>
        <AddressDialog
          open={addressDialogOpen}
          onOpenChange={setAddressDialogOpen}
        />
      </CardHeader>
      <CardContent className="space-y-4">
        {isAddressesLoading ? (
          <AddressesSkeleton />
        ) : isAddressesError ? (
          <AddressErrorState
            onRetry={handleRetry}
            error={error?.message}
          />
        ) : addresses && addresses.length > 0 ? (
          addresses.map((a: Address) => (
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
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={deletingId === a.id}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Address</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this address? This action
                      cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDeleteAddress(a.id)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))
        ) : (
          <AddressEmptyState onAddAddress={() => setAddressDialogOpen(true)} />
        )}
      </CardContent>
    </Card>
  );
};
