"use client"

import { useEffect, useState } from 'react';
import { Service, PriceSheet } from '@/utils/model';
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
import Link from 'next/link';
import ModalAlert from '@/components/admin/ui/modal-alert';
import Image from 'next/image';

export default function PriceSheetPage() {
  const [priceSheets, setPriceSheets] = useState<PriceSheet[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [currentService, setCurrentService] = useState<Service>();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { showToast } = useToast();

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/service');
      const data = await res.json();
      setServices(data.data);
      // Set default service to first item
      if (data.data.length > 0) {
        setCurrentService(data.data[0]);
      }
    } catch (error) {
      console.error('Failed to fetch services:', error);
    }
  };

  const fetchPriceSheets = async (serviceId?: number) => {
    try {
      const res = await fetch(
        `/api/price-sheet${serviceId ? `?idService=${serviceId}` : ''}`
      );
      const data = await res.json();
      setPriceSheets(data);
    } catch (error) {
      console.error('Failed to fetch price sheets:', error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (currentService) {
      fetchPriceSheets(currentService.id);
    }
  }, [currentService]);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await fetch(`/api/price-sheet?id=${deleteId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        showToast('Xóa bảng giá thành công!', 'success');
        fetchPriceSheets(currentService?.id);
      } else {
        showToast('Có lỗi xảy ra khi xóa bảng giá.', 'error');
      }
    } catch (error) {
      console.error('Failed to delete price sheet:', error);
      showToast('Có lỗi xảy ra khi xóa bảng giá.', 'error');
    }

    setShowDeleteAlert(false);
    setDeleteId(null);
  };

  return (
    <div className="space-y-4 p-8 pt-6">
      <div className="flex justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Quản lý bảng giá</h2>
        <div className="flex items-center gap-4">
          <select
            className="border rounded-md p-2"
            value={currentService?.id || ''}
            onChange={(e) => {
              const service = services.find(s => s.id === parseInt(e.target.value));
              setCurrentService(service);
            }}
          >
            {services.map(service => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
          <Link href="/admin/price-sheet/add">
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Thêm bảng giá
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách bảng giá</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên gói</TableHead>
                <TableHead>Giá</TableHead>
                <TableHead>Hình ảnh</TableHead>
                <TableHead>Dịch vụ</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {priceSheets && priceSheets.map((priceSheet) => (
                <TableRow key={priceSheet.id}>
                  <TableCell>{priceSheet.name}</TableCell>
                  <TableCell>{priceSheet.price.toLocaleString('vi-VN')}đ</TableCell>
                  <TableCell>
                    {priceSheet.image && (
                      <Image
                        src={priceSheet.image}
                        alt={priceSheet.name}
                        width={100}
                        height={100}
                        className="object-cover rounded-md"
                      />
                    )}
                  </TableCell>
                  <TableCell>{priceSheet.service.name}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/price-sheet/edit/${priceSheet.id}`}>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setDeleteId(priceSheet.id);
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
