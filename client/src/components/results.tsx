import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sun, Moon, RotateCcw, Info, Lightbulb, ChevronDown, ChevronUp, ExternalLink, MoonStar, ShoppingCart } from "lucide-react";
import type { RecommendedRoutine, Product, RoutineStep } from "@/lib/skincare-data";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ResultsProps {
  recommendation: RecommendedRoutine;
  onRetake: () => void;
}

function ProductCard({ step, product, index }: { step: RoutineStep; product: Product; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="overflow-hidden border-card-border" data-testid={`card-product-${product.id}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-primary">{index + 1}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs font-medium text-primary uppercase tracking-wide">
                {step.label}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-foreground">
              {product.brand} {product.name}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>

            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <Badge variant="secondary" className="text-xs">
                {product.price}
              </Badge>
              {product.pmOnly && (
                <Badge variant="outline" className="text-xs gap-1 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-700">
                  <MoonStar className="w-3 h-3" />
                  PM Only
                </Badge>
              )}
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-1 text-xs text-primary hover:underline"
                data-testid={`button-expand-${product.id}`}
              >
                {expanded ? "Less" : "Why this product"}
                {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>

            {expanded && (
              <div className="mt-3 pt-3 border-t border-card-border space-y-2 animate-in slide-in-from-top-2 duration-200">
                <p className="text-xs text-foreground leading-relaxed">
                  {product.whyRecommended}
                </p>
                <div>
                  <span className="text-xs font-medium text-muted-foreground">Key Ingredients:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {product.keyIngredients.map((ingredient) => (
                      <Badge key={ingredient} variant="outline" className="text-xs">
                        {ingredient}
                      </Badge>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground italic">
                  Source:{" "}
                  {product.sourceUrl ? (
                    <a href={product.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      {product.source}
                    </a>
                  ) : product.source}
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {product.amazonUrl && (
                    <a
                      href={product.amazonUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium bg-primary text-primary-foreground px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity"
                      data-testid={`link-buy-${product.id}`}
                    >
                      <ShoppingCart className="w-3 h-3" />
                      Buy on Amazon
                    </a>
                  )}
                  {product.manufacturerUrl && (
                    <a
                      href={product.manufacturerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium border border-card-border px-3 py-1.5 rounded-lg hover:bg-muted/50 transition-colors"
                      data-testid={`link-manufacturer-${product.id}`}
                    >
                      <ExternalLink className="w-3 h-3" />
                      {product.brand} Website
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function Results({ recommendation, onRetake }: ResultsProps) {
  const { amRoutine, pmRoutine, skinProfile, tips } = recommendation;

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

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <header className="px-6 pt-6 pb-2 flex items-center justify-between max-w-2xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none" aria-label="Glow logo">
            <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1.5" className="text-primary" />
            <circle cx="16" cy="16" r="8" stroke="currentColor" strokeWidth="1.5" className="text-primary" opacity="0.6" />
            <circle cx="16" cy="16" r="3" fill="currentColor" className="text-primary" />
          </svg>
          <span className="text-base font-semibold tracking-tight">Glow</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRetake}
          className="gap-1.5 text-xs"
          data-testid="button-retake"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Retake Quiz
        </Button>
      </header>

      <main className="px-6 max-w-2xl mx-auto w-full">
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

        {/* Routine Tabs */}
        <div className="mt-6" data-testid="routine-tabs">
          <h2 className="text-lg font-semibold text-foreground mb-3">Your Routine</h2>

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
                <ProductCard key={`am-${item.product.id}-${i}`} step={item.step} product={item.product} index={i} />
              ))}
            </TabsContent>

            <TabsContent value="pm" className="mt-4 space-y-3">
              {pmRoutine.map((item, i) => (
                <ProductCard key={`pm-${item.product.id}-${i}`} step={item.step} product={item.product} index={i} />
              ))}
            </TabsContent>
          </Tabs>
        </div>

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

        {/* Retake */}
        <div className="mt-8 text-center">
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
      </main>
    </div>
  );
}
