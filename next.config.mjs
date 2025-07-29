/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    // Add a rule to handle .txt files
    config.module.rules.push({
      test: /\.txt$/,
      type: 'asset/source', // Treat .txt files as raw text
    });

    return config;
  },
}

export default nextConfig
