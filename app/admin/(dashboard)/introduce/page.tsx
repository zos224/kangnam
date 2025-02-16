"use client"

import { useEffect, useState } from 'react';
import { Language } from '@/utils/model';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/admin/ui/card';
import { Button } from '@/components/admin/ui/button';
import { Input } from '@/components/admin/ui/input';
import { Textarea } from '@/components/admin/ui/textarea';
import { useToast } from '@/components/admin/ToastProvider';
import { ImageIcon, Plus, Trash } from 'lucide-react';
import FileManager from '@/components/FileManager/FileManager';
import { Introduce} from "@/utils/model";

export default function IntroducePage() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [currentLanguage, setCurrentLanguage] = useState<Language>();
  const [introduce, setIntroduce] = useState<Introduce>({
    idLanguage: 0,
    features: [],
    beautySection: { description: '', image: '', contents: [] },
    customers: { title: '', list: [] },
    newsSection: { title: '', news: [] }
  });
  const [showFileManager, setShowFileManager] = useState(false);
  const [selectedField, setSelectedField] = useState<{
    type: string;
    index?: number;
    subType?: string;
  }>();

  const { showToast } = useToast();

  // Fetch functions
  const fetchLanguages = async () => {
    const res = await fetch('/api/language');
    const data = await res.json();
    setLanguages(data.data);
    if (data.data.length > 0) {
      setCurrentLanguage(data.data[0]);
    }
  };

  const fetchIntroduce = async (idLanguage: number) => {
    const res = await fetch(`/api/introduce?idLanguage=${idLanguage}`);
    const data = await res.json();
    if (data) {
      setIntroduce(data);
    } else {
      setIntroduce({
        idLanguage,
        features: [],
        beautySection: { description: '', image: '', contents: [] },
        customers: { title: '', list: [] },
        newsSection: { title: '', news: [] }
      });
    }
  };

  useEffect(() => {
    fetchLanguages();
  }, []);

  useEffect(() => {
    if (currentLanguage) {
      fetchIntroduce(currentLanguage.id);
    }
  }, [currentLanguage]);

  // Handle file selection
  const handleFileSelect = (url: string) => {
    if (!selectedField) return;

    switch (selectedField.type) {
      case 'banner':
        setIntroduce(prev => ({ ...prev, banner: url }));
        break;
      case 'feature':
        if (selectedField.index !== undefined) {
          const newFeatures = [...introduce.features];
          newFeatures[selectedField.index].image = url;
          setIntroduce(prev => ({ ...prev, features: newFeatures }));
        }
        break;
      case 'beautySection':
        setIntroduce(prev => ({
          ...prev,
          beautySection: { ...prev.beautySection, image: url }
        }));
        break;
      case 'customer':
        if (selectedField.index !== undefined) {
          const newCustomers = [...introduce.customers.list];
          newCustomers[selectedField.index].image = url;
          setIntroduce(prev => ({
            ...prev,
            customers: { ...prev.customers, list: newCustomers }
          }));
        }
        break;
      case 'news':
        if (selectedField.index !== undefined) {
          const newNews = [...introduce.newsSection.news];
          newNews[selectedField.index].logo = url;
          setIntroduce(prev => ({
            ...prev,
            newsSection: { ...prev.newsSection, news: newNews }
          }));
        }
        break;
    }
    setShowFileManager(false);
  };

  // Handle submit
  const handleSubmit = async () => {
    const method = introduce.id ? 'PUT' : 'POST';
    const res = await fetch('/api/introduce', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(introduce)
    });

    if (res.ok) {
      showToast('Cập nhật thành công!', 'success');
    } else {
      showToast('Có lỗi xảy ra!', 'error');
    }
  };

  return (
    <div className="space-y-4 p-8 pt-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Quản lý giới thiệu</h2>
        <select
          className="border rounded-md p-2"
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

      <Card>
        <CardHeader>
          <CardTitle>Thông tin chung</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Tiêu đề</label>
              <Input
                value={introduce.title || ''}
                onChange={(e) => setIntroduce(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Banner</label>
              <div className="flex items-center gap-2">
                <Input value={introduce.banner || ''} readOnly />
                <Button
                  type="button"
                  onClick={() => {
                    setSelectedField({ type: 'banner' });
                    setShowFileManager(true);
                  }}
                >
                  <ImageIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Mô tả 1</label>
              <Textarea
                value={introduce.description1 || ''}
                onChange={(e) => setIntroduce(prev => ({ ...prev, description1: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Mô tả 2</label>
              <Textarea
                value={introduce.description2 || ''}
                onChange={(e) => setIntroduce(prev => ({ ...prev, description2: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Đặc điểm</CardTitle>
          <Button
            onClick={() => setIntroduce(prev => ({
              ...prev,
              features: [...prev.features, { image: '', title: '', description: '' }]
            }))}
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm đặc điểm
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.isArray(introduce.features) && introduce.features.map((feature, index) => (
              <div key={index} className="flex gap-4 items-start border p-4 rounded-lg">
              <div className="flex-1 space-y-4">
                <div>
                <label className="text-sm font-medium">Hình ảnh</label>
                <div className="flex items-center gap-2">
                  <Input value={feature.image} readOnly />
                  <Button
                  type="button"
                  onClick={() => {
                    setSelectedField({ type: 'feature', index });
                    setShowFileManager(true);
                  }}
                  >
                  <ImageIcon className="h-4 w-4" />
                  </Button>
                </div>
                </div>
                <div>
                <label className="text-sm font-medium">Tiêu đề</label>
                    <Input
                      value={feature.title}
                      onChange={(e) => {
                        const newFeatures = [...introduce.features];
                        newFeatures[index].title = e.target.value;
                        setIntroduce(prev => ({ ...prev, features: newFeatures }));
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Mô tả</label>
                    <Textarea
                      value={feature.description}
                      onChange={(e) => {
                        const newFeatures = [...introduce.features];
                        newFeatures[index].description = e.target.value;
                        setIntroduce(prev => ({ ...prev, features: newFeatures }));
                      }}
                    />
                  </div>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => {
                    const newFeatures = [...introduce.features];
                    newFeatures.splice(index, 1);
                    setIntroduce(prev => ({ ...prev, features: newFeatures }));
                  }}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Beauty Section */}
      <Card>
        <CardHeader>
          <CardTitle>Phần làm đẹp</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="text-sm font-medium">Mô tả</label>
            <Textarea
              value={introduce.beautySection.description}
              onChange={(e) => setIntroduce(prev => ({
                ...prev,
                beautySection: { ...prev.beautySection, description: e.target.value }
              }))}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Hình ảnh</label>
            <div className="flex items-center gap-2">
              <Input value={introduce.beautySection.image} readOnly />
              <Button
                type="button"
                onClick={() => {
                  setSelectedField({ type: 'beautySection' });
                  setShowFileManager(true);
                }}
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-medium">Nội dung hấp dẫn</label>
              <Button
                onClick={() => setIntroduce(prev => ({
                  ...prev,
                  beautySection: {
                    ...prev.beautySection,
                    contents: [...prev.beautySection.contents, { idBlog: 0, title: '', description: '' }]
                  }
                }))}
              >
                <Plus className="h-4 w-4 mr-2" />
                Thêm nội dung
              </Button>
            </div>
            <div className="space-y-4">
              {introduce.beautySection.contents?.map((content, index) => (
                <div key={index} className="flex gap-4 items-start border p-4 rounded-lg">
                  <div className="flex-1 space-y-4">
                    <div>
                      <label className="text-sm font-medium">ID Blog</label>
                      <Input
                        type="number"
                        value={content.idBlog}
                        onChange={(e) => {
                          const newContents = [...introduce.beautySection.contents];
                          newContents[index].idBlog = parseInt(e.target.value);
                          setIntroduce(prev => ({
                            ...prev,
                            beautySection: { ...prev.beautySection, contents: newContents }
                          }));
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Tiêu đề</label>
                      <Input
                        value={content.title}
                        onChange={(e) => {
                          const newContents = [...introduce.beautySection.contents];
                          newContents[index].title = e.target.value;
                          setIntroduce(prev => ({
                            ...prev,
                            beautySection: { ...prev.beautySection, contents: newContents }
                          }));
                        }}
                      />
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      const newContents = [...introduce.beautySection.contents];
                      newContents.splice(index, 1);
                      setIntroduce(prev => ({
                        ...prev,
                        beautySection: { ...prev.beautySection, contents: newContents }
                      }));
                    }}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customers Section */}
      <Card>
        <CardHeader>
          <CardTitle>Khách hàng</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="text-sm font-medium">Tiêu đề</label>
            <Input
              value={introduce.customers.title}
              onChange={(e) => setIntroduce(prev => ({
                ...prev,
                customers: { ...prev.customers, title: e.target.value }
              }))}
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-medium">Danh sách khách hàng</label>
              <Button
                onClick={() => setIntroduce(prev => ({
                  ...prev,
                  customers: {
                    ...prev.customers,
                    list: [...prev.customers.list, { position: '', name: '', description: '', image: '' }]
                  }
                }))}
              >
                <Plus className="h-4 w-4 mr-2" />
                Thêm khách hàng
              </Button>
            </div>
            <div className="space-y-4">
              {introduce.customers.list?.map((customer, index) => (
                <div key={index} className="flex gap-4 items-start border p-4 rounded-lg">
                  <div className="flex-1 space-y-4">
                    <div>
                      <label className="text-sm font-medium">Hình ảnh</label>
                      <div className="flex items-center gap-2">
                        <Input value={customer.image} readOnly />
                        <Button
                          type="button"
                          onClick={() => {
                            setSelectedField({ type: 'customer', index });
                            setShowFileManager(true);
                          }}
                        >
                          <ImageIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Chức danh</label>
                      <Input
                        value={customer.position}
                        onChange={(e) => {
                          const newCustomers = [...introduce.customers.list];
                          newCustomers[index].position = e.target.value;
                          setIntroduce(prev => ({
                            ...prev,
                            customers: { ...prev.customers, list: newCustomers }
                          }));
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Tên</label>
                      <Input
                        value={customer.name}
                        onChange={(e) => {
                          const newCustomers = [...introduce.customers.list];
                          newCustomers[index].name = e.target.value;
                          setIntroduce(prev => ({
                            ...prev,
                            customers: { ...prev.customers, list: newCustomers }
                          }));
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Mô tả</label>
                      <Textarea
                        value={customer.description}
                        onChange={(e) => {
                          const newCustomers = [...introduce.customers.list];
                          newCustomers[index].description = e.target.value;
                          setIntroduce(prev => ({
                            ...prev,
                            customers: { ...prev.customers, list: newCustomers }
                          }));
                        }}
                      />
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      const newCustomers = [...introduce.customers.list];
                      newCustomers.splice(index, 1);
                      setIntroduce(prev => ({
                        ...prev,
                        customers: { ...prev.customers, list: newCustomers }
                      }));
                    }}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* News Section */}
      <Card>
        <CardHeader>
          <CardTitle>Báo chí</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="text-sm font-medium">Tiêu đề</label>
            <Input
              value={introduce.newsSection.title}
              onChange={(e) => setIntroduce(prev => ({
                ...prev,
                newsSection: { ...prev.newsSection, title: e.target.value }
              }))}
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-medium">Danh sách báo</label>
              <Button
                onClick={() => setIntroduce(prev => ({
                  ...prev,
                  newsSection: {
                    ...prev.newsSection,
                    news: [...prev.newsSection.news, { logo: '', url: '' }]
                  }
                }))}
              >
                <Plus className="h-4 w-4 mr-2" />
                Thêm báo
              </Button>
            </div>
            <div className="space-y-4">
              {introduce.newsSection.news?.map((news, index) => (
                <div key={index} className="flex gap-4 items-start border p-4 rounded-lg">
                  <div className="flex-1 space-y-4">
                    <div>
                      <label className="text-sm font-medium">Logo</label>
                      <div className="flex items-center gap-2">
                        <Input value={news.logo} readOnly />
                        <Button
                          type="button"
                          onClick={() => {
                            setSelectedField({ type: 'news', index });
                            setShowFileManager(true);
                          }}
                        >
                          <ImageIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">URL</label>
                      <Input
                        value={news.url}
                        onChange={(e) => {
                          const newNews = [...introduce.newsSection.news];
                          newNews[index].url = e.target.value;
                          setIntroduce(prev => ({
                            ...prev,
                            newsSection: { ...prev.newsSection, news: newNews }
                          }));
                        }}
                      />
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      const newNews = [...introduce.newsSection.news];
                      newNews.splice(index, 1);
                      setIntroduce(prev => ({
                        ...prev,
                        newsSection: { ...prev.newsSection, news: newNews }
                      }));
                    }}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSubmit}>
          {introduce.id ? 'Cập nhật' : 'Thêm mới'}
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