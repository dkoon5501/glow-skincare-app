import { useState, useCallback, useMemo } from "react";
import {
  roamQuestions,
  roamUSZones,
  generateRoamResults,
  type RoamAnswers,
  type RoamResult,
  type USZone,
} from "@/lib/roam-data";
import { shareRoamResults } from "@/lib/roam-share";
import { saveRoamRoutine } from "@/lib/firestore";
import { useAuth } from "@/lib/auth-context";
import { useHashLocation } from "wouter/use-hash-location";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowRight,
  ArrowLeft,
  Compass,
  Play,
  Share2,
  Check,
  Bookmark,
  BookmarkCheck,
  BookOpen,
  ExternalLink,
  CheckCircle2,
  MapPin,
  SkipForward,
} from "lucide-react";

// ── Landing data ──

const ROAM_HOW_IT_WORKS = [
  {
    icon: Compass,
    step: "01",
    title: "5 Quick Questions",
    description: "Tell us your vibe, region, trip length, travel style, and where you want to sleep. Pick the United States and you can narrow it further by zone.",
  },
  {
    icon: Play,
    step: "02",
    title: "Smart Match",
    description: "Our algorithm scores 250+ creator-vetted destinations against your answers and surfaces your top picks.",
  },
  {
    icon: ExternalLink,
    step: "03",
    title: "Top Pick + Alternates",
    description: "Get your #1 matched destination with 3 alternates — each credited to the creator whose episode inspired it.",
  },
];

const ROAM_DIFFERENTIATORS = [
  {
    title: "Real Creator Footage",
    description: "Every destination links to a full YouTube episode from one of 8 trusted travel creators — not stock photos or blog posts. See the real experience before you book.",
  },
  {
    title: "Honest Opinions",
    description: "The creators we pull from don't filter out the bad stuff. Their episodes cover what actually happened — including what didn't go as planned.",
  },
  {
    title: "Matched to You",
    description: "Your vibe, budget, region, group, and where you want to sleep all factor into the scoring. Two people get two very different results.",
  },
  {
    title: "250+ Curated Picks",
    description: "We didn't scrape a list. Each destination was selected from a specific creator episode that captures the place at its best.",
  },
];

const ROAM_FAQS = [
  {
    q: "Which creators did you curate from?",
    a: "Kara & Nate, The Bucket List Family, Lost LeBlanc, Mark Wiens, Outdoor Boys, Wandering Wagars, Eric Stoen / Travel Babbo, and Jeb Brooks — 8 full-time travel creators who have collectively documented hundreds of destinations across every continent.",
  },
  {
    q: "How are destinations matched to me?",
    a: "Your vibe (luxury/budget/offbeat/adventure), region (optionally a US zone), duration, travel style (solo/partner/family/group), and sleep style (hotel/hostel/outdoor/RV) are each scored against every destination. The highest scoring match becomes your top pick.",
  },
  {
    q: "What's the US zone picker?",
    a: "If you pick United States as your region, we show a second screen that lets you narrow to a zone — Pacific Coast, Rocky Mountains, Southwest, Southeast, Alaska & Hawaii, or the inland West. You can skip it to see all US episodes.",
  },
  {
    q: "Can I get results for a region I didn't pick?",
    a: "The quiz filters to your selected region first, then scores within it. Episodes tagged as Global always surface as low-weight fallbacks. To explore a different region, just retake the quiz.",
  },
  {
    q: "Do I need an account?",
    a: "No. You get full results without signing in. Creating a free account lets you save your picks to revisit later.",
  },
  {
    q: "Is Roam free?",
    a: "Yes, completely free. We don't take commissions from hotels or booking sites. The only links in results go directly to YouTube.",
  },
];

type AppState = "landing" | "quiz" | "results";

// ── Roam Landing ──

function RoamLanding({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen bg-background">
      <section className="flex flex-col items-center justify-center px-4 pt-16 pb-12 text-center max-w-2xl mx-auto">
        <div className="mb-6">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 dark:text-amber-300 dark:bg-amber-950/40 dark:border-amber-800 px-3.5 py-1.5 rounded-full">
            <Compass className="w-3 h-3" />
            Creator-Vetted Travel Picks
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight max-w-2xl mb-5">
          Your Creator-Vetted
          <br className="hidden sm:block" /> Travel Picks
        </h1>

        <p className="text-base md:text-lg text-muted-foreground max-w-xl mb-10 leading-relaxed">
          250+ destinations hand-curated from 8 trusted YouTube travel creators — matched to your vibe, region, trip length, group, and sleep style.
        </p>

        <Button
          size="lg"
          onClick={onStart}
          className="gap-2 px-8 h-12 rounded-full text-sm font-semibold shadow-sm bg-amber-500 hover:bg-amber-600 text-white border-0"
        >
          Find My Travel Pick
          <ArrowRight className="w-4 h-4" />
        </Button>
        <p className="mt-4 text-xs text-muted-foreground">
          5 questions&nbsp;&bull;&nbsp;No account required&nbsp;&bull;&nbsp;100% free
        </p>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-amber-50/50 dark:bg-amber-950/10 border-y border-amber-100 dark:border-amber-900/30 px-6 py-10 md:py-14">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-xl font-bold text-foreground tracking-tight">How It Works</h2>
            <p className="mt-2 text-sm text-muted-foreground">5 questions. Your top pick in under a minute.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ROAM_HOW_IT_WORKS.map(({ icon: Icon, step, title, description }) => (
              <div key={step} className="flex flex-col items-center text-center md:items-start md:text-left">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
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

      {/* WHAT MAKES ROAM DIFFERENT */}
      <section className="px-6 py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-xl font-bold text-foreground tracking-tight">What Makes Roam Different</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ROAM_DIFFERENTIATORS.map(({ title, description }) => (
              <div key={title} className="p-6 rounded-xl bg-card border border-card-border">
                <h3 className="text-sm font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-amber-50/50 dark:bg-amber-950/10 border-y border-amber-100 dark:border-amber-900/30 px-6 py-16 md:py-20">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-xl font-bold text-foreground tracking-tight">Frequently Asked Questions</h2>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {ROAM_FAQS.map(({ q, a }, i) => (
              <AccordionItem key={q} value={`faq-${i}`}>
                <AccordionTrigger className="text-sm font-medium text-left hover:no-underline hover:text-amber-600 dark:hover:text-amber-400 transition-colors py-4">
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

      {/* FINAL CTA */}
      <section className="px-6 py-16 md:py-20 bg-amber-500/5 border-t border-amber-500/10">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="text-xl font-bold text-foreground tracking-tight mb-4">Ready to find your next destination?</h2>
          <p className="text-sm text-muted-foreground mb-8 leading-relaxed">
            250+ creator-vetted picks from 8 trusted travel creators — matched to your vibe and travel style in under a minute.
          </p>
          <Button
            size="lg"
            onClick={onStart}
            className="gap-2 px-8 h-12 rounded-full text-sm font-semibold shadow-sm bg-amber-500 hover:bg-amber-600 text-white border-0"
          >
            Find My Travel Pick
            <ArrowRight className="w-4 h-4" />
          </Button>
          <p className="mt-4 text-xs text-muted-foreground">
            5 questions&nbsp;•&nbsp;No account required&nbsp;•&nbsp;100% free
          </p>
        </div>
      </section>
    </div>
  );
}

// ── US Zone Picker (conditional step after region=United States) ──

function USZonePicker({
  onSelect,
  onSkip,
  onBack,
  currentStepNum,
  totalSteps,
  progress,
}: {
  onSelect: (zone: USZone) => void;
  onSkip: () => void;
  onBack: () => void;
  currentStepNum: number;
  totalSteps: number;
  progress: number;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <span className="text-xs text-muted-foreground">
            {currentStepNum} of {totalSteps}
          </span>
        </div>

        <div className="w-full h-1.5 bg-muted/30 rounded-full mb-8">
          <div
            className="h-full bg-amber-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <h2 className="text-xl font-bold text-foreground mb-1">
          Any part of the US in particular?
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Pick a zone to narrow your picks, or skip to see everything in the US.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {roamUSZones.map((zone) => (
            <button
              key={zone.value}
              onClick={() => onSelect(zone.value)}
              className="text-left p-3.5 rounded-xl border border-card-border bg-card hover:border-amber-300 dark:hover:border-amber-700 transition-all"
            >
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                <div>
                  <span className="text-sm font-medium text-foreground">{zone.label}</span>
                  <p className="text-xs text-muted-foreground mt-0.5">{zone.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={onSkip}
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <SkipForward className="w-4 h-4" />
          Skip — show all US picks
        </button>
      </div>
    </div>
  );
}

// ── Roam Quiz Flow ──

type QuizStep =
  | { kind: "question"; questionIndex: number }
  | { kind: "usZone" };

function RoamQuizFlow({
  onComplete,
  onBack,
}: {
  onComplete: (answers: RoamAnswers) => void;
  onBack: () => void;
}) {
  const [answers, setAnswers] = useState<RoamAnswers>({});
  const [stepIndex, setStepIndex] = useState(0);

  // Compute steps dynamically: insert the US zone picker after region if region === "United States".
  const steps: QuizStep[] = useMemo(() => {
    const s: QuizStep[] = [];
    for (let i = 0; i < roamQuestions.length; i++) {
      s.push({ kind: "question", questionIndex: i });
      if (roamQuestions[i].id === "region" && answers.region === "United States") {
        s.push({ kind: "usZone" });
      }
    }
    return s;
  }, [answers.region]);

  const currentStep = steps[stepIndex];
  const totalSteps = steps.length;
  const progress = ((stepIndex + 1) / totalSteps) * 100;

  const advance = useCallback(
    (newAnswers: RoamAnswers) => {
      // Recompute steps with the new answers so we can decide whether to insert zone picker.
      const nextSteps: QuizStep[] = [];
      for (let i = 0; i < roamQuestions.length; i++) {
        nextSteps.push({ kind: "question", questionIndex: i });
        if (roamQuestions[i].id === "region" && newAnswers.region === "United States") {
          nextSteps.push({ kind: "usZone" });
        }
      }
      const nextIndex = stepIndex + 1;
      if (nextIndex >= nextSteps.length) {
        onComplete(newAnswers);
      } else {
        setStepIndex(nextIndex);
      }
    },
    [stepIndex, onComplete],
  );

  function handleQuestionSelect(value: string) {
    if (currentStep.kind !== "question") return;
    const q = roamQuestions[currentStep.questionIndex];
    const newAnswers = { ...answers };
    newAnswers[q.id] = value;
    // If region changed away from United States, drop any previously chosen usZone.
    if (q.id === "region" && value !== "United States" && newAnswers.usZone) {
      delete newAnswers.usZone;
    }
    setAnswers(newAnswers);
    setTimeout(() => advance(newAnswers), 280);
  }

  function handleZoneSelect(zone: USZone) {
    const newAnswers = { ...answers, usZone: zone };
    setAnswers(newAnswers);
    setTimeout(() => advance(newAnswers), 280);
  }

  function handleZoneSkip() {
    const newAnswers = { ...answers };
    delete newAnswers.usZone;
    setAnswers(newAnswers);
    advance(newAnswers);
  }

  function handleBack() {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
    } else {
      onBack();
    }
  }

  if (currentStep.kind === "usZone") {
    return (
      <USZonePicker
        onSelect={handleZoneSelect}
        onSkip={handleZoneSkip}
        onBack={handleBack}
        currentStepNum={stepIndex + 1}
        totalSteps={totalSteps}
        progress={progress}
      />
    );
  }

  const question = roamQuestions[currentStep.questionIndex];
  const isRegionQuestion = question.id === "region";
  const isVibeQuestion = question.id === "vibe";
  const useGrid = isRegionQuestion || isVibeQuestion;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <span className="text-xs text-muted-foreground">
            {stepIndex + 1} of {totalSteps}
          </span>
        </div>

        <div className="w-full h-1.5 bg-muted/30 rounded-full mb-8">
          <div
            className="h-full bg-amber-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <h2 className="text-xl font-bold text-foreground mb-1">{question.question}</h2>
        {question.subtitle && (
          <p className="text-sm text-muted-foreground mb-6">{question.subtitle}</p>
        )}

        <div className={useGrid ? "grid grid-cols-2 gap-2" : "space-y-2"}>
          {question.options.map((opt) => {
            const isSelected = answers[question.id] === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => handleQuestionSelect(opt.value)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                  isSelected
                    ? "border-amber-400 bg-amber-50 dark:border-amber-600 dark:bg-amber-950/30"
                    : "border-card-border bg-card hover:border-amber-300 dark:hover:border-amber-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  {opt.icon && <span className="text-lg">{opt.icon}</span>}
                  <div className="flex-1">
                    <span className="text-sm font-medium text-foreground">{opt.label}</span>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-amber-500 inline ml-2" />
                    )}
                    {opt.description && !useGrid && (
                      <p className="text-xs text-muted-foreground mt-0.5">{opt.description}</p>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Save Roam Routine Section ──

function SaveRoamRoutineSection({
  answers,
  results,
}: {
  answers: RoamAnswers;
  results: RoamResult[];
}) {
  const { user, signInWithGoogle } = useAuth();
  const [, navigate] = useHashLocation();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = useCallback(async () => {
    if (!user) return;
    setSaving(true);
    setError(null);
    try {
      await saveRoamRoutine(user.uid, { answers, results });
      setSaved(true);
    } catch {
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }, [user, answers, results]);

  const handleGoogleSignIn = useCallback(async () => {
    try {
      await signInWithGoogle();
    } catch {
      setError("Sign-in was cancelled or failed. Please try again.");
    }
  }, [signInWithGoogle]);

  return (
    <Card className="border-amber-200 dark:border-amber-800">
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Bookmark className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <h3 className="text-sm font-semibold text-foreground">Save Your Picks</h3>
        </div>

        {!user ? (
          <div>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Create a free account to save your travel picks and revisit them anytime.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleGoogleSignIn}
              className="gap-2"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Continue with Google
            </Button>
            {error && <p className="text-xs text-destructive mt-2">{error}</p>}
          </div>
        ) : saved ? (
          <div className="text-center py-2">
            <div className="flex items-center justify-center gap-2 text-amber-600 dark:text-amber-400 mb-3">
              <BookmarkCheck className="w-5 h-5" />
              <span className="text-sm font-medium">Picks saved.</span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              View and manage all your saved routines anytime.
            </p>
            <Button variant="outline" size="sm" onClick={() => navigate("/my-routines")} className="gap-2">
              <BookOpen className="w-3.5 h-3.5" /> View My Routines
            </Button>
          </div>
        ) : (
          <div>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Signed in as <span className="font-medium text-foreground">{user.displayName ?? user.email}</span>. Save these picks to revisit later.
            </p>
            <div className="flex gap-2 flex-wrap">
              <Button
                size="sm"
                onClick={handleSave}
                disabled={saving}
                className="gap-2 bg-amber-500 hover:bg-amber-600 text-white border-0"
              >
                <Bookmark className="w-3.5 h-3.5" /> {saving ? "Saving…" : "Save Picks"}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate("/my-routines")} className="gap-2">
                <BookOpen className="w-3.5 h-3.5" /> My Routines
              </Button>
            </div>
            {error && <p className="text-xs text-destructive mt-2">{error}</p>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ── Share Button ──

function ShareRoamButton({
  answers,
  topPickTitle,
  topPickCreator,
}: {
  answers: RoamAnswers;
  topPickTitle: string;
  topPickCreator?: string;
}) {
  const [status, setStatus] = useState<"idle" | "copied" | "shared" | "failed">("idle");

  const handleShare = useCallback(async () => {
    const result = await shareRoamResults(answers, topPickTitle, topPickCreator);
    setStatus(result);
    if (result === "copied") setTimeout(() => setStatus("idle"), 2500);
  }, [answers, topPickTitle, topPickCreator]);

  return (
    <Button
      variant="outline"
      onClick={handleShare}
      className="gap-2 rounded-full"
    >
      {status === "copied" ? (
        <><Check className="w-4 h-4" /> Link Copied</>
      ) : status === "shared" ? (
        <><Check className="w-4 h-4" /> Shared</>
      ) : (
        <><Share2 className="w-4 h-4" /> Share Picks</>
      )}
    </Button>
  );
}

// ── Profile chip label helpers ──

const VIBE_LABELS: Record<string, string> = {
  luxury: "✨ Luxury",
  budget: "🎒 Budget",
  offbeat: "🗺️ Offbeat",
  adventure: "⛰️ Adventure",
};

const DURATION_LABELS: Record<string, string> = {
  weekend: "Weekend",
  week: "~1 week",
  twoWeeks: "~2 weeks",
  month: "1+ month",
};

const STYLE_LABELS: Record<string, string> = {
  solo: "🧭 Solo",
  partner: "👫 Partner",
  family: "👨‍👩‍👧 Family",
  group: "👥 Group",
};

const ACCOMMODATION_LABELS: Record<string, string> = {
  hotel: "🏨 Hotel",
  hostel: "🛏️ Hostel",
  outdoor: "⛺️ Outdoor",
  rv: "🚐 RV",
};

// ── Episode card (top pick) ──

function CreatorLink({ creator, handle }: { creator: string; handle: string }) {
  const url = `https://www.youtube.com/${handle.startsWith("@") ? handle : `@${handle}`}`;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-xs font-medium text-amber-700 dark:text-amber-300 hover:underline"
    >
      {creator}
    </a>
  );
}

function TopPickCard({ result }: { result: RoamResult }) {
  const ep = result.episode;
  const thumb = `https://img.youtube.com/vi/${ep.videoId}/maxresdefault.jpg`;
  const watchUrl = `https://www.youtube.com/watch?v=${ep.videoId}`;

  return (
    <div className="rounded-2xl overflow-hidden border border-amber-200 dark:border-amber-800 bg-card shadow-sm">
      {/* Thumbnail */}
      <div className="relative aspect-video bg-muted">
        <img
          src={thumb}
          alt={ep.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute top-3 left-3">
          <Badge className="bg-amber-500 text-white border-0 text-xs font-semibold">
            Top match
          </Badge>
        </div>
        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 flex items-center justify-center group"
          aria-label={`Watch ${ep.title} on YouTube`}
        >
          <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:bg-white transition-colors">
            <Play className="w-6 h-6 text-red-600 fill-red-600 ml-1" />
          </div>
        </a>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center justify-between gap-2 mb-1">
          <p className="text-xs text-muted-foreground">{ep.destination}</p>
          <span className="text-xs text-muted-foreground">
            by <CreatorLink creator={ep.creator} handle={ep.creatorHandle} />
          </span>
        </div>
        <h3 className="text-base font-bold text-foreground mb-2 leading-snug">{ep.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">{ep.description}</p>

        {/* Highlights */}
        <ul className="space-y-1 mb-5">
          {ep.highlights.map((h) => (
            <li key={h} className="flex items-start gap-2 text-xs text-muted-foreground">
              <span className="text-amber-500 mt-0.5 shrink-0">•</span>
              {h}
            </li>
          ))}
        </ul>

        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-semibold bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          Watch on YouTube
        </a>
      </div>
    </div>
  );
}

// ── Alternate card (compact) ──

function AlternateCard({ result }: { result: RoamResult }) {
  const ep = result.episode;
  const thumb = `https://img.youtube.com/vi/${ep.videoId}/maxresdefault.jpg`;
  const watchUrl = `https://www.youtube.com/watch?v=${ep.videoId}`;

  return (
    <div className="rounded-xl overflow-hidden border border-border bg-card">
      <div className="relative aspect-video bg-muted">
        <img
          src={thumb}
          alt={ep.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 flex items-center justify-center group"
          aria-label={`Watch ${ep.title} on YouTube`}
        >
          <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow group-hover:bg-white transition-colors">
            <Play className="w-4 h-4 text-red-600 fill-red-600 ml-0.5" />
          </div>
        </a>
      </div>
      <div className="p-4">
        <p className="text-xs text-muted-foreground mb-0.5">{ep.destination}</p>
        <h4 className="text-sm font-semibold text-foreground mb-1 leading-snug line-clamp-2">{ep.title}</h4>
        <p className="text-[11px] text-muted-foreground mb-2">
          by <CreatorLink creator={ep.creator} handle={ep.creatorHandle} />
        </p>
        <ul className="space-y-0.5 mb-3">
          {ep.highlights.slice(0, 2).map((h) => (
            <li key={h} className="flex items-start gap-1.5 text-xs text-muted-foreground">
              <span className="text-amber-500 mt-0.5 shrink-0">•</span>
              <span className="line-clamp-1">{h}</span>
            </li>
          ))}
        </ul>
        <a
          href={watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-red-600 hover:text-red-700"
        >
          <Play className="w-3 h-3 fill-current" />
          Watch on YouTube
        </a>
      </div>
    </div>
  );
}

// ── Roam Results ──

export function RoamResults({
  results,
  answers,
  onRetake,
  isSharedView,
}: {
  results: RoamResult[];
  answers: RoamAnswers;
  onRetake: () => void;
  isSharedView?: boolean;
}) {
  const topPick = results[0];
  const alternates = results.slice(1, 4);

  const regionLabel = answers.region
    ? answers.region === "United States" && answers.usZone
      ? `United States — ${answers.usZone}`
      : answers.region
    : null;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="text-center">
          <Badge
            variant="outline"
            className="mb-3 text-xs border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-300"
          >
            Curated from 8 trusted travel creators
          </Badge>
          <h1 className="text-xl font-bold text-foreground">Your Travel Picks</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Matched from 250+ creator-vetted destinations
          </p>
        </div>

        {/* Profile chips */}
        <div className="flex flex-wrap gap-2 justify-center">
          {answers.vibe && (
            <Badge variant="outline" className="text-xs">
              {VIBE_LABELS[answers.vibe] ?? answers.vibe}
            </Badge>
          )}
          {regionLabel && (
            <Badge variant="outline" className="text-xs">{regionLabel}</Badge>
          )}
          {answers.duration && (
            <Badge variant="outline" className="text-xs">
              {DURATION_LABELS[answers.duration] ?? answers.duration}
            </Badge>
          )}
          {answers.travelStyle && (
            <Badge variant="outline" className="text-xs">
              {STYLE_LABELS[answers.travelStyle] ?? answers.travelStyle}
            </Badge>
          )}
          {answers.accommodation && (
            <Badge variant="outline" className="text-xs">
              {ACCOMMODATION_LABELS[answers.accommodation] ?? answers.accommodation}
            </Badge>
          )}
        </div>

        {/* Top pick */}
        {topPick && <TopPickCard result={topPick} />}

        {/* Alternates */}
        {alternates.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-foreground mb-3">Also consider</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {alternates.map((r) => (
                <AlternateCard key={r.episode.id} result={r} />
              ))}
            </div>
          </div>
        )}

        {/* Save — hide on shared views */}
        {!isSharedView && (
          <SaveRoamRoutineSection answers={answers} results={results} />
        )}

        {/* Disclaimer */}
        <Card className="p-4">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Episodes sourced from the YouTube channels of the creators credited on each card. Roam is not affiliated with any creator. All travel decisions are your own — do your own research before booking.
          </p>
        </Card>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3 items-center justify-center">
          <Button variant="outline" onClick={onRetake} className="gap-2 rounded-full">
            {isSharedView ? "Take the Quiz" : "Retake Quiz"}
          </Button>
          {topPick && (
            <ShareRoamButton
              answers={answers}
              topPickTitle={topPick.episode.title}
              topPickCreator={topPick.episode.creator}
            />
          )}
          <Button
            onClick={() => { window.location.hash = "#/vita"; }}
            className="gap-2 rounded-full"
          >
            Build Vitamin Routine <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Main Roam Home ──

export default function RoamHome() {
  const [appState, setAppState] = useState<AppState>("landing");
  const [results, setResults] = useState<RoamResult[]>([]);
  const [lastAnswers, setLastAnswers] = useState<RoamAnswers>({});

  const handleStart = useCallback(() => setAppState("quiz"), []);

  const handleQuizComplete = useCallback((answers: RoamAnswers) => {
    const r = generateRoamResults(answers);
    setResults(r);
    setLastAnswers(answers);
    setAppState("results");
  }, []);

  const handleRetake = useCallback(() => {
    setAppState("landing");
    setResults([]);
    setLastAnswers({});
  }, []);

  return (
    <div>
      {appState === "landing" && <RoamLanding onStart={handleStart} />}
      {appState === "quiz" && (
        <RoamQuizFlow
          onComplete={handleQuizComplete}
          onBack={() => setAppState("landing")}
        />
      )}
      {appState === "results" && results.length > 0 && (
        <RoamResults results={results} answers={lastAnswers} onRetake={handleRetake} />
      )}
    </div>
  );
}
