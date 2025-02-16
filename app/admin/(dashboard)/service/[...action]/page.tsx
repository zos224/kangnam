"use client";

import { useEffect, useState, use } from "react";
import { Service, Language, ServiceItem, Department } from "@/utils/model";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Textarea } from "@/components/admin/ui/textarea";
import { useToast } from "@/components/admin/ToastProvider";
import { useRouter } from "next/navigation";
import FileManager from "@/components/FileManager/FileManager";
import { ImageIcon, Plus, X } from "lucide-react";
import Image from "next/image";

interface ServiceContent {
  fullTitle: string;
  introduction: string;
  videos: string[];
  banner: string;
  features: {
    title: string;
    description: string;
    image: string;
  }[];
  resultTitle: string;
}

export default function ServiceForm({ params }: { params: Promise<{ action: string[] }> }) {
  const paramData = use(params);
  const [service, setService] = useState<Partial<Service>>({
    name: "",
    description: "",
    content: {} as ServiceContent,
    idLanguage: 0,
  });
  const [serviceItems, setServiceItems] = useState<Partial<ServiceItem>[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [showFileManager, setShowFileManager] = useState(false);
  const [selectedField, setSelectedField] = useState<{
    type: "banner" | "feature" | "serviceItem" | "customerImage" | "bannerLeft" | "bannerRight";
    index?: number;
    itemIndex?: number;
  }>({ type: "banner" });

  const router = useRouter();
  const { showToast } = useToast();
  const isEdit = paramData.action[0] === "edit";

  useEffect(() => {
    fetchLanguages();
    if (service.idLanguage != 0) {
      fetchDepartments();
    } 
    if (isEdit && paramData.action[1]) {
      fetchService(parseInt(paramData.action[1]));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, paramData.action[1], service.idLanguage]);

  const fetchLanguages = async () => {
    try {
      const res = await fetch("/api/language");
      const data = await res.json();
      setLanguages(data.data);
      if (!isEdit && data.data.length > 0) {
        const defaultLang = data.data.find((l: Language) => l.using) || data.data[0];
        setService((prev) => ({ ...prev, idLanguage: defaultLang.id }));
      }
    } catch (error) {
      console.error("Failed to fetch languages:", error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await fetch("/api/department?idLanguage=" + service.idLanguage);
      const data = await res.json();
      setDepartments(data);
      if (!isEdit && data.length > 0) {
        setService(prev => ({ ...prev, idDepartment: data[0].id }));
      }
    } catch (error) {
      console.error("Failed to fetch departments:", error);
    }
  };

  const fetchService = async (id: number) => {
    try {
      const res = await fetch(`/api/service?id=${id}`);
      const data = await res.json();
      setService({
        id: data.id,
        name: data.name,
        description: data.description,
        descriptionPrice: data.descriptionPrice,
        content: data.content,
        idLanguage: data.idLanguage,
        idDepartment: data.idDepartment,
      });
      setServiceItems(data.serviceItems);
    } catch (error) {
      console.error("Failed to fetch service:", error);
    }
  };

  const handleFileSelect = (url: string) => {
    const content = service.content as ServiceContent;
    switch (selectedField.type) {
      case "banner":
        setService((prev) => ({
          ...prev,
          content: { ...content, banner: url },
        }));
        break;
      case "feature":
        if (selectedField.index !== undefined) {
          const features = [...(content.features || [])];
          features[selectedField.index].image = url;
          setService((prev) => ({
            ...prev,
            content: { ...content, features },
          }));
        }
        break;
      case "serviceItem":
        if (selectedField.index !== undefined) {
          const items = [...serviceItems];
          items[selectedField.index].img = url;
          setServiceItems(items);
        }
        break;
      case "customerImage":
        if (selectedField.index !== undefined && selectedField.itemIndex !== undefined) {
          const items = [...serviceItems];
          const imgCustomer = [...(items[selectedField.index].imgCustomer || [])];
          imgCustomer[selectedField.itemIndex] = url;
          items[selectedField.index].imgCustomer = imgCustomer;
          setServiceItems(items);
        }
        break;
      case "bannerLeft":
        if (selectedField.index !== undefined) {
          const items = [...serviceItems];
          items[selectedField.index].bannerLeft = url;
          setServiceItems(items);
        }
        break;
      case "bannerRight":
        if (selectedField.index !== undefined) {
          const items = [...serviceItems];
          items[selectedField.index].bannerRight = url;
          setServiceItems(items);
        }
        break;
    }
    setShowFileManager(false);
  };

  const addFeature = () => {
    const content = service.content as ServiceContent;
    setService((prev) => ({
      ...prev,
      content: {
        ...content,
        features: [...(content.features || []), { title: "", description: "", image: "" }],
      },
    }));
  };

  const removeFeature = (index: number) => {
    const content = service.content as ServiceContent;
    const features = (content.features || []).filter((_, i) => i !== index);
    setService((prev) => ({
      ...prev,
      content: { ...content, features },
    }));
  };

  const addServiceItem = () => {
    setServiceItems((prev) => [...prev, { name: "", price: 0, img: "", imgCustomer: [] }]);
  };

  const removeServiceItem = (index: number) => {
    setServiceItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch("/api/service", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...service,
          serviceItems,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error);
      }

      showToast(`${isEdit ? "Cập nhật" : "Thêm"} dịch vụ thành công!`, "success");
      router.push("/admin/service");
    } catch (error: any) {
      showToast(
        error.message || `Có lỗi xảy ra khi ${isEdit ? "cập nhật" : "thêm"} dịch vụ.`,
        "error"
      );
    }
  };

  return (
    <div className="space-y-4 p-8 pt-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">
          {isEdit ? "Chỉnh sửa" : "Thêm"} dịch vụ
        </h2>
        <div className="flex gap-4">
          <select
            className="border rounded-md p-2"
            value={service.idLanguage}
            onChange={(e) =>
              setService((prev) => ({
                ...prev,
                idLanguage: parseInt(e.target.value),
              }))
            }
          >
            {languages.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.name}
              </option>
            ))}
          </select>
          
          <select
            className="border rounded-md p-2"
            value={service.idDepartment}
            onChange={(e) =>
              setService((prev) => ({
                ...prev,
                idDepartment: parseInt(e.target.value),
              }))
            }
          >
            <option value="">Chọn chuyên khoa</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Thông tin cơ bản */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin cơ bản</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div>
              <label className="text-sm font-medium">Tên dịch vụ</label>
              <Input
                value={service.name}
                onChange={(e) =>
                  setService((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                placeholder="Nhập tên dịch vụ"
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                Mô tả ngắn cho trang hình ảnh khách hàng
              </label>
              <Textarea
                value={service.description}
                onChange={(e) =>
                  setService((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Nhập mô tả ngắn về dịch vụ"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Mô tả ngắn cho trang bảng giá</label>
              <Textarea
                value={service.descriptionPrice}
                onChange={(e) =>
                  setService((prev) => ({
                    ...prev,
                    descriptionPrice: e.target.value,
                  }))
                }
                placeholder="Nhập mô tả ngắn về dịch vụ"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Nội dung chi tiết */}
      <Card>
        <CardHeader>
          <CardTitle>Nội dung chi tiết</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Tiêu đề đầy đủ */}
          <div>
            <label className="text-sm font-medium">Tiêu đề đầy đủ</label>
            <Input
              value={(service.content as ServiceContent)?.fullTitle || ""}
              onChange={(e) => {
                const content = service.content as ServiceContent;
                setService((prev) => ({
                  ...prev,
                  content: { ...content, fullTitle: e.target.value },
                }));
              }}
              placeholder="Nhập tiêu đề đầy đủ"
            />
          </div>

          {/* Giới thiệu */}
          <div>
            <label className="text-sm font-medium">Giới thiệu</label>
            <Textarea
              value={(service.content as ServiceContent)?.introduction || ""}
              onChange={(e) => {
                const content = service.content as ServiceContent;
                setService((prev) => ({
                  ...prev,
                  content: { ...content, introduction: e.target.value },
                }));
              }}
              placeholder="Nhập nội dung giới thiệu"
            />
          </div>

          {/* Videos */}
          <div>
            <label className="text-sm font-medium">Videos (URL)</label>
            <div className="space-y-2">
              {(service.content as ServiceContent)?.videos?.map((url, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={url}
                    onChange={(e) => {
                      const content = service.content as ServiceContent;
                      const videos = [...content.videos];
                      videos[index] = e.target.value;
                      setService((prev) => ({
                        ...prev,
                        content: { ...content, videos },
                      }));
                    }}
                    placeholder="Nhập URL video"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      const content = service.content as ServiceContent;
                      const videos = (content.videos || []).filter((_, i) => i !== index);
                      setService((prev) => ({
                        ...prev,
                        content: { ...content, videos },
                      }));
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => {
                  const content = service.content as ServiceContent;
                  setService((prev) => ({
                    ...prev,
                    content: {
                      ...content,
                      videos: [...(content.videos || []), ""],
                    },
                  }));
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Thêm video
              </Button>
            </div>
          </div>

          {/* Banner */}
          <div>
            <label className="text-sm font-medium">Banner</label>
            <div className="mt-2">
              {(service.content as ServiceContent)?.banner && (
                <div className="relative w-full h-[200px] mb-2">
                  <Image
                    src={(service.content as ServiceContent).banner}
                    alt="Banner"
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              )}
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedField({ type: "banner" });
                  setShowFileManager(true);
                }}
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Chọn banner
              </Button>
            </div>
          </div>

          {/* Đặc điểm */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="text-sm font-medium">Đặc điểm chi tiết</label>
              <Button variant="outline" onClick={addFeature}>
                <Plus className="h-4 w-4 mr-2" />
                Thêm đặc điểm
              </Button>
            </div>
            <div className="space-y-4">
              {(service.content as ServiceContent)?.features?.map((feature, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex justify-end mb-2">
                      <Button variant="ghost" size="icon" onClick={() => removeFeature(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Tiêu đề</label>
                        <Input
                          value={feature.title}
                          onChange={(e) => {
                            const content = service.content as ServiceContent;
                            const features = [...(content.features || [])];
                            features[index].title = e.target.value;
                            setService((prev) => ({
                              ...prev,
                              content: { ...content, features },
                            }));
                          }}
                          placeholder="Nhập tiêu đề đặc điểm"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Mô tả</label>
                        <Textarea
                          value={feature.description}
                          onChange={(e) => {
                            const content = service.content as ServiceContent;
                            const features = [...(content.features || [])];
                            features[index].description = e.target.value;
                            setService((prev) => ({
                              ...prev,
                              content: { ...content, features },
                            }));
                          }}
                          placeholder="Nhập mô tả đặc điểm"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Hình ảnh</label>
                        {feature.image && (
                          <div className="relative w-full h-[200px] mb-2">
                            <Image
                              src={feature.image}
                              alt="Feature"
                              fill
                              className="object-cover rounded-lg"
                            />
                          </div>
                        )}
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedField({ type: "feature", index });
                            setShowFileManager(true);
                          }}
                        >
                          <ImageIcon className="h-4 w-4 mr-2" />
                          Chọn hình ảnh
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Tiêu đề kết quả */}
          <div>
            <label className="text-sm font-medium">Tiêu đề kết quả khách hàng</label>
            <Input
              value={(service.content as ServiceContent)?.resultTitle || ""}
              onChange={(e) => {
                const content = service.content as ServiceContent;
                setService((prev) => ({
                  ...prev,
                  content: { ...content, resultTitle: e.target.value },
                }));
              }}
              placeholder="Nhập tiêu đề phần kết quả khách hàng"
            />
          </div>
        </CardContent>
      </Card>

      {/* Gói dịch vụ */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Gói dịch vụ</CardTitle>
            <Button variant="outline" onClick={addServiceItem}>
              <Plus className="h-4 w-4 mr-2" />
              Thêm gói dịch vụ
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {serviceItems.map((item, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex justify-end mb-2">
                    <Button variant="ghost" size="icon" onClick={() => removeServiceItem(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Tên gói</label>
                      <Input
                        value={item.name}
                        onChange={(e) => {
                          const items = [...serviceItems];
                          items[index].name = e.target.value;
                          setServiceItems(items);
                        }}
                        placeholder="Nhập tên gói dịch vụ"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">ID bài viết</label>
                      <Input
                        type="number"
                        value={item.idBlog}
                        onChange={(e) => {
                          const items = [...serviceItems];
                          items[index].idBlog = parseInt(e.target.value);
                          setServiceItems(items);
                        }}
                        placeholder="Nhập id bài viết giới thiệu"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Hình ảnh</label>
                      {item.img && (
                        <div className="relative w-full h-[200px] mb-2">
                          <Image
                            src={item.img}
                            alt="Service item"
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                      )}
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedField({ type: "serviceItem", index });
                          setShowFileManager(true);
                        }}
                      >
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Chọn hình ảnh
                      </Button>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Banner trái</label>
                      {item.bannerLeft && (
                        <div className="relative w-full h-[200px] mb-2">
                          <Image
                            src={item.bannerLeft}
                            alt="Banner Left"
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                      )}
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedField({ type: "bannerLeft", index });
                          setShowFileManager(true);
                        }}
                      >
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Chọn banner trái
                      </Button>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Banner phải</label>
                      {item.bannerRight && (
                        <div className="relative w-full h-[200px] mb-2">
                          <Image
                            src={item.bannerRight}
                            alt="Banner Right"
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                      )}
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedField({ type: "bannerRight", index });
                          setShowFileManager(true);
                        }}
                      >
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Chọn banner phải
                      </Button>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Hình ảnh khách hàng</label>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {item.imgCustomer?.map((img, imgIndex) => (
                          <div key={imgIndex} className="relative">
                            <div className="relative w-full h-[100px]">
                              <Image
                                src={img}
                                alt="Customer"
                                fill
                                className="object-cover rounded-lg"
                              />
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute top-0 right-0"
                              onClick={() => {
                                const items = [...serviceItems];
                                items[index].imgCustomer = items[index].imgCustomer?.filter(
                                  (_, i) => i !== imgIndex
                                );
                                setServiceItems(items);
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          className="h-[100px] flex items-center justify-center"
                          onClick={() => {
                            setSelectedField({
                              type: "customerImage",
                              index,
                              itemIndex: item.imgCustomer?.length || 0,
                            });
                            setShowFileManager(true);
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Nút điều hướng */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={() => router.push("/admin/service")}>
          Hủy
        </Button>
        <Button onClick={handleSubmit}>{isEdit ? "Cập nhật" : "Thêm"} dịch vụ</Button>
      </div>

      {/* Modal File Manager */}
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
