import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  _id: string;
  //   name: string;
  email: string;
  role: "student" | "faculty" | "admin";
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: any) => Promise<void>;
  signup: (formData: SignupFormData) => Promise<void>;
  isAuthenticated: boolean;
}

interface SignupFormData {
  email: string;
  password: string;
  fullName: string;
  studentId: string;
  role: "student" | "teacher";
  confirmPassword?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const storedUser = localStorage.getItem("user");

        if (token && storedUser) {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        } else {
          // Clear everything if token is missing
          localStorage.removeItem("user");
          localStorage.removeItem("access_token");
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        // Clear everything on error
        localStorage.removeItem("user");
        localStorage.removeItem("access_token");
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const userData = await response.json();

      // Store the access token
      localStorage.setItem("access_token", userData.token);

      const user: User = {
        _id: userData.user._id,
        email: userData.user.email,
        role: userData.user.role,
      };

      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem("access_token");

      // Make API call to logout
      await fetch("https://wizzy-africa-backend.onrender.com/api/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      // Always clear local storage and state, even if API call fails
      localStorage.removeItem("user");
      localStorage.removeItem("access_token");
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const updateUserProfile = async (data: Partial<User>) => {
    try {
      // Make API call to update user profile
      const response = await fetch("YOUR_API_ENDPOINT/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Profile update failed");
      }

      if (!user) return;
      const updatedUser: User = {
        _id: user._id,
        // name: data.name ?? user.name,
        email: data.email ?? user.email,
        role: data.role ?? user.role,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error("Profile update failed:", error);
      throw error;
    }
  };
  const BACKEND_URL = process.env.BACKEND_URL;
  console.log(BACKEND_URL, "backend url");

  const signup = async (formData: SignupFormData) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          studentId: formData.studentId,
          role: formData.role,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Parse the error response
        throw new Error(errorData.message || "Signup failed");
      }

      const userData = await response.json();
      const newUser: User = {
        _id: userData._id,
        email: formData.email,
        role: formData.role === "teacher" ? "faculty" : "student",
      };

      localStorage.setItem("user", JSON.stringify(newUser));
      localStorage.setItem("token", userData.token); // If your API returns a token
      setUser(newUser);
    } catch (error) {
      console.error("Signup failed:", error);

      if (error instanceof Error) {
        throw new Error(error.message);
      }

      throw new Error("An unknown error occurred.");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        updateUserProfile,
        signup,
        isAuthenticated,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
