import prisma from "@/utils/db";
import { NextRequest } from "next/server";

export const GET = async(request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  
  if (searchParams.has('idLanguage')) {
    const idLanguage = searchParams.get('idLanguage');
    const homeContent = await prisma.homeContent.findFirst({
      where: { idLanguage: idLanguage ? parseInt(idLanguage) : undefined },
      include: { language: true }
    });
    return new Response(JSON.stringify(homeContent), {status: 200});
  }
  return new Response(JSON.stringify([]), {status: 200});
}

export const POST = async(request: NextRequest) => {
  try {
    const body = await request.json();
    const homeContent = await prisma.homeContent.create({
      data: {
        idLanguage: body.idLanguage,
        banners: body.banners,
        hinhAnhKhachHang: body.hinhAnhKhachHang,
        doiNguBacSi: body.doiNguBacSi
      }
    });
    return new Response(JSON.stringify(homeContent), {status: 201});
  }
  catch (error: any) {
    console.log(error.stack);
  }
  return new Response(JSON.stringify({ success: false }), {status: 500});
}

export const PUT = async(request: NextRequest) => {
  try {
    const body = await request.json();
    const homeContent = await prisma.homeContent.update({
      where: { id: body.id },
      data: {
        idLanguage: body.idLanguage,
        banners: body.banners,
        hinhAnhKhachHang: body.hinhAnhKhachHang,
        doiNguBacSi: body.doiNguBacSi
      }
    });
    return new Response(JSON.stringify(homeContent), {status: 200});
  }
  catch (error: any) {
    console.log(error.stack);
  }
  return new Response(JSON.stringify({ success: false }), {status: 500});
} 