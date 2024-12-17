import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { QRCodeCanvas } from "qrcode.react";
import { io } from "socket.io-client";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
interface Location {
  latitude: number;
  longitude: number;
}
export default function LecturerDashboard() {
  const [attendances, setAttendances] = useState<any[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedCollege, setSelectedCollege] = useState<string>("");
  const [selectedSchool, setSelectedSchool] = useState<string>("");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [qrData, setQrData] = useState<string>("");
  const [selectedModule, setSelectedModule] = useState<string>("");
  const [showForm, setShowForm] = useState<boolean>(true);
  const [location, setLocation] = useState<Location | null>(null);
  const [qrUpdateTimer, setQrUpdateTimer] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);
  interface QRData {
    attendenceOwner: string;
    College: string;
    School: string;
    Department: string;
    Class: string;
    module: string;
  }

  const { user } = useAuth();

  const collegesWithSchools = {
    "College of Science and Technology (CST)": [
      "School of Engineering",
      "School of Science",
      "School of Architecture and Built Environment",
    ],
    "College of Business and Economics (CBE)": [
      "School of Business",
      "School of Economics",
    ],
  };

  const schoolsWithDepartments = {
    "School of Engineering": [
      "Civil Engineering",
      "Mechanical Engineering",
      "Electrical Engineering",
    ],
    "School of Science": ["Physics", "Chemistry", "Biology"],
    "School of Architecture and Built Environment": [
      "Urban Planning",
      "Architecture",
      "Construction Management",
    ],
    "School of Business": ["Accounting", "Marketing", "Management"],
    "School of Economics": ["Microeconomics", "Macroeconomics"],
  };

  const departmentsWithClasses = {
    "Civil Engineering": ["level1", "level2", "level3"],
    "Mechanical Engineering": ["level1", "level2"],
    Physics: ["level1", "level2"],
    Accounting: ["level1", "level2"],
  };

  const handleCollegeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCollege(e.target.value);
    setSelectedSchool("");
    setSelectedDepartment("");
    setSelectedClass("");
    setQrData("");
  };

  const handleSchoolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSchool(e.target.value);
    setSelectedDepartment("");
    setSelectedClass("");
    setQrData("");
  };

  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDepartment(e.target.value);
    setSelectedClass("");
    setQrData("");
  };
  const attendenceOwner = localStorage.getItem("token");
  const generateQRData = () => {
    if (!location) return;
    const qrCodeData = {
      attendenceOwner: attendenceOwner,
      College: selectedCollege,
      School: selectedSchool,
      Department: selectedDepartment,
      Class: selectedClass,
      module: selectedModule,
      latitude: location.latitude,
      longitude: location.longitude,
      timestamp: new Date().toISOString(),
    };

    setQrData(JSON.stringify(qrCodeData));
  };

  useEffect(() => {
    const updateLocation = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            console.error("Error getting location:", error);
            toast.error(
              "Please enable location services to create attendance QR code."
            );
          },
          {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 0,
          }
        );
      } else {
        toast.error("Geolocation is not supported by your browser");
      }
    };

    updateLocation();

    const locationInterval = setInterval(updateLocation, 30000);

    return () => {
      clearInterval(locationInterval);
      if (qrUpdateTimer) {
        clearInterval(qrUpdateTimer);
      }
    };
  }, []);

  useEffect(() => {
    const socket = io("http://localhost:5000");

    if (qrData) {
      const fetchTodaysAttendances = async () => {
        try {
          const parsedQrData: QRData = JSON.parse(qrData);
          const level = parsedQrData.Class;
          const response = await fetch(
            `http://localhost:5000/api/attendence/class/${level}/today`
          );
          if (response.ok) {
            const result = await response.json();
            console.log(result.data, "data from attendance");
            setAttendances(result.data);
            setLoading(false);
          } else {
            setError("Failed to fetch attendances");
            setLoading(false);
          }
        } catch (error) {
          console.error("Error fetching attendance:", error);
          setError("An error occurred while fetching attendance");
          setLoading(false);
        }
      };

      fetchTodaysAttendances();
    }

    socket.on("attendanceCreated", (newAttendance) => {
      console.log("New attendance received:", newAttendance);
      setAttendances((prev) => [...prev, newAttendance]); // Append new attendance
    });

    socket.on("attendanceUpdated", (updatedAttendance) => {
      console.log("Updated attendance received:", updatedAttendance);
      setAttendances((prev) =>
        prev.map((attendance) =>
          attendance.studentId === updatedAttendance.studentId
            ? { ...attendance, ...updatedAttendance }
            : attendance
        )
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [qrData]);
  const exportTodayAttendance = async () => {
    try {
      const parsedQrData: QRData = JSON.parse(qrData);
      const classId = parsedQrData.Class;
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/attendence/class/${classId}/export/today`
      );

      if (response.ok) {
        const contentType = response.headers.get("Content-Type");

        if (
          contentType?.includes(
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          )
        ) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);

          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "Attendance_Export.xlsx");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setLoading(false);
        } else {
          setError("Invalid file format.");
          setLoading(false);
        }
      } else {
        setError("Failed to fetch today's attendances");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching attendance:", error);
      setError("An error occurred while fetching attendance");
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!location) {
      toast.error("Please enable location services to generate QR code");
      return;
    }

    if (
      !selectedCollege ||
      !selectedSchool ||
      !selectedDepartment ||
      !selectedClass ||
      !selectedModule
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    generateQRData();
    setShowForm(false);

    const timer = setInterval(generateQRData, 60000);
    setQrUpdateTimer(timer);
  };

  return (
    <div className="max-w-7xl mx-auto bg-blue-50  px-4 sm:px-6 lg:px-8 py-8">
      <ToastContainer />
     
      
      <h1 className="text-2xl font-bold text-gray-900">
        Welcome, {user?.firstName}
      </h1>

      {showForm ? (
        <div className="bg-white shadow rounded-lg p-6 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Select College
            </label>
            <select
              value={selectedCollege}
              onChange={handleCollegeChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="" disabled>
                Select a College
              </option>
              {Object.keys(collegesWithSchools).map((college, index) => (
                <option key={index} value={college}>
                  {college}
                </option>
              ))}
            </select>

            {selectedCollege && (
              <>
                <label className="block text-sm font-medium text-gray-700 mt-4">
                  Select School
                </label>
                <select
                  value={selectedSchool}
                  onChange={handleSchoolChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="" disabled>
                    Select a School
                  </option>
                  {collegesWithSchools[
                    selectedCollege as keyof typeof collegesWithSchools
                  ].map((school, index) => (
                    <option key={index} value={school}>
                      {school}
                    </option>
                  ))}
                </select>
              </>
            )}

            {selectedSchool && (
              <>
                <label className="block text-sm font-medium text-gray-700 mt-4">
                  Select Department
                </label>
                <select
                  value={selectedDepartment}
                  onChange={handleDepartmentChange}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="" disabled>
                    Select a Department
                  </option>
                  {schoolsWithDepartments[
                    selectedSchool as keyof typeof schoolsWithDepartments
                  ].map((department, index) => (
                    <option key={index} value={department}>
                      {department}
                    </option>
                  ))}
                </select>
              </>
            )}

            {selectedDepartment && (
              <>
                <label className="block text-sm font-medium text-gray-700 mt-4">
                  Select Class
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="" disabled>
                    Select a Class
                  </option>
                  {departmentsWithClasses[
                    selectedDepartment as keyof typeof departmentsWithClasses
                  ].map((cls, index) => (
                    <option key={index} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
                <label className="block text-sm font-medium text-gray-700 mt-4">
                  Enter Module Name
                </label>
                <input
                  type="text"
                  placeholder="Enter module name"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={selectedModule}
                  onChange={(e) => setSelectedModule(e.target.value)}
                />
              </>
            )}

            {selectedClass && (
              <button
                onClick={handleSubmit}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Generate QR code
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="flex">
          <div className="flex items-center flex-col py-5">
            {/* <h2 className="text-lg text-gray-700 text-center">Generated QR Code</h2> */}
            <QRCodeCanvas value={qrData} size={300} />
          </div>
          <div className="w-[80%] px-4 relative top-[-24px]">
            <div className="flex w-full items-center justify-between">
              <div className="text-xl text-blue-500 mb-4 px-2">
                Today's Attendance
              </div>
              <button
                className="bg-blue-600 py-1 px-3 rounded-full text-white"
                onClick={exportTodayAttendance}
              >
                Export
              </button>
            </div>

            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <div>
                {attendances.length === 0 ? (
                  <p>No attendance records found for today.</p>
                ) : (
                  <ul>
                    {attendances.map((attendance) => (
                      <li
                        key={attendance._id}
                        className="border-b p-2 flex justify-between items-center"
                      >
                        <div className="flex gap-3">
                          <p className="font-medium">
                            {attendance.firstName} {attendance.lastName}
                          </p>
                          <p className="text-sm">{attendance.studentId}</p>

                          <p className="text-sm text-gray-500">
                            Status:{" "}
                            <span
                              className={`${
                                attendance.status === "absence"
                                  ? "text-red-500"
                                  : "text-green-500"
                              }`}
                            >
                              {attendance.status}
                            </span>
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">
                            Department: {attendance.department}
                          </p>
                          <p className="text-xs text-gray-500">
                            Class: {attendance.class}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
