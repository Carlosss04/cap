import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "../ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import {
  CheckCircle,
  Clock,
  MapPin,
  User,
  Calendar,
  Tag,
  AlertTriangle,
  MessageSquare,
  Image as ImageIcon,
  Send,
  UserPlus,
  Trash2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";

interface IssueDetailPanelProps {
  issue?: {
    id: string;
    title: string;
    description: string;
    category: string;
    status: "pending" | "in-progress" | "resolved" | "rejected";
    priority: "low" | "medium" | "high" | "critical";
    location: string;
    reporter: {
      name: string;
      email: string;
      avatar?: string;
    };
    assignedTo?: {
      name: string;
      email: string;
      avatar?: string;
    };
    createdAt: string;
    updatedAt: string;
    images: string[];
    comments: Array<{
      id: string;
      user: {
        name: string;
        avatar?: string;
      };
      text: string;
      timestamp: string;
    }>;
  };
  onClose?: () => void;
  onStatusChange?: (status: string) => void;
  onPriorityChange?: (priority: string) => void;
  onAssign?: (staffId: string) => void;
  onAddComment?: (comment: string) => void;
  onDelete?: () => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "in-progress":
      return "bg-blue-100 text-blue-800";
    case "resolved":
      return "bg-green-100 text-green-800";
    case "rejected":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "low":
      return "bg-green-100 text-green-800";
    case "medium":
      return "bg-blue-100 text-blue-800";
    case "high":
      return "bg-orange-100 text-orange-800";
    case "critical":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const IssueDetailPanel: React.FC<IssueDetailPanelProps> = ({
  issue = {
    id: "ISS-12345",
    title: "Large pothole on Main Street causing traffic hazard",
    description:
      "There is a large pothole approximately 2 feet in diameter and 8 inches deep on Main Street near the intersection with Oak Avenue. It's causing vehicles to swerve suddenly and creating a traffic hazard. Several vehicles have already been damaged.",
    category: "Road Maintenance",
    status: "in-progress",
    priority: "high",
    location: "Main Street near Oak Avenue intersection",
    reporter: {
      name: "Maria Santos",
      email: "maria.santos@example.com",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
    },
    assignedTo: {
      name: "Juan Dela Cruz",
      email: "juan.delacruz@lgu.gov.ph",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Juan",
    },
    createdAt: "2023-06-15T09:30:00Z",
    updatedAt: "2023-06-16T14:45:00Z",
    images: [
      "https://images.unsplash.com/photo-1584463699057-a0c95a5a4e68?q=80&w=500&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1518162086194-4c935a2c8e59?q=80&w=500&auto=format&fit=crop",
    ],
    comments: [
      {
        id: "c1",
        user: {
          name: "Juan Dela Cruz",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Juan",
        },
        text: "I've inspected the site and confirmed the issue. We'll need to bring in equipment to properly repair this pothole.",
        timestamp: "2023-06-15T14:25:00Z",
      },
      {
        id: "c2",
        user: {
          name: "Maria Santos",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
        },
        text: "Thank you for the quick response. Please let me know if you need any additional information.",
        timestamp: "2023-06-15T15:10:00Z",
      },
      {
        id: "c3",
        user: {
          name: "Juan Dela Cruz",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Juan",
        },
        text: "We've scheduled the repair for tomorrow morning. Traffic will be redirected temporarily.",
        timestamp: "2023-06-16T09:05:00Z",
      },
    ],
  },
  onClose = () => {},
  onStatusChange = () => {},
  onPriorityChange = () => {},
  onAssign = () => {},
  onAddComment = () => {},
  onDelete = () => {},
}) => {
  const [newComment, setNewComment] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment("");
    }
  };

  return (
    <Card className="w-full h-full bg-white overflow-hidden flex flex-col">
      <CardHeader className="pb-2 pt-4 px-6 flex flex-row justify-between items-start">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline">{issue.category}</Badge>
            <Badge className={getStatusColor(issue.status)}>
              {issue.status.charAt(0).toUpperCase() +
                issue.status.slice(1).replace("-", " ")}
            </Badge>
            <Badge className={getPriorityColor(issue.priority)}>
              {issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1)}
            </Badge>
          </div>
          <CardTitle className="text-xl font-semibold">{issue.title}</CardTitle>
          <div className="text-sm text-muted-foreground mt-1">
            Issue ID: {issue.id}
          </div>
        </div>
        <div className="flex gap-2">
          <AlertDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
          >
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-1" /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the
                  issue and remove all associated data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-auto px-6 pb-6">
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="activity">Activity Log</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Description
                  </h3>
                  <p className="text-sm">{issue.description}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Location
                  </h3>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    <span className="text-sm">{issue.location}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Reported By
                  </h3>
                  <div className="flex items-center">
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarImage
                        src={issue.reporter.avatar}
                        alt={issue.reporter.name}
                      />
                      <AvatarFallback>
                        {issue.reporter.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium">
                        {issue.reporter.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {issue.reporter.email}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    Dates
                  </h3>
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="text-xs">Created: </span>
                      <span className="text-xs ml-1">
                        {formatDate(issue.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="text-xs">Updated: </span>
                      <span className="text-xs ml-1">
                        {formatDate(issue.updatedAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">
                    Status
                  </h3>
                  <Select
                    defaultValue={issue.status}
                    onValueChange={onStatusChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">
                    Priority
                  </h3>
                  <Select
                    defaultValue={issue.priority}
                    onValueChange={onPriorityChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">
                    Assigned To
                  </h3>
                  {issue.assignedTo ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarImage
                            src={issue.assignedTo.avatar}
                            alt={issue.assignedTo.name}
                          />
                          <AvatarFallback>
                            {issue.assignedTo.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium">
                            {issue.assignedTo.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {issue.assignedTo.email}
                          </div>
                        </div>
                      </div>
                      <Dialog
                        open={assignDialogOpen}
                        onOpenChange={setAssignDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            Reassign
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Assign Staff Member</DialogTitle>
                          </DialogHeader>
                          <div className="py-4">
                            <Label htmlFor="staff-select">Select Staff</Label>
                            <Select
                              onValueChange={(value) => {
                                onAssign(value);
                                setAssignDialogOpen(false);
                              }}
                            >
                              <SelectTrigger
                                id="staff-select"
                                className="w-full mt-2"
                              >
                                <SelectValue placeholder="Select staff member" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="staff1">
                                  Juan Dela Cruz
                                </SelectItem>
                                <SelectItem value="staff2">
                                  Ana Reyes
                                </SelectItem>
                                <SelectItem value="staff3">
                                  Carlos Mendoza
                                </SelectItem>
                                <SelectItem value="staff4">
                                  Elena Bautista
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => setAssignDialogOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button type="submit">Assign</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  ) : (
                    <Dialog
                      open={assignDialogOpen}
                      onOpenChange={setAssignDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full">
                          <UserPlus className="h-4 w-4 mr-2" />
                          Assign Staff
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Assign Staff Member</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                          <Label htmlFor="staff-select">Select Staff</Label>
                          <Select
                            onValueChange={(value) => {
                              onAssign(value);
                              setAssignDialogOpen(false);
                            }}
                          >
                            <SelectTrigger
                              id="staff-select"
                              className="w-full mt-2"
                            >
                              <SelectValue placeholder="Select staff member" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="staff1">
                                Juan Dela Cruz
                              </SelectItem>
                              <SelectItem value="staff2">Ana Reyes</SelectItem>
                              <SelectItem value="staff3">
                                Carlos Mendoza
                              </SelectItem>
                              <SelectItem value="staff4">
                                Elena Bautista
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setAssignDialogOpen(false)}
                          >
                            Cancel
                          </Button>
                          <Button type="submit">Assign</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">
                    Resolution Notes
                  </h3>
                  <Textarea
                    placeholder="Add resolution notes here..."
                    className="min-h-[120px]"
                  />
                  <Button className="mt-2 w-full">
                    <CheckCircle className="h-4 w-4 mr-2" /> Save Notes
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="comments" className="space-y-4">
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {issue.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-3 bg-gray-50 rounded-lg space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage
                          src={comment.user.avatar}
                          alt={comment.user.name}
                        />
                        <AvatarFallback>
                          {comment.user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">
                        {comment.user.name}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatDate(comment.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm">{comment.text}</p>
                </div>
              ))}
            </div>

            <Separator />

            <div className="pt-2">
              <div className="flex items-start space-x-2">
                <Textarea
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={handleCommentSubmit}
                  disabled={!newComment.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="images" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {issue.images.map((image, index) => (
                <div
                  key={index}
                  className="relative rounded-lg overflow-hidden cursor-pointer border border-gray-200"
                  onClick={() => setSelectedImage(image)}
                >
                  <img
                    src={image}
                    alt={`Issue image ${index + 1}`}
                    className="w-full h-48 object-cover"
                  />
                </div>
              ))}
            </div>

            {issue.images.length === 0 && (
              <div className="text-center py-8">
                <ImageIcon className="h-12 w-12 mx-auto text-gray-300" />
                <p className="mt-2 text-sm text-gray-500">
                  No images have been uploaded for this issue
                </p>
              </div>
            )}

            {selectedImage && (
              <Dialog
                open={!!selectedImage}
                onOpenChange={() => setSelectedImage(null)}
              >
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Issue Image</DialogTitle>
                  </DialogHeader>
                  <div className="mt-2">
                    <img
                      src={selectedImage}
                      alt="Issue full size"
                      className="w-full h-auto max-h-[70vh] object-contain"
                    />
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {/* This would typically be populated from an activity log */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarImage
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
                        alt="Admin"
                      />
                      <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">System</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatDate(issue.createdAt)}
                  </span>
                </div>
                <p className="text-sm mt-1">
                  Issue created by {issue.reporter.name}
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarImage
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
                        alt="Admin"
                      />
                      <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">System</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatDate(issue.updatedAt)}
                  </span>
                </div>
                <p className="text-sm mt-1">
                  Status changed from "Pending" to "In Progress"
                </p>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarImage
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
                        alt="Admin"
                      />
                      <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">System</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatDate(issue.updatedAt)}
                  </span>
                </div>
                <p className="text-sm mt-1">
                  Issue assigned to {issue.assignedTo?.name || "staff member"}
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default IssueDetailPanel;
