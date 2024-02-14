/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['res.cloudinary.com', 'sitesnap-design.s3.amazonaws.com'],
  },
};

module.exports = nextConfig;
