"use client"

import { use, useEffect, useState } from 'react';
import { Doctor, Department, Language } from '@/utils/model';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/admin/ui/card";
import { Button } from '@/components/admin/ui/button';
import { Input } from '@/components/admin/ui/input';
import { Textarea } from '@/components/admin/ui/textarea';
import { useToast } from '@/components/admin/ToastProvider';
import { useRouter } from 'next/navigation';
import { ImageIcon, X } from 'lucide-react';
import Image from 'next/image';
import FileManager from '@/components/FileManager/FileManager';

export default function DoctorForm({ params }: { params: Promise<{action: string[]}> }) {
    const paramData = use(params)
    const [doctor, setDoctor] = useState<Partial<Doctor>>({
        title: '',
        name: '',
        img: '',
        description: '',
        exp: 0,
        position: '',
    });
    const [languages, setLanguages] = useState<Language[]>([]);
    const [selectedDepartments, setSelectedDepartments] = useState<number[]>([]);
    const [showFileManager, setShowFileManager] = useState(false);

    const router = useRouter();
    const { showToast } = useToast();
    const isEdit = paramData.action[0] === 'edit';

    useEffect(() => {
        fetchDepartments();
        if (isEdit && paramData.action[1]) {
        fetchDoctor(parseInt(paramData.action[1]));
        }
    }, [isEdit, paramData.action]);

    const fetchDepartments = async () => {
        try {
        const res = await fetch('/api/department');
        const data = await res.json();
        setLanguages(data);
        } catch (error) {
        console.error('Failed to fetch departments:', error);
        }
    };

    const fetchDoctor = async (id: number) => {
        try {
        const res = await fetch(`/api/doctor?id=${id}`);
        const data = await res.json();
        setDoctor(data);
        setSelectedDepartments(data.workLite.map((w: any) => w.department.id));
        } catch (error) {
        console.error('Failed to fetch doctor:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
        const res = await fetch('/api/doctor', {
            method: isEdit ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
            ...doctor,
            departments: selectedDepartments
            })
        });

        if (!res.ok) {
            throw new Error('Có lỗi xảy ra');
        }

        showToast(
            `${isEdit ? 'Cập nhật' : 'Thêm'} bác sĩ thành công!`,
            'success'
        );
        router.push('/admin/doctor');
        } catch (error) {
        showToast(
            `Có lỗi xảy ra khi ${isEdit ? 'cập nhật' : 'thêm'} bác sĩ.`,
            'error'
        );
        }
    };

    const handleFileSelect = (url: string) => {
        setDoctor(prev => ({ ...prev, img: url }));
        setShowFileManager(false);
    };

    const handleDepartmentChange = (departmentId: number) => {
        setSelectedDepartments(prev => {
        if (prev.includes(departmentId)) {
            return prev.filter(id => id !== departmentId);
        } else {
            return [...prev, departmentId];
        }
        });
    };

    return (
        <div className="space-y-4 p-8 pt-6">
        <div className="flex justify-between">
            <h2 className="text-3xl font-bold tracking-tight">
            {isEdit ? 'Cập nhật' : 'Thêm'} bác sĩ
            </h2>
        </div>

        <form onSubmit={handleSubmit}>
            <Card>
            <CardHeader>
                <CardTitle>Thông tin bác sĩ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium">Chức danh</label>
                    <Input
                    value={doctor.title}
                    onChange={(e) => setDoctor(prev => ({
                        ...prev,
                        title: e.target.value
                    }))}
                    placeholder="Nhập chức danh"
                    required
                    />
                </div>

                <div>
                    <label className="text-sm font-medium">Họ tên</label>
                    <Input
                    value={doctor.name}
                    onChange={(e) => setDoctor(prev => ({
                        ...prev,
                        name: e.target.value
                    }))}
                    placeholder="Nhập họ tên"
                    required
                    />
                </div>

                <div>
                    <label className="text-sm font-medium">Vị trí</label>
                    <Input
                    value={doctor.position}
                    onChange={(e) => setDoctor(prev => ({
                        ...prev,
                        position: e.target.value
                    }))}
                    placeholder="Nhập vị trí"
                    required
                    />
                </div>

                <div>
                    <label className="text-sm font-medium">Số năm kinh nghiệm</label>
                    <Input
                    type="number"
                    value={doctor.exp}
                    onChange={(e) => setDoctor(prev => ({
                        ...prev,
                        exp: parseInt(e.target.value)
                    }))}
                    placeholder="Nhập số năm kinh nghiệm"
                    required
                    />
                </div>
                </div>

                <div>
                <label className="text-sm font-medium">Mô tả</label>
                <Textarea
                    value={doctor.description}
                    onChange={(e) => setDoctor(prev => ({
                    ...prev,
                    description: e.target.value
                    }))}
                    placeholder="Nhập mô tả"
                    required
                />
                </div>

                <div>
                <label className="text-sm font-medium">Khoa</label>
                <div className="mt-4">
                    {languages.map(language => (
                        <div key={language.id}>
                            <p className='font-bold'>{language.name}</p>
                            <div className='grid grid-cols-4 gap-2 mt-2'>
                                {language.departments.map(department => (
                                <label
                                    key={department.id}
                                    className="flex items-center space-x-2"
                                >
                                    <input
                                    type="checkbox"
                                    checked={selectedDepartments.includes(department.id)}
                                    onChange={() => handleDepartmentChange(department.id)}
                                    className="rounded border-gray-300"
                                    />
                                    <span>{department.name}</span>
                                </label>
                                ))}
                            </div>
                        </div>
                    ))}
                    
                </div>
                </div>

                <div>
                <label className="text-sm font-medium">Hình ảnh</label>
                <div className="mt-2 space-y-2">
                    {doctor.img && (
                    <div className="relative w-[200px] h-[200px]">
                        <Image
                        src={doctor.img}
                        alt={doctor.name || ''}
                        fill
                        className="object-cover rounded-lg"
                        />
                    </div>
                    )}
                    <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowFileManager(true)}
                    >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Chọn hình ảnh
                    </Button>
                </div>
                </div>
            </CardContent>
            </Card>

            <div className="flex justify-end space-x-4 mt-4">
            <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/doctor')}
            >
                Hủy
            </Button>
            <Button type="submit">
                {isEdit ? 'Cập nhật' : 'Thêm'} bác sĩ
            </Button>
            </div>
        </form>

        {showFileManager && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-4/5 h-4/5">
                <div className="p-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-medium">Chọn hình ảnh</h3>
                <button
                    onClick={() => setShowFileManager(false)}
                    className="text-gray-500 hover:text-gray-700"
                >
                    <X className="h-4 w-4" />
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