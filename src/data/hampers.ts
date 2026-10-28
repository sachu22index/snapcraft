import hamperImage from "@/assets/hamper.jpeg";
import jumkaset2 from "@/assets/jumka2.jpeg";
import bouquetsImage from "@/assets/bouquet-cards.jpeg";

export const hampers = [
  {
    title: "Birthday Hampers",
    occasion: "Birthday",
    description:
      "A joyful mix of thoughtful treats, flowers and personal touches for their special day.",
    image: hamperImage,
  },
  {
    title: "Engagement Hampers",
    occasion: "Engagement",
    description: "Elegant gifting curated to celebrate a beautiful new beginning together.",
    image: hamperImage,
  },
  {
    title: "Wedding Hampers",
    occasion: "Wedding",
    description:
      "Graceful keepsakes and treats, beautifully presented for the couple and their celebration.",
    image: hamperImage,
  },
  {
    title: "Pregnancy Hampers",
    occasion: "Pregnancy",
    description: "A warm, caring gesture created to celebrate a precious chapter of anticipation.",
    image: hamperImage,
  },
  {
    title: "Holy Communion Hampers",
    occasion: "Holy Communion",
    description: "Meaningful gifts arranged with reverence and an elegant celebratory touch.",
    image: hamperImage,
  },
  {
    title: "Anniversary Hampers",
    occasion: "Anniversary",
    description: "Romantic, personal gifts designed to honour the memories you share.",
    image: hamperImage,
  },
  {
    title: "Jumka set2",
    occasion: "Hospital",
    description:
      "Comforting and thoughtful treats to lift spirits and bring a smile during recovery.",
    image: jumkaset2,
  },
] as const;
