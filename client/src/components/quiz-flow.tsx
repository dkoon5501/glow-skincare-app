import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { quizQuestions, type QuizAnswers } from "@/lib/skincare-data";
import { cn } from "@/lib/utils";

interface QuizFlowProps {
  onComplete: (answers: QuizAnswers) => void;
  onBack: () => void;
}

export function QuizFlow({ onComplete, onBack }: QuizFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});

  const question = quizQuestions[currentStep];
  const totalSteps = quizQuestions.length;
  const progress = ((currentStep) / totalSteps) * 100;

  const currentAnswer = answers[question.id];
  const isMultiSelect = question.multiSelect;

  const handleSelect = useCallback((optionId: string) => {
    if (isMultiSelect) {
      const current = (answers[question.id] as string[]) || [];
      // Handle "none" option
      if (optionId === "sc_none") {
        setAnswers(prev => ({ ...prev, [question.id]: [optionId] }));
      } else {
        const filtered = current.filter(id => id !== "sc_none");
        const newSelection = filtered.includes(optionId)
          ? filtered.filter(id => id !== optionId)
          : [...filtered, optionId];
        setAnswers(prev => ({ ...prev, [question.id]: newSelection }));
      }
    } else {
      setAnswers(prev => ({ ...prev, [question.id]: optionId }));
      // Auto-advance on single select
      if (currentStep < totalSteps - 1) {
        setTimeout(() => setCurrentStep(s => s + 1), 250);
      }
    }
  }, [isMultiSelect, answers, question.id, currentStep, totalSteps]);

  const handleNext = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(s => s + 1);
    } else {
      onComplete(answers);
    }
  }, [currentStep, totalSteps, answers, onComplete]);

  const handlePrev = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(s => s - 1);
    } else {
      onBack();
    }
  }, [currentStep, onBack]);

  const isSelected = (optionId: string) => {
    if (isMultiSelect) {
      return ((currentAnswer as string[]) || []).includes(optionId);
    }
    return currentAnswer === optionId;
  };

  const canProceed = isMultiSelect
    ? true // Multi-select is always optional
    : !!currentAnswer;

  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar */}
      <header className="px-6 pt-6 pb-2 flex items-center justify-between max-w-2xl mx-auto w-full">
        <button
          onClick={handlePrev}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          data-testid="button-quiz-back"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <span className="text-xs text-muted-foreground font-medium" data-testid="text-step-counter">
          {currentStep + 1} of {totalSteps}
        </span>
      </header>

      {/* Progress */}
      <div className="px-6 max-w-2xl mx-auto w-full">
        <Progress value={progress} className="h-1.5 mt-2" />
      </div>

      {/* Question */}
      <main className="flex-1 flex flex-col items-center px-6 pt-8 pb-6 max-w-2xl mx-auto w-full">
        <div className="w-full">
          <h2 className="text-lg font-semibold mb-1 text-foreground" data-testid="text-question">
            {question.question}
          </h2>
          {question.subtitle && (
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              {question.subtitle}
            </p>
          )}

          {/* Options */}
          <div className="grid gap-3" data-testid="quiz-options">
            {question.options.map((option) => {
              const selected = isSelected(option.id);
              return (
                <button
                  key={option.id}
                  onClick={() => handleSelect(option.id)}
                  className={cn(
                    "relative w-full text-left p-4 rounded-xl border transition-all duration-150",
                    "hover:border-primary/40 hover:bg-primary/3",
                    selected
                      ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                      : "border-card-border bg-card"
                  )}
                  data-testid={`option-${option.id}`}
                >
                  <div className="flex items-start gap-3">
                    {option.icon && (
                      <span className="text-lg leading-none mt-0.5 shrink-0">{option.icon}</span>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "text-sm font-medium",
                          selected ? "text-primary" : "text-foreground"
                        )}>
                          {option.label}
                        </span>
                        {selected && (
                          <Check className="w-4 h-4 text-primary shrink-0" />
                        )}
                      </div>
                      {option.description && (
                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                          {option.description}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </main>

      {/* Bottom nav for multi-select or last step */}
      {(isMultiSelect || isLastStep) && (
        <div className="px-6 pb-8 max-w-2xl mx-auto w-full">
          <Button
            onClick={handleNext}
            disabled={!canProceed && !isMultiSelect}
            className="w-full rounded-xl h-11 gap-2 text-sm font-medium"
            data-testid="button-quiz-next"
          >
            {isLastStep ? "Get My Routine" : "Continue"}
            {isLastStep ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </Button>
        </div>
      )}
    </div>
  );
}
