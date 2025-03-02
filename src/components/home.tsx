import React, { useState } from "react";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ArrowRight, Building, FileText, Users } from "lucide-react";
import Navbar from "./layout/Navbar";
import ResidentDashboard from "./dashboard/ResidentDashboard";
import AdminDashboard from "./dashboard/AdminDashboard";
import EnhancedAuthModal from "./auth/EnhancedAuthModal";

const Home: React.FC = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "register">(
    "login",
  );
  const [user, setUser] = useState<{
    name: string;
    email: string;
    avatar?: string;
    role?: "resident" | "admin" | "staff";
  } | null>(null);

  const handleLogin = () => {
    setAuthModalTab("login");
    setAuthModalOpen(true);
  };

  const handleLoginSubmit = (email: string, password: string) => {
    // In a real app, you would validate credentials against a database
    // For demo purposes, we'll use hardcoded credentials
    if (email === "juan@example.com" && password === "password") {
      mockLogin("resident");
    } else if (email === "admin@example.com" && password === "password") {
      mockLogin("admin");
    } else {
      // Show error for invalid credentials
      alert("Invalid email or password");
    }
  };

  const handleRegister = () => {
    setAuthModalTab("register");
    setAuthModalOpen(true);
  };

  const handleRegisterSubmit = async (data: any) => {
    try {
      // In a real app, this would send data to your API
      // For demo purposes, we'll simulate an API call
      console.log("Registering user:", data);

      // If admin role, show verification pending message
      if (data.role === "admin") {
        alert(
          "Your account has been registered but requires verification. An administrator will review your information and approve your account.",
        );
        setAuthModalOpen(false);
        return;
      }

      // For residents, log them in immediately
      setUser({
        name: data.name,
        email: data.email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`,
        role: "resident", // Always set to resident for now
      });
      setAuthModalOpen(false);

      // Save to local storage for persistence
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: data.name,
          email: data.email,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`,
          role: "resident",
        }),
      );
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed. Please try again.");
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  // Mock login for demo purposes
  const mockLogin = (role: "resident" | "admin" | "staff" = "resident") => {
    setUser({
      name: role === "admin" ? "Admin User" : "Juan Dela Cruz",
      email: role === "admin" ? "admin@example.com" : "juan@example.com",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${role}`,
      role: role,
    });
    setAuthModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        user={user}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onLogout={handleLogout}
      />

      {/* Main content */}
      <div className="pt-[70px]">
        {" "}
        {/* Offset for fixed navbar */}
        {user ? (
          // Show dashboard based on user role
          user.role === "admin" ? (
            <AdminDashboard />
          ) : (
            <ResidentDashboard userName={user.name} />
          )
        ) : (
          // Landing page for non-authenticated users
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            {/* Hero section */}
            <div className="text-center mb-16">
              <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl md:text-7xl">
                <span className="block">Community Issue</span>
                <span className="block text-blue-600">Reporting Platform</span>
              </h1>
              <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
                Report and track community issues in your barangay. Help make
                our community better, one report at a time.
              </p>
              <div className="mt-10 flex justify-center gap-4">
                <Button
                  className="px-8 py-3 text-lg font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  onClick={() => mockLogin("resident")}
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Auth Modal - Only show if user is not logged in and modal is open */}
      {!user && (
        <EnhancedAuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          onLogin={async (data) => {
            try {
              // In a real app, this would call your API
              console.log("Login attempt:", data.email);

              // For demo purposes, use hardcoded credentials
              if (
                data.email === "juan@example.com" &&
                data.password === "password"
              ) {
                mockLogin("resident");
              } else if (
                data.email === "admin@example.com" &&
                data.password === "password"
              ) {
                // Check if admin is verified (in a real app)
                const isVerified = true; // This would be from API
                if (isVerified) {
                  mockLogin("admin");
                } else {
                  alert(
                    "Your admin account is pending verification. Please check back later.",
                  );
                }
              } else {
                // Show error for invalid credentials
                alert("Invalid email or password");
              }
            } catch (error) {
              console.error("Login error:", error);
              alert("Login failed. Please try again.");
            }
          }}
          onRegister={handleRegisterSubmit}
        />
      )}
    </div>
  );
};

export default Home;
