import prisma from "@/utils/db";
import { NextRequest } from "next/server";
import bcrypt from "bcrypt";

export const GET = async(request: NextRequest) => {
  const { searchParams } = new URL(request.url);

  // Xử lý phân trang
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const skip = (page - 1) * limit;

  // Lấy tổng số admins và danh sách theo trang
  const [total, admins] = await Promise.all([
    prisma.admin.count(),
    prisma.admin.findMany({
      skip,
      take: limit,
      select: {
        id: true,
        username: true,
        name: true,
        _count: {
          select: { blogs: true }
        }
      },
      orderBy: {
        id: 'desc'
      }
    })
  ]);

  return new Response(JSON.stringify({
    data: admins,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }), {status: 200});
};

export const POST = async(request: NextRequest) => {
  try {
    const body = await request.json();
    
    // Kiểm tra username đã tồn tại
    const existing = await prisma.admin.findUnique({
      where: { username: body.username }
    });

    if (existing) {
      return new Response(
        JSON.stringify({ error: 'Tên đăng nhập đã tồn tại' }), 
        { status: 400 }
      );
    }

    // Hash mật khẩu
    const hashedPassword = await bcrypt.hash(body.password, 10);

    const admin = await prisma.admin.create({
      data: {
        username: body.username,
        password: hashedPassword,
        name: body.name
      },
      select: {
        id: true,
        username: true,
        name: true
      }
    });

    return new Response(JSON.stringify(admin), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
};

export const PUT = async(request: NextRequest) => {
  try {
    const body = await request.json();
    
    // Kiểm tra username đã tồn tại (trừ chính nó)
    if (body.username) {
      const existing = await prisma.admin.findFirst({
        where: { 
          username: body.username,
          NOT: { id: body.id }
        }
      });

      if (existing) {
        return new Response(
          JSON.stringify({ error: 'Tên đăng nhập đã tồn tại' }), 
          { status: 400 }
        );
      }
    }

    const updateData: any = {
      name: body.name
    };

    if (body.username) {
      updateData.username = body.username;
    }

    if (body.password) {
      updateData.password = await bcrypt.hash(body.password, 10);
    }

    const admin = await prisma.admin.update({
      where: { id: body.id },
      data: updateData,
      select: {
        id: true,
        username: true,
        name: true
      }
    });

    return new Response(JSON.stringify(admin), { status: 200 });
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
      return new Response(JSON.stringify({ error: 'Admin ID is required' }), { status: 400 });
    }

    // Kiểm tra xem có bài viết nào của admin này không
    const blogCount = await prisma.blog.count({
      where: { idAuthor: parseInt(id) }
    });

    if (blogCount > 0) {
      return new Response(
        JSON.stringify({ 
          error: 'Không thể xóa tài khoản này vì đã có bài viết được tạo' 
        }), 
        { status: 400 }
      );
    }

    await prisma.admin.delete({
      where: { id: parseInt(id) }
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
};