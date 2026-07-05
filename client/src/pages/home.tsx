import { useState, useCallback } from "react";
import { QuizFlow } from "@/components/quiz-flow";
import { Results } from "@/components/results";
import { Landing } from "@/components/landing";
import type { QuizAnswers, RecommendedRoutine } from "@/lib/skincare-data";
import { generateRecommendation } from "@/lib/skincare-data";
import { useAuth } from "@/lib/auth-context";
import { getUserDiscardedProducts } from "@/lib/firestore";
import { getLocalDiscards } from "@/lib/discards";

type AppState = "landing" | "quiz" | "results";

export default function Home() {
  const { user } = useAuth();
  const [appState, setAppState] = useState<AppState>("landing");
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [recommendation, setRecommendation] = useState<RecommendedRoutine | null>(null);

  const handleStartQuiz = useCallback(() => {
    setAppState("quiz");
    setAnswers({});
  }, []);

  const handleQuizComplete = useCallback(async (finalAnswers: QuizAnswers) => {
    setAnswers(finalAnswers);
    // Honor past rejections: device-level always, plus account-level when signed in
    const excluded = new Set(getLocalDiscards());
    if (user) {
      try {
        const discarded = await getUserDiscardedProducts(user.uid);
        for (const d of discarded) excluded.add(d.productId);
      } catch {
        // Firestore unavailable — fall back to local list only
      }
    }
    const rec = generateRecommendation(finalAnswers, Array.from(excluded));
    setRecommendation(rec);
    setAppState("results");
  }, [user]);

  const handleRetake = useCallback(() => {
    setAppState("landing");
    setAnswers({});
    setRecommendation(null);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {appState === "landing" && <Landing onStart={handleStartQuiz} />}
      {appState === "quiz" && (
        <QuizFlow onComplete={handleQuizComplete} onBack={() => setAppState("landing")} />
      )}
      {appState === "results" && recommendation && (
        <Results recommendation={recommendation} answers={answers} onRetake={handleRetake} />
      )}
    </div>
  );
}
