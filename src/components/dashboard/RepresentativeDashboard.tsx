import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../hooks/useAuth";
import InviteUser from "../auth/InviteUser";
import { useTheme } from "../../context/ThemeContext";
import QrScanner from "qr-scanner";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  registrationNumber: string;
}
interface QRData {
  attendenceOwner: string;
  College: string;
  School: string;
  Department: string;
  Class: string;
  module: string;
  latitude: number;
  longitude: number;
  timestamp: string;
}

const MAX_DISTANCE = 50;
const QR_EXPIRY_TIME = 15 * 60 * 1000;

const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

export default function RepresentativeDashboard() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("invite");
  const [students, setStudents] = useState<Student[]>([]);
  const [scanning, setScanning] = useState(false);
  const [pendingAttendance, setPendingAttendance] = useState([]);
  const { user } = useAuth();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scannerRef = useRef<QrScanner | null>(null);

  const [departments] = useState([
    "Computer Science",
    "Engineering",
    "Business",
    "Medicine",
    "Law",
  ]);

  const [classes] = useState([
    "Level 1",
    "Level 2",
    "Level 3",
    "Level 4",
    "Level 5",
  ]);

  const checkTimeAndRegister = async (qrData: QRData) => {
    const currentTime = new Date();
    const hours = currentTime.getHours();
    if (hours >= 9 && hours < 11) {
      await registerAttendance(qrData);
    } else if (hours >= 11 && hours <= 12) {
      await secondAttendance(qrData);
    } else {
      toast.error("attendance taken between 9:00am-12am");
      return;
    }
  };

  const registerAttendance = async (qrData: QRData) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/attendence/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${qrData.attendenceOwner}`,
          },
          body: JSON.stringify({
            college: qrData.College,
            school: qrData.School,
            department: qrData.Department,
            class: qrData.Class,
            module: qrData.module,
            start: true,
            firstName: user?.firstName,
            lastName: user?.lastName,
            studentId: user?.registrationNumber,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success("Second attendance done successfully");
        if (result.data && result.data._id) {
          toast.success("Attendance successfully registered!");
          console.log(result.data, "data from scan qr code");
          localStorage.setItem("id", result.data._id);
        } else {
          console.error("No _id in the response data:", result);
          toast.error("Failed to register attendance. Please try again.");
        }
      } else {
        console.error("Error registering attendance:", result);
        toast.error("Failed to register attendance. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        "An error occurred while registering attendance. Please try again."
      );
    }
  };

  const secondAttendance = async (qrData: QRData) => {
    console.log("second attendance");
    const studentId = user?.registrationNumber;
    const id = localStorage.getItem("id");

    try {
      const response = await fetch(
        `http://localhost:5000/api/attendence/update/${studentId}/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${qrData.attendenceOwner}`,
          },
          body: JSON.stringify({
            college: qrData.College,
            school: qrData.School,
            department: qrData.Department,
            class: qrData.Class,
            module: qrData.module,
            start: false,
            end: true,
            firstName: user?.firstName,
            lastName: user?.lastName,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success("Second attendance done successfuly!");
      } else {
        console.error("Error updating attendance:", result);
        toast.error("Failed to update attendance. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        "An error occurred while updating attendance. Please try again."
      );
    }
  };

  const validateQRData = (data: QRData) => {
    return (
      typeof data.attendenceOwner === "string" &&
      typeof data.College === "string" &&
      typeof data.School === "string" &&
      typeof data.Department === "string" &&
      typeof data.Class === "string" &&
      typeof data.module === "string" &&
      typeof data.latitude === "number" &&
      typeof data.longitude === "number" &&
      typeof data.timestamp === "string"
    );
  };

  const handleQRScan = async (data: string) => {
    setScanning(true);
    try {
      const qrData: QRData = JSON.parse(data);

      if (!validateQRData(qrData)) {
        toast.error("Invalid QR code format.");
        return;
      }

      const qrTimestamp = new Date(qrData.timestamp).getTime();
      if (Date.now() - qrTimestamp > QR_EXPIRY_TIME) {
        toast.error("QR code has expired. Please use a valid QR code.");
        return;
      }

      const deviceLocation = {
        latitude: qrData.latitude,
        longitude: qrData.longitude,
      };

      const distance = calculateDistance(
        deviceLocation.latitude,
        deviceLocation.longitude,
        qrData.latitude,
        qrData.longitude
      );

      if (distance > MAX_DISTANCE) {
        toast.error(
          `You must be within ${MAX_DISTANCE} meters of the designated location.`
        );
        return;
      }

      await checkTimeAndRegister(qrData);
    } catch (error) {
      console.error("Error processing QR code:", error);
      toast.error("Failed to process QR code. Please try again.");
    } finally {
      setTimeout(() => setScanning(false), 2000);
    }
  };

  useEffect(() => {
    fetchClassmates();
    fetchPendingAttendance();
  }, []);

  useEffect(() => {
    if (activeTab === "attendance") {
      if (!scannerRef.current && videoRef.current) {
        scannerRef.current = new QrScanner(
          videoRef.current,
          (result) => {
            handleQRScan(result.data);
          },
          { highlightScanRegion: true }
        );

        scannerRef.current.start().catch((error) => {
          console.error("Failed to start QR scanner:", error);
          toast.error("Unable to access camera");
        });
      }

      return () => {
        if (scannerRef.current) {
          scannerRef.current.destroy();
          scannerRef.current = null;
        }
      };
    }
  }, [activeTab]);

  const fetchClassmates = async () => {
    try {
      const response = await fetch(`/api/classes/${user?.class}/students`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error("Failed to fetch classmates:", error);
    }
  };

  const fetchPendingAttendance = async () => {
    try {
      const response = await fetch(`/api/attendance/pending/${user?.class}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setPendingAttendance(data);
    } catch (error) {
      console.error("Failed to fetch pending attendance:", error);
    }
  };

  const approveAttendance = async (attendanceId: string) => {
    try {
      await fetch(`/api/attendance/approve/${attendanceId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("Attendance approved successfully");
      fetchPendingAttendance();
    } catch (error) {
      console.error("Failed to approve attendance:", error);
      toast.error("Failed to approve attendance");
    }
  };

  return (
    <div
      className={`min-h-screen w-full ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ToastContainer position="top-right" autoClose={3000} />

        <div className="mb-6 flex flex-col gap-2">
          <h1
            className={`text-2xl font-bold ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Class Representative Dashboard
          </h1>
          <p
            className={`${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Department: {user?.department}
          </p>
          <p
            className={`${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Class: {user?.class}
          </p>
          <p
            className={`${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Registration Number: {user?.registrationNumber}
          </p>
        </div>

        <div className="flex space-x-4 mb-6">
          {["invite", "attendance", "students", "approve"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab
                  ? "bg-blue-500 text-white"
                  : `${
                      theme === "dark"
                        ? "bg-gray-700 text-gray-300"
                        : "bg-gray-200 text-gray-700"
                    }`
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div
          className={`bg-white dark:bg-gray-800 rounded-lg shadow p-6 ${
            theme === "dark" ? "text-white" : "text-gray-900"
          }`}
        >
          {activeTab === "invite" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Invite Students</h2>
              <InviteUser
                role="STUDENT"
                departments={departments}
                classes={classes}
              />
            </div>
          )}

          {activeTab === "attendance" && (
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4">
                Scan Attendance QR Code
              </h2>
              <video
                ref={videoRef}
                className="w-full max-w-md mx-auto rounded-lg"
              />
              <p className="mt-4">
                {scanning ? "Processing..." : "Align the QR code in the frame"}
              </p>
            </div>
          )}

          {activeTab === "students" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Class Members</h2>
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {students.map((student) => (
                  <li key={student.id} className="py-4">
                    <div>
                      <h3 className="text-sm font-medium">
                        {student.firstName} {student.lastName}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {student.email}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Reg No: {student.registrationNumber}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === "approve" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Pending Attendance Approval
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Module
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Students Present
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {pendingAttendance.map(
                      (attendance: {
                        id: string;
                        date: string;
                        module: string;
                        presentCount: number;
                      }) => (
                        <tr key={attendance.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {new Date(attendance.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {attendance.module}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {attendance.presentCount}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => approveAttendance(attendance.id)}
                              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                            >
                              Approve
                            </button>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
