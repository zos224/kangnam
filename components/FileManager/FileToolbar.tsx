import { useState } from 'react';
import { FileManagerState } from '@/utils/types';
import { FiGrid, FiList, FiPlus, FiUpload } from 'react-icons/fi';

interface FileToolbarProps {
  state: FileManagerState;
  onCreateFolder: (name: string) => void;
  onViewChange: (view: 'grid' | 'list') => void;
  onSortChange: (sortBy: 'name' | 'date' | 'size', sortOrder: 'asc' | 'desc') => void;
  onUploadFiles: (files: FileList) => void;
}

export default function FileToolbar({
  state,
  onCreateFolder,
  onViewChange,
  onSortChange,
  onUploadFiles
}: FileToolbarProps) {
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName.trim());
      setNewFolderName('');
      setShowNewFolderDialog(false);
    }
  };

  return (
    <div className="flex items-center p-4 border-b">
      <div className="flex space-x-2">
        <button
          className="p-2 hover:bg-gray-100 rounded border "
          onClick={() => setShowNewFolderDialog(true)}
        >
          <FiPlus className="w-5 h-5" />
        </button>

        <label className="p-2 hover:bg-gray-100 rounded cursor-pointer border">
          <FiUpload className="w-5 h-5" />
          <input
            type="file"
            className="hidden"
            multiple
            onChange={(e) => e.target.files && onUploadFiles(e.target.files)}
          />
        </label>
      </div>

      <div className="ml-3 flex items-center space-x-4">
        <select
          className="border rounded p-1"
          value={`${state.sortBy}-${state.sortOrder}`}
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split('-') as [
              'name' | 'date' | 'size',
              'asc' | 'desc'
            ];
            onSortChange(sortBy, sortOrder);
          }}
        >
          <option value="name-asc">Tên A-Z</option>
          <option value="name-desc">Tên Z-A</option>
          <option value="date-desc">Mới nhất</option>
          <option value="date-asc">Cũ nhất</option>
          <option value="size-desc">Kích thước giảm dần</option>
          <option value="size-asc">Kích thước tăng dần</option>
        </select>

        <div className="flex border rounded">
          <button
            className={`p-2 ${state.view === 'grid' ? 'bg-gray-100' : ''}`}
            onClick={() => onViewChange('grid')}
          >
            <FiGrid className="w-5 h-5" />
          </button>
          <button
            className={`p-2 ${state.view === 'list' ? 'bg-gray-100' : ''}`}
            onClick={() => onViewChange('list')}
          >
            <FiList className="w-5 h-5" />
          </button>
        </div>
      </div>

      {showNewFolderDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-lg">
            <h3 className="text-lg font-medium mb-4">Tạo thư mục mới</h3>
            <input
              type="text"
              className="border rounded p-2 w-full mb-4"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Tên thư mục"
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 text-gray-600"
                onClick={() => setShowNewFolderDialog(false)}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={handleCreateFolder}
              >
                Tạo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 