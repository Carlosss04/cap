import React from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Eye, MessageCircle, MoreHorizontal, Share2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export interface ReportCardProps {
  id?: string;
  category?: string;
  title?: string;
  description?: string;
  status?: "pending" | "in-progress" | "resolved" | "rejected";
  date?: string;
  location?: string;
  imageUrl?: string;
  onView?: (id: string) => void;
  onComment?: (id: string) => void;
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

const ReportCard: React.FC<ReportCardProps> = ({
  id = "123456",
  category = "Road Damage",
  title = "Pothole on Main Street",
  description = "Large pothole causing traffic and potential vehicle damage",
  status = "pending",
  date = "2023-06-15",
  location = "Main St, near Central Park",
  imageUrl = "https://images.unsplash.com/photo-1584463699057-a0c95a5a4e68?q=80&w=200&auto=format&fit=crop",
  onView = () => {},
  onComment = () => {},
}) => {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <Card className="w-full bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="h-20 w-20 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-gray-200">
                <span className="text-gray-400 text-xs">No image</span>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <Badge variant="outline" className="text-xs font-medium">
                {category}
              </Badge>
              <Badge className={`text-xs ${getStatusColor(status)}`}>
                {status.charAt(0).toUpperCase() +
                  status.slice(1).replace("-", " ")}
              </Badge>
            </div>

            <h3 className="text-sm font-semibold text-gray-900 truncate mb-1">
              {title}
            </h3>

            <p className="text-xs text-gray-500 line-clamp-2 mb-1">
              {description}
            </p>

            <div className="flex items-center text-xs text-gray-500">
              <span className="truncate">{location}</span>
              <span className="mx-2">•</span>
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-4 py-2 border-t border-gray-100 flex justify-between">
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => onView(id)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  <span className="text-xs">View</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View report details</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => onComment(id)}
                >
                  <MessageCircle className="h-4 w-4 mr-1" />
                  <span className="text-xs">Comment</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add a comment</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => {
                    // Share functionality
                    const shareUrl = `${window.location.origin}/reports/${id}`;
                    if (navigator.share) {
                      navigator
                        .share({
                          title: title,
                          text: `Check out this community issue: ${title}`,
                          url: shareUrl,
                        })
                        .catch((err) => console.log("Error sharing:", err));
                    } else {
                      // Fallback for browsers that don't support navigator.share
                      navigator.clipboard.writeText(shareUrl);
                      alert("Link copied to clipboard!");
                    }
                  }}
                >
                  <Share2 className="h-4 w-4 mr-1" />
                  <span className="text-xs">Share</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share this report</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView(id)}>
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onComment(id)}>
              Add Comment
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                // Share functionality
                const shareUrl = `${window.location.origin}/reports/${id}`;
                if (navigator.share) {
                  navigator
                    .share({
                      title: title,
                      text: `Check out this community issue: ${title}`,
                      url: shareUrl,
                    })
                    .catch((err) => console.log("Error sharing:", err));
                } else {
                  // Fallback for browsers that don't support navigator.share
                  navigator.clipboard.writeText(shareUrl);
                  alert("Link copied to clipboard!");
                }
              }}
            >
              Share Report
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  );
};

export default ReportCard;
