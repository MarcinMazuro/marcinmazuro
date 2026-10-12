import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required by the Cloud Run Docker image - Next bundles the server with
  // a minimal set of dependencies into .next/standalone
  output: "standalone",
  experimental: {
    // The root layout sits under [lang], so unmatched URLs need a global 404
    globalNotFound: true,
  },
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          // The site cannot be framed by other origins (clickjacking)
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
