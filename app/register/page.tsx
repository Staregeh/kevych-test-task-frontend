"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { CardContent } from "@/components/ui/card";
import { LockKeyhole, User, Mail } from "lucide-react";
import axios, { AxiosError } from "axios";

import {
  validateUsername,
  validateEmail,
  validatePassword,
} from "@/lib/validation";
import AuthCard from "@/components/forms/FormCard";
import FormError from "@/components/forms/FormError";
import FormInput from "@/components/forms/FormInput";

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  general: string;
}

export default function SignUpPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    general: "",
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors: FormErrors = {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      general: "",
    };

    const usernameError = validateUsername(formData.username);
    if (usernameError) {
      newErrors.username = usernameError;
      isValid = false;
    }

    const emailError = validateEmail(formData.email);
    if (emailError) {
      newErrors.email = emailError;
      isValid = false;
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      newErrors.password = passwordError;
      isValid = false;
    }

    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name as keyof FormErrors]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Call your backend registration endpoint
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,

        {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }
      );

      if (response.data) {
        setErrors({
          ...errors,
          general: "Registration successful! Redirecting to login...",
        });

        // Redirect to login page after successful registration
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>;
      setErrors({
        ...errors,
        general:
          axiosError.response?.data?.message ||
          "Registration failed. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (field: "password" | "confirmPassword") => {
    if (field === "password") {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <AuthCard
      title="Create an Account"
      description="Enter your details to sign up"
    >
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <FormError error={errors.general} />

          <FormInput
            id="username"
            name="username"
            label="Username"
            placeholder="Choose a username"
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
            disabled={isLoading}
            icon={User}
          />

          <FormInput
            id="email"
            name="email"
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            disabled={isLoading}
            icon={Mail}
          />

          <FormInput
            id="password"
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            disabled={isLoading}
            icon={LockKeyhole}
            showPasswordToggle={true}
            showPassword={showPassword}
            onTogglePassword={() => togglePasswordVisibility("password")}
          />

          <FormInput
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            disabled={isLoading}
            icon={LockKeyhole}
            showPasswordToggle={true}
            showPassword={showConfirmPassword}
            onTogglePassword={() => togglePasswordVisibility("confirmPassword")}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2"
          >
            {isLoading ? "Creating account..." : "Create account"}
          </button>
        </CardContent>
      </form>
    </AuthCard>
  );
}
