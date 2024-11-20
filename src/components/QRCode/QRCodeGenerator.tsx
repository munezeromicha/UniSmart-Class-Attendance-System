import { useState, useEffect } from 'react';
import { QRCodeCanvas as QRCode } from 'qrcode.react';

interface QRCodeGeneratorProps {
  classId: string;
  sessionId: string;
}

const QRCodeGenerator = ({ classId, sessionId }: QRCodeGeneratorProps) => {
  const [qrValue, setQrValue] = useState('');

  useEffect(() => {
    // Create a structured data object
    const qrData = {
      type: 'attendance',
      classId,
      sessionId,
      timestamp: Date.now(),
    };

    // Convert to JSON string
    setQrValue(JSON.stringify(qrData));
  }, [classId, sessionId]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Class QR Code</h2>
      <div className="flex justify-center mb-4">
        <div className="p-4 bg-white rounded-lg border-2 border-gray-200">
        <QRCode 
  value={qrValue} 
  size={300} // Increased size
  level="Q" // Changed error correction level (L, M, Q, H)
  includeMargin={true}
  bgColor="#FFFFFF"
  fgColor="#000000"
/>
        </div>
      </div>
      <p className="text-center text-gray-600">
        Show this QR code to your students to mark attendance
      </p>
    </div>
  );
};

export default QRCodeGenerator;