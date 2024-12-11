import { useState, useRef } from "react";
import { useAuth } from "../../hooks/useAuth";
import { BrowserQRCodeReader } from "@zxing/browser";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


interface QRScanResult {
  text: string;
  rawBytes: Uint8Array;
  numBits: number;
  resultPoints: any[];
  format: string;
  timestamp: number;
  resultMetadata: any;
}

export default function StudentDashboard() {
  const [webScan, setWebScan] = useState<QRScanResult | null>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const { user } = useAuth();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const codeReader = useRef<BrowserQRCodeReader | null>(null);

  const camScan = (result: any) => {
    if (result) {
      console.log("QR Code Data:", result);
      setWebScan(result);

      try {
        const qrData = JSON.parse(result.text);
        if (validateQRData(qrData)) {
          checkTimeAndRegister(qrData);
        } else {
          alert("Invalid QR Code data.");
        }
      } catch (error) {
        console.error("Failed to parse QR code data:", error);
        alert("Invalid QR Code format.");
      }
    }
  };

  const camError = (error: any) => {
    if (error) {
      console.error("QR Reader Error:", error);
      toast.error( "An error occurred while accessing the camera. Please check your permissions.")
     
    }
  };

  const startCamera = async () => {
    setCameraOn(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        codeReader.current = new BrowserQRCodeReader();
        codeReader.current.decodeFromVideoDevice(
          undefined,
          videoRef.current,
          (result, error) => {
            if (result) {
              camScan(result);
            }
            if (error && !(error instanceof Error)) {
              camError(error);
            }
          }
        );
      }
    } catch (err) {
      console.error("Error accessing the camera:", err);
      toast.error( "Unable to access the camera. Please check your permissions.")
    
    }
  };

  const stopCamera = () => {
    setCameraOn(false);
    setWebScan(null);
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };
  const validateQRData = (qrData: any) => {
    return (
      qrData?.attendenceOwner &&
      qrData?.College &&
      qrData?.Department &&
      qrData?.Class &&
      qrData?.module
    );
  };

  const checkTimeAndRegister = async (qrData: any) => {
    const currentTime = new Date();
    const hours = currentTime.getHours();
    if (hours >= 9 && hours <= 19) {
      await registerAttendance(qrData);
    } else {
      toast.error( "Attendance can only be registered between 9:00 AM and 19am AM.")
   
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
      
        toast.success( "Attendance successfully registered!")
   
      } else {
        console.error("Error registering attendance:", result);
        toast.error( "Failed to register attendance. Please try again.")
  
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error( "An error occurred while registering attendance. Please try again.")
    
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ToastContainer />
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
                <video ref={videoRef} width="400px" height="auto" />
                <button
                  onClick={stopCamera}
                  className="mt-4 bg-red-500 text-white py-2 px-4 rounded"
                >
                  Stop Camera
                </button>
                <p>
                  {webScan?.text ? `QR Code: ${webScan.text}` : "Scanning..."}
                </p>
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
