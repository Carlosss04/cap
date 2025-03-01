import React from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

interface ChartsGridProps {
  issuesByCategory?: Array<{ name: string; value: number }>;
  resolutionTimeData?: Array<{ name: string; time: number }>;
  barangayComparisonData?: Array<{ name: string; issues: number }>;
  trendData?: Array<{ date: string; issues: number }>;
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
];

const ChartsGrid = ({
  issuesByCategory = [
    { name: "Roads", value: 35 },
    { name: "Drainage", value: 25 },
    { name: "Electricity", value: 18 },
    { name: "Water Supply", value: 15 },
    { name: "Waste Management", value: 12 },
    { name: "Others", value: 8 },
  ],
  resolutionTimeData = [
    { name: "Roads", time: 5.2 },
    { name: "Drainage", time: 7.1 },
    { name: "Electricity", time: 3.8 },
    { name: "Water Supply", time: 4.5 },
    { name: "Waste Management", time: 2.9 },
    { name: "Others", time: 6.3 },
  ],
  barangayComparisonData = [
    { name: "Barangay A", issues: 45 },
    { name: "Barangay B", issues: 32 },
    { name: "Barangay C", issues: 28 },
    { name: "Barangay D", issues: 19 },
    { name: "Barangay E", issues: 23 },
  ],
  trendData = [
    { date: "Jan", issues: 12 },
    { date: "Feb", issues: 19 },
    { date: "Mar", issues: 15 },
    { date: "Apr", issues: 22 },
    { date: "May", issues: 28 },
    { date: "Jun", issues: 24 },
  ],
}: ChartsGridProps) => {
  return (
    <div className="w-full h-full bg-white p-4 rounded-lg">
      <Tabs defaultValue="category" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="category">Issues by Category</TabsTrigger>
          <TabsTrigger value="resolution">Resolution Time</TabsTrigger>
          <TabsTrigger value="barangay">Barangay Comparison</TabsTrigger>
          <TabsTrigger value="trends">Trend Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="category" className="w-full h-[450px]">
          <Card className="p-4 h-full">
            <h3 className="text-lg font-medium mb-4">
              Issue Frequency by Category
            </h3>
            <ResponsiveContainer width="100%" height="90%">
              <PieChart>
                <Pie
                  data={issuesByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={150}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {issuesByCategory.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} issues`, "Count"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="resolution" className="w-full h-[450px]">
          <Card className="p-4 h-full">
            <h3 className="text-lg font-medium mb-4">
              Average Resolution Time by Category (Days)
            </h3>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart
                data={resolutionTimeData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis
                  label={{ value: "Days", angle: -90, position: "insideLeft" }}
                />
                <Tooltip
                  formatter={(value) => [`${value} days`, "Resolution Time"]}
                />
                <Legend />
                <Bar
                  dataKey="time"
                  fill="#00C49F"
                  name="Avg. Days to Resolve"
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="barangay" className="w-full h-[450px]">
          <Card className="p-4 h-full">
            <h3 className="text-lg font-medium mb-4">
              Issue Count by Barangay
            </h3>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart
                data={barangayComparisonData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip formatter={(value) => [`${value} issues`, "Count"]} />
                <Legend />
                <Bar dataKey="issues" fill="#8884d8" name="Total Issues" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="w-full h-[450px]">
          <Card className="p-4 h-full">
            <h3 className="text-lg font-medium mb-4">
              Issue Reporting Trends (6 Months)
            </h3>
            <ResponsiveContainer width="100%" height="90%">
              <LineChart
                data={trendData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} issues`, "Count"]} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="issues"
                  stroke="#FF8042"
                  activeDot={{ r: 8 }}
                  name="Issues Reported"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChartsGrid;
