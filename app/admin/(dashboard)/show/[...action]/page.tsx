"use client"

import { use, useEffect, useState } from 'react';
import { Show, Language } from '@/utils/model';
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
import { X, Plus } from 'lucide-react';

export default function ShowForm({ params }: { params: Promise<{ action: string[] }> }) {
    const paramData = use(params)
    const [show, setShow] = useState<Partial<Show>>({
        title: '',
        description: '',
        urlVideos: [],
        idLanguage: 0
    });
    const [languages, setLanguages] = useState<Language[]>([]);
    const [newVideo, setNewVideo] = useState('');

    const router = useRouter();
    const { showToast } = useToast();
    const isEdit = paramData.action[0] === 'edit';

    useEffect(() => {
        fetchLanguages();
        if (isEdit && paramData.action[1]) {
        fetchShow(parseInt(paramData.action[1]));
        }
    }, [isEdit, paramData.action]);

    const fetchLanguages = async () => {
        try {
        const res = await fetch('/api/language');
        const data = await res.json();
        setLanguages(data.data);
        if (!isEdit && data.data.length > 0) {
            setShow(prev => ({ ...prev, idLanguage: data.data[0].id }));
        }
        } catch (error) {
        console.error('Failed to fetch languages:', error);
        }
    };

    const fetchShow = async (id: number) => {
        try {
        const res = await fetch(`/api/show?id=${id}`);
        const data = await res.json();
        setShow(data);
        } catch (error) {
        console.error('Failed to fetch show:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
        const res = await fetch('/api/show', {
            method: isEdit ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(show)
        });

        if (!res.ok) {
            throw new Error('Có lỗi xảy ra');
        }

        showToast(
            `${isEdit ? 'Cập nhật' : 'Thêm'} show thành công!`,
            'success'
        );
        router.push('/admin/show');
        } catch (error) {
        showToast(
            `Có lỗi xảy ra khi ${isEdit ? 'cập nhật' : 'thêm'} show.`,
            'error'
        );
        }
    };

    const addVideo = () => {
        if (newVideo && show.urlVideos) {
        setShow(prev => ({
            ...prev,
            urlVideos: [...(prev.urlVideos || []), newVideo]
        }));
        setNewVideo('');
        }
    };

    const removeVideo = (index: number) => {
        if (show.urlVideos) {
        setShow(prev => ({
            ...prev,
            urlVideos: prev.urlVideos?.filter((_, i) => i !== index)
        }));
        }
    };

    const validateYouTubeUrl = (url: string) => {
        const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
        return pattern.test(url);
    };

    return (
        <div className="space-y-4 p-8 pt-6">
        <div className="flex justify-between">
            <h2 className="text-3xl font-bold tracking-tight">
            {isEdit ? 'Cập nhật' : 'Thêm'} show
            </h2>
        </div>

        <form onSubmit={handleSubmit}>
            <Card>
            <CardHeader>
                <CardTitle>Thông tin show</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                <label className="text-sm font-medium">Ngôn ngữ</label>
                <select
                    className="w-full border rounded-md p-2"
                    value={show.idLanguage}
                    onChange={(e) => setShow(prev => ({
                    ...prev,
                    idLanguage: parseInt(e.target.value)
                    }))}
                >
                    {languages.map(language => (
                    <option key={language.id} value={language.id}>
                        {language.name}
                    </option>
                    ))}
                </select>
                </div>

                <div>
                <label className="text-sm font-medium">Tiêu đề</label>
                <Input
                    value={show.title}
                    onChange={(e) => setShow(prev => ({
                    ...prev,
                    title: e.target.value
                    }))}
                    placeholder="Nhập tiêu đề show"
                    required
                />
                </div>

                <div>
                <label className="text-sm font-medium">Mô tả</label>
                <Textarea
                    value={show.description}
                    onChange={(e) => setShow(prev => ({
                    ...prev,
                    description: e.target.value
                    }))}
                    placeholder="Nhập mô tả show"
                    required
                />
                </div>

                <div>
                <label className="text-sm font-medium">Videos</label>
                <div className="space-y-2">
                    <div className="flex gap-2">
                    <Input
                        value={newVideo}
                        onChange={(e) => setNewVideo(e.target.value)}
                        placeholder="Nhập URL video YouTube"
                    />
                    <Button
                        type="button"
                        onClick={addVideo}
                        disabled={!validateYouTubeUrl(newVideo)}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm
                    </Button>
                    </div>
                    <div className="space-y-2">
                    {show.urlVideos?.map((url, index) => (
                        <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                        <span className="flex-1 truncate">{url}</span>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeVideo(index)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                        </div>
                    ))}
                    </div>
                </div>
                </div>
            </CardContent>
            </Card>

            <div className="flex justify-end space-x-4 mt-4">
            <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/show')}
            >
                Hủy
            </Button>
            <Button type="submit">
                {isEdit ? 'Cập nhật' : 'Thêm'} show
            </Button>
            </div>
        </form>
        </div>
    );
}