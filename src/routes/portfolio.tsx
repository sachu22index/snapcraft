import { createFileRoute } from "@tanstack/react-router";
import framesImage from "@/assets/snapcraft-frames.jpg";
import { PageHero, PortfolioGallery, SectionTitle, CTASection } from "@/components/Site";
export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — SnapCraft Custom Creations" },
      {
        name: "description",
        content:
          "Explore a visual collection of SnapCraft hampers, bouquets, frames, wedding details, decorations and cakes.",
      },
      { property: "og:title", content: "SnapCraft Portfolio" },
      {
        property: "og:description",
        content: "A visual collection of heartfelt gifts and celebration details.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Portfolio,
});
function Portfolio() {
  return (
    <>
      <PageHero
        eyebrow="Selected work"
        title="A Gallery Of Thoughtful Details"
        text="Explore the textures, colours and personal touches that inspire SnapCraft’s gifts and celebration creations."
        image={framesImage}
      />
      <section className="section">
        <SectionTitle
          eyebrow="The portfolio"
          title="Created For Meaningful Moments"
          align="center"
        />
        <PortfolioGallery />
      </section>
      <CTASection />
    </>
  );
}
