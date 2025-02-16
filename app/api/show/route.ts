import prisma from "@/utils/db";
import { NextRequest } from "next/server";

export const GET = async(request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  
  // Nếu có id, trả về show cụ thể
  if (searchParams.has('id')) {
    const id = searchParams.get('id');
    const show = await prisma.show.findUnique({
      where: { id: id ? parseInt(id) : undefined },
      include: { language: true }
    });
    return new Response(JSON.stringify(show), {status: 200});
  }

  // Xử lý phân trang
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const skip = (page - 1) * limit;

  // Lọc theo ngôn ngữ nếu có
  const idLanguage = searchParams.get('idLanguage');
  const where = idLanguage ? { idLanguage: parseInt(idLanguage) } : {};

  // Lấy tổng số shows và danh sách theo trang
  const [total, shows] = await Promise.all([
    prisma.show.count({ where }),
    prisma.show.findMany({
      where,
      skip,
      take: limit,
      orderBy: { id: 'desc' },
      include: { language: true }
    })
  ]);

  return new Response(JSON.stringify({
    data: shows,
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
  const { idLanguage, title, description, urlVideos } = body;
  const show = await prisma.show.create({
    data: { 
      idLanguage, 
      title, 
      description, 
      urlVideos 
    },
    include: { language: true }
  });
  return new Response(JSON.stringify(show), {status: 201});
}

export const PUT = async(request: NextRequest) => {
  const body = await request.json();
  const { id, idLanguage, title, description, urlVideos } = body;
  const show = await prisma.show.update({
    where: { id },
    data: { 
      idLanguage, 
      title, 
      description, 
      urlVideos 
    },
    include: { language: true }
  });
  return new Response(JSON.stringify(show), {status: 200});
}

export const DELETE = async(request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  await prisma.show.delete({ 
    where: { id: id ? parseInt(id) : undefined } 
  });
  return new Response(JSON.stringify({ success: true }), {status: 200});
}