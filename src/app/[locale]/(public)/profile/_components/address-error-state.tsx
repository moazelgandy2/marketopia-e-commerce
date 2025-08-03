import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";

interface AddressErrorStateProps {
  onRetry: () => void;
  error?: string;
}

export const AddressErrorState = ({
  onRetry,
  error,
}: AddressErrorStateProps) => {
  const t = useTranslations("ProfilePage.addresses.error");

  return (
    <div className="text-center py-8">
      <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8 text-red-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{t("title")}</h3>
      <p className="text-gray-500 mb-6 max-w-sm mx-auto">
        {error || t("subtitle")}
      </p>
      <Button
        onClick={onRetry}
        variant="outline"
        className="inline-flex items-center"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Try Again
      </Button>
    </div>
  );
};
