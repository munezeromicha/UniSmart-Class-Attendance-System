import { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { useAuth } from '../../context/AuthContext';
import FaceCapture from './FaceCapture';
const QRCodeScanner = () => {
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [qrData, setQrData] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { user } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    regNumber: '',
    notes: '',
    location: '',
  });

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { 
        fps: 10, 
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        formatsToSupport: [ Html5QrcodeSupportedFormats.QR_CODE ]
      },
      false
    );

    scanner.render(
      async (data) => {
        try {
          const parsedData = JSON.parse(data);
          
          // Validate QR code data
          if (parsedData.type !== 'attendance' || !parsedData.classId || !parsedData.sessionId) {
            throw new Error('Invalid QR code format');
          }

          setQrData(data);
          scanner.clear();
          setShowForm(true);
        } catch (err) {
          setError('Invalid QR code. Please scan a valid attendance QR code.');
        }
      },
      (err) => {
        // Don't show scanning errors to user
        console.error(err);
      }
    );

    return () => {
      scanner.clear();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!photo) {
      setError('Please capture your photo first');
      return;
    }

    if (!formData.fullName || !formData.regNumber) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const parsedQrData = JSON.parse(qrData);
      
      const attendanceData = {
        userId: user?._id,
        classId: parsedQrData.classId,
        sessionId: parsedQrData.sessionId,
        fullName: formData.fullName,
        regNumber: formData.regNumber,
        photo,
        timestamp: new Date().toISOString(),
      };

      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(attendanceData),
      });

      if (!response.ok) throw new Error('Failed to submit attendance');

      setResult('Attendance marked successfully!');
      setShowForm(false);
      setPhoto(null);
      setFormData({ 
        fullName: '',
        regNumber: '',
        notes: '', 
        location: '' 
      });
    } catch (err) {
      setError('Failed to mark attendance. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Scan Attendance QR Code</h2>
      
      {!showForm ? (
        <>
          <div id="reader" className="mb-4"></div>
          <p className="text-center text-gray-600">Please scan the attendance QR code</p>
        </>
      ) : (
        <div className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                id="fullName"
                type="text"
                required
                placeholder="Enter your full name"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                value={formData.fullName}
                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
              />
            </div>
            
            <div>
              <label htmlFor="regNumber" className="block text-sm font-medium text-gray-700">Registration Number</label>
              <input
                id="regNumber"
                type="text"
                required
                placeholder="Enter your registration number"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                value={formData.regNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, regNumber: e.target.value }))}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Take Photo</label>
              <FaceCapture onCapture={(imageSrc) => setPhoto(imageSrc)} />
            </div>

            <button
              type="submit"
              disabled={!photo || !formData.fullName || !formData.regNumber}
              className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {!photo ? 'Please Capture Photo First' : 'Submit Attendance'}
            </button>
          </form>
        </div>
      )}

      {result && (
        <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-md">
          {result}
        </div>
      )}
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
    </div>
  );
};

export default QRCodeScanner;