import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.gorentaldha.com"; // Agar custom domain hai to wo, warna Vercel URL

  try {
    const properties = await prisma.property.findMany({
      select: { id: true, updatedAt: true },
    });

    const propertyUrls: MetadataRoute.Sitemap = properties.map((prop) => ({
      url: `${baseUrl}/property/${prop.id}`,
      lastModified: prop.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1.0,
      },
      {
        url: `${baseUrl}/properties`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.9,
      },
      ...propertyUrls,
    ];
  } catch {
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1.0,
      },
    ];
  }
}