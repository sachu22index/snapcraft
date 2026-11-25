import { createFileRoute } from "@tanstack/react-router";
import bouquetsImage from "@/assets/snapcraft-bouquets.jpg";
import { CreationGrid, CTASection, PageHero, SectionTitle } from "@/components/Site";
type CreationsSearch = {
  occasion?: string | undefined;
};

export const Route = createFileRoute("/creations")({
  validateSearch: (s: Record<string, unknown>): CreationsSearch => {
    const occ = typeof s["occasion"] === "string" ? (s["occasion"] as string) : undefined;
    return occ ? { occasion: occ } : {};
  },
  head: () => ({
    meta: [
      { title: "Creations — SnapCraft Gift Catalogue" },
      {
        name: "description",
        content:
          "Browse custom hampers, photo frames, bouquets, chocolate towers, cakes and special gifts by SnapCraft.",
      },
      { property: "og:title", content: "SnapCraft Creations" },
      {
        property: "og:description",
        content: "Explore personalized creations made for gifting and celebrating.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Creations,
});
function Creations() {
  const { occasion } = Route.useSearch();
  return (
    <>
      <PageHero
        eyebrow={occasion ? `Ideas for ${occasion}` : "The creation edit"}
        title="Made To Delight. Crafted To Remember."
        text="Explore a selection of SnapCraft creations, then enquire to shape your choice around someone special."
        image={bouquetsImage}
      />
      <section className="section">
        <SectionTitle
          eyebrow="Discover"
          title="Our Signature Creations"
          text="Each piece is made to order. Exact pricing depends on your chosen details and requirements."
        />
        <CreationGrid />
      </section>
      <CTASection />
    </>
  );
}
