"use client";

import { useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { TrainTable } from "@/components/train/TrainTable";
import { deleteTrain } from "@/lib/api";
import { getUserInfo } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function SchedulePage() {
  const [error, setError] = useState<string | null>(null);
  const userInfo = getUserInfo();
  const isAdmin = userInfo?.is_admin ?? false;

  const handleDelete = async (id: string) => {
    try {
      await deleteTrain(id);
    } catch (err) {
      setError("Failed to delete train");
      console.error("Error deleting train:", err);
    }
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Train Schedule</h1>
          {isAdmin && (
            <Link href="/admin/train/create">
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add New Train
              </Button>
            </Link>
          )}
        </div>
        {error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <TrainTable isAdmin={isAdmin} onDelete={handleDelete} />
        )}
      </div>
    </ProtectedRoute>
  );
}
