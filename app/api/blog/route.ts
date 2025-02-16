import prisma from "@/utils/db";
import { NextRequest } from "next/server";
import slugify from '@sindresorhus/slugify';

export const GET = async(request: NextRequest) => {
  const { searchParams } = new URL(request.url);

  if (searchParams.has('top10')) {
    const blogs = await prisma.blog.findMany({
      take: 10,
      orderBy: { view: 'desc' },
    });
    return new Response(JSON.stringify(blogs), { status: 200 });
  }

  if (searchParams.has('newest3')) {
    const blogs = await prisma.blog.findMany({
      take: 3,
      orderBy: { date: 'desc' },
      include: {
        blogType: true,
      }
    });
    return new Response(JSON.stringify(blogs), { status: 200 });
  }


  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const search = searchParams.get('search') || '';
  const skip = (page - 1) * limit;

  try {
    const [total, blogs] = await Promise.all([
      prisma.blog.count({
        where: {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { content: { contains: search, mode: 'insensitive' } }
          ]
        }
      }),
      prisma.blog.findMany({
        skip,
        take: limit,
        where: {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { content: { contains: search, mode: 'insensitive' } }
          ]
        },
        include: {
          blogType: true,
          author: true,
          doctor: true
        },
        orderBy: {
          date: 'desc'
        }
      })
    ]);

    return new Response(JSON.stringify({
      data: blogs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
};

export const POST = async(request: NextRequest) => {
  try {
    const body = await request.json();
    console.log(body);
    
    // Generate slug from title
    let slug = slugify(body.title, {
      lowercase: true
    });

    // Check if slug exists
    const existingBlog = await prisma.blog.findFirst({
      where: { slug: slug }
    });

    if (existingBlog) {
      // Add timestamp to make slug unique
      slug = `${slug}-${Date.now()}`;
    }
    const blog = await prisma.blog.create({
      data: {
        title: body.title,
        slug: slug,
        img: body.img,
        content: body.content,
        blogType: { connect: { id: body.idBlogType } },
        author: { connect: { id: body.idAuthor } },
        doctor: body.idDoctor ? { connect: { id: body.idDoctor } } : undefined,
        date: new Date(),
        view: 0
      }
    });

    return new Response(JSON.stringify(blog), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
};

export const PUT = async(request: NextRequest) => {
  try {
    const body = await request.json();
    
    let slug = slugify(body.title, {
      lowercase: true
    });

    // Check if new slug would conflict with existing blogs (excluding current blog)
    const existingBlog = await prisma.blog.findFirst({
      where: { 
        slug,
        NOT: { id: body.id }
      }
    });

    if (existingBlog) {
      slug = `${slug}-${Date.now()}`;
    }

    const blog = await prisma.blog.update({
      where: { id: body.id },
      data: {
        title: body.title,
        slug,
        img: body.img,
        content: body.content,
        idBlogType: body.idBlogType,
        idDoctor: body.idDoctor || null
      }
    });

    return new Response(JSON.stringify(blog), { status: 200 });
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
      return new Response(JSON.stringify({ error: 'Blog ID is required' }), { status: 400 });
    }

    await prisma.blog.delete({
      where: { id: parseInt(id) }
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}; 