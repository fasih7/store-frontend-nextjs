import { z } from "zod";

// User validation schemas
export const userRegistrationSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "First name can only contain letters and spaces"),

  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Last name can only contain letters and spaces"),

  email: z
    .string()
    .email("Please enter a valid email address")
    .max(100, "Email must be less than 100 characters"),

  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be less than 15 digits")
    .regex(/^[0-9+\-\s()]+$/, "Please enter a valid phone number"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be less than 100 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one lowercase letter, one uppercase letter, and one number"
    ),
});

export const userLoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

// Checkout validation schema
export const checkoutSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters"),

  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters"),

  email: z.string().email("Please enter a valid email address"),

  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[0-9+\-\s()]+$/, "Please enter a valid phone number"),

  address: z
    .string()
    .min(10, "Address must be at least 10 characters")
    .max(200, "Address must be less than 200 characters"),

  city: z
    .string()
    .min(2, "City must be at least 2 characters")
    .max(50, "City must be less than 50 characters"),

  province: z
    .string()
    .min(2, "Province must be at least 2 characters")
    .max(50, "Province must be less than 50 characters"),

  zip: z
    .string()
    .min(5, "ZIP code must be at least 5 characters")
    .max(10, "ZIP code must be less than 10 characters")
    .regex(/^[0-9A-Za-z\s\-]+$/, "Please enter a valid ZIP code"),

  paymentMethod: z.enum(["cash", "card", "paypal"], {
    required_error: "Please select a payment method",
  }),
});

// Search validation schema
export const searchSchema = z
  .object({
    query: z
      .string()
      .min(1, "Search query cannot be empty")
      .max(100, "Search query must be less than 100 characters")
      .trim(),

    category: z.string().optional(),

    minPrice: z.number().min(0, "Minimum price cannot be negative").optional(),

    maxPrice: z.number().min(0, "Maximum price cannot be negative").optional(),
  })
  .refine(
    (data) => {
      if (data.minPrice && data.maxPrice) {
        return data.minPrice <= data.maxPrice;
      }
      return true;
    },
    {
      message: "Maximum price must be greater than minimum price",
      path: ["maxPrice"],
    }
  );

// Newsletter subscription schema
export const newsletterSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(100, "Email must be less than 100 characters"),
});

// Contact form schema
export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),

  email: z
    .string()
    .email("Please enter a valid email address")
    .max(100, "Email must be less than 100 characters"),

  subject: z
    .string()
    .min(5, "Subject must be at least 5 characters")
    .max(200, "Subject must be less than 200 characters"),

  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be less than 1000 characters"),
});

// Product review schema
export const reviewSchema = z.object({
  rating: z
    .number()
    .min(1, "Rating must be at least 1 star")
    .max(5, "Rating cannot exceed 5 stars"),

  title: z
    .string()
    .min(5, "Review title must be at least 5 characters")
    .max(100, "Review title must be less than 100 characters"),

  comment: z
    .string()
    .min(10, "Review comment must be at least 10 characters")
    .max(500, "Review comment must be less than 500 characters"),
});

// Address validation schema
export const addressSchema = z.object({
  addressLine: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(255, "Address must be less than 255 characters"),

  city: z
    .string()
    .min(2, "City must be at least 2 characters")
    .max(100, "City must be less than 100 characters"),

  province: z
    .string()
    .min(2, "Province must be at least 2 characters")
    .max(100, "Province must be less than 100 characters"),

  postalCode: z
    .string()
    .min(5, "Postal code must be at least 5 characters")
    .max(20, "Postal code must be less than 20 characters")
    .regex(/^[0-9A-Za-z\s\-]+$/, "Please enter a valid postal code"),

  label: z
    .string()
    .min(2, "Label must be at least 2 characters")
    .max(20, "Label must be less than 20 characters"),

  isDefault: z.boolean().optional(),
});

// Export types
export type UserRegistration = z.infer<typeof userRegistrationSchema>;
export type UserLogin = z.infer<typeof userLoginSchema>;
export type CheckoutData = z.infer<typeof checkoutSchema>;
export type SearchData = z.infer<typeof searchSchema>;
export type NewsletterData = z.infer<typeof newsletterSchema>;
export type ContactData = z.infer<typeof contactSchema>;
export type ReviewData = z.infer<typeof reviewSchema>;
export type AddressData = z.infer<typeof addressSchema>;
