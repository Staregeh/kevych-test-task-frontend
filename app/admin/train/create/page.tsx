"use client";

import TrainForm from "@/components/forms/TrainForm";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { getUserInfo } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CreateTrainPage() {
  const router = useRouter();
  const userInfo = getUserInfo();
  const isAdmin = userInfo?.is_admin ?? false;

  useEffect(() => {
    if (!isAdmin) {
      router.push("/schedule");
    }
  }, [isAdmin, router]);

  if (!isAdmin) {
    return null;
  }

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Create New Train
          </h1>
          <p className="text-muted-foreground">
            Add a new train to the schedule
          </p>
        </div>

        <TrainForm mode="create" />
      </div>
    </ProtectedRoute>
  );
}
