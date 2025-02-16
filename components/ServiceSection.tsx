import { Department } from "@/utils/model";
import Image from "next/image";
import Link from "next/link";

export default function ServiceSection({departments} : {departments: Department[]}) {
  return (
    <section className="bg-white py-16">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold text-center mb-10 uppercase">
          Thẩm mỹ chuyên sâu
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {departments.map((department, index) => (
            <div
              key={index}
              className="relative rounded-lg shadow-lg overflow-hidden group flex"
            >
              {/* Cột hình ảnh */}
              <div className="w-1/2 relative">
                <Image
                  src={department.img}
                  alt={department.name}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>

              {/* Cột nội dung */}
              <div className={`w-1/2 ${(Math.floor(index/2)) % 2 === 0 ? 'bg-yellow-100' : 'bg-blue-100'} flex flex-col justify-center items-center text-center p-6 rounded-r-lg shadow-md`}>
                <p className="text-xs font-semibold uppercase text-gray-700">
                  {"CHUYÊN KHOA"}
                </p>
                <h3 className="text-lg font-bold text-gray-900 leading-tight mt-2 uppercase">
                  {department.name}
                </h3>
                <Link href={"/bai-viet/" + department.blog.slug}>
                  <button className="mt-4 border border-black rounded-full px-4 py-1 text-sm flex items-center gap-2 hover:bg-black hover:text-white transition">
                    → Xem thêm
                  </button>
                </Link>
              </div>

              {/* Hiệu ứng hover toàn bộ box */}
              <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-md flex flex-col justify-center items-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6">
                <p className="text-xs uppercase font-medium ">Chuyên khoa</p>
                <h3 className="text-xl font-bold mt-3 text-center uppercase">{department.name}</h3>
                <div className="mt-4 text-base text-center">
                  {(() => {
                  const allItems = department.services.flatMap(service => 
                    service.serviceItems?.map(detail => detail.name) || []
                  );
                  
                  const columns = [];
                  for (let i = 0; i < allItems.length; i += 4) {
                    columns.push(allItems.slice(i, i + 4));
                  }

                  return (
                    <div className="flex justify-center gap-10">
                    {columns.map((column, colIdx) => (
                      <ul key={colIdx} className="space-y-1">
                      {column.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                        • {item}
                        </li>
                      ))}
                      </ul>
                    ))}
                    </div>
                  );
                  })()}
                </div>
                <Link href={"/bai-viet/" + department.blog.slug}>
                  <button className="mt-2 border border-white rounded-full px-5 py-2 text-white text-sm flex items-center gap-2 hover:bg-white hover:text-black transition">
                    → Xem thêm
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
