import prisma from '@/utils/db';
import { Metadata } from 'next';

export async function generateMetadata({ params }: {params: Promise<{"service-item": string}>}) {
    const slug = await params;
    const serviceItem = await prisma.blog.findFirst({where: {slug: slug['service-item']}})

    return {
        title: serviceItem?.title,
        description: serviceItem?.content.slice(0, 100),
    };
}

export default function ServiceLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}