import { useState, useCallback } from "react";
import {
  roamQuestions,
  generateRoamResults,
  type RoamAnswers,
  type RoamResult,
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
} from "lucide-react";

// ── Landing data ──

const ROAM_HOW_IT_WORKS = [
  {
    icon: Compass,
    step: "01",
    title: "4 Quick Questions",
    description: "Tell us your travel vibe, preferred region, trip length, and who you're traveling with.",
  },
  {
    icon: Play,
    step: "02",
    title: "Smart Match",
    description: "Our algorithm scores 24 creator-vetted destinations against your answers and surfaces your top picks.",
  },
  {
    icon: ExternalLink,
    step: "03",
    title: "Top Pick + Alternates",
    description: "Get your #1 matched destination with 3 alternates — each with a full episode from Kara & Nate.",
  },
];

const ROAM_DIFFERENTIATORS = [
  {
    title: "Real Creator Footage",
    description: "Every destination comes with a full Kara & Nate YouTube episode — not stock photos or blog posts. See the real experience before you book.",
  },
  {
    title: "Honest Opinions",
    description: "Kara & Nate don't filter out the bad stuff. Their content covers what actually happened, including what didn't go as planned.",
  },
  {
    title: "Matched to You",
    description: "Your travel vibe, budget style, region, and group type all factor into the scoring. Two people get two different results.",
  },
  {
    title: "24 Curated Picks",
    description: "We didn't scrape a list. Each of the 24 destinations was selected from Kara & Nate's most memorable episodes across 6 regions.",
  },
];

const ROAM_FAQS = [
  {
    q: "Who are Kara & Nate?",
    a: "Kara & Nate are full-time travel creators who have visited 100+ countries and documented their experiences on YouTube. They started traveling in 2016 and built one of the most authentic long-term travel channels on the platform. We curated 24 of their most destination-defining episodes.",
  },
  {
    q: "How are destinations matched to me?",
    a: "Your vibe (luxury/budget/offbeat/adventure), preferred region, trip duration, and travel style (solo/partner/family/group) are each scored against the attributes of every destination in our database. The highest-scoring match becomes your top pick.",
  },
  {
    q: "Can I get results for a region I didn't pick?",
    a: "The quiz filters to your selected region first, then scores within it. If you want to explore a different region, just retake the quiz — it takes under a minute.",
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
          24 destinations hand-curated from Kara & Nate's most memorable YouTube episodes — matched to your vibe, region, and travel style.
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
          4 questions&nbsp;&bull;&nbsp;No account required&nbsp;&bull;&nbsp;100% free
        </p>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-amber-50/50 dark:bg-amber-950/10 border-y border-amber-100 dark:border-amber-900/30 px-6 py-10 md:py-14">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-xl font-bold text-foreground tracking-tight">How It Works</h2>
            <p className="mt-2 text-sm text-muted-foreground">4 questions. Your top pick in under a minute.</p>
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
            24 creator-vetted picks from Kara & Nate — matched to your vibe and travel style in under a minute.
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
            4 questions&nbsp;•&nbsp;No account required&nbsp;•&nbsp;100% free
          </p>
        </div>
      </section>
    </div>
  );
}

// ── Roam Quiz Flow ──

function RoamQuizFlow({
  onComplete,
  onBack,
}: {
  onComplete: (answers: RoamAnswers) => void;
  onBack: () => void;
}) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<RoamAnswers>({});

  const question = roamQuestions[currentQ];
  const progress = ((currentQ + 1) / roamQuestions.length) * 100;
  const isRegionQuestion = question.id === "region";

  function handleSelect(value: string) {
    const newAnswers = { ...answers, [question.id]: value };
    setAnswers(newAnswers);
    if (currentQ < roamQuestions.length - 1) {
      setTimeout(() => setCurrentQ(currentQ + 1), 280);
    } else {
      onComplete(newAnswers);
    }
  }

  function handleBack() {
    if (currentQ > 0) {
      setCurrentQ(currentQ - 1);
    } else {
      onBack();
    }
  }

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
            {currentQ + 1} of {roamQuestions.length}
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

        <div className={isRegionQuestion ? "grid grid-cols-2 gap-2" : "space-y-2"}>
          {question.options.map((opt) => {
            const isSelected = answers[question.id] === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
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
                    {opt.description && !isRegionQuestion && (
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
}: {
  answers: RoamAnswers;
  topPickTitle: string;
}) {
  const [status, setStatus] = useState<"idle" | "copied" | "shared" | "failed">("idle");

  const handleShare = useCallback(async () => {
    const result = await shareRoamResults(answers, topPickTitle);
    setStatus(result);
    if (result === "copied") setTimeout(() => setStatus("idle"), 2500);
  }, [answers, topPickTitle]);

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

// ── Episode card (top pick) ──

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
        <p className="text-xs text-muted-foreground mb-1">{ep.destination}</p>
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
        <h4 className="text-sm font-semibold text-foreground mb-2 leading-snug line-clamp-2">{ep.title}</h4>
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

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="text-center">
          <Badge
            variant="outline"
            className="mb-3 text-xs border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-300"
          >
            Kara & Nate (YouTube creators)
          </Badge>
          <h1 className="text-xl font-bold text-foreground">Your Travel Picks</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Matched from 24 creator-vetted destinations
          </p>
        </div>

        {/* Profile chips */}
        <div className="flex flex-wrap gap-2 justify-center">
          {answers.vibe && (
            <Badge variant="outline" className="text-xs">
              {VIBE_LABELS[answers.vibe] ?? answers.vibe}
            </Badge>
          )}
          {answers.region && (
            <Badge variant="outline" className="text-xs">{answers.region}</Badge>
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
            Episodes sourced from Kara & Nate's YouTube channel (youtube.com/@KaraandNate). Roam is not affiliated with Kara & Nate. All travel decisions are your own — do your own research before booking.
          </p>
        </Card>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3 items-center justify-center">
          <Button variant="outline" onClick={onRetake} className="gap-2 rounded-full">
            {isSharedView ? "Take the Quiz" : "Retake Quiz"}
          </Button>
          {topPick && (
            <ShareRoamButton answers={answers} topPickTitle={topPick.episode.title} />
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
