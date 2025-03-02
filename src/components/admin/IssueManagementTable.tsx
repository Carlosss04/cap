import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  AlertCircle,
  ArrowUpDown,
  CheckCircle,
  Clock,
  Edit,
  Eye,
  MoreHorizontal,
  Trash2,
  UserCheck,
  Search,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface Issue {
  id: string;
  category: string;
  title: string;
  location: string;
  barangay: string;
  reporter: string;
  date: string;
  status: "pending" | "in-progress" | "resolved" | "rejected";
  priority: "low" | "medium" | "high" | "critical";
  assignedTo?: string;
}

interface IssueManagementTableProps {
  issues?: Issue[];
  onViewIssue?: (id: string) => void;
  onEditIssue?: (id: string) => void;
  onDeleteIssue?: (id: string) => void;
  onAssignIssue?: (id: string) => void;
  onUpdateStatus?: (id: string, status: string) => void;
  onUpdatePriority?: (id: string, priority: string) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    case "in-progress":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "resolved":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "rejected":
      return "bg-red-100 text-red-800 hover:bg-red-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "low":
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    case "medium":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "high":
      return "bg-orange-100 text-orange-800 hover:bg-orange-200";
    case "critical":
      return "bg-red-100 text-red-800 hover:bg-red-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
};

const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case "critical":
      return <AlertCircle className="h-4 w-4 text-red-600" />;
    case "high":
      return <AlertCircle className="h-4 w-4 text-orange-600" />;
    case "medium":
      return <Clock className="h-4 w-4 text-blue-600" />;
    case "low":
      return <Clock className="h-4 w-4 text-gray-600" />;
    default:
      return null;
  }
};

const IssueManagementTable: React.FC<IssueManagementTableProps> = ({
  issues = [
    {
      id: "ISS-001",
      category: "Road Damage",
      title: "Pothole on Main Street",
      location: "Main St, near Central Park",
      barangay: "Barangay 1",
      reporter: "Juan Dela Cruz",
      date: "2023-06-15",
      status: "pending",
      priority: "high",
      assignedTo: "",
    },
    {
      id: "ISS-002",
      category: "Drainage",
      title: "Clogged drainage causing flood",
      location: "Rizal Ave, corner Mabini St",
      barangay: "Barangay 2",
      reporter: "Maria Santos",
      date: "2023-06-14",
      status: "in-progress",
      priority: "critical",
      assignedTo: "Engineer Reyes",
    },
    {
      id: "ISS-003",
      category: "Electricity",
      title: "Street light not working",
      location: "Quezon Blvd, near Municipal Hall",
      barangay: "Barangay 3",
      reporter: "Pedro Reyes",
      date: "2023-06-12",
      status: "resolved",
      priority: "medium",
      assignedTo: "Electrician Diaz",
    },
    {
      id: "ISS-004",
      category: "Water Supply",
      title: "No water supply for 2 days",
      location: "San Jose Street",
      barangay: "Barangay 4",
      reporter: "Ana Gonzales",
      date: "2023-06-10",
      status: "in-progress",
      priority: "high",
      assignedTo: "Water Utility Team",
    },
    {
      id: "ISS-005",
      category: "Waste Management",
      title: "Garbage not collected",
      location: "Sta. Rosa Street",
      barangay: "Barangay 5",
      reporter: "Carlos Mendoza",
      date: "2023-06-09",
      status: "pending",
      priority: "low",
      assignedTo: "",
    },
  ],
  onViewIssue = () => {},
  onEditIssue = () => {},
  onDeleteIssue = () => {},
  onAssignIssue = () => {},
  onUpdateStatus = () => {},
  onUpdatePriority = () => {},
}) => {
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBarangay, setFilterBarangay] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterPriority, setFilterPriority] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIssues(issues.map((issue) => issue.id));
    } else {
      setSelectedIssues([]);
    }
  };

  const handleSelectIssue = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIssues([...selectedIssues, id]);
    } else {
      setSelectedIssues(selectedIssues.filter((issueId) => issueId !== id));
    }
  };

  const filteredIssues = issues.filter((issue) => {
    // Search term filter
    const matchesSearch =
      searchTerm === "" ||
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.reporter.toLowerCase().includes(searchTerm.toLowerCase());

    // Barangay filter
    const matchesBarangay =
      filterBarangay === "" || issue.barangay === filterBarangay;

    // Category filter
    const matchesCategory =
      filterCategory === "" || issue.category === filterCategory;

    // Priority filter
    const matchesPriority =
      filterPriority === "" || issue.priority === filterPriority;

    // Status filter
    const matchesStatus = filterStatus === "" || issue.status === filterStatus;

    return (
      matchesSearch &&
      matchesBarangay &&
      matchesCategory &&
      matchesPriority &&
      matchesStatus
    );
  });

  return (
    <div className="w-full bg-white rounded-md shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Community Issues</h2>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search issues..."
              className="pl-9 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <Select value={filterBarangay} onValueChange={setFilterBarangay}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Barangay" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Barangays</SelectItem>
              <SelectItem value="Barangay 1">Barangay 1</SelectItem>
              <SelectItem value="Barangay 2">Barangay 2</SelectItem>
              <SelectItem value="Barangay 3">Barangay 3</SelectItem>
              <SelectItem value="Barangay 4">Barangay 4</SelectItem>
              <SelectItem value="Barangay 5">Barangay 5</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              <SelectItem value="Road Damage">Road Damage</SelectItem>
              <SelectItem value="Drainage">Drainage</SelectItem>
              <SelectItem value="Electricity">Electricity</SelectItem>
              <SelectItem value="Water Supply">Water Supply</SelectItem>
              <SelectItem value="Waste Management">Waste Management</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Priorities</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={selectedIssues.length === issues.length}
                  onCheckedChange={(checked) => handleSelectAll(!!checked)}
                />
              </TableHead>
              <TableHead className="w-[100px]">
                <div className="flex items-center">
                  ID
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="w-[150px]">
                <div className="flex items-center">
                  Category
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center">
                  Title/Description
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="w-[200px]">
                <div className="flex items-center">
                  Location
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="w-[120px]">
                <div className="flex items-center">
                  Barangay
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="w-[150px]">
                <div className="flex items-center">
                  Reporter
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="w-[120px]">
                <div className="flex items-center">
                  Date
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="w-[120px]">
                <div className="flex items-center">
                  Status
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="w-[120px]">
                <div className="flex items-center">
                  Priority
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="w-[150px]">
                <div className="flex items-center">
                  Assigned To
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredIssues.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={12}
                  className="text-center py-8 text-gray-500"
                >
                  No issues found. Try adjusting your search or filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredIssues.map((issue) => (
                <TableRow key={issue.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIssues.includes(issue.id)}
                      onCheckedChange={(checked) =>
                        handleSelectIssue(issue.id, !!checked)
                      }
                    />
                  </TableCell>
                  <TableCell className="font-medium">{issue.id}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{issue.category}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{issue.title}</TableCell>
                  <TableCell>{issue.location}</TableCell>
                  <TableCell>{issue.barangay}</TableCell>
                  <TableCell>{issue.reporter}</TableCell>
                  <TableCell>
                    {new Date(issue.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(issue.status)}>
                      {issue.status.charAt(0).toUpperCase() +
                        issue.status.slice(1).replace("-", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      {getPriorityIcon(issue.priority)}
                      <Badge className={getPriorityColor(issue.priority)}>
                        {issue.priority.charAt(0).toUpperCase() +
                          issue.priority.slice(1)}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    {issue.assignedTo ? (
                      <div className="flex items-center space-x-1">
                        <span className="text-sm">{issue.assignedTo}</span>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => onAssignIssue(issue.id)}
                      >
                        <UserCheck className="h-4 w-4 mr-1" />
                        Assign
                      </Button>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => onEditIssue(issue.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit issue</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => onUpdateStatus(issue.id, "pending")}
                          >
                            <Clock className="h-4 w-4 mr-2 text-yellow-600" />
                            Mark as Pending
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              onUpdateStatus(issue.id, "in-progress")
                            }
                          >
                            <Clock className="h-4 w-4 mr-2 text-blue-600" />
                            Mark as In Progress
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onUpdateStatus(issue.id, "resolved")}
                          >
                            <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                            Mark as Resolved
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onAssignIssue(issue.id)}
                          >
                            <UserCheck className="h-4 w-4 mr-2 text-indigo-600" />
                            Assign Staff
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onDeleteIssue(issue.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2 text-red-600" />
                            Delete Issue
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="p-4 border-t border-gray-200 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing {filteredIssues.length} of {issues.length} issues
        </div>
        <div className="flex items-center space-x-2">
          {selectedIssues.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                if (
                  confirm(
                    `Are you sure you want to delete ${selectedIssues.length} selected issues?`,
                  )
                ) {
                  selectedIssues.forEach((id) => onDeleteIssue(id));
                  setSelectedIssues([]);
                  alert(
                    `${selectedIssues.length} issues deleted successfully.`,
                  );
                }
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Selected ({selectedIssues.length})
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default IssueManagementTable;
