/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['resources.finalsite.net', 'v0.blob.com'],
    unoptimized: true,
  },
  output: 'export',  // Required for static exports
  trailingSlash: true,
}

export default nextConfig;

