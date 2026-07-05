import { useEffect } from "react";
import { Link } from "wouter";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="text-base font-semibold text-foreground mb-2">{title}</h2>
      <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">{children}</div>
    </section>
  );
}

export default function Terms() {
  // Hash navigation doesn't reset scroll, and users arrive here from the footer
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pb-16 bg-background">
      <main className="px-6 max-w-2xl mx-auto w-full pt-10">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Terms of Use</h1>
        <p className="text-sm text-muted-foreground mt-1">Effective July 4, 2026</p>

        <p className="text-sm text-muted-foreground leading-relaxed mt-6">
          Welcome to buildmyroutine.app. By using this site, you agree to these terms. If you
          don't agree with them, please don't use the site. We've written them in plain English
          so you can actually read them.
        </p>

        <Section title="What buildmyroutine.app is">
          <p>
            buildmyroutine.app offers quiz-based tools — Glow (skincare), Vita (supplements),
            and Roam (travel routines) — that match your answers against a curated database of
            publicly available recommendations, primarily from board-certified dermatologists
            and other credentialed experts, and suggest products and routines. We link to where
            you can buy those products; we don't sell anything ourselves.
          </p>
        </Section>

        <Section title="Not medical advice">
          <p>
            Everything on this site is for general information and education only.{" "}
            <span className="text-foreground font-medium">
              It is not medical advice, diagnosis, or treatment, and it's not a substitute for
              advice from a doctor, dermatologist, or other qualified health professional.
            </span>
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              Our product suggestions reflect recommendations experts have made publicly — they
              are not personalized medical guidance for you.
            </li>
            <li>
              For persistent skin conditions, consult a board-certified dermatologist.
            </li>
            <li>
              Talk to your doctor before starting any supplement, especially if you're pregnant,
              nursing, taking medication, or managing a health condition. Supplements can
              interact with medications.
            </li>
            <li>
              Never delay or ignore professional medical advice because of something you read
              here.
            </li>
          </ul>
        </Section>

        <Section title="Your account">
          <p>
            You can use the site without an account. If you sign in with Google, you're
            responsible for activity under your account. We may suspend or delete accounts that
            abuse the service. You can stop using the site at any time, and you can ask us to
            delete your account data — see our{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </Section>

        <Section title="How we make money: affiliate links">
          <p>
            Some links on this site are affiliate links. If you buy through them, we may earn a
            commission at no extra cost to you. Specifically:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              As an Amazon Associate we earn from qualifying purchases made through our Amazon
              links.
            </li>
            <li>
              Supplement links on Vita may go to our Fullscript practitioner page (including
              Pure Encapsulations products), where we may receive a commission.
            </li>
          </ul>
          <p>
            Commissions don't change which products appear in our database — those come from the
            public expert recommendations we catalog.
          </p>
        </Section>

        <Section title="Third-party sites and products">
          <p>
            When you click through to Amazon, Fullscript, YouTube, or any other third-party
            site, their terms and policies apply. We don't control those sites and aren't
            responsible for their content, pricing, availability, shipping, or the products
            themselves. Prices and availability shown or linked can change at any time.
          </p>
        </Section>

        <Section title="Using the site fairly">
          <p>You agree not to:</p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Break the law or infringe anyone's rights while using the site.</li>
            <li>Scrape, copy, or republish our product database or content at scale.</li>
            <li>Interfere with the site's operation or try to access other users' data.</li>
            <li>Misrepresent the site's suggestions as professional medical advice.</li>
          </ul>
        </Section>

        <Section title="Our content">
          <p>
            The site's design, text, and the way we've organized our routines and product
            database belong to us. Product names, brands, and expert content belong to their
            respective owners — we link to original sources so you can verify recommendations
            yourself. You're welcome to share your results using the built-in share links.
          </p>
        </Section>

        <Section title="No warranties">
          <p>
            The site is provided "as is" and "as available." We work hard to keep information
            accurate and links working, but we can't guarantee the site will always be
            error-free, uninterrupted, or that any product will work for you. Skincare and
            supplements affect everyone differently — patch-test new products and discontinue
            anything that causes irritation.
          </p>
        </Section>

        <Section title="Limitation of liability">
          <p>
            To the fullest extent permitted by law, buildmyroutine.app and its operators are not
            liable for indirect, incidental, or consequential damages arising from your use of
            the site or products purchased through links on it — including any reaction to or
            outcome from a product. Some jurisdictions don't allow certain limitations, so parts
            of this section may not apply to you.
          </p>
        </Section>

        <Section title="Changes">
          <p>
            We may update the site and these terms as the product evolves. If we make meaningful
            changes to these terms, we'll update the effective date at the top of this page.
            Continuing to use the site after a change means you accept the updated terms.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions about these terms? Email us at{" "}
            <a href="mailto:hello@buildmyroutine.app" className="text-primary hover:underline">
              hello@buildmyroutine.app
            </a>
            .
          </p>
        </Section>
      </main>
    </div>
  );
}
