"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FolderTree,
  Users,
  Settings,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

const navigationItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Categories", href: "/admin/categories", icon: FolderTree },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const NavContent = ({ isMobile = false }: { isMobile?: boolean }) => (
    <nav className="space-y-1.5">
      {navigationItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => isMobile && setIsMobileSidebarOpen(false)}
            className={cn(
              "group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300 ease-in-out",
              "hover:scale-[1.02] hover:shadow-md",
              isActive
                ? "bg-gradient-to-r from-primary/90 to-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
            )}
          >
            {/* Active indicator - left border */}
            {isActive && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-r-full bg-gradient-to-b from-primary-foreground/50 to-primary-foreground animate-fade-in" />
            )}

            {/* Icon with glow effect on hover */}
            <item.icon
              className={cn(
                "h-5 w-5 shrink-0 transition-all duration-300",
                isActive
                  ? "text-primary-foreground"
                  : "text-muted-foreground group-hover:text-accent-foreground group-hover:drop-shadow-[0_0_8px_rgba(102,126,234,0.4)]"
              )}
            />

            {/* Label with smooth transitions */}
            <span className="relative z-10 transition-colors duration-300">
              {item.name}
            </span>

            {/* Hover glow effect */}
            {!isActive && (
              <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            )}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="backdrop-blur-sm bg-background/80 border-border/50 shadow-lg hover:scale-105 transition-transform duration-200"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-72 p-0 glass-panel border-r backdrop-blur-xl"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex h-20 items-center border-b border-sidebar-border/50 px-6 bg-gradient-to-r from-sidebar-accent/20 via-transparent to-transparent">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/10">
                    <LayoutDashboard className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                      Admin Panel
                    </span>
                    <p className="text-xs text-muted-foreground">
                      Control Center
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <ScrollArea className="flex-1 px-4 py-6 custom-scrollbar">
                <NavContent isMobile />
              </ScrollArea>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:border-r lg:border-sidebar-border/50 glass-panel backdrop-blur-xl">
        {/* Header */}
        <div className="flex h-20 items-center border-b border-sidebar-border/50 px-6 bg-gradient-to-r from-sidebar-accent/20 via-transparent to-transparent">
          <div className="flex items-center gap-3 w-full">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/10 shadow-sm">
              <LayoutDashboard className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent block">
                Admin Panel
              </span>
              <p className="text-xs text-muted-foreground truncate">
                Control Center
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 custom-scrollbar">
          <div className="px-4 py-6">
            <NavContent />
          </div>
        </ScrollArea>
      </aside>
    </>
  );
}
