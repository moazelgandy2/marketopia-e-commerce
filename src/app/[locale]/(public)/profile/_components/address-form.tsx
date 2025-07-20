"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useConfigData } from "@/hooks/use-config";
import { Skeleton } from "@/components/ui/skeleton";

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
}

export const AddressForm = ({
  selectedPosition,
  onSubmit,
  onCancel,
  isLoading = false,
}: AddressFormProps) => {
  const { config, cities, isLoading: citiesLoading } = useConfigData();

  const [formData, setFormData] = useState<AddressFormData>({
    name: "",
    address: "",
    phone: "",
    lat: selectedPosition ? selectedPosition.lat.toString() : "",
    lng: selectedPosition ? selectedPosition.lng.toString() : "",
    is_default: 0,
    city_id: 0,
  });

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
      alert("Please select a city");
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
          <Label htmlFor="name">Address Name</Label>
          <select
            id="name"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            required
          >
            <option value="">Select address type</option>
            <option value="home">Home</option>
            <option value="work">Work</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="e.g., 01114773472"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address Details</Label>
        <Input
          id="address"
          placeholder="Street address, building number, etc."
          value={formData.address}
          onChange={(e) => handleInputChange("address", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="city">City</Label>
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
            <option value={0}>Select a city</option>
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

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="is_default"
          checked={formData.is_default === 1}
          onChange={(e) =>
            handleInputChange("is_default", e.target.checked ? 1 : 0)
          }
          className="rounded border-gray-300"
        />
        <Label htmlFor="is_default">Set as default address</Label>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading || !selectedPosition}
        >
          {isLoading ? "Saving..." : "Save Address"}
        </Button>
      </div>
    </form>
  );
};
