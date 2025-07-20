import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAddresses } from "@/hooks/use-addresses";
import { Address } from "@/types";
import { Plus, Trash2, MapPin, Phone, Edit, Home } from "lucide-react";
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Shipping Addresses
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Manage your delivery addresses
          </p>
        </div>

        <AddressDialog />
      </div>
      {/* Addresses Grid */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isAddressesLoading ? (
          Array.from({ length: 3 }).map((_, index) => (
            <Card
              key={index}
              className="p-6"
            >
              <div className="space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex justify-end space-x-2">
                  <Skeleton className="h-8 w-8 rounded" />
                  <Skeleton className="h-8 w-8 rounded" />
                </div>
              </div>
            </Card>
          ))
        ) : isAddressesError ? (
          <div className="md:col-span-2 lg:col-span-3">
            <AddressErrorState
              onRetry={handleRetry}
              error={error?.message}
            />
          </div>
        ) : addresses && addresses.length > 0 ? (
          addresses.map((address: Address) => (
            <Card
              key={address.id}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-200"
            >
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                        <Home className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">
                          {address.name}
                        </h3>
                        <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded-full">
                          Primary
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Address Details */}
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-slate-700 dark:text-slate-300">
                          {address.city.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Coordinates: {address.lat}, {address.lng}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-slate-500 flex-shrink-0" />
                      <p className="text-sm text-slate-700 dark:text-slate-300">
                        {address.phone}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={deletingId === address.id}
                          className="text-slate-600 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400"
                        >
                          {deletingId === address.id ? (
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1" />
                          ) : (
                            <Trash2 className="w-4 h-4 mr-1" />
                          )}
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Address</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{address.name}"?
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteAddress(address.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="md:col-span-2 lg:col-span-3">
            <AddressEmptyState
              onAddAddress={() => setAddressDialogOpen(true)}
            />
          </div>
        )}
      </div>
    </div>
  );
};
