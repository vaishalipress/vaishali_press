/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        dangerouslyAllowSVG: true,
        remotePatterns: [
            {
                hostname: "tailwindui.com",
            },
        ],
    },
};

module.exports = nextConfig;
