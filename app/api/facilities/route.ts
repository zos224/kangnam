import prisma from "@/utils/db";
import { NextRequest } from "next/server";

export const GET = async(request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  
  if (searchParams.has('idLanguage')) {
    const idLanguage = searchParams.get('idLanguage');
    const facilities = await prisma.facilities.findFirst({
      where: { idLanguage: idLanguage ? parseInt(idLanguage) : undefined },
      include: { language: true }
    });
    return new Response(JSON.stringify(facilities), {status: 200});
  }
  return new Response(JSON.stringify(null), {status: 200});
}

export const POST = async(request: NextRequest) => {
  const body = await request.json();
  
  try {
    const facilities = await prisma.facilities.create({
      data: {
        idLanguage: body.idLanguage,
        title: body.title,
        banner: body.banner,
        description1: body.description1,
        features: body.features,
        description2: body.description2,
        bigFeatures: body.bigFeatures
      }
    });
    return new Response(JSON.stringify(facilities), {status: 201});
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Lỗi khi tạo cơ sở vật chất' }), {status: 500});
  }
}

export const PUT = async(request: NextRequest) => {
  const body = await request.json();
  
  try {
    const facilities = await prisma.facilities.update({
      where: { id: body.id },
      data: {
        idLanguage: body.idLanguage,
        title: body.title,
        banner: body.banner,
        description1: body.description1,
        features: body.features,
        description2: body.description2,
        bigFeatures: body.bigFeatures
      }
    });
    return new Response(JSON.stringify(facilities), {status: 200});
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Lỗi khi cập nhật cơ sở vật chất' }), {status: 500});
  }
}