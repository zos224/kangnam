import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Đội ngũ bác sĩ | Phòng khám Thẩm mỹ',
    description: 'Đội ngũ bác sĩ chuyên nghiệp với nhiều năm kinh nghiệm trong lĩnh vực thẩm mỹ',
}

export default function DoctorTeamLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <section>
            {children}
        </section>
    )
}