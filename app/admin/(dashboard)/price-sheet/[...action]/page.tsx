"use client"

import { useEffect, useState, use } from 'react';
import { Service, PriceSheet } from '@/utils/model';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/admin/ui/card";
import { Button } from '@/components/admin/ui/button';
import { Input } from '@/components/admin/ui/input';
import { useToast } from '@/components/admin/ToastProvider';
import { useRouter } from 'next/navigation';
import FileManager from '@/components/FileManager/FileManager';
import { ImageIcon, Plus, X } from 'lucide-react';
import Image from 'next/image';

export default function PriceSheetForm({ params }: { params: Promise<{action: string[]}> }) {
  const paramData = use(params);
  const [priceSheet, setPriceSheet] = useState<Partial<PriceSheet>>({
    name: '',
    price: 0,
    image: '',
    idService: 0
  });
  const [services, setServices] = useState<Service[]>([]);
  const [showFileManager, setShowFileManager] = useState(false);

  const router = useRouter();
  const { showToast } = useToast();
  const isEdit = paramData.action[0] === 'edit';

  useEffect(() => {
    fetchServices();
    if (isEdit && paramData.action[1]) {
      fetchPriceSheet(parseInt(paramData.action[1]));
    }
  }, [isEdit, paramData.action[1]]);

  const fetchServices = async () => {
    try {
      const res = await fetch('/api/service');
      const data = await res.json();
      setServices(data.data);
      if (!isEdit && data.data.length > 0) {
        setPriceSheet(prev => ({ ...prev, idService: data.data[0].id }));
      }
    } catch (error) {
      console.error('Failed to fetch services:', error);
    }
  };

  const fetchPriceSheet = async (id: number) => {
    try {
      const res = await fetch(`/api/price-sheet?id=${id}`);
      const data = await res.json();
      setPriceSheet(data);
    } catch (error) {
      console.error('Failed to fetch price sheet:', error);
    }
  };

  const handleFileSelect = (url: string) => {
    setPriceSheet(prev => ({ ...prev, image: url }));
    setShowFileManager(false);
  };

  const handleSubmit = async () => {
    try {
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch('/api/price-sheet', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(priceSheet)
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error);
      }

      showToast(
        `${isEdit ? 'Cập nhật' : 'Thêm'} bảng giá thành công!`,
        'success'
      );
      router.push('/admin/price-sheet');
    } catch (error: any) {
      showToast(
        error.message || `Có lỗi xảy ra khi ${isEdit ? 'cập nhật' : 'thêm'} bảng giá.`,
        'error'
      );
    }
  };

  return (
    <div className="space-y-4 p-8 pt-6">
      <div className="flex justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          {isEdit ? 'Cập nhật' : 'Thêm'} bảng giá
        </h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin bảng giá</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Dịch vụ</label>
            <select
              className="w-full border rounded-md p-2"
              value={priceSheet.idService}
              onChange={(e) => setPriceSheet(prev => ({
                ...prev,
                idService: parseInt(e.target.value)
              }))}
            >
              <option value="">Chọn dịch vụ</option>
              {services.map(service => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Tên gói dịch vụ</label>
            <Input
              value={priceSheet.name}
              onChange={(e) => setPriceSheet(prev => ({
                ...prev,
                name: e.target.value
              }))}
              placeholder="Nhập tên gói dịch vụ"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Giá</label>
            <Input
              type="number"
              value={priceSheet.price}
              onChange={(e) => setPriceSheet(prev => ({
                ...prev,
                price: parseFloat(e.target.value)
              }))}
              placeholder="Nhập giá dịch vụ"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Hình ảnh</label>
            <div className="mt-2 space-y-2">
              {priceSheet.image && (
                <div className="relative w-[200px] h-[200px]">
                  <Image
                    src={priceSheet.image}
                    alt={priceSheet.name || ''}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              )}
              <Button
                variant="outline"
                onClick={() => setShowFileManager(true)}
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Chọn hình ảnh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button
          variant="outline"
          onClick={() => router.push('/admin/price-sheet')}
        >
          Hủy
        </Button>
        <Button onClick={handleSubmit}>
          {isEdit ? 'Cập nhật' : 'Thêm'} bảng giá
        </Button>
      </div>

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
    </div>
  );
} 