"use client"

import { useEffect, useState } from 'react';
import { Doctor } from '@/utils/model';
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
  CardFooter,
} from "@/components/admin/ui/card";
import { Button } from '@/components/admin/ui/button';
import { useToast } from '@/components/admin/ToastProvider';
import { PlusCircle, Pencil, Trash, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import ModalAlert from '@/components/admin/ui/modal-alert';
import Image from 'next/image';

export default function DoctorPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 10;

  const { showToast } = useToast();

  const fetchDoctors = async (page: number) => {
    try {
      const res = await fetch(`/api/doctor?page=${page}&limit=${limit}`);
      const data = await res.json();
      setDoctors(data.data);
      setTotalItems(data.pagination.total);
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
    }
  };

  useEffect(() => {
    fetchDoctors(currentPage);
  }, [currentPage]);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await fetch(`/api/doctor?id=${deleteId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        showToast('Xóa bác sĩ thành công!', 'success');
        fetchDoctors(currentPage);
      } else {
        showToast('Có lỗi xảy ra khi xóa bác sĩ.', 'error');
      }
    } catch (error) {
      showToast('Có lỗi xảy ra khi xóa bác sĩ.', 'error');
    }

    setShowDeleteAlert(false);
    setDeleteId(null);
  };

  return (
    <div className="space-y-4 p-8 pt-6">
      <div className="flex justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Quản lý bác sĩ</h2>
        <Link href="/admin/doctor/add">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Thêm bác sĩ
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách bác sĩ</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hình ảnh</TableHead>
                <TableHead>Tên</TableHead>
                <TableHead>Chức danh</TableHead>
                <TableHead>Vị trí</TableHead>
                <TableHead>Kinh nghiệm</TableHead>
                <TableHead>Khoa</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {doctors.map((doctor) => (
                <TableRow key={doctor.id}>
                  <TableCell>
                    {doctor.img && (
                      <Image
                        src={doctor.img}
                        alt={doctor.name}
                        width={50}
                        height={50}
                        className="rounded-full object-cover"
                      />
                    )}
                  </TableCell>
                  <TableCell>{doctor.name}</TableCell>
                  <TableCell>{doctor.title}</TableCell>
                  <TableCell>{doctor.position}</TableCell>
                  <TableCell>{doctor.exp} năm</TableCell>
                  <TableCell>
                    {doctor.workLite.map(w => w.department.name).join(', ')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/doctor/edit/${doctor.id}`}>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setDeleteId(doctor.id);
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
        <CardFooter>
          <div className="flex items-center w-full justify-between">
            <div className="text-xs text-muted-foreground">
              Hiển thị{' '}
              <strong>
                {(currentPage - 1) * limit + 1} - {Math.min(currentPage * limit, totalItems)}
              </strong>{' '}
              của <strong>{totalItems}</strong> bác sĩ
            </div>
            <div className="flex">
              <Button
                onClick={() => setCurrentPage(prev => prev - 1)}
                variant="ghost"
                size="sm"
                disabled={currentPage === 1}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Prev
              </Button>
              <Button
                onClick={() => setCurrentPage(prev => prev + 1)}
                variant="ghost"
                size="sm"
                disabled={currentPage >= Math.ceil(totalItems / limit)}
              >
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardFooter>
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