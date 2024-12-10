import { useState, useEffect } from "react";
import InviteUser from "../auth/InviteUser";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
interface HOD {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  status: "active" | "disabled";
}

export default function AdminDashboard() {
  const [hods, setHods] = useState<HOD[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [departments] = useState([
    "Computer Science",
    "Engineering",
    "Business",
    "Medicine",
    "Law",
  ]);

  useEffect(() => {
    fetchHODs();
  }, []);

  const fetchHODs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:5000/api/users/hods", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch HODs");
      }

      if (data.success && Array.isArray(data.data)) {
        setHods(data.data);
      } else {
        console.error("Unexpected data structure:", data);
        setHods([]);
      }
    } catch (error) {
      console.error("Failed to fetch HODs:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch HODs");
      setHods([]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleHODStatus = async (
    hodId: string,
    newStatus: "active" | "disabled"
  ) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${hodId}/toggle-status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update HOD status");
      }

      fetchHODs();
    } catch (error) {
      console.error("Failed to update HOD status:", error);
      setError(
        error instanceof Error ? error.message : "Failed to update HOD status"
      );
    }
  };

  const deleteHOD = async (hodId: string) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this HOD account? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/users/${hodId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete HOD");
      }

      toast.success("HOD account deleted successfully");
      fetchHODs(); // Refresh the list
    } catch (error) {
      console.error("Failed to delete HOD:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete HOD"
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Invite HOD
            </h2>
            <InviteUser departments={departments}
            role="HOD"
             />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Manage HODs
            </h2>

            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : (
              <div className="overflow-hidden">
                {hods.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {hods.map((hod) => (
                      <li key={hod._id || hod._id} className="py-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">
                              {hod.firstName} {hod.lastName}
                            </h3>
                            <p className="text-sm text-gray-500">{hod.email}</p>
                            <p className="text-sm text-gray-500">
                              {hod.department}
                            </p>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                hod.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {hod.status}
                            </span>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() =>
                                toggleHODStatus(
                                  hod._id,
                                  hod.status === "active"
                                    ? "disabled"
                                    : "active"
                                )
                              }
                              className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
                                hod.status === "active"
                                  ? "bg-red-600 hover:bg-red-700"
                                  : "bg-green-600 hover:bg-green-700"
                              }`}
                            >
                              {hod.status === "active" ? "Disable" : "Enable"}
                            </button>
                            <button
                              onClick={() => deleteHOD(hod._id)}
                              className="px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                              title="Delete HOD"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No HODs found</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
