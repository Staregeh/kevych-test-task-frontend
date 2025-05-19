"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CardContent } from "@/components/ui/card";
import { TrainIcon, MapPin, Clock, Hash } from "lucide-react";
import { z } from "zod";

import AuthCard from "@/components/forms/FormCard";
import FormError from "@/components/forms/FormError";
import AuthFooter from "@/components/forms/FormFooter";
import FormInput from "@/components/forms/FormInput";
import { createTrain, updateTrain } from "@/lib/api";
import type { Train } from "@/components/train/TrainTable";

// Validation schema for train data
const trainSchema = z.object({
  train_number: z.string().min(1, "Train number is required"),
  departure_station: z.string().min(1, "Departure station is required"),
  arrival_station: z.string().min(1, "Arrival station is required"),
  departure_time: z.date({
    required_error: "Departure time is required",
  }),
  arrival_time: z.date({
    required_error: "Arrival time is required",
  }),
  status: z.enum(["scheduled", "delayed", "cancelled", "departed", "arrived"]),
  type: z.enum(["express", "passenger", "freight"]),
  platform: z.string().optional(),
});

type TrainFormData = z.infer<typeof trainSchema>;

interface TrainFormProps {
  initialData?: Train;
  mode: "create" | "edit";
}

export default function TrainForm({ initialData, mode }: TrainFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<TrainFormData>({
    train_number: initialData?.train_number || "",
    departure_station: initialData?.departure_station || "",
    arrival_station: initialData?.arrival_station || "",
    departure_time: initialData?.departure_time || new Date(Date.now()),
    arrival_time: initialData?.arrival_time || new Date(Date.now()),
    status: initialData?.status || "scheduled",
    type: initialData?.type || "express",
    platform: initialData?.platform || "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof TrainFormData, string>> & { general?: string }
  >({});

  const validateForm = () => {
    try {
      trainSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "departure_time" || name === "arrival_time") {
      setFormData({
        ...formData,
        [name]: new Date(value),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    // Clear error when user starts typing
    if (errors[name as keyof TrainFormData]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      if (mode === "create") {
        await createTrain(formData);
        setErrors({
          ...errors,
          general: "Train created successfully! Redirecting...",
        });
      } else {
        if (!initialData?.id)
          throw new Error("Train ID is required for editing");
        await updateTrain(initialData.id, formData);
        setErrors({
          ...errors,
          general: "Train updated successfully! Redirecting...",
        });
      }

      setTimeout(() => {
        router.push("/schedule");
      }, 1500);
    } catch {
      setErrors({
        ...errors,
        general: `Failed to ${mode} train. Please try again.`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard
      title={mode === "create" ? "Create New Train" : "Edit Train"}
      description={
        mode === "create" ? "Enter train details" : "Update train information"
      }
    >
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <FormError error={errors.general || null} />

          <FormInput
            id="train_number"
            name="train_number"
            label="Train Number"
            placeholder="Enter train number"
            value={formData.train_number}
            onChange={handleChange}
            error={errors.train_number}
            disabled={isLoading}
            icon={Hash}
          />

          <FormInput
            id="departure_station"
            name="departure_station"
            label="Departure Station"
            placeholder="Enter departure station"
            value={formData.departure_station}
            onChange={handleChange}
            error={errors.departure_station}
            disabled={isLoading}
            icon={MapPin}
          />

          <FormInput
            id="arrival_station"
            name="arrival_station"
            label="Arrival Station"
            placeholder="Enter arrival station"
            value={formData.arrival_station}
            onChange={handleChange}
            error={errors.arrival_station}
            disabled={isLoading}
            icon={MapPin}
          />

          <FormInput
            id="departure_time"
            name="departure_time"
            label="Departure Time"
            type="datetime-local"
            value={new Date(formData.departure_time).toISOString().slice(0, 16)}
            onChange={handleChange}
            error={errors.departure_time}
            disabled={isLoading}
            icon={Clock}
          />

          <FormInput
            id="arrival_time"
            name="arrival_time"
            label="Arrival Time"
            type="datetime-local"
            value={new Date(formData.arrival_time).toISOString().slice(0, 16)}
            onChange={handleChange}
            error={errors.arrival_time}
            disabled={isLoading}
            icon={Clock}
          />

          <div className="space-y-2">
            <label htmlFor="status" className="text-sm font-medium">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="scheduled">Scheduled</option>
              <option value="delayed">Delayed</option>
              <option value="cancelled">Cancelled</option>
              <option value="departed">Departed</option>
              <option value="arrived">Arrived</option>
            </select>
            {errors.status && (
              <p className="text-sm text-red-500">{errors.status}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="type" className="text-sm font-medium">
              Type
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="express">Express</option>
              <option value="passenger">Passenger</option>
              <option value="freight">Freight</option>
            </select>
            {errors.type && (
              <p className="text-sm text-red-500">{errors.type}</p>
            )}
          </div>

          <FormInput
            id="platform"
            name="platform"
            label="Platform (Optional)"
            placeholder="Enter platform number"
            value={formData.platform || ""}
            onChange={handleChange}
            error={errors.platform}
            disabled={isLoading}
            icon={TrainIcon}
          />
        </CardContent>

        <AuthFooter
          isLoading={isLoading}
          submitText={mode === "create" ? "Create Train" : "Update Train"}
          loadingText={
            mode === "create" ? "Creating Train..." : "Updating Train..."
          }
        >
          <></>
        </AuthFooter>
      </form>
    </AuthCard>
  );
}
