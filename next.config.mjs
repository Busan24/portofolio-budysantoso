/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                port: '',
                pathname: '/djl755enm/**',
            },
        ],
        // Add device sizes for better image optimization
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        // Increase timeout for slower connections
        minimumCacheTTL: 60,
        // Add formats
        formats: ['image/webp'],
    },
};

export default nextConfig;
