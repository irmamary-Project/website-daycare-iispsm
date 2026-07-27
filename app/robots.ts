import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/guru/", "/ortu/", "/auth/", "/cctv", "/api/"],
      },
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: ["/guru/", "/ortu/", "/auth/", "/cctv", "/api/"],
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: ["/guru/", "/ortu/", "/auth/", "/cctv", "/api/"],
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: ["/guru/", "/ortu/", "/auth/", "/cctv", "/api/"],
      },
    ],
    sitemap: "https://energiakidsdaycare.my.id/sitemap.xml",
  };
}
