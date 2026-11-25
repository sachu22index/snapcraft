import { createFileRoute } from "@tanstack/react-router";
import weddingImage from "@/assets/snapcraft-wedding.jpg";
import { ArrowRight } from "lucide-react";
import { CTASection, PageHero, WhatsAppLink } from "@/components/Site";
import { occasions } from "@/data/occasions";
export const Route = createFileRoute("/occasions")({
  head: () => ({
    meta: [
      { title: "Occasions — Gifts For Every Moment | SnapCraft" },
      {
        name: "description",
        content:
          "Personalized gifts and decorations for birthdays, engagements, weddings, pregnancy, Holy Communion, baptism and anniversaries.",
      },
      { property: "og:title", content: "SnapCraft Gifts For Every Occasion" },
      {
        property: "og:description",
        content: "Thoughtful creations for the moments and milestones that matter.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Occasions,
});
function Occasions() {
  return (
    <>
      <PageHero
        eyebrow="Celebrate your way"
        title="Every Occasion Deserves A Personal Touch"
        text="Choose the moment, share your ideas, and let SnapCraft help create something beautiful for it."
        image={weddingImage}
      />
      <section className="section occasion-stories">
        {occasions.map((item, i) => (
          <article className={i % 2 ? "reverse" : ""} key={item.title}>
            <div className="occasion-stories__image">
              <img
                src={item.image}
                alt={`${item.title} gifts by SnapCraft`}
                width={1600}
                height={1200}
                loading="lazy"
                style={{ objectPosition: `${30 + (i % 4) * 18}% center` }}
              />
              <span>0{i + 1}</span>
            </div>
            <div>
              <p className="eyebrow">For {item.short}</p>
              <h2>{item.title}</h2>
              <p>{item.description}</p>
              <WhatsAppLink
                className="text-link"
                message={`Hello SnapCraft, I would like to plan something for ${item.title}.`}
              >
                Plan for {item.short} <ArrowRight size={16} />
              </WhatsAppLink>
            </div>
          </article>
        ))}
      </section>
      <CTASection />
    </>
  );
}
