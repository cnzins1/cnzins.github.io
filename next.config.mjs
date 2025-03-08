/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['resources.finalsite.net', 'v0.blob.com'],
  },
  // Add this to ensure proper file serving
  trailingSlash: true,
}

export default nextConfig;

