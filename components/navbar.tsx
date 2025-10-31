"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, Search, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";
import CartSheet from "./cart-sheet";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";
import UserMenu from "./misc/user-dropdown";
import { useAuth } from "@/contexts/AuthContext";
import SearchDropdown from "./search/search-dropdown";

/**
 * @description The main navigation component.
 *
 * @returns {JSX.Element} - The navigation component.
 */
export default function Navbar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const { isLoggedIn } = useAuth();

  /**
   * Handle search form submission.
   *
   * @param {React.FormEvent} e - Event object.
   */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Redirect to products page with query parameter.
      router.push(`/products?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchDropdownOpen(false);
    }
  };

  /**
   * Handle search input change.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - Event object.
   */
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setIsSearchDropdownOpen(value.trim().length > 0);
  };

  /**
   * Handle navigation to products page with search query.
   *
   * @param {string} query - Search query.
   */
  const handleNavigateToProducts = (query: string) => {
    router.push(`/products?q=${encodeURIComponent(query)}`);
  };

  /**
   * Close search dropdown when clicking outside.
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const routes = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/categories", label: "Categories" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 w-full z-50 bg-white border-b">
      <div className="container mx-auto md:py-6 md:px-8 flex h-16 items-center">
        {/* Mobile Navigation */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetTitle className="text-sm text-bold hidden">Menu</SheetTitle>
              <nav className="flex flex-col gap-4 mt-8 px-12">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className="text-lg font-medium transition-colors hover:text-primary"
                  >
                    {route.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo */}
        <Link className="flex items-center gap-2 ml-4 md:ml-0 md:mr-8" href="/">
          <ShoppingBag className="h-6 w-6" />
          <span className="font-bold text-xl">Store</span>
        </Link>

        {/* Nav links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className="font-medium transition-colors hover:text-primary"
            >
              {route.label}
            </Link>
          ))}
        </nav>

        {/* Search & Cart */}
        <div className="flex items-center gap-4 ml-auto px-4 md:px-0">
          <div className="hidden md:flex items-center relative" ref={searchRef}>
            <form onSubmit={handleSearch} role="search">
              <div className="relative">
                <Search
                  className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="w-full md:w-[200px] lg:w-[300px] pl-8"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  aria-label="Search products"
                  autoComplete="off"
                />
              </div>
            </form>
            <SearchDropdown
              query={searchQuery}
              isOpen={isSearchDropdownOpen}
              onClose={() => setIsSearchDropdownOpen(false)}
              onNavigate={handleNavigateToProducts}
            />
          </div>

          {/* Mobile Search */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => router.push("/products")}
            aria-label="Open products page"
          >
            <Search className="w-5 h-5" />
          </Button>

          {/* Sheet */}
          <CartSheet />
          {isLoggedIn ? (
            <UserMenu />
          ) : (
            <Button>
              <Link href="/auth">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

