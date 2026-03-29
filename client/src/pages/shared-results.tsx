import { useMemo } from "react";
import { useParams } from "wouter";
import { decodeAnswers } from "@/lib/share-utils";
import { generateRecommendation } from "@/lib/skincare-data";
import { Results } from "@/components/results";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useHashLocation } from "wouter/use-hash-location";

export default function SharedResults() {
  const params = useParams<{ encoded: string }>();
  const [, navigate] = useHashLocation();

  const { answers, recommendation } = useMemo(() => {
    if (!params.encoded) return { answers: null, recommendation: null };
    const decoded = decodeAnswers(params.encoded);
    if (!decoded) return { answers: null, recommendation: null };
    return { answers: decoded, recommendation: generateRecommendation(decoded) };
  }, [params.encoded]);

  if (!answers || !recommendation) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <h2 className="text-lg font-semibold mb-2">Invalid or expired link</h2>
        <p className="text-sm text-muted-foreground mb-6">
          This shared routine link couldn't be loaded. Take the quiz to get your own personalized routine.
        </p>
        <Button
          onClick={() => navigate("/")}
          className="gap-2 rounded-full"
          data-testid="button-take-quiz-shared"
        >
          Take the Skin Quiz
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Results
        recommendation={recommendation}
        answers={answers}
        onRetake={() => navigate("/")}
        isSharedView
      />
    </div>
  );
}
