import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { getUserRoutines, type SavedRoutine } from "@/lib/firestore";
import { productDatabase, type Product } from "@/lib/skincare-data";
import { evaluateRoutine, type UserProduct, type RoutineEvaluation, type ProductRating } from "@/lib/routine-evaluator";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LogIn,
  Plus,
  Trash2,
  ShoppingCart,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  ArrowLeft,
  Star,
} from "lucide-react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";

const CATEGORIES: { value: Product["category"]; label: string }[] = [
  { value: "cleanser", label: "Cleanser" },
  { value: "toner", label: "Toner" },
  { value: "serum", label: "Serum" },
  { value: "moisturizer", label: "Moisturizer" },
  { value: "sunscreen", label: "Sunscreen" },
  { value: "treatment", label: "Treatment" },
  { value: "exfoliant", label: "Exfoliant" },
];

const TIME_OPTIONS = [
  { value: "AM", label: "AM (Morning)" },
  { value: "PM", label: "PM (Evening)" },
  { value: "BOTH", label: "Both AM & PM" },
];

// Get unique brands from database for autocomplete
const KNOWN_BRANDS = [...new Set(productDatabase.map((p) => p.brand))].sort();

interface ProductEntry {
  id: number;
  category: Product["category"] | "";
  brand: string;
  name: string;
  keyIngredients: string;
  timeOfDay: "AM" | "PM" | "BOTH" | "";
}

function emptyEntry(id: number): ProductEntry {
  return { id, category: "", brand: "", name: "", keyIngredients: "", timeOfDay: "" };
}

// ── Score ring component ──
function ScoreRing({ score, size = 120 }: { score: number; size?: number }) {
  const strokeWidth = size > 80 ? 8 : 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 10) * circumference;
  const color =
    score >= 8 ? "#0d9488" : score >= 6 ? "#0d9488" : score >= 4 ? "#d97706" : "#dc2626";

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/20"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.8s ease-out" }}
        />
      </svg>
      <span
        className="absolute font-bold"
        style={{ fontSize: size > 80 ? "1.5rem" : "1rem", color }}
      >
        {score}
      </span>
    </div>
  );
}

// ── Verdict badge ──
function VerdictBadge({ verdict }: { verdict: ProductRating["verdict"] }) {
  const styles = {
    great: "bg-primary/10 text-primary border-primary/20",
    good: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950 dark:text-teal-300 dark:border-teal-800",
    fair: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
    poor: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
  };
  const labels = { great: "Great Fit", good: "Good Fit", fair: "Fair", poor: "Poor Match" };
  return (
    <Badge variant="outline" className={`text-xs ${styles[verdict]}`}>
      {labels[verdict]}
    </Badge>
  );
}

export default function RateMyRoutine() {
  const { user, loading: authLoading } = useAuth();
  const [routines, setRoutines] = useState<SavedRoutine[]>([]);
  const [loadingRoutines, setLoadingRoutines] = useState(false);
  const [selectedRoutineId, setSelectedRoutineId] = useState<string | null>(null);
  const [products, setProducts] = useState<ProductEntry[]>([emptyEntry(1)]);
  const [evaluation, setEvaluation] = useState<RoutineEvaluation | null>(null);
  const [step, setStep] = useState<"pickSkin" | "input" | "results">("pickSkin");
  const [brandSuggestions, setBrandSuggestions] = useState<string[]>([]);
  const [activeBrandField, setActiveBrandField] = useState<number | null>(null);
  const [nextId, setNextId] = useState(2);

  // Load routines when user is available
  useEffect(() => {
    if (!user) return;
    setLoadingRoutines(true);
    getUserRoutines(user.uid)
      .then((r) => {
        setRoutines(r);
        if (r.length === 1) {
          setSelectedRoutineId(r[0].id);
          setStep("input");
        }
      })
      .finally(() => setLoadingRoutines(false));
  }, [user]);

  const selectedRoutine = routines.find((r) => r.id === selectedRoutineId);

  function handleSignIn() {
    signInWithPopup(auth, new GoogleAuthProvider());
  }

  function selectSkinType(id: string) {
    setSelectedRoutineId(id);
    setStep("input");
  }

  function addProduct() {
    if (products.length >= 10) return;
    setProducts([...products, emptyEntry(nextId)]);
    setNextId(nextId + 1);
  }

  function removeProduct(id: number) {
    if (products.length <= 1) return;
    setProducts(products.filter((p) => p.id !== id));
  }

  function updateProduct(id: number, field: keyof ProductEntry, value: string) {
    setProducts(
      products.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
    if (field === "brand") {
      if (value.length >= 1) {
        const matches = KNOWN_BRANDS.filter((b) => b.toLowerCase().includes(value.toLowerCase()));
        setBrandSuggestions(matches.slice(0, 5));
        setActiveBrandField(id);
      } else {
        setBrandSuggestions([]);
        setActiveBrandField(null);
      }
    }
  }

  function selectBrandSuggestion(id: number, brand: string) {
    updateProduct(id, "brand", brand);
    setBrandSuggestions([]);
    setActiveBrandField(null);
  }

  function isFormValid(): boolean {
    return products.every(
      (p) => p.category && p.brand.trim() && p.name.trim() && p.timeOfDay
    );
  }

  function handleEvaluate() {
    if (!selectedRoutine || !isFormValid()) return;

    const userProducts: UserProduct[] = products.map((p) => ({
      category: p.category as Product["category"],
      brand: p.brand.trim(),
      name: p.name.trim(),
      keyIngredients: p.keyIngredients
        .split(",")
        .map((i) => i.trim())
        .filter(Boolean),
      timeOfDay: p.timeOfDay as "AM" | "PM" | "BOTH",
    }));

    const result = evaluateRoutine(
      userProducts,
      selectedRoutine.skinProfile.baumannCode,
      selectedRoutine.skinProfile.primaryConcern
    );
    setEvaluation(result);
    setStep("results");
  }

  function handleReset() {
    setEvaluation(null);
    setProducts([emptyEntry(1)]);
    setNextId(2);
    setStep("input");
  }

  // ── Auth gate ──
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground text-sm">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-sm w-full p-8 text-center space-y-4">
          <LogIn className="w-10 h-10 text-primary mx-auto" />
          <h1 className="text-xl font-bold text-foreground">Sign In Required</h1>
          <p className="text-sm text-muted-foreground">
            Rate My Routine requires a saved skin profile. Sign in to get started.
          </p>
          <Button onClick={handleSignIn} className="w-full">
            Sign in with Google
          </Button>
        </Card>
      </div>
    );
  }

  if (loadingRoutines) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground text-sm">Loading your skin profiles...</div>
      </div>
    );
  }

  if (routines.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-sm w-full p-8 text-center space-y-4">
          <Star className="w-10 h-10 text-primary mx-auto" />
          <h1 className="text-xl font-bold text-foreground">Take the Quiz First</h1>
          <p className="text-sm text-muted-foreground">
            We need your skin type to rate your routine. Take the 2-minute quiz to get your Baumann Skin Type.
          </p>
          <Button onClick={() => (window.location.hash = "#/")} className="w-full">
            Take the Skin Quiz
          </Button>
        </Card>
      </div>
    );
  }

  // ── Results view ──
  if (step === "results" && evaluation && selectedRoutine) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" /> Rate another routine
          </button>

          {/* Overall score */}
          <Card className="p-6 text-center">
            <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">
              Overall Routine Score
            </p>
            <div className="flex justify-center mb-3">
              <ScoreRing score={evaluation.overallScore} size={130} />
            </div>
            <p className="text-sm text-muted-foreground">
              {evaluation.overallScore >= 8
                ? "Your routine is a great match for your skin type."
                : evaluation.overallScore >= 6
                ? "Solid routine with room for a few improvements."
                : evaluation.overallScore >= 4
                ? "Some products could be better matched to your skin."
                : "Your routine needs significant adjustments for your skin type."}
            </p>
            <Badge variant="outline" className="mt-2 text-xs">
              {selectedRoutine.skinProfile.baumannCode} Skin Type
            </Badge>
          </Card>

          {/* Per-product ratings */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-foreground">Product Ratings</h2>
            {evaluation.ratings.map((rating, i) => (
              <Card key={i} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {rating.userProduct.brand} {rating.userProduct.name}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {rating.userProduct.category} · {rating.userProduct.timeOfDay}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <ScoreRing score={rating.score} size={44} />
                    <VerdictBadge verdict={rating.verdict} />
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {rating.explanation}
                </p>

                {rating.suggestion && (
                  <div className="bg-primary/5 border border-primary/10 rounded-lg p-3 space-y-2">
                    <p className="text-xs font-medium text-primary flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Better match for your skin
                    </p>
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">
                          {rating.suggestion.product.brand}{" "}
                          {rating.suggestion.product.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {rating.suggestion.product.price}
                        </p>
                      </div>
                      {rating.suggestion.product.amazonUrl && (
                        <a
                          href={rating.suggestion.product.amazonUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-medium bg-primary text-primary-foreground px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity shrink-0"
                        >
                          <ShoppingCart className="w-3 h-3" />
                          Amazon
                        </a>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {rating.suggestion.reason}
                    </p>
                  </div>
                )}
              </Card>
            ))}
          </div>

          {/* Missing steps */}
          {evaluation.missingSteps.length > 0 && (
            <Card className="p-4 space-y-2">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Missing Steps
              </h2>
              <ul className="space-y-1.5">
                {evaluation.missingSteps.map((step, i) => (
                  <li key={i} className="text-xs text-muted-foreground leading-relaxed">
                    · {step}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Tips */}
          {evaluation.tips.length > 0 && (
            <Card className="p-4 space-y-2">
              <h2 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-primary" />
                Tips for Your Skin Type
              </h2>
              <ul className="space-y-1.5">
                {evaluation.tips.map((tip, i) => (
                  <li key={i} className="text-xs text-muted-foreground leading-relaxed">
                    · {tip}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* CTAs */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleReset}
            >
              Rate Another Routine
            </Button>
            <Button
              className="flex-1"
              onClick={() => (window.location.hash = "#/")}
            >
              Build My Routine
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── Skin type picker ──
  if (step === "pickSkin" && routines.length > 1) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
          <div>
            <h1 className="text-xl font-bold text-foreground">Rate My Routine</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Which skin profile should we use to evaluate your routine?
            </p>
          </div>
          <div className="space-y-2">
            {routines.map((r) => (
              <Card
                key={r.id}
                className="p-4 cursor-pointer hover:border-primary/40 transition-colors"
                onClick={() => selectSkinType(r.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {r.skinProfile.baumannCode} — {r.skinProfile.type}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {r.skinProfile.sensitivity} · {r.skinProfile.primaryConcern}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {r.createdAt?.toDate?.()?.toLocaleDateString() || "Recent"}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Product input form ──
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">Rate My Routine</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Enter the products you currently use and we'll evaluate how well they match your{" "}
            <span className="font-medium text-foreground">
              {selectedRoutine?.skinProfile.baumannCode}
            </span>{" "}
            skin type.
          </p>
        </div>

        <div className="space-y-4">
          {products.map((entry, idx) => (
            <Card key={entry.id} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Product {idx + 1}
                </p>
                {products.length > 1 && (
                  <button
                    onClick={() => removeProduct(entry.id)}
                    className="text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Select
                  value={entry.category}
                  onValueChange={(v) => updateProduct(entry.id, "category", v)}
                >
                  <SelectTrigger className="text-xs">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={entry.timeOfDay}
                  onValueChange={(v) => updateProduct(entry.id, "timeOfDay", v)}
                >
                  <SelectTrigger className="text-xs">
                    <SelectValue placeholder="When used" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_OPTIONS.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="relative">
                <Input
                  placeholder="Brand (e.g. CeraVe)"
                  value={entry.brand}
                  onChange={(e) => updateProduct(entry.id, "brand", e.target.value)}
                  onFocus={() => {
                    if (entry.brand.length >= 1) {
                      const matches = KNOWN_BRANDS.filter((b) =>
                        b.toLowerCase().includes(entry.brand.toLowerCase())
                      );
                      setBrandSuggestions(matches.slice(0, 5));
                      setActiveBrandField(entry.id);
                    }
                  }}
                  onBlur={() => setTimeout(() => setActiveBrandField(null), 200)}
                  className="text-sm"
                />
                {activeBrandField === entry.id && brandSuggestions.length > 0 && (
                  <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-card border border-card-border rounded-lg shadow-lg overflow-hidden">
                    {brandSuggestions.map((b) => (
                      <button
                        key={b}
                        onMouseDown={() => selectBrandSuggestion(entry.id, b)}
                        className="block w-full text-left text-sm px-3 py-2 hover:bg-muted/50 transition-colors"
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Input
                placeholder="Product name (e.g. Hydrating Facial Cleanser)"
                value={entry.name}
                onChange={(e) => updateProduct(entry.id, "name", e.target.value)}
                className="text-sm"
              />

              <Input
                placeholder="Key ingredients (optional, comma-separated)"
                value={entry.keyIngredients}
                onChange={(e) =>
                  updateProduct(entry.id, "keyIngredients", e.target.value)
                }
                className="text-sm"
              />
            </Card>
          ))}
        </div>

        {products.length < 10 && (
          <button
            onClick={addProduct}
            className="flex items-center gap-1.5 text-xs text-primary hover:underline"
          >
            <Plus className="w-3.5 h-3.5" /> Add another product
          </button>
        )}

        <Button
          onClick={handleEvaluate}
          disabled={!isFormValid()}
          className="w-full"
          size="lg"
        >
          Rate My Routine
        </Button>
      </div>
    </div>
  );
}
