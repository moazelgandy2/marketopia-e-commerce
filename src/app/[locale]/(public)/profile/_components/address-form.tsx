"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useConfigData } from "@/hooks/use-config";
import { Skeleton } from "@/components/ui/skeleton";
import { Address } from "@/types";
import { useTranslations } from "next-intl";

interface AddressFormData {
  name: string;
  address: string;
  phone: string;
  lat: string;
  lng: string;
  is_default: number;
  city_id: number;
}

interface AddressFormProps {
  selectedPosition?: google.maps.LatLngLiteral;
  onSubmit: (data: AddressFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  initialData?: Address; // For editing existing address
}

export const AddressForm = ({
  selectedPosition,
  onSubmit,
  onCancel,
  isLoading = false,
  initialData,
}: AddressFormProps) => {
  const { config, cities, isLoading: citiesLoading } = useConfigData();
  const t = useTranslations("AddressForm");

  const [formData, setFormData] = useState<AddressFormData>({
    name: "",
    address: "",
    phone: "",
    lat: selectedPosition ? selectedPosition.lat.toString() : "",
    lng: selectedPosition ? selectedPosition.lng.toString() : "",
    is_default: 0,
    city_id: 0,
  });

  // Update form data when initialData or selectedPosition changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        address: initialData.address,
        phone: initialData.phone,
        lat: selectedPosition
          ? selectedPosition.lat.toString()
          : initialData.lat,
        lng: selectedPosition
          ? selectedPosition.lng.toString()
          : initialData.lng,
        is_default: initialData.is_default,
        city_id: initialData.city.id,
      });
    } else if (selectedPosition) {
      setFormData((prev) => ({
        ...prev,
        lat: selectedPosition.lat.toString(),
        lng: selectedPosition.lng.toString(),
      }));
    }
  }, [initialData, selectedPosition]);

  const handleInputChange = (
    field: keyof AddressFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.city_id === 0) {
      alert(t("validation.selectCity"));
      return;
    }
    onSubmit(formData);
  };

  if (
    selectedPosition &&
    (formData.lat !== selectedPosition.lat.toString() ||
      formData.lng !== selectedPosition.lng.toString())
  ) {
    setFormData((prev) => ({
      ...prev,
      lat: selectedPosition.lat.toString(),
      lng: selectedPosition.lng.toString(),
    }));
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">{t("fields.addressName")}</Label>
          <select
            id="name"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            required
          >
            <option value="">{t("fields.selectType")}</option>
            <option value="home">{t("addressTypes.home")}</option>
            <option value="work">{t("addressTypes.work")}</option>
            <option value="other">{t("addressTypes.other")}</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">{t("fields.phoneNumber")}</Label>
          <Input
            id="phone"
            type="tel"
            placeholder={t("fields.phonePlaceholder")}
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">{t("fields.addressDetails")}</Label>
        <Input
          id="address"
          placeholder={t("fields.addressPlaceholder")}
          value={formData.address}
          onChange={(e) => handleInputChange("address", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="city">{t("fields.city")}</Label>
        {citiesLoading ? (
          <Skeleton className="h-10 w-full" />
        ) : (
          <select
            id="city"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.city_id}
            onChange={(e) =>
              handleInputChange("city_id", parseInt(e.target.value))
            }
            required
          >
            <option value={0}>{t("fields.selectCity")}</option>
            {cities.map((city: any) => (
              <option
                key={city.id}
                value={city.id}
              >
                {city.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className=" grid-cols-1 md:grid-cols-2 gap-4 hidden">
        <div className="space-y-2">
          <Label htmlFor="lat">Latitude</Label>
          <Input
            id="lat"
            type="number"
            step="any"
            placeholder="Latitude"
            value={formData.lat}
            onChange={(e) => handleInputChange("lat", e.target.value)}
            required
            readOnly
          />
        </div>

        <div className="space-y-2 h">
          <Label htmlFor="lng">Longitude</Label>
          <Input
            id="lng"
            type="number"
            step="any"
            placeholder="Longitude"
            value={formData.lng}
            onChange={(e) => handleInputChange("lng", e.target.value)}
            required
            readOnly
          />
        </div>
      </div>

      {/* Default Address Toggle */}
      <div className="space-y-2">
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-slate-50 dark:from-blue-950 dark:to-slate-950 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-slate-600 rounded-lg">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <Label
                htmlFor="is_default"
                className="text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                {t("fields.setAsDefault")}
              </Label>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t("fields.defaultDescription")}
              </p>
            </div>
          </div>
          <div className="relative">
            <input
              type="checkbox"
              id="is_default"
              checked={formData.is_default === 1}
              onChange={(e) =>
                handleInputChange("is_default", e.target.checked ? 1 : 0)
              }
              className="sr-only"
            />
            <label
              htmlFor="is_default"
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer ${
                formData.is_default === 1
                  ? "bg-gradient-to-r from-blue-500 to-slate-600"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.is_default === 1 ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          {t("buttons.cancel")}
        </Button>
        <Button
          type="submit"
          disabled={isLoading || !selectedPosition}
        >
          {isLoading ? t("buttons.saving") : t("buttons.saveAddress")}
        </Button>
      </div>
    </form>
  );
};
