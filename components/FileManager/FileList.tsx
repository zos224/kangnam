"use client"
import { FileItem } from '@/utils/types';
import { useMemo, useState } from 'react';
import { FileIcon, FolderIcon } from './Icons';
import ContextMenu from './ContextMenu';
import FilePreview from './FilePreview';

interface FileListProps {
  files: FileItem[];
  view: 'grid' | 'list';
  sortBy: 'name' | 'date' | 'size';
  sortOrder: 'asc' | 'desc';
  selectedItems: FileItem[];
  onSelect: (items: FileItem[]) => void;
  onNavigate: (path: string) => void;
  onDelete: (item: FileItem) => void;
  onRename: (item: FileItem, newName: string) => void;
  handleSelect: (url: string) => void;
}

export default function FileList({
  files,
  view,
  sortBy,
  sortOrder,
  selectedItems,
  onSelect,
  onNavigate,
  onDelete,
  onRename,
  handleSelect
}: FileListProps) {
  const [contextMenu, setContextMenu] = useState<{
    file: FileItem;
    position: { x: number; y: number };
  } | null>(null);
  
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);
  const [renameFile, setRenameFile] = useState<FileItem | null>(null);

  const sortedFiles = useMemo(() => {
    return [...files].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'date':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        case 'size':
          comparison = (a.size || 0) - (b.size || 0);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [files, sortBy, sortOrder]);

  const handleContextMenu = (e: React.MouseEvent, file: FileItem) => {
    e.preventDefault();
    setContextMenu({
      file,
      position: { x: e.pageX, y: e.pageY },
    });
  };

  const handleDownload = async (file: FileItem) => {
    const response = await fetch(`/api/files/download?path=${file.path}`);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleCopyLink = async (file: FileItem) => {
    const fileUrl = `${window.location.origin}/api/files/download?path=${file.path}`;
    await navigator.clipboard.writeText(fileUrl);
    // Thêm thông báo toast ở đây nếu muốn
  };

  return (
    <>
      <div className={`p-4 ${view === 'grid' ? 'grid grid-cols-4 gap-4' : 'flex flex-col space-y-2'}`}>
        {sortedFiles.map((file) => (
          <div
            key={file.id}
            className={`p-2 border rounded cursor-pointer ${
              selectedItems.includes(file) ? 'bg-blue-100' : ''
            }`}
            onClick={() => {
              if (file.type === 'folder') {
                onNavigate(file.path);
              } else {
                onSelect([file]);
                if (handleSelect != null) {
                    const fileUrl = `${window.location.origin}/api/files/download?path=${file.path}`;
                    handleSelect(fileUrl)
                }
              }
            }}
            onContextMenu={(e) => handleContextMenu(e, file)}
          >
            <div className="flex items-center space-x-2">
              {file.type === 'folder' ? (
                <FolderIcon className="w-6 h-6" />
              ) : (
                <FileIcon className="w-6 h-6" extension={file.extension} />
              )}
              <span>{file.name}</span>
            </div>
          </div>
        ))}
      </div>

      {contextMenu && (
        <ContextMenu
          file={contextMenu.file}
          position={contextMenu.position}
          onClose={() => setContextMenu(null)}
          onDownload={() => handleDownload(contextMenu.file)}
          onCopyLink={() => handleCopyLink(contextMenu.file)}
          onPreview={() => setPreviewFile(contextMenu.file)}
          onDelete={() => onDelete(contextMenu.file)}
          onRename={() => setRenameFile(contextMenu.file)}
        />
      )}

      {previewFile && (
        <FilePreview
          file={previewFile}
          onClose={() => setPreviewFile(null)}
        />
      )}

      {renameFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded shadow-lg">
            <h3 className="text-lg font-medium mb-4">Chỉnh sửa tên file</h3>
            <input
              type="text"
              className="border rounded p-2 w-full mb-4"
              value={renameFile.name}
              onChange={(e) => setRenameFile({ ...renameFile, name: e.target.value })}
              placeholder="Tên file"
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 text-gray-600"
                onClick={() => setRenameFile(null)}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={() => {onRename(renameFile, renameFile.name); setRenameFile(null) }}
              >
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 