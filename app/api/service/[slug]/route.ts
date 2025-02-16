import prisma from "@/utils/db";
import { NextRequest } from "next/server";

export const GET = async(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) => {
  try {
    const { slug } = await(params);
    const service = await prisma.service.findFirst({
      where: { slug: slug },
      include: {
        serviceItems: {
            include: {
                blog: true
            }
        }
      }
    });

    if (!service) {
      return new Response(JSON.stringify({ error: 'service not found' }), { status: 404 });
    }

    return new Response(JSON.stringify(service), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}; 