import hamperImage from "@/assets/hamper.jpeg";
import bouquetsImage from "@/assets/bouquet-cards.jpeg";
import weddingImage from "@/assets/wedding.jpeg";

export const occasions = [
  {
    title: "Birthdays",
    short: "Birthday",
    description:
      "Birthday hampers, cakes, bouquets and personalized gifts made to bring extra joy.",
    image: bouquetsImage,
  },
  {
    title: "Engagements",
    short: "Engagement",
    description:
      "Engagement hampers, flowers, chocolates and personal gifts for a beautiful beginning.",
    image: hamperImage,
  },
  {
    title: "Weddings",
    short: "Wedding",
    description:
      "Wedding hampers, flower decorations, garlands and custom gifts for the celebration.",
    image: weddingImage,
  },
  {
    title: "Pregnancy",
    short: "Pregnancy",
    description: "Thoughtful pregnancy and celebration hampers, arranged with warmth and care.",
    image: hamperImage,
  },
  {
    title: "Holy Communion",
    short: "Holy Communion",
    description: "Meaningful Holy Communion hampers and candles for a cherished day.",
    image: weddingImage,
  },
  {
    title: "Baptism",
    short: "Baptism",
    description: "Elegant baptism candles and special gifts for a meaningful family occasion.",
    image: weddingImage,
  },
  {
    title: "Anniversaries",
    short: "Anniversary",
    description: "Personalized anniversary gifts, flowers, chocolates and hampers made with love.",
    image: bouquetsImage,
  },
] as const;
