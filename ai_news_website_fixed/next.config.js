/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  eslint: {
    // 禁用 ESLint
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
