/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com'
      },
      {
        protocol: 'https',
        hostname: 'yousef-portfolio.oss-eu-central-1.aliyuncs.com'
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com'
      }
    ]
  },
  serverExternalPackages: [
    'fluent-ffmpeg',
    '@ffmpeg-installer/ffmpeg',
    '@ffprobe-installer/ffprobe'
  ]
};

export default nextConfig;
