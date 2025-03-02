import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Bell, ChevronDown, LogOut, Menu, Settings, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface NavbarProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
    role?: "resident" | "admin" | "staff";
  } | null;
  onLogin?: () => void;
  onLogout?: () => void;
  onRegister?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  user = null,
  onLogin = () => {},
  onLogout = () => {},
  onRegister = () => {},
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "register">(
    "login",
  );
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const handleLoginClick = () => {
    onLogin();
  };

  const handleRegisterClick = () => {
    onRegister();
  };

  return (
    <nav className="w-full h-[70px] bg-white border-b border-gray-200 shadow-sm fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <img
                src="/vite.svg"
                alt="Community Issue Reporting"
                className="h-8 w-auto mr-2"
              />
              <span className="text-xl font-bold text-gray-900 hidden md:block">
                Community Issues
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6"></div>

          {/* User Menu & Auth Buttons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Notifications */}
                <Dialog
                  open={notificationsOpen}
                  onOpenChange={setNotificationsOpen}
                >
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell className="h-5 w-5" />
                      <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <div className="p-4">
                      <h3 className="text-lg font-medium mb-2">
                        Notifications
                      </h3>
                      <div className="space-y-4">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">
                              Status Update
                            </span>
                            <span className="text-xs text-gray-500">
                              2 hours ago
                            </span>
                          </div>
                          <p className="text-sm mt-1">
                            Your report #12345 has been updated to "In Progress"
                          </p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">
                              New Comment
                            </span>
                            <span className="text-xs text-gray-500">
                              Yesterday
                            </span>
                          </div>
                          <p className="text-sm mt-1">
                            Juan Dela Cruz commented on your report
                          </p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">
                              Report Resolved
                            </span>
                            <span className="text-xs text-gray-500">
                              3 days ago
                            </span>
                          </div>
                          <p className="text-sm mt-1">
                            Your report #12340 has been marked as resolved
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full mt-4">
                        View All Notifications
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* User Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center space-x-2"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={
                            user.avatar ||
                            "https://api.dicebear.com/7.x/avataaars/svg?seed=user"
                          }
                          alt={user.name}
                        />
                        <AvatarFallback>
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium hidden sm:block">
                        {user.name}
                      </span>
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="flex items-center justify-start p-2">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.name}
                        </p>
                        <p className="text-xs leading-none text-gray-500">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex space-x-2">
                <Button variant="ghost" onClick={handleLoginClick}>
                  Log in
                </Button>
                <Button onClick={handleRegisterClick}>Sign up</Button>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 shadow-md">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3"></div>
        </div>
      )}

      {/* Auth Modal removed - now handled in Home component */}
    </nav>
  );
};

export default Navbar;
