"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  MapMouseEvent,
  useMap,
} from "@vis.gl/react-google-maps";
import { Button } from "@/components/ui/button";
import { BellIcon, Plus } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { AddressForm } from "./address-form";
import {
  saveAddress,
  updateAddress,
  SaveAddressData,
} from "@/actions/addresses";
import { useAuth } from "@/hooks/use-auth";
import { useLocale, useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Alert, AlertIcon, AlertTitle } from "@/components/ui/alert";
import { Address } from "@/types";

const MapWithControls = ({
  onLocationUpdate,
  selectedPosition,
  onMapClick,
}: {
  onLocationUpdate: (pos: google.maps.LatLngLiteral) => void;
  selectedPosition: google.maps.LatLngLiteral | undefined;
  onMapClick: (event: MapMouseEvent) => void;
}) => {
  const map = useMap();
  const t = useTranslations("AddressDialog.map");

  const handleCurrentLocation = useCallback(() => {
    if (!map) return;
    if (navigator.geolocation) {
      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log(
            "Geolocation accuracy:",
            position.coords.accuracy,
            "meters"
          );
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          map.setCenter(pos);
          map.setZoom(18); // Zoom in more for better accuracy
          onLocationUpdate(pos);
        },
        (error) => {
          console.error("Geolocation error:", error);
          let errorMessage = t("errors.geolocationFailed");
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = t("errors.permissionDenied");
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = t("errors.positionUnavailable");
              break;
            case error.TIMEOUT:
              errorMessage = t("errors.timeout");
              break;
          }
          alert(errorMessage);
        },
        options
      );
    } else {
      alert(t("errors.geolocationNotSupported"));
    }
  }, [map, onLocationUpdate]);

  return (
    <>
      <div className="absolute top-2 left-2 z-10 space-y-2">
        <Button
          variant="outline"
          onClick={handleCurrentLocation}
          className="bg-white shadow-md"
        >
          {t("useCurrentLocation")}
        </Button>
        {selectedPosition && (
          <div className="bg-white p-2 rounded shadow-md text-xs">
            <p className="font-semibold">{t("selectedLocation")}:</p>
            <p>Lat: {selectedPosition.lat.toFixed(6)}</p>
            <p>Lng: {selectedPosition.lng.toFixed(6)}</p>
            <p className="text-gray-500 mt-1">{t("clickToMove")}</p>
          </div>
        )}
      </div>
      {selectedPosition && (
        <AdvancedMarker position={selectedPosition}>
          <Pin
            background="#3b82f6"
            glyphColor="white"
          />
        </AdvancedMarker>
      )}
    </>
  );
};

interface AddressDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  address?: Address; // For editing existing address
  children?: React.ReactNode; // Custom trigger
}

export const AddressDialog = ({
  open: controlledOpen,
  onOpenChange,
  address,
  children,
}: AddressDialogProps = {}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const defaultPosition = { lat: 53.54992, lng: 10.00678 };
  const [selectedPosition, setSelectedPosition] = useState<
    google.maps.LatLngLiteral | undefined
  >(undefined);

  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;
  const isEditing = !!address;

  const { session } = useAuth();
  const locale = useLocale();
  const queryClient = useQueryClient();
  const t = useTranslations("ProfilePage.addresses");

  useEffect(() => {
    if (!open) {
      setSelectedPosition(undefined);
      setShowForm(false);
    } else if (isEditing && address) {
      // If editing, set the position from existing address and show form
      setSelectedPosition({
        lat: parseFloat(address.lat),
        lng: parseFloat(address.lng),
      });
      setShowForm(true);
    }
  }, [open, isEditing, address]);

  const handleMapClick = (event: MapMouseEvent) => {
    if (event.detail.latLng) {
      setSelectedPosition(event.detail.latLng);
    }
  };

  const handleSave = () => {
    if (selectedPosition) {
      setShowForm(true);
    } else {
      alert(t("errors.selectLocationFirst"));
    }
  };

  const handleFormSubmit = async (formData: any) => {
    if (!session?.token) {
      alert(t("errors.loginRequired"));
      return;
    }

    setIsSubmitting(true);
    try {
      const addressData: SaveAddressData = {
        ...formData,
        lat: selectedPosition?.lat.toString() || "",
        lng: selectedPosition?.lng.toString() || "",
      };

      console.log("Submitting address data:", addressData);

      let result;
      if (isEditing && address) {
        // Update existing address
        result = await updateAddress(
          session.token,
          locale as "en" | "ar",
          address.id,
          addressData
        );
      } else {
        // Create new address
        result = await saveAddress(
          session.token,
          locale as "en" | "ar",
          addressData
        );
      }

      if (result.error) {
        throw new Error(result.error);
      }

      console.log(
        `Address ${isEditing ? "updated" : "saved"} successfully:`,
        result.data
      );

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
          <AlertTitle>
            {isEditing ? t("toast.addressUpdated") : t("toast.addressSaved")}
          </AlertTitle>
        </Alert>
      ));
      setOpen(false);
    } catch (error) {
      console.error(
        `Error ${isEditing ? "updating" : "saving"} address:`,
        error
      );
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
              : isEditing
              ? t("toast.updateFailed")
              : t("toast.saveFailed")}
          </AlertTitle>
        </Alert>
      ));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        {children || (
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" /> {t("addNew")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? t("edit") : t("addNew")}</DialogTitle>
          <DialogDescription>
            {showForm
              ? t("description.fillDetails")
              : t("description.selectLocation")}
          </DialogDescription>
        </DialogHeader>

        {!showForm ? (
          <>
            <div className="space-y-4">
              <div className="h-[400px] rounded-md overflow-hidden relative">
                <APIProvider apiKey={"AIzaSyAIVOkyF-EJANwkFgqJSJYLQlMRoZJKsTc"}>
                  <Map
                    defaultCenter={selectedPosition || defaultPosition}
                    defaultZoom={selectedPosition ? 15 : 10}
                    mapId="map"
                    gestureHandling={"greedy"}
                    onClick={handleMapClick}
                  >
                    <MapWithControls
                      onLocationUpdate={setSelectedPosition}
                      selectedPosition={selectedPosition}
                      onMapClick={handleMapClick}
                    />
                  </Map>
                </APIProvider>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setOpen(false)}>
                {t("buttons.cancel")}
              </Button>
              <Button
                type="submit"
                onClick={handleSave}
                disabled={!selectedPosition}
              >
                {t("buttons.next")}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="space-y-4">
            <AddressForm
              selectedPosition={selectedPosition}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
              isLoading={isSubmitting}
              initialData={address}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
