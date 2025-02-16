import prisma from "@/utils/db";
import { NextRequest } from "next/server";

export const GET = async(request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  
  // Nếu có idLanguage, trả về setting cho ngôn ngữ cụ thể
  if (searchParams.has('idLanguage')) {
    const idLanguage = searchParams.get('idLanguage');
    const setting = await prisma.setting.findFirst({
      where: { idLanguage: idLanguage ? parseInt(idLanguage) : undefined },
      include: { language: true, chinhSachBaoMat: true, dieuKhoanSuDung: true, chinhSachRiengTu: true, quyTrinhKiemSoat: true, tieuChuanChatLuong: true }
    });
    return new Response(JSON.stringify(setting), {status: 200});
  }
  return new Response(JSON.stringify([]), {status: 200});
}

export const POST = async(request: NextRequest) => {
  const body = await request.json();
  const setting = await prisma.setting.create({
    data: {
      name: body.name,
      idLanguage: body.idLanguage,
      hotline: body.hotline,
      urlFacebook: body.urlFacebook,
      urlYoutube: body.urlYoutube,
      urlInstagram: body.urlInstagram,
      urlTiktok: body.urlTiktok,
      logo: body.logo,
      favicon: body.favicon,
      bannerStory: body.bannerStory,
      bannerBlog: body.bannerBlog,
      workTime: body.workTime,
      titleFooter: body.titleFooter,
      detailFooter: body.detailFooter,
      idChinhSachBaoMat: body.idChinhSachBaoMat ? parseInt(body.idChinhSachBaoMat) : null,
      idDieuKhoanSuDung: body.idDieuKhoanSuDung ? parseInt(body.idDieuKhoanSuDung) : null,
      idChinhSachRiengTu: body.idChinhSachRiengTu ? parseInt(body.idChinhSachRiengTu) : null,
      idQuyTrinhKiemSoat: body.idQuyTrinhKiemSoat ? parseInt(body.idQuyTrinhKiemSoat) : null,
      idTieuChuanChatLuong: body.idTieuChuanChatLuong ? parseInt(body.idTieuChuanChatLuong) : null
    }
  });
  return new Response(JSON.stringify(setting), {status: 201});
}

export const PUT = async(request: NextRequest) => {
  const body = await request.json();
  const setting = await prisma.setting.update({
    where: { id: body.id },
    data: {
      name: body.name,
      idLanguage: body.idLanguage,
      hotline: body.hotline,
      urlFacebook: body.urlFacebook,
      urlYoutube: body.urlYoutube,
      urlInstagram: body.urlInstagram,
      urlTiktok: body.urlTiktok,
      logo: body.logo,
      favicon: body.favicon,
      bannerStory: body.bannerStory,
      bannerBlog: body.bannerBlog,
      workTime: body.workTime,
      titleFooter: body.titleFooter,
      detailFooter: body.detailFooter,
      idChinhSachBaoMat: body.idChinhSachBaoMat ? parseInt(body.idChinhSachBaoMat) : null,
      idDieuKhoanSuDung: body.idDieuKhoanSuDung ? parseInt(body.idDieuKhoanSuDung) : null,
      idChinhSachRiengTu: body.idChinhSachRiengTu ? parseInt(body.idChinhSachRiengTu) : null,
      idQuyTrinhKiemSoat: body.idQuyTrinhKiemSoat ? parseInt(body.idQuyTrinhKiemSoat) : null,
      idTieuChuanChatLuong: body.idTieuChuanChatLuong ? parseInt(body.idTieuChuanChatLuong) : null
    }
  });
  return new Response(JSON.stringify(setting), {status: 200});
} 