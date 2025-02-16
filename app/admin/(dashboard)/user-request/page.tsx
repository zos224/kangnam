"use client"

import { useEffect, useState } from 'react';
import { UserRequest } from '@/utils/model';
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
import { Trash } from 'lucide-react';
import ModalAlert from '@/components/admin/ui/modal-alert';

export default function UserRequestsPage() {
  const [requests, setRequests] = useState<UserRequest[]>([]);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const { showToast } = useToast();

  const fetchRequests = async () => {
    try {
      const res = await fetch('/api/user-request');
      const data = await res.json();
      setRequests(data);
    } catch (error) {
      console.error('Failed to fetch requests:', error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusChange = async (id: number, status: string) => {
    try {
      const res = await fetch('/api/user-request', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });

      if (!res.ok) throw new Error('Có lỗi xảy ra');

      showToast('Cập nhật trạng thái thành công!', 'success');
      fetchRequests();
    } catch (error) {
      showToast('Có lỗi xảy ra khi cập nhật trạng thái.', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await fetch(`/api/user-request?id=${deleteId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        showToast('Xóa yêu cầu thành công!', 'success');
        fetchRequests();
      } else {
        showToast('Có lỗi xảy ra khi xóa yêu cầu.', 'error');
      }
    } catch (error) {
      showToast('Có lỗi xảy ra khi xóa yêu cầu.', 'error');
    }

    setShowDeleteAlert(false);
    setDeleteId(null);
  };

  return (
    <div className="space-y-4 p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Quản lý yêu cầu</h2>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách yêu cầu</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên</TableHead>
                <TableHead>Số điện thoại</TableHead>
                <TableHead>Dịch vụ</TableHead>
                <TableHead>Yêu cầu</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.name}</TableCell>
                  <TableCell>{request.phone}</TableCell>
                  <TableCell>{request.service}</TableCell>
                  <TableCell>{request.type}</TableCell>
                  <TableCell>{request.status}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button onClick={() => handleStatusChange(request.id, request.status === 'pending' ? 'processed' : 'pending')}>
                        {request.status === 'pending' ? 'Đánh dấu đã xử lý' : 'Đánh dấu chưa xử lý'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setDeleteId(request.id);
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