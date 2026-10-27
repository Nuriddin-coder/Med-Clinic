import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MED Clinic — onlayn tibbiy xizmatlar",
    short_name: "MED Clinic",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#872AFF",
    lang: "uz",
    description: "Shifokor tanlang va qabulga onlayn yoziling.",
    prefer_related_applications: false,
    categories: ["health", "medical"],
    orientation: "portrait-primary",
    dir: "ltr",
  };
}
