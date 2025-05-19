import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    username: string;
    is_admin: boolean;
  };
}

interface LoginCredentials {
  username: string;
  password: string;
}

export const login = async (credentials: LoginCredentials): Promise<string> => {
  try {
    const response = await axios.post<LoginResponse>(
      `${API_URL}/auth/login`,
      credentials
    );
    const { access_token, user } = response.data;

    // Store the token and user info in localStorage
    localStorage.setItem("authToken", access_token);
    localStorage.setItem("userInfo", JSON.stringify(user));

    return access_token;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("userInfo");
  window.location.href = "/login";
};

export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("authToken");
};

export const getUserInfo = () => {
  if (typeof window === "undefined") return null;
  const userInfo = localStorage.getItem("userInfo");
  return userInfo ? JSON.parse(userInfo) : null;
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};
