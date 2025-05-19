import axios from "axios";
import { Train } from "@/components/train/TrainTable";
import { getAuthToken } from "./auth";

// Create an axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor for auth
api.interceptors.request.use(
  (config) => {
    // Add auth token to header if it exists
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token is invalid or expired
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface TrainFilters {
  search?: string;
  status?: Train["status"];
  type?: Train["type"];
  page?: number;
  limit?: number;
  sortField?: keyof Train;
  sortDirection?: "asc" | "desc";
}

/**
 * Get all trains with pagination and filtering
 */
export async function getTrains(
  filters?: TrainFilters
): Promise<PaginatedResponse<Train>> {
  try {
    const params = new URLSearchParams();

    if (filters?.search) params.append("search", filters.search);
    if (filters?.status) params.append("status", filters.status);
    if (filters?.type) params.append("type", filters.type);
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());
    if (filters?.sortField) params.append("sort_by", filters.sortField);
    if (filters?.sortDirection)
      params.append("sort_order", filters.sortDirection);

    const response = await api.get(`/trains?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching trains:", error);
    throw error;
  }
}

/**
 * Get a single train by ID
 */
export async function getTrain(id: string): Promise<Train> {
  try {
    const response = await api.get(`/trains/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching train ${id}:`, error);
    throw error;
  }
}

/**
 * Create a new train
 */
export async function createTrain(
  trainData: Omit<Train, "id">
): Promise<Train> {
  try {
    const response = await api.post("/trains", trainData);
    return response.data;
  } catch (error) {
    console.error("Error creating train:", error);
    throw error;
  }
}

/**
 * Update an existing train
 */
export async function updateTrain(
  id: string,
  trainData: Partial<Train>
): Promise<Train> {
  try {
    const response = await api.patch(`/trains/${id}`, trainData);
    return response.data;
  } catch (error) {
    console.error(`Error updating train ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a train
 */
export async function deleteTrain(id: string): Promise<boolean> {
  try {
    await api.delete(`/trains/${id}`);
    return true;
  } catch (error) {
    console.error(`Error deleting train ${id}:`, error);
    throw error;
  }
}

export default api;
