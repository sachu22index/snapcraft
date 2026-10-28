import hamperImage from "@/assets/snapcraft-hamper.jpg";
import bouquetsImage from "@/assets/flower-bouquet.jpeg";
import framesImage from "@/assets/snapcraft-frames.jpg";
import weddingImage from "@/assets/snapcraft-wedding.jpg";

export const serviceGroups = [
  {
    category: "Gift Hampers",
    intro: "Thoughtfully chosen, carefully arranged, and personalized for the moment.",
    items: [
      "Birthday Hampers",
      "Engagement Hampers",
      "Wedding Hampers",
      "Pregnancy Hampers",
      "Holy Communion Hampers",
      "Anniversary Hampers",
    ],
    image: hamperImage,
  },
  {
    category: "Bouquets & Gifts",
    intro: "Beautiful arrangements that bring flowers and favourite treats together.",
    items: ["Chocolate Bouquets", "Flower Bouquets", "Chocolate Towers"],
    image: bouquetsImage,
  },
  {
    category: "Photo Creations",
    intro: "Favourite photographs transformed into personal keepsakes to treasure.",
    items: ["Photo Frames", "Photo Merging Frames"],
    image: framesImage,
  },
  {
    category: "Wedding & Event Decoration",
    intro: "Elegant handmade details for meaningful ceremonies and celebrations.",
    items: [
      "Flower Decoration for Weddings",
      "Garlands for Bride & Groom",
      "Candles for Baptism",
      "Candles for Holy Communion",
    ],
    image: weddingImage,
  },
  {
    category: "Special Creations",
    intro: "Made-to-order touches for celebrations that deserve something different.",
    items: ["Cakes", "Custom Gift Creations", "Special Occasion Gifts"],
    image: bouquetsImage,
  },
] as const;
