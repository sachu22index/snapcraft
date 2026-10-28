import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import bouquetsImage from "@/assets/snapcraft-bouquets.jpg";
import { CTASection, PageHero, SectionTitle, WhatsAppLink } from "@/components/Site";
import { serviceGroups } from "@/data/services";
export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — SnapCraft Custom Gifts & Decorations" },
      {
        name: "description",
        content:
          "Explore SnapCraft hampers, bouquets, photo creations, wedding decorations, candles, cakes and custom gifts.",
      },
      { property: "og:title", content: "SnapCraft Services" },
      {
        property: "og:description",
        content: "Custom gifting and decoration services for every special occasion.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Services,
});
function Services() {
  return (
    <>
      <PageHero
        eyebrow="What we create"
        title="Made For Gifting. Designed For Remembering."
        text="Explore personalized gifts and celebration details, then tell us how you would like to make them your own."
        image={bouquetsImage}
      />
      <section className="section">
        <SectionTitle
          eyebrow="Our services"
          title="One Studio, Many Ways To Celebrate"
          align="center"
        />
        <div className="service-groups">
          {serviceGroups.map((group, i) => (
            <article
              className={`service-group ${i % 2 ? "service-group--reverse" : ""}`}
              key={group.category}
            >
              <img
                src={group.image}
                alt={group.category}
                width={1600}
                height={1200}
                loading="lazy"
              />
              <div>
                <span className="service-group__number">0{i + 1}</span>
                <h2>{group.category}</h2>
                <p>{group.intro}</p>
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>
                      {item}
                      <WhatsAppLink
                        className="icon-link"
                        message={`Hello SnapCraft, I would like to enquire about ${item}.`}
                      >
                        <ArrowRight />
                        <span className="sr-only">Enquire</span>
                      </WhatsAppLink>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>
      <CTASection />
    </>
  );
}
