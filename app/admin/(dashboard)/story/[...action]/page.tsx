"use client"

import { use, useEffect, useState } from 'react';
import { Story } from '@/utils/model';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/admin/ui/card';
import { Button } from '@/components/admin/ui/button';
import { Input } from '@/components/admin/ui/input';
import { useToast } from '@/components/admin/ToastProvider';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import FileManager from '@/components/FileManager/FileManager';
import { ImageIcon } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Textarea } from '@/components/admin/ui/textarea';

const CKEditorCustom = dynamic(() => import('@/components/admin/CKEditor'), { 
  ssr: false, 
  loading: () => <div>Đang tải trình soạn thảo...</div> 
});

export default function StoryForm({ params }: { params: Promise<{action: string[]}> }) {
  const paramData = use(params);
  const [story, setStory] = useState<Partial<Story>>({
    title: '',
    serviceUsed: '',
    content: '',
    img: ''
  });
  const [showFileManager, setShowFileManager] = useState(false);
  const [selectedField, setSelectedField] = useState<'thumbnail' | 'content'>('thumbnail');

  const router = useRouter();
  const { showToast } = useToast();
  const isEdit = paramData.action[0] === 'edit';

  useEffect(() => {
    if (isEdit && paramData.action[1]) {
      fetchStory(parseInt(paramData.action[1]));
    }
  }, [isEdit, paramData.action]);

  const fetchStory = async (id: number) => {
    try {
      const res = await fetch(`/api/story/${id}`);
      const data = await res.json();
      setStory(data);
    } catch (error) {
      console.error('Failed to fetch story:', error);
      showToast('Có lỗi xảy ra khi tải dữ liệu.', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch('/api/story', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(story)
      });

      if (res.ok) {
        showToast(
          `${isEdit ? 'Cập nhật' : 'Thêm'} câu chuyện thành công!`,
          'success'
        );
        router.push('/admin/story');
      } else {
        throw new Error('Failed to save story');
      }
    } catch (error) {
      console.error('Failed to save story:', error);
      showToast(
        `Có lỗi xảy ra khi ${isEdit ? 'cập nhật' : 'thêm'} câu chuyện.`,
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
      setStory({ ...story, img: url });
    } else {
      getImageSize(url)
        .then((dimensions) => {
          const img = `<figure class="image"><img style="${"aspect-ratio:" + dimensions.width + "/" + dimensions.height}" src="${url}" width="${dimensions.width}" height="${dimensions.height}"></figure>`;
          setStory({ ...story, content: story.content + img });
        })
        .catch((err) => console.error('Failed to get image size:', err));
    }
    setShowFileManager(false);
  };

  return (
    <div className="space-y-4 p-8">
      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? 'Chỉnh sửa' : 'Thêm'} câu chuyện khách hàng</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">Tiêu đề</label>
              <Input
                value={story.title}
                onChange={(e) => setStory({ ...story, title: e.target.value })}
                placeholder="Nhập tiêu đề câu chuyện"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Dịch vụ sử dụng</label>
              <Textarea
                placeholder="Dịch vụ hỗ trợ (mỗi dòng một dịch vụ)"
                value={story.serviceUsed?.split(",").join('\n')}
                onChange={(e) => {
                  setStory({...story, serviceUsed: e.target.value.split('\n').join(",")});
                }}
                required
              />
            </div>

            

            <div>
              <label className="block text-sm font-medium mb-1">Hình ảnh</label>
              <div className="flex items-center space-x-4">
                {story.img && (
                  <Image
                    src={story.img}
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
                value={story.content || ''}
                onChange={(data) => setStory({ ...story, content: data })}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/story')}
              >
                Hủy
              </Button>
              <Button type="submit">
                {isEdit ? 'Cập nhật' : 'Thêm'} câu chuyện
              </Button>
            </div>
          </form>
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