import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Download, Filter, Printer, RefreshCw } from "lucide-react";
import MetricsCards from "./MetricsCards";
import ChartsGrid from "./ChartsGrid";

interface AnalyticsDashboardProps {
  timeRange?: string;
  barangay?: string;
  category?: string;
  totalIssues?: number;
  resolvedIssues?: number;
  pendingIssues?: number;
  avgResolutionTime?: string;
  criticalIssues?: number;
  mostCommonCategory?: string;
  issuesByCategory?: Array<{ name: string; value: number }>;
  resolutionTimeData?: Array<{ name: string; time: number }>;
  barangayComparisonData?: Array<{ name: string; issues: number }>;
  trendData?: Array<{ date: string; issues: number }>;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  timeRange = "last30days",
  barangay = "all",
  category = "all",
  totalIssues = 248,
  resolvedIssues = 156,
  pendingIssues = 92,
  avgResolutionTime = "3.2 days",
  criticalIssues = 12,
  mostCommonCategory = "Road Maintenance",
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
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);
  const [selectedBarangay, setSelectedBarangay] = useState(barangay);
  const [selectedCategory, setSelectedCategory] = useState(category);

  // This would be replaced with actual data fetching logic
  const refreshData = () => {
    console.log("Refreshing data...");
    // In a real implementation, this would fetch new data based on filters
  };

  const exportData = (format: string) => {
    console.log(`Exporting data as ${format}...`);
    // In a real implementation, this would generate and download reports
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Analytics Dashboard
            </h1>
            <p className="text-muted-foreground">
              Monitor and analyze community issues with comprehensive data
              visualization.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={refreshData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportData("pdf")}
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportData("csv")}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-full sm:w-auto flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filters:</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <Select
                    value={selectedTimeRange}
                    onValueChange={setSelectedTimeRange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Time Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="last7days">Last 7 Days</SelectItem>
                      <SelectItem value="last30days">Last 30 Days</SelectItem>
                      <SelectItem value="last3months">Last 3 Months</SelectItem>
                      <SelectItem value="last6months">Last 6 Months</SelectItem>
                      <SelectItem value="lastyear">Last Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Select
                  value={selectedBarangay}
                  onValueChange={setSelectedBarangay}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Barangay" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Barangays</SelectItem>
                    <SelectItem value="barangayA">Barangay A</SelectItem>
                    <SelectItem value="barangayB">Barangay B</SelectItem>
                    <SelectItem value="barangayC">Barangay C</SelectItem>
                    <SelectItem value="barangayD">Barangay D</SelectItem>
                    <SelectItem value="barangayE">Barangay E</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="roads">Roads</SelectItem>
                    <SelectItem value="drainage">Drainage</SelectItem>
                    <SelectItem value="electricity">Electricity</SelectItem>
                    <SelectItem value="waterSupply">Water Supply</SelectItem>
                    <SelectItem value="wasteManagement">
                      Waste Management
                    </SelectItem>
                    <SelectItem value="others">Others</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="default"
                size="sm"
                className="ml-auto"
                onClick={refreshData}
              >
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full max-w-md mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Metrics Cards */}
            <MetricsCards
              totalIssues={totalIssues}
              resolvedIssues={resolvedIssues}
              pendingIssues={pendingIssues}
              avgResolutionTime={avgResolutionTime}
              criticalIssues={criticalIssues}
              mostCommonCategory={mostCommonCategory}
            />

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-lg">Issues by Category</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ChartsGrid issuesByCategory={issuesByCategory} />
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Issue Reporting Trends
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ChartsGrid trendData={trendData} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Detailed Analysis Tab */}
          <TabsContent value="detailed" className="space-y-6">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Comprehensive Data Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartsGrid
                  issuesByCategory={issuesByCategory}
                  resolutionTimeData={resolutionTimeData}
                  barangayComparisonData={barangayComparisonData}
                  trendData={trendData}
                />
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Resolution Time Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ChartsGrid resolutionTimeData={resolutionTimeData} />
                </CardContent>
              </Card>

              <Card className="bg-white">
                <CardHeader>
                  <CardTitle className="text-lg">Barangay Comparison</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ChartsGrid barangayComparisonData={barangayComparisonData} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
