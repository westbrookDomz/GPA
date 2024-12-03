/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config, { isServer }) => {
    // Add any webpack configurations if needed
    return config;
  },
};

module.exports = nextConfig;
