import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import {
  UserIcon,
  Building2Icon,
  User2Icon,
  RocketIcon,
  AlertCircle,
  Upload,
  Factory,
} from "lucide-react";
import { authService } from "../../services/authService";
import { Alert, AlertDescription } from "../ui/alert";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { UserRole, StructureType, RegisterRequest } from "../../types/database";

interface AuthenticationFlowProps {
  onLogin?: (userData?: any) => void;
}

export function AuthenticationFlow({ onLogin }: AuthenticationFlowProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { login: contextLogin } = useAuth();
  const from = (location.state as any)?.from?.pathname || "/";

  const [activeTab, setActiveTab] = useState("signin");
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Registration form state
  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    full_name: "",
    phone: "",
    country: "",
    // Startup fields
    startup_name: "",
    startup_description: "",
    startup_website: "",
    // Structure fields
    structure_name: "",
    structure_description: "",
    structure_type: "" as StructureType,
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;

    if (type === "file") {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        setLogoFile(files[0]);
      }
    } else {
      setRegisterData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await contextLogin(loginData.email, loginData.password);

      if (response.success) {
        setSuccessMessage("Login successful! Redirecting...");

        // Get current user to determine redirect
        const user = await authService.getCurrentUser();
        if (user) {
          const redirectPath = authService.getRoleRedirectPath(user.role);
          navigate(redirectPath, { replace: true });
        }

        if (onLogin) {
          onLogin(user);
        }
      } else {
        setErrorMessage(response.message || "Login failed");
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    // Validation
    if (registerData.password !== registerData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (!selectedRole) {
      setErrorMessage("Please select a role");
      setIsLoading(false);
      return;
    }

    if (selectedRole === "startup" && !registerData.startup_name) {
      setErrorMessage("Startup name is required");
      setIsLoading(false);
      return;
    }

    if (
      selectedRole === "structure" &&
      (!registerData.structure_name || !registerData.structure_type)
    ) {
      setErrorMessage("Structure name and type are required");
      setIsLoading(false);
      return;
    }

    try {
      const signUpData = {
        email: registerData.email,
        password: registerData.password,
        full_name: registerData.full_name,
        phone: registerData.phone || undefined,
        country: registerData.country || undefined,
        role: selectedRole,
      };

      // Add role-specific data
      if (selectedRole === "startup") {
        signUpData.startup_data = {
          name: registerData.startup_name,
          description: registerData.startup_description || undefined,
          website: registerData.startup_website || undefined,
          logo_url: logoFile ? URL.createObjectURL(logoFile) : undefined,
        };
      } else if (selectedRole === "structure") {
        signUpData.structure_data = {
          name: registerData.structure_name,
          description: registerData.structure_description || undefined,
          structure_type: registerData.structure_type,
          logo_url: logoFile ? URL.createObjectURL(logoFile) : undefined,
        };
      }

      const response = await authService.signUp(signUpData);

      if (response.success) {
        setSuccessMessage(
          "Registration successful! Please check your email for verification.",
        );
        setActiveTab("signin");
        // Reset form
        setRegisterData({
          email: "",
          password: "",
          confirmPassword: "",
          full_name: "",
          phone: "",
          country: "",
          startup_name: "",
          startup_description: "",
          startup_website: "",
          structure_name: "",
          structure_description: "",
          structure_type: "" as StructureType,
        });
        setSelectedRole(null);
        setLogoFile(null);
      } else {
        setErrorMessage(response.message || "Registration failed");
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred during registration");
    } finally {
      setIsLoading(false);
    }
  };

  const roleOptions = [
    {
      value: "client",
      label: "Client",
      icon: UserIcon,
      description: "Browse and purchase from startups",
    },
    {
      value: "startup",
      label: "Startup",
      icon: RocketIcon,
      description: "Showcase your products and services",
    },
    {
      value: "structure",
      label: "Support Structure",
      icon: Building2Icon,
      description: "Incubator, Accelerator, or FabLab",
    },
  ];

  const structureTypes = [
    { value: "incubator", label: "Incubator" },
    { value: "accelerator", label: "Accelerator" },
    { value: "fablab", label: "FabLab" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#080f17] p-4">
      <div className="w-full max-w-md">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          {/* Sign In Tab */}
          <TabsContent value="signin">
            <Card className="border-border bg-card">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-foreground">
                  Welcome Back
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Sign in to your VenturesRoom account
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSignIn}>
                <CardContent className="space-y-4">
                  {errorMessage && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                  )}
                  {successMessage && (
                    <Alert className="border-green-500 text-green-700">
                      <AlertDescription>{successMessage}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={loginData.email}
                      onChange={handleLoginChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Enter your password"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      required
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          {/* Sign Up Tab */}
          <TabsContent value="signup">
            <Card className="border-border bg-card">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-foreground">
                  Join VenturesRoom
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Create your account and join the ecosystem
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleRegister}>
                <CardContent className="space-y-4">
                  {errorMessage && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                  )}
                  {successMessage && (
                    <Alert className="border-green-500 text-green-700">
                      <AlertDescription>{successMessage}</AlertDescription>
                    </Alert>
                  )}

                  {/* Role Selection */}
                  <div className="space-y-3">
                    <Label>Select Your Role</Label>
                    <div className="grid grid-cols-1 gap-2">
                      {roleOptions.map((role) => (
                        <Button
                          key={role.value}
                          type="button"
                          variant={
                            selectedRole === role.value ? "default" : "outline"
                          }
                          className="h-auto p-3 justify-start"
                          onClick={() =>
                            setSelectedRole(role.value as UserRole)
                          }
                        >
                          <role.icon className="h-4 w-4 mr-2" />
                          <div className="text-left">
                            <div className="font-medium">{role.label}</div>
                            <div className="text-xs text-muted-foreground">
                              {role.description}
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Basic Information */}
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      name="full_name"
                      placeholder="Enter your full name"
                      value={registerData.full_name}
                      onChange={handleRegisterChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={registerData.email}
                      onChange={handleRegisterChange}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={registerData.password}
                        onChange={handleRegisterChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm"
                        value={registerData.confirmPassword}
                        onChange={handleRegisterChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone (Optional)</Label>
                      <Input
                        id="phone"
                        name="phone"
                        placeholder="Phone number"
                        value={registerData.phone}
                        onChange={handleRegisterChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country (Optional)</Label>
                      <Input
                        id="country"
                        name="country"
                        placeholder="Country"
                        value={registerData.country}
                        onChange={handleRegisterChange}
                      />
                    </div>
                  </div>

                  {/* Startup-specific fields */}
                  {selectedRole === "startup" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="startup_name">Startup Name</Label>
                        <Input
                          id="startup_name"
                          name="startup_name"
                          placeholder="Enter your startup name"
                          value={registerData.startup_name}
                          onChange={handleRegisterChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="startup_description">
                          Description (Optional)
                        </Label>
                        <Textarea
                          id="startup_description"
                          name="startup_description"
                          placeholder="Describe your startup"
                          value={registerData.startup_description}
                          onChange={handleRegisterChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="startup_website">
                          Website (Optional)
                        </Label>
                        <Input
                          id="startup_website"
                          name="startup_website"
                          placeholder="https://your-startup.com"
                          value={registerData.startup_website}
                          onChange={handleRegisterChange}
                        />
                      </div>
                    </>
                  )}

                  {/* Structure-specific fields */}
                  {selectedRole === "structure" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="structure_name">
                          Organization Name
                        </Label>
                        <Input
                          id="structure_name"
                          name="structure_name"
                          placeholder="Enter organization name"
                          value={registerData.structure_name}
                          onChange={handleRegisterChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="structure_type">
                          Organization Type
                        </Label>
                        <Select
                          value={registerData.structure_type}
                          onValueChange={(value) =>
                            setRegisterData((prev) => ({
                              ...prev,
                              structure_type: value as StructureType,
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {structureTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="structure_description">
                          Description (Optional)
                        </Label>
                        <Textarea
                          id="structure_description"
                          name="structure_description"
                          placeholder="Describe your organization"
                          value={registerData.structure_description}
                          onChange={handleRegisterChange}
                        />
                      </div>
                    </>
                  )}

                  {/* Logo upload for startup/structure */}
                  {(selectedRole === "startup" ||
                    selectedRole === "structure") && (
                    <div className="space-y-2">
                      <Label htmlFor="logo">Logo (Optional)</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="logo"
                          name="logo"
                          type="file"
                          accept="image/*"
                          onChange={handleRegisterChange}
                          className="flex-1"
                        />
                        <Upload className="h-4 w-4 text-muted-foreground" />
                      </div>
                      {logoFile && (
                        <p className="text-sm text-muted-foreground">
                          Selected: {logoFile.name}
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading || !selectedRole}
                  >
                    {isLoading ? "Creating account..." : "Create Account"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
