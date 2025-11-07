"use client";

import { Search, Bell, Settings, LogOut, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function AdminHeader() {
  const pathname = usePathname();

  // Extract page title from pathname
  const getPageTitle = () => {
    if (pathname === "/admin") return "Dashboard";
    const title = pathname.split("/").pop();
    return title ? title.charAt(0).toUpperCase() + title.slice(1) : "Admin";
  };

  return (
    <header className="sticky top-0 z-30 border-b border-border/50 glass-panel backdrop-blur-xl shadow-sm">
      <div className="flex h-20 items-center gap-4 px-6">
        {/* Page Title */}
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent truncate">
            {getPageTitle()}
          </h1>
        </div>

        {/* Search */}
        {/* <div className="hidden md:flex items-center gap-2">
          <div className="relative w-72 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary z-10" />
            <Input 
              type="search" 
              placeholder="Search anything..." 
              className={cn(
                "pl-10 pr-4 h-10 glass-input",
                "border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20",
                "transition-all duration-200 placeholder:text-muted-foreground/60",
                "hover:border-border focus:shadow-lg focus:shadow-primary/5"
              )} 
            />
          </div>
        </div> */}

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "relative h-10 w-10 rounded-xl transition-all duration-200 group",
              "hover:bg-accent/50 hover:scale-105 hover:shadow-md",
              "focus:ring-2 focus:ring-primary/20"
            )}
          >
            <Bell className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
            {/* Enhanced notification badge */}
            <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-gradient-to-br from-red-500 to-red-600 border-2 border-background shadow-lg">
              <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75" />
            </span>
          </Button>

          {/* Settings */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-10 w-10 rounded-xl transition-all duration-200",
              "hover:bg-accent/50 hover:scale-105 hover:shadow-md",
              "focus:ring-2 focus:ring-primary/20"
            )}
          >
            <Settings className="h-5 w-5 transition-transform duration-200 hover:rotate-90" />
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "relative h-10 w-10 rounded-xl p-0 transition-all duration-200",
                  "hover:scale-105 hover:shadow-md hover:ring-2 hover:ring-primary/20",
                  "focus:ring-2 focus:ring-primary/20"
                )}
              >
                <Avatar className="h-10 w-10 border-2 border-border/50 shadow-sm">
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 text-primary font-semibold">
                    AD
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className={cn(
                "w-64 glass-panel backdrop-blur-xl border-border/50 shadow-xl",
                "p-2"
              )}
            >
              <DropdownMenuLabel className="px-3 py-2 font-semibold text-base">
                My Account
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border/50" />
              <DropdownMenuItem
                className={cn(
                  "px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200",
                  "hover:bg-accent/50 focus:bg-accent/50"
                )}
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                className={cn(
                  "px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200",
                  "hover:bg-accent/50 focus:bg-accent/50"
                )}
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border/50" />
              <DropdownMenuItem
                className={cn(
                  "px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200",
                  "text-destructive focus:text-destructive focus:bg-destructive/10 hover:bg-destructive/10"
                )}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
