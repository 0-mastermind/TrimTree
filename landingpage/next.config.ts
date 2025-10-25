/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "randomuser.me",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",  
      },
    ],
    qualities: [25, 50, 75, 100],
  },
};

export default nextConfig;
