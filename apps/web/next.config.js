/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // During builds, we'll check types at the root level
    ignoreBuildErrors: false,
  },
  eslint: {
    // During builds, we'll check linting at the root level
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig
