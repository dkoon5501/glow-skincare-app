import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Sun,
  Moon,
  RotateCcw,
  Info,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  MoonStar,
  ShoppingCart,
  Bookmark,
  BookmarkCheck,
  BookOpen,
  RefreshCw,
  Share2,
  ArrowRight,
  Check,
  Copy,
  ThumbsUp,
  ImageIcon,
} from "lucide-react";
import type { RecommendedRoutine, Product, RoutineStep, QuizAnswers, RoutineItem } from "@/lib/skincare-data";
import { useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ProductImage } from "@/components/product-image";
import { shareResults } from "@/lib/share-utils";
import { SEED_UPVOTES } from "@/lib/seed-upvotes";
import { useAuth } from "@/lib/auth-context";
import { saveRoutine, saveDiscardedProduct, toggleUpvote, getUpvoteCounts, getUserUpvotes } from "@/lib/firestore";
import { useHashLocation } from "wouter/use-hash-location";

interface ResultsProps {
  recommendation: RecommendedRoutine;
  answers: QuizAnswers;
  onRetake: () => void;
  /** When true, this is a shared view — hide save section, show CTA to take own quiz */
  isSharedView?: boolean;
}

const REJECTION_REASONS = [
  "Didn't work for me",
  "Had a bad reaction",
  "Too expensive",
  "Don't like the texture/feel",
  "Already tried it",
] as const;

type RejectionReason = typeof REJECTION_REASONS[number];

interface TryAnotherDialogProps {
  open: boolean;
  onClose: () => void;
  product: Product;
  onSubmit: (reason: RejectionReason, customReason: string) => Promise<void>;
}

function TryAnotherDialog({ open, onClose, product, onSubmit }: TryAnotherDialogProps) {
  const [reason, setReason] = useState<RejectionReason | "">("");
  const [customReason, setCustomReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async () => {
    if (!reason) {
      setError("Please select a reason.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit(reason as RejectionReason, customReason.trim());
      // Reset form
      setReason("");
      setCustomReason("");
      onClose();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }, [reason, customReason, onSubmit, onClose]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setReason("");
      setCustomReason("");
      setError(null);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold">
            Why isn't this product right for you?
          </DialogTitle>
          <p className="text-xs text-muted-foreground mt-1">
            {product.brand} {product.name}
          </p>
        </DialogHeader>

        <div className="py-2">
          <RadioGroup
            value={reason}
            onValueChange={(v) => {
              setReason(v as RejectionReason);
              setError(null);
            }}
            className="space-y-2"
          >
            {REJECTION_REASONS.map((r) => (
              <div key={r} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={r}
                  id={`reason-${r}`}
                  data-testid={`radio-reason-${r.replace(/\s+/g, "-").toLowerCase()}`}
                />
                <Label
                  htmlFor={`reason-${r}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {r}
                </Label>
              </div>
            ))}
          </RadioGroup>

          <div className="mt-4">
            <Label htmlFor="custom-reason" className="text-xs text-muted-foreground mb-1.5 block">
              Other reason (optional)
            </Label>
            <Textarea
              id="custom-reason"
              placeholder="Tell us more..."
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              className="text-sm resize-none h-16"
              data-testid="textarea-custom-reason"
            />
          </div>

          {error && (
            <p className="text-xs text-destructive mt-2" data-testid="rejection-error">
              {error}
            </p>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={submitting}
            data-testid="button-cancel-rejection"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={submitting || !reason}
            data-testid="button-submit-rejection"
          >
            {submitting ? "Submitting…" : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ProductCard({
  step,
  product,
  alternatives,
  index,
  essential,
  onDiscard,
  upvoteCount,
  isUpvoted,
  onUpvote,
  canUpvote,
}: {
  step: RoutineStep;
  product: Product;
  alternatives: Product[];
  index: number;
  essential: boolean;
  onDiscard: (product: Product, reason: RejectionReason, customReason: string) => Promise<void>;
  upvoteCount: number;
  isUpvoted: boolean;
  onUpvote: (productId: string) => void;
  canUpvote: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product>(product);
  const [remainingAlts, setRemainingAlts] = useState<Product[]>(alternatives);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [noMoreAlts, setNoMoreAlts] = useState(false);

  const handleSubmitRejection = useCallback(
    async (reason: RejectionReason, customReason: string) => {
      // Notify parent to save to Firestore
      await onDiscard(currentProduct, reason, customReason);

      // Swap to next alternative
      if (remainingAlts.length > 0) {
        const [next, ...rest] = remainingAlts;
        setCurrentProduct(next);
        setRemainingAlts(rest);
        setExpanded(false);
        setNoMoreAlts(false);
      } else {
        setNoMoreAlts(true);
      }
    },
    [currentProduct, remainingAlts, onDiscard]
  );

  if (noMoreAlts) {
    return (
      <Card className="overflow-hidden border-card-border opacity-60" data-testid={`card-product-${product.id}`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-muted-foreground">{index + 1}</span>
            </div>
            <div className="flex-1">
              <span className="text-xs font-medium text-primary uppercase tracking-wide">{step.label}</span>
              <p className="text-xs text-muted-foreground mt-1">
                No more alternatives available for this step.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="overflow-hidden border-card-border" data-testid={`card-product-${currentProduct.id}`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex flex-col items-center gap-1 shrink-0">
              <ProductImage brand={currentProduct.brand} className="w-10 h-10" />
              <span className="text-[10px] text-muted-foreground">{index + 1}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs font-medium text-primary uppercase tracking-wide">
                  {step.label}
                </span>
                <Badge
                  variant={essential ? "default" : "outline"}
                  className={cn(
                    "text-[10px] px-1.5 py-0",
                    essential
                      ? "bg-primary/15 text-primary border-0 hover:bg-primary/15"
                      : "text-muted-foreground border-muted-foreground/30"
                  )}
                >
                  {essential ? "Essential" : "Recommended"}
                </Badge>
              </div>
              <h3 className="text-sm font-semibold text-foreground">
                {currentProduct.brand} {currentProduct.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>

              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <Badge variant="secondary" className="text-xs" title="Approximate range — check retailer for current price">
                  ~{currentProduct.price}
                </Badge>
                {currentProduct.pmOnly && (
                  <Badge variant="outline" className="text-xs gap-1 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-700">
                    <MoonStar className="w-3 h-3" />
                    PM Only
                  </Badge>
                )}
                <button
                  onClick={() => canUpvote && onUpvote(currentProduct.id)}
                  className={cn(
                    "flex items-center gap-1 text-xs transition-colors",
                    canUpvote ? "hover:text-primary cursor-pointer" : "cursor-default",
                    isUpvoted ? "text-primary font-medium" : "text-muted-foreground"
                  )}
                  title={canUpvote ? (isUpvoted ? "Remove upvote" : "Upvote this product") : "Sign in to upvote"}
                  data-testid={`button-upvote-${currentProduct.id}`}
                >
                  <ThumbsUp className={cn("w-3 h-3", isUpvoted && "fill-primary")} />
                  {upvoteCount > 0 && <span>{upvoteCount}</span>}
                </button>
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="flex items-center gap-1 text-xs text-primary hover:underline"
                  data-testid={`button-expand-${currentProduct.id}`}
                >
                  {expanded ? "Less" : "Why this product"}
                  {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
                <button
                  onClick={() => setDialogOpen(true)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary hover:underline"
                  data-testid={`button-try-another-${currentProduct.id}`}
                >
                  <RefreshCw className="w-3 h-3" />
                  Try another
                </button>
              </div>

              {/* Purchase links — always visible */}
              <div className="flex flex-wrap gap-2 mt-3">
                {currentProduct.amazonUrl && (
                  <a
                    href={currentProduct.amazonUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium bg-primary text-primary-foreground px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity"
                    data-testid={`link-buy-${currentProduct.id}`}
                  >
                    <ShoppingCart className="w-3 h-3" />
                    Buy on Amazon
                  </a>
                )}

              </div>

              {expanded && (
                <div className="mt-3 pt-3 border-t border-card-border space-y-2 animate-in slide-in-from-top-2 duration-200">
                  <p className="text-xs text-foreground leading-relaxed">
                    {currentProduct.whyRecommended}
                  </p>
                  <div>
                    <span className="text-xs font-medium text-muted-foreground">Key Ingredients:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {currentProduct.keyIngredients.map((ingredient) => (
                        <Badge key={ingredient} variant="outline" className="text-xs">
                          {ingredient}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground italic">
                    Source:{" "}
                    {currentProduct.sourceLinks && currentProduct.sourceLinks.length > 0 ? (
                      currentProduct.sourceLinks.map((link, i) => (
                        <span key={link.url}>
                          {i > 0 && ", "}
                          <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            {link.name}
                          </a>
                        </span>
                      ))
                    ) : currentProduct.sourceUrl ? (
                      <a href={currentProduct.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        {currentProduct.source}
                      </a>
                    ) : currentProduct.source}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <TryAnotherDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        product={currentProduct}
        onSubmit={handleSubmitRejection}
      />
    </>
  );
}

function SaveRoutineSection({
  recommendation,
  answers,
}: {
  recommendation: RecommendedRoutine;
  answers: QuizAnswers;
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
      await saveRoutine(user.uid, { answers, recommendation });
      setSaved(true);
    } catch (err) {
      setError("Failed to save routine. Please try again.");
    } finally {
      setSaving(false);
    }
  }, [user, answers, recommendation]);

  const handleGoogleSignIn = useCallback(async () => {
    try {
      await signInWithGoogle();
    } catch {
      setError("Sign-in was cancelled or failed. Please try again.");
    }
  }, [signInWithGoogle]);


  return (
    <Card className="mt-6 border-primary/20" data-testid="card-save-routine">
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Bookmark className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Save Your Routine</h3>
        </div>

        {!user ? (
          <div>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Create a free account to save your personalized skincare routine and access it anytime.
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                variant="outline"
                size="sm"
                onClick={handleGoogleSignIn}
                className="gap-2 flex-1"
                data-testid="button-sign-in-google"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </Button>

            </div>
            {error && (
              <p className="text-xs text-destructive mt-2" data-testid="save-error">
                {error}
              </p>
            )}
          </div>
        ) : saved ? (
          <div className="text-center py-2" data-testid="save-success">
            <div className="flex items-center justify-center gap-2 text-primary mb-3">
              <BookmarkCheck className="w-5 h-5" />
              <span className="text-sm font-medium">Routine saved!</span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              You can view and manage all your saved routines anytime.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/my-routines")}
              className="gap-2"
              data-testid="button-view-routines"
            >
              <BookOpen className="w-3.5 h-3.5" />
              View My Routines
            </Button>
          </div>
        ) : (
          <div>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Signed in as <span className="font-medium text-foreground">{user.displayName ?? user.email}</span>.
              Save this routine to revisit it later.
            </p>
            <div className="flex gap-2 flex-wrap">
              <Button
                size="sm"
                onClick={handleSave}
                disabled={saving}
                className="gap-2"
                data-testid="button-save-routine"
              >
                <Bookmark className="w-3.5 h-3.5" />
                {saving ? "Saving…" : "Save Routine"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/my-routines")}
                className="gap-2"
                data-testid="button-go-to-routines"
              >
                <BookOpen className="w-3.5 h-3.5" />
                My Routines
              </Button>
            </div>
            {error && (
              <p className="text-xs text-destructive mt-2" data-testid="save-error">
                {error}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ShareButton({ answers, skinProfile, recommendation }: { answers: QuizAnswers; skinProfile: { type: string; sensitivity: string; primaryConcern: string; baumannCode: string }; recommendation: RecommendedRoutine }) {
  const [status, setStatus] = useState<"idle" | "copied" | "shared" | "saving" | "saved" | "failed">("idle");

  const handleShareLink = useCallback(async () => {
    const result = await shareResults(answers, skinProfile);
    setStatus(result);
    if (result === "copied") {
      setTimeout(() => setStatus("idle"), 2500);
    }
  }, [answers, skinProfile]);

  const handleShareImage = useCallback(async () => {
    setStatus("saving");
    try {
      const { generateQuizCard, shareCardImage } = await import("@/lib/share-card");
      const blob = await generateQuizCard({
        baumannCode: skinProfile.baumannCode,
        skinType: skinProfile.type,
        sensitivity: skinProfile.sensitivity,
        primaryConcern: skinProfile.primaryConcern,
        amProducts: recommendation.amRoutine.map((r) => ({ name: r.product.name, brand: r.product.brand, category: r.product.category })),
        pmProducts: recommendation.pmRoutine.map((r) => ({ name: r.product.name, brand: r.product.brand, category: r.product.category })),
      });
      const result = await shareCardImage(blob, "My Glow Skincare Routine");
      setStatus(result === "shared" ? "shared" : "saved");
      setTimeout(() => setStatus("idle"), 2500);
    } catch {
      setStatus("failed");
      setTimeout(() => setStatus("idle"), 2500);
    }
  }, [skinProfile, recommendation]);

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleShareLink}
        className="gap-1.5 rounded-full text-xs"
        data-testid="button-share-results"
      >
        {status === "copied" ? (
          <><Check className="w-3.5 h-3.5" /> Copied</>
        ) : (
          <><Share2 className="w-3.5 h-3.5" /> Share Link</>
        )}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleShareImage}
        className="gap-1.5 rounded-full text-xs"
        data-testid="button-share-image"
        disabled={status === "saving"}
      >
        {status === "saving" ? (
          <>Generating...</>
        ) : status === "saved" ? (
          <><Check className="w-3.5 h-3.5" /> Saved</>
        ) : status === "shared" ? (
          <><Check className="w-3.5 h-3.5" /> Shared</>
        ) : (
          <><ImageIcon className="w-3.5 h-3.5" /> Share Card</>
        )}
      </Button>
    </div>
  );
}

export function Results({ recommendation, answers, onRetake, isSharedView }: ResultsProps) {
  const { user } = useAuth();
  const { amRoutine, pmRoutine, skinProfile, tips } = recommendation;

  // Upvote state
  const [upvoteCounts, setUpvoteCounts] = useState<Record<string, number>>({});
  const [userUpvotes, setUserUpvotes] = useState<Set<string>>(new Set());

  // Collect all product IDs from the routine
  const allProductIds = [...amRoutine, ...pmRoutine].map(item => item.product.id);

  // Load upvote counts on mount (merge seed counts with live Firestore counts)
  useEffect(() => {
    getUpvoteCounts(allProductIds).then(liveCounts => {
      const merged: Record<string, number> = {};
      for (const pid of allProductIds) {
        merged[pid] = (SEED_UPVOTES[pid] || 0) + (liveCounts[pid] || 0);
      }
      setUpvoteCounts(merged);
    }).catch(() => {
      // Fallback to seed counts if Firestore fails
      const fallback: Record<string, number> = {};
      for (const pid of allProductIds) {
        fallback[pid] = SEED_UPVOTES[pid] || 0;
      }
      setUpvoteCounts(fallback);
    });
  }, []);

  // Load user's own upvotes when signed in
  useEffect(() => {
    if (user) {
      getUserUpvotes(user.uid).then(setUserUpvotes).catch(() => {});
    } else {
      setUserUpvotes(new Set());
    }
  }, [user]);

  const handleUpvote = useCallback(async (productId: string) => {
    if (!user) return;
    const nowUpvoted = await toggleUpvote(user.uid, productId);
    // Optimistic update
    setUserUpvotes(prev => {
      const next = new Set(prev);
      if (nowUpvoted) next.add(productId); else next.delete(productId);
      return next;
    });
    setUpvoteCounts(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + (nowUpvoted ? 1 : -1)
    }));
  }, [user]);

  const baumannDescriptions: Record<string, string> = {
    D: "Dry",
    O: "Oily",
    S: "Sensitive",
    R: "Resistant",
    P: "Pigmented",
    N: "Non-pigmented",
    W: "Wrinkle-prone",
    T: "Tight"
  };

  const baumannExpanded = skinProfile.baumannCode
    .split("")
    .map(letter => baumannDescriptions[letter] || letter)
    .join(", ");

  const handleDiscard = useCallback(
    async (product: Product, reason: string, customReason: string) => {
      if (!user) return; // silent if not signed in
      await saveDiscardedProduct(user.uid, {
        productId: product.id,
        productName: product.name,
        productBrand: product.brand,
        category: product.category,
        reason,
        customReason: customReason || undefined,
      });
    },
    [user]
  );

  return (
    <div className="min-h-screen pb-12">
      <main className="px-6 max-w-2xl mx-auto w-full pt-4">
        {/* Skin Profile Card */}
        <Card className="mt-4 border-primary/20 bg-primary/3" data-testid="card-skin-profile">
          <CardContent className="p-5">
            <h2 className="text-lg font-semibold text-foreground mb-3">Your Skin Profile</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-xs text-muted-foreground">Skin Type</span>
                <p className="text-sm font-medium text-foreground">{skinProfile.type}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Sensitivity</span>
                <p className="text-sm font-medium text-foreground">{skinProfile.sensitivity}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Primary Concern</span>
                <p className="text-sm font-medium text-foreground">{skinProfile.primaryConcern}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Baumann Type</span>
                <p className="text-sm font-bold text-primary">{skinProfile.baumannCode}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{baumannExpanded}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shared view banner — right after skin profile */}
        {isSharedView && (
          <Card className="mt-4 border-primary/20 bg-primary/3" data-testid="card-shared-banner">
            <CardContent className="p-4 text-center">
              <p className="text-sm text-foreground mb-3">
                This is someone else's personalized routine. Take the quiz to get your own.
              </p>
              <Button
                onClick={onRetake}
                className="gap-2 rounded-full text-sm"
                data-testid="button-take-own-quiz"
              >
                <ArrowRight className="w-4 h-4" />
                Take My Own Quiz
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Routine Tabs */}
        <div className="mt-6" data-testid="routine-tabs">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-foreground">Your Routine</h2>
            <ShareButton answers={answers} skinProfile={skinProfile} recommendation={recommendation} />
          </div>

          <Tabs defaultValue="am">
            <TabsList className="w-full">
              <TabsTrigger value="am" className="flex-1 gap-1.5" data-testid="tab-am">
                <Sun className="w-4 h-4" />
                Morning
              </TabsTrigger>
              <TabsTrigger value="pm" className="flex-1 gap-1.5" data-testid="tab-pm">
                <Moon className="w-4 h-4" />
                Evening
              </TabsTrigger>
            </TabsList>

            <TabsContent value="am" className="mt-4 space-y-3">
              {amRoutine.map((item, i) => (
                <ProductCard
                  key={`am-${item.product.id}-${i}`}
                  step={item.step}
                  product={item.product}
                  alternatives={item.alternatives}
                  index={i}
                  essential={item.essential}
                  onDiscard={handleDiscard}
                  upvoteCount={upvoteCounts[item.product.id] || 0}
                  isUpvoted={userUpvotes.has(item.product.id)}
                  onUpvote={handleUpvote}
                  canUpvote={!!user}
                />
              ))}
            </TabsContent>

            <TabsContent value="pm" className="mt-4 space-y-3">
              {pmRoutine.map((item, i) => (
                <ProductCard
                  key={`pm-${item.product.id}-${i}`}
                  step={item.step}
                  product={item.product}
                  alternatives={item.alternatives}
                  index={i}
                  essential={item.essential}
                  onDiscard={handleDiscard}
                  upvoteCount={upvoteCounts[item.product.id] || 0}
                  isUpvoted={userUpvotes.has(item.product.id)}
                  onUpvote={handleUpvote}
                  canUpvote={!!user}
                />
              ))}
            </TabsContent>
          </Tabs>
        </div>

        {/* Label explanation */}
        <div className="mt-6 flex gap-4 items-start p-4 rounded-xl bg-muted/40 border border-card-border">
          <div className="flex-1">
            <div className="flex items-center gap-1.5 mb-1">
              <Badge variant="default" className="text-[10px] px-1.5 py-0 bg-primary/15 text-primary border-0 hover:bg-primary/15">Essential</Badge>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">Core steps for your skin type. Cleanser, moisturizer, and sunscreen form the foundation of any good routine.</p>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1.5 mb-1">
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 text-muted-foreground border-muted-foreground/30">Recommended</Badge>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">Targeted additions based on your specific concerns. Add these when you're ready, but don't feel pressured to use them all.</p>
          </div>
        </div>

        {/* Save Routine Section — hide on shared views */}
        {!isSharedView && (
          <SaveRoutineSection recommendation={recommendation} answers={answers} />
        )}

        {/* Pro Tips */}
        <Card className="mt-6" data-testid="card-tips">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Expert Tips</h3>
            </div>
            <ul className="space-y-2">
              {tips.map((tip, i) => (
                <li key={i} className="flex gap-2 text-xs text-muted-foreground leading-relaxed">
                  <span className="text-primary font-bold shrink-0">·</span>
                  {tip}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <div className="mt-6 p-4 rounded-xl bg-muted/50 border border-card-border" data-testid="disclaimer">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                These recommendations are based on published dermatological research and the Baumann Skin Type System.
                Product suggestions reflect dermatologist-recommended brands. This is not medical advice. For persistent
                skin conditions, please consult a board-certified dermatologist.
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                <a
                  href="https://pmc.ncbi.nlm.nih.gov/articles/PMC12163966/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline inline-flex items-center gap-0.5"
                >
                  Baumann Skin Type Study
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href="https://www.nm.org/healthbeat/healthy-tips/Top-Skin-Care-Ingredients-Recommended-by-Dermatologists"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline inline-flex items-center gap-0.5"
                >
                  Northwestern Medicine
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Retake & Share */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <Button
            variant="outline"
            onClick={onRetake}
            className="gap-2 rounded-full"
            data-testid="button-retake-bottom"
          >
            <RotateCcw className="w-4 h-4" />
            Retake the Quiz
          </Button>
        </div>

        <p className="mt-10 mb-4 text-center text-[11px] text-muted-foreground/60 leading-relaxed max-w-md mx-auto">
          As an Amazon Associate, we earn from qualifying purchases. Product links may generate a small commission at no extra cost to you.
        </p>
      </main>
    </div>
  );
}
