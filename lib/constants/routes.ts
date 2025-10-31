/**
 * Centralized route definitions for the application
 * Used for navigation consistency across the codebase
 */
export const ROUTES = {
  // Customer routes
  home: "/",
  products: "/products",
  categories: "/categories",
  checkout: "/checkout",
  search: "/search",
  
  // Profile routes
  profile: "/profile-page",
  profileTab: (tab: string) => `/profile-page?tab=${tab}`,
  
  // Order routes
  orderSuccess: (orderId: string) => `/order-success/${orderId}`,
  guestOrderSuccess: "/guest-order-success",
  
  // Auth routes
  auth: {
    login: "/auth",
    forgotPassword: "/auth?mode=forgot",
  },
  
  // Admin routes (placeholder for future implementation)
  admin: {
    dashboard: "/admin",
    products: "/admin/products",
    orders: "/admin/orders",
    users: "/admin/users",
    analytics: "/admin/analytics",
  },
} as const;



