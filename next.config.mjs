/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true
  },
  experimental: {
    optimizePackageImports: ["react-hook-form", "zustand"],
  },
};

export default nextConfig;
