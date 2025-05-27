import React from 'react';
import { useRouter } from 'next/router';
import Script from 'next/script';

interface CommentSectionProps {
  darkMode?: boolean;
}

const CommentSection: React.FC<CommentSectionProps> = ({ darkMode = false }) => {
  const router = useRouter();
  const { slug } = router.query;

  // 使用 Giscus 作為評論系統
  // 基於 GitHub Discussions，支持 Markdown、夜間模式和多語言
  return (
    <div className="mt-10 pt-10 border-t border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">評論</h2>
      
      <div className="giscus-container">
        <Script
          src="https://giscus.app/client.js"
          data-repo="luckysongyu99/moreyu.eu.org"
          data-repo-id="R_kgDOLXXXXX" // 這裡需要替換為實際的 repo ID
          data-category="Comments"
          data-category-id="DIC_kwDOLXXXXX" // 這裡需要替換為實際的 category ID
          data-mapping="pathname"
          data-strict="0"
          data-reactions-enabled="1"
          data-emit-metadata="0"
          data-input-position="top"
          data-theme={darkMode ? "dark" : "light"}
          data-lang="zh-TW"
          data-loading="lazy"
          strategy="lazyOnload"
        />
      </div>
    </div>
  );
};

export default CommentSection;
