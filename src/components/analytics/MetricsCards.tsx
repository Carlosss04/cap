import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowUp,
  ArrowDown,
  Clock,
  AlertTriangle,
  CheckCircle,
  BarChart,
} from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const MetricCard = ({
  title = "Metric",
  value = "0",
  icon = <BarChart className="h-5 w-5" />,
  trend,
  className = "",
}: MetricCardProps) => {
  return (
    <Card className={`bg-white ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="h-8 w-8 rounded-full bg-muted/20 p-1.5 text-muted-foreground">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <div className="mt-1 flex items-center text-xs">
            <span
              className={`mr-1 flex items-center ${trend.isPositive ? "text-green-500" : "text-red-500"}`}
            >
              {trend.isPositive ? (
                <ArrowUp className="h-3 w-3" />
              ) : (
                <ArrowDown className="h-3 w-3" />
              )}
              {trend.value}%
            </span>
            <span className="text-muted-foreground">from last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface MetricsCardsProps {
  totalIssues?: number;
  resolvedIssues?: number;
  pendingIssues?: number;
  avgResolutionTime?: string;
  criticalIssues?: number;
  mostCommonCategory?: string;
}

const MetricsCards = ({
  totalIssues = 248,
  resolvedIssues = 156,
  pendingIssues = 92,
  avgResolutionTime = "3.2 days",
  criticalIssues = 12,
  mostCommonCategory = "Road Maintenance",
}: MetricsCardsProps) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <MetricCard
          title="Total Issues"
          value={totalIssues}
          icon={<BarChart className="h-5 w-5" />}
          trend={{ value: 12, isPositive: true }}
        />

        <MetricCard
          title="Resolved Issues"
          value={resolvedIssues}
          icon={<CheckCircle className="h-5 w-5" />}
          trend={{ value: 8, isPositive: true }}
        />

        <MetricCard
          title="Pending Issues"
          value={pendingIssues}
          icon={<Clock className="h-5 w-5" />}
          trend={{ value: 2, isPositive: false }}
        />

        <MetricCard
          title="Avg. Resolution Time"
          value={avgResolutionTime}
          icon={<Clock className="h-5 w-5" />}
          trend={{ value: 5, isPositive: true }}
        />

        <MetricCard
          title="Critical Issues"
          value={criticalIssues}
          icon={<AlertTriangle className="h-5 w-5" />}
          trend={{ value: 3, isPositive: false }}
        />

        <MetricCard
          title="Most Common Category"
          value={mostCommonCategory}
          icon={<BarChart className="h-5 w-5" />}
        />
      </div>
    </div>
  );
};

export default MetricsCards;
