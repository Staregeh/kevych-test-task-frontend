"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronUp,
  Search,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getTrains, type TrainFilters } from "@/lib/api";

export type Train = {
  id: string;
  train_number: string;
  departure_station: string;
  arrival_station: string;
  departure_time: Date;
  arrival_time: Date;
  status: "scheduled" | "delayed" | "cancelled" | "departed" | "arrived";
  type: "express" | "passenger" | "freight";
  platform?: string;
};

interface TrainTableProps {
  isAdmin?: boolean;
  onDelete?: (id: string) => void;
}

export function TrainTable({ isAdmin = false, onDelete }: TrainTableProps) {
  const [trains, setTrains] = useState<Train[]>([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof Train>("departure_time");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isLoading, setIsLoading] = useState(false);

  // Handle sort click
  const handleSort = (field: keyof Train) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const fetchTrains = async () => {
    setIsLoading(true);
    try {
      const filters: TrainFilters = {
        search: searchTerm,
        page: currentPage,
        limit: pageSize,
        sortField,
        sortDirection,
      };
      const response = await getTrains(filters);
      setTrains(response.data);
      setTotal(response.total);
    } catch (error) {
      console.error("Error fetching trains:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrains();
  }, [currentPage, pageSize, sortField, sortDirection, searchTerm]);

  const totalPages = Math.ceil(total / pageSize);

  const SortIndicator = ({ field }: { field: keyof Train }) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  const getStatusColor = (status: Train["status"]) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-500";
      case "delayed":
        return "bg-yellow-500";
      case "cancelled":
        return "bg-red-500";
      case "departed":
        return "bg-green-500";
      case "arrived":
        return "bg-green-700";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search trains..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("train_number")}
              >
                <div className="flex items-center">
                  Train #
                  <SortIndicator field="train_number" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("departure_station")}
              >
                <div className="flex items-center">
                  From
                  <SortIndicator field="departure_station" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("arrival_station")}
              >
                <div className="flex items-center">
                  To
                  <SortIndicator field="arrival_station" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("departure_time")}
              >
                <div className="flex items-center">
                  Departure
                  <SortIndicator field="departure_time" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("arrival_time")}
              >
                <div className="flex items-center">
                  Arrival
                  <SortIndicator field="arrival_time" />
                </div>
              </TableHead>
              <TableHead>Platform</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center">
                  Status
                  <SortIndicator field="status" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("type")}
              >
                <div className="flex items-center">
                  Type
                  <SortIndicator field="type" />
                </div>
              </TableHead>
              {isAdmin && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={isAdmin ? 9 : 8}
                  className="text-center py-8 text-gray-500"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : trains.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={isAdmin ? 9 : 8}
                  className="text-center py-8 text-gray-500"
                >
                  No trains found
                </TableCell>
              </TableRow>
            ) : (
              trains.map((train) => (
                <TableRow key={train.id}>
                  <TableCell className="font-medium">
                    {train.train_number}
                  </TableCell>
                  <TableCell>{train.departure_station}</TableCell>
                  <TableCell>{train.arrival_station}</TableCell>
                  <TableCell>
                    {new Date(train.departure_time).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {new Date(train.arrival_time).toLocaleString()}
                  </TableCell>
                  <TableCell>{train.platform || "-"}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(train.status)}>
                      {train.status.charAt(0).toUpperCase() +
                        train.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="capitalize">{train.type}</TableCell>
                  {isAdmin && (
                    <TableCell>
                      <div className="flex space-x-2">
                        <Link href={`/admin/train/edit/${train.id}`} passHref>
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => onDelete && onDelete(train.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing {trains.length} of {total} trains
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
