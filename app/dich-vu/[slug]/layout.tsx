import prisma from '@/utils/db';
import { Metadata } from 'next';

export async function generateMetadata({ params }: {params: Promise<{slug: string}>}) {
    const slug = await params;
    const service = await prisma.service.findFirst({where: {slug: slug.slug}})

    return {
        title: service?.name,
        description: (service?.content as { introduce: string })?.introduce,
    };
}

export default function ServiceLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}