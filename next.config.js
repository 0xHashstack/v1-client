const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  swcMinify: true,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(); battery=(self); geolocation=(); microphone=('https://a-domain.com')",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*', // Replace with your allowed origin(s)
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS', // Specify allowed HTTP methods
          },
          // {
          //   key: "Referrer-Policy",
          //   value: "origin-when-cross-origin",
          // },
        ],
      },
    ];
  },
  trailingSlash: true,
};

module.exports = nextConfig;
