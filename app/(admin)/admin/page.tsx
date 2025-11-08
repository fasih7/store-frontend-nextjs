"use client";

import { StatCard } from "@/components/admin/stat-card";
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  ArrowRight,
  Activity,
  BarChart3,
  Star,
  Clock,
  CheckCircle2,
  Eye,
  ArrowUpRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";

function getTimeBasedGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
}

export default function AdminPage() {
  // Placeholder data
  const stats = [
    {
      title: "Total Revenue",
      value: "$45,231.89",
      icon: <DollarSign className="h-5 w-5" />,
      description: "Revenue from all sales",
      trend: { value: "+12.5%", isPositive: true },
      gradient:
        "from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
    },
    {
      title: "Total Orders",
      value: "1,234",
      icon: <ShoppingCart className="h-5 w-5" />,
      description: "Orders this month",
      trend: { value: "+8.2%", isPositive: true },
      gradient:
        "from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20",
      iconColor: "text-blue-600 dark:text-blue-400",
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: "Total Products",
      value: "856",
      icon: <Package className="h-5 w-5" />,
      description: "Active products",
      trend: { value: "+5.1%", isPositive: true },
      gradient:
        "from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20",
      iconColor: "text-purple-600 dark:text-purple-400",
      iconBg: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      title: "Total Customers",
      value: "3,245",
      icon: <Users className="h-5 w-5" />,
      description: "Registered users",
      trend: { value: "+18.3%", isPositive: true },
      gradient:
        "from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20",
      iconColor: "text-amber-600 dark:text-amber-400",
      iconBg: "bg-amber-100 dark:bg-amber-900/30",
    },
  ];

  const recentOrders = [
    {
      id: "#ORD-001",
      customer: "John Doe",
      product: "Wireless Headphones",
      status: "Completed",
      amount: "$129.99",
      date: new Date("2024-01-15T10:30:00"),
    },
    {
      id: "#ORD-002",
      customer: "Jane Smith",
      product: "Smart Watch",
      status: "Pending",
      amount: "$89.50",
      date: new Date("2024-01-15T08:15:00"),
    },
    {
      id: "#ORD-003",
      customer: "Bob Johnson",
      product: "Laptop Stand",
      status: "Processing",
      amount: "$199.99",
      date: new Date("2024-01-14T16:45:00"),
    },
    {
      id: "#ORD-004",
      customer: "Alice Brown",
      product: "USB-C Cable",
      status: "Completed",
      amount: "$49.99",
      date: new Date("2024-01-14T12:20:00"),
    },
  ];

  const topProducts = [
    {
      name: "Wireless Headphones",
      sales: 234,
      revenue: "$23,166",
      rating: 4.8,
    },
    { name: "Smart Watch Pro", sales: 189, revenue: "$18,711", rating: 4.9 },
    {
      name: "Laptop Stand Deluxe",
      sales: 156,
      revenue: "$31,044",
      rating: 4.7,
    },
    { name: "USB-C Cable Set", sales: 142, revenue: "$7,098", rating: 4.6 },
    { name: "Wireless Mouse", sales: 128, revenue: "$6,400", rating: 4.5 },
  ];

  const activities = [
    {
      type: "order",
      message: "New order #ORD-005 received",
      time: new Date("2024-01-15T14:30:00"),
      icon: ShoppingCart,
    },
    {
      type: "product",
      message: "Product 'Smart Watch Pro' stock updated",
      time: new Date("2024-01-15T13:15:00"),
      icon: Package,
    },
    {
      type: "user",
      message: "New customer registered",
      time: new Date("2024-01-15T11:45:00"),
      icon: Users,
    },
    {
      type: "order",
      message: "Order #ORD-002 marked as shipped",
      time: new Date("2024-01-15T10:20:00"),
      icon: CheckCircle2,
    },
  ];

  const quickStats = [
    { label: "Avg. Order Value", value: "$125.50", trend: "+5.2%" },
    { label: "Conversion Rate", value: "3.24%", trend: "+0.8%" },
    { label: "Customer Satisfaction", value: "4.7/5", trend: "+0.3" },
  ];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Completed":
        return "default";
      case "Pending":
        return "secondary";
      case "Processing":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-8 pb-8">
      {/* Enhanced Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              {getTimeBasedGreeting()}
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              {format(new Date(), "EEEE, MMMM d, yyyy")}
            </p>
          </div>
          <Button asChild size="lg" className="shadow-sm">
            <Link href="/admin/orders">
              View All Orders <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening with your store today.
        </p>
      </div>

      {/* Enhanced Stats Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        {quickStats.map((stat, index) => (
          <Card
            key={index}
            className="bg-muted/50 hover:bg-muted/70 transition-colors"
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                >
                  {stat.trend}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Two Column Layout for Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Orders - Takes 2 columns */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Recent Orders
                </CardTitle>
                <CardDescription className="mt-1">
                  Latest orders from your customers
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/orders">
                  View All <ArrowRight className="ml-2 h-3 w-3" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentOrders.map((order, index) => (
                <div key={order.id}>
                  <div className="flex items-center justify-between p-4 rounded-lg hover:bg-accent/50 transition-all group border border-transparent hover:border-border">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-sm">{order.id}</p>
                          <Badge
                            variant={getStatusVariant(order.status)}
                            className="text-xs"
                          >
                            {order.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {order.customer} • {order.product}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDistanceToNow(order.date, { addSuffix: true })}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="font-bold text-lg">{order.amount}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          asChild
                        >
                          <Link href={`/admin/orders/${order.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                  {index < recentOrders.length - 1 && (
                    <Separator className="my-3" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activity Feed - Takes 1 column */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest system events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div key={index} className="flex gap-3">
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="p-2 rounded-lg bg-muted">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.message}</p>
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(activity.time, {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Sections */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Sales Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Sales Overview
                </CardTitle>
                <CardDescription className="mt-1">
                  Revenue trends for the last 30 days
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center rounded-lg bg-muted/30 border-2 border-dashed">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">
                  Chart visualization placeholder
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Connect your analytics service to view trends
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Top Products
                </CardTitle>
                <CardDescription className="mt-1">
                  Best performing products this month
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/products">
                  View All <ArrowRight className="ml-2 h-3 w-3" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors group"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {product.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          <span className="text-xs text-muted-foreground">
                            {product.rating}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">
                          {product.sales} sales
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">{product.revenue}</p>
                    <p className="text-xs text-muted-foreground">revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Quick Links */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-6">
          Quick Actions
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all hover:shadow-lg cursor-pointer bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/10 dark:to-indigo-950/10">
            <Link href="/admin/products" className="block">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 group-hover:scale-110 transition-transform">
                    <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-blue-600 transition-colors" />
                </div>
                <CardTitle>Products</CardTitle>
                <CardDescription>
                  Manage your products inventory and listings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mt-4">
                  <div>
                    <p className="text-2xl font-bold">856</p>
                    <p className="text-xs text-muted-foreground">
                      Active products
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="group-hover:bg-blue-600 group-hover:text-white transition-colors"
                  >
                    Manage <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all hover:shadow-lg cursor-pointer bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/10 dark:to-teal-950/10">
            <Link href="/admin/orders" className="block">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-3 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 group-hover:scale-110 transition-transform">
                    <ShoppingCart className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-emerald-600 transition-colors" />
                </div>
                <CardTitle>Orders</CardTitle>
                <CardDescription>
                  View and process customer orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mt-4">
                  <div>
                    <p className="text-2xl font-bold">1,234</p>
                    <p className="text-xs text-muted-foreground">This month</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="group-hover:bg-emerald-600 group-hover:text-white transition-colors"
                  >
                    Manage <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Link>
          </Card>

          <Card className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all hover:shadow-lg cursor-pointer bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/10 dark:to-orange-950/10">
            <Link href="/admin/users" className="block">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-3 rounded-lg bg-amber-100 dark:bg-amber-900/30 group-hover:scale-110 transition-transform">
                    <Users className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-amber-600 transition-colors" />
                </div>
                <CardTitle>Customers</CardTitle>
                <CardDescription>
                  Manage customer accounts and information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mt-4">
                  <div>
                    <p className="text-2xl font-bold">3,245</p>
                    <p className="text-xs text-muted-foreground">
                      Registered users
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="group-hover:bg-amber-600 group-hover:text-white transition-colors"
                  >
                    Manage <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
