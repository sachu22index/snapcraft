import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MessageCircle } from "lucide-react";
import hamperImage from "@/assets/snapcraft-hamper.jpg";
import { FAQList, PageHero, WhatsAppLink } from "@/components/Site";
export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Frequently Asked Questions — SnapCraft" },
      {
        name: "description",
        content:
          "Answers about ordering, customization, delivery, pre-booking and SnapCraft wedding and ceremony creations.",
      },
      { property: "og:title", content: "SnapCraft FAQs" },
      {
        property: "og:description",
        content: "Helpful answers about ordering your custom SnapCraft creation.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FAQ,
});
function FAQ() {
  return (
    <>
      <PageHero
        eyebrow="Good to know"
        title="Questions, Answered"
        text="Everything you need to know before planning a personalized gift or celebration detail with SnapCraft."
        image={hamperImage}
      />
      <section className="section faq-layout">
        <div>
          <p className="eyebrow">Need help?</p>
          <h2>Let’s Make Your Idea Feel Easy</h2>
          <p>
            Every request is personal. If your question is not covered here, talk to us directly and
            share what you have in mind.
          </p>
          <div className="button-stack">
            <WhatsAppLink message="Hello SnapCraft, I have a question about a custom creation.">
              <MessageCircle size={17} /> Ask on WhatsApp
            </WhatsAppLink>
            <Link to="/contact" className="text-link">
              Visit contact page <ArrowRight size={16} />
            </Link>
          </div>
        </div>
        <FAQList />
      </section>
    </>
  );
}
