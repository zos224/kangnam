"use client"

import { useEffect, useState } from 'react';
import { Facilities, Language } from '@/utils/model';
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

export default function FacilitiesPage() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [currentLanguage, setCurrentLanguage] = useState<Language>();
  const [facilities, setFacilities] = useState<Facilities>({
    idLanguage: 0,
    features: [],
    bigFeatures: []
  });
  const [showFileManager, setShowFileManager] = useState(false);
  const [selectedField, setSelectedField] = useState<{
    type: string;
    index?: number;
    subIndex?: number;
  }>();

  const { showToast } = useToast();

  const fetchLanguages = async () => {
    const res = await fetch('/api/language');
    const data = await res.json();
    setLanguages(data.data);
    if (data.data.length > 0) {
      setCurrentLanguage(data.data[0]);
    }
  };

  const fetchFacilities = async (idLanguage: number) => {
    const res = await fetch(`/api/facilities?idLanguage=${idLanguage}`);
    const data = await res.json();
    if (data) {
      setFacilities(data);
    } else {
      setFacilities({
        idLanguage,
        features: [],
        bigFeatures: []
      });
    }
  };

  useEffect(() => {
    fetchLanguages();
  }, []);

  useEffect(() => {
    if (currentLanguage) {
      fetchFacilities(currentLanguage.id);
    }
  }, [currentLanguage]);

  const handleFileSelect = (url: string) => {
    if (!selectedField) return;

    switch (selectedField.type) {
      case 'banner':
        setFacilities(prev => ({ ...prev, banner: url }));
        break;
      case 'feature':
        if (selectedField.index !== undefined) {
          const newFeatures = [...facilities.features];
          newFeatures[selectedField.index].image = url;
          setFacilities(prev => ({ ...prev, features: newFeatures }));
        }
        break;
      case 'bigFeature':
        if (selectedField.index !== undefined && selectedField.subIndex !== undefined) {
          const newBigFeatures = [...facilities.bigFeatures];
          newBigFeatures[selectedField.index].images[selectedField.subIndex] = url;
          setFacilities(prev => ({ ...prev, bigFeatures: newBigFeatures }));
        }
        break;
    }
    setShowFileManager(false);
  };

  const handleSubmit = async () => {
    const method = facilities.id ? 'PUT' : 'POST';
    const res = await fetch('/api/facilities', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(facilities)
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
        <h2 className="text-3xl font-bold tracking-tight">Quản lý cơ sở vật chất</h2>
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

      {/* Thông tin chung */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin chung</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Tiêu đề</label>
              <Input
                value={facilities.title || ''}
                onChange={(e) => setFacilities(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Banner</label>
              <div className="flex items-center gap-2">
                <Input value={facilities.banner || ''} readOnly />
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
                value={facilities.description1 || ''}
                onChange={(e) => setFacilities(prev => ({ ...prev, description1: e.target.value }))}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Mô tả 2</label>
              <Textarea
                value={facilities.description2 || ''}
                onChange={(e) => setFacilities(prev => ({ ...prev, description2: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Đặc điểm</CardTitle>
          <Button
            onClick={() => setFacilities(prev => ({
              ...prev,
              features: [...prev.features, { title: '', description: '', image: '' }]
            }))}
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm đặc điểm
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {facilities.features.map((feature, index) => (
              <div key={index} className="flex gap-4 items-start border p-4 rounded-lg">
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="text-sm font-medium">Tiêu đề</label>
                    <Input
                      value={feature.title}
                      onChange={(e) => {
                        const newFeatures = [...facilities.features];
                        newFeatures[index].title = e.target.value;
                        setFacilities(prev => ({ ...prev, features: newFeatures }));
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Mô tả</label>
                    <Textarea
                      value={feature.description}
                      onChange={(e) => {
                        const newFeatures = [...facilities.features];
                        newFeatures[index].description = e.target.value;
                        setFacilities(prev => ({ ...prev, features: newFeatures }));
                      }}
                    />
                  </div>
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
                </div>
                <Button
                  variant="ghost"
                  onClick={() => {
                    const newFeatures = [...facilities.features];
                    newFeatures.splice(index, 1);
                    setFacilities(prev => ({ ...prev, features: newFeatures }));
                  }}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Big Features */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Đặc điểm nổi bật</CardTitle>
          <Button
            onClick={() => setFacilities(prev => ({
              ...prev,
              bigFeatures: [...prev.bigFeatures, { title: '', description: '', images: [''] }]
            }))}
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm đặc điểm nổi bật
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {facilities.bigFeatures.map((feature, index) => (
              <div key={index} className="flex gap-4 items-start border p-4 rounded-lg">
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="text-sm font-medium">Tiêu đề</label>
                    <Input
                      value={feature.title}
                      onChange={(e) => {
                        const newFeatures = [...facilities.bigFeatures];
                        newFeatures[index].title = e.target.value;
                        setFacilities(prev => ({ ...prev, bigFeatures: newFeatures }));
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Mô tả</label>
                    <Textarea
                      value={feature.description}
                      onChange={(e) => {
                        const newFeatures = [...facilities.bigFeatures];
                        newFeatures[index].description = e.target.value;
                        setFacilities(prev => ({ ...prev, bigFeatures: newFeatures }));
                      }}
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="text-sm font-medium">Hình ảnh</label>
                      <Button
                        onClick={() => {
                          const newFeatures = [...facilities.bigFeatures];
                          newFeatures[index].images.push('');
                          setFacilities(prev => ({ ...prev, bigFeatures: newFeatures }));
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm hình ảnh
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {feature.images.map((image, subIndex) => (
                        <div key={subIndex} className="flex items-center gap-2">
                          <Input value={image} readOnly />
                          <Button
                            type="button"
                            onClick={() => {
                              setSelectedField({ type: 'bigFeature', index, subIndex });
                              setShowFileManager(true);
                            }}
                          >
                            <ImageIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => {
                              const newFeatures = [...facilities.bigFeatures];
                              newFeatures[index].images.splice(subIndex, 1);
                              setFacilities(prev => ({ ...prev, bigFeatures: newFeatures }));
                            }}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => {
                    const newFeatures = [...facilities.bigFeatures];
                    newFeatures.splice(index, 1);
                    setFacilities(prev => ({ ...prev, bigFeatures: newFeatures }));
                  }}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSubmit}>
          {facilities.id ? 'Cập nhật' : 'Thêm mới'}
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