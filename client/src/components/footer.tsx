export function Footer() {
  return (
    <footer className="w-full border-t border-border/50 bg-background/95 mt-auto py-6">
      <div className="max-w-2xl mx-auto px-6 flex items-center justify-center">
        <p className="text-xs text-muted-foreground">
          Questions? Email us at{" "}
          <a
            href="mailto:hello@buildmyroutine.app"
            className="text-primary hover:underline"
          >
            hello@buildmyroutine.app
          </a>
        </p>
      </div>
    </footer>
  );
}
