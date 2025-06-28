/** @type {import('next').NextConfig} */
const nextConfig = {
  // === 배포 설정 ===
  output: 'standalone',
  compress: true,
  poweredByHeader: false,

  // === 환경변수 ===
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // === 성능 최적화 ===
  experimental: {
    // 런타임 최적화
    optimizeCss: true,

    // 번들 크기 최적화
    optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
  },

  // === 서버 외부 패키지 설정 ===
  serverExternalPackages: [],

  // === 이미지 최적화 ===
  images: {
    // 외부 이미지 도메인 허용
    domains: ['localhost'],

    // 이미지 형식 최적화
    formats: ['image/webp', 'image/avif'],

    // 이미지 크기 설정
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // === 리다이렉트 및 리라이트 ===
  async redirects() {
    return [
      // 예시: 루트에서 대시보드로 리다이렉트
      // {
      //   source: '/',
      //   destination: '/dashboard',
      //   permanent: false,
      // },
    ];
  },

  async rewrites() {
    // 백엔드 통합 배포에서는 nginx가 프록시를 처리하므로 비활성화
    if (process.env.NEXT_PUBLIC_BACKEND_INTEGRATED === 'true') {
      return [];
    }

    // 분리 배포에서만 사용
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL
        || 'http://localhost:8080'}/:path*`,
      },
    ];
  },

  // === 웹팩 설정 ===
  webpack: (config, {buildId, dev, isServer, defaultLoaders, webpack}) => {
    // 프로덕션 빌드 최적화
    if (!dev) {
      config.optimization.minimize = true;
    }

    // 번들 분석 (개발 시에만)
    if (dev && process.env.ANALYZE === 'true') {
      const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
      config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'server',
            openAnalyzer: true,
          })
      );
    }

    return config;
  },

  // === 보안 헤더 ===
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },

  // === 컴파일러 설정 ===
  compiler: {
    // 프로덕션에서 console.log 제거
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error'],
    } : false,
  },

  // === TypeScript 설정 ===
  typescript: {
    // 타입 검사를 빌드 시에만 수행
    ignoreBuildErrors: false,
  },

  // === ESLint 설정 ===
  eslint: {
    // 빌드 중 ESLint 실행
    ignoreDuringBuilds: false,
  },

  // === 트레일링 슬래시 설정 ===
  trailingSlash: false,

  // === 국제화 설정 (필요시) ===
  // i18n: {
  //   locales: ['ko', 'en'],
  //   defaultLocale: 'ko',
  // },
};

module.exports = nextConfig;
