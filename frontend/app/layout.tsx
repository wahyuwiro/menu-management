import { ReactNode } from 'react';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from '@/components/Sidebar';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Menu Management System',
  description: 'Manage menus and systems efficiently.',
};

interface LayoutProps {
  children: ReactNode;
}
export default function RootLayout({ children }: LayoutProps) {

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        
      <div className="flex min-h-screen">
          <Sidebar />
          
          <div className="flex-1 p-8 overflow-auto">
            {children}
          </div>
        </div>
        
      </body>
    </html>
  );
}
