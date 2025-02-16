"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/admin/ui/tabs';
import { useEffect, useState } from 'react';
import { Language, HomeContent } from '@/utils/model';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/admin/ui/card';
import { useToast } from '@/components/admin/ToastProvider';
import { Input } from '@/components/admin/ui/input';
import { Textarea } from '@/components/admin/ui/textarea';
import FileManager from '@/components/FileManager/FileManager';
import { Button } from '@/components/admin/ui/button';
import { PlusCircle, X } from 'lucide-react';
import Image from 'next/image';

interface HinhAnhKhachHang {
  title: string;
  images: string[];
}

interface DoiNguBacSi {
  banner: string;
  title: string;
  description: string;
}

interface Banner {
  image: string;
  blogId: string;
}

export default function HomeContentPage() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [currentLanguage, setCurrentLanguage] = useState<Language>();
  const [homeContent, setHomeContent] = useState<HomeContent>();
  const [showFileManager, setShowFileManager] = useState(false);
  const [selectedField, setSelectedField] = useState<string>('');
  const [selectedItemIndex, setSelectedItemIndex] = useState<number>(-1);

  const { showToast } = useToast();

  const fetchLanguages = async () => {
    const res = await fetch('/api/language');
    const data = await res.json();
    setLanguages(data.data);
    setCurrentLanguage(data.data[0]);
  };

  const fetchHomeContent = async (idLanguage: number) => {
    const res = await fetch(`/api/home-content?idLanguage=${idLanguage}`);
    const data = await res.json();
    setHomeContent(data);
  };

  useEffect(() => {
    fetchLanguages();
  }, []);

  useEffect(() => {
    if (currentLanguage) fetchHomeContent(currentLanguage.id);
  }, [currentLanguage]);

  const handleFileSelect = (url: string) => {
    if (!homeContent) return;

    if (selectedField === 'banners') {
      setHomeContent({
        ...homeContent,
        banners: [...(Array.isArray(homeContent.banners) ? homeContent.banners : []), { image: url, blogId: '' }]
      });
    } else if (selectedField === 'doiNguBacSi.banner') {
      setHomeContent({
        ...homeContent,
        doiNguBacSi: {
          ...homeContent.doiNguBacSi as DoiNguBacSi,
          banner: url
        }
      });
    } else if (selectedField === 'hinhAnhKhachHang.images') {
      setHomeContent({
        ...homeContent,
        hinhAnhKhachHang: {
          ...(homeContent.hinhAnhKhachHang as HinhAnhKhachHang),
          images: Array.isArray((homeContent.hinhAnhKhachHang as HinhAnhKhachHang).images) ? [...(homeContent.hinhAnhKhachHang as HinhAnhKhachHang).images, url] : [url]
        }
      });
    }
    setShowFileManager(false);
  };

  const handleSubmit = async () => {
    if (!homeContent || !currentLanguage) return;

    const method = homeContent.id ? 'PUT' : 'POST';
    const res = await fetch('/api/home-content', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...homeContent,
        idLanguage: currentLanguage.id
      })
    });

    if (res.ok) {
      showToast('Cập nhật nội dung thành công!', 'success');
    } else {
      showToast('Có lỗi xảy ra khi cập nhật nội dung.', 'error');
    }
  };

  return (
    <div className="w-full">
      <Card className="mb-4">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Nội dung trang chủ</CardTitle>
            <div className="w-72">
              <select
                className="w-full border rounded-md p-2"
                value={currentLanguage?.id}
                onChange={(e) => {
                  const lang = languages.find(l => l.id === parseInt(e.target.value));
                  setCurrentLanguage(lang);
                }}
              >
                {languages.map(lang => (
                  <option key={lang.id} value={lang.id}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>
      </Card>

      {homeContent && (
        <Tabs defaultValue="banners" className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="banners">Banner</TabsTrigger>
            <TabsTrigger value="hinhanh">Hình ảnh khách hàng</TabsTrigger>
            <TabsTrigger value="bacsi">Đội ngũ bác sĩ</TabsTrigger>
          </TabsList>

            <TabsContent value="banners">
            <Card>
              <CardHeader>
              <CardTitle>Quản lý Banner</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {(Array.isArray(homeContent.banners) ? homeContent.banners : [])?.map((banner, index) => (
                    <div key={index} className="relative">
                      <div className="border rounded-lg p-4">
                        <Image 
                          src={banner.image} 
                          width={0}
                          height={0}
                          sizes="100vw"
                          alt="" 
                          className="w-full h-48 object-cover rounded mb-3" 
                        />
                        <div className="space-y-2">
                          <label className="block text-sm font-medium">ID Bài viết</label>
                          <div className="flex gap-2">
                            <Input
                              value={banner.blogId || ''}
                              onChange={(e) => {
                                const newBanners = [...(homeContent.banners as Banner[])];
                                newBanners[index] = {
                                  ...newBanners[index],
                                  blogId: e.target.value
                                };
                                setHomeContent({...homeContent, banners: newBanners});
                              }}
                              placeholder="Nhập ID bài viết"
                            />
                            <button
                              className="absolute top-0 right-0 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                              onClick={() => {
                                const newBanners = (homeContent.banners as Banner[]).filter((_, i) => i !== index);
                                setHomeContent({...homeContent, banners: newBanners});
                              }}
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    className="w-full h-[272px] border-2 border-dashed rounded-lg flex items-center justify-center"
                    onClick={() => {
                      setSelectedField('banners');
                      setShowFileManager(true);
                    }}
                  >
                    <PlusCircle className="w-8 h-8 text-gray-400" />
                  </button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hinhanh">
            <Card>
              <CardHeader>
                <CardTitle>Hình ảnh khách hàng</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  className="mb-4"
                  placeholder="Tiêu đề"
                  value={(homeContent.hinhAnhKhachHang as HinhAnhKhachHang)?.title || ''}
                  onChange={(e) => setHomeContent({
                    ...homeContent,
                    hinhAnhKhachHang: {
                      ...(homeContent.hinhAnhKhachHang as HinhAnhKhachHang),
                      title: e.target.value
                    }
                  })}
                />
                
                <div className="grid grid-cols-4 gap-4">
                  {(homeContent.hinhAnhKhachHang as HinhAnhKhachHang)?.images?.map((image, index) => (
                    <div key={index} className="relative">
                      <Image width={0} height={0} sizes='100vw' src={image} alt="" className="w-full h-32 object-cover rounded" />
                      <button
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full"
                        onClick={() => {
                          const newImages = (homeContent.hinhAnhKhachHang as HinhAnhKhachHang).images.filter((_, i) => i !== index);
                          setHomeContent({
                            ...homeContent,
                            hinhAnhKhachHang: {
                              ...(homeContent.hinhAnhKhachHang as HinhAnhKhachHang),
                              images: newImages
                            }
                          });
                        }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    className="w-full h-32 border-2 border-dashed rounded flex items-center justify-center"
                    onClick={() => {
                      setSelectedField('hinhAnhKhachHang.images');
                      setShowFileManager(true);
                    }}
                  >
                    <PlusCircle className="w-8 h-8 text-gray-400" />
                  </button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bacsi">
            <Card>
              <CardHeader>
                <CardTitle>Đội ngũ bác sĩ</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Banner</label>
                    {(homeContent.doiNguBacSi as DoiNguBacSi)?.banner && (
                      <Image
                        src={(homeContent.doiNguBacSi as DoiNguBacSi).banner}
                        alt="Banner"
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="w-full h-40 object-cover rounded mb-2"
                      />
                    )}
                    <Button
                      onClick={() => {
                        setSelectedField('doiNguBacSi.banner');
                        setShowFileManager(true);
                      }}
                    >
                      Chọn banner
                    </Button>
                  </div>
                  
                  <Input
                    placeholder="Tiêu đề"
                    value={(homeContent.doiNguBacSi as DoiNguBacSi)?.title || ''}
                    onChange={(e) => setHomeContent({
                      ...homeContent,
                      doiNguBacSi: {
                        ...(homeContent.doiNguBacSi as DoiNguBacSi),
                        title: e.target.value
                      }
                    })}
                  />
                  
                  <Textarea
                    placeholder="Mô tả"
                    value={(homeContent.doiNguBacSi as DoiNguBacSi)?.description || ''}
                    onChange={(e) => setHomeContent({
                      ...homeContent,
                      doiNguBacSi: {
                        ...(homeContent.doiNguBacSi as DoiNguBacSi),
                        description: e.target.value
                      }
                    })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

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

      <div className="fixed bottom-4 right-4">
        <Button onClick={handleSubmit}>
          Lưu thay đổi
        </Button>
      </div>
    </div>
  );
} 