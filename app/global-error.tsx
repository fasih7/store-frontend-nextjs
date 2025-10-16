"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md mx-auto text-center px-4">
            <div className="mb-8">
              <AlertTriangle className="h-24 w-24 text-red-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Something went wrong!
              </h1>
              <p className="text-gray-600 mb-8">
                We're sorry, but something unexpected happened. Our team has
                been notified.
              </p>
            </div>

            <div className="space-y-4">
              <Button onClick={reset} className="w-full">
                Try again
              </Button>

              <Button
                variant="outline"
                onClick={() => (window.location.href = "/")}
                className="w-full"
              >
                Go to homepage
              </Button>
            </div>

            {process.env.NODE_ENV === "development" && error.digest && (
              <p className="text-xs text-gray-400 mt-4">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}
