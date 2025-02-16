import { useState } from 'react';
import { FileItem } from '@/utils/types';
import Image from 'next/image';

interface FilePreviewProps {
  file: FileItem;
  onClose: () => void;
}

export default function FilePreview({ file, onClose }: FilePreviewProps) {
  const [loading, setLoading] = useState(true);

  const isImage = ['jpg', 'jpeg', 'png', 'gif'].includes(file.extension?.toLowerCase() || '');
  const isText = ['txt', 'md', 'json', 'js', 'ts', 'html', 'css'].includes(
    file.extension?.toLowerCase() || ''
  );

  const renderPreview = () => {
    if (isImage) {
      return (
        <div className="relative w-full h-full">
          <Image
            src={`/api/files/preview?path=${file.path}`}
            alt={file.name}
            layout="fill"
            objectFit="contain"
            onLoadingComplete={() => setLoading(false)}
          />
        </div>
      );
    }

    if (isText) {
      return (
        <iframe
          src={`/api/files/preview?path=${file.path}`}
          className="w-full h-full border-0"
          onLoad={() => setLoading(false)}
        />
      );
    }

    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Không thể xem trước file này</p>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-4/5 h-4/5 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-medium">{file.name}</h3>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        
        <div className="flex-1 overflow-auto p-4">
          {loading && (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          )}
          {renderPreview()}
        </div>
      </div>
    </div>
  );
} 