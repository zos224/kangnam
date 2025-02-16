"use client"

import { Tabs, TabsContent } from '@/components/admin/ui/tabs';
import { useEffect, useState } from 'react';
import { Language, Setting } from '@/utils/model';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/admin/ui/card';
import { useToast } from '@/components/admin/ToastProvider';
import { Input } from '@/components/admin/ui/input';
import FileManager from '@/components/FileManager/FileManager';

export default function SettingPage() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [currentLanguage, setCurrentLanguage] = useState<Language>();
  const [setting, setSetting] = useState<Setting>();
  const [showFileManager, setShowFileManager] = useState(false);
  const [selectedField, setSelectedField] = useState<keyof Setting>();

  const { showToast, hideToast } = useToast();

  const fetchLanguages = async () => {
    const res = await fetch('/api/language');
    const data = await res.json();
    setLanguages(data.data);
    if (data.data.length > 0) {
      setCurrentLanguage(data.data[0]);
    }
  };

  const fetchSetting = async (idLanguage: number) => {
    const res = await fetch(`/api/setting?idLanguage=${idLanguage}`);
    const data = await res.json();
    setSetting(data);
  };

  useEffect(() => {
    fetchLanguages();
  }, []);

  useEffect(() => {
    if (currentLanguage) {
      fetchSetting(currentLanguage.id);
    }
  }, [currentLanguage]);

  const handleSubmit = async () => {
    const method = setting?.id ? 'PUT' : 'POST';
    const res = await fetch('/api/setting', {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(setting)
    });

    if (res.ok) {
      showToast('Cập nhật cài đặt thành công!', 'success');
      setTimeout(() => {
        hideToast();
      }, 3000);
    } else {
      showToast('Có lỗi xảy ra khi cập nhật cài đặt.', 'error');
      setTimeout(() => {
        hideToast();
      }, 3000);
    }
  };

  const handleFileSelect = (url: string) => {
    if (selectedField && url) {
      setSetting(prev => ({
        ...prev!,
        [selectedField]: url
      }));
    }
    setShowFileManager(false);
  };

  return (
    <Tabs defaultValue="setting" className="w-full">
      <TabsContent value="setting">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Cài đặt website</CardTitle>
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
          <CardContent>
            <div className="space-y-6">
              {setting && (
                <form className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Tên website
                      </label>
                      <Input
                        value={setting.name}
                        onChange={(e) => setSetting({...setting, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Hotline
                      </label>
                      <Input
                        value={setting.hotline}
                        onChange={(e) => setSetting({...setting, hotline: e.target.value})}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Facebook URL
                      </label>
                      <Input
                        value={setting.urlFacebook}
                        onChange={(e) => setSetting({...setting, urlFacebook: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Youtube URL
                      </label>
                      <Input
                        value={setting.urlYoutube}
                        onChange={(e) => setSetting({...setting, urlYoutube: e.target.value})}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Instagram URL
                      </label>
                      <Input
                        value={setting.urlInstagram}
                        onChange={(e) => setSetting({...setting, urlInstagram: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        TikTok URL
                      </label>
                      <Input
                        value={setting.urlTiktok}
                        onChange={(e) => setSetting({...setting, urlTiktok: e.target.value})}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Logo
                      </label>
                      <Input
                        value={setting.logo}
                        readOnly
                        onClick={() => {
                          setSelectedField('logo');
                          setShowFileManager(true);
                        }}
                      />
                      {setting.logo && (
                        <div className="mt-2">
                          <img src={setting.logo} alt="Logo" className="max-h-20 object-contain" />
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Favicon
                      </label>
                      <Input
                        value={setting.favicon}
                        readOnly
                        onClick={() => {
                          setSelectedField('favicon');
                          setShowFileManager(true);
                        }}
                      />
                      {setting.favicon && (
                        <div className="mt-2">
                          <img src={setting.favicon} alt="Favicon" className="max-h-20 object-contain" />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Banner Story
                      </label>
                      <Input
                        value={setting.bannerStory}
                        readOnly
                        onClick={() => {
                          setSelectedField('bannerStory');
                          setShowFileManager(true);
                        }}
                      />
                      {setting.bannerStory && (
                        <div className="mt-2">
                          <img src={setting.bannerStory} alt="Banner Story" className="max-h-20 object-contain" />
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Banner Blog
                      </label>
                      <Input
                        value={setting.bannerBlog}
                        readOnly
                        onClick={() => {
                          setSelectedField('bannerBlog');
                          setShowFileManager(true);
                        }}
                      />
                      {setting.bannerBlog && (
                        <div className="mt-2">
                          <img src={setting.bannerBlog} alt="Banner Blog" className="max-h-20 object-contain" />
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Thời gian làm việc
                        </label>
                        <Input
                          value={setting.workTime || ""}
                          onChange={(e) => setSetting({...setting, workTime: e.target.value})}
                          placeholder="Nhập thời gian làm việc"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Tiêu đề footer
                        </label>
                        <Input
                          value={setting.titleFooter || ""}
                          onChange={(e) => setSetting({...setting, titleFooter: e.target.value})}
                          placeholder="Nhập tiêu đề footer"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Chi tiết footer
                      </label>
                      <textarea
                        className="w-full border rounded-md p-2 min-h-[100px]"
                        value={setting.detailFooter || ""}
                        onChange={(e) => setSetting({...setting, detailFooter: e.target.value})}
                        placeholder="Nhập chi tiết footer"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          ID Chính sách bảo mật
                        </label>
                        <Input
                          type="number"
                          value={setting.idChinhSachBaoMat || ''}
                          onChange={(e) => setSetting({...setting, idChinhSachBaoMat: parseInt(e.target.value)})}
                          placeholder="Nhập ID blog"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          ID Điều khoản sử dụng
                        </label>
                        <Input
                          type="number"
                          value={setting.idDieuKhoanSuDung || ''}
                          onChange={(e) => setSetting({...setting, idDieuKhoanSuDung: parseInt(e.target.value)})}
                          placeholder="Nhập ID blog"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          ID Chính sách riêng tư
                        </label>
                        <Input
                          type="number"
                          value={setting.idChinhSachRiengTu || ''}
                          onChange={(e) => setSetting({...setting, idChinhSachRiengTu: parseInt(e.target.value)})}
                          placeholder="Nhập ID blog"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          ID Quy trình kiểm soát
                        </label>
                        <Input
                          type="number"
                          value={setting.idQuyTrinhKiemSoat || ''}
                          onChange={(e) => setSetting({...setting, idQuyTrinhKiemSoat: parseInt(e.target.value)})}
                          placeholder="Nhập ID blog"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          ID Tiêu chuẩn chất lượng
                        </label>
                        <Input
                          type="number"
                          value={setting.idTieuChuanChatLuong || ''}
                          onChange={(e) => setSetting({...setting, idTieuChuanChatLuong: parseInt(e.target.value)})}
                          placeholder="Nhập ID blog"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
                      onClick={handleSubmit}
                    >
                      Lưu thay đổi
                    </button>
                  </div>
                </form>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

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
              <FileManager handleSelectFile={(url: string) => handleFileSelect(url)} />
            </div>
          </div>
        </div>
      )}
    </Tabs>
  );
}
