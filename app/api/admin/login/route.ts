import prisma from "@/utils/db";
import { NextRequest } from "next/server";
import bcrypt from "bcrypt";

export const POST = async(request: NextRequest) => {
    try {
        const body = await request.json();
        
        // Kiểm tra username đã tồn tại
        const existing = await prisma.admin.findUnique({
            where: { username: body.username}
        });
    
        if (existing) {
            const isValidPassword = await bcrypt.compare(body.password, existing.password);
            
            if (!isValidPassword) {
                return new Response(
                    JSON.stringify({ error: 'Mật khẩu không đúng' }), 
                    { status: 400 }
                );
            }
            return new Response(JSON.stringify({name: existing.name, id: existing.id}), { status: 200 });
        }

        return new Response(JSON.stringify({error: "Thông tin đăng nhập không chính xác!"}), { status: 500 });
    } catch (error) {
      console.error(error);
      return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
  };