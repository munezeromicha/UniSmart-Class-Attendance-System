import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../context/ThemeContext";
export default function StudentDashboard() {
  const { theme } = useTheme();
  const { user } = useAuth();

  return (
    <div
      className={`min-h-screen  py-12 sm:px-6 lg:px-8 ${
        theme === "dark" ? "bg-background-dark" : "bg-background-light"
      }`}
    >
      <div
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${
          theme === "dark" ? "bg-background-dark" : "bg-background-light"
        }`}
      >
        <div
          className={`
          rounded-xl p-6
          ${
            theme === "dark"
              ? "bg-gray-800 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.3)]"
              : "bg-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.1)]"
          }
        `}
        >
          <h1
            className={`text-2xl font-bold text-gray-900 mb-4 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Welcome, {user?.firstName} {user?.lastName}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div
              className={`
              rounded-lg p-6 transition-all duration-300
              ${
                theme === "dark"
                  ? "bg-gray-700 shadow-[0_4px_15px_-2px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_25px_-5px_rgba(0,0,0,0.3)]"
                  : "bg-white shadow-[0_4px_15px_-2px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_25px_-5px_rgba(0,0,0,0.1)]"
              }
            `}
            >
              <h2
                className={`text-lg font-semibold mb-4 ${
                  theme === "dark" ? "text-gray-100" : "text-gray-900"
                }`}
              >
                Your Information
              </h2>
              <div className="space-y-2">
                <p
                  className={`text-sm text-gray-600 ${
                    theme === "dark" ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  <span
                    className={`font-medium ${
                      theme === "dark" ? "text-gray-100" : "text-gray-900"
                    }`}
                  >
                    Name:
                  </span>{" "}
                  <span
                    className={`${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {user?.firstName} {user?.lastName}
                  </span>
                </p>
                <p
                  className={`text-sm text-gray-600 ${
                    theme === "dark" ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  <span
                    className={`font-medium ${
                      theme === "dark" ? "text-gray-100" : "text-gray-900"
                    }`}
                  >
                    Email:
                  </span>{" "}
                  <span
                    className={`${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {" "}
                    {user?.email}
                  </span>
                </p>
                <p
                  className={`text-sm text-gray-600 ${
                    theme === "dark" ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  <span
                    className={`font-medium ${
                      theme === "dark" ? "text-gray-100" : "text-gray-900"
                    }`}
                  >
                    Registration Number:
                  </span>{" "}
                  {user?.registrationNumber}
                </p>
                <p
                  className={`text-sm text-gray-600 ${
                    theme === "dark" ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  <span
                    className={`font-medium ${
                      theme === "dark" ? "text-gray-100" : "text-gray-900"
                    }`}
                  >
                    Department:
                  </span>{" "}
                  {user?.department}
                </p>
                <p
                  className={`text-sm text-gray-600 ${
                    theme === "dark" ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  <span
                    className={`font-medium ${
                      theme === "dark" ? "text-gray-100" : "text-gray-900"
                    }`}
                  >
                    Class:
                  </span>{" "}
                  {user?.class}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
