import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
      {
        userAgent: ["GPTBot", "ChatGPT-User", "ClaudeBot", "Bytespider", "CCBot", "diffbot"],
        disallow: ["/"],
      },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL || "https://aarenstudio.vercel.app"}/sitemap.xml`,
  };
}
