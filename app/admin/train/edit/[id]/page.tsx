"use client";

import { Suspense, use, useEffect, useState } from "react";
import TrainForm from "@/components/forms/TrainForm";
import { getTrain } from "@/lib/api";
import type { Train } from "@/components/train/TrainTable";
import { Skeleton } from "@/components/ui/skeleton";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { getUserInfo } from "@/lib/auth";
import { useRouter } from "next/navigation";

function TrainEditContent({ id }: { id: string }) {
  const router = useRouter();
  const userInfo = getUserInfo();
  const isAdmin = userInfo?.is_admin ?? false;
  const [train, setTrain] = useState<Train | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdmin) {
      router.push("/schedule");
    }
  }, [isAdmin, router]);

  useEffect(() => {
    const fetchTrain = async () => {
      try {
        const trainData = await getTrain(id);
        trainData.arrival_time = new Date(trainData.arrival_time);
        trainData.departure_time = new Date(trainData.departure_time);
        setTrain(trainData);
      } catch (err) {
        setError("Failed to load train data. Please try again.");
        console.error("Error fetching train:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAdmin) {
      fetchTrain();
    }
  }, [id, isAdmin]);

  if (!isAdmin) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-5 w-96 mt-2" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  if (error || !train) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-red-600">
            Error
          </h1>
          <p className="text-muted-foreground">{error || "Train not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Train</h1>
        <p className="text-muted-foreground">Update train information</p>
      </div>

      <TrainForm mode="edit" initialData={train} />
    </div>
  );
}

export default function EditTrainPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return (
    <ProtectedRoute>
      <Suspense
        fallback={
          <div className="space-y-6">
            <div>
              <Skeleton className="h-9 w-64" />
              <Skeleton className="h-5 w-96 mt-2" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        }
      >
        <TrainEditContent id={id} />
      </Suspense>
    </ProtectedRoute>
  );
}
