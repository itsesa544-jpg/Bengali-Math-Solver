import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CloseIcon } from './Icons';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (file: File) => void;
}

const CameraModal: React.FC<CameraModalProps> = ({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string>('');

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  }, [stream]);

  const startCamera = useCallback(async () => {
    // Reset state
    setCapturedImage(null);
    setError('');
    // Ensure previous stream is stopped before starting a new one
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError('ক্যামেরা চালু করা সম্ভব হয়নি। অনুগ্রহ করে অনুমতি পরীক্ষা করুন।');
    }
  }, [stream]);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(dataUrl);
        stopCamera();
      }
    }
  };

  const handleAccept = () => {
    if (canvasRef.current) {
      canvasRef.current.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
          onCapture(file);
          onClose();
        }
      }, 'image/jpeg', 0.95);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    startCamera();
  };
  
  const handleClose = () => {
      stopCamera();
      onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4" aria-modal="true" role="dialog">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col relative">
        <button onClick={handleClose} className="absolute top-2 right-2 z-20 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75" aria-label="Close camera">
            <CloseIcon className="h-6 w-6" />
        </button>

        <div className="flex-grow flex items-center justify-center overflow-hidden bg-black rounded-t-lg">
          {error && <p className="text-white text-center p-4">{error}</p>}
          {!error && (
            <div className="relative w-full h-full">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className={`w-full h-full object-contain ${capturedImage ? 'hidden' : 'block'}`}
              />
              {capturedImage && (
                <img src={capturedImage} alt="Captured preview" className="w-full h-full object-contain" />
              )}
              <canvas ref={canvasRef} className="hidden" aria-hidden="true" />
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-100 rounded-b-lg flex justify-center items-center gap-4">
          {capturedImage ? (
            <>
              <button onClick={handleRetake} className="px-6 py-2 border border-slate-300 text-sm font-semibold rounded-md shadow-sm text-slate-700 bg-white hover:bg-slate-50">
                Retake
              </button>
              <button onClick={handleAccept} className="px-6 py-2 border border-transparent text-sm font-semibold rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                Use Photo
              </button>
            </>
          ) : (
            <button
              onClick={handleCapture}
              disabled={!stream || !!error}
              className="w-16 h-16 rounded-full bg-white border-4 border-slate-300 hover:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              aria-label="Take picture"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CameraModal;
