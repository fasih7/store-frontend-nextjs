"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { authGateway } from "@/domain/gateways/auth.gateway";
import TwitterIcon from "@/components/icons/TwitterIcon";
import GoogleIcon from "@/components/icons/GoogleIcon";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { OTPModal } from "@/components/dialogs/opt-modal";

// Reusable IconInput component
function IconInput({
  icon: Icon,
  id,
  name,
  type,
  placeholder,
  value,
  onChange,
  required = false,
}: Readonly<{
  icon: any;
  id: string;
  name: string;
  type: string;
  placeholder: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}>) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{placeholder}</Label>
      <div className="relative">
        <Icon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          className="pl-10"
          required={required}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
}

export default function AuthPage() {
  const router = useRouter();
  const { toast } = useToast();

  // States
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const { setIsLoggedIn } = useAuth();

  // Timer effect for resend functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Signup Handler
  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await authGateway.signUp(
        firstName,
        lastName,
        email,
        password
      );

      if (response.success) {
        setUserEmail(email);
        setIsOtpModalOpen(true);
        setResendTimer(60);
        toast({
          title: "Success",
          description:
            "Account created! Please check your email for verification code.",
          variant: "success",
        });
      }
    } catch (error: any) {
      console.error("Signup error:", error);

      if (error.message === "Email is pending verification") {
        toast({
          title: "Email Pending Verification",
          description:
            "Please check your email for the verification code or resend it.",
          variant: "destructive",
        });
        setUserEmail(email);
        setIsOtpModalOpen(true);
        setResendTimer(60);
      } else if (error.message === "User with this email already exists") {
        toast({
          title: "Account Exists",
          description:
            "An account with this email already exists. Please try logging in.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Signup Failed",
          description: error.message || "An error occurred during signup",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Verification Handler
  const handleVerifyEmail = async (token: string) => {
    try {
      await authGateway.verifyEmail(userEmail, token);
      setIsLoggedIn(true);
      setIsOtpModalOpen(false);
      toast({
        title: "Success",
        description: "Email verified successfully! Welcome!",
        variant: "success",
      });
      router.push("/");
    } catch (error: any) {
      console.error("Verification error:", error);

      if (error.message === "Not found") {
        setOtpError("Invalid verification code. Please try again.");
      } else if (error.message.includes("Incorrect token")) {
        setOtpError(error.message);
      } else if (error.message === "Token has been expired") {
        setOtpError("Verification code has expired. Please request a new one.");
      } else {
        setOtpError(error.message || "Verification failed. Please try again.");
      }
    }
  };

  // Resend Token Handler
  const handleResendToken = async () => {
    try {
      await authGateway.resendToken(userEmail);
      setResendTimer(60);
      setOtpError("");
      toast({
        title: "Code Sent",
        description: "A new verification code has been sent to your email.",
        variant: "success",
      });
    } catch (error: any) {
      console.error("Resend error:", error);
      toast({
        title: "Resend Failed",
        description: error.message || "Failed to resend verification code",
        variant: "destructive",
      });
    }
  };

  // Login Handler
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    setIsSubmitting(true);
    try {
      await authGateway.login(
        formData.get("email") as string,
        formData.get("password") as string
      );

      setIsLoggedIn(true);
      router.push("/");
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-400 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Welcome</CardTitle>
          <CardDescription>
            Sign in to your account or create a new one
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            {/* Login */}
            <TabsContent value="login" className="space-y-4 mt-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <IconInput
                  icon={Mail}
                  id="login-email"
                  name="email"
                  type="email"
                  placeholder="Email"
                  required
                />

                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="login-password"
                      name="password"
                      type={showLoginPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="pl-10 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      aria-label="Toggle password visibility"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                    >
                      {showLoginPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Signing in..." : "Sign In"}
                </Button>

                <div className="text-center">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-muted-foreground"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </form>
            </TabsContent>

            {/* Signup */}
            <TabsContent value="signup" className="space-y-4 mt-6">
              <form onSubmit={handleSignup} className="space-y-4">
                <IconInput
                  icon={User}
                  id="signup-firstname"
                  name="firstName"
                  type="text"
                  placeholder="First Name"
                  required
                />

                <IconInput
                  icon={User}
                  id="signup-lastname"
                  name="lastName"
                  type="text"
                  placeholder="Last Name"
                  required
                />

                <IconInput
                  icon={Mail}
                  id="signup-email"
                  name="email"
                  type="email"
                  placeholder="Email"
                  required
                />

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-password"
                      name="password"
                      type={showSignupPassword ? "text" : "password"}
                      placeholder="Create a password"
                      className="pl-10 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      aria-label="Toggle password visibility"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                    >
                      {showSignupPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-confirm-password">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="signup-confirm-password"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      className="pl-10 pr-10"
                      required
                    />
                    <Button
                      type="button"
                      aria-label="Toggle password visibility"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating Account..." : "Create Account"}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By signing up, you agree to our{" "}
                  <Link href="/terms" className="underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="underline">
                    Privacy Policy
                  </Link>
                </p>
              </form>
            </TabsContent>
          </Tabs>

          {/* Social Logins */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <Button variant="outline" className="w-full bg-transparent">
                <GoogleIcon className="mr-2 h-4 w-4" />
                Google
              </Button>
              <Button variant="outline" className="w-full bg-transparent">
                <TwitterIcon className="mr-2 h-4 w-4" />
                Twitter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* OTP Verification Modal */}
      <OTPModal
        open={isOtpModalOpen}
        onOpenChange={setIsOtpModalOpen}
        onOptSubmit={handleVerifyEmail}
        onResendOTP={handleResendToken}
        timer={resendTimer}
        errorMessage={otpError}
      />
    </div>
  );
}
