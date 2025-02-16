"use client"

import { useEffect, useState } from 'react';
import { Admin } from '@/utils/model';
import {
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  Table,
  TableCell
} from '@/components/admin/ui/table';
import { Button } from '@/components/admin/ui/button';
import { Input } from '@/components/admin/ui/input';
import { useToast } from '@/components/admin/ToastProvider';
import { PlusCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/admin/ui/card';
import Modal from '@/components/admin/ui/modal';
import ModalAlert from '@/components/admin/ui/modal-alert';

interface AdminWithCount extends Omit<Admin, 'password' | 'blogs'> {
  _count: {
    blogs: number;
  };
}

export default function AdminPage() {
  const [admins, setAdmins] = useState<AdminWithCount[]>([]);
  const [currentAdmin, setCurrentAdmin] = useState<Partial<Admin>>();
  const [action, setAction] = useState<'add' | 'edit' | 'undefined'>('undefined');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const itemsPerPage = 10;

  const { showToast } = useToast();

  const fetchAdmins = async (page: number = 1) => {
    try {
      const res = await fetch(`/api/admin?page=${page}&limit=${itemsPerPage}`);
      const data = await res.json();
      setAdmins(data.data);
      setTotalItems(data.pagination.total);
    } catch (error) {
      console.error('Failed to fetch admins:', error);
    }
  };

  useEffect(() => {
    fetchAdmins(currentPage);
  }, [currentPage]);

  const handleSubmitAdd = async () => {
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentAdmin)
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error);
      }

      showToast('Thêm tài khoản thành công!', 'success');
      setAction('undefined');
      fetchAdmins(currentPage);
    } catch (error: any) {
      showToast(error.message || 'Có lỗi xảy ra khi thêm tài khoản.', 'error');
    }
  };

  const handleSubmitEdit = async () => {
    try {
      const res = await fetch('/api/admin', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentAdmin)
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error);
      }

      showToast('Cập nhật tài khoản thành công!', 'success');
      setAction('undefined');
      fetchAdmins(currentPage);
    } catch (error: any) {
      showToast(error.message || 'Có lỗi xảy ra khi cập nhật tài khoản.', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await fetch(`/api/admin?id=${deleteId}`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error);
      }

      showToast('Xóa tài khoản thành công!', 'success');
      setShowDeleteAlert(false);
      setDeleteId(null);
      fetchAdmins(currentPage);
    } catch (error: any) {
      showToast(error.message || 'Có lỗi xảy ra khi xóa tài khoản.', 'error');
    }
  };

  return (
    <div className="space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Quản lý tài khoản</h2>
        <Button onClick={() => {
          setCurrentAdmin({});
          setAction('add');
        }}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Thêm tài khoản
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách tài khoản</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên đăng nhập</TableHead>
                <TableHead>Tên hiển thị</TableHead>
                <TableHead>Số bài viết</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell>{admin.username}</TableCell>
                  <TableCell>{admin.name}</TableCell>
                  <TableCell>{admin._count.blogs}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setCurrentAdmin(admin);
                        setAction('edit');
                      }}
                    >
                      Sửa
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setDeleteId(admin.id);
                        setShowDeleteAlert(true);
                      }}
                    >
                      Xóa
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="flex w-full items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Hiển thị {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} 
              của {totalItems} tài khoản
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => prev - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Trước
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={currentPage >= Math.ceil(totalItems / itemsPerPage)}
              >
                Sau
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>

      <Modal 
        open={action !== 'undefined'} 
        title={action === 'add' ? "Thêm tài khoản" : "Cập nhật tài khoản"}
        close={() => setAction('undefined')}
        handleConfirm={action === 'add' ? handleSubmitAdd : handleSubmitEdit}
      >
        <ModalContent 
          admin={currentAdmin}
          onChange={setCurrentAdmin}
          isEdit={action === 'edit'}
        />
      </Modal>

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

function ModalContent({
  admin,
  onChange,
  isEdit
}: {
  admin?: Partial<Admin>;
  onChange: (admin: Partial<Admin>) => void;
  isEdit: boolean;
}) {
  return (
    <div className="grid gap-4">
      <div>
        <label className="text-sm font-medium">Tên đăng nhập</label>
        <Input
          value={admin?.username || ''}
          onChange={(e) => onChange({ ...admin, username: e.target.value })}
          placeholder="Nhập tên đăng nhập"
        />
      </div>
      {!isEdit && (
        <div>
          <label className="text-sm font-medium">Mật khẩu</label>
          <Input
            type="password"
            value={admin?.password || ''}
            onChange={(e) => onChange({ ...admin, password: e.target.value })}
            placeholder="Nhập mật khẩu"
          />
        </div>
      )}
      <div>
        <label className="text-sm font-medium">Tên hiển thị</label>
        <Input
          value={admin?.name || ''}
          onChange={(e) => onChange({ ...admin, name: e.target.value })}
          placeholder="Nhập tên hiển thị"
        />
      </div>
    </div>
  );
} 