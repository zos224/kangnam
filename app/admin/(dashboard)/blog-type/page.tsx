"use client"

import { useEffect, useState } from 'react';
import { BlogType } from '@/utils/model';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/admin/ui/table";
import { Button } from '@/components/admin/ui/button';
import { Input } from '@/components/admin/ui/input';
import { useToast } from '@/components/admin/ToastProvider';
import { Edit, Trash2, Plus } from 'lucide-react';
import ModalAlert from '@/components/admin/ui/modal-alert';

interface BlogTypeWithCount extends BlogType {
  _count: {
    blogs: number;
  };
}

export default function BlogTypePage() {
  const [blogTypes, setBlogTypes] = useState<BlogTypeWithCount[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [selectedType, setSelectedType] = useState<BlogTypeWithCount | null>(null);
  const [newName, setNewName] = useState('');
  
  const { showToast } = useToast();

  const fetchBlogTypes = async () => {
    try {
      const res = await fetch('/api/blog-type');
      const data = await res.json();
      setBlogTypes(data);
    } catch (error) {
      console.error('Failed to fetch blog types:', error);
    }
  };

  useEffect(() => {
    fetchBlogTypes();
  }, []);

  const handleAdd = async () => {
    try {
      const res = await fetch('/api/blog-type', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error);
      }

      showToast('Thêm loại bài viết thành công!', 'success');
      setShowAddModal(false);
      setNewName('');
      fetchBlogTypes();
    } catch (error: any) {
      showToast(error.message || 'Có lỗi xảy ra khi thêm loại bài viết.', 'error');
    }
  };

  const handleEdit = async () => {
    if (!selectedType) return;

    try {
      const res = await fetch('/api/blog-type', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: selectedType.id,
          name: newName 
        })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error);
      }

      showToast('Cập nhật loại bài viết thành công!', 'success');
      setShowEditModal(false);
      setSelectedType(null);
      setNewName('');
      fetchBlogTypes();
    } catch (error: any) {
      showToast(error.message || 'Có lỗi xảy ra khi cập nhật loại bài viết.', 'error');
    }
  };

  const handleDelete = async () => {
    if (!selectedType) return;

    try {
      const res = await fetch(`/api/blog-type?id=${selectedType.id}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error);
      }

      showToast('Xóa loại bài viết thành công!', 'success');
      setShowDeleteAlert(false);
      setSelectedType(null);
      fetchBlogTypes();
    } catch (error: any) {
      showToast(error.message || 'Có lỗi xảy ra khi xóa loại bài viết.', 'error');
    }
  };

  return (
    <div className="space-y-4 p-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Quản lý loại bài viết</h2>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm loại bài viết
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tên loại</TableHead>
            <TableHead>Số bài viết</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {blogTypes.map((type) => (
            <TableRow key={type.id}>
              <TableCell>{type.name}</TableCell>
              <TableCell>{type._count.blogs}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setSelectedType(type);
                    setNewName(type.name);
                    setShowEditModal(true);
                  }}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setSelectedType(type);
                    setShowDeleteAlert(true);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal thêm mới */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-medium mb-4">Thêm loại bài viết</h3>
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nhập tên loại bài viết"
              className="mb-4"
            />
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddModal(false);
                  setNewName('');
                }}
              >
                Hủy
              </Button>
              <Button onClick={handleAdd}>Thêm</Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal chỉnh sửa */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-medium mb-4">Chỉnh sửa loại bài viết</h3>
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nhập tên loại bài viết"
              className="mb-4"
            />
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedType(null);
                  setNewName('');
                }}
              >
                Hủy
              </Button>
              <Button onClick={handleEdit}>Cập nhật</Button>
            </div>
          </div>
        </div>
      )}

      {/* Alert xóa */}
      <ModalAlert
        open={showDeleteAlert}
        close={() => setShowDeleteAlert(false)}
        handleConfirm={handleDelete}
      />
    </div>
  );
}