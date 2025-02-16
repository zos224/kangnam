import prisma from "@/utils/db";
import slugify from "@sindresorhus/slugify";
import { NextRequest } from "next/server";

export const GET = async(request: NextRequest) => {
  const { searchParams } = new URL(request.url);

  if (searchParams.has('fullData')) {
    const stories = await prisma.story.findMany({
      orderBy: {
        id: 'desc'
      },
    });

    return new Response(JSON.stringify(stories), { status: 200 });
  }

  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const search = searchParams.get('search') || '';
  const skip = (page - 1) * limit;

  try {
    const [total, stories] = await Promise.all([
      prisma.story.count({
        where: {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { content: { contains: search, mode: 'insensitive' } }
          ]
        }
      }),
      prisma.story.findMany({
        skip,
        take: limit,
        where: {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { content: { contains: search, mode: 'insensitive' } }
          ]
        },
        orderBy: {
          id: 'desc'
        }
      })
    ]);

    return new Response(JSON.stringify({
      data: stories,
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
    const slug = slugify(body.title, { lowercase: true });
    const story = await prisma.story.create({
      data: {
        title: body.title,
        serviceUsed: body.serviceUsed,
        img: body.img,
        content: body.content,
        slug: slug
      }
    });

    return new Response(JSON.stringify(story), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
};

export const PUT = async(request: NextRequest) => {
  try {
    const body = await request.json();
    const slug = slugify(body.title, { lowercase: true });
    const story = await prisma.story.update({
      where: { id: body.id },
      data: {
        title: body.title,
        serviceUsed: body.serviceUsed,
        img: body.img,
        content: body.content,
        slug: slug
      }
    });

    return new Response(JSON.stringify(story), { status: 200 });
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
      return new Response(JSON.stringify({ error: 'Story ID is required' }), { status: 400 });
    }

    await prisma.story.delete({
      where: { id: parseInt(id) }
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
};