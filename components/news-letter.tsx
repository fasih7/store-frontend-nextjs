"use client";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { newsletterSchema, type NewsletterData } from "@/lib/validations";
import { Loader2, Mail } from "lucide-react";

/**
 * A component for displaying a newsletter subscription form.
 *
 * @return {JSX.Element}
 */
function NewsLetter() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      // Validate the email
      const validatedData = newsletterSchema.parse({ email });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show success message
      toast({
        title: "Successfully subscribed!",
        description: "Thank you for subscribing to our newsletter.",
        variant: "success",
      });

      // Clear the form
      setEmail("");
    } catch (error: any) {
      if (error.errors) {
        // Zod validation errors
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach((err: any) => {
          if (err.path) {
            fieldErrors[err.path[0]] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        // API errors
        toast({
          title: "Subscription failed",
          description: "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative w-full py-20 overflow-hidden bg-gradient-to-b from-gray-100 via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
      {/* Decorative gradient elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gray-700/20 rounded-full blur-3xl"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-gray-700/5"></div>

      <div className="relative z-10 container mx-auto px-4 py-4 md:py-6 md:px-8">
        <div className="flex flex-col items-center space-y-8 text-center max-w-3xl mx-auto">
          {/* Newsletter title and description */}
          <div className="space-y-4 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
              <Mail className="w-5 h-5 text-primary" />
              <span className="text-primary font-medium text-sm">
                Newsletter
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
              Stay Updated With Our{" "}
              <span className="text-primary">Latest Offers</span>
            </h2>
            <p className="mx-auto max-w-[600px] text-gray-600 dark:text-gray-400 text-lg">
              Get exclusive deals, new product launches, and special promotions
              delivered straight to your inbox.
            </p>
          </div>

          {/* Newsletter form */}
          <div className="w-full max-w-lg space-y-4 animate-slide-up animate-delay-100">
            <form
              className="flex flex-col sm:flex-row gap-3"
              onSubmit={handleSubmit}
            >
              {/* Email input field */}
              <div className="flex-1">
                <Input
                  placeholder="Enter your email address"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) {
                      setErrors((prev) => ({ ...prev, email: "" }));
                    }
                  }}
                  disabled={isLoading}
                  className={`h-12 text-base transition-all duration-300 ${
                    errors.email ? "border-red-500 ring-red-500" : ""
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-2 text-left">
                    {errors.email}
                  </p>
                )}
              </div>
              {/* Subscribe button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="h-12 px-8 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-100"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <span className="flex items-center gap-2">
                    Subscribe
                    <Mail className="h-5 w-5" />
                  </span>
                )}
              </Button>
            </form>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>No spam</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <span>Unsubscribe anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default NewsLetter;
