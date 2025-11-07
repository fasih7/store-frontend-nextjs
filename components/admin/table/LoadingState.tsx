"use client";

import { Loader2 } from "lucide-react";

export interface LoadingStateProps {
  message?: string;
}

/**
 * Generic loading state component
 * Can be used across all admin pages for consistent loading UI
 */
export function LoadingState({ message }: LoadingStateProps) {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      {message && (
        <span className="ml-3 text-muted-foreground">{message}</span>
      )}
    </div>
  );
}

