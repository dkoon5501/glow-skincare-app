import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ClipboardList,
  Sparkles,
  ShoppingBag,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

interface LandingProps {
  onStart: () => void;
}

// Refined Glow logo — three concentric circles suggesting radiance
function GlowLogo({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-label="Glow logo"
      role="img"
    >
      {/* Outer ring — faintest */}
      <circle
        cx="16"
        cy="16"
        r="14.5"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.25"
      />
      {/* Middle ring */}
      <circle
        cx="16"
        cy="16"
        r="9.5"
        stroke="currentColor"
        strokeWidth="1.25"
        opacity="0.55"
      />
      {/* Inner filled circle — the "glow core" */}
      <circle cx="16" cy="16" r="4" fill="currentColor" />
    </svg>
  );
}

const HOW_IT_WORKS = [
  {
    icon: ClipboardList,
    step: "01",
    title: "Take the Quiz",
    description:
      "Answer 8 quick questions about your skin type, concerns, and lifestyle.",
  },
  {
    icon: Sparkles,
    step: "02",
    title: "Get Your Routine",
    description:
      "Our algorithm matches you with products from a curated database of dermatologist-recommended picks.",
  },
  {
    icon: ShoppingBag,
    step: "03",
    title: "Shop With Confidence",
    description:
      "Every product links to its source video and where to buy. No guesswork.",
  },
];

const DERMATOLOGISTS = [
  { name: "Dr. Muneeb Shah / Doctorly", stat: "3.5M YouTube", url: "https://www.youtube.com/@Doctorly", platform: "YouTube" },
  { name: "Dr. Dray", stat: "2.6M YouTube", url: "https://www.youtube.com/@DrDrayzday", platform: "YouTube" },
  { name: "Dr. Sam Ellis", stat: "807K YouTube", url: "https://www.youtube.com/@drsamellis", platform: "YouTube" },
  { name: "Dr. Karen Locke", stat: "712K YouTube", url: "https://www.youtube.com/@TheBudgetDermatologist", platform: "YouTube" },
  { name: "Dr. Daniel Sugai", stat: "708K YouTube", url: "https://www.youtube.com/@DrDanielSugai", platform: "YouTube" },
  { name: "Dr. Alexis Stephens", stat: "578K YouTube", url: "https://www.youtube.com/@dralexisstephens", platform: "YouTube" },
  { name: "Dr. Azadeh Shirazi", stat: "283K Instagram", url: "https://www.instagram.com/skinbydrazi/", platform: "Instagram" },
  { name: "Dr. Whitney Bowe", stat: "200K Instagram", url: "https://www.instagram.com/drwhitneybowe/", platform: "Instagram" },
  { name: "Dr. Jenny Liu", stat: "YouTube & Instagram", url: "https://www.youtube.com/@derm.talk", platform: "YouTube" },
  { name: "Dr. Joyce Park", stat: "499K Instagram", url: "https://www.instagram.com/teawithmd/", platform: "Instagram" },
  { name: "Dr. Neera Nathan", stat: "1M Instagram", url: "https://www.instagram.com/drneera/", platform: "Instagram" },
  { name: "Dr. Dustin Portela", stat: "YouTube & Instagram", url: "https://www.instagram.com/drdustinportela/", platform: "Instagram" },
  { name: "Dr. Lindsey Zubritsky", stat: "2M Instagram", url: "https://www.instagram.com/dermguru/", platform: "Instagram" },
];

const STATS = [
  { value: "Dozens of", label: "Curated Products" },
  { value: "Board-Certified", label: "Dermatologist Sources" },
  { value: "Every", label: "Category Covered" },
  { value: "Linked", label: "Video Sources" },
];

const DIFFERENTIATORS = [
  {
    title: "Evidence-Based Sources",
    description:
      "We don't guess. Every product links to the dermatologist who recommended it.",
  },
  {
    title: "Personalized, Not Generic",
    description:
      "Your Baumann Skin Type code drives recommendations tailored to your exact profile.",
  },
  {
    title: "Essential vs Recommended",
    description:
      "We tell you what you actually need vs what's optional. No unnecessary 12-step routines.",
  },
  {
    title: "Free & Transparent",
    description:
      "No paywalls, no data collection. Just honest skincare guidance.",
  },
];

const FAQS = [
  {
    q: "Is Glow really free?",
    a: "Yes, completely. We earn a small commission if you purchase through our Amazon links, but the quiz and recommendations are always free.",
  },
  {
    q: "How are products selected?",
    a: "Every product in our database has been specifically recommended by at least one board-certified dermatologist on their YouTube channel or Instagram. We source from leading dermatologists with millions of combined followers.",
  },
  {
    q: "Why should I trust these recommendations?",
    a: "Our sources are board-certified dermatologists — medical doctors who specialize in skin. Each product links directly to the video where they recommended it so you can verify yourself.",
  },
  {
    q: "What is a Baumann Skin Type?",
    a: "The Baumann Skin Type System is a validated classification system used by dermatologists worldwide. It categorizes skin across 4 dimensions — oily/dry, sensitive/resistant, pigmented/non-pigmented, and wrinkle-prone/tight — resulting in 16 possible skin types.",
  },
  {
    q: "Do I need to create an account?",
    a: "No. You can take the quiz and get your full routine without signing in. Creating a free account (Google sign-in) lets you save your routine and track products you've tried.",
  },
];

export function Landing({ onStart }: LandingProps) {
  return (
    <div className="flex flex-col min-h-screen">

      {/* ─── 1. HERO ─────────────────────────────────────────────────── */}
      <section
        className="flex flex-col items-center justify-center text-center px-6 pt-20 pb-24 md:pt-28 md:pb-32"
        aria-labelledby="hero-headline"
      >
        {/* Badge */}
        <div className="mb-6">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/8 border border-primary/15 px-3.5 py-1.5 rounded-full">
            <CheckCircle2 className="w-3 h-3" />
            Science-Backed Skincare
          </span>
        </div>

        <h1
          id="hero-headline"
          className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight max-w-2xl mb-5"
          data-testid="text-hero-title"
        >
          Your Science-Backed
          <br className="hidden sm:block" /> Skincare Routine
        </h1>

        <p className="text-base md:text-lg text-muted-foreground max-w-xl mb-10 leading-relaxed">
          Answer 8 evidence-based questions. Get a personalized AM &amp; PM
          routine with specific products recommended by top dermatologists.
        </p>

        <Button
          size="lg"
          onClick={onStart}
          className="gap-2 px-8 h-12 rounded-full text-sm font-semibold shadow-sm"
          data-testid="button-start-quiz-hero"
        >
          Take the Free Skin Quiz
          <ArrowRight className="w-4 h-4" />
        </Button>

        <p className="mt-4 text-xs text-muted-foreground">
          2 minutes&nbsp;•&nbsp;No account required&nbsp;•&nbsp;100% free
        </p>
      </section>

      {/* ─── 2. HOW IT WORKS ─────────────────────────────────────────── */}
      <section
        className="bg-accent/30 border-y border-border/60 px-6 py-16 md:py-20"
        aria-labelledby="how-it-works-heading"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2
              id="how-it-works-heading"
              className="text-xl font-bold text-foreground tracking-tight"
            >
              How It Works
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              From quiz to routine in under 2 minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map(({ icon: Icon, step, title, description }) => (
              <div
                key={step}
                className="flex flex-col items-center text-center md:items-start md:text-left"
                data-testid={`card-how-it-works-${step}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground tracking-widest">
                    STEP {step}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">
                  {title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 3. TRUST SIGNALS / SOCIAL PROOF ────────────────────────── */}
      <section
        className="px-6 py-16 md:py-20"
        aria-labelledby="trust-heading"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2
              id="trust-heading"
              className="text-xl font-bold text-foreground tracking-tight mb-3"
            >
              Backed by dermatologist expertise
            </h2>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
              Every product recommendation links directly to the YouTube video
              or Instagram post where a board-certified dermatologist endorsed it.
            </p>
          </div>

          {/* Derm list — scrollable container showing ~4 at a time */}
          <div className="relative mb-12">
            <div className="max-h-[280px] overflow-y-auto rounded-xl border border-card-border bg-card scrollbar-thin">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 divide-y sm:divide-y-0">
                {DERMATOLOGISTS.map(({ name, stat, url, platform }) => (
                  <a
                    key={name}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 hover:bg-accent/50 transition-colors"
                    data-testid={`card-derm-${name.replace(/\s+/g, "-").toLowerCase()}`}
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-primary text-xs font-bold">
                        {name.charAt(4).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{name}</p>
                      <p className="text-xs text-muted-foreground">{stat}</p>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  </a>
                ))}
              </div>
            </div>
            {/* Fade hint at bottom to indicate scrollability */}
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-card to-transparent rounded-b-xl pointer-events-none" />
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map(({ value, label }) => (
              <div
                key={label}
                className="flex flex-col items-center text-center p-5 rounded-xl bg-primary/5 border border-primary/10"
                data-testid={`stat-${label.replace(/\s+/g, "-").toLowerCase()}`}
              >
                <span className="text-2xl font-bold text-primary">{value}</span>
                <span className="text-xs text-muted-foreground mt-1">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 4. WHAT MAKES GLOW DIFFERENT ────────────────────────────── */}
      <section
        className="bg-accent/30 border-y border-border/60 px-6 py-16 md:py-20"
        aria-labelledby="differentiators-heading"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2
              id="differentiators-heading"
              className="text-xl font-bold text-foreground tracking-tight"
            >
              What Makes Glow Different
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {DIFFERENTIATORS.map(({ title, description }, i) => (
              <div
                key={title}
                className="p-6 rounded-xl bg-card border border-card-border"
                data-testid={`card-differentiator-${i + 1}`}
              >
                <h3 className="text-sm font-semibold text-foreground mb-2">
                  {title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 5. FAQ ───────────────────────────────────────────────────── */}
      <section
        className="px-6 py-16 md:py-20"
        aria-labelledby="faq-heading"
      >
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2
              id="faq-heading"
              className="text-xl font-bold text-foreground tracking-tight"
            >
              Frequently Asked Questions
            </h2>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {FAQS.map(({ q, a }, i) => (
              <AccordionItem
                key={q}
                value={`faq-${i}`}
                data-testid={`faq-item-${i + 1}`}
              >
                <AccordionTrigger
                  className="text-sm font-medium text-left hover:no-underline hover:text-primary transition-colors py-4"
                  data-testid={`faq-trigger-${i + 1}`}
                >
                  {q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5">
                  {a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ─── 6. FINAL CTA ────────────────────────────────────────────── */}
      <section className="px-6 py-16 md:py-20 bg-primary/5 border-t border-primary/10">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="text-xl font-bold text-foreground tracking-tight mb-4">
            Ready to find your perfect routine?
          </h2>
          <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
            Join thousands of people who've discovered their science-backed
            skincare routine — in under 2 minutes, completely free.
          </p>
          <Button
            size="lg"
            onClick={onStart}
            className="gap-2 px-8 h-12 rounded-full text-sm font-semibold shadow-sm"
            data-testid="button-start-quiz-final"
          >
            Take the Skin Quiz
            <ArrowRight className="w-4 h-4" />
          </Button>
          <p className="mt-4 text-xs text-muted-foreground">
            2 minutes&nbsp;•&nbsp;No account required&nbsp;•&nbsp;100% free
          </p>
        </div>
      </section>

      {/* ─── 7. FOOTER ───────────────────────────────────────────────── */}
      <footer className="border-t border-border/60 bg-background px-6 py-10" aria-label="Site footer">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-8">
            {/* Logo + tagline */}
            <div className="flex flex-col items-center sm:items-start gap-2">
              <div className="flex items-center gap-2 text-primary">
                <GlowLogo size={24} />
                <span className="text-sm font-semibold tracking-tight text-foreground">
                  Glow
                </span>
              </div>
              <p className="text-xs text-muted-foreground max-w-xs text-center sm:text-left">
                Science-backed skincare, personalized to you.
              </p>
            </div>

            {/* Nav links */}
            <nav aria-label="Footer navigation">
              <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
                <li>
                  <button
                    onClick={() =>
                      document
                        .getElementById("hero-headline")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    data-testid="footer-link-home"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    onClick={onStart}
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    data-testid="footer-link-quiz"
                  >
                    Take the Quiz
                  </button>
                </li>
                <li>
                  <a
                    href="/#/my-routines"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    data-testid="footer-link-my-routines"
                  >
                    My Routines
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          {/* Legal */}
          <div className="mt-8 pt-6 border-t border-border/40 space-y-2">
            <p className="text-xs text-muted-foreground">
              <strong className="font-medium">Not medical advice.</strong> Glow
              provides educational skincare information only. Always consult a
              board-certified dermatologist for specific skin conditions or
              medical concerns.
            </p>
            <p className="text-xs text-muted-foreground">
              <strong className="font-medium">Amazon affiliate disclosure.</strong>{" "}
              Glow participates in the Amazon Services LLC Associates Program. We
              may earn a small commission on qualifying purchases at no extra cost
              to you. This does not influence our recommendations.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
