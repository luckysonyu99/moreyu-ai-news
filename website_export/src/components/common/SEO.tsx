import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: string;
  canonicalUrl?: string;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  ogImage,
  ogType = 'website',
  canonicalUrl,
}) => {
  const router = useRouter();
  const siteName = 'MoreYu - AI與技術新聞教程';
  const defaultTitle = 'MoreYu - 最新AI與技術新聞、教程與資源';
  const defaultDescription = 'MoreYu提供最新AI人工智能、機器學習、深度學習以及各種技術領域的新聞、教程與資源，每48小時更新高質量內容。';
  const defaultKeywords = ['AI', '人工智能', '機器學習', '深度學習', '技術教程', '編程', 'GPT', 'LLM'];
  const defaultOgImage = '/images/og-image.png';
  
  const seoTitle = title ? `${title} | ${siteName}` : defaultTitle;
  const seoDescription = description || defaultDescription;
  const seoKeywords = keywords || defaultKeywords;
  const seoOgImage = ogImage || defaultOgImage;
  const seoCanonicalUrl = canonicalUrl || `https://moreyu.eu.org${router.asPath}`;

  return (
    <Head>
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords.join(', ')} />
      
      {/* 規範連結 */}
      <link rel="canonical" href={seoCanonicalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={seoCanonicalUrl} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={`https://moreyu.eu.org${seoOgImage}`} />
      <meta property="og:site_name" content={siteName} />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={seoCanonicalUrl} />
      <meta property="twitter:title" content={seoTitle} />
      <meta property="twitter:description" content={seoDescription} />
      <meta property="twitter:image" content={`https://moreyu.eu.org${seoOgImage}`} />
      
      {/* 其他重要的 meta 標籤 */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="Traditional Chinese" />
      <meta name="revisit-after" content="7 days" />
      <meta name="author" content="MoreYu" />
    </Head>
  );
};

export default SEO;
