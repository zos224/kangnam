import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Giới thiệu | Thẩm mỹ viện',
    description: 'Thông tin giới thiệu về thẩm mỹ viện của chúng tôi',
}

export default function IntroductionLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}