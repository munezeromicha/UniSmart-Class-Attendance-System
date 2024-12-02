import { useState, useEffect } from 'react';
import { QRCodeCanvas as QRCode } from 'qrcode.react';
import { useTheme } from '../../context/ThemeContext';

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

  const { theme } = useTheme(); 
  const dashboardStyles = {
    backgroundColor: theme === 'dark' ? '#0f0f0f' : '#f9fafb',
    color: theme === 'dark' ? '#ffffff' : '#000000', 
  };


  const qrBgColor = theme === 'dark' ? '#333333' : '#FFFFFF'; 
  const qrFgColor = theme === 'dark' ? '#FFFFFF' : '#000000'; 

  return (
    <div className="p-6 rounded-lg shadow-lg" style={dashboardStyles}>
      <h2 className="text-2xl font-bold mb-4" style={{ color: dashboardStyles.color }}>Class QR Code</h2>
      <div className="flex justify-center mb-4" style={dashboardStyles}>
        <div className="p-4 rounded-lg border-2 border-gray-200" style={{ backgroundColor: qrBgColor }}>
          <QRCode 
            value={qrValue} 
            size={300} // Increased size
            level="Q" // Changed error correction level (L, M, Q, H)
            includeMargin={true}
            bgColor={qrBgColor} // Set dynamic background color
            fgColor={qrFgColor} // Set dynamic foreground color
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
