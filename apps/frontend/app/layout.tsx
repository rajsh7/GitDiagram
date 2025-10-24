import type { Metadata } from "next";
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
  title: "GitDiagram",
  description: "Visualize your GitHub repositories like never before ⚡",
  icons: {
    icon: "/gitdiagram-logo.svg", // ✅ favicon icon from public folder
    shortcut: "/gitdiagram-logo.svg",
    apple: "/gitdiagram-logo.svg",
  },
  openGraph: {
    title: "GitDiagram",
    description: "A visual explorer for your GitHub repositories",
    url: "https://gitdiagram.vercel.app",
    siteName: "GitDiagram",
    images: [
      {
        url: "/gitdiagram-logo.svg",
        width: 200,
        height: 200,
        alt: "GitDiagram Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
      >
        {children}
      </body>
    </html>
  );
}
