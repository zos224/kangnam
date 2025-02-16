import prisma from "@/utils/db";
import { NextRequest } from "next/server";
import slugify from '@sindresorhus/slugify';

export const GET = async(request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  
  // Nếu có id, trả về service cụ thể
  if (searchParams.has('id')) {
    const id = searchParams.get('id');
    const service = await prisma.service.findUnique({
      where: { id: id ? parseInt(id) : undefined },
      include: { 
        language: true,
        department: true,
        serviceItems: {
          include: { blog: true }
        },
      }
    });
    return new Response(JSON.stringify(service), {status: 200});
  }

  if (searchParams.has('forPage')) {
    const targetPage = searchParams.get('forPage');
    if (targetPage === "price-sheet") {
      const services = await prisma.service.findMany({
        include: {
          priceSheets: true
        }
      });
      return new Response(JSON.stringify(services), {status: 200});
    }
    else if (targetPage === "album") {
      const services = await prisma.service.findMany({
        include: {
          serviceItems: true
        }
      });
      return new Response(JSON.stringify(services), {status: 200});
    }
  }

  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const idLanguage = searchParams.get('idLanguage');
  const idDepartment = searchParams.get('idDepartment');
  
  const where: any = {};
  if (idLanguage) where.idLanguage = parseInt(idLanguage);
  if (idDepartment) where.idDepartment = parseInt(idDepartment);

  const [services, total] = await Promise.all([
    prisma.service.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        language: true,
        department: true,
        serviceItems: {
          include: { blog: true }
        }
      },
      orderBy: { name: 'asc' }
    }),
    prisma.service.count({ where })
  ]);

  return new Response(JSON.stringify({
    data: services,
    pagination: {
      page,
      limit,
      total
    }
  }), {status: 200});
};

export const POST = async(request: NextRequest) => {
  try {
    const body = await request.json();
    
    const slug = slugify(body.name, { lowercase: true });
    
    // Tạo service trước
    const service = await prisma.service.create({
      data: {
        name: body.name,
        slug: slug,
        description: body.description,
        descriptionPrice: body.descriptionPrice,
        content: body.content,
        idLanguage: body.idLanguage,
        idDepartment: body.idDepartment,
      }
    });

    // Tạo blogs và serviceItems
    for (const item of body.serviceItems) {
      // Sau đó tạo serviceItem liên kết với blog
      await prisma.serviceItem.create({
        data: {
          name: item.name,
          idService: service.id,
          idBlog: item.idBlog,
          img: item.img,
          imgCustomer: item.imgCustomer || [],
          bannerLeft: item.bannerLeft,
          bannerRight: item.bannerRight
        }
      });
    }
    
    return new Response(JSON.stringify({status: "Done"}), {status: 201});
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {status: 500});
  }
};

export const PUT = async(request: NextRequest) => {
  try {
    const body = await request.json();
    
    const slug = slugify(body.name, { lowercase: true });

    const oldServiceItems = await prisma.serviceItem.findMany({
      where: { idService: body.id },
      include: { blog: true }
    });

    for (const item of oldServiceItems) {
      // check blog đó có được dùng lại không
      let check = false;
      for (const itemNew of body.serviceItems) {
        if (itemNew.idBlog == item.blog.id) {
          check = true;
        }
      }
      if (!check) {
        await prisma.blog.delete({ where: { id: item.blog.id } });
      }

      await prisma.serviceItem.delete({ where: { id: item.id } });
    }

    // Cập nhật service
    const service = await prisma.service.update({
      where: { id: body.id },
      data: {
        name: body.name,
        slug,
        description: body.description,
        content: body.content,
        idLanguage: body.idLanguage,
        idDepartment: body.idDepartment, // Add this line
      }
    });

    // Tạo mới blogs và serviceItems
    for (const item of body.serviceItems) {
      await prisma.serviceItem.create({
        data: {
          name: item.name,
          idService: service.id,
          idBlog: item.idBlog,
          img: item.img,
          imgCustomer: item.imgCustomer || [],
          bannerLeft: item.bannerLeft,
          bannerRight: item.bannerRight
        }
      });
    }
    
    return new Response(JSON.stringify({status: "Done"}), {status: 200});
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {status: 500});
  }
};

export const DELETE = async(request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return new Response(JSON.stringify({ error: 'Service ID is required' }), {status: 400});
    }

    // Xóa tất cả serviceItems và blogs liên quan
    const serviceItems = await prisma.serviceItem.findMany({
      where: { idService: parseInt(id) },
      include: { blog: true }
    });

    for (const item of serviceItems) {
      await prisma.blog.delete({ where: { id: item.blog.id } });
      await prisma.serviceItem.delete({ where: { id: item.id } });
    }

    // Cuối cùng xóa service
    await prisma.service.delete({
      where: { id: parseInt(id) }
    });

    return new Response(JSON.stringify({ success: true }), {status: 200});
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {status: 500});
  }
};