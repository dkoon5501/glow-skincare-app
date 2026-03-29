import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { getUserRoutines, deleteRoutine, type SavedRoutine } from "@/lib/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  ExternalLink,
} from "lucide-react";
import { useHashLocation } from "wouter/use-hash-location";
import { PerplexityAttribution } from "@/components/PerplexityAttribution";
import type { Timestamp } from "firebase/firestore";

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
      {items.map((item, i) => (
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
              {item.product.amazonUrl && (
                <a
                  href={item.product.amazonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[10px] text-primary hover:underline"
                >
                  <ShoppingCart className="w-2.5 h-2.5" />
                  Amazon
                </a>
              )}
              {item.product.manufacturerUrl && (
                <a
                  href={item.product.manufacturerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground hover:underline"
                >
                  <ExternalLink className="w-2.5 h-2.5" />
                  {item.product.brand}
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
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

export default function MyRoutines() {
  const { user, loading: authLoading } = useAuth();
  const [, navigate] = useHashLocation();
  const [routines, setRoutines] = useState<SavedRoutine[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

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

  const handleDelete = useCallback((id: string) => {
    setRoutines((prev) => prev.filter((r) => r.id !== id));
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

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-16" data-testid="routines-loading">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        )}

        {/* Error state */}
        {fetchError && (
          <div
            className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive"
            data-testid="routines-error"
          >
            {fetchError}
          </div>
        )}

        {/* Empty state */}
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

        {/* Routines list */}
        {!loading && !fetchError && routines.length > 0 && (
          <div className="space-y-3" data-testid="routines-list">
            {routines.map((routine) => (
              <RoutineCard key={routine.id} routine={routine} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </main>
      <PerplexityAttribution />
    </div>
  );
}
