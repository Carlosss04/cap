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
} from "lucide-react";

interface Issue {
  id: string;
  category: string;
  title: string;
  location: string;
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
      location: "Barangay San Jose",
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
      location: "Barangay Sta. Rosa",
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

  const filteredIssues = issues.filter(
    (issue) =>
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.reporter.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="w-full bg-white rounded-md shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Community Issues</h2>
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Search issues..."
              className="w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="outline" size="sm">
              Export
            </Button>
            <Button size="sm">Bulk Actions</Button>
          </div>
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
                  colSpan={11}
                  className="text-center py-8 text-gray-500"
                >
                  No issues found. Try adjusting your search.
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
                              onClick={() => onViewIssue(issue.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View details</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

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
                            <Clock className="h-4 w-4 mr-2" />
                            Mark as Pending
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              onUpdateStatus(issue.id, "in-progress")
                            }
                          >
                            <Clock className="h-4 w-4 mr-2" />
                            Mark as In Progress
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onUpdateStatus(issue.id, "resolved")}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark as Resolved
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
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default IssueManagementTable;
