import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Pill, Star, CheckCircle, Compass } from "lucide-react";

// ── Hero slides ──
const heroSlides = [
  {
    id: "roam",
    label: "Travel",
    headline: "Travel picks\ncurated by\ncreators who've been.",
    sub: "24 creator-vetted destinations from Kara & Nate — matched to your vibe, region, and travel style.",
    cta: "Find My Travel Pick",
    href: "#/roam",
    badge: "Roam",
    badgeIcon: "compass",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1400&q=85&fit=crop",
    accent: "from-amber-950/80 via-amber-900/60 to-transparent",
    pill: "Creator-vetted",
  },
  {
    id: "glow",
    label: "Skincare",
    headline: "Your skin\ndeserves a routine\nthat actually works.",
    sub: "Dermatologist-guided skincare — built around your skin type, concerns, and lifestyle.",
    cta: "Build My Skincare Routine",
    href: "#/glow",
    badge: "Glow",
    badgeIcon: "sparkles",
    // Unsplash: woman with glowing skin, natural light
    image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=1400&q=85&fit=crop",
    accent: "from-rose-950/80 via-rose-900/60 to-transparent",
    pill: "Dermatologist-guided",
  },
  {
    id: "vita",
    label: "Supplements",
    headline: "Vitamins chosen\nfor your body,\nnot the shelf.",
    sub: "Expert-guided supplement routines tailored to your health goals and lifestyle.",
    cta: "Build My Vitamin Routine",
    href: "#/vita",
    badge: "Vita",
    badgeIcon: "pill",
    // Unsplash: person holding supplements, healthy lifestyle
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1400&q=85&fit=crop",
    accent: "from-teal-950/80 via-teal-900/60 to-transparent",
    pill: "Expert-guided",
  },
];

// ── Trust bar items ──
const trustItems = [
  "Free, no account required",
  "Evidence-based recommendations",
  "250+ dermatologist-picked products",
  "Provider discount pricing",
];

// ── Feature rows ──
const roamFeatures = [
  {
    title: "4 questions, 1 perfect pick",
    desc: "Choose your vibe, region, trip length, and travel style. We surface the Kara & Nate episode that fits your exact situation.",
    img: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80&fit=crop",
  },
  {
    title: "24 creator-vetted destinations",
    desc: "Every pick has been personally visited and filmed by Kara & Nate — not algorithmically suggested or sponsored.",
    img: "https://images.unsplash.com/photo-1500835556837-99ac94a94552?w=800&q=80&fit=crop",
  },
  {
    title: "Deep-link to the episode",
    desc: "Each result links straight to the Kara & Nate YouTube episode — watch the full trip before you book.",
    img: "https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?w=800&q=80&fit=crop",
  },
];

const glowFeatures = [
  {
    title: "Built around your skin",
    desc: "8-question quiz matches you with products for your exact skin type, tone, and concerns — not generic categories.",
    img: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80&fit=crop",
  },
  {
    title: "AM & PM routines",
    desc: "Morning and evening product lineups that layer correctly — no guesswork about what goes where.",
    img: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&q=80&fit=crop",
  },
  {
    title: "Rate your current routine",
    desc: "Paste your existing products and get an ingredient-level analysis powered by 250+ ingredient data.",
    img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80&fit=crop",
  },
];

const vitaFeatures = [
  {
    title: "Matched to your health profile",
    desc: "7 questions about your diet, lifestyle, and goals. We recommend supplements that fill your actual gaps.",
    img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80&fit=crop",
  },
  {
    title: "Timed for absorption",
    desc: "Morning, with food, evening — each supplement scheduled when your body best absorbs it.",
    img: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&q=80&fit=crop",
  },
  {
    title: "Provider discount pricing",
    desc: "Access practitioner pricing through Fullscript and Pure Encapsulations — not available on Amazon.",
    img: "https://501rx.com/wp-content/uploads/2024/08/Pure-Encapsulations-1200x863.png",
  },
];

// ── Social proof ──
const testimonials = [
  {
    quote: "Finally a skincare routine I actually stick to. Everything is explained and the products don't conflict.",
    name: "Maya R.",
    tag: "Glow user",
    img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80&fit=crop&face",
  },
  {
    quote: "I've tried so many vitamin routines. This is the first one that felt personalized to me, not just a generic stack.",
    name: "Jordan T.",
    tag: "Vita user",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80&fit=crop&face",
  },
  {
    quote: "The provider discount alone saved me more than I expected. Clean, fast, no upsell.",
    name: "Priya S.",
    tag: "Vita user",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80&fit=crop&face",
  },
];

// ── Hero Slide Component ──
function HeroSlide({
  slide,
  active,
}: {
  slide: (typeof heroSlides)[0];
  active: boolean;
}) {
  return (
    <div
      className={`absolute inset-0 transition-opacity duration-1000 ${active ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      {/* Background image */}
      <img
        src={slide.image}
        alt={slide.label}
        className="absolute inset-0 w-full h-full object-cover object-center"
        draggable={false}
      />
      {/* Gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-r ${slide.accent} to-black/40`} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-end pb-16 px-6 max-w-3xl mx-auto">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/80 bg-white/10 border border-white/20 px-3 py-1 rounded-full mb-5 w-fit backdrop-blur-sm">
          {slide.badgeIcon === "sparkles" ? (
            <Sparkles className="w-3 h-3" />
          ) : slide.badgeIcon === "compass" ? (
            <Compass className="w-3 h-3" />
          ) : (
            <Pill className="w-3 h-3" />
          )}
          {slide.pill}
        </span>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.05] tracking-tight mb-5 whitespace-pre-line">
          {slide.headline}
        </h1>

        <p className="text-base sm:text-lg text-white/80 max-w-md mb-8 leading-relaxed">
          {slide.sub}
        </p>

        <a href={slide.href}>
          <Button
            size="lg"
            className="gap-2 rounded-full px-8 h-12 text-sm font-semibold bg-white text-foreground hover:bg-white/90 shadow-lg"
          >
            {slide.cta}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </a>
      </div>
    </div>
  );
}

// ── Feature Card ──
function FeatureCard({ feature }: { feature: (typeof glowFeatures)[0] }) {
  return (
    <div className="group rounded-2xl overflow-hidden border border-border/50 bg-card hover:border-primary/30 transition-colors">
      <div className="h-44 overflow-hidden">
        <img
          src={feature.img}
          alt={feature.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-5">
        <h3 className="text-sm font-semibold text-foreground mb-1.5">{feature.title}</h3>
        <p className="text-xs text-muted-foreground leading-relaxed">{feature.desc}</p>
      </div>
    </div>
  );
}

// ── Testimonial Card ──
function TestimonialCard({ t }: { t: (typeof testimonials)[0] }) {
  return (
    <div className="rounded-2xl border border-border/50 bg-card p-5 flex flex-col gap-4">
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-3.5 h-3.5 fill-primary text-primary" />
        ))}
      </div>
      <p className="text-sm text-foreground leading-relaxed flex-1">"{t.quote}"</p>
      <div className="flex items-center gap-3">
        <img
          src={t.img}
          alt={t.name}
          className="w-9 h-9 rounded-full object-cover"
        />
        <div>
          <p className="text-xs font-semibold text-foreground">{t.name}</p>
          <p className="text-[10px] text-muted-foreground">{t.tag}</p>
        </div>
      </div>
    </div>
  );
}

// ── Main Landing ──
export default function MainLanding() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeTab, setActiveTab] = useState<"roam" | "glow" | "vita">("roam");

  // Auto-rotate hero every 5s
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = useCallback((i: number) => setActiveSlide(i), []);

  return (
    <div className="min-h-screen bg-background">

      {/* ── HERO ── */}
      <section className="relative w-full h-[88vh] min-h-[560px] max-h-[820px] overflow-hidden bg-black">
        {heroSlides.map((slide, i) => (
          <HeroSlide key={slide.id} slide={slide} active={i === activeSlide} />
        ))}

        {/* Slide indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeSlide ? "w-8 bg-white" : "w-2 bg-white/40"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Slide labels top-right */}
        <div className="absolute top-6 right-6 z-20 flex gap-2">
          {heroSlides.map((slide, i) => (
            <button
              key={slide.id}
              onClick={() => goToSlide(i)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                i === activeSlide
                  ? "bg-white text-foreground"
                  : "bg-white/10 text-white/70 hover:bg-white/20 border border-white/20"
              }`}
            >
              {slide.badge}
            </button>
          ))}
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <div className="border-b border-border/50 bg-muted/30">
        <div className="max-w-3xl mx-auto px-6 py-3 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {trustItems.map((item) => (
            <span key={item} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CheckCircle className="w-3.5 h-3.5 text-primary shrink-0" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ── FEATURES TABS ── */}
      <section className="max-w-3xl mx-auto px-6 py-16">
        {/* Tab switcher */}
        <div className="flex items-center justify-center mb-10">
          <div className="flex gap-1 bg-muted/50 rounded-full p-1 border border-border/50">
            <button
              onClick={() => setActiveTab("roam")}
              className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                activeTab === "roam"
                  ? "bg-background shadow-sm text-foreground border border-border/50"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              Roam
            </button>
            <button
              onClick={() => setActiveTab("glow")}
              className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                activeTab === "glow"
                  ? "bg-background shadow-sm text-foreground border border-border/50"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Glow
            </button>
            <button
              onClick={() => setActiveTab("vita")}
              className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                activeTab === "vita"
                  ? "bg-background shadow-sm text-foreground border border-border/50"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Pill className="w-3.5 h-3.5" />
              Vita
            </button>
          </div>
        </div>

        {/* Section heading */}
        <div className="text-center mb-10">
          {activeTab === "roam" ? (
            <>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
                Creator-vetted travel, matched to you.
              </h2>
              <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
                4 questions. We match you with the right Kara & Nate episode for your vibe, region, and travel style.
              </p>
            </>
          ) : activeTab === "glow" ? (
            <>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
                Skincare that fits your skin — not someone else's.
              </h2>
              <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
                Answer 8 quick questions. Get a dermatologist-guided AM & PM routine with products that actually work together.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
                Supplements matched to your body and goals.
              </h2>
              <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
                Answer 7 questions about your health and lifestyle. Get an expert-reviewed routine with timing built in.
              </p>
            </>
          )}
        </div>

        {/* Feature cards */}
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          {(activeTab === "roam" ? roamFeatures : activeTab === "glow" ? glowFeatures : vitaFeatures).map((f) => (
            <FeatureCard key={f.title} feature={f} />
          ))}
        </div>

        {/* CTA */}
        <div className="flex justify-center">
          <a href={activeTab === "roam" ? "#/roam" : activeTab === "glow" ? "#/glow" : "#/vita"}>
            <Button size="lg" className="gap-2 rounded-full px-8 h-12 text-sm font-semibold shadow-sm">
              {activeTab === "roam" ? "Find My Travel Pick" : activeTab === "glow" ? "Build My Skincare Routine" : "Build My Vitamin Routine"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </a>
        </div>
      </section>

      {/* ── SPLIT PROMO — Roam ── */}
      <section className="border-t border-border/50 overflow-hidden">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 items-stretch">
          <div className="flex flex-col justify-center px-8 py-12 bg-muted/20 order-2 md:order-1">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full mb-5 w-fit dark:bg-amber-950 dark:border-amber-800 dark:text-amber-400">
              <Compass className="w-3 h-3" />
              Roam — Travel Picks
            </span>
            <h2 className="text-2xl font-bold text-foreground mb-3 leading-tight">
              Skip the generic travel blog. Watch someone who's actually been.
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              24 destinations personally documented by Kara & Nate — matched to your vibe, region, trip length, and travel style in 4 questions.
            </p>
            <ul className="space-y-2 mb-8">
              {["4-question travel quiz", "Roam, Glow, and Vita — all in one place", "Deep-link to the full YouTube episode"].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                  <CheckCircle className="w-4 h-4 text-amber-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <a href="#/roam">
              <Button className="gap-2 rounded-full w-fit px-6">
                Try Roam <ArrowRight className="w-4 h-4" />
              </Button>
            </a>
          </div>
          <div className="h-72 md:h-auto overflow-hidden order-1 md:order-2">
            <img
              src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=900&q=85&fit=crop"
              alt="Travel"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── SPLIT PROMO — Glow ── */}
      <section className="border-t border-border/50 overflow-hidden">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 items-stretch">
          <div className="h-72 md:h-auto overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=900&q=85&fit=crop"
              alt="Skincare routine"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-center px-8 py-12 bg-card">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/8 border border-primary/15 px-3 py-1 rounded-full mb-5 w-fit">
              <Sparkles className="w-3 h-3" />
              Glow — Skincare
            </span>
            <h2 className="text-2xl font-bold text-foreground mb-3 leading-tight">
              Know exactly what you're putting on your skin.
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              250+ dermatologist-picked products. Every recommendation is dermVerified — no filler brands, no affiliate fluff.
            </p>
            <ul className="space-y-2 mb-8">
              {["8-question skin quiz", "AM & PM product lineup", "Rate My Routine ingredient scan"].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                  <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <a href="#/glow">
              <Button className="gap-2 rounded-full w-fit px-6">
                Try Glow <ArrowRight className="w-4 h-4" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ── SPLIT PROMO — Vita ── */}
      <section className="border-t border-border/50 overflow-hidden">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 items-stretch">
          <div className="flex flex-col justify-center px-8 py-12 bg-muted/20 order-2 md:order-1">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/8 border border-primary/15 px-3 py-1 rounded-full mb-5 w-fit">
              <Pill className="w-3 h-3" />
              Vita — Supplements
            </span>
            <h2 className="text-2xl font-bold text-foreground mb-3 leading-tight">
              Stop guessing which vitamins you actually need.
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Get a timing-optimized supplement schedule based on your diet, health goals, and lifestyle — plus access to provider pricing.
            </p>
            <ul className="space-y-2 mb-8">
              {["7-question health quiz", "Morning, food & evening timing", "Fullscript + Pure Encapsulations pricing"].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                  <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <a href="#/vita">
              <Button className="gap-2 rounded-full w-fit px-6">
                Try Vita <ArrowRight className="w-4 h-4" />
              </Button>
            </a>
          </div>
          <div className="h-72 md:h-auto overflow-hidden order-1 md:order-2">
            <img
              src="https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=900&q=85&fit=crop"
              alt="Supplements"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="border-t border-border/50 py-16">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-xl font-bold text-foreground text-center mb-8">What people are saying</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {testimonials.map((t) => (
              <TestimonialCard key={t.name} t={t} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="border-t border-border/50 py-16 bg-muted/20">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
            Your routine starts here.
          </h2>
          <p className="text-sm text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
            Free, evidence-based, and built around you — not a generic list.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href="#/roam">
              <Button size="lg" className="gap-2 rounded-full px-8 font-semibold">
                <Compass className="w-4 h-4" />
                Find My Travel Pick
              </Button>
            </a>
            <a href="#/glow">
              <Button size="lg" variant="outline" className="gap-2 rounded-full px-8 font-semibold">
                <Sparkles className="w-4 h-4" />
                Build Skincare Routine
              </Button>
            </a>
            <a href="#/vita">
              <Button size="lg" variant="outline" className="gap-2 rounded-full px-8 font-semibold">
                <Pill className="w-4 h-4" />
                Build Vitamin Routine
              </Button>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
