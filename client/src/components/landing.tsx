import { Button } from "@/components/ui/button";
import { Sparkles, Shield, Beaker, ArrowRight } from "lucide-react";

interface LandingProps {
  onStart: () => void;
}

export function Landing({ onStart }: LandingProps) {
  return (
    <div className="flex flex-col items-center min-h-screen">
      {/* Hero */}
      <header className="w-full pt-8 pb-4 px-6 flex justify-center">
        <div className="flex items-center gap-2">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none" aria-label="Glow logo">
            <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1.5" className="text-primary" />
            <circle cx="16" cy="16" r="8" stroke="currentColor" strokeWidth="1.5" className="text-primary" opacity="0.6" />
            <circle cx="16" cy="16" r="3" fill="currentColor" className="text-primary" />
          </svg>
          <span className="text-lg font-semibold tracking-tight" data-testid="text-logo">Glow</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-16 max-w-2xl mx-auto text-center">
        <div className="mb-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/8 border border-primary/15 px-3 py-1 rounded-full" data-testid="badge-evidence">
            <Shield className="w-3 h-3" />
            Evidence-Based
          </span>
        </div>

        <h1 className="text-xl font-bold tracking-tight mb-3 text-foreground leading-tight" data-testid="text-hero-title">
          Your Personalized Skincare Routine
        </h1>

        <p className="text-muted-foreground text-base max-w-md mb-8 leading-relaxed">
          Answer a few science-backed questions and get a dermatologist-informed routine with specific product recommendations tailored to your skin.
        </p>

        <Button
          size="lg"
          onClick={onStart}
          className="gap-2 px-8 rounded-full text-sm font-medium h-11"
          data-testid="button-start-quiz"
        >
          Take the Skin Quiz
          <ArrowRight className="w-4 h-4" />
        </Button>

        {/* Evidence pills */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-lg">
          <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-card-border">
            <Beaker className="w-5 h-5 text-primary" />
            <span className="text-xs font-medium">Baumann Skin Typing</span>
            <span className="text-xs text-muted-foreground text-center leading-relaxed">
              Based on the 16-type classification used by dermatologists worldwide
            </span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-card-border">
            <Shield className="w-5 h-5 text-primary" />
            <span className="text-xs font-medium">Derm-Recommended</span>
            <span className="text-xs text-muted-foreground text-center leading-relaxed">
              Products recommended by board-certified dermatologists
            </span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card border border-card-border">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-xs font-medium">Personalized</span>
            <span className="text-xs text-muted-foreground text-center leading-relaxed">
              Custom AM & PM routines matched to your exact skin profile
            </span>
          </div>
        </div>

        <p className="mt-8 text-xs text-muted-foreground max-w-sm">
          This tool provides educational recommendations, not medical advice. Consult a dermatologist for specific skin conditions.
        </p>
      </main>
    </div>
  );
}
