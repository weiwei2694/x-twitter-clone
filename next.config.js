/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		serverActions: true,
	},
	images: {
		domains: ["img.clerk.com", "utfs.io"],
	},
};

module.exports = nextConfig;
