import { useState, useCallback } from "react";
import { QuizFlow } from "@/components/quiz-flow";
import { Results } from "@/components/results";
import { Landing } from "@/components/landing";
import type { QuizAnswers, RecommendedRoutine } from "@/lib/skincare-data";
import { generateRecommendation } from "@/lib/skincare-data";

type AppState = "landing" | "quiz" | "results";

export default function Home() {
  const [appState, setAppState] = useState<AppState>("landing");
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [recommendation, setRecommendation] = useState<RecommendedRoutine | null>(null);

  const handleStartQuiz = useCallback(() => {
    setAppState("quiz");
    setAnswers({});
  }, []);

  const handleQuizComplete = useCallback((finalAnswers: QuizAnswers) => {
    setAnswers(finalAnswers);
    const rec = generateRecommendation(finalAnswers);
    setRecommendation(rec);
    setAppState("results");
  }, []);

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
