import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Fixora — Home Services",
    short_name: "Fixora",
    description:
      "Book verified technicians for plumbing, electrical, appliance and home repairs with transparent pricing.",
    id: "/",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#e8ebe6",
    theme_color: "#e8ebe6",
    categories: ["business", "utilities", "lifestyle"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      { src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcuts: [
      { name: "Browse services", url: "/services" },
      { name: "My bookings", url: "/bookings" },
    ],
  };
}
