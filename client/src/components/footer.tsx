import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="w-full border-t border-border/50 bg-background/95 mt-auto py-6">
      <div className="max-w-2xl mx-auto px-6 flex flex-col items-center gap-2 text-center">
        <nav className="flex items-center gap-4">
          <Link
            href="/privacy"
            className="text-xs text-muted-foreground hover:text-foreground hover:underline"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="text-xs text-muted-foreground hover:text-foreground hover:underline"
          >
            Terms
          </Link>
        </nav>
        <p className="text-xs text-muted-foreground">
          Questions? Email us at{" "}
          <a
            href="mailto:hello@buildmyroutine.app"
            className="text-primary hover:underline"
          >
            hello@buildmyroutine.app
          </a>
        </p>
        <p className="text-xs text-muted-foreground/80">
          As an Amazon Associate we earn from qualifying purchases.
        </p>
      </div>
    </footer>
  );
}
