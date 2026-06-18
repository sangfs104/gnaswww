const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gansbee.onrender.com",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;