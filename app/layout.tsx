import type { Metadata } from "next";
import '@fontsource/montserrat';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Thẩm Mỹ Viện Kangnam",
    template: "%s | Thẩm Mỹ Viện Kangnam"
  },
  description: "Thẩm mỹ viện Kangnam - Hệ thống thẩm mỹ viện hàng đầu Việt Nam với công nghệ hiện đại và đội ngũ bác sĩ chuyên môn cao",
  keywords: ["thẩm mỹ viện", "phẫu thuật thẩm mỹ", "làm đẹp", "kangnam"],
  robots: {
    index: true,
    follow: true
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "Thẩm Mỹ Viện Kangnam"
  },
  manifest: "./manifest.json",
  applicationName: "Kangnam"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <meta name="apple-mobile-web-app-title" content="Kangnam" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
