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

export default function Privacy() {
  // Hash navigation doesn't reset scroll, and users arrive here from the footer
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen pb-16 bg-background">
      <main className="px-6 max-w-2xl mx-auto w-full pt-10">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mt-1">Effective July 4, 2026</p>

        <p className="text-sm text-muted-foreground leading-relaxed mt-6">
          buildmyroutine.app helps you build skincare, supplement, and travel routines. This
          policy explains what information we handle, where it lives, and the choices you have.
          We've kept it short and in plain English on purpose.
        </p>

        <Section title="The short version">
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Your quiz answers are processed in your browser — we never send them to a server.</li>
            <li>An account is optional. If you sign in with Google, we store your saved routines and product feedback so you can come back to them.</li>
            <li>We use Google Analytics to understand how the site is used.</li>
            <li>We earn commissions from some product links (Amazon, Fullscript). Those never cost you anything extra.</li>
            <li>We do not sell your personal data. Ever.</li>
          </ul>
        </Section>

        <Section title="Your quiz answers stay in your browser">
          <p>
            When you take a quiz on Glow, Vita, or Roam, your answers are processed entirely on
            your device. The matching and recommendations happen in your browser — your answers
            are not uploaded to our servers or stored by us.
          </p>
          <p>
            If you use the share feature, your quiz answers are encoded directly into the share
            link itself. Anyone you send that link to can see the routine it describes, so only
            share links with people you're comfortable seeing your results.
          </p>
        </Section>

        <Section title="Your account (optional)">
          <p>
            You can use buildmyroutine.app without an account. If you choose to sign in, we use
            Google sign-in through Firebase Authentication (a Google service). When you sign in,
            Google shares your name, email address, and profile photo with us. We use these only
            to identify your account and show you your own saved data — we don't use them for
            marketing.
          </p>
        </Section>

        <Section title="What we store when you save things">
          <p>
            If you're signed in, the following is stored in Google Cloud Firestore (Google's
            database service), tied to your account:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Routines you save (skincare, supplement, and travel routines).</li>
            <li>Product feedback — for example, products you remove from a routine and the reason you give.</li>
            <li>Products you upvote.</li>
          </ul>
          <p>
            You can delete saved routines and feedback yourself at any time from the My Routines
            page.
          </p>
        </Section>

        <Section title="Analytics">
          <p>
            We use Google Analytics 4 to understand how people use the site — things like which
            pages are visited, roughly where visitors are located, and what devices they use.
            Google Analytics uses cookies to do this. We use this information only to improve
            the product. You can block analytics with browser settings, extensions like a
            content blocker, or Google's own{" "}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              opt-out tool
            </a>
            .
          </p>
        </Section>

        <Section title="What's stored on your device">
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <span className="text-foreground font-medium">Language preference</span> — if you
              pick a language, we remember it in your browser's local storage.
            </li>
            <li>
              <span className="text-foreground font-medium">Translation cookie</span> — the
              language feature uses Google's website translator, which relies on a cookie
              (googtrans) to know which language to show.
            </li>
          </ul>
          <p>Clearing your browser data removes both.</p>
        </Section>

        <Section title="Affiliate links">
          <p>
            Some product links on this site are affiliate links, which means we may earn a
            commission if you buy something — at no extra cost to you:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <span className="text-foreground font-medium">Amazon</span> — as an Amazon
              Associate we earn from qualifying purchases. When you click an Amazon link, Amazon
              may set its own cookies; Amazon's privacy policy governs what happens on their
              site.
            </li>
            <li>
              <span className="text-foreground font-medium">Fullscript</span> — supplement links
              on Vita may go to our Fullscript practitioner page (for example, for Pure
              Encapsulations products). Fullscript's own privacy policy applies there.
            </li>
          </ul>
        </Section>

        <Section title="We don't sell your data">
          <p>
            We do not sell, rent, or trade your personal information. The only third parties
            that handle your data are the service providers described above (Google's Firebase,
            Firestore, Analytics, and translation services), and the third-party stores you
            choose to visit through product links.
          </p>
        </Section>

        <Section title="Your choices">
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Use the site without signing in — the quizzes work fully without an account.</li>
            <li>Delete individual saved routines and feedback from the My Routines page.</li>
            <li>
              Email us at{" "}
              <a href="mailto:hello@buildmyroutine.app" className="text-primary hover:underline">
                hello@buildmyroutine.app
              </a>{" "}
              to have your account data deleted entirely.
            </li>
            <li>Block analytics cookies with your browser or an opt-out tool.</li>
          </ul>
        </Section>

        <Section title="Security and retention">
          <p>
            Your saved data is stored with Google Cloud, which provides industry-standard
            security. We keep saved routines and feedback until you delete them or ask us to
            delete your account. No system is perfectly secure, so please don't put sensitive
            information in free-text fields like feedback reasons.
          </p>
        </Section>

        <Section title="Children">
          <p>
            buildmyroutine.app is not directed to children under 13, and we don't knowingly
            collect personal information from them. If you believe a child has created an
            account, contact us and we'll delete it.
          </p>
        </Section>

        <Section title="Changes to this policy">
          <p>
            If we make meaningful changes to this policy, we'll update the effective date at the
            top of this page. Continued use of the site after a change means you accept the
            updated policy.
          </p>
        </Section>

        <Section title="Contact">
          <p>
            Questions about privacy? Email us at{" "}
            <a href="mailto:hello@buildmyroutine.app" className="text-primary hover:underline">
              hello@buildmyroutine.app
            </a>
            . You can also read our{" "}
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Use
            </Link>
            .
          </p>
        </Section>
      </main>
    </div>
  );
}
