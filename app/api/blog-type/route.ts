import prisma from "@/utils/db";
import { NextRequest } from "next/server";
import slugify from "@sindresorhus/slugify";

export const GET = async(request: NextRequest) => {
  try {
    const blogTypes = await prisma.blogType.findMany({
      include: {
        _count: {
          select: { blogs: true }
        }
      }
    });
    
    return new Response(JSON.stringify(blogTypes), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
};

export const POST = async(request: NextRequest) => {
  try {
    const body = await request.json();
    const slug = slugify(body.name, { lowercase: true });
    // Kiểm tra tên đã tồn tại
    const existing = await prisma.blogType.findFirst({
      where: { name: body.name, slug: slug }
    });

    if (existing) {
      return new Response(
        JSON.stringify({ error: 'Tên loại bài viết đã tồn tại' }), 
        { status: 400 }
      );
    }

    const blogType = await prisma.blogType.create({
      data: { name: body.name, slug: slug }
    });

    return new Response(JSON.stringify(blogType), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
};

export const PUT = async(request: NextRequest) => {
  try {
    const body = await request.json();
    // Kiểm tra tên đã tồn tại (trừ chính nó)
    const existing = await prisma.blogType.findFirst({
      where: { 
        name: body.name,
        NOT: { id: body.id }
      }
    });

    if (existing) {
      return new Response(
        JSON.stringify({ error: 'Tên loại bài viết đã tồn tại' }), 
        { status: 400 }
      );
    }
    const slug = slugify(body.name, { lowercase: true });
    const blogType = await prisma.blogType.update({
      where: { id: body.id },
      data: { name: body.name, slug: slug }
    });

    return new Response(JSON.stringify(blogType), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
};

export const DELETE = async(request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return new Response(JSON.stringify({ error: 'Blog Type ID is required' }), { status: 400 });
    }

    // Kiểm tra xem có bài viết nào thuộc loại này không
    const blogCount = await prisma.blog.count({
      where: { idBlogType: parseInt(id) }
    });

    if (blogCount > 0) {
      return new Response(
        JSON.stringify({ 
          error: 'Không thể xóa loại bài viết này vì đã có bài viết thuộc loại này' 
        }), 
        { status: 400 }
      );
    }

    await prisma.blogType.delete({
      where: { id: parseInt(id) }
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}; 