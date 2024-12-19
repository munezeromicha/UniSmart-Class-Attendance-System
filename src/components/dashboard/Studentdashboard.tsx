import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import QrScanner from "qr-scanner";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

export default function StudentDashboard() {
  const [scanning, setScanning] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const { user } = useAuth();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scannerRef = useRef<QrScanner | null>(null);
  

  useEffect(() => {
    if (activeTab === "scan") {
      if (!scannerRef.current && videoRef.current) {
        scannerRef.current = new QrScanner(
          videoRef.current,
          (result) => {
            if (!scanning) {
              handleQRScan(result.data);
            }
          },
          { highlightScanRegion: true }
        );

        scannerRef.current
          .start()
          .then(() => {
            console.log("QR scanner started successfully");
          })
          .catch((error) => {
            console.error("Failed to start QR scanner:", error);
            toast.error("Unable to access camera. Please check permissions.");
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

  const validateQRData = (data: any): data is QRData => {
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
  const stopScanner = () => {
    setScanning(false);
    if (scannerRef.current) {
      scannerRef.current.destroy();
      scannerRef.current = null;
    }
  };

  const checkTimeAndRegister = async (qrData: any) => {
    const currentTime = new Date();
    const hours = currentTime.getHours();
    if (hours >= 9 && hours < 11) {
      await registerAttendance(qrData);
    }
    else if (hours >= 11 && hours <= 12) {
      await secondAttendance(qrData);
    } else {
      toast.error("attendance taken between 9:00am-12am");
      return;
    }
  };

  const registerAttendance = async (qrData: any) => {
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
          stopScanner();
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
  const secondAttendance = async (qrData: any) => {
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
        stopScanner();
        
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
console.log(user?.class,'data from user')
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex space-x-4 mb-4">
        <button
          className={`py-2 px-4 rounded-t-lg ${
            activeTab === "profile"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveTab("profile")}
        >
          Profile
        </button>
        <button
          className={`py-2 px-4 rounded-t-lg ${
            activeTab === "scan"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveTab("scan")}
        >
          Scan QR Code
        </button>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        {activeTab === "profile" ? (
          <div>
            <h1>Welcome, {user?.firstName} {user?.lastName}</h1>
            <h3>Email: {user?.email}</h3>
            <h3>Department: {user?.department}</h3>
            <h3>Class: {user?.class}</h3>
            <h3>Registration Number: {user?.registrationNumber}</h3>

          </div>
        ) : (
          <div className="text-center">
            <video ref={videoRef} className="w-full rounded-lg" />
            <p>
              {scanning ? "Processing..." : "Align the QR code in the frame"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
