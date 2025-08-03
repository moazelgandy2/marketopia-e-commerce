"use client";

import { Card, CardContent } from "@/components/ui/card";

export const OrderNotes = ({ notes }: { notes: string }) => {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Order Notes
        </h3>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <p className="text-sm text-gray-700">{notes}</p>
        </div>
      </CardContent>
    </Card>
  );
};
