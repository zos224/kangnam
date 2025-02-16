import { useEffect } from 'react';
import { FiCheck, FiX, FiAlertCircle } from 'react-icons/fi';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-4 right-4 flex items-center p-4 rounded-lg shadow-lg ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
      } text-white`}
    >
      {type === 'success' ? (
        <FiCheck className="w-5 h-5 mr-2" />
      ) : (
        <FiAlertCircle className="w-5 h-5 mr-2" />
      )}
      <span>{message}</span>
      <button
        className="ml-4 hover:text-gray-200"
        onClick={onClose}
      >
        <FiX className="w-4 h-4" />
      </button>
    </div>
  );
} 