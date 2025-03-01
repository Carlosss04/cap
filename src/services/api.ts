// API service for handling backend requests

const API_URL = "http://localhost/api";

// Generic fetch function with error handling
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  try {
    const response = await fetch(`${API_URL}/${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "API request failed");
    }

    return await response.json();
  } catch (error) {
    console.error("API request error:", error);
    throw error;
  }
}

// Reports API
export interface Report {
  id?: string;
  title: string;
  description: string;
  category: string;
  location: string;
  status?: "pending" | "in-progress" | "resolved" | "rejected";
  priority?: "low" | "medium" | "high" | "critical";
  reporter_id?: number;
  assigned_to?: number;
  images?: string[];
  created_at?: string;
  updated_at?: string;
}

export const reportsAPI = {
  getAll: () => fetchAPI<Report[]>("reports"),

  getById: (id: string) => fetchAPI<Report>(`reports/${id}`),

  create: (report: Report) =>
    fetchAPI<{ success: boolean; id: string }>("reports", {
      method: "POST",
      body: JSON.stringify(report),
    }),

  update: (id: string, report: Partial<Report>) =>
    fetchAPI<{ success: boolean }>(`reports/${id}`, {
      method: "PUT",
      body: JSON.stringify(report),
    }),

  delete: (id: string) =>
    fetchAPI<{ success: boolean }>(`reports/${id}`, {
      method: "DELETE",
    }),
};

// Notifications API
export interface Notification {
  id?: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error" | "update";
  is_read: boolean;
  user_id?: number;
  sender_id?: number;
  related_issue_id?: string;
  created_at?: string;
}

export const notificationsAPI = {
  getAll: () => fetchAPI<Notification[]>("notifications"),

  getById: (id: string) => fetchAPI<Notification>(`notifications/${id}`),

  markAsRead: (id: string) =>
    fetchAPI<{ success: boolean }>(`notifications/${id}`, {
      method: "PUT",
      body: JSON.stringify({ is_read: true }),
    }),

  delete: (id: string) =>
    fetchAPI<{ success: boolean }>(`notifications/${id}`, {
      method: "DELETE",
    }),
};

// Real-time notifications using EventSource
export class NotificationService {
  private eventSource: EventSource | null = null;
  private listeners: ((notification: Notification) => void)[] = [];

  constructor() {
    this.connect();
  }

  private connect() {
    try {
      this.eventSource = new EventSource(`${API_URL}/notifications/stream`);

      this.eventSource.onmessage = (event) => {
        const notification = JSON.parse(event.data) as Notification;
        this.notifyListeners(notification);
      };

      this.eventSource.onerror = () => {
        this.eventSource?.close();
        // Attempt to reconnect after 5 seconds
        setTimeout(() => this.connect(), 5000);
      };
    } catch (error) {
      console.error("Failed to connect to notification stream:", error);
      // Fallback to polling if EventSource is not supported
      this.startPolling();
    }
  }

  private startPolling() {
    // Poll for new notifications every 30 seconds
    setInterval(async () => {
      try {
        const notifications = await notificationsAPI.getAll();
        const unreadNotifications = notifications.filter((n) => !n.is_read);

        // Notify listeners of each unread notification
        unreadNotifications.forEach((notification) => {
          this.notifyListeners(notification);
        });
      } catch (error) {
        console.error("Notification polling failed:", error);
      }
    }, 30000);
  }

  private notifyListeners(notification: Notification) {
    this.listeners.forEach((listener) => listener(notification));
  }

  public subscribe(callback: (notification: Notification) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(
        (listener) => listener !== callback,
      );
    };
  }

  public disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    this.listeners = [];
  }
}

// Create a singleton instance
export const notificationService = new NotificationService();
