import prisma from "@/utils/db";
import { NextRequest } from "next/server";

export const GET = async(request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  
  // Nếu có id, trả về language cụ thể
  if (searchParams.has('id')) {
    const id = searchParams.get('id');
    const language = await prisma.language.findUnique({
      where: { id: id ? parseInt(id) : undefined }
    });
    return new Response(JSON.stringify(language), {status: 200});
  }
  else if (searchParams.has("full")) {
    const language = await prisma.language.findMany()
    return new Response(JSON.stringify(language), {status: 200})
  }

  // Xử lý phân trang
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const skip = (page - 1) * limit;

  // Lấy tổng số languages và danh sách theo trang
  const [total, languages] = await Promise.all([
    prisma.language.count(),
    prisma.language.findMany({
      skip,
      take: limit,
      orderBy: {
        id: 'desc'
      }
    })
  ]);

  return new Response(JSON.stringify({
    data: languages,
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
  const { name, code, using } = body;
  const language = await prisma.language.create({
    data: { name, code, using }
  });
  if (using) {
    await prisma.language.updateMany({
      where: { id: { not: language.id } },
      data: { using: false }
    });
  }
  await prisma.setting.create({
    data: {idLanguage: language.id, name: "", logo: "", favicon: "",  bannerBlog: "", bannerStory: "", hotline: "", urlFacebook: "", urlInstagram: "", 
      urlTiktok: "", urlYoutube: ""
    }
  })
  await prisma.homeContent.create({
    data: {idLanguage: language.id, banners: {}, hinhAnhKhachHang: {}, doiNguBacSi: {}}
  })
  return new Response(JSON.stringify(language), {status: 201});
}

export const PUT = async(request: NextRequest) => {
  const body = await request.json();
  const { id, name, code, using } = body;
  const language = await prisma.language.update({
    where: { id: id },
    data: { name, code, using }
  });
  return new Response(JSON.stringify(language), {status: 200});
}

export const DELETE = async(request: NextRequest) => {
  try {
    const body = await request.json();
    const { id } = body;
    const setting = await prisma.setting.findFirst({
      where: { idLanguage: id }
    });
    if (setting) {
      await prisma.setting.delete({
        where: { id: setting.id }
      });
    }

    const homeContent = await prisma.homeContent.findFirst({
      where: { idLanguage: id }
    });
    if (homeContent) {
      await prisma.homeContent.delete({
        where: { id: homeContent.id }
      });
    }
    await prisma.language.delete({ where: { id: id } });
  }
  catch (e: any) {
    console.log(e.stack)
  }
  return new Response(JSON.stringify({ success: true }), {status: 200});
}