import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";
import {
  MapPin,
  Calendar,
  Clock,
  Tag,
  MessageSquare,
  Send,
  Image as ImageIcon,
} from "lucide-react";

interface Comment {
  id: string;
  user: {
    name: string;
    avatar?: string;
  };
  text: string;
  timestamp: string;
}

interface ViewReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  report: {
    id: string;
    title: string;
    description: string;
    category: string;
    status: string;
    date: string;
    location: string;
    images?: string[];
  };
}

const ViewReportDialog: React.FC<ViewReportDialogProps> = ({
  isOpen,
  onClose,
  report,
}) => {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "c1",
      user: {
        name: "Admin User",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
      },
      text: "We've received your report and are looking into it.",
      timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    },
    {
      id: "c2",
      user: {
        name: "Juan Dela Cruz",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Juan",
      },
      text: "Thank you for the quick response!",
      timestamp: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
    },
  ]);

  const handleCommentSubmit = () => {
    if (!newComment.trim()) return;

    const newCommentObj: Comment = {
      id: `c${Date.now()}`,
      user: {
        name: "Juan Dela Cruz",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Juan",
      },
      text: newComment,
      timestamp: new Date().toISOString(),
    };

    setComments([...comments, newCommentObj]);
    setNewComment("");
    alert("Comment added successfully!");
  };

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline">{report.category}</Badge>
            <Badge className={getStatusColor(report.status)}>
              {report.status.charAt(0).toUpperCase() +
                report.status.slice(1).replace("-", " ")}
            </Badge>
          </div>
          <DialogTitle className="text-xl">{report.title}</DialogTitle>
          <p className="text-sm text-gray-500">
            Report ID: {report.id} • Submitted on {formatDate(report.date)}
          </p>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Description
              </h3>
              <p className="text-sm">{report.description}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Location
              </h3>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                <span className="text-sm">{report.location}</span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Images</h3>
              {report.images && report.images.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {report.images.map((image, index) => (
                    <div
                      key={index}
                      className="relative rounded-lg overflow-hidden border border-gray-200"
                    >
                      <img
                        src={image}
                        alt={`Report image ${index + 1}`}
                        className="w-full h-32 object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <ImageIcon className="h-12 w-12 mx-auto text-gray-300" />
                  <p className="mt-2 text-sm text-gray-500">
                    No images have been uploaded for this report
                  </p>
                </div>
              )}
            </div>

            <Separator />

            <div id="comments">
              <h3 className="text-sm font-medium text-gray-500 mb-4 flex items-center">
                <MessageSquare className="h-4 w-4 mr-2" /> Comments
              </h3>

              <div className="space-y-4 max-h-[200px] overflow-y-auto pr-2">
                {comments.map((comment) => (
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

              <div className="mt-4">
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
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Status</h3>
              <div className="flex items-center">
                <Badge className={`${getStatusColor(report.status)} mr-2`}>
                  {report.status.charAt(0).toUpperCase() +
                    report.status.slice(1).replace("-", " ")}
                </Badge>
                <span className="text-sm">
                  {report.status === "pending"
                    ? "Awaiting review"
                    : report.status === "in-progress"
                      ? "Being addressed"
                      : report.status === "resolved"
                        ? "Issue fixed"
                        : "Not actionable"}
                </span>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-3">
                Details
              </h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <Tag className="h-4 w-4 mr-2 mt-0.5 text-gray-400" />
                  <div>
                    <span className="text-xs text-gray-500 block">
                      Category
                    </span>
                    <span className="text-sm">{report.category}</span>
                  </div>
                </div>
                <div className="flex items-start">
                  <Calendar className="h-4 w-4 mr-2 mt-0.5 text-gray-400" />
                  <div>
                    <span className="text-xs text-gray-500 block">
                      Submitted
                    </span>
                    <span className="text-sm">{formatDate(report.date)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewReportDialog;
