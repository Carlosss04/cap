import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
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
  ArrowLeft,
  Image as ImageIcon,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

interface Comment {
  id: string;
  user: {
    name: string;
    avatar?: string;
  };
  text: string;
  timestamp: string;
}

interface ReportDetailProps {
  onBack?: () => void;
}

const ReportDetail: React.FC<ReportDetailProps> = ({ onBack = () => {} }) => {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost/api/reports?id=${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch report");
        }
        const data = await response.json();
        setReport(data);

        // Fetch comments (in a real app, this would be a separate API endpoint)
        // For now, we'll use dummy data
        setComments([
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
      } catch (err) {
        setError("Failed to load report details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchReport();
    }
  }, [id]);

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    // In a real app, you would send this to your API
    const newCommentObj: Comment = {
      id: `c${Date.now()}`,
      user: {
        name: "Juan Dela Cruz", // This would be the current user
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Juan",
      },
      text: newComment,
      timestamp: new Date().toISOString(),
    };

    // Add to local state
    setComments([...comments, newCommentObj]);
    setNewComment("");

    // In a real app, you would save this to your database
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      console.log("Comment added:", newCommentObj);
      // Show success message
      alert("Comment added successfully!");
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
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
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <h3 className="text-lg font-medium text-red-600 mb-2">
            {error || "Report not found"}
          </h3>
          <Button onClick={onBack}>Go Back</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-white">
      <CardHeader className="pb-2 pt-4 px-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline">{report.category}</Badge>
              <Badge className={getStatusColor(report.status)}>
                {report.status.charAt(0).toUpperCase() +
                  report.status.slice(1).replace("-", " ")}
              </Badge>
            </div>
            <CardTitle className="text-xl font-semibold">
              {report.title}
            </CardTitle>
            <CardDescription>
              Report ID: {report.id} • Submitted on{" "}
              {formatDate(report.created_at || report.date)}
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  {report.images.map((image: string, index: number) => (
                    <div
                      key={index}
                      className="relative rounded-lg overflow-hidden cursor-pointer border border-gray-200"
                      onClick={() => setSelectedImage(image)}
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

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {comments.length > 0 ? (
                  comments.map((comment) => (
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
                  ))
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <MessageSquare className="h-12 w-12 mx-auto text-gray-300" />
                    <p className="mt-2 text-sm text-gray-500">
                      No comments yet. Be the first to comment!
                    </p>
                  </div>
                )}
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

          <div className="space-y-6">
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
                    <span className="text-sm">
                      {formatDate(report.created_at || report.date)}
                    </span>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="h-4 w-4 mr-2 mt-0.5 text-gray-400" />
                  <div>
                    <span className="text-xs text-gray-500 block">
                      Last Updated
                    </span>
                    <span className="text-sm">
                      {formatDate(report.updated_at || report.date)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-3">
                Reporter
              </h3>
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-3">
                  <AvatarImage
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Juan"
                    alt="Reporter"
                  />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-medium">
                    {report.contact_name || "Juan Dela Cruz"}
                  </div>
                  <div className="text-xs text-gray-500">
                    {report.contact_email || "juan@example.com"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Image viewer dialog */}
      {selectedImage && (
        <Dialog
          open={!!selectedImage}
          onOpenChange={() => setSelectedImage(null)}
        >
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Report Image</DialogTitle>
            </DialogHeader>
            <div className="mt-2">
              <img
                src={selectedImage}
                alt="Report full size"
                className="w-full h-auto max-h-[70vh] object-contain"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
};

export default ReportDetail;
