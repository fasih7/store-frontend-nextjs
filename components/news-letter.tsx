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
    <section className="w-full py-12 bg-gray-50">
      <div className="container mx-auto px-4 py-4 md:py-6 md:px-8">
        <div className="flex flex-col items-center space-y-4 text-center">
          {/* Newsletter title and description */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">
              Subscribe to Our Newsletter
            </h2>
            <p className="mx-auto max-w-[600px] text-gray-500">
              Stay updated with our latest products and exclusive offers.
            </p>
          </div>
          {/* Newsletter form */}
          <div className="w-full max-w-sm space-y-2">
            <form className="flex space-x-2" onSubmit={handleSubmit}>
              {/* Email input field */}
              <div className="flex-1">
                <Input
                  placeholder="Enter your email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) {
                      setErrors((prev) => ({ ...prev, email: "" }));
                    }
                  }}
                  disabled={isLoading}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
              {/* Subscribe button */}
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Subscribe
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default NewsLetter;
