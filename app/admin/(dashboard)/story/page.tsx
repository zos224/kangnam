"use client"

import { useEffect, useState } from 'react';
import { Story } from '@/utils/model';
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
import { useRouter } from 'next/navigation';
import { Edit, Trash2, Plus, Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import ModalAlert from '@/components/admin/ui/modal-alert';

export default function StoryPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  
  const router = useRouter();
  const { showToast } = useToast();

  const fetchStories = async (page: number = 1, search: string = '') => {
    try {
      const res = await fetch(`/api/story?page=${page}&limit=10&search=${search}`);
      const data = await res.json();
      setStories(data.data);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error('Failed to fetch stories:', error);
    }
  };

  useEffect(() => {
    fetchStories(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await fetch(`/api/story?id=${deleteId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        showToast('Xóa câu chuyện thành công!', 'success');
        fetchStories(currentPage, searchTerm);
      } else {
        showToast('Có lỗi xảy ra khi xóa câu chuyện.', 'error');
      }
    } catch (error) {
      console.error('Failed to delete story:', error);
      showToast('Có lỗi xảy ra khi xóa câu chuyện.', 'error');
    }

    setShowDeleteAlert(false);
    setDeleteId(null);
  };

  return (
    <div className="space-y-4 p-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Quản lý câu chuyện khách hàng</h2>
        <Link href="/admin/story/add">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Thêm câu chuyện
          </Button>
        </Link>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm câu chuyện..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Hình ảnh</TableHead>
            <TableHead>Tiêu đề</TableHead>
            <TableHead>Dịch vụ sử dụng</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stories.map((story) => (
            <TableRow key={story.id}>
              <TableCell>
                <Image
                  src={story.img}
                  alt={story.title}
                  width={80}
                  height={60}
                  className="object-cover rounded"
                />
              </TableCell>
              <TableCell className="max-w-48 truncate">{story.title}</TableCell>
              <TableCell>{story.serviceUsed}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.push(`/admin/story/edit/${story.id}`)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setDeleteId(story.id);
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

      <div className="flex justify-center space-x-2">
        <Button
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => prev - 1)}
        >
          Trước
        </Button>
        <Button
          variant="outline"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(prev => prev + 1)}
        >
          Sau
        </Button>
      </div>

      <ModalAlert
        open={showDeleteAlert}
        close={() => setShowDeleteAlert(false)}
        handleConfirm={handleDelete}
      />
    </div>
  );
}