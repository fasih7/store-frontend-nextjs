import { StatCard } from "@/components/admin/stat-card";
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminPage() {
  // Placeholder data
  const stats = [
    {
      title: "Total Revenue",
      value: "$45,231.89",
      icon: <DollarSign className="h-4 w-4" />,
      description: "Revenue from all sales",
      trend: { value: "+12.5%", isPositive: true },
    },
    {
      title: "Total Orders",
      value: "1,234",
      icon: <ShoppingCart className="h-4 w-4" />,
      description: "Orders this month",
      trend: { value: "+8.2%", isPositive: true },
    },
    {
      title: "Total Products",
      value: "856",
      icon: <Package className="h-4 w-4" />,
      description: "Active products",
      trend: { value: "+5.1%", isPositive: true },
    },
    {
      title: "Total Customers",
      value: "3,245",
      icon: <Users className="h-4 w-4" />,
      description: "Registered users",
      trend: { value: "+18.3%", isPositive: true },
    },
  ];

  const recentOrders = [
    {
      id: "#ORD-001",
      customer: "John Doe",
      product: "Product Name",
      status: "Completed",
      amount: "$129.99",
      date: "2024-01-15",
    },
    {
      id: "#ORD-002",
      customer: "Jane Smith",
      product: "Product Name",
      status: "Pending",
      amount: "$89.50",
      date: "2024-01-15",
    },
    {
      id: "#ORD-003",
      customer: "Bob Johnson",
      product: "Product Name",
      status: "Processing",
      amount: "$199.99",
      date: "2024-01-14",
    },
    {
      id: "#ORD-004",
      customer: "Alice Brown",
      product: "Product Name",
      status: "Completed",
      amount: "$49.99",
      date: "2024-01-14",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <p className="text-muted-foreground">
              Welcome back! Here&apos;s what&apos;s happening with your store.
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/orders">View All Orders</Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/admin/orders">View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-medium">{order.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.customer}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">{order.product}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : order.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {order.status}
                  </span>
                  <p className="font-semibold">{order.amount}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Manage your products inventory and listings
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/products">
                Manage Products <TrendingUp className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              View and process customer orders
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/orders">
                Manage Orders <TrendingUp className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Manage customer accounts and information
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/admin/users">
                Manage Users <TrendingUp className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
