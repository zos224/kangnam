"use client"
import { FileItem } from '@/utils/types';
import { useState, useEffect, useRef } from 'react';
import { FiDownload, FiLink, FiEye, FiTrash2, FiEdit2 } from 'react-icons/fi';

interface ContextMenuProps {
  file: FileItem;
  position: { x: number; y: number };
  onClose: () => void;
  onDownload: () => void;
  onCopyLink: () => void;
  onPreview: () => void;
  onDelete: () => void;
  onRename: () => void;
}

export default function ContextMenu({
  file,
  position,
  onClose,
  onDownload,
  onCopyLink,
  onPreview,
  onDelete,
  onRename,
}: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const menuItems = [
    {
      icon: <FiDownload className="w-4 h-4" />,
      label: 'Tải xuống',
      onClick: onDownload,
      show: file.type === 'file',
    },
    {
      icon: <FiLink className="w-4 h-4" />,
      label: 'Sao chép liên kết',
      onClick: onCopyLink,
      show: file.type === 'file',
    },
    {
      icon: <FiEye className="w-4 h-4" />,
      label: 'Xem trước',
      onClick: onPreview,
      show: file.type === 'file',
    },
    {
      icon: <FiEdit2 className="w-4 h-4" />,
      label: 'Đổi tên',
      onClick: onRename,
      show: true,
    },
    {
      icon: <FiTrash2 className="w-4 h-4" />,
      label: 'Xóa',
      onClick: onDelete,
      show: true,
    },
  ];

  return (
    <div
      ref={menuRef}
      className="absolute bg-white rounded-lg shadow-lg py-2 min-w-[160px]"
      style={{ top: position.y, left: position.x }}
    >
      {menuItems
        .filter((item) => item.show)
        .map((item, index) => (
          <button
            key={index}
            className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center space-x-2"
            onClick={() => {
              item.onClick();
              onClose();
            }}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
    </div>
  );
} 