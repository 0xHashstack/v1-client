/** @type {import('next').NextConfig} */
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
          // {
          //   key: 'Content-Security-Policy',
          //   value:
          //     "default-src"
          // },
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
        ],
      },
    ];
  },
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  forceHTTP: true,
  // basePath: '/v1',
};

module.exports = nextConfig;

// const nextConfig = {
//   reactStrictMode: true,
//   swcMinify: true,
//   // async headers() {
//   //   return [
//   //     {
//   //       source: "/(.*)",
//   //       headers: [
//   //         {
//   //           key: "X-Frame-Options",
//   //           value: "DENY",
//   //         },
//   //         // {
//   //         //   key: "Content-Security-Policy",
//   //         //   value: "default-src 'self'",
//   //         // },
//   //         {
//   //           key: "X-Content-Type-Options",
//   //           value: "nosniff",
//   //         },
//   //         {
//   //           key: "Permissions-Policy",
//   //           value:
//   //             "camera=(); battery=(self); geolocation=(); microphone=('https://a-domain.com')",
//   //         },
//   //         {
//   //           key: "Strict-Transport-Security",
//   //           value: "max-age=63072000; includeSubDomains; preload",
//   //         },
//   //         {
//   //           key: "Referrer-Policy",
//   //           value: "origin-when-cross-origin",
//   //         },
//   //       ],
//   //     },
//   //   ];
//   // },
//   async headers() {
//     return [
//       {
//         source: "/(.*)",
//         headers: [
//           {
//             key: "X-Frame-Options",
//             value: "DENY",
//           },
//           // {
//           //   key: "Content-Security-Policy",
//           //   value: "default-src 'self'",
//           // },
//           {
//             key: "X-Content-Type-Options",
//             value: "nosniff",
//           },
//           {
//             key: "Permissions-Policy",
//             value:
//               "camera=(); battery=(self); geolocation=(); microphone=('https://a-domain.com')",
//           },
//           {
//             key: "Strict-Transport-Security",
//             value: "max-age=63072000; includeSubDomains; preload",
//           },
//           {
//             key: "Referrer-Policy",
//             value: "origin-when-cross-origin",
//           },
//         ],
//       },
//       // {
//       //   source: "/(.*)",
//       //   headers: [
//       //     {
//       //       key: "Content-Security-Policy",
//       //       value: "default-src 'self'",
//       //     },
//       //   ],
//       // },
//       // // Add more directives one by one below
//       // {
//       //   source: "/(.*)",
//       //   headers: [
//       //     {
//       //       key: "Content-Security-Policy",
//       //       value: "script-src 'self'",
//       //     },
//       //   ],
//       // },
//       // {
//       //   source: "/(.*)",
//       //   headers: [
//       //     {
//       //       key: "Content-Security-Policy",
//       //       value: "style-src 'self'",
//       //     },
//       //   ],
//       // },
//       // {
//       //   source: "/(.*)",
//       //   headers: [
//       //     {
//       //       key: "Content-Security-Policy",
//       //       value: "font-src 'self' https://fonts.googleapis.com",
//       //     },
//       //   ],
//       // },
//       // {
//       //   source: "/(.*)",
//       //   headers: [
//       //     {
//       //       key: "Content-Security-Policy",
//       //       value: "connect-src 'self' http://localhost:3000",
//       //     },
//       //   ],
//       // },
//       // Add more directives as per your requirements
//     ];
//   },
// };

// module.exports = nextConfig;
