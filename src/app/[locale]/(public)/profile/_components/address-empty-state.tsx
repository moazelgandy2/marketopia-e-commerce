import { Button } from "@/components/ui/button";
import { MapPin, Plus } from "lucide-react";
import { useTranslations } from "next-intl";

interface AddressEmptyStateProps {
  onAddAddress: () => void;
}

export const AddressEmptyState = ({ onAddAddress }: AddressEmptyStateProps) => {
  const t = useTranslations("ProfilePage.addresses.empty");

  return (
    <div className="text-center py-8">
      <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <MapPin className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("title")}</h3>
      <p className="text-gray-500 mb-6 max-w-sm mx-auto">{t("subtitle")}</p>
    </div>
  );
};
