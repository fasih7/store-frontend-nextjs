import { ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
  gradient?: string;
  iconColor?: string;
  iconBg?: string;
}

export function StatCard({
  title,
  value,
  icon,
  description,
  trend,
  className,
  gradient,
  iconColor = "text-blue-600",
  iconBg = "bg-blue-100",
}: StatCardProps) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden hover:shadow-lg hover:scale-[1.02] transition-all duration-300 border-0 shadow-sm",
        gradient && `bg-gradient-to-br ${gradient}`,
        className
      )}
    >
      <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
        <div className="w-full h-full bg-foreground rounded-full blur-3xl" />
      </div>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <div
            className={cn(
              "p-2.5 rounded-lg transition-transform hover:scale-110 flex items-center justify-center",
              iconBg
            )}
          >
            <div className={cn(iconColor)}>{icon}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-3xl font-bold tracking-tight mb-1">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mb-2">{description}</p>
        )}
        {trend && (
          <div className="flex items-center gap-1.5 mt-3">
            <span
              className={cn(
                "text-xs font-semibold flex items-center gap-1",
                trend.isPositive
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-red-600 dark:text-red-400"
              )}
            >
              {trend.isPositive ? "↑" : "↓"} {trend.value}
            </span>
            <span className="text-xs text-muted-foreground">
              from last month
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
