import { Button } from "@/components/ui/button";
import { useHashLocation } from "wouter/use-hash-location";

export default function NotFound() {
  const [, navigate] = useHashLocation();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="text-6xl font-bold text-primary/30 mb-4" aria-hidden="true">
          404
        </p>
        <h1 className="text-xl font-semibold text-foreground mb-2">
          We couldn't find that page
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
          The page you're looking for may have moved, or the link may be out of
          date. Let's get you back on track.
        </p>
        <Button onClick={() => navigate("/")} data-testid="not-found-home">
          Take me home
        </Button>
      </div>
    </div>
  );
}
