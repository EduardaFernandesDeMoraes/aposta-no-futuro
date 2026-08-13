import { createFileRoute } from "@tanstack/react-router";
import "@tanstack/react-start";

const BASE_URL = "https://apostanofuturo.online";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/bem-vindo", changefreq: "monthly", priority: "0.6" },
          { path: "/simulador", changefreq: "monthly", priority: "0.9" },
          { path: "/comunidade", changefreq: "weekly", priority: "0.8" },
          { path: "/metas", changefreq: "monthly", priority: "0.7" },
          { path: "/perfil", changefreq: "monthly", priority: "0.5" },
          { path: "/autoavaliacao", changefreq: "monthly", priority: "0.8" },
          { path: "/ajuda", changefreq: "monthly", priority: "0.9" },
          { path: "/guia/parar-de-apostar", changefreq: "monthly", priority: "0.9" },
          { path: "/privacidade", changefreq: "yearly", priority: "0.3" },
          { path: "/termos", changefreq: "yearly", priority: "0.3" },
          { path: "/sobre", changefreq: "yearly", priority: "0.4" },
        ];

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
