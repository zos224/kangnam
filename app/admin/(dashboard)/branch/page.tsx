"use client"

import { useEffect, useState } from 'react';
import { Branch } from '@/utils/model';
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
import { PlusCircle, Pencil, Trash } from 'lucide-react';
import Modal from '@/components/admin/ui/modal';
import ModalAlert from '@/components/admin/ui/modal-alert';
import { Input } from '@/components/admin/ui/input';
import { Textarea } from '@/components/admin/ui/textarea';

export default function BranchPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [currentBranch, setCurrentBranch] = useState<Partial<Branch>>();
  const [modalOpen, setModalOpen] = useState(false);
  const [action, setAction] = useState<'add' | 'edit' | 'undefined'>('undefined');
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  const { showToast } = useToast();

  const fetchBranches = async () => {
    try {
      const res = await fetch(`/api/branch?page=${currentPage}&limit=${itemsPerPage}`);
      const data = await res.json();
      setBranches(data.data);
      setTotalItems(data.pagination.total);
    } catch (error) {
      console.error('Failed to fetch branches:', error);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, [currentPage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentBranch) return;

    try {
      const res = await fetch('/api/branch', {
        method: action === 'add' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentBranch)
      });

      if (!res.ok) throw new Error('Có lỗi xảy ra');

      showToast(
        `${action === 'add' ? 'Thêm' : 'Cập nhật'} chi nhánh thành công!`,
        'success'
      );
      setModalOpen(false);
      fetchBranches();
    } catch (error) {
      showToast(
        `Có lỗi xảy ra khi ${action === 'add' ? 'thêm' : 'cập nhật'} chi nhánh.`,
        'error'
      );
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await fetch(`/api/branch?id=${deleteId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        showToast('Xóa chi nhánh thành công!', 'success');
        fetchBranches();
      } else {
        showToast('Có lỗi xảy ra khi xóa chi nhánh.', 'error');
      }
    } catch (error) {
      showToast('Có lỗi xảy ra khi xóa chi nhánh.', 'error');
    }

    setShowDeleteAlert(false);
    setDeleteId(null);
  };

  return (
    <div className="space-y-4 p-8 pt-6">
      <div className="flex justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Quản lý chi nhánh</h2>
        <Button onClick={() => {
          setAction('add');
          setCurrentBranch({});
          setModalOpen(true);
        }}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Thêm chi nhánh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách chi nhánh</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên chi nhánh</TableHead>
                <TableHead>Địa chỉ</TableHead>
                <TableHead>Google Map</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {branches.map((branch) => (
                <TableRow key={branch.id}>
                  <TableCell>{branch.name}</TableCell>
                  <TableCell>{branch.address}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{branch.ggmap}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setAction('edit');
                          setCurrentBranch(branch);
                          setModalOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setDeleteId(branch.id);
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
        close={() => {
          setModalOpen(false);
          setCurrentBranch(undefined);
          setAction('undefined');
        }}
        title={`${action === 'add' ? 'Thêm' : 'Cập nhật'} chi nhánh`}
        handleConfirm={handleSubmit}
      >
        <form>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Tên chi nhánh</label>
              <Input
                value={currentBranch?.name || ''}
                onChange={(e) => setCurrentBranch(prev => ({
                  ...prev,
                  name: e.target.value
                }))}
                placeholder="Nhập tên chi nhánh"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Địa chỉ</label>
              <Input
                value={currentBranch?.address || ''}
                onChange={(e) => setCurrentBranch(prev => ({
                  ...prev,
                  address: e.target.value
                }))}
                placeholder="Nhập địa chỉ"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Google Map</label>
              <Input
                value={currentBranch?.ggmap || ''}
                onChange={(e) => setCurrentBranch(prev => ({
                  ...prev,
                  ggmap: e.target.value
                }))}
                placeholder="Nhập link Google Map"
                required
              />
            </div>
          </div>
        </form>
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