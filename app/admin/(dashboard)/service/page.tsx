"use client"

import { useEffect, useState } from 'react';
import { Service, Language, Department } from '@/utils/model';
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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/admin/ui/card";
import { Button } from '@/components/admin/ui/button';
import { useToast } from '@/components/admin/ToastProvider';
import { PlusCircle, ChevronLeft, ChevronRight, Pencil, Trash } from 'lucide-react';
import Link from 'next/link';
import ModalAlert from '@/components/admin/ui/modal-alert';

export default function ServicePage() {
  const [services, setServices] = useState<Service[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [currentLanguage, setCurrentLanguage] = useState<Language>();
  const [currentDepartment, setCurrentDepartment] = useState<number | "">("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  
  const { showToast } = useToast();
  const itemsPerPage = 10;

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

  const fetchDepartments = async (langId?: number) => {
    try {
      const res = await fetch(`/api/department${langId ? `?idLanguage=${langId}` : ''}`);
      const data = await res.json();
      setDepartments(data);
    } catch (error) {
      console.error('Failed to fetch departments:', error);
    }
  };

  const fetchServices = async (page: number, langId?: number, deptId?: number) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: itemsPerPage.toString()
      });
      
      if (langId) params.append('idLanguage', langId.toString());
      if (deptId) params.append('idDepartment', deptId.toString());
      
      const res = await fetch(`/api/service?${params}`);
      const data = await res.json();
      setServices(data.data);
      setTotalItems(data.pagination.total);
    } catch (error) {
      console.error('Failed to fetch services:', error);
    }
  };

  useEffect(() => {
    fetchLanguages();
  }, []);

  useEffect(() => {
    if (currentLanguage) {
      fetchDepartments(currentLanguage.id);
      fetchServices(currentPage, currentLanguage.id, currentDepartment || undefined);
    }
  }, [currentPage, currentLanguage, currentDepartment]);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await fetch(`/api/service?id=${deleteId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        showToast('Xóa dịch vụ thành công!', 'success');
        fetchServices(currentPage, currentLanguage?.id, currentDepartment || undefined);
      } else {
        showToast('Có lỗi xảy ra khi xóa dịch vụ.', 'error');
      }
    } catch (error) {
      console.error('Failed to delete service:', error);
      showToast('Có lỗi xảy ra khi xóa dịch vụ.', 'error');
    }

    setShowDeleteAlert(false);
    setDeleteId(null);
  };

  return (
    <div className="space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Quản lý dịch vụ</h2>
        <div className="flex items-center gap-4">
          <select
            className="border rounded-md p-2"
            value={currentLanguage?.id}
            onChange={(e) => {
              const lang = languages.find(l => l.id === parseInt(e.target.value));
              setCurrentLanguage(lang);
              setCurrentDepartment("");
              setCurrentPage(1);
            }}
          >
            {languages.map(lang => (
              <option key={lang.id} value={lang.id}>
                {lang.name}
              </option>
            ))}
          </select>

          <select
            className="border rounded-md p-2"
            value={currentDepartment}
            onChange={(e) => {
              setCurrentDepartment(e.target.value ? parseInt(e.target.value) : "");
              setCurrentPage(1);
            }}
          >
            <option value="">Tất cả chuyên khoa</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>

          <Link href="/admin/service/add">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Thêm dịch vụ
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách dịch vụ</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên dịch vụ</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Số lượng gói dịch vụ</TableHead>
                <TableHead>Ngôn ngữ</TableHead>
                <TableHead>Chuyên khoa</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>{service.name}</TableCell>
                  <TableCell className="max-w-[300px] truncate">
                    {service.description}
                  </TableCell>
                  <TableCell>{service.serviceItems.length}</TableCell>
                  <TableCell>{service.language?.name}</TableCell>
                  <TableCell>{service.department?.name}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/service/edit/${service.id}`}>
                        <Button variant="outline" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setDeleteId(service.id);
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
        <CardFooter className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Hiển thị {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} 
            trong số {totalItems} dịch vụ
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => prev - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Trước
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={currentPage >= Math.ceil(totalItems / itemsPerPage)}
            >
              Sau
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
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