/** @type {import('next').NextConfig} */
import type { Configuration } from 'webpack';
const path = require('path')

const nextConfig = {
  webpack: (config: Configuration) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@app': path.resolve(__dirname, 'app'),
      '@components': path.resolve(__dirname, 'components'),
    };
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'http://localhost:8080/api/v1/:path*',
      },
      {
        source: '/api/auth/:path*',
        destination: 'http://localhost:8080/api/auth/:path*',
      },
    ]
  },
}

module.exports = nextConfig
