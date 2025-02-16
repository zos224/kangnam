import Image from "next/image";
import { useState } from "react";
import { Input } from "./admin/ui/input";
import { useDepartmentsData } from "@/hooks/useDepartmentData";
import Toast from "./admin/ui/toast";

const ActionSection = () => {
  const { departments } = useDepartmentsData()
  const [openModal, setOpenModal] = useState(false)
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('');
  const [type, setType] = useState("");
  const [toastHandle, setToastHandle] = useState({
    text: "",
    status: "",
    open: false,
    close: () => {}
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name == "" || phone == "" || service == "") {
      setOpenModal(false)
      setToastHandle({
        open: true,
        close: () => setToastHandle({...toastHandle, open: false}),
        status: "fail",
        text: "Vui lòng nhập đầy đủ thông tin!"
      })
      return
    }
    try {
      const res = await fetch('/api/user-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, service, type }),
      });

      if (!res.ok) throw new Error('Có lỗi xảy ra');
      setOpenModal(false)
      setName('');
      setPhone('');
      setService('');
      setType("")
      setToastHandle({
        open: true,
        close: () => setToastHandle({...toastHandle, open: false}),
        status: "success",
        text: "Gửi yêu cầu thành công!"
      })
    } catch (error) {
      setOpenModal(false)
      setToastHandle({
        open: true,
        close: () => setToastHandle({...toastHandle, open: false}),
        status: "fail",
        text: "Gửi yêu cầu thất bại!"
      })
    }
    finally {
      setTimeout(() => {
        setToastHandle({...toastHandle, open: false})
      }, 5000)
    }
  };
  const actions = [
    {
      id: "action-1",
      title: "Nhận báo giá",
      buttonText: "Nhận ngay",
      icon: "/images/icons/like.svg",
      link: "/nhan-bao-gia",
    },
    {
      id: "action-2",
      title: "Đặt lịch tư vấn",
      buttonText: "Tư vấn ngay",
      icon: "/images/icons/like.svg",
      link: "/dat-lich-tu-van",
    },
  ];

  return (
    <section className="bg-blue-100 py-10">
      <div className="container mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {actions.map((action) => (
          <div
            key={action.id}
            className="flex flex-col items-center text-center bg-transparent"
          >
            <div className="mb-4">
              <Image
                src={action.icon}
                alt={action.title}
                width={64}
                height={64}
                className="mx-auto"
              />
            </div>
            <h3 className="text-lg font-bold text-gray-800">{action.title}</h3>
            <button onClick={() => {setType(action.title), setOpenModal(true)}} className="mt-4 px-4 py-2 text-sm font-semibold text-gray-800 border border-gray-800 rounded-full hover:bg-gray-800 hover:text-white transition">
              {action.buttonText}
            </button>
          </div>
        ))}
      </div>
      {openModal &&
      <div id="static-modal" data-modal-backdrop="static" tabIndex={-1} aria-hidden="true" className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full bg-opacity-50 bg-gray-400 dark:bg-gray-400">
            <div className="relative p-4 w-full max-w-xl max-h-full mx-auto mt-32">
                <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
                    <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {type}
                        </h3>
                        <button onClick={() => setOpenModal(false)} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="static-modal">
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                            </svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                    </div>
                    <div className="p-4 md:p-5 space-y-4">
                    <form>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Tên</label>
                          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nhập tên" required />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Số điện thoại</label>
                          <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Nhập số điện thoại" required />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Dịch vụ</label>
                          <select 
                            value={service}
                            onChange={(e) => setService(e.target.value)}
                            required
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option>---Chọn dịch vụ---</option>
                            {departments.flatMap(department =>
                              department.services.flatMap(service =>
                                service.serviceItems.map((serviceItem, index) => (
                                  <option key={`${service.id}-${index}`} value={serviceItem.name}>
                                    {serviceItem.name}
                                  </option>
                                ))
                              )
                            )}
                          </select>
                        </div>
                      </div>
                    </form>
                    </div>
                    <div className="flex items-center justify-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                        <button onClick={handleSubmit} type="button" className="text-white bg-pink-500 hover:bg-pink-600 focus:ring-4 focus:outline-none focus:ring-pink-300 font-medium text-sm px-10 py-2.5 text-center dark:bg-pink-600 dark:hover:bg-pink-700 dark:focus:ring-pink-800 rounded-full">Gửi yêu cầu</button>
                    </div>
                </div>
            </div>
        </div>
      }
      {
      toastHandle.open &&
      <div id="static-modal" data-modal-backdrop="static" tabIndex={-1} aria-hidden="true" className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full bg-opacity-50 bg-gray-400 dark:bg-gray-400">
          <div className="relative p-4 w-full max-w-xl max-h-full mx-auto mt-32">
              <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
                  <div className="p-4 md:p-5 space-y-4">
                    {toastHandle.status == "success" ? (
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center shrink-0 w-16 h-16 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
                          <svg className="w-10 h-10" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                          </svg>
                          <span className="sr-only">Check icon</span>
                        </div>
                        <p className="mt-3 text-xl">{toastHandle.text}</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center shrink-0 w-16 h-16 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
                          <svg className="w-10 h-10" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"/>
                          </svg>
                          <span className="sr-only">Error icon</span>
                        </div>
                        <p className="mt-3 text-xl">{toastHandle.text}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
                      <button onClick={() => setToastHandle({...toastHandle, open: false})} type="button" className="text-white bg-pink-500 hover:bg-pink-600 focus:ring-4 focus:outline-none focus:ring-pink-300 font-medium text-sm px-10 py-2.5 text-center dark:bg-pink-600 dark:hover:bg-pink-700 dark:focus:ring-pink-800 rounded-full">Xác nhận</button>
                  </div>
              </div>
          </div>
      </div>
      }
    </section>
  );
};

export default ActionSection;
