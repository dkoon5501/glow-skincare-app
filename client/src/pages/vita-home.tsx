import { useState, useCallback } from "react";
import { vitaQuestions, generateVitaRoutine, type VitaAnswers, type VitaRoutine, type SupplementRecommendation } from "@/lib/vita-data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";

// ── Provider Links ──
const FULLSCRIPT_URL = "https://us.fullscript.com/welcome/vita1776393547";
const PURE_ENCAPS_URL = "https://patientdirect.pureencapsulationspro.com/patients/sign_up?practice_code=668833";

type AppState = "landing" | "quiz" | "results";

// ── Vita Landing ──

function VitaLanding({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative min-h-[70vh] overflow-hidden">
        {/* Right-side background image — fades into background on left */}
        <div className="absolute inset-0 -z-10">
          <img
            src="https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=1400&q=80&fit=crop&crop=right"
            alt=""
            aria-hidden="true"
            className="absolute right-0 top-0 h-full w-3/4 object-cover object-right"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
        </div>
        <div className="relative flex flex-col items-center justify-center px-4 py-16 text-center max-w-2xl mx-auto min-h-[70vh]">
        <div className="mb-6">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/8 border border-primary/15 px-3.5 py-1.5 rounded-full">
            <Pill className="w-3 h-3" />
            Pharmacist-Guided Supplements
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight max-w-2xl mb-5">
          Your Pharmacist-Guided
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

        {/* How it works */}
        <div className="mt-16 w-full">
          <h2 className="text-lg font-bold text-foreground mb-6">How It Works</h2>
          <div className="grid sm:grid-cols-3 gap-4 text-left">
            {[
              { num: "01", title: "Health Profile", desc: "Age, diet, goals, lifestyle, and any conditions — so we understand your needs." },
              { num: "02", title: "Smart Matching", desc: "Our algorithm matches you with evidence-based supplements for your specific profile." },
              { num: "03", title: "Your Routine", desc: "Morning, evening, and with-food timing — plus pharmacist warnings about interactions." },
            ].map((step) => (
              <Card key={step.num} className="p-4">
                <span className="text-primary font-bold text-sm">{step.num}</span>
                <h3 className="font-semibold text-sm text-foreground mt-1">{step.title}</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{step.desc}</p>
              </Card>
            ))}
          </div>
        </div>
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
          {s.source && s.source !== "Evidence-based (pharmacist-reviewed)" && (
            <p className="text-xs text-muted-foreground italic">
              Source:{" "}
              {s.sourceUrl ? (
                <a href={s.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  {s.source}
                </a>
              ) : s.source}
            </p>
          )}
          {s.source === "Evidence-based (pharmacist-reviewed)" && (
            <p className="text-xs text-muted-foreground italic">Pharmacist-reviewed, evidence-based recommendation</p>
          )}
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
                Pharmacist Notes
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
