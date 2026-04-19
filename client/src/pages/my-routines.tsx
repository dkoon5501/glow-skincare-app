import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  getUserRoutines,
  deleteRoutine,
  getUserDiscardedProducts,
  removeDiscardedProduct,
  getUserVitaRoutines,
  deleteVitaRoutine,
  type SavedRoutine,
  type SavedVitaRoutine,
  type DiscardedProduct,
} from "@/lib/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sun,
  Moon,
  Trash2,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  BookOpen,
  Loader2,
  MoonStar,
  ShoppingCart,
  XCircle,
  Undo2,
  Share2,
  Check,
  Pill,
  UtensilsCrossed,
} from "lucide-react";
import { shareResults } from "@/lib/share-utils";
import { shareVitaRoutine } from "@/lib/vita-share";
import { useHashLocation } from "wouter/use-hash-location";
import type { Timestamp } from "firebase/firestore";
import { productDatabase } from "@/lib/skincare-data";

// Look up live product data for fields that may be missing from old saved routines
function enrichProduct(saved: SavedRoutine["recommendation"]["amRoutine"][0]["product"]) {
  const live = productDatabase.find((p) => p.id === saved.id);
  return {
    ...saved,
    amazonUrl: saved.amazonUrl || live?.amazonUrl,
    sourceUrl: saved.sourceUrl || live?.sourceUrl,
    sourceLinks: (saved.sourceLinks && saved.sourceLinks.length > 0) ? saved.sourceLinks : live?.sourceLinks,
    source: saved.source || live?.source || "",
  };
}

function formatDate(ts: Timestamp): string {
  try {
    const date = ts.toDate();
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "Unknown date";
  }
}

function RoutineProductList({
  items,
  label,
}: {
  items: SavedRoutine["recommendation"]["amRoutine"];
  label: string;
}) {
  const icon = label === "Morning" ? (
    <Sun className="w-3.5 h-3.5 text-amber-500" />
  ) : (
    <Moon className="w-3.5 h-3.5 text-indigo-400" />
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 mb-2">
        {icon}
        <span className="text-xs font-semibold text-foreground">{label} Routine</span>
      </div>
      {items.map((item, i) => {
        const enriched = enrichProduct(item.product);
        return (
        <div
          key={`${item.product.id}-${i}`}
          className="flex items-start gap-2 py-2 border-b border-border/40 last:border-0"
        >
          <div className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-[10px] font-bold text-primary">{i + 1}</span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-medium text-foreground">
                {item.product.brand} {item.product.name}
              </span>
              <Badge variant="secondary" className="text-[10px] py-0 h-4">
                {item.product.price}
              </Badge>
              {item.product.pmOnly && (
                <Badge
                  variant="outline"
                  className="text-[10px] py-0 h-4 gap-0.5 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-700"
                >
                  <MoonStar className="w-2.5 h-2.5" />
                  PM Only
                </Badge>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">{item.step.label}</p>
            <div className="flex gap-2 mt-1 flex-wrap">
              {enriched.amazonUrl && (
                <a
                  href={enriched.amazonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium bg-primary text-primary-foreground px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity"
                >
                  <ShoppingCart className="w-3 h-3" />
                  Buy on Amazon
                </a>
              )}
              {enriched.sourceLinks && enriched.sourceLinks.length > 0 ? (
                enriched.sourceLinks.map((link, li) => (
                  <a
                    key={link.url || li}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary hover:underline"
                  >
                    {link.name}
                  </a>
                ))
              ) : enriched.sourceUrl ? (
                <a
                  href={enriched.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary hover:underline"
                >
                  {enriched.source}
                </a>
              ) : enriched.source && enriched.source !== "Dermatologist-recommended" ? (
                <span className="text-[10px] text-muted-foreground italic">{enriched.source}</span>
              ) : null}
            </div>
          </div>
        </div>
        );
      })}
    </div>
  );
}

function ShareRoutineButton({ routine }: { routine: SavedRoutine }) {
  const [status, setStatus] = useState<"idle" | "copied" | "shared">("idle");

  const handleShare = async () => {
    const result = await shareResults(routine.answers, routine.skinProfile);
    setStatus(result === "failed" ? "idle" : result);
    if (result === "copied") {
      setTimeout(() => setStatus("idle"), 2500);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="w-7 h-7 text-muted-foreground hover:text-primary"
      onClick={handleShare}
      aria-label="Share routine"
    >
      {status === "copied" || status === "shared" ? (
        <Check className="w-3.5 h-3.5 text-primary" />
      ) : (
        <Share2 className="w-3.5 h-3.5" />
      )}
    </Button>
  );
}

function RoutineCard({
  routine,
  onDelete,
}: {
  routine: SavedRoutine;
  onDelete: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const baumannDescriptions: Record<string, string> = {
    D: "Dry",
    O: "Oily",
    S: "Sensitive",
    R: "Resistant",
    P: "Pigmented",
    N: "Non-pigmented",
    W: "Wrinkle-prone",
    T: "Tight",
  };

  const baumannExpanded = routine.skinProfile.baumannCode
    .split("")
    .map((l) => baumannDescriptions[l] || l)
    .join(", ");

  const handleDelete = useCallback(async () => {
    if (deleting) return;
    setDeleting(true);
    try {
      await deleteRoutine(routine.id);
      onDelete(routine.id);
    } catch {
      setDeleting(false);
    }
  }, [routine.id, onDelete, deleting]);

  return (
    <Card className="overflow-hidden border-card-border" data-testid={`routine-card-${routine.id}`}>
      <CardContent className="p-4">
        {/* Card header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary" className="text-xs font-bold">
                {routine.skinProfile.baumannCode}
              </Badge>
              <span className="text-xs text-muted-foreground">{baumannExpanded}</span>
            </div>
            <div className="mt-1.5 grid grid-cols-2 gap-x-4 gap-y-0.5">
              <div>
                <span className="text-[11px] text-muted-foreground">Skin Type: </span>
                <span className="text-[11px] font-medium text-foreground">{routine.skinProfile.type}</span>
              </div>
              <div>
                <span className="text-[11px] text-muted-foreground">Sensitivity: </span>
                <span className="text-[11px] font-medium text-foreground">{routine.skinProfile.sensitivity}</span>
              </div>
              <div>
                <span className="text-[11px] text-muted-foreground">Primary Concern: </span>
                <span className="text-[11px] font-medium text-foreground">{routine.skinProfile.primaryConcern}</span>
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1.5">
              Saved {formatDate(routine.createdAt)}
            </p>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <ShareRoutineButton routine={routine} />
            <Button
              variant="ghost"
              size="icon"
              className="w-7 h-7 text-muted-foreground hover:text-destructive"
              onClick={handleDelete}
              disabled={deleting}
              data-testid={`button-delete-${routine.id}`}
              aria-label="Delete routine"
            >
              {deleting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Trash2 className="w-3.5 h-3.5" />
              )}
            </Button>
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-xs text-primary hover:underline py-1 px-1"
              data-testid={`button-expand-routine-${routine.id}`}
              aria-expanded={expanded}
            >
              {expanded ? (
                <>
                  Less <ChevronUp className="w-3 h-3" />
                </>
              ) : (
                <>
                  View <ChevronDown className="w-3 h-3" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Expanded content */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-card-border space-y-4 animate-in slide-in-from-top-2 duration-200">
            <RoutineProductList
              items={routine.recommendation.amRoutine}
              label="Morning"
            />
            <RoutineProductList
              items={routine.recommendation.pmRoutine}
              label="Evening"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ── Vita routine display ──

function VitaShareButton({ routine }: { routine: SavedVitaRoutine }) {
  const [status, setStatus] = useState<"idle" | "copied" | "shared">("idle");

  const handleShare = async () => {
    const result = await shareVitaRoutine(
      routine.answers,
      routine.routine.profile.profileCode,
    );
    setStatus(result === "failed" ? "idle" : result);
    if (result === "copied") setTimeout(() => setStatus("idle"), 2500);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="w-7 h-7 text-muted-foreground hover:text-primary"
      onClick={handleShare}
      aria-label="Share vitamin routine"
    >
      {status === "copied" || status === "shared" ? (
        <Check className="w-3.5 h-3.5 text-primary" />
      ) : (
        <Share2 className="w-3.5 h-3.5" />
      )}
    </Button>
  );
}

function VitaBucket({
  items,
  label,
  icon,
}: {
  items: SavedVitaRoutine["routine"]["morning"];
  label: string;
  icon: React.ReactNode;
}) {
  if (!items || items.length === 0) return null;
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 mb-2">
        {icon}
        <span className="text-xs font-semibold text-foreground">{label}</span>
      </div>
      {items.map((item, i) => {
        const supp = item.supplement as { id?: string; name?: string; brand?: string };
        return (
          <div
            key={`${supp.id || i}`}
            className="flex items-start gap-2 py-2 border-b border-border/40 last:border-0"
          >
            <div className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-[10px] font-bold text-primary">{i + 1}</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-medium text-foreground">
                  {supp.brand ? `${supp.brand} ` : ""}{supp.name || "Supplement"}
                </span>
                <Badge
                  variant={item.priority === "essential" ? "default" : "outline"}
                  className={`text-[10px] py-0 h-4 capitalize ${
                    item.priority === "essential"
                      ? "bg-primary/15 text-primary border-0 hover:bg-primary/15"
                      : item.priority === "recommended"
                        ? "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950 dark:text-teal-300"
                        : "text-muted-foreground border-muted-foreground/30"
                  }`}
                >
                  {item.priority}
                </Badge>
              </div>
              {item.reason && (
                <p className="text-[11px] text-muted-foreground mt-0.5">{item.reason}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function VitaRoutineCard({
  routine,
  onDelete,
}: {
  routine: SavedVitaRoutine;
  onDelete: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = useCallback(async () => {
    if (deleting) return;
    setDeleting(true);
    try {
      await deleteVitaRoutine(routine.id);
      onDelete(routine.id);
    } catch {
      setDeleting(false);
    }
  }, [routine.id, onDelete, deleting]);

  const profile = routine.routine.profile;
  const totalSupps =
    routine.routine.morning.length +
    routine.routine.evening.length +
    routine.routine.withFood.length;

  return (
    <Card className="overflow-hidden border-card-border" data-testid={`vita-routine-card-${routine.id}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary" className="text-xs font-bold">
                {profile.profileCode}
              </Badge>
              <Badge variant="outline" className="text-[10px] bg-primary/5 border-primary/30 text-primary">
                <Pill className="w-2.5 h-2.5 mr-1" />
                Vita
              </Badge>
              <span className="text-xs text-muted-foreground">
                {totalSupps} supplement{totalSupps !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="mt-1.5 grid grid-cols-2 gap-x-4 gap-y-0.5">
              <div>
                <span className="text-[11px] text-muted-foreground">Age: </span>
                <span className="text-[11px] font-medium text-foreground">{profile.ageRange}</span>
              </div>
              <div>
                <span className="text-[11px] text-muted-foreground">Diet: </span>
                <span className="text-[11px] font-medium text-foreground capitalize">{profile.dietType}</span>
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1.5">
              Saved {formatDate(routine.createdAt)}
            </p>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <VitaShareButton routine={routine} />
            <Button
              variant="ghost"
              size="icon"
              className="w-7 h-7 text-muted-foreground hover:text-destructive"
              onClick={handleDelete}
              disabled={deleting}
              data-testid={`button-delete-vita-${routine.id}`}
              aria-label="Delete vitamin routine"
            >
              {deleting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Trash2 className="w-3.5 h-3.5" />
              )}
            </Button>
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-xs text-primary hover:underline py-1 px-1"
              data-testid={`button-expand-vita-routine-${routine.id}`}
              aria-expanded={expanded}
            >
              {expanded ? (
                <>Less <ChevronUp className="w-3 h-3" /></>
              ) : (
                <>View <ChevronDown className="w-3 h-3" /></>
              )}
            </button>
          </div>
        </div>

        {expanded && (
          <div className="mt-4 pt-4 border-t border-card-border space-y-4 animate-in slide-in-from-top-2 duration-200">
            <VitaBucket
              items={routine.routine.morning}
              label="Morning"
              icon={<Sun className="w-3.5 h-3.5 text-amber-500" />}
            />
            <VitaBucket
              items={routine.routine.withFood}
              label="With Food"
              icon={<UtensilsCrossed className="w-3.5 h-3.5 text-primary" />}
            />
            <VitaBucket
              items={routine.routine.evening}
              label="Evening"
              icon={<Moon className="w-3.5 h-3.5 text-indigo-400" />}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function DiscardedProductCard({
  item,
  onUndo,
}: {
  item: DiscardedProduct;
  onUndo: (id: string) => void;
}) {
  const [undoing, setUndoing] = useState(false);

  const handleUndo = useCallback(async () => {
    if (undoing) return;
    setUndoing(true);
    try {
      await removeDiscardedProduct(item.id);
      onUndo(item.id);
    } catch {
      setUndoing(false);
    }
  }, [item.id, onUndo, undoing]);

  return (
    <Card
      className="overflow-hidden border-card-border"
      data-testid={`card-discarded-${item.id}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="text-sm font-medium text-foreground">
                {item.productBrand} {item.productName}
              </h3>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="text-[10px] capitalize">
                {item.category}
              </Badge>
              <span className="text-xs text-muted-foreground">{item.reason}</span>
            </div>
            {item.customReason && (
              <p className="text-xs text-muted-foreground mt-1 italic">
                "{item.customReason}"
              </p>
            )}
            <p className="text-[11px] text-muted-foreground mt-1.5">
              Discarded {formatDate(item.discardedAt)}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-xs shrink-0 text-muted-foreground hover:text-foreground"
            onClick={handleUndo}
            disabled={undoing}
            data-testid={`button-undo-discard-${item.id}`}
            aria-label="Undo discard"
          >
            {undoing ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Undo2 className="w-3.5 h-3.5" />
            )}
            Undo
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function MyRoutines() {
  const { user, loading: authLoading } = useAuth();
  const [, navigate] = useHashLocation();
  const [routines, setRoutines] = useState<SavedRoutine[]>([]);
  const [vitaRoutines, setVitaRoutines] = useState<SavedVitaRoutine[]>([]);
  const [discarded, setDiscarded] = useState<DiscardedProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [vitaLoading, setVitaLoading] = useState(false);
  const [discardedLoading, setDiscardedLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [vitaError, setVitaError] = useState<string | null>(null);
  const [discardedError, setDiscardedError] = useState<string | null>(null);

  // Redirect if not signed in (after auth loads)
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/");
    }
  }, [user, authLoading, navigate]);

  // Fetch routines
  useEffect(() => {
    if (!user) return;
    setLoading(true);
    setFetchError(null);
    getUserRoutines(user.uid)
      .then((data) => setRoutines(data))
      .catch(() => setFetchError("Failed to load routines. Please try again."))
      .finally(() => setLoading(false));
  }, [user]);

  // Fetch saved Vita routines
  useEffect(() => {
    if (!user) return;
    setVitaLoading(true);
    setVitaError(null);
    getUserVitaRoutines(user.uid)
      .then((data) => setVitaRoutines(data))
      .catch(() => setVitaError("Failed to load vitamin routines. Please try again."))
      .finally(() => setVitaLoading(false));
  }, [user]);

  // Fetch discarded products
  useEffect(() => {
    if (!user) return;
    setDiscardedLoading(true);
    setDiscardedError(null);
    getUserDiscardedProducts(user.uid)
      .then((data) => setDiscarded(data))
      .catch(() => setDiscardedError("Failed to load discarded products. Please try again."))
      .finally(() => setDiscardedLoading(false));
  }, [user]);

  const handleDeleteRoutine = useCallback((id: string) => {
    setRoutines((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const handleDeleteVita = useCallback((id: string) => {
    setVitaRoutines((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const handleUndoDiscard = useCallback((id: string) => {
    setDiscarded((prev) => prev.filter((d) => d.id !== id));
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen pb-12 bg-background">
      <main className="px-6 max-w-2xl mx-auto w-full pt-6">
        {/* Page title */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <h1 className="text-xl font-semibold tracking-tight">My Routines</h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/")}
            className="gap-1.5 text-xs"
            data-testid="button-take-new-quiz"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Take New Quiz
          </Button>
        </div>

        <Tabs defaultValue="saved" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="saved" className="flex-1 gap-1.5" data-testid="tab-saved-routines">
              <BookOpen className="w-3.5 h-3.5" />
              Skincare
              {routines.length > 0 && (
                <Badge variant="secondary" className="text-[10px] h-4 px-1.5 ml-0.5">
                  {routines.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="vita" className="flex-1 gap-1.5" data-testid="tab-saved-vita">
              <Pill className="w-3.5 h-3.5" />
              Vitamins
              {vitaRoutines.length > 0 && (
                <Badge variant="secondary" className="text-[10px] h-4 px-1.5 ml-0.5">
                  {vitaRoutines.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="discarded" className="flex-1 gap-1.5" data-testid="tab-discarded-products">
              <XCircle className="w-3.5 h-3.5" />
              Discarded
              {discarded.length > 0 && (
                <Badge variant="secondary" className="text-[10px] h-4 px-1.5 ml-0.5">
                  {discarded.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Saved Routines Tab */}
          <TabsContent value="saved" className="mt-4">
            {loading && (
              <div className="flex items-center justify-center py-16" data-testid="routines-loading">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            )}

            {fetchError && (
              <div
                className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive"
                data-testid="routines-error"
              >
                {fetchError}
              </div>
            )}

            {!loading && !fetchError && routines.length === 0 && (
              <div className="text-center py-16" data-testid="routines-empty">
                <BookOpen className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                <h2 className="text-sm font-medium text-foreground mb-1">No saved routines yet</h2>
                <p className="text-xs text-muted-foreground mb-5">
                  Take the quiz and save your personalized skincare routine to see it here.
                </p>
                <Button
                  size="sm"
                  onClick={() => navigate("/")}
                  className="gap-2"
                  data-testid="button-start-quiz-empty"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Take the Quiz
                </Button>
              </div>
            )}

            {!loading && !fetchError && routines.length > 0 && (
              <div className="space-y-3" data-testid="routines-list">
                {routines.map((routine) => (
                  <RoutineCard key={routine.id} routine={routine} onDelete={handleDeleteRoutine} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Saved Vita Routines Tab */}
          <TabsContent value="vita" className="mt-4">
            {vitaLoading && (
              <div className="flex items-center justify-center py-16" data-testid="vita-routines-loading">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            )}

            {vitaError && (
              <div
                className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive"
                data-testid="vita-routines-error"
              >
                {vitaError}
              </div>
            )}

            {!vitaLoading && !vitaError && vitaRoutines.length === 0 && (
              <div className="text-center py-16" data-testid="vita-routines-empty">
                <Pill className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                <h2 className="text-sm font-medium text-foreground mb-1">No saved vitamin routines yet</h2>
                <p className="text-xs text-muted-foreground mb-5">
                  Take the Vita quiz and save your personalized vitamin routine to see it here.
                </p>
                <Button
                  size="sm"
                  onClick={() => navigate("/vita")}
                  className="gap-2"
                  data-testid="button-start-vita-quiz-empty"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Take the Vita Quiz
                </Button>
              </div>
            )}

            {!vitaLoading && !vitaError && vitaRoutines.length > 0 && (
              <div className="space-y-3" data-testid="vita-routines-list">
                {vitaRoutines.map((r) => (
                  <VitaRoutineCard key={r.id} routine={r} onDelete={handleDeleteVita} />
                ))}
              </div>
            )}
          </TabsContent>

          {/* Discarded Products Tab */}
          <TabsContent value="discarded" className="mt-4">
            {discardedLoading && (
              <div className="flex items-center justify-center py-16" data-testid="discarded-loading">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            )}

            {discardedError && (
              <div
                className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive"
                data-testid="discarded-error"
              >
                {discardedError}
              </div>
            )}

            {!discardedLoading && !discardedError && discarded.length === 0 && (
              <div className="text-center py-16" data-testid="discarded-empty">
                <XCircle className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
                <h2 className="text-sm font-medium text-foreground mb-1">No discarded products</h2>
                <p className="text-xs text-muted-foreground mb-5">
                  Products you skip using "Try another" will appear here so you can undo if needed.
                </p>
              </div>
            )}

            {!discardedLoading && !discardedError && discarded.length > 0 && (
              <div className="space-y-3" data-testid="discarded-list">
                <p className="text-xs text-muted-foreground mb-2">
                  Products you've skipped. Tap Undo to restore them to consideration.
                </p>
                {discarded.map((item) => (
                  <DiscardedProductCard key={item.id} item={item} onUndo={handleUndoDiscard} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
