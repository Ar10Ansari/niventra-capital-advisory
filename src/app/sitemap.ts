import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://niventracapitaladvisory.com";
  const lastModified = new Date("2026-10-15");

  const routes = [
    "",
    "/about/",
    "/debt-debenture/",
    "/real-estate/",
    "/due-diligence/",
    "/capital-providers/",
    "/investor-information/",
    "/calculator/",
    "/products/",
    "/contact/",
    "/risk-disclosure/",
    "/terms-conditions/",
    "/privacy-policy/",
    "/regulatory-disclosures/",
    "/grievance/",
    "/support-faq/",
    "/delete-account/",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1.0 : route.startsWith("/debt") || route.startsWith("/real") ? 0.9 : 0.7,
  }));
}
