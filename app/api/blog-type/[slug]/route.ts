import prisma from "@/utils/db";
import { NextRequest } from "next/server";

export const GET = async(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) => {
  try {
    const { slug } = await(params);
    const blogType = await prisma.blogType.findFirst({
      where: { slug: slug },
      include: {
        blogs: {
          orderBy: { date: 'desc' },
          include: {
            author: true
          }
        }
      }
    });

    if (!blogType) {
      return new Response(JSON.stringify({ error: 'blog type not found' }), { status: 404 });
    }

    return new Response(JSON.stringify(blogType), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}; 