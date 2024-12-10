import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import ReactQrReader from "react-qr-reader";

export default function StudentDashboard() {
  const [webScan, setWebScan] = useState(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const { user } = useAuth();


  const camScan = (result: any) => {
    if (result) {
      setWebScan(result);
      checkTimeAndRegister(result);
    }
  };

  const camError = (error: any) => {
    if (error) {
      console.error("QR Reader Error:", error);
      alert(
        "An error occurred while accessing the camera. Please check your permissions."
      );
    }
  };

  const startCamera = () => {
    setCameraOn(true);
  };

  const stopCamera = () => {
    setCameraOn(false);
    setWebScan(null);
  };

  const checkTimeAndRegister = async (qrData: any) => {
    const currentTime = new Date();
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    if (hours >= 21 && minutes >= 0 && hours <= 23 && minutes <= 59) {
      await registerAttendance(qrData);
    } else {
      console.log(
        "Attendance can only be registered between 9:00 PM and 11:00 PM."
      );
    }
  };

  const registerAttendance = async (qrData: any) => {
    try {
      const response = await fetch("/api/attendence/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrData, start: true }),
      });
      const result = await response.json();
      console.log("Attendance Registered:", result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex space-x-4 mb-4">
        <button
          className={`py-2 px-2 border-b-2 ${
            activeTab === "profile"
              ? "text-blue-500 border-blue-500"
              : "text-gray-700 border-transparent"
          }`}
          onClick={() => setActiveTab("profile")}
        >
          Profile
        </button>
        <button
          className={`py-2 px-2  border-b-2 ${
            activeTab === "scan"
              ? "text-blue-500 border-blue-500"
              : "text-gray-700 border-transparent"
          }`}
          onClick={() => setActiveTab("scan")}
        >
          Scan QR Code
        </button>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        {activeTab === "profile" && (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Welcome, {user?.firstName}
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Your Information
                </h2>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Name:</span> {user?.firstName}{" "}
                    {user?.lastName}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Email:</span> {user?.email}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Registration Number:</span>{" "}
                    {user?.registrationNumber}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Department:</span>{" "}
                    {user?.department}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Class:</span> {user?.class}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === "scan" && (
          <>
            {cameraOn ? (
              <>
                <ReactQrReader
                  delay={300}
                  onScan={camScan}
                  onError={camError}
                  style={{ width: '300px', height: '300px' }}
                />
                <button
                  onClick={stopCamera}
                  className="mt-4 bg-red-500 text-white py-2 px-4 rounded"
                >
                  Stop Camera
                </button>
              </>
            ) : (
              <button
                onClick={startCamera}
                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded m-auto"
              >
                Start Camera
              </button>
            )}
           
          </>
        )}
      </div>
    </div>
  );
}
