import prisma from '@/utils/db';

export async function generateMetadata({ params }: { params: Promise<{slug: string}>} ) {
    const slug = await params;
    const article = await prisma.blog.findFirst({where: {slug: slug.slug}})

    return {
        title: article?.title,
        description: article?.content.slice(0, 100),
    };
}

export default function ArticleLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}