import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "lumizo.my.id" },
    ],
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.energiakidsdaycare.my.id" }],
        destination: "https://energiakidsdaycare.my.id/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
