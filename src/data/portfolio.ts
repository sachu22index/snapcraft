import hamperImage from "@/assets/snapcraft-hamper.jpg";
import bouquetsImage from "@/assets/snapcraft-bouquets.jpg";
import framesImage from "@/assets/snapcraft-frames.jpg";
import weddingImage from "@/assets/snapcraft-wedding.jpg";
import shose from "@/assets/image.png";

export const creations = [
  {
    title: "Birthday Gift Hamper",
    category: "Hampers",
    description: "A celebratory hamper tailored around the person and the moment.",
    image: shose,
  },
  {
    title: "Engagement Gift",
    category: "Hampers",
    description: "An elegant arrangement to mark the promise of a life together.",
    image: hamperImage,
  },
  {
    title: "Wedding Gift",
    category: "Hampers",
    description: "A polished, personal creation for the wedding celebration.",
    image: weddingImage,
  },
  {
    title: "Pregnancy Gift",
    category: "Hampers",
    description: "A caring hamper for a beautiful new chapter.",
    image: hamperImage,
  },
  {
    title: "Anniversary Gift",
    category: "Hampers",
    description: "A romantic keepsake created around shared memories.",
    image: bouquetsImage,
  },
  {
    title: "Photo Frame",
    category: "Photo Frames",
    description: "A favourite memory presented as a timeless display.",
    image: framesImage,
  },
  {
    title: "Photo Merging Frame",
    category: "Photo Frames",
    description: "Several meaningful photographs composed into one special keepsake.",
    image: framesImage,
  },
  {
    title: "Chocolate Bouquet",
    category: "Bouquets",
    description: "Favourite chocolates arranged with the drama of a bouquet.",
    image: bouquetsImage,
  },
  {
    title: "Flower Bouquet",
    category: "Bouquets",
    description: "Fresh floral beauty composed for the occasion.",
    image: bouquetsImage,
  },
  {
    title: "Chocolate Tower",
    category: "Bouquets",
    description: "A show-stopping sweet centrepiece for joyful celebrations.",
    image: bouquetsImage,
  },
  {
    title: "Celebration Cake",
    category: "Cakes",
    description: "A beautiful cake designed to complement your special moment.",
    image: bouquetsImage,
  },
  {
    title: "Wedding Flowers",
    category: "Weddings",
    description: "Romantic floral styling for a graceful wedding setting.",
    image: weddingImage,
  },
  {
    title: "Bride & Groom Garlands",
    category: "Decorations",
    description: "Traditional floral garlands thoughtfully created for the couple.",
    image: weddingImage,
  },
  {
    title: "Ceremony Candles",
    category: "Decorations",
    description: "Elegant candles for Baptism and Holy Communion ceremonies.",
    image: weddingImage,
  },
] as const;

export const portfolioItems = creations.map((item, index) => ({ ...item, id: index + 1 }));
export const portfolioCategories = [
  "All",
  "Hampers",
  "Bouquets",
  "Photo Frames",
  "Weddings",
  "Decorations",
  "Cakes",
] as const;
