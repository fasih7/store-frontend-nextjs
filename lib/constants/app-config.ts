/**
 * App-wide configuration constants
 */

export const APP_CONFIG = {
  // Pagination
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 100,
  
  // Cart limits
  MAX_CART_ITEMS: 50,
  CART_STORAGE_KEY: "cart",
  
  // Token storage
  ACCESS_TOKEN_KEY: "access_token",
  
  // API endpoints
  BACKEND_BASE_URL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "",
  
  // Feature flags (for future use)
  FEATURES: {
    enableWishlist: true,
    enableReviews: false,
    enableRatings: false,
  },
} as const;



