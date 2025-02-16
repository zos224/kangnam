import prisma from '@/utils/db';

export async function generateMetadata({ params }: {params: Promise<{slug: string}>}) {
    const slug = await params;
    const story = await prisma.story.findFirst({where: {slug: slug.slug}})

    return {
        title: story?.title,
        description: story?.content.slice(0, 100),
    };
}

export default function StoryLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}