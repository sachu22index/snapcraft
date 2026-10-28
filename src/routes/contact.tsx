import { createFileRoute } from "@tanstack/react-router";
import { Instagram, MessageCircle, Phone } from "lucide-react";
import bouquetsImage from "@/assets/snapcraft-bouquets.jpg";
import { ContactForm, INSTAGRAM, PageHero, PHONE, WhatsAppLink } from "@/components/Site";
export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact SnapCraft — Start Your Custom Order" },
      {
        name: "description",
        content:
          "Call or WhatsApp SnapCraft on 7510925645 to discuss custom gifts, hampers, flowers and decorations.",
      },
      { property: "og:title", content: "Let’s Create Something Special — SnapCraft" },
      {
        property: "og:description",
        content: "Start your personalized gift or decoration enquiry with SnapCraft.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Contact,
});
function Contact() {
  return (
    <>
      <PageHero
        eyebrow="Start your enquiry"
        title="Let’s Create Something Special"
        text="Tell us about the person, occasion and idea you have in mind. We’ll continue the conversation with you personally."
        image={bouquetsImage}
      />
      <section className="section contact-layout">
        <aside>
          <p className="eyebrow">Contact SnapCraft</p>
          <h2>Your Idea Starts Here</h2>
          <p>
            Pre-book your gifts and discuss your custom requirements through phone, WhatsApp or
            Instagram.
          </p>
          <div className="contact-methods">
            <div>
              <Phone />
              <span>
                <small>Call / WhatsApp</small>
                <strong>{PHONE}</strong>
              </span>
            </div>
            <div className="contact-actions">
              <a className="button button--secondary" href={`tel:+91${PHONE}`}>
                Call Now
              </a>
              <WhatsAppLink>
                <MessageCircle size={17} /> WhatsApp
              </WhatsAppLink>
            </div>
            <div>
              <Instagram />
              <span>
                <small>Instagram</small>
                <strong>@snap__craft__</strong>
              </span>
            </div>
            <a
              className="button button--secondary"
              href={INSTAGRAM}
              target="_blank"
              rel="noreferrer"
            >
              Follow Us
            </a>
          </div>
          <div className="delivery-note">
            <strong>Delivery Available</strong>
            <span>Pre-book your gifts with SnapCraft.</span>
          </div>
        </aside>
        <div className="form-panel">
          <p className="eyebrow">Enquiry form</p>
          <h2>Tell Us What You’re Planning</h2>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
