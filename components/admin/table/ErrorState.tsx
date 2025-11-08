"use client";

export interface ErrorStateProps {
  error: Error | null;
  onRetry: () => void;
  message?: string;
}

/**
 * Generic error state component
 * Can be used across all admin pages for consistent error UI
 */
export function ErrorState({
  error,
  onRetry,
  message,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <p className="text-destructive">
        {message || error?.message || "An error occurred"}
      </p>
      <button
        onClick={onRetry}
        className="text-sm text-primary hover:underline"
      >
        Try again
      </button>
    </div>
  );
}

