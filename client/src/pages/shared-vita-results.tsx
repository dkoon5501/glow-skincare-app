import { useMemo } from "react";
import { useParams } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { decodeVitaAnswers } from "@/lib/vita-share";
import { generateVitaRoutine } from "@/lib/vita-data";
import { VitaResults } from "@/pages/vita-home";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function SharedVitaResults() {
  const params = useParams<{ encoded: string }>();
  const [, navigate] = useHashLocation();

  const { answers, routine } = useMemo(() => {
    if (!params.encoded) return { answers: null, routine: null };
    const decoded = decodeVitaAnswers(params.encoded);
    if (!decoded) return { answers: null, routine: null };
    return { answers: decoded, routine: generateVitaRoutine(decoded) };
  }, [params.encoded]);

  if (!answers || !routine) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <h2 className="text-lg font-semibold mb-2">Invalid or expired link</h2>
        <p className="text-sm text-muted-foreground mb-6">
          This shared Vita routine link couldn't be loaded. Take the quiz to get your own personalized vitamin routine.
        </p>
        <Button
          onClick={() => navigate("/vita")}
          className="gap-2 rounded-full"
          data-testid="button-take-quiz-shared-vita"
        >
          Take the Vitamin Quiz
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <VitaResults
      routine={routine}
      answers={answers}
      onRetake={() => navigate("/vita")}
      isSharedView
    />
  );
}
