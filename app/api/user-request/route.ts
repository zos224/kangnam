import prisma from "@/utils/db";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
  const requests = await prisma.userRequest.findMany();
  return new Response(JSON.stringify(requests), { status: 200 });
};

export const POST = async (request: NextRequest) => {
  const body = await request.json();
  
  try {
    const userRequest = await prisma.userRequest.create({
      data: {
        name: body.name,
        phone: body.phone,
        service: body.service,
        type: body.type
      }
    });
    return new Response(JSON.stringify(userRequest), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Lỗi khi tạo yêu cầu' }), { status: 500 });
  }
};

export const PUT = async (request: NextRequest) => {
  const body = await request.json();
  
  try {
    const userRequest = await prisma.userRequest.update({
      where: { id: body.id },
      data: {
        status: body.status,
      }
    });
    return new Response(JSON.stringify(userRequest), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Lỗi khi cập nhật yêu cầu' }), { status: 500 });
  }
};

export const DELETE = async(request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return new Response(JSON.stringify({ error: 'User Request ID is required' }), {status: 400});
    }

    await prisma.userRequest.delete({
      where: { id: parseInt(id) }
    });

    return new Response(JSON.stringify({ success: true }), {status: 200});
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Lỗi khi xóa yêu cầu' }), {status: 500});
  }
};