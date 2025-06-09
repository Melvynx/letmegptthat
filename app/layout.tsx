import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Let me ask chatgpt for you",
  description: "Easily ask chatgpt for anything",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full dark">
      <body className="h-full">{children}</body>
    </html>
  );
}
