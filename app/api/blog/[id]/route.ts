import prisma from "@/utils/db";
import { NextRequest } from "next/server";

export const GET = async(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await(params);
  try {
    const blog = await prisma.blog.findUnique({
      where: { id: parseInt(id) },
      include: {
        blogType: true,
        author: true,
        doctor: true
      }
    });

    if (!blog) {
      return new Response(JSON.stringify({ error: 'Blog not found' }), { status: 404 });
    }

    return new Response(JSON.stringify(blog), { status: 200 });
  } catch (error) {
    const blog = await prisma.blog.findUnique({
      where: { slug: id },
      include: {
        author: true,
        doctor: true,
        serviceItem: true
      }
    });
    return new Response(JSON.stringify(blog), { status: 200 });
  }
}; 