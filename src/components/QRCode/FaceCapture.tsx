import { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';

interface FaceCaptureProps {
  onCapture: (image: string) => void;
}

export default function FaceCapture({ onCapture }: FaceCaptureProps) {
  const webcamRef = useRef<Webcam>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const capture = useCallback(() => {
    setIsCapturing(true);
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      onCapture(imageSrc);
    }
    setIsCapturing(false);
  }, [onCapture]);

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="rounded-lg"
          videoConstraints={{
            width: 320,
            height: 240,
            facingMode: "user"
          }}
        />
        <div className="absolute inset-0 border-4 border-primary-500 rounded-lg pointer-events-none" />
      </div>
      <button
        onClick={capture}
        disabled={isCapturing}
        className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {isCapturing ? 'Capturing...' : 'Capture Photo'}
      </button>
    </div>
  );
}