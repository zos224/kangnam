import prisma from "@/utils/db";
import { NextRequest } from "next/server";

export const GET = async(request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  
  if (searchParams.has('forPage')) {
    const targetPage = searchParams.get('forPage');
    if (targetPage === "home") {
      const doctors = await prisma.doctor.findMany({
        where: { exp: { gte: 10 } },
        orderBy: { exp: 'desc' },
      });
      return new Response(JSON.stringify(doctors), {status: 200});
    }
  }

  // Nếu có id, trả về doctor cụ thể với departments
  if (searchParams.has('id')) {
    const id = searchParams.get('id');
    const doctor = await prisma.doctor.findUnique({
      where: { id: id ? parseInt(id) : undefined },
      include: {
        workLite: {
          include: {
            department: true
          }
        }
      }
    });
    return new Response(JSON.stringify(doctor), {status: 200});
  }

  // Xử lý phân trang
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const skip = (page - 1) * limit;

  // Lấy tổng số doctors và danh sách theo trang
  const [total, doctors] = await Promise.all([
    prisma.doctor.count(),
    prisma.doctor.findMany({
      skip,
      take: limit,
      orderBy: { id: 'desc' },
      include: {
        workLite: {
          include: {
            department: true
          }
        }
      }
    })
  ]);

  return new Response(JSON.stringify({
    data: doctors,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }), {status: 200});
}

export const POST = async(request: NextRequest) => {
  const body = await request.json();
  const { title, name, img, description, exp, position, departments } = body;
  
  const doctor = await prisma.doctor.create({
    data: {
      title,
      name,
      img,
      description,
      exp,
      position,
      workLite: {
        create: departments.map((depId: number) => ({
          department: {
            connect: { id: depId }
          }
        }))
      }
    },
    include: {
      workLite: {
        include: {
          department: true
        }
      }
    }
  });
  
  return new Response(JSON.stringify(doctor), {status: 201});
}

export const PUT = async(request: NextRequest) => {
  const body = await request.json();
  const { id, title, name, img, description, exp, position, departments } = body;
  
  // Xóa các workLike hiện tại
  await prisma.workLike.deleteMany({
    where: { idDoctor: id }
  });
  
  // Cập nhật doctor và tạo workLike mới
  const doctor = await prisma.doctor.update({
    where: { id },
    data: {
      title,
      name,
      img,
      description,
      exp,
      position,
      workLite: {
        create: departments.map((depId: number) => ({
          department: {
            connect: { id: depId }
          }
        }))
      }
    },
    include: {
      workLite: {
        include: {
          department: true
        }
      }
    }
  });
  
  return new Response(JSON.stringify(doctor), {status: 200});
}

export const DELETE = async(request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  // Xóa tất cả workLike liên quan
  await prisma.workLike.deleteMany({
    where: { idDoctor: id ? parseInt(id) : undefined }
  });
  
  // Xóa doctor
  await prisma.doctor.delete({ 
    where: { id: id ? parseInt(id) : undefined } 
  });
  
  return new Response(JSON.stringify({ success: true }), {status: 200});
}