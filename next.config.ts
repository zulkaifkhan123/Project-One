// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "", // optional
        pathname: "/**", // allows all paths
      },
    ],
  },
};

module.exports = nextConfig;

