import React, { useState } from "react";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ArrowRight, Building, FileText, Users } from "lucide-react";
import Navbar from "./layout/Navbar";
import ResidentDashboard from "./dashboard/ResidentDashboard";
import AdminDashboard from "./dashboard/AdminDashboard";
import AuthModal from "./auth/AuthModal";

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

  const handleRegisterSubmit = (
    name: string,
    email: string,
    password: string,
  ) => {
    // In a real app, you would create a new user in the database
    // For demo purposes, we'll just log in the user with the provided info
    setUser({
      name: name,
      email: email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      role: "resident",
    });
    setAuthModalOpen(false);
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

            {/* How it works section */}
            <div className="mt-16">
              <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
                How It Works
              </h2>
              <div className="grid gap-8 md:grid-cols-3">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mb-4 mx-auto">
                    <span className="text-lg font-bold">1</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
                    Report an Issue
                  </h3>
                  <p className="text-gray-500 text-center">
                    Submit details about community issues you've encountered,
                    including photos and location.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mb-4 mx-auto">
                    <span className="text-lg font-bold">2</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
                    Officials Review
                  </h3>
                  <p className="text-gray-500 text-center">
                    Barangay officials review, prioritize, and assign staff to
                    address the reported issues.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white mb-4 mx-auto">
                    <span className="text-lg font-bold">3</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
                    Track Resolution
                  </h3>
                  <p className="text-gray-500 text-center">
                    Receive updates as your report progresses through
                    resolution, with full transparency.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Auth Modal - Only show if user is not logged in and modal is open */}
      {!user && authModalOpen && (
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          onLogin={() => {
            mockLogin("resident");
            setAuthModalOpen(false);
          }}
          onRegister={() => {
            mockLogin("resident");
            setAuthModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default Home;
