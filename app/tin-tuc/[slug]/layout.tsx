import prisma from "@/utils/db";

export async function generateMetadata({ params }: {params: Promise<{slug: string}>}) {
    const slug = await params;
    const blogType = await prisma.blogType.findFirst({where: {slug: slug}.slug})

    return {
        title: blogType?.name,
        description: "Các tin tức, nội dung hấp dẫn về " + blogType?.name
    };
}

export default function NewsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}