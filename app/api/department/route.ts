import prisma from "@/utils/db";
import { NextRequest } from "next/server";

export const GET = async(request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  
  // Nếu có id, trả về department cụ thể
  if (searchParams.has('id')) {
    const id = searchParams.get('id');
    const department = await prisma.department.findUnique({
      where: { id: id ? parseInt(id) : undefined },
      include: {
        blog: true,
        services: true,
        workLite: {
          include: {
            doctor: true
          }
        }
      }
    });
    return new Response(JSON.stringify(department), {status: 200});
  }

  // Lọc theo ngôn ngữ nếu có
  if (searchParams.has('idLanguage')) {
    const idLanguage = searchParams.get('idLanguage');
    // Lấy tất cả departments theo điều kiện
    const departments = await prisma.department.findMany({
      where: {idLanguage: idLanguage ? parseInt(idLanguage) : undefined},
      orderBy: { name: 'asc' },
      include: {
        blog: true,
        services: {
          include: {
            serviceItems: true
          }
        },
        workLite: {
          include: {
            doctor: true
          }
        }
      }
    });
    
    return new Response(JSON.stringify(departments), {status: 200});
  }
  
  const departments = await prisma.language.findMany({
    include: {
      departments: true
    }
  })
  return new Response(JSON.stringify(departments), {status: 200});
}

export const POST = async(request: NextRequest) => {
  const body = await request.json();
  const { name, img, idBlog, idLanguage } = body;
  
  try {
    const department = await prisma.department.create({
      data: { 
        name,
        img,
        idBlog: parseInt(idBlog),
        idLanguage: parseInt(idLanguage)
      },
      include: {
        blog: true
      }
    });
    return new Response(JSON.stringify(department), {status: 201});
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Lỗi khi tạo department' }), {status: 500});
  }
}

export const PUT = async(request: NextRequest) => {
  const body = await request.json();
  const { id, name, img, idBlog, idLanguage } = body;
  
  try {
    const department = await prisma.department.update({
      where: { id },
      data: { 
        name,
        img,
        idBlog: parseInt(idBlog),
        idLanguage: parseInt(idLanguage)
      },
      include: {
        blog: true
      }
    });
    return new Response(JSON.stringify(department), {status: 200});
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Lỗi khi cập nhật department' }), {status: 500});
  }
}

export const DELETE = async(request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  try {
    // Xóa tất cả workLike liên quan
    await prisma.workLike.deleteMany({
      where: { idDepartment: id ? parseInt(id) : undefined }
    });

    await prisma.service.deleteMany({
      where: { idDepartment: id ? parseInt(id)  : undefined}
    });
    
    // Xóa department
    await prisma.department.delete({ 
      where: { id: id ? parseInt(id) : undefined } 
    });

    
    
    return new Response(JSON.stringify({ success: true }), {status: 200});
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Lỗi khi xóa department' }), {status: 500});
  }
}