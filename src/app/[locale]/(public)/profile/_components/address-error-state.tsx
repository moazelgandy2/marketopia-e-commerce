import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface AddressErrorStateProps {
  onRetry: () => void;
  error?: string;
}

export const AddressErrorState = ({
  onRetry,
  error,
}: AddressErrorStateProps) => {
  return (
    <div className="text-center py-8">
      <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8 text-red-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Failed to load addresses
      </h3>
      <p className="text-gray-500 mb-6 max-w-sm mx-auto">
        {error ||
          "Something went wrong while loading your addresses. Please try again."}
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
