/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    domains: ["res.cloudinary.com"], // 👈 Add Cloudinary here
  },
};

export default nextConfig;
