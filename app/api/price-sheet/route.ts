import prisma from "@/utils/db";
import { NextRequest } from "next/server";

export const GET = async(request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  
  // Nếu có id service, trả về tất cả price sheets của service đó
  if (searchParams.has('idService')) {
    const idService = searchParams.get('idService');
    const priceSheets = await prisma.priceSheet.findMany({
      where: { idService: parseInt(idService!) },
      include: { service: true }
    });
    return new Response(JSON.stringify(priceSheets), {status: 200});
  }
  return new Response(JSON.stringify({ error: 'Service ID is required' }), {status: 400});
};

export const POST = async(request: NextRequest) => {
  try {
    const body = await request.json();
    
    const priceSheet = await prisma.priceSheet.create({
      data: {
        name: body.name,
        price: body.price,
        image: body.image,
        idService: body.idService
      },
      include: {
        service: true
      }
    });
    
    return new Response(JSON.stringify(priceSheet), {status: 201});
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {status: 500});
  }
};

export const PUT = async(request: NextRequest) => {
  try {
    const body = await request.json();

    const priceSheet = await prisma.priceSheet.update({
      where: { id: body.id },
      data: {
        name: body.name,
        price: body.price,
        image: body.image,
        idService: body.idService
      },
      include: {
        service: true
      }
    });
    
    return new Response(JSON.stringify(priceSheet), {status: 200});
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
      return new Response(JSON.stringify({ error: 'Price Sheet ID is required' }), {status: 400});
    }

    await prisma.priceSheet.delete({
      where: { id: parseInt(id) }
    });

    return new Response(JSON.stringify({ success: true }), {status: 200});
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {status: 500});
  }
}; 