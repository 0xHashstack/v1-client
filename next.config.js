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
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,HEAD,OPTIONS,POST,PUT",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Origin, X-Requested-With, Content-Type, Accept",
          },
        ],
      },
    ];
  },
  trailingSlash: true,
};

module.exports = nextConfig;
