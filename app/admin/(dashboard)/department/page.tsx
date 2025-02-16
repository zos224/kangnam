"use client"

import { useEffect, useState } from 'react';
import { Department, Blog, Language } from '@/utils/model';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/admin/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/admin/ui/card";
import { Button } from '@/components/admin/ui/button';
import { useToast } from '@/components/admin/ToastProvider';
import { PlusCircle, Pencil, Trash, ImageIcon } from 'lucide-react';
import Modal from '@/components/admin/ui/modal';
import ModalAlert from '@/components/admin/ui/modal-alert';
import { Input } from '@/components/admin/ui/input';
import Image from 'next/image';
import FileManager from '@/components/FileManager/FileManager';

export default function DepartmentPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [currentLanguage, setCurrentLanguage] = useState<Language>();
  const [currentDepartment, setCurrentDepartment] = useState<Partial<Department>>();
  const [modalOpen, setModalOpen] = useState(false);
  const [action, setAction] = useState<'add' | 'edit' | 'undefined'>('undefined');
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showFileManager, setShowFileManager] = useState(false);
  const [blogs, setBlogs] = useState<Blog[]>([]);

  const { showToast } = useToast();

  const fetchLanguages = async () => {
    try {
      const res = await fetch('/api/language');
      const data = await res.json();
      setLanguages(data.data);
      if (data.data.length > 0) {
        const defaultLang = data.data.find((l: Language) => l.using) || data.data[0];
        setCurrentLanguage(defaultLang);
      }
    } catch (error) {
      console.error('Failed to fetch languages:', error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await fetch(`/api/department${currentLanguage ? `?idLanguage=${currentLanguage.id}` : ''}`);
      const data = await res.json();
      setDepartments(data);
    } catch (error) {
      console.error('Failed to fetch departments:', error);
    }
  };

  const fetchBlogs = async () => {
    try {
      const res = await fetch('/api/blog');
      const data = await res.json();
      setBlogs(data.data);
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
    }
  };

  useEffect(() => {
    fetchLanguages();
  }, []);

  useEffect(() => {
    if (currentLanguage) {
      fetchDepartments();
    }
  }, [currentLanguage]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleFileSelect = (url: string) => {
    setCurrentDepartment(prev => ({
      ...prev!,
      img: url
    }));
    setShowFileManager(false);
  };

  const handleSubmitAdd = async () => {
    try {
      if (!currentDepartment?.name || !currentDepartment?.img || !currentDepartment?.idBlog || !currentDepartment?.idLanguage) {
        showToast('Vui lòng điền đầy đủ thông tin', 'error');
        return;
      }

      const res = await fetch('/api/department', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentDepartment)
      });

      if (!res.ok) {
        throw new Error('Có lỗi xảy ra');
      }

      showToast('Thêm chuyên khoa thành công!', 'success');
      fetchDepartments();
      setAction('undefined');
    } catch (error) {
      showToast('Có lỗi xảy ra khi thêm chuyên khoa.', 'error');
    }
  };

  const handleSubmitEdit = async () => {
    try {
      if (!currentDepartment?.name || !currentDepartment?.img || !currentDepartment?.idBlog || !currentDepartment?.idLanguage) {
        showToast('Vui lòng điền đầy đủ thông tin', 'error');
        return;
      }

      const res = await fetch('/api/department', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentDepartment)
      });

      if (!res.ok) {
        throw new Error('Có lỗi xảy ra');
      }

      showToast('Cập nhật chuyên khoa thành công!', 'success');
      fetchDepartments();
      setAction('undefined');
    } catch (error) {
      showToast('Có lỗi xảy ra khi cập nhật chuyên khoa.', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await fetch(`/api/department?id=${deleteId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        showToast('Xóa chuyên khoa thành công!', 'success');
        fetchDepartments();
      } else {
        showToast('Có lỗi xảy ra khi xóa chuyên khoa.', 'error');
      }
    } catch (error) {
      showToast('Có lỗi xảy ra khi xóa chuyên khoa.', 'error');
    }

    setShowDeleteAlert(false);
    setDeleteId(null);
  };

  useEffect(() => {
    if (action === 'add') {
      setCurrentDepartment({ 
        name: '', 
        img: '', 
        idBlog: 0,
        idLanguage: currentLanguage?.id 
      });
      setModalOpen(true);
    } else if (action === 'edit') {
      setModalOpen(true);
    } else {
      setModalOpen(false);
    }
  }, [action, currentLanguage]);

  return (
    <div className="space-y-4 p-8 pt-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Quản lý chuyên khoa</h2>
        <div className="flex items-center gap-4">
          <select
            className="border rounded-md p-2"
            value={currentLanguage?.id}
            onChange={(e) => {
              const lang = languages.find(l => l.id === parseInt(e.target.value));
              setCurrentLanguage(lang);
            }}
          >
            {languages.map(lang => (
              <option key={lang.id} value={lang.id}>
                {lang.name}
              </option>
            ))}
          </select>
          <Button onClick={() => setAction('add')}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Thêm chuyên khoa
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách chuyên khoa</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên chuyên khoa</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.map((department) => (
                <TableRow key={department.id}>
                  <TableCell>{department.name}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setCurrentDepartment(department);
                          setAction('edit');
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setDeleteId(department.id);
                          setShowDeleteAlert(true);
                        }}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Modal
        open={modalOpen}
        title={action === 'add' ? 'Thêm chuyên khoa' : 'Cập nhật chuyên khoa'}
        close={() => setAction('undefined')}
        handleConfirm={action === 'add' ? handleSubmitAdd : handleSubmitEdit}
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Tên chuyên khoa</label>
            <Input
              value={currentDepartment?.name || ''}
              onChange={(e) => setCurrentDepartment(prev => ({
                ...prev!,
                name: e.target.value
              }))}
              placeholder="Nhập tên chuyên khoa"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Hình ảnh</label>
            <div className="flex items-center gap-2 mt-1">
              {currentDepartment?.img && (
                <Image
                  src={currentDepartment.img}
                  alt="Department image"
                  width={100}
                  height={100}
                  className="rounded-md"
                />
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowFileManager(true)}
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Chọn ảnh
              </Button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Id bài viết liên kết</label>
            <Input type='number' value={currentDepartment?.idBlog || ''} onChange={(e) => setCurrentDepartment(prev => ({ ...prev!, idBlog: parseInt(e.target.value) }))} />
          </div>
        </div>
      </Modal>

      {showFileManager && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-4/5 h-4/5">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-medium">Chọn file</h3>
              <button
                onClick={() => setShowFileManager(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="p-4">
              <FileManager handleSelectFile={handleFileSelect} />
            </div>
          </div>
        </div>
      )}

      <ModalAlert
        open={showDeleteAlert}
        close={() => {
          setShowDeleteAlert(false);
          setDeleteId(null);
        }}
        handleConfirm={handleDelete}
      />
    </div>
  );
}