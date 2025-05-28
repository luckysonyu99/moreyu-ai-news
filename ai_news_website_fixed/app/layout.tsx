import React from 'react';
import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'MoreYu - AI與技術新聞教程',
  description: 'MoreYu提供最新AI人工智能、機器學習、深度學習以及各種技術領域的新聞、教程與資源',
  keywords: 'AI, 人工智能, 機器學習, 深度學習, 技術教程, 編程, 開發',
  authors: [{ name: 'MoreYu Team' }],
  creator: 'MoreYu',
  publisher: 'MoreYu',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'MoreYu - AI與技術新聞教程',
    description: 'MoreYu提供最新AI人工智能、機器學習、深度學習以及各種技術領域的新聞、教程與資源',
    url: 'https://moreyu.eu.org',
    siteName: 'MoreYu',
    locale: 'zh_TW',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MoreYu - AI與技術新聞教程',
    description: 'MoreYu提供最新AI人工智能、機器學習、深度學習以及各種技術領域的新聞、教程與資源',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
} ) {
  return (
    <html lang="zh-TW">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
