import prisma from "@/utils/db";
import { NextRequest } from "next/server";

export const GET = async(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) => {
  try {
    const { slug } = await(params);
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const [blogType, total] = await Promise.all([
      prisma.blogType.findFirst({
        where: { slug: slug },
        include: {
          blogs: {
            orderBy: { date: 'desc' },
            include: { author: true },
            take: limit,
            skip: skip
          }
        }
      }),
      prisma.blog.count({
        where: { blogType: { slug: slug } }
      })
    ]);

    if (!blogType) {
      return new Response(JSON.stringify({ error: 'blog type not found' }), { status: 404 });
    }

    return new Response(JSON.stringify({
      data: blogType,
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