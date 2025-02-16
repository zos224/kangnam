export const metadata = {
    title: 'Cơ sở vật chất | Trung tâm Thẩm mỹ',
    description: 'Trang thông tin về cơ sở vật chất của Trung tâm Thẩm mỹ',
};

export default function CoSoVatChatLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section>
            {children}
        </section>
    );
}