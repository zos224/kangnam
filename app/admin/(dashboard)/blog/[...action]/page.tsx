"use client"

import { useSession } from 'next-auth/react';
import { useEffect, useState, use } from 'react';
import { Blog, BlogType, Doctor } from '@/utils/model';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/admin/ui/card';
import { Button } from '@/components/admin/ui/button';
import { Input } from '@/components/admin/ui/input';
import { useToast } from '@/components/admin/ToastProvider';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import FileManager from '@/components/FileManager/FileManager';
import { ImageIcon } from 'lucide-react';
import dynamic from 'next/dynamic';
const CKEditorCustom = dynamic(() => import('@/components/admin/CKEditor'), { ssr: false, loading: () => <div>Đang tải trình soạn thảo...</div> });

export default function BlogForm({ params }: { params: Promise<{action: string[]}> }) {
  const session = useSession();
  const paramData = use(params);
  const [blog, setBlog] = useState<Partial<Blog>>({});

  useEffect(() => {
    if (session && session.data && session.data.user?.id
    ) {
      setBlog({ ...blog, idAuthor: parseInt(session.data.user.id) });
    }
  }, [session]);

  const [blogTypes, setBlogTypes] = useState<BlogType[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [showFileManager, setShowFileManager] = useState(false);
  const [selectedField, setSelectedField] = useState<'thumbnail' | 'content'>('thumbnail');

  const router = useRouter();
  const { showToast } = useToast();
  const isEdit = paramData.action[0] == 'edit';

  useEffect(() => {
    // Fetch blog types
    fetch('/api/blog-type')
      .then(res => res.json())
      .then(data => setBlogTypes(data))
      .catch(err => console.error('Failed to fetch blog types:', err));

    // Fetch doctors
    fetch('/api/doctor?limit=1000')
      .then(res => res.json())
      .then(data => setDoctors(data.data))
      .catch(err => console.error('Failed to fetch doctors:', err));

    // Fetch blog data if editing
    if (isEdit && paramData.action[1]) {
      fetch(`/api/blog/${paramData.action[1]}`)
        .then(res => res.json())
        .then(data => setBlog(data))
        .catch(err => console.error('Failed to fetch blog:', err));
    }
  }, [isEdit, paramData.action[1]]);

  const handleSubmit = async () => {
    try {
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch('/api/blog', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blog)
      });

      if (res.ok) {
        showToast(
          `${isEdit ? 'Cập nhật' : 'Thêm'} bài viết thành công!`,
          'success'
        );
        router.push('/admin/blog');
      } else {
        throw new Error('Failed to save blog');
      }
    } catch (error) {
      console.error('Failed to save blog:', error);
      showToast(
        `Có lỗi xảy ra khi ${isEdit ? 'cập nhật' : 'thêm'} bài viết.`,
        'error'
      );
    }
  };

  function getImageSize(url: string): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = (error: any) => reject(error);
      img.src = url;
    });
  }
  
  const handleFileSelect = (url: string) => {
    if (selectedField === 'thumbnail') {
      setBlog({ ...blog, img: url });
    } else {
      getImageSize(url)
        .then((dimensions) => {
          const img = `<figure class="image"><img style="${"aspect-ratio:" + dimensions.width + "/" + dimensions.height}" src="${url}" width="${dimensions.width}" height="${dimensions.height}"></figure>`;
          setBlog({ ...blog, content: blog.content + img });
        })
        .catch((err) => console.error('Failed to get image size:', err));
    }
    setShowFileManager(false);
  };

  return (
    <div className="space-y-4 p-8">
      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? 'Chỉnh sửa' : 'Thêm'} bài viết</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tiêu đề</label>
              <Input
                value={blog.title || ''}
                onChange={(e) => setBlog({ ...blog, title: e.target.value })}
                placeholder="Nhập tiêu đề bài viết"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Hình ảnh</label>
              <div className="flex items-center space-x-4">
                {blog.img && (
                  <Image
                    src={blog.img || ""}
                    alt="Thumbnail"
                    width={200}
                    height={150}
                    className="object-cover rounded"
                  />
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSelectedField('thumbnail');
                    setShowFileManager(true);
                  }}
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Chọn hình ảnh
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Loại bài viết</label>
              <select
                className="w-full border rounded-md p-2"
                value={blog.idBlogType || ''}
                onChange={(e) => setBlog({ ...blog, idBlogType: parseInt(e.target.value) })}
              >
                <option value="">Chọn loại bài viết</option>
                {blogTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Bác sĩ (không bắt buộc)</label>
              <select
                className="w-full border rounded-md p-2"
                value={blog.idDoctor || ''}
                onChange={(e) => setBlog({ ...blog, idDoctor: e.target.value ? parseInt(e.target.value) : undefined })}
              >
                <option value="">Chọn bác sĩ</option>
                {doctors.map(doctor => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className='flex justify-between items-center mb-3'>
                <label className="block text-sm font-medium mb-1">Nội dung</label>
                <Button
                    type="button"
                    variant="default"
                    onClick={() => {
                      setSelectedField('content');
                      setShowFileManager(true);
                    }}
                  >
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Chèn hình ảnh từ thư viện
                </Button>
              </div>
              <CKEditorCustom
                value={blog.content || ''}
                onChange={(data) => setBlog({ ...blog, content: data })}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => router.push('/admin/blog')}
              >
                Hủy
              </Button>
              <Button onClick={handleSubmit}>
                {isEdit ? 'Cập nhật' : 'Thêm'} bài viết
              </Button>
            </div>
          </div>
        </CardContent>

      </Card>

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
