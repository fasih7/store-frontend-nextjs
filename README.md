# Modern E-Commerce Store Frontend

A comprehensive e-commerce frontend application built with Next.js 15, featuring full authentication, user management, and backend API integration. This project implements a domain-driven design architecture with gateway patterns for clean separation of concerns.

## 🎯 Screenshots

### Cart Interface:

![Main Page With CART](preview/1.png)

### Product Page With Cart:

![Product Page](preview/2.png)

### Search Page:

![Search Page](preview/3.png)

## 🚀 Features

### Authentication & User Management

- **User Authentication**: Complete login/signup system with JWT tokens
- **Protected Routes**: Middleware-based route protection for authenticated users
- **User Profiles**: Comprehensive profile management with tabs for personal info, addresses, orders, wishlist, and payment methods
- **OTP Verification**: Input OTP forms for secure verification processes
- **Social Login**: Google and Twitter authentication integration (UI ready)

### E-Commerce Core Features

- **Product Catalog**: Browse products with detailed information and images
- **Advanced Search**: Full-text search with filtering by category and price range
- **Shopping Cart**: Add/remove items with persistent storage using localStorage
- **Checkout Flow**: Complete multi-step checkout process with shipping and payment forms
- **Order Management**: Order success pages and order tracking functionality
- **Wishlist**: Save favorite products for later purchase
- **Address Management**: Multiple shipping addresses with modal forms

### User Interface & Experience

- **Responsive Design**: Mobile-first design optimized for all devices
- **Modern UI**: Clean, minimalist aesthetic using shadcn/ui components
- **Loading States**: Smooth transitions and skeleton loading components
- **Toast Notifications**: User feedback with Sonner toast system
- **Form Validation**: Robust form handling with React Hook Form and Zod validation
- **Error Handling**: Comprehensive error boundaries and user-friendly error messages

### Technical Architecture

- **Domain-Driven Design**: Clean architecture with gateway pattern for API communication
- **State Management**: React Context for authentication and Zustand for complex state
- **Type Safety**: Full TypeScript implementation throughout the application
- **Performance**: Next.js Image optimization, code splitting, and efficient rendering
- **Security**: JWT token management with secure cookie storage

## 🛠️ Tech Stack

### Frontend Framework

- **Next.js 15** with App Router
- **React 19** with TypeScript
- **Tailwind CSS 4** for styling

### UI Components & Icons

- **shadcn/ui** component library
- **Radix UI** primitives for accessibility
- **Lucide React** for icons
- **Custom icons** for social authentication

### State Management & Data

- **React Context** for authentication state
- **Zustand** for complex state management
- **React Hook Form** for form handling
- **Zod** for schema validation

### Backend Integration

- **Custom HTTP Client** with authentication headers
- **Gateway Pattern** for API communication
- **JWT Token Management** with js-cookie
- **Error Handling** with custom HttpError class

### Additional Libraries

- **Sonner** for toast notifications
- **date-fns** for date manipulation
- **input-otp** for OTP input components
- **class-variance-authority** for component variants

## 📦 Installation & Setup

### Prerequisites

- Node.js 18 or higher
- npm, yarn, or pnpm
- Backend API server running

### Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Backend API Configuration
NEXT_PUBLIC_BACKEND_BASE_URL=http://localhost:8000

# Optional: Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Modern E-Commerce Store
```

### Installation Steps

1. **Clone the project**

   ```bash
   git clone <your-repository-url>
   cd store-frontend-nextjs
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Configure environment variables**

   - Copy `.env.local` and update with your backend API URL
   - Ensure your backend server is running and accessible

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 🏗️ Project Architecture

### Domain-Driven Design Structure

```
domain/
├── gateways/           # API communication layer
│   ├── auth.gateway.ts      # Authentication endpoints
│   ├── products.gateway.ts  # Product management
│   ├── categories.gateway.ts # Category management
│   ├── orders.gateway.ts    # Order processing
│   ├── user.gateway.ts      # User profile management
│   └── http-client.ts       # Base HTTP client with auth
└── http-error.ts       # Custom error handling
```

### Component Organization

```
components/
├── ui/                 # shadcn/ui components
├── forms/              # Form components
├── dialogs/            # Modal dialogs
├── tabs/               # Tab components
├── cards/              # Card components
├── products/           # Product-related components
├── search/             # Search functionality
├── loading/            # Loading states
└── shared/             # Shared utilities
```

### Context & State Management

```
contexts/
└── AuthContext.tsx     # Authentication state management

hooks/
├── use-cart.tsx        # Shopping cart logic
├── use-cart-sheet.ts   # Cart sheet state
└── use-toast.ts        # Toast notifications
```

## 🔐 Authentication Flow

### Login Process

1. User submits credentials via `/auth` page
2. AuthGateway sends request to backend `/auth/login`
3. JWT token stored in secure cookie
4. AuthContext updates authentication state
5. Middleware protects routes based on token presence

### Protected Routes

- `/profile-page/*` - Requires authentication
- `/auth/*` - Redirects authenticated users to home

### Token Management

- Automatic token inclusion in API requests
- Secure cookie storage with js-cookie
- Token validation on page refresh

## 🌐 API Integration

### Gateway Pattern

The application uses a gateway pattern for clean API communication:

```typescript
// Example usage
import { authGateway } from "@/domain/gateways/auth.gateway";

const handleLogin = async (email: string, password: string) => {
  try {
    await authGateway.login(email, password);
    // Handle success
  } catch (error) {
    // Handle error
  }
};
```

### Available Gateways

- **AuthGateway**: Login, logout, token management
- **ProductsGateway**: Product CRUD operations
- **CategoriesGateway**: Category management
- **OrdersGateway**: Order processing and tracking
- **UserGateway**: User profile and preferences

### HTTP Client Features

- Automatic authentication header injection
- Centralized error handling
- Request/response interceptors
- Type-safe API calls

## 📱 Key Pages & Routes

### Public Routes

- **Homepage (`/`)**: Hero section, featured products, categories
- **Products (`/products`)**: Product listing with filters
- **Product Detail (`/products/[id]`)**: Detailed product view
- **Categories (`/categories`)**: Category browsing
- **Search (`/search`)**: Advanced search with filters
- **Authentication (`/auth`)**: Login and signup forms

### Protected Routes

- **Profile (`/profile-page`)**: User account management
  - Personal information
  - Address management
  - Order history
  - Wishlist
  - Payment methods

### E-Commerce Flow

- **Checkout (`/checkout`)**: Multi-step checkout process
- **Order Success (`/order-success/[orderId]`)**: Order confirmation

## 🛒 Shopping Cart & State Management

### Cart Features

- **Add/Remove Items**: From product cards or detail pages
- **Persistent Storage**: Cart contents saved between sessions
- **Real-time Updates**: Immediate UI updates on cart changes
- **Cart Sheet**: Slide-out cart interface for quick access

### State Management Strategy

- **React Context**: Authentication and global app state
- **Zustand**: Complex state like cart, filters, and UI state
- **Local Storage**: Persistent data like cart contents
- **Cookies**: Authentication tokens and user preferences

## 🔍 Search & Filtering

### Advanced Search Features

- **Text Search**: Search across product names and descriptions
- **Category Filtering**: Filter by product categories
- **Price Range**: Adjustable price range slider
- **Real-time Results**: Instant filtering as criteria change
- **Mobile Optimization**: Collapsible filter panel

### Search Implementation

- Client-side filtering for immediate results
- Backend integration for comprehensive search
- Debounced search input for performance
- Search history and suggestions

## 📱 Responsive Design

### Mobile-First Approach

- **Breakpoint System**: Tailwind CSS responsive utilities
- **Touch-Friendly**: Optimized for touch interactions
- **Performance**: Optimized images and efficient rendering
- **Progressive Enhancement**: Core functionality works on all devices

### Device Support

- Mobile phones (320px+)
- Tablets (768px+)
- Desktop (1024px+)
- Large screens (1440px+)

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your Git repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy with automatic builds on push

### Environment Variables for Production

```env
NEXT_PUBLIC_BACKEND_BASE_URL=https://your-api-domain.com
NEXT_PUBLIC_SITE_URL=https://your-store-domain.com
```

### Other Platforms

The application can be deployed to any platform supporting Next.js:

- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## 🔧 Development

### Available Scripts

```bash
npm run dev      # Start development server with Turbopack
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Code Quality

- **ESLint**: Code linting with Next.js configuration
- **TypeScript**: Strict type checking
- **Prettier**: Code formatting (if configured)
- **Component Structure**: Consistent component organization

## 🎨 Customization

### Styling

- Update `app/globals.css` for global styles
- Customize shadcn/ui components in `components/ui/`
- Modify Tailwind configuration for design system changes

### Backend Integration

- Update gateway endpoints in `domain/gateways/`
- Modify HTTP client configuration in `domain/gateways/http-client.ts`
- Add new API endpoints by extending existing gateways

### Components

- All components are modular and reusable
- Follow TypeScript interfaces in `lib/types.ts`
- Use consistent naming conventions

## 🔮 Future Enhancements

Potential features for future development:

- **Payment Gateway Integration**: Stripe, PayPal integration
- **Inventory Management**: Real-time stock tracking
- **Email Notifications**: Order confirmations and updates
- **Multi-language Support**: Internationalization
- **Dark Mode**: Theme switching capability
- **Progressive Web App**: Offline functionality
- **Advanced Analytics**: User behavior tracking
- **Product Reviews**: Customer review system
- **Recommendation Engine**: AI-powered product suggestions

## 📊 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the MIT License.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the Issues section for existing solutions
2. Create a new issue with detailed information
3. Include steps to reproduce any bugs
4. Provide environment details and error messages

---

**Built with ❤️ using Next.js 15, React 19, and modern web technologies**
