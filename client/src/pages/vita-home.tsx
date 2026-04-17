import { useState, useCallback } from "react";
import { vitaQuestions, generateVitaRoutine, type VitaAnswers, type VitaRoutine, type SupplementRecommendation } from "@/lib/vita-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ExpertSourcesPanel } from "@/components/expert-sources-panel";
import {
  ArrowRight,
  ArrowLeft,
  Sun,
  Moon,
  ShoppingCart,
  AlertTriangle,
  Pill,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  UtensilsCrossed,
  ExternalLink,
  ClipboardList,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

// ── Vita landing data ──

const VITA_HOW_IT_WORKS = [
  {
    icon: ClipboardList,
    step: "01",
    title: "Health Profile",
    description: "Answer 7 questions about your age, diet, health goals, lifestyle, and any conditions — so we understand your specific needs.",
  },
  {
    icon: Sparkles,
    step: "02",
    title: "Smart Matching",
    description: "Our algorithm cross-references your profile against evidence-based supplement data to surface what your body actually needs.",
  },
  {
    icon: Sun,
    step: "03",
    title: "Your Routine",
    description: "Morning, with food, and evening — each supplement scheduled when your body best absorbs it, plus expert interaction warnings.",
  },
];

const VITA_METHODOLOGY = [
  {
    title: "Health Profiling",
    description: "We assess your profile across diet type, health goals, activity level, age, and existing conditions. Each dimension affects which supplements are relevant — a vegan athlete has fundamentally different needs than a sedentary omnivore.",
  },
  {
    title: "Evidence-Based Matching",
    description: "Every supplement in our database is selected based on peer-reviewed clinical evidence and expert review. We don't include supplements with weak or conflicting evidence — only those with consistent, reproducible support.",
  },
  {
    title: "Absorption Timing",
    description: "When you take a supplement matters as much as which one you take. Fat-soluble vitamins (A, D, E, K) are scheduled with meals. Magnesium is placed in the evening. Iron is kept separate from calcium. We build the schedule around absorption science, not convenience.",
  },
  {
    title: "Interaction Screening",
    description: "Our expert-reviewed database flags known supplement-supplement and supplement-medication interactions. If your profile includes medications or conditions that warrant caution, we surface those warnings directly in your routine.",
  },
];

const VITA_DIFFERENTIATORS = [
  {
    title: "Expert-Reviewed",
    description: "Every recommendation in our database has been reviewed against clinical pharmacology literature — not assembled by an algorithm alone.",
  },
  {
    title: "Timed for Absorption",
    description: "Morning, with food, evening — we schedule each supplement based on how your body actually absorbs it, not just what's convenient.",
  },
  {
    title: "Provider Pricing",
    description: "Access practitioner-grade supplements through Fullscript and Pure Encapsulations at provider pricing — not available retail.",
  },
  {
    title: "No Upsell",
    description: "We recommend what your profile needs. We don't inflate routines to increase cart size or push products based on margin.",
  },
];

const VITA_FAQS = [
  {
    q: "Is Vita really free?",
    a: "Yes. The quiz and recommendations are always free. We earn a small commission if you purchase through Amazon links, and we offer access to Fullscript and Pure Encapsulations provider pricing at no markup.",
  },
  {
    q: "How are supplements selected?",
    a: "Every supplement in our database is selected based on peer-reviewed evidence and expert review. We only include supplements with consistent clinical support for the health goals they address.",
  },
  {
    q: "What is provider pricing?",
    a: "Fullscript and Pure Encapsulations are professional-grade supplement platforms typically available only through licensed practitioners. By registering under our practitioner account, you access the same discounted pricing — without a prescription.",
  },
  {
    q: "Can I take these supplements with my medications?",
    a: "Vita flags known supplement-medication interactions based on expert review. However, these recommendations are informational only. Always consult your physician or pharmacist before starting any new supplement, especially if you take prescription medications.",
  },
  {
    q: "Do I need an account?",
    a: "No. You can complete the quiz and get your full routine without signing in. Creating a free account lets you save your routine for future reference.",
  },
];

// ── Provider Links ──
const FULLSCRIPT_URL = "https://us.fullscript.com/welcome/vita1776393547";
const PURE_ENCAPS_URL = "https://patientdirect.pureencapsulationspro.com/patients/sign_up?practice_code=668833";

type AppState = "landing" | "quiz" | "results";

// ── Vita Landing ──

function VitaLanding({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen bg-background">
      <section className="flex flex-col items-center justify-center px-4 pt-16 pb-12 text-center max-w-2xl mx-auto">
        <div>
        <div className="mb-6">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/8 border border-primary/15 px-3.5 py-1.5 rounded-full">
            <Pill className="w-3 h-3" />
            Expert-Guided Supplements
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight max-w-2xl mb-5">
          Your Expert-Guided
          <br className="hidden sm:block" /> Vitamin Routine
        </h1>

        <p className="text-base md:text-lg text-muted-foreground max-w-xl mb-10 leading-relaxed">
          Answer 7 quick questions about your health, diet, and goals. Get a personalized supplement routine backed by clinical evidence.
        </p>

        <Button
          size="lg"
          onClick={onStart}
          className="gap-2 px-8 h-12 rounded-full text-sm font-semibold shadow-sm"
        >
          Build My Vitamin Routine
          <ArrowRight className="w-4 h-4" />
        </Button>
        <p className="mt-4 text-xs text-muted-foreground">
          2 minutes&nbsp;&bull;&nbsp;No account required&nbsp;&bull;&nbsp;100% free
        </p>

        </div>
      </section>

      {/* ─── HOW IT WORKS ────────────────────────────────────── */}
      <section className="bg-accent/30 border-y border-border/60 px-6 py-10 md:py-14">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-xl font-bold text-foreground tracking-tight">How It Works</h2>
            <p className="mt-2 text-sm text-muted-foreground">From quiz to routine in under 2 minutes.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {VITA_HOW_IT_WORKS.map(({ icon: Icon, step, title, description }) => (
              <div key={step} className="flex flex-col items-center text-center md:items-start md:text-left">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground tracking-widest">STEP {step}</span>
                </div>
                <h3 className="text-base font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW OUR ALGORITHM WORKS ───────────────────────────── */}
      <section className="px-6 py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-xl font-bold text-foreground tracking-tight mb-3">How Our Algorithm Works</h2>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
              We don't just list popular supplements. Vita uses a structured, evidence-mapped approach to match you with the right routine for your body.
            </p>
          </div>
          <div className="space-y-6">
            {VITA_METHODOLOGY.map((step, i) => (
              <div key={step.title} className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-primary">{i + 1}</span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHAT MAKES VITA DIFFERENT ───────────────────────────── */}
      <section className="bg-accent/30 border-y border-border/60 px-6 py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-xl font-bold text-foreground tracking-tight">What Makes Vita Different</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {VITA_DIFFERENTIATORS.map(({ title, description }) => (
              <div key={title} className="p-6 rounded-xl bg-card border border-card-border">
                <h3 className="text-sm font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─────────────────────────────────────────────── */}
      <section className="px-6 py-16 md:py-20">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-xl font-bold text-foreground tracking-tight">Frequently Asked Questions</h2>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {VITA_FAQS.map(({ q, a }, i) => (
              <AccordionItem key={q} value={`faq-${i}`}>
                <AccordionTrigger className="text-sm font-medium text-left hover:no-underline hover:text-primary transition-colors py-4">
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

      {/* ─── FINAL CTA ──────────────────────────────────────────── */}
      <section className="px-6 py-16 md:py-20 bg-primary/5 border-t border-primary/10">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="text-xl font-bold text-foreground tracking-tight mb-4">Ready to build your vitamin routine?</h2>
          <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
            Expert-reviewed, evidence-based, and personalized to your health profile — in under 2 minutes, completely free.
          </p>
          <Button
            size="lg"
            onClick={onStart}
            className="gap-2 px-8 h-12 rounded-full text-sm font-semibold shadow-sm"
          >
            Build My Vitamin Routine
            <ArrowRight className="w-4 h-4" />
          </Button>
          <p className="mt-4 text-xs text-muted-foreground">
            2 minutes&nbsp;•&nbsp;No account required&nbsp;•&nbsp;100% free
          </p>
        </div>
      </section>

    </div>
  );
}

// ── Vita Quiz Flow ──

function VitaQuizFlow({ onComplete, onBack }: { onComplete: (answers: VitaAnswers) => void; onBack: () => void }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<VitaAnswers>({});
  const [selectedMulti, setSelectedMulti] = useState<string[]>([]);

  const question = vitaQuestions[currentQ];
  const progress = ((currentQ + 1) / vitaQuestions.length) * 100;

  function handleSelect(value: string) {
    if (question.multiSelect) {
      if (value === "none") {
        setSelectedMulti(["none"]);
      } else {
        setSelectedMulti((prev) => {
          const filtered = prev.filter((v) => v !== "none");
          return filtered.includes(value) ? filtered.filter((v) => v !== value) : [...filtered, value];
        });
      }
    } else {
      const newAnswers = { ...answers, [question.id]: value };
      setAnswers(newAnswers);
      // Auto-advance
      if (currentQ < vitaQuestions.length - 1) {
        setTimeout(() => setCurrentQ(currentQ + 1), 300);
      } else {
        onComplete(newAnswers);
      }
    }
  }

  function handleNext() {
    if (question.multiSelect) {
      const newAnswers = { ...answers, [question.id]: selectedMulti };
      setAnswers(newAnswers);
      setSelectedMulti([]);
      if (currentQ < vitaQuestions.length - 1) {
        setCurrentQ(currentQ + 1);
      } else {
        onComplete(newAnswers);
      }
    }
  }

  function handleBack() {
    if (currentQ > 0) {
      setCurrentQ(currentQ - 1);
      setSelectedMulti([]);
    } else {
      onBack();
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <button onClick={handleBack} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <span className="text-xs text-muted-foreground">{currentQ + 1} of {vitaQuestions.length}</span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-muted/30 rounded-full mb-8">
          <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>

        <h2 className="text-xl font-bold text-foreground mb-1">{question.question}</h2>
        {question.subtitle && (
          <p className="text-sm text-muted-foreground mb-6">{question.subtitle}</p>
        )}

        <div className="space-y-2">
          {question.options.map((opt) => {
            const isSelected = question.multiSelect
              ? selectedMulti.includes(opt.value)
              : answers[question.id] === opt.value;

            return (
              <button
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                  isSelected
                    ? "border-primary/40 bg-primary/5"
                    : "border-card-border bg-card hover:border-primary/20"
                }`}
              >
                <div className="flex items-center gap-3">
                  {opt.icon && <span className="text-lg">{opt.icon}</span>}
                  <div className="flex-1">
                    <span className="text-sm font-medium text-foreground">{opt.label}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-primary inline ml-2" />}
                    {opt.description && (
                      <p className="text-xs text-muted-foreground mt-0.5">{opt.description}</p>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {question.multiSelect && selectedMulti.length > 0 && (
          <Button onClick={handleNext} className="w-full mt-6" size="lg">
            Next
          </Button>
        )}
      </div>
    </div>
  );
}

// ── Supplement Card ──

function SupplementCard({ rec }: { rec: SupplementRecommendation }) {
  const [expanded, setExpanded] = useState(false);
  const { supplement: s, priority, reason } = rec;

  const priorityStyles = {
    essential: "bg-primary/10 text-primary border-primary/20",
    recommended: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950 dark:text-teal-300",
    optional: "bg-muted/50 text-muted-foreground border-border",
  };

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground">{s.brand} {s.name}</p>
          <p className="text-xs text-muted-foreground">{s.dosage} &bull; {s.form}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="outline" className={`text-xs capitalize ${priorityStyles[priority]}`}>
            {priority}
          </Badge>
          <span className="text-xs text-muted-foreground">{s.price}</span>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{reason}</p>

      {/* Purchase links */}
      <div className="mt-3 flex flex-wrap gap-2">
        <a
          href={FULLSCRIPT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium bg-primary text-primary-foreground px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity"
        >
          <ExternalLink className="w-3 h-3" />
          Buy with Provider Discount
        </a>
        {s.amazonUrl && (
          <a
            href={s.amazonUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-medium border border-border bg-background text-foreground px-3 py-1.5 rounded-lg hover:bg-muted transition-colors"
          >
            <ShoppingCart className="w-3 h-3" />
            Buy on Amazon
          </a>
        )}
      </div>

      {/* Expand for details */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 text-xs text-primary hover:underline mt-2"
      >
        {expanded ? "Less" : "Why this supplement"}
        {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>

      {expanded && (
        <div className="mt-2 pt-2 border-t border-border space-y-2">
          <p className="text-xs text-foreground leading-relaxed">{s.whyRecommended}</p>
          <div>
            <span className="text-xs font-medium text-muted-foreground">Key Ingredients:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {s.keyIngredients.map((ing) => (
                <Badge key={ing} variant="outline" className="text-xs">{ing}</Badge>
              ))}
            </div>
          </div>
          {s.source && s.source !== "Evidence-based (expert-reviewed)" && (
            <p className="text-xs text-muted-foreground italic">
              Source:{" "}
              {s.sourceUrl ? (
                <a href={s.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  {s.source}
                </a>
              ) : s.source}
            </p>
          )}
          {s.source === "Evidence-based (expert-reviewed)" && (
            <p className="text-xs text-muted-foreground italic">Expert-reviewed, evidence-based recommendation</p>
          )}
          <ExpertSourcesPanel nutrient={s.category} />
        </div>
      )}
    </Card>
  );
}

// ── Vita Results ──

function VitaResults({ routine, onRetake }: { routine: VitaRoutine; onRetake: () => void }) {
  const totalSupps = routine.morning.length + routine.evening.length + routine.withFood.length;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="text-center">
          <Badge variant="outline" className="mb-3 text-xs">
            {routine.profile.profileCode} Profile
          </Badge>
          <h1 className="text-xl font-bold text-foreground">Your Vitamin Routine</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {totalSupps} supplement{totalSupps !== 1 ? "s" : ""} personalized for your health profile
          </p>
        </div>

        {/* Warnings */}
        {routine.warnings.length > 0 && (
          <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-950/30">
            <CardContent className="p-4 space-y-2">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Expert Notes
              </h2>
              {routine.warnings.map((w, i) => (
                <p key={i} className="text-xs text-muted-foreground leading-relaxed">&bull; {w}</p>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Morning */}
        {routine.morning.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-1.5 mb-3">
              <Sun className="w-4 h-4 text-amber-500" />
              Morning
            </h2>
            <div className="space-y-3">
              {routine.morning.map((rec) => (
                <SupplementCard key={rec.supplement.id} rec={rec} />
              ))}
            </div>
          </div>
        )}

        {/* With Food */}
        {routine.withFood.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-1.5 mb-3">
              <UtensilsCrossed className="w-4 h-4 text-primary" />
              With Food
            </h2>
            <div className="space-y-3">
              {routine.withFood.map((rec) => (
                <SupplementCard key={rec.supplement.id} rec={rec} />
              ))}
            </div>
          </div>
        )}

        {/* Evening */}
        {routine.evening.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-1.5 mb-3">
              <Moon className="w-4 h-4 text-indigo-500" />
              Evening
            </h2>
            <div className="space-y-3">
              {routine.evening.map((rec) => (
                <SupplementCard key={rec.supplement.id} rec={rec} />
              ))}
            </div>
          </div>
        )}

        {/* Provider Discount Banner */}
        <Card className="p-4 border-primary/20 bg-primary/5">
          <h2 className="text-sm font-semibold text-foreground mb-1">Access Provider Pricing</h2>
          <p className="text-xs text-muted-foreground leading-relaxed mb-3">
            Register under our practitioner account to purchase supplements at provider-discounted prices through Fullscript or Pure Encapsulations.
          </p>
          <div className="flex flex-wrap gap-2">
            <a
              href={FULLSCRIPT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium bg-primary text-primary-foreground px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity"
            >
              <ExternalLink className="w-3 h-3" />
              Register on Fullscript
            </a>
            <a
              href={PURE_ENCAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium border border-primary/30 text-primary bg-background px-3 py-1.5 rounded-lg hover:bg-primary/5 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              Register on Pure Encapsulations
            </a>
          </div>
        </Card>

        {/* Disclaimer */}
        <Card className="p-4">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong className="font-medium">Disclaimer.</strong> These recommendations are for informational purposes only and do not constitute medical advice. Always consult your physician or pharmacist before starting any new supplement regimen, especially if you take prescription medications or have existing health conditions.
          </p>
        </Card>

        {/* CTAs */}
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onRetake}>
            Retake Quiz
          </Button>
          <Button className="flex-1" onClick={() => { window.location.hash = "#/glow"; }}>
            Build Skincare Routine
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Main Vita Home ──

export default function VitaHome() {
  const [appState, setAppState] = useState<AppState>("landing");
  const [routine, setRoutine] = useState<VitaRoutine | null>(null);

  const handleStart = useCallback(() => setAppState("quiz"), []);

  const handleQuizComplete = useCallback((answers: VitaAnswers) => {
    const result = generateVitaRoutine(answers);
    setRoutine(result);
    setAppState("results");
  }, []);

  const handleRetake = useCallback(() => {
    setAppState("landing");
    setRoutine(null);
  }, []);

  return (
    <div>
      {appState === "landing" && <VitaLanding onStart={handleStart} />}
      {appState === "quiz" && <VitaQuizFlow onComplete={handleQuizComplete} onBack={() => setAppState("landing")} />}
      {appState === "results" && routine && <VitaResults routine={routine} onRetake={handleRetake} />}
    </div>
  );
}
