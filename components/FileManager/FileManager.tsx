"use client"
import { useState, useEffect } from 'react';
import { FileItem, FileManagerState } from '@/utils/types';
import FileList from './FileList';
import FileToolbar from './FileToolbar'
import BreadCrumb from './BreadCrumb';
import SearchBar from './SearchBar';
import Toast from './Toast';

interface SelectFile {
    handleSelectFile: (url: string) => void;
  }

export default function FileManager({handleSelectFile} : SelectFile) {
  const [state, setState] = useState<FileManagerState>({
    currentPath: '',
    selectedItems: [],
    view: 'grid',
    sortBy: 'name',
    sortOrder: 'asc'
  });

  const [files, setFiles] = useState<FileItem[]>([]);
  const [searchResults, setSearchResults] = useState<FileItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  useEffect(() => {
    loadFiles();
  }, [state.currentPath]);

  const loadFiles = async () => {
    try {
      const response = await fetch(`/api/files?path=${state.currentPath}`);
      const data = await response.json();
      setFiles(data);
    } catch (error) {
      console.error('Failed to load files:', error);
    }
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  const handleCreateFolder = async (name: string) => {
    try {
      const response = await fetch('/api/files/folder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: state.currentPath,
          name
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create folder');
      }

      showToast('Thư mục đã được tạo thành công', 'success');
      loadFiles();
    } catch (error) {
      console.error('Failed to create folder:', error);
      showToast(
        error instanceof Error ? error.message : 'Không thể tạo thư mục',
        'error'
      );
    }
  };

  const handleUploadFiles = async (files: FileList) => {
    const formData = new FormData();
    formData.append('path', state.currentPath);
    
    for (let i = 0; i < files.length; i++) {
      formData.append('file', files[i]);
      
      try {
        const response = await fetch('/api/files/upload', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to upload file');
        }

        showToast(`File ${files[i].name} đã được tải lên thành công`, 'success');
      } catch (error) {
        console.error('Failed to upload file:', error);
        showToast(
          error instanceof Error ? error.message : 'Không thể tải lên file',
          'error'
        );
      }
    }
    
    loadFiles();
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`/api/files/search?query=${encodeURIComponent(query)}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Failed to search:', error);
    }
  };

  const handleDelete = async (file: FileItem) => {
    try {
      await fetch(`/api/files/delete?path=${file.path}`, {
        method: 'DELETE'
      });
      loadFiles();
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  const handleRename = async (file: FileItem, newName: string) => {
    try {
      await fetch('/api/files/rename', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oldPath: file.path,
          newName
        })
      });
      loadFiles();
    } catch (error) {
      console.error('Failed to rename:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-y-auto">
      <h6 className='font-bold text-2xl'>Quản lý tập tin</h6>
      <div className="flex items-center justify-between p-4 border-b">
        <FileToolbar 
          state={state}
          onCreateFolder={handleCreateFolder}
          onViewChange={(view) => setState({...state, view})}
          onSortChange={(sortBy, sortOrder) => setState({...state, sortBy, sortOrder})}
          onUploadFiles={handleUploadFiles}
        />
        <SearchBar onSearch={handleSearch} />
      </div>
      
      <BreadCrumb 
        path={state.currentPath}
        onNavigate={(path) => setState({...state, currentPath: path})}
      />
      
      <FileList
        files={isSearching ? searchResults : files}
        view={state.view}
        sortBy={state.sortBy}
        sortOrder={state.sortOrder}
        selectedItems={state.selectedItems}
        onSelect={(items) => setState({...state, selectedItems: items})}
        onNavigate={(path) => setState({...state, currentPath: path})}
        onDelete={handleDelete}
        onRename={handleRename}
        handleSelect={handleSelectFile}
      />
      
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
} 