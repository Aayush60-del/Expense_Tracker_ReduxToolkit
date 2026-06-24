import React from "react";
import { Loader2 } from "lucide-react";

export function LoadingSpinner({ className, size = 24 }) {
  return (
    <div className={`flex justify-center items-center h-full w-full ${className}`}>
      <Loader2 className="animate-spin text-blue-600" size={size} />
    </div>
  );
}
