import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../context/ThemeContext";
import { FaGraduationCap } from "react-icons/fa";

export default function Login() {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      console.log("Attempting login...");
      await login(formData.email, formData.password);
      console.log("Login successful");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Login failed. Please try again."
      );
    }
  };


  return (
    <div
      className={`min-h-screen ${
        theme === "dark"
          ? "bg-background-dark text-white"
          : "bg-background-light text-gray-800"
      } flex flex-col justify-center py-12 sm:px-6 lg:px-8`}
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <div className="flex flex-col items-center">
      <FaGraduationCap 
            className={`h-16 w-16 mb-4 ${
              theme === "dark" ? "text-white" : "text-gray-800"
            } animate-bounce hover:animate-pulse transition-all duration-300`} 
          />
          <h2
            className={`text-center text-3xl font-extrabold ${
              theme === "dark" ? "text-white" : "text-gray-800"
            }`}
          >
            Sign into your account
          </h2>
        </div>
      </div>

      <div className={`mt-8 sm:mx-auto sm:w-full sm:max-w-md`}>
        <div
          className={`
    py-8 px-4 sm:rounded-lg sm:px-10 
    ${
      theme === "dark"
        ? "bg-background-dark text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]"
        : "bg-background-light text-gray-800 shadow-[0_0_15px_rgba(0,0,0,0.1)]"
    }
    backdrop-blur-sm
    border ${theme === "dark" ? "border-gray-700" : "border-gray-200"}
  `}
        >
          {error && (
            <div
              className={`
        mb-4 px-4 py-3 rounded
        ${
          theme === "dark"
            ? "bg-red-900/50 border-red-700 text-red-200"
            : "bg-red-100 border-red-400 text-red-700"
        } border
      `}
            >
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className={`
          block text-sm font-medium 
          ${theme === "dark" ? "text-gray-200" : "text-gray-800"}
        `}
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                required
                className={`
            mt-1 block w-full px-3 py-2 rounded-md
            ${
              theme === "dark"
                ? "bg-gray-800 border-gray-600 text-white focus:border-indigo-500 focus:ring-indigo-500"
                : "bg-white border-gray-300 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500"
            }
            shadow-sm
            focus:outline-none focus:ring-2 focus:ring-offset-2
            transition-colors duration-200
          `}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className={`
          block text-sm font-medium 
          ${theme === "dark" ? "text-gray-200" : "text-gray-800"}
        `}
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={formData.password}
                required
                className={`
            mt-1 block w-full px-3 py-2 rounded-md
            ${
              theme === "dark"
                ? "bg-gray-800 border-gray-600 text-white focus:border-indigo-500 focus:ring-indigo-500"
                : "bg-white border-gray-300 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500"
            }
            shadow-sm
            focus:outline-none focus:ring-2 focus:ring-offset-2
            transition-colors duration-200
          `}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`
          w-full flex justify-center py-2 px-4 rounded-md
          text-sm font-medium text-white
          transition-all duration-200
          shadow-lg
          ${
            isLoading
              ? "bg-indigo-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-500/50"
          }
          ${
            theme === "dark"
              ? "shadow-[0_4px_12px_rgba(99,102,241,0.4)]"
              : "shadow-[0_4px_12px_rgba(99,102,241,0.2)]"
          }
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
          ${
            theme === "dark"
              ? "focus:ring-offset-gray-800"
              : "focus:ring-offset-white"
          }
        `}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
