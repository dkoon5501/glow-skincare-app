import { useMemo } from "react";
import { useParams } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { decodeRoamAnswers } from "@/lib/roam-share";
import { generateRoamResults } from "@/lib/roam-data";
import { RoamResults } from "@/pages/roam-home";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function SharedRoamResults() {
  const params = useParams<{ encoded: string }>();
  const [, navigate] = useHashLocation();

  const { answers, results } = useMemo(() => {
    if (!params.encoded) return { answers: null, results: null };
    const decoded = decodeRoamAnswers(params.encoded);
    if (!decoded) return { answers: null, results: null };
    return { answers: decoded, results: generateRoamResults(decoded) };
  }, [params.encoded]);

  if (!answers || !results || results.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <h2 className="text-lg font-semibold mb-2">Invalid or expired link</h2>
        <p className="text-sm text-muted-foreground mb-6">
          This shared Roam link couldn't be loaded. Take the quiz to get your own travel picks.
        </p>
        <Button
          onClick={() => navigate("/roam")}
          className="gap-2 rounded-full bg-amber-500 hover:bg-amber-600 text-white border-0"
        >
          Take the Travel Quiz
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <RoamResults
      results={results}
      answers={answers}
      onRetake={() => navigate("/roam")}
      isSharedView
    />
  );
}
