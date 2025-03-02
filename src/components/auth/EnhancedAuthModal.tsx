import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Label } from "../ui/label";
import {
  Eye,
  EyeOff,
  Mail,
  User,
  Lock,
  Building,
  CheckCircle2,
  FileCheck,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

interface EnhancedAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (data: LoginFormData) => void;
  onRegister: (data: RegisterFormData) => void;
  onForgotPassword?: (email: string) => void;
}

interface LoginFormData {
  email: string;
  password: string;
}

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "resident" | "admin";
  verificationInfo?: string;
}

const EnhancedAuthModal: React.FC<EnhancedAuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  onRegister,
  onForgotPassword = () => {},
}) => {
  const [activeTab, setActiveTab] = useState<string>("login");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [forgotPasswordMode, setForgotPasswordMode] = useState<boolean>(false);
  const [adminVerificationStatus, setAdminVerificationStatus] = useState<
    "pending" | "approved" | "rejected"
  >("pending");

  // Login form state
  const [loginForm, setLoginForm] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  // Register form state
  const [registerForm, setRegisterForm] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "resident",
    verificationInfo: "",
  });

  // Forgot password email state
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState<string>("");

  // Form validation states
  const [loginErrors, setLoginErrors] = useState<Partial<LoginFormData>>({
    email: "",
    password: "",
  });

  const [registerErrors, setRegisterErrors] = useState<
    Partial<RegisterFormData> & { general?: string }
  >({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
    verificationInfo: "",
    general: "",
  });

  const [forgotPasswordError, setForgotPasswordError] = useState<string>("");

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    setLoginErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleRegisterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setRegisterForm((prev) => ({ ...prev, [name]: value }));
    // Clear error when user types
    setRegisterErrors((prev) => ({ ...prev, [name]: "", general: "" }));
  };

  const handleRoleChange = (value: string) => {
    setRegisterForm((prev) => ({
      ...prev,
      role: value as "resident" | "admin",
    }));
    setRegisterErrors((prev) => ({ ...prev, role: "", general: "" }));
  };

  const validateLoginForm = (): boolean => {
    const errors: Partial<LoginFormData> = {};
    let isValid = true;

    if (!loginForm.email) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(loginForm.email)) {
      errors.email = "Email is invalid";
      isValid = false;
    }

    if (!loginForm.password) {
      errors.password = "Password is required";
      isValid = false;
    }

    setLoginErrors(errors);
    return isValid;
  };

  const validateRegisterForm = (): boolean => {
    const errors: Partial<RegisterFormData> & { general?: string } = {};
    let isValid = true;

    if (!registerForm.name) {
      errors.name = "Name is required";
      isValid = false;
    }

    if (!registerForm.email) {
      errors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(registerForm.email)) {
      errors.email = "Email is invalid";
      isValid = false;
    }

    if (!registerForm.password) {
      errors.password = "Password is required";
      isValid = false;
    } else if (registerForm.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
      isValid = false;
    }

    if (!registerForm.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (registerForm.password !== registerForm.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    if (!registerForm.role) {
      errors.role = "Please select a role";
      isValid = false;
    }

    if (registerForm.role === "admin") {
      if (!registerForm.verificationInfo) {
        errors.verificationInfo = "Please provide verification information";
        isValid = false;
      } else if (registerForm.verificationInfo.length < 50) {
        errors.verificationInfo =
          "Please provide more detailed verification information (at least 50 characters)";
        isValid = false;
      } else if (
        !/\b(LGU|ID|employee|staff|official|position|department|barangay)\b/i.test(
          registerForm.verificationInfo,
        )
      ) {
        errors.verificationInfo =
          "Your verification must include official details like ID number, position, department, etc.";
        isValid = false;
      } else {
        // Simulate verification check
        const containsValidID = /\b(ID|identification|number)\b/i.test(
          registerForm.verificationInfo,
        );
        const containsPosition = /\b(position|role|title)\b/i.test(
          registerForm.verificationInfo,
        );
        const containsDepartment = /\b(department|office|division)\b/i.test(
          registerForm.verificationInfo,
        );

        if (!containsValidID || !containsPosition || !containsDepartment) {
          errors.verificationInfo =
            "Your verification information must include your ID number, position title, and department/office.";
          isValid = false;
        }
      }
    }

    setRegisterErrors(errors);
    return isValid;
  };

  const validateForgotPasswordForm = (): boolean => {
    if (!forgotPasswordEmail) {
      setForgotPasswordError("Email is required");
      return false;
    } else if (!/\S+@\S+\.\S+/.test(forgotPasswordEmail)) {
      setForgotPasswordError("Email is invalid");
      return false;
    }
    setForgotPasswordError("");
    return true;
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateLoginForm()) {
      onLogin(loginForm);
      resetForms();
      onClose();
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateRegisterForm()) {
      onRegister(registerForm);
      resetForms();
      onClose();
    }
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForgotPasswordForm()) {
      onForgotPassword(forgotPasswordEmail);
      // Show success message or redirect
      setForgotPasswordMode(false);
      // Optionally show a success message
    }
  };

  const resetForms = () => {
    setLoginForm({ email: "", password: "" });
    setRegisterForm({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "resident",
      verificationInfo: "",
    });
    setLoginErrors({ email: "", password: "" });
    setRegisterErrors({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
      verificationInfo: "",
      general: "",
    });
    setForgotPasswordEmail("");
    setForgotPasswordError("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    resetForms();
  };

  const toggleForgotPasswordMode = () => {
    setForgotPasswordMode(!forgotPasswordMode);
    setForgotPasswordEmail("");
    setForgotPasswordError("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            {forgotPasswordMode
              ? "Reset Password"
              : activeTab === "login"
                ? "Login to Your Account"
                : "Create an Account"}
          </DialogTitle>
        </DialogHeader>

        {forgotPasswordMode ? (
          <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="forgot-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="forgot-email"
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10"
                  value={forgotPasswordEmail}
                  onChange={(e) => {
                    setForgotPasswordEmail(e.target.value);
                    setForgotPasswordError("");
                  }}
                />
              </div>
              {forgotPasswordError && (
                <p className="text-sm text-red-500">{forgotPasswordError}</p>
              )}
              <p className="text-sm text-muted-foreground">
                We'll send you a link to reset your password.
              </p>
            </div>

            <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:space-x-0">
              <Button
                type="button"
                variant="outline"
                onClick={toggleForgotPasswordMode}
              >
                Back to Login
              </Button>
              <Button type="submit">Send Reset Link</Button>
            </DialogFooter>
          </form>
        ) : (
          <Tabs
            defaultValue="login"
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4 py-4">
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10"
                      value={loginForm.email}
                      onChange={handleLoginChange}
                    />
                  </div>
                  {loginErrors.email && (
                    <p className="text-sm text-red-500">{loginErrors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="login-password">Password</Label>
                    <Button
                      type="button"
                      variant="link"
                      className="px-0 font-normal text-xs"
                      onClick={toggleForgotPasswordMode}
                    >
                      Forgot password?
                    </Button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="pl-10"
                      value={loginForm.password}
                      onChange={handleLoginChange}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-9 w-9"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                      <span className="sr-only">
                        {showPassword ? "Hide password" : "Show password"}
                      </span>
                    </Button>
                  </div>
                  {loginErrors.password && (
                    <p className="text-sm text-red-500">
                      {loginErrors.password}
                    </p>
                  )}
                </div>

                <Button type="submit" className="w-full">
                  Login
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register" className="space-y-4 py-4">
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="register-name"
                      name="name"
                      type="text"
                      placeholder="Enter your full name"
                      className="pl-10"
                      value={registerForm.name}
                      onChange={handleRegisterChange}
                    />
                  </div>
                  {registerErrors.name && (
                    <p className="text-sm text-red-500">
                      {registerErrors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="register-email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10"
                      value={registerForm.email}
                      onChange={handleRegisterChange}
                    />
                  </div>
                  {registerErrors.email && (
                    <p className="text-sm text-red-500">
                      {registerErrors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-role">Role</Label>
                  <Select
                    value={registerForm.role}
                    onValueChange={handleRoleChange}
                  >
                    <SelectTrigger id="register-role" className="w-full">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="resident">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-blue-500" />
                          <span>Resident</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="admin">
                        <div className="flex items-center">
                          <Building className="h-4 w-4 mr-2 text-green-500" />
                          <span>Barangay Official/LGU Staff</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {registerErrors.role && (
                    <p className="text-sm text-red-500">
                      {registerErrors.role}
                    </p>
                  )}
                </div>

                {registerForm.role === "admin" && (
                  <div className="space-y-2">
                    <Label htmlFor="verification-info">
                      Verification Information
                    </Label>
                    <div className="relative">
                      <FileCheck className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Textarea
                        id="verification-info"
                        name="verificationInfo"
                        placeholder="Please provide your position, ID number, or other information that verifies you work for the LGU or barangay. Include your employee ID, department, position title, and contact information of your supervisor."
                        className="pl-10 min-h-[150px]"
                        value={registerForm.verificationInfo}
                        onChange={handleRegisterChange}
                      />
                    </div>
                    {registerErrors.verificationInfo && (
                      <p className="text-sm text-red-500">
                        {registerErrors.verificationInfo}
                      </p>
                    )}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mt-2">
                      <p className="text-xs text-yellow-800 font-medium">
                        <strong>Important:</strong> Your account will need to be
                        verified by an administrator before you can access admin
                        features.
                      </p>
                      <ul className="text-xs text-yellow-800 mt-1 list-disc list-inside">
                        <li>Include your complete employee ID number</li>
                        <li>Specify your department and position title</li>
                        <li>Provide contact information of your supervisor</li>
                        <li>
                          Mention your official email address if available
                        </li>
                      </ul>
                      <p className="text-xs text-yellow-800 mt-1">
                        Incomplete or false information will result in rejection
                        of your account.
                      </p>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mt-2">
                      <p className="text-xs text-blue-800 font-medium">
                        <strong>Verification Process:</strong> Admin accounts
                        undergo a verification process:
                      </p>
                      <ol className="text-xs text-blue-800 mt-1 list-decimal list-inside">
                        <li>Submit your credentials with complete details</li>
                        <li>
                          Our verification team will review your information
                        </li>
                        <li>
                          You'll receive an email notification about your
                          verification status
                        </li>
                        <li>
                          Once approved, you can log in with admin privileges
                        </li>
                      </ol>
                      <p className="text-xs text-blue-800 mt-1">
                        This process typically takes 1-2 business days.
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="register-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      className="pl-10"
                      value={registerForm.password}
                      onChange={handleRegisterChange}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-9 w-9"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                      <span className="sr-only">
                        {showPassword ? "Hide password" : "Show password"}
                      </span>
                    </Button>
                  </div>
                  {registerErrors.password && (
                    <p className="text-sm text-red-500">
                      {registerErrors.password}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Password must be at least 8 characters long
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-confirm-password">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="register-confirm-password"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      className="pl-10"
                      value={registerForm.confirmPassword}
                      onChange={handleRegisterChange}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-9 w-9"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                      <span className="sr-only">
                        {showConfirmPassword
                          ? "Hide password"
                          : "Show password"}
                      </span>
                    </Button>
                  </div>
                  {registerErrors.confirmPassword && (
                    <p className="text-sm text-red-500">
                      {registerErrors.confirmPassword}
                    </p>
                  )}
                </div>

                {registerErrors.general && (
                  <p className="text-sm text-red-500 text-center">
                    {registerErrors.general}
                  </p>
                )}

                <Button type="submit" className="w-full">
                  Create Account
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By creating an account, you agree to our{" "}
                  <a href="#" className="underline underline-offset-4">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="underline underline-offset-4">
                    Privacy Policy
                  </a>
                  .
                </p>
              </form>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedAuthModal;
