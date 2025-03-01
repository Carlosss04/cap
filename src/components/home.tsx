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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Hero section */}
            <div className="text-center mb-16">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Community Issue</span>
                <span className="block text-blue-600">Reporting Platform</span>
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                Report and track community issues in your barangay. Help make
                our community better, one report at a time.
              </p>
              <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                <div className="rounded-md shadow">
                  <Button
                    className="w-full flex items-center justify-center px-8 py-3 text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                    onClick={() => mockLogin("resident")}
                  >
                    Get Started
                  </Button>
                </div>
                <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center px-8 py-3 text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                    onClick={() => mockLogin("admin")}
                  >
                    Admin Demo
                  </Button>
                </div>
              </div>
            </div>

            {/* Feature tabs */}
            <Tabs defaultValue="residents" className="max-w-4xl mx-auto">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="residents" className="text-sm sm:text-base">
                  For Residents
                </TabsTrigger>
                <TabsTrigger value="officials" className="text-sm sm:text-base">
                  For Barangay Officials
                </TabsTrigger>
              </TabsList>
              <TabsContent value="residents" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-center">
                      Resident Portal Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="flex flex-col items-center p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <FileText className="h-10 w-10 text-blue-500 mb-3" />
                        <h3 className="text-lg font-medium mb-2">
                          Easy Issue Reporting
                        </h3>
                        <p className="text-gray-500 text-center">
                          Submit reports with photos, descriptions, and location
                          details in just a few clicks.
                        </p>
                      </div>
                      <div className="flex flex-col items-center p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <Users className="h-10 w-10 text-blue-500 mb-3" />
                        <h3 className="text-lg font-medium mb-2">
                          Real-time Updates
                        </h3>
                        <p className="text-gray-500 text-center">
                          Receive notifications when your reports are updated,
                          assigned, or resolved.
                        </p>
                      </div>
                    </div>
                    <div className="mt-6 text-center">
                      <Button
                        onClick={() => handleRegister()}
                        className="inline-flex items-center"
                      >
                        Create an Account{" "}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="officials" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-center">
                      Admin Dashboard Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="flex flex-col items-center p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <Building className="h-10 w-10 text-blue-500 mb-3" />
                        <h3 className="text-lg font-medium mb-2">
                          Comprehensive Management
                        </h3>
                        <p className="text-gray-500 text-center">
                          Efficiently manage, assign, and track all community
                          issues from a central dashboard.
                        </p>
                      </div>
                      <div className="flex flex-col items-center p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <FileText className="h-10 w-10 text-blue-500 mb-3" />
                        <h3 className="text-lg font-medium mb-2">
                          Data Analytics
                        </h3>
                        <p className="text-gray-500 text-center">
                          Gain insights with powerful analytics to identify
                          patterns and improve community services.
                        </p>
                      </div>
                    </div>
                    <div className="mt-6 text-center">
                      <Button
                        onClick={() => mockLogin("admin")}
                        className="inline-flex items-center"
                      >
                        Try Admin Demo <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

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

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLogin={() => mockLogin("resident")}
        onRegister={() => mockLogin("resident")}
      />
    </div>
  );
};

export default Home;
