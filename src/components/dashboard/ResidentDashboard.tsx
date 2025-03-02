import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Plus, LayoutDashboard, FileText } from "lucide-react";
import DashboardStats from "./DashboardStats";
import ReportsList from "../reports/ReportsList";
import CreateReportForm from "../reports/CreateReportForm";

interface ResidentDashboardProps {
  userName?: string;
  totalReports?: number;
  resolvedReports?: number;
  pendingReports?: number;
  inProgressReports?: number;
  criticalReports?: number;
  reports?: Array<{
    id: string;
    category: string;
    title: string;
    description: string;
    status: "pending" | "in-progress" | "resolved" | "rejected";
    date: string;
    location: string;
    imageUrl?: string;
  }>;
  onViewReport?: (id: string) => void;
  onCommentReport?: (id: string) => void;
  onCreateReport?: (data: any) => void;
}

const ResidentDashboard: React.FC<ResidentDashboardProps> = ({
  userName = "Resident",
  totalReports = 0,
  resolvedReports = 0,
  pendingReports = 0,
  inProgressReports = 0,
  criticalReports = 0,
  reports = [
    {
      id: "1",
      category: "Road Damage",
      title: "Pothole on Main Street",
      description:
        "Large pothole causing traffic and potential vehicle damage near the intersection.",
      status: "pending",
      date: "2023-06-15",
      location: "Main St, near Central Park",
      imageUrl:
        "https://images.unsplash.com/photo-1584463699057-a0c95a5a4e68?q=80&w=200&auto=format&fit=crop",
    },
    {
      id: "2",
      category: "Drainage",
      title: "Clogged Storm Drain",
      description:
        "Storm drain is completely blocked causing flooding during rain.",
      status: "in-progress",
      date: "2023-06-10",
      location: "Oak Avenue, beside Community Center",
      imageUrl:
        "https://images.unsplash.com/photo-1594749794743-2c1199a4a7e1?q=80&w=200&auto=format&fit=crop",
    },
    {
      id: "3",
      category: "Electricity",
      title: "Street Light Not Working",
      description:
        "Street light has been out for over a week creating safety concerns at night.",
      status: "resolved",
      date: "2023-06-05",
      location: "Pine Street, corner of 5th Avenue",
      imageUrl:
        "https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?q=80&w=200&auto=format&fit=crop",
    },
    {
      id: "4",
      category: "Water Supply",
      title: "Water Main Leak",
      description:
        "Water leaking from main pipe causing low water pressure in the neighborhood.",
      status: "pending",
      date: "2023-06-12",
      location: "Maple Drive, near Elementary School",
      imageUrl:
        "https://images.unsplash.com/photo-1584463699057-a0c95a5a4e68?q=80&w=200&auto=format&fit=crop",
    },
    {
      id: "5",
      category: "Waste Management",
      title: "Overflowing Garbage Bin",
      description:
        "Public garbage bin hasn't been collected for days and is overflowing.",
      status: "rejected",
      date: "2023-06-08",
      location: "Cedar Boulevard, Public Park",
      imageUrl:
        "https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?q=80&w=200&auto=format&fit=crop",
    },
  ],
  onViewReport = (id) => console.log(`View report ${id}`),
  onCommentReport = (id) => console.log(`Comment on report ${id}`),
  onCreateReport = (data) => console.log("Create report", data),
}) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleCreateReport = (data: any) => {
    onCreateReport(data);
    setShowCreateForm(false);
    setActiveTab("reports");
  };

  // Calculate stats based on reports
  const calculateStats = () => {
    const stats = {
      total: reports.length,
      resolved: reports.filter((r) => r.status === "resolved").length,
      pending: reports.filter((r) => r.status === "pending").length,
      inProgress: reports.filter((r) => r.status === "in-progress").length,
      critical: 0, // You could add a critical flag to reports if needed
    };
    return stats;
  };

  const reportStats = calculateStats();

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Welcome, {userName}
            </h1>
            <p className="text-muted-foreground">
              Manage your community issue reports and track their status.
            </p>
          </div>
          <Button
            onClick={() => {
              setShowCreateForm(true);
              setActiveTab("reports");
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Report an Issue
          </Button>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full max-w-md mb-6">
            <TabsTrigger value="dashboard" className="flex items-center">
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              My Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <DashboardStats
              totalReports={reportStats.total}
              resolvedReports={reportStats.resolved}
              pendingReports={reportStats.pending}
              inProgressReports={reportStats.inProgress}
              criticalReports={reportStats.critical}
            />

            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Recent Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <ReportsList
                  reports={reports.slice(0, 3)}
                  onViewReport={onViewReport}
                  onCommentReport={onCommentReport}
                  onCreateReport={() => {
                    setShowCreateForm(true);
                    setActiveTab("reports");
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            {showCreateForm ? (
              <CreateReportForm onSubmit={handleCreateReport} />
            ) : (
              <ReportsList
                reports={reports}
                onViewReport={onViewReport}
                onCommentReport={onCommentReport}
                onCreateReport={() => setShowCreateForm(true)}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ResidentDashboard;
