/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        dangerouslyAllowSVG: true,
        remotePatterns: [
            {
                hostname: "res.cloudinary.com",
            },
        ],
    },
};

module.exports = nextConfig;
