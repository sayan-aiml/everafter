/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
  async headers() {
    // Next.js dev mode relies on `eval` for React Fast Refresh / hot reload,
    // so 'unsafe-eval' is required in script-src during development. This is
    // a dev-tooling requirement, not a production security hole: the build
    // output served in production does not use eval, so we drop 'unsafe-eval'
    // there and keep the strict policy.
    const isDev = process.env.NODE_ENV !== "production";
    const scriptSrc = isDev
      ? "script-src 'self' 'unsafe-inline' 'unsafe-eval';"
      : "script-src 'self' 'unsafe-inline';";

    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Content-Security-Policy",
            value:
              `default-src 'self'; img-src 'self' https://*.supabase.co data:; ${scriptSrc} style-src 'self' 'unsafe-inline'; connect-src 'self' https://*.supabase.co;`,
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
