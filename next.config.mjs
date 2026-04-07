/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co"
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com"
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn1.gstatic.com"
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn2.gstatic.com"
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn3.gstatic.com"
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn0.googleapis.com"
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn1.googleapis.com"
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn2.googleapis.com"
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn3.googleapis.com"
      },
      {
        protocol: "https",
        hostname: "i.ebayimg.com"
      },
      {
        protocol: "https",
        hostname: "thumbs1.ebaystatic.com"
      },
      {
        protocol: "https",
        hostname: "thumbs2.ebaystatic.com"
      },
      {
        protocol: "https",
        hostname: "thumbs3.ebaystatic.com"
      }
    ]
  }
};

export default nextConfig;
