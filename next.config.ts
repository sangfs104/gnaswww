/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Tạm thời cho dev (rất hiệu quả)
    unoptimized: true,        // ← Thêm dòng này

    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/images/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/img/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '3000',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;