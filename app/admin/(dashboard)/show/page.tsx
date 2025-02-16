"use client"

import { useEffect, useState } from 'react';
import { Show, Language } from '@/utils/model';
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
  CardFooter
} from "@/components/admin/ui/card";
import { Button } from '@/components/admin/ui/button';
import { useToast } from '@/components/admin/ToastProvider';
import { PlusCircle, Pencil, Trash, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import ModalAlert from '@/components/admin/ui/modal-alert';

export default function ShowPage() {
  const [shows, setShows] = useState<Show[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [currentLanguage, setCurrentLanguage] = useState<Language>();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 10;

  const { showToast } = useToast();

  const fetchLanguages = async () => {
    try {
      const res = await fetch('/api/language');
      const data = await res.json();
      setLanguages(data.data);
      if (data.data.length > 0) {
        setCurrentLanguage(data.data[0]);
      }
    } catch (error) {
      console.error('Failed to fetch languages:', error);
    }
  };

  const fetchShows = async (page: number, languageId?: number) => {
    try {
      const res = await fetch(
        `/api/show?page=${page}&limit=${limit}${languageId ? `&idLanguage=${languageId}` : ''}`
      );
      const data = await res.json();
      setShows(data.data);
      setTotalItems(data.pagination.total);
    } catch (error) {
      console.error('Failed to fetch shows:', error);
    }
  };

  useEffect(() => {
    fetchLanguages();
  }, []);

  useEffect(() => {
    if (currentLanguage) {
      fetchShows(currentPage, currentLanguage.id);
    }
  }, [currentLanguage, currentPage]);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await fetch(`/api/show?id=${deleteId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        showToast('Xóa show thành công!', 'success');
        fetchShows(currentPage, currentLanguage?.id);
      } else {
        showToast('Có lỗi xảy ra khi xóa show.', 'error');
      }
    } catch (error) {
      console.error('Failed to delete show:', error);
      showToast('Có lỗi xảy ra khi xóa show.', 'error');
    }

    setShowDeleteAlert(false);
    setDeleteId(null);
  };

  return (
    <div className="space-y-4 p-8 pt-6">
      <div className="flex justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Quản lý Show</h2>
        <div className="flex items-center gap-4">
          <select
            className="border rounded-md p-2"
            value={currentLanguage?.id || ''}
            onChange={(e) => {
              const language = languages.find(l => l.id === parseInt(e.target.value));
              setCurrentLanguage(language);
            }}
          >
            {languages.map(language => (
              <option key={language.id} value={language.id}>
                {language.name}
              </option>
            ))}
          </select>
          <Link href="/admin/show/add">
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Thêm show
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách show</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tiêu đề</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Số video</TableHead>
                <TableHead>Ngôn ngữ</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shows.map((show) => (
                <TableRow key={show.id}>
                  <TableCell>{show.title}</TableCell>
                  <TableCell>{show.description}</TableCell>
                  <TableCell>{show.urlVideos.length}</TableCell>
                  <TableCell>{show.language.name}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/show/edit/${show.id}`}>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setDeleteId(show.id);
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
              của <strong>{totalItems}</strong> show
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