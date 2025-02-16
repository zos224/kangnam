"use client"

import { Tabs, TabsContent } from '@/components/admin/ui/tabs';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/admin/ui/button';
import { useEffect, useState } from 'react';
import { Language } from '@/utils/model';
import {
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  Table
} from '@/components/admin/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/admin/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Modal from '@/components/admin/ui/modal';
import { useToast } from '@/components/admin/ToastProvider';
import { Input } from '@/components/admin/ui/input';
import ModalAlert from '@/components/admin/ui/modal-alert';

export default function ProductsPage() {
  const productsPerPage = 10;
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };
  
  const nextPage = () => {
    if (currentPage < Math.ceil(totalProducts / productsPerPage)) {
      setCurrentPage(prev => prev + 1);
    }
  };
  const [allLanguaes, setAllLanguages] = useState<Language[]>([])
  const [currentLanguage, setCurrentLanguage] = useState<Language>()
  const [modalOpen, setModalOpen] = useState(false)
  const [action, setAction] = useState<'add' | 'edit' | 'undifined'>('undifined')
  const [currentPage, setCurrentPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const fetchLanguages = async (page: number = 1) => {
    const res = await fetch(`/api/language?page=${page}&limit=${productsPerPage}`);
    const data = await res.json();
    setAllLanguages(data.data);
    setTotalProducts(data.pagination.total);
  };

  useEffect(() => {
    fetchLanguages(currentPage);
  }, [currentPage]);

  const { showToast, hideToast } = useToast();

  const handleSubmitAdd = async () => {
    const res = await fetch('/api/language', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: currentLanguage?.name, code: currentLanguage?.code, using: currentLanguage?.using === true })
    });
    setAction('undifined')
    if (res.ok) {
      showToast('Ngôn ngữ đã được thêm thành công!', 'success');
      fetchLanguages(currentPage);

    } else {
      showToast('Có lỗi xảy ra khi thêm ngôn ngữ.', 'error');
    }
  };

  const handleSubmitEdit = async () => {
    const res = await fetch('/api/language', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: currentLanguage?.id, name: currentLanguage?.name, code: currentLanguage?.code, using: currentLanguage?.using === true })
    });
    setAction('undifined')
    if (res.ok) {
      showToast('Cập nhật ngôn ngữ thành công!', 'success');
      fetchLanguages(currentPage);
      
    } else {
      showToast('Có lỗi xảy ra khi cập nhật ngôn ngữ.', 'error');
    }
  };

  const fetchLanguage = async (id: number) => {
    const res = await fetch(`/api/language?id=${id}`)
    const data = await res.json()
    setCurrentLanguage(data)  
    setAction('edit')
  }

  const handleDelete = async () => {
    if (!deleteId) return;
    
    const res = await fetch('/api/language', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: deleteId })
    });
  
    if (res.ok) {
      showToast('Xoá ngôn ngữ thành công!', 'success');
      fetchLanguages(currentPage);
    } else {
      showToast('Có lỗi xảy ra khi xoá ngôn ngữ.', 'error');
    }
    setShowDeleteAlert(false);
    setDeleteId(null);
    setTimeout(() => {
      hideToast();
    }, 5000);
  };

  useEffect(() => {
    if (action === 'add') {
      setCurrentLanguage({
        id: 0,
        name: '',
        code: '',
        using: true,
        homeContents: [],
        services: [],
        settings: [],
        shows: [],
        departments: []
      })
      setModalOpen(true)
    }
    else if (action === 'edit') {
      setModalOpen(true)
    }
    else {
      setModalOpen(false)
    }
  }, [action])

  return (
    <Tabs defaultValue="all">
      <div className="flex items-center">
        <div className="ml-auto flex items-center gap-2">
          <Button onClick={() => setAction('add')} size="lg" variant={'outline'} className="h-8 gap-1 bg-black text-white">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Thêm mới
            </span>
          </Button>
        </div>
      </div>
      <TabsContent value="all">
        <Card>
          <CardHeader>
            <CardTitle>Ngôn ngữ</CardTitle>
            <CardDescription>
              Quản lý ngôn ngữ cho website
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden w-[100px] sm:table-cell">
                    <span className="sr-only">#</span>
                  </TableHead>
                  <TableHead>Tên</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Tình trạng</TableHead>
                  <TableHead>
                    <span className="sr-only">Hành động</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allLanguaes.map((language, index) => (
                  <TableRow key={language.id}>
                    <td className="hidden w-[100px] sm:table-cell">
                      {index + 1}
                    </td>
                    <td>{language.name}</td>
                    <td>{language.code}</td>
                    <td>
                      {language.using ? 'Đang sử dụng' : 'Không sử dụng'}
                    </td>
                    <td className="flex gap-2">
                      <Button onClick={() => fetchLanguage(language.id)} size="sm" variant="default">
                        Sửa
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => {
                          setDeleteId(language.id);
                          setShowDeleteAlert(true);
                        }}
                      >
                        Xóa
                      </Button>
                    </td>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <form className="flex items-center w-full justify-between">
              <div className="text-xs text-muted-foreground">
                Hiển thị{' '}
                <strong>
                  {(currentPage - 1) * productsPerPage + 1} - {currentPage === Math.ceil(totalProducts / productsPerPage) ? totalProducts : currentPage * productsPerPage}
                </strong>{' '}
                của <strong>{totalProducts}</strong> ngôn ngữ
              </div>
              <div className="flex">
                <Button
                  onClick={prevPage}
                  variant="ghost"
                  size="sm"
                  type="submit"
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Prev
                </Button>
                <Button
                  onClick={nextPage}
                  variant="ghost"
                  size="sm"
                  type="submit"
                  disabled={currentPage >= Math.ceil(totalProducts / productsPerPage)}
                >
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </form>
          </CardFooter>
        </Card>
      </TabsContent>
      <Modal open={modalOpen} title={action === 'add' ? "Thêm ngôn ngữ" : "Cập nhật ngôn ngữ"} close={() => setAction('undifined')} handleConfirm={action === 'add' ? handleSubmitAdd : handleSubmitEdit}>
        <ModalContent 
          language={currentLanguage} 
          onChange={setCurrentLanguage}
        />
      </Modal>
      <ModalAlert
        open={showDeleteAlert}
        close={() => {
          setShowDeleteAlert(false);
          setDeleteId(null);
        }}
        handleConfirm={handleDelete}
      />
    </Tabs>
  );
}

function ModalContent({
  language,
  onChange
}: {
  language?: Language;
  onChange: (language: Language) => void;
}) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onChange({
      ...language,
      [name]: name === 'using' ? value === 'true' : value
    } as Language);
  };

  return (
    <div>
      <form>
        <div className="grid gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Tên ngôn ngữ
            </label>
            <Input 
              type='text' 
              name='name' 
              id='name' 
              value={language?.name || ''} 
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700">
              Mã ngôn ngữ
            </label>
            <Input 
              type='text' 
              name='code' 
              id='code' 
              value={language?.code || ''} 
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="using" className="block text-sm font-medium text-gray-700">
              Trạng thái
            </label>
            <select
              id="using"
              name="using"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={language?.using ? 'true' : 'false'}
              onChange={handleInputChange}
            >
              <option value="true">Sử dụng</option>
              <option value="false">Không sử dụng</option>
            </select>
          </div>
        </div>
      </form>
    </div>
  );
}
