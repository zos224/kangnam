import prisma from "@/utils/db";
import { NextRequest } from "next/server";

export const GET = async(request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  
  // Nếu có id, trả về branch cụ thể
  if (searchParams.has('id')) {
    const id = searchParams.get('id');
    const branch = await prisma.branch.findUnique({
      where: { id: id ? parseInt(id) : undefined }
    });
    return new Response(JSON.stringify(branch), {status: 200});
  }

  // Lấy tất cả branches với phân trang
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  
  const [branches, total] = await Promise.all([
    prisma.branch.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { name: 'asc' }
    }),
    prisma.branch.count()
  ]);

  return new Response(JSON.stringify({
    data: branches,
    pagination: {
      page,
      limit,
      total
    }
  }), {status: 200});
}

export const POST = async(request: NextRequest) => {
  const body = await request.json();
  
  try {
    const branch = await prisma.branch.create({
      data: {
        name: body.name,
        address: body.address,
        ggmap: body.ggmap
      }
    });
    return new Response(JSON.stringify(branch), {status: 200});
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Lỗi khi tạo chi nhánh' }), {status: 500});
  }
}

export const PUT = async(request: NextRequest) => {
  const body = await request.json();
  
  try {
    const branch = await prisma.branch.update({
      where: { id: body.id },
      data: {
        name: body.name,
        address: body.address,
        ggmap: body.ggmap
      }
    });
    return new Response(JSON.stringify(branch), {status: 200});
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Lỗi khi cập nhật chi nhánh' }), {status: 500});
  }
}

export const DELETE = async(request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  try {
    await prisma.branch.delete({
      where: { id: id ? parseInt(id) : undefined }
    });
    return new Response(JSON.stringify({ success: true }), {status: 200});
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Lỗi khi xóa chi nhánh' }), {status: 500});
  }
}