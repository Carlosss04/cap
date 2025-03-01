import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Bell,
  CheckCircle,
  Clock,
  AlertTriangle,
  Settings,
  X,
  Info,
  MessageSquare,
  User,
} from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error" | "update";
  isRead: boolean;
  timestamp: string;
  sender?: {
    name: string;
    avatar?: string;
  };
  relatedIssueId?: string;
}

interface NotificationsPanelProps {
  notifications?: Notification[];
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onDeleteNotification?: (id: string) => void;
  onClearAll?: () => void;
  onViewNotification?: (notification: Notification) => void;
  onSettingsChange?: (settings: NotificationSettings) => void;
}

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  issueUpdates: boolean;
  statusChanges: boolean;
  comments: boolean;
  assignments: boolean;
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "success":
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case "warning":
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    case "error":
      return <AlertTriangle className="h-5 w-5 text-red-500" />;
    case "update":
      return <Clock className="h-5 w-5 text-blue-500" />;
    default:
      return <Info className="h-5 w-5 text-blue-500" />;
  }
};

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 60) {
    return `${diffInMinutes} min ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hr ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  } else {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }
};

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({
  notifications = [
    {
      id: "1",
      title: "Issue Status Updated",
      message:
        "The pothole report on Main Street has been marked as 'In Progress'.",
      type: "update",
      isRead: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      relatedIssueId: "ISS-001",
    },
    {
      id: "2",
      title: "Issue Resolved",
      message: "The street light repair on Oak Avenue has been completed.",
      type: "success",
      isRead: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
      relatedIssueId: "ISS-002",
    },
    {
      id: "3",
      title: "New Comment",
      message: "Juan Dela Cruz commented on your drainage issue report.",
      type: "info",
      isRead: true,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      sender: {
        name: "Juan Dela Cruz",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Juan",
      },
      relatedIssueId: "ISS-003",
    },
    {
      id: "4",
      title: "Issue Assigned",
      message: "Your water supply issue has been assigned to Engineer Reyes.",
      type: "info",
      isRead: true,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
      relatedIssueId: "ISS-004",
    },
    {
      id: "5",
      title: "Critical Alert",
      message:
        "Flash flood warning issued for Barangay San Jose. Please take necessary precautions.",
      type: "error",
      isRead: false,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(), // 1 hour ago
    },
    {
      id: "6",
      title: "Scheduled Maintenance",
      message:
        "Water service will be interrupted in Barangay Sta. Rosa on June 20 from 9AM to 3PM.",
      type: "warning",
      isRead: true,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    },
  ],
  onMarkAsRead = () => {},
  onMarkAllAsRead = () => {},
  onDeleteNotification = () => {},
  onClearAll = () => {},
  onViewNotification = () => {},
  onSettingsChange = () => {},
}) => {
  const [activeTab, setActiveTab] = useState("all");
  const [settings, setSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    issueUpdates: true,
    statusChanges: true,
    comments: true,
    assignments: true,
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !notification.isRead;
    return notification.type === activeTab;
  });

  const handleSettingChange = (key: keyof NotificationSettings) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    setSettings(newSettings);
    onSettingsChange(newSettings);
  };

  return (
    <Card className="w-full max-w-md bg-white shadow-lg border border-gray-200">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Bell className="h-5 w-5 mr-2 text-blue-500" />
            <CardTitle className="text-lg font-semibold">
              Notifications
            </CardTitle>
            {unreadCount > 0 && (
              <Badge className="ml-2 bg-blue-500">{unreadCount}</Badge>
            )}
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={onMarkAllAsRead}
              title="Mark all as read"
            >
              <CheckCircle className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={onClearAll}
              title="Clear all notifications"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="px-4">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="all" className="text-xs">
              All
            </TabsTrigger>
            <TabsTrigger value="unread" className="text-xs">
              Unread
            </TabsTrigger>
            <TabsTrigger value="info" className="text-xs">
              Info
            </TabsTrigger>
            <TabsTrigger value="success" className="text-xs">
              Success
            </TabsTrigger>
            <TabsTrigger value="warning" className="text-xs">
              Alerts
            </TabsTrigger>
          </TabsList>
        </div>

        <CardContent className="p-0">
          <TabsContent value={activeTab} className="m-0">
            {filteredNotifications.length > 0 ? (
              <ScrollArea className="h-[350px] px-4 py-2">
                <div className="space-y-2">
                  {filteredNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg ${notification.isRead ? "bg-gray-50" : "bg-blue-50"} hover:bg-gray-100 transition-colors cursor-pointer`}
                      onClick={() => {
                        if (!notification.isRead) {
                          onMarkAsRead(notification.id);
                        }
                        onViewNotification(notification);
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h4
                              className={`text-sm font-medium ${notification.isRead ? "text-gray-700" : "text-gray-900"}`}
                            >
                              {notification.title}
                            </h4>
                            <span className="text-xs text-gray-500 whitespace-nowrap">
                              {formatTimestamp(notification.timestamp)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          {notification.sender && (
                            <div className="flex items-center mt-2">
                              <Avatar className="h-5 w-5 mr-1">
                                <AvatarImage
                                  src={notification.sender.avatar}
                                  alt={notification.sender.name}
                                />
                                <AvatarFallback>
                                  {notification.sender.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-gray-500">
                                {notification.sender.name}
                              </span>
                            </div>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteNotification(notification.id);
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <Bell className="h-12 w-12 text-gray-300 mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  No notifications
                </h3>
                <p className="text-sm text-gray-500 text-center">
                  {activeTab === "all"
                    ? "You don't have any notifications yet."
                    : activeTab === "unread"
                      ? "You don't have any unread notifications."
                      : `You don't have any ${activeTab} notifications.`}
                </p>
              </div>
            )}
          </TabsContent>
        </CardContent>
      </Tabs>

      <div className="px-4 py-3 border-t border-gray-100">
        <Button
          variant="outline"
          size="sm"
          className="w-full flex items-center justify-center"
          onClick={() => setActiveTab("settings")}
        >
          <Settings className="h-4 w-4 mr-2" />
          Notification Settings
        </Button>
      </div>

      <Tabs value="notifications" className="w-full">
        <TabsContent value="settings" className="mt-4">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Notification Channels</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4 text-gray-500" />
                  <Label htmlFor="email-notifications" className="text-sm">
                    Email Notifications
                  </Label>
                </div>
                <Switch
                  id="email-notifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={() =>
                    handleSettingChange("emailNotifications")
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4 text-gray-500" />
                  <Label htmlFor="sms-notifications" className="text-sm">
                    SMS Notifications
                  </Label>
                </div>
                <Switch
                  id="sms-notifications"
                  checked={settings.smsNotifications}
                  onCheckedChange={() =>
                    handleSettingChange("smsNotifications")
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bell className="h-4 w-4 text-gray-500" />
                  <Label htmlFor="push-notifications" className="text-sm">
                    Push Notifications
                  </Label>
                </div>
                <Switch
                  id="push-notifications"
                  checked={settings.pushNotifications}
                  onCheckedChange={() =>
                    handleSettingChange("pushNotifications")
                  }
                />
              </div>
            </div>

            <Separator />

            <h3 className="text-sm font-medium">Notification Types</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Info className="h-4 w-4 text-gray-500" />
                  <Label htmlFor="issue-updates" className="text-sm">
                    Issue Updates
                  </Label>
                </div>
                <Switch
                  id="issue-updates"
                  checked={settings.issueUpdates}
                  onCheckedChange={() => handleSettingChange("issueUpdates")}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <Label htmlFor="status-changes" className="text-sm">
                    Status Changes
                  </Label>
                </div>
                <Switch
                  id="status-changes"
                  checked={settings.statusChanges}
                  onCheckedChange={() => handleSettingChange("statusChanges")}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4 text-gray-500" />
                  <Label htmlFor="comments" className="text-sm">
                    Comments
                  </Label>
                </div>
                <Switch
                  id="comments"
                  checked={settings.comments}
                  onCheckedChange={() => handleSettingChange("comments")}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <Label htmlFor="assignments" className="text-sm">
                    Assignments
                  </Label>
                </div>
                <Switch
                  id="assignments"
                  checked={settings.assignments}
                  onCheckedChange={() => handleSettingChange("assignments")}
                />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default NotificationsPanel;
