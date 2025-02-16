import prisma from "@/utils/db";
import { NextRequest } from "next/server";

export const GET = async(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await(params);
  try {
    const story = await prisma.story.findUnique({
      where: { id: parseInt(id) }
    });

    if (!story) {
      return new Response(JSON.stringify({ error: 'Story not found' }), { status: 404 });
    }

    return new Response(JSON.stringify(story), { status: 200 });
  } catch (error) {
    const story = await prisma.story.findUnique({
      where: { slug: id }
    });
    return new Response(JSON.stringify(story), { status: 200 });
  }
};