export interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: number;
  path: string;
  createdAt: Date;
  updatedAt: Date;
  extension?: string;
}

export interface FileManagerState {
  currentPath: string;
  selectedItems: FileItem[];
  view: 'grid' | 'list';
  sortBy: 'name' | 'date' | 'size';
  sortOrder: 'asc' | 'desc';
} 