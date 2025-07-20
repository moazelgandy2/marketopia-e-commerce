import { Skeleton } from "@/components/ui/skeleton";

export const AddressSkeleton = () => {
  return (
    <div className="border rounded-xl p-4 flex justify-between items-start dark:border-slate-700">
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-3 w-28" />
      </div>
      <Skeleton className="h-8 w-8 rounded-md" />
    </div>
  );
};

export const AddressesSkeleton = () => {
  return (
    <div className="space-y-4">
      <AddressSkeleton />
      <AddressSkeleton />
      <AddressSkeleton />
    </div>
  );
};
