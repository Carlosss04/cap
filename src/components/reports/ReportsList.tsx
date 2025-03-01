import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { Filter, Plus, Search } from "lucide-react";
import ReportCard from "./ReportCard";

interface ReportData {
  id?: string;
  category?: string;
  title?: string;
  description?: string;
  status?: "pending" | "in-progress" | "resolved" | "rejected";
  date?: string;
  location?: string;
  imageUrl?: string;
}

interface ReportsListProps {
  reports?: ReportData[];
  onViewReport?: (id: string) => void;
  onCommentReport?: (id: string) => void;
  onCreateReport?: () => void;
  onFilterChange?: (filters: ReportFilters) => void;
}

interface ReportFilters {
  status?: string;
  category?: string;
  searchQuery?: string;
}

const ReportsList: React.FC<ReportsListProps> = ({
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
  onCreateReport = () => console.log("Create new report"),
  onFilterChange = (filters) => console.log("Filters changed", filters),
}) => {
  const [activeTab, setActiveTab] = useState("all");
  const [filters, setFilters] = useState<ReportFilters>({
    status: "",
    category: "",
    searchQuery: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 4;

  // Filter reports based on active tab and filters
  const filteredReports = reports.filter((report) => {
    // Filter by tab
    if (activeTab !== "all" && report.status !== activeTab) {
      return false;
    }

    // Filter by status if selected
    if (filters.status && filters.status !== "all" && report.status !== filters.status) {
      return false;
    }

    // Filter by category if selected
    if (filters.category && filters.category !== "all" && report.category !== filters.category) {

    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      return (
        report.title?.toLowerCase().includes(query) ||
        report.description?.toLowerCase().includes(query) ||
        report.location?.toLowerCase().includes(query)
      );
    }

    return true;
  });

  // Calculate pagination
  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = filteredReports.slice(
    indexOfFirstReport,
    indexOfLastReport,
  );
  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);

  // Handle filter changes
  const handleFilterChange = (key: keyof ReportFilters, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
    onFilterChange(newFilters);
  };

  // Get counts for tabs
  const getCounts = () => {
    const counts = {
      all: reports.length,
      pending: reports.filter((r) => r.status === "pending").length,
      "in-progress": reports.filter((r) => r.status === "in-progress").length,
      resolved: reports.filter((r) => r.status === "resolved").length,
      rejected: reports.filter((r) => r.status === "rejected").length,
    };
    return counts;
  };

  const counts = getCounts();

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="p-4 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h2 className="text-xl font-semibold text-gray-900">My Reports</h2>
          <Button
            onClick={onCreateReport}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Report
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-1 w-full sm:w-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search reports..."
                className="pl-9 w-full"
                value={filters.searchQuery}
                onChange={(e) =>
                  handleFilterChange("searchQuery", e.target.value)
                }
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Select
              value={filters.category}
              onValueChange={(value) => handleFilterChange("category", value)}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Road Damage">Road Damage</SelectItem>
                <SelectItem value="Drainage">Drainage</SelectItem>
                <SelectItem value="Electricity">Electricity</SelectItem>
                <SelectItem value="Water Supply">Water Supply</SelectItem>
                <SelectItem value="Waste Management">
                  Waste Management
                </SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filters.status}
              onValueChange={(value) => handleFilterChange("status", value)}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-4 border-b border-gray-100">
          <TabsList className="grid grid-cols-5 w-full bg-transparent h-auto p-0">
            <TabsTrigger
              value="all"
              className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none py-3 px-4"
            >
              All
              <Badge variant="outline" className="ml-2 bg-gray-100">
                {counts.all}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none py-3 px-4"
            >
              Pending
              <Badge
                variant="outline"
                className="ml-2 bg-yellow-100 text-yellow-800"
              >
                {counts.pending}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="in-progress"
              className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none py-3 px-4"
            >
              In Progress
              <Badge
                variant="outline"
                className="ml-2 bg-blue-100 text-blue-800"
              >
                {counts["in-progress"]}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="resolved"
              className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none py-3 px-4"
            >
              Resolved
              <Badge
                variant="outline"
                className="ml-2 bg-green-100 text-green-800"
              >
                {counts.resolved}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="rejected"
              className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none py-3 px-4"
            >
              Rejected
              <Badge variant="outline" className="ml-2 bg-red-100 text-red-800">
                {counts.rejected}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={activeTab} className="p-4 mt-0">
          {currentReports.length > 0 ? (
            <div className="space-y-4">
              {currentReports.map((report) => (
                <ReportCard
                  key={report.id}
                  id={report.id}
                  category={report.category}
                  title={report.title}
                  description={report.description}
                  status={report.status}
                  date={report.date}
                  location={report.location}
                  imageUrl={report.imageUrl}
                  onView={onViewReport}
                  onComment={onCommentReport}
                />
              ))}
            </div>
          ) : (
            <Card className="bg-gray-50 border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-10">
                <Filter className="h-12 w-12 text-gray-400 mb-4" />
                <CardTitle className="text-xl font-medium text-gray-700 mb-2">
                  No reports found
                </CardTitle>
                <p className="text-gray-500 text-center max-w-md">
                  {filters.searchQuery ||
                  filters.category ||
                  filters.status ||
                  activeTab !== "all"
                    ? "No reports match your current filters. Try adjusting your search criteria."
                    : "You haven't submitted any reports yet. Create a new report to get started."}
                </p>
                {!filters.searchQuery &&
                  !filters.category &&
                  !filters.status &&
                  activeTab === "all" && (
                    <Button
                      onClick={onCreateReport}
                      className="mt-4 bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Report
                    </Button>
                  )}
              </CardContent>
            </Card>
          )}

          {filteredReports.length > reportsPerPage && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => setCurrentPage(page)}
                          isActive={currentPage === page}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ),
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsList;
