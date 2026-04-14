import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Sparkles, Pill } from "lucide-react";

export default function MainLanding() {
  return (
    <div className="min-h-screen bg-background">
      <section className="flex flex-col items-center justify-center px-4 py-16 text-center max-w-3xl mx-auto min-h-[60vh]">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight max-w-2xl mb-4">
          Build Routines Backed by
          <br className="hidden sm:block" /> the Experts Who Know Best
        </h1>

        <p className="text-base md:text-lg text-muted-foreground max-w-xl mb-12 leading-relaxed">
          Personalized skincare and vitamin routines guided by board-certified
          dermatologists and pharmacists. Free, evidence-based, no account required.
        </p>

        <div className="grid sm:grid-cols-2 gap-4 w-full max-w-xl">
          {/* Glow card */}
          <Card className="p-6 text-left hover:border-primary/40 transition-colors cursor-pointer group"
            onClick={() => { window.location.hash = "#/glow"; }}>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-lg font-bold text-foreground">Glow</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Dermatologist-guided skincare routines. 8-question skin quiz, personalized AM &amp; PM products.
            </p>
            <Button
              variant="default"
              className="gap-2 rounded-full text-xs w-full group-hover:opacity-90"
              onClick={(e) => { e.stopPropagation(); window.location.hash = "#/glow"; }}
            >
              Build Skincare Routine <ArrowRight className="w-3.5 h-3.5" />
            </Button>
            <p className="text-[10px] text-muted-foreground mt-2 text-center">
              Also: Rate My Routine &bull; 250+ derm-picked products
            </p>
          </Card>

          {/* Vita card */}
          <Card className="p-6 text-left hover:border-primary/40 transition-colors cursor-pointer group"
            onClick={() => { window.location.hash = "#/vita"; }}>
            <div className="flex items-center gap-2 mb-3">
              <Pill className="w-5 h-5 text-primary" />
              <span className="text-lg font-bold text-foreground">Vita</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Pharmacist-guided vitamin routines. 7-question health assessment, timed supplement schedule.
            </p>
            <Button
              variant="default"
              className="gap-2 rounded-full text-xs w-full group-hover:opacity-90"
              onClick={(e) => { e.stopPropagation(); window.location.hash = "#/vita"; }}
            >
              Build Vitamin Routine <ArrowRight className="w-3.5 h-3.5" />
            </Button>
            <p className="text-[10px] text-muted-foreground mt-2 text-center">
              Fullscript integration coming soon
            </p>
          </Card>
        </div>

        <p className="mt-8 text-xs text-muted-foreground">
          buildmyroutine.app &bull; Free &bull; Evidence-based &bull; No account required
        </p>
      </section>
    </div>
  );
}
