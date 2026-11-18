/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', '127.0.0.1'],
    unoptimized: true,
  },
  async redirects() {
    return [
      // WordPress Blog & Article Permalinks SEO Protection
      {
        source: '/articles',
        destination: '/blog',
        permanent: false,
      },
      {
        source: '/news',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/news/:slug',
        destination: '/blog/:slug',
        permanent: true,
      },
      {
        source: '/category/:slug',
        destination: '/categories/:slug',
        permanent: true,
      },
      {
        source: '/blog/category/:slug',
        destination: '/categories/:slug',
        permanent: true,
      },
      {
        source: '/feed',
        destination: '/articles',
        permanent: false,
      },
      {
        source: '/blog/feed',
        destination: '/articles',
        permanent: false,
      },
      {
        source: '/tag/:slug',
        destination: '/articles',
        permanent: false,
      },
      {
        source: '/author/:slug',
        destination: '/articles',
        permanent: false,
      },
      // Admin and login protection
      {
        source: '/wp-admin/:path*',
        destination: '/login',
        permanent: false,
      },
      {
        source: '/wp-login.php',
        destination: '/login',
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'http://localhost:5000/api/v1/:path*',
      },
      {
        source: '/uploads/:path*',
        destination: 'http://localhost:5000/uploads/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
