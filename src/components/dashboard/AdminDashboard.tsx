import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import FilterPanel from "../admin/FilterPanel";
import IssueManagementTable from "../admin/IssueManagementTable";
import IssueDetailPanel from "../admin/IssueDetailPanel";
import AnalyticsDashboard from "../analytics/AnalyticsDashboard";
import { PlusCircle, BarChart3, ListFilter } from "lucide-react";

interface AdminDashboardProps {
  activeTab?: string;
  onCreateIssue?: () => void;
  onViewIssue?: (id: string) => void;
  onEditIssue?: (id: string) => void;
  onDeleteIssue?: (id: string) => void;
  onAssignIssue?: (id: string) => void;
  onUpdateStatus?: (id: string, status: string) => void;
  onUpdatePriority?: (id: string, priority: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  activeTab = "issues",
  onCreateIssue = () => console.log("Create issue"),
  onViewIssue = (id) => console.log(`View issue ${id}`),
  onEditIssue = (id) => console.log(`Edit issue ${id}`),
  onDeleteIssue = (id) => console.log(`Delete issue ${id}`),
  onAssignIssue = (id) => console.log(`Assign issue ${id}`),
  onUpdateStatus = (id, status) =>
    console.log(`Update status of ${id} to ${status}`),
  onUpdatePriority = (id, priority) =>
    console.log(`Update priority of ${id} to ${priority}`),
}) => {
  const [currentTab, setCurrentTab] = useState(activeTab);
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    search: "",
    barangay: "",
    category: "",
    priority: "",
    status: "",
  });

  const handleViewIssue = (id: string) => {
    setSelectedIssueId(id);
    onViewIssue(id);
  };

  const handleCloseIssueDetail = () => {
    setSelectedIssueId(null);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage and track community issues efficiently.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={onCreateIssue}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Issue
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <Tabs
          value={currentTab}
          onValueChange={setCurrentTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 w-full max-w-md mb-6">
            <TabsTrigger value="issues" className="flex items-center">
              <ListFilter className="h-4 w-4 mr-2" />
              Issue Management
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Issue Management Tab */}
          <TabsContent value="issues" className="space-y-6">
            {selectedIssueId ? (
              <IssueDetailPanel
                onClose={handleCloseIssueDetail}
                onStatusChange={(status) =>
                  onUpdateStatus(selectedIssueId, status)
                }
                onPriorityChange={(priority) =>
                  onUpdatePriority(selectedIssueId, priority)
                }
                onAssign={(staffId) => onAssignIssue(selectedIssueId)}
                onDelete={() => {
                  onDeleteIssue(selectedIssueId);
                  handleCloseIssueDetail();
                }}
              />
            ) : (
              <>
                <FilterPanel onFilterChange={handleFilterChange} />
                <IssueManagementTable
                  onViewIssue={handleViewIssue}
                  onEditIssue={onEditIssue}
                  onDeleteIssue={onDeleteIssue}
                  onAssignIssue={onAssignIssue}
                  onUpdateStatus={onUpdateStatus}
                  onUpdatePriority={onUpdatePriority}
                />
              </>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
