import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
// import Link from "next/link";
import "./globals.scss";
import GlobalNavigation from "@/components/common/GlobalNavigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Next.JS Practice",
  description: "Next.JS Practice",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <header>
          <h1>NEXT.JS PRACTICE</h1>
        </header>
        <GlobalNavigation />
        <div className="container">{children}</div>
      </body>
    </html>
  );
}
