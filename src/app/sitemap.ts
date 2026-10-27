import {MetadataRoute} from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://vector-taxi.uz",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1.0,
      alternates: {
        languages: {
          uz: "https://vector-taxi.uz",
          en: "https://vector-taxi.uz/en",
          ru: "https://vector-taxi.uz/ru",
          kr: "https://vector-taxi.uz/kr",
        },
      },
    },
  ];
}