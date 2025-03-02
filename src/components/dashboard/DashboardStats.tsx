import React from "react";
import { Card, CardContent } from "../ui/card";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { AlertCircle, CheckCircle, Clock, Plus } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  total?: number;
  icon: React.ReactNode;
  color: string;
  progress?: number;
}

const StatCard: React.FC<StatCardProps> = ({
  title = "Statistic",
  value = 0,
  total = 100,
  icon = <CheckCircle className="h-5 w-5" />,
  color = "bg-green-500",
  progress = 0,
}) => {
  return (
    <Card className="bg-white shadow-sm hover:shadow transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <div className={`p-2 rounded-full ${color}`}>{icon}</div>
        </div>
        <div className="flex items-end gap-2 mb-2">
          <span className="text-2xl font-bold">{value}</span>
          {total > 0 && (
            <span className="text-sm text-gray-500 mb-1">of {total}</span>
          )}
        </div>
        {progress !== undefined && (
          <Progress value={progress} className="h-2 mb-2" />
        )}
      </CardContent>
    </Card>
  );
};

interface DashboardStatsProps {
  totalReports?: number;
  resolvedReports?: number;
  pendingReports?: number;
  inProgressReports?: number;
  criticalReports?: number;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  totalReports = 0,
  resolvedReports = 0,
  pendingReports = 0,
  inProgressReports = 0,
  criticalReports = 0,
}) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Report Summary</h2>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-white">
            Last 30 days
          </Badge>
          <Button size="sm" variant="outline" className="bg-white">
            <Plus className="h-4 w-4 mr-1" /> New Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Reports"
          value={totalReports}
          icon={<CheckCircle className="h-5 w-5 text-white" />}
          color="bg-blue-500"
          progress={100}
        />

        <StatCard
          title="Resolved"
          value={resolvedReports}
          total={totalReports}
          icon={<CheckCircle className="h-5 w-5 text-white" />}
          color="bg-green-500"
          progress={(resolvedReports / totalReports) * 100}
        />

        <StatCard
          title="Pending"
          value={pendingReports}
          total={totalReports}
          icon={<Clock className="h-5 w-5 text-white" />}
          color="bg-yellow-500"
          progress={(pendingReports / totalReports) * 100}
        />

        <StatCard
          title="In Progress"
          value={inProgressReports}
          total={totalReports}
          icon={<Clock className="h-5 w-5 text-white" />}
          color="bg-indigo-500"
          progress={(inProgressReports / totalReports) * 100}
        />

        <StatCard
          title="Critical"
          value={criticalReports}
          total={totalReports}
          icon={<AlertCircle className="h-5 w-5 text-white" />}
          color="bg-red-500"
          progress={(criticalReports / totalReports) * 100}
        />
      </div>
    </div>
  );
};

export default DashboardStats;
