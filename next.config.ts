import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Wymagane przez obraz Dockera na Cloud Run - Next pakuje serwer
  // wraz z minimalnym zestawem zależności do .next/standalone
  output: "standalone",
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:sciezka*",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Strony nie da się osadzić w ramce na obcej witrynie (clickjacking)
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
