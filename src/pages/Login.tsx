import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, getDashboardRoute } from "@/contexts/AuthContext";
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
import { Spinner } from "@/components/ui/spinner";
import { Eye, EyeOff, User, Lock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(getDashboardRoute(user.role), { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      return;
    }

    setIsSubmitting(true);

    try {
      await login(username, password);

      navigate("/");
      // Navigation will happen via useEffect
    } catch (error) {
      // Error handled in auth context
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/school.webp"
          alt="School Background"
          className="w-full h-full object-cover blur-sm scale-110 brightness-75 "
        />

        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/70 via-black/40 to-slate-950/80" />
      </div>
      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md px-4">
        <Card className="border border-white/20 shadow-2xl bg-white/10 backdrop-blur-2xl overflow-hidden">
          {" "}
          {/* Card Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-50" />
          <CardHeader className="relative text-center space-y-4 pb-6">
            {/* Logo */}
            <div className="mx-auto w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-[2px] shadow-lg shadow-purple-500/30">
              <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center">
                <img
                  src="/navodaya.jpeg"
                  alt="Jawahar Navodaya Vidyalaya"
                  className="w-16 h-16 object-contain"
                />
              </div>
            </div>

            <div>
              <CardTitle className="text-3xl font-bold text-white">
                Jawahar Navodaya Vidyalaya
              </CardTitle>
              <CardDescription className="text-gray-300 mt-2">
                Tikamgarh
              </CardDescription>
              {/* <p className="text-sm text-gray-400 mt-1">
Secure Login Portal
</p> */}
            </div>
          </CardHeader>
          <CardContent className="relative space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Field */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-300">
                  Username
                </Label>
                <div className="relative group">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">
                  Password
                </Label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "w-full h-12 text-lg font-semibold rounded-xl",
                  "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600",
                  "hover:from-blue-500 hover:via-purple-500 hover:to-pink-500",
                  "transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]",
                  "shadow-lg shadow-purple-500/25",
                  "disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none",
                )}
              >
                {isSubmitting ? (
                  <Spinner className="w-5 h-5" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-6">
          © 2024 Navodaya Vidyalaya Samiti. All rights reserved.
        </p>
      </div>

      {/* CSS for custom animations */}
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
};
