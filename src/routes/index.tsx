import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/Hero";
import { CategorySection } from "@/components/CategorySection";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { CustomGiftBuilder } from "@/components/CustomGiftBuilder";
import { OccasionsSection } from "@/components/OccasionsSection";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { AboutSection } from "@/components/AboutSection";
import { ReviewsSection } from "@/components/ReviewsSection";
import { InstagramSection } from "@/components/InstagramSection";
import { NewsletterSection } from "@/components/NewsletterSection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SnapCraft — Craft Hampers & Bouquets | Thoughtfully Crafted, Beautifully Gifted" },
      {
        name: "description",
        content:
          "Handcrafted hampers and fresh bouquets made to turn every special moment into a beautiful memory. Custom gifts, chocolates, flower arrangements & pan-India delivery.",
      },
      { property: "og:title", content: "SnapCraft — Craft Hampers & Bouquets" },
      {
        property: "og:description",
        content:
          "Thoughtfully Crafted. Beautifully Gifted. Luxury hampers, flower bouquets and custom gifts.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <div className="snapcraft-home-page">
      {/* 2. HERO SECTION */}
      <Hero />

      {/* 3. SHOP BY CATEGORY */}
      <CategorySection />

      {/* 4. FEATURED COLLECTION: "Made to Make Them Smile" */}
      <FeaturedProducts />

      {/* 5. CUSTOM GIFT BUILDER: "Create a Gift That’s Uniquely Yours" */}
      <CustomGiftBuilder />

      {/* 6. OCCASIONS SECTION */}
      <OccasionsSection />

      {/* 7. WHY SNAPCRAFT */}
      <WhyChooseUs />

      {/* 8. ABOUT SNAPCRAFT */}
      <AboutSection />

      {/* 9. CUSTOMER REVIEWS */}
      <ReviewsSection />

      {/* 10. INSTAGRAM / SOCIAL SECTION */}
      <InstagramSection />

      {/* 11. NEWSLETTER */}
      <NewsletterSection />
    </div>
  );
}
