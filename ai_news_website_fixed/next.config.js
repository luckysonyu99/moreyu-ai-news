/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // 移除 output: 'export' 配置，改用 next export 命令
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

module.exports = nextConfig;
