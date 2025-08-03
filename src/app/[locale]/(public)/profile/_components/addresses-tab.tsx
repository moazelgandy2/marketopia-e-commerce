import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAddresses } from "@/hooks/use-addresses";
import { Address } from "@/types";
import { Trash2, MapPin, Phone, Edit, Star } from "lucide-react";
import { AddressDialog } from "./address-dialog";
import { AddressEmptyState } from "./address-empty-state";
import { AddressErrorState } from "./address-error-state";
import { deleteAddress, updateAddress } from "@/actions/addresses";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { useLocale, useTranslations } from "next-intl";
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
  const t = useTranslations("ProfilePage.addresses");
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [settingDefaultId, setSettingDefaultId] = useState<number | null>(null);
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const handleSetAsDefault = async (address: Address) => {
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
          <AlertTitle>{t("toast.loginRequired")}</AlertTitle>
        </Alert>
      ));
      return;
    }

    setSettingDefaultId(address.id);
    try {
      const addressData = {
        name: address.name,
        address: address.address,
        phone: address.phone,
        lat: address.lat,
        lng: address.lng,
        is_default: 1,
        city_id: address.city_id,
      };

      const result = await updateAddress(
        session.token,
        locale as "en" | "ar",
        address.id,
        addressData
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
          <AlertTitle>{t("toast.setDefaultSuccess")}</AlertTitle>
        </Alert>
      ));
    } catch (error) {
      console.error("Error setting default address:", error);
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
              : t("toast.setDefaultError")}
          </AlertTitle>
        </Alert>
      ));
    } finally {
      setSettingDefaultId(null);
    }
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
  };

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
          <AlertTitle>{t("toast.loginRequired")}</AlertTitle>
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
          <AlertTitle>{t("toast.deleteSuccess")}</AlertTitle>
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
            {error instanceof Error ? error.message : t("toast.deleteError")}
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

  const handleCloseEditDialog = () => {
    setEditingAddress(null);
  };

  return (
    <div className="space-y-6">
      {/* Header - Minimal */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            {t("title")}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {t("subtitle")}
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
              className="border-slate-200 dark:border-slate-700"
            >
              <CardContent className="p-5">
                <div className="space-y-3">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/3" />
                  <div className="flex gap-2 pt-2">
                    <Skeleton className="h-7 w-20" />
                    <Skeleton className="h-7 w-16" />
                    <Skeleton className="h-7 w-18" />
                  </div>
                </div>
              </CardContent>
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
              className={`relative overflow-hidden transition-all duration-200 hover:shadow-md ${
                address.is_default === 1
                  ? "border-emerald-200 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/20"
                  : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              }`}
            >
              {/* Default Badge */}
              {address.is_default === 1 && (
                <div className="absolute top-3 right-3">
                  <div className="flex items-center gap-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded-full text-xs font-medium">
                    <Star className="w-3 h-3" />
                    {t("default")}
                  </div>
                </div>
              )}

              {/* Setting Default Loading Badge */}
              {settingDefaultId === address.id && (
                <div className="absolute top-3 right-3">
                  <div className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full text-xs font-medium">
                    <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Setting...
                  </div>
                </div>
              )}

              <CardContent className="p-5">
                <div className="space-y-4">
                  {/* Header - Minimal */}
                  <div className="space-y-1">
                    <h3 className="font-semibold text-slate-900 dark:text-white text-lg">
                      {address.name}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {address.address}
                    </p>
                  </div>

                  {/* Details - Clean Layout */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span>{address.city.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <Phone className="w-4 h-4 flex-shrink-0" />
                      <span>{address.phone}</span>
                    </div>
                  </div>

                  {/* Actions - Minimal Buttons */}
                  <div className="flex items-center gap-1 pt-3">
                    {address.is_default === 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetAsDefault(address)}
                        disabled={settingDefaultId === address.id}
                        className="h-8 px-3 text-xs border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-950"
                      >
                        {settingDefaultId === address.id ? (
                          <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <Star className="w-3 h-3 mr-1" />
                            {t("setDefault")}
                          </>
                        )}
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditAddress(address)}
                      className="h-8 px-3 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-700"
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      {t("edit")}
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={deletingId === address.id}
                          className="h-8 px-3 text-xs text-slate-600 hover:text-red-600 hover:bg-red-50 dark:text-slate-400 dark:hover:text-red-400 dark:hover:bg-red-950"
                        >
                          {deletingId === address.id ? (
                            <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <>
                              <Trash2 className="w-3 h-3 mr-1" />
                              {t("delete")}
                            </>
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            {t("deleteConfirm.title")}
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            {t("deleteConfirm.description")}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>
                            {t("deleteConfirm.cancel")}
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteAddress(address.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            {t("deleteConfirm.delete")}
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

      {/* Edit Address Dialog */}
      {editingAddress && (
        <AddressDialog
          open={!!editingAddress}
          onOpenChange={(open) => {
            if (!open) handleCloseEditDialog();
          }}
          address={editingAddress}
        />
      )}
    </div>
  );
};
