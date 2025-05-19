"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { CardContent } from "@/components/ui/card";
import { LockKeyhole, User } from "lucide-react";
import { validateUsername } from "@/lib/validation";
import { login } from "@/lib/auth";
import AuthCard from "@/components/forms/FormCard";
import FormError from "@/components/forms/FormError";
import AuthFooter from "@/components/forms/FormFooter";
import FormInput from "@/components/forms/FormInput";

interface FormData {
  username: string;
  password: string;
}

interface FormErrors {
  username: string;
  password: string;
  general: string;
}

export default function SignInPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({
    username: "",
    password: "",
    general: "",
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors: FormErrors = {
      username: "",
      password: "",
      general: "",
    };

    const usernameError = validateUsername(formData.username);
    if (usernameError) {
      newErrors.username = usernameError;
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
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
      await login({
        username: formData.username,
        password: formData.password,
      });

      setErrors({
        ...errors,
        general: "Sign in successful! Redirecting...",
      });
      router.push("/schedule");
    } catch (error) {
      setErrors({
        ...errors,
        general:
          error instanceof Error
            ? error.message
            : "An error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <AuthCard
      title="Sign In"
      description="Enter your credentials to access your account"
    >
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <FormError error={errors.general} />

          <FormInput
            id="username"
            name="username"
            label="Username"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleChange}
            error={errors.username}
            disabled={isLoading}
            icon={User}
          />

          <FormInput
            id="password"
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            disabled={isLoading}
            icon={LockKeyhole}
            showPasswordToggle={true}
            showPassword={showPassword}
            onTogglePassword={togglePasswordVisibility}
          />
        </CardContent>

        <AuthFooter
          isLoading={isLoading}
          submitText="Sign in"
          loadingText="Logging in..."
        >
          <div className="mt-2">{/* Add registration link if needed */}</div>
        </AuthFooter>
      </form>
    </AuthCard>
  );
}
