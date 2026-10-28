import { createFileRoute } from "@tanstack/react-router";
import { Gem, Heart, Palette, Sparkles } from "lucide-react";
import hamperImage from "@/assets/hamper.jpeg";
import framesImage from "@/assets/snapcraft-frames.jpg";
import { CTASection, PageHero, SectionTitle } from "@/components/Site";
export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About SnapCraft — Thoughtful Gifts & Decorations" },
      {
        name: "description",
        content:
          "Discover SnapCraft’s thoughtful approach to personalized gifts and beautiful celebration decorations.",
      },
      { property: "og:title", content: "About SnapCraft" },
      {
        property: "og:description",
        content: "Thoughtful gifts and beautiful decorations for more memorable occasions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});
function About() {
  return (
    <>
      <PageHero
        eyebrow="Our heart"
        title="About SnapCraft"
        text="SnapCraft creates thoughtful gifts and beautiful decorations designed to make special occasions even more memorable."
        image={hamperImage}
      />
      <section className="section story-grid">
        <div>
          <SectionTitle
            eyebrow="Our story"
            title="Created For The Moments Words Cannot Quite Hold"
          />
          <p>
            SnapCraft is built around a simple idea: a personal gift can turn a special moment into
            a lasting memory. We create for birthdays, engagements, weddings, pregnancy
            celebrations, communions, baptisms, anniversaries and the meaningful days in between.
          </p>
        </div>
        <img
          src={framesImage}
          alt="Handcrafted photo keepsakes"
          width={1600}
          height={1200}
          loading="lazy"
        />
      </section>
      <section className="section section--blush">
        <div className="about-columns">
          {[
            [
              "Our Creativity",
              "We bring flowers, chocolates, photographs and thoughtful details together in fresh, celebration-ready ways.",
            ],
            [
              "Our Craft",
              "Every creation is carefully composed, finished and presented for the person receiving it.",
            ],
            [
              "Our Promise",
              "We listen to your requirements and help shape a gift or decoration that feels personal to the occasion.",
            ],
          ].map(([h, p], i) => (
            <article key={h}>
              <span>0{i + 1}</span>
              <h2>{h}</h2>
              <p>{p}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="section">
        <SectionTitle
          eyebrow="What guides us"
          title="Beautifully Personal, From First Idea To Final Detail"
          align="center"
        />
        <div className="value-grid">
          {[
            { icon: Palette, text: "Creativity" },
            { icon: Sparkles, text: "Personalization" },
            { icon: Gem, text: "Quality" },
            { icon: Heart, text: "Care" },
          ].map(({ icon: Icon, text }) => (
            <div key={text}>
              <Icon />
              <h3>{text}</h3>
            </div>
          ))}
        </div>
      </section>
      <CTASection />
    </>
  );
}
