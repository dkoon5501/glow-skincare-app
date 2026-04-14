import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogIn, BookOpen, LogOut, ChevronDown, Star } from "lucide-react";
import { useHashLocation } from "wouter/use-hash-location";

export function Header() {
  const { user, loading, signInWithGoogle, signOut } = useAuth();
  const [, navigate] = useHashLocation();

  const initials = user?.displayName
    ? user.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur-sm"
      data-testid="site-header"
    >
      <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          data-testid="header-logo"
          aria-label="Go to home"
        >
          <svg width="22" height="22" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <circle cx="16" cy="16" r="13.5" stroke="currentColor" strokeWidth="3" className="text-primary" />
            <circle cx="16" cy="16" r="8.5" stroke="currentColor" strokeWidth="2.5" className="text-primary" opacity="0.5" />
            <circle cx="16" cy="16" r="3.5" fill="currentColor" className="text-primary" />
          </svg>
          <span className="text-sm font-semibold tracking-tight">Glow</span>
          <span className="text-xs text-muted-foreground">&</span>
          <span className="text-sm font-semibold tracking-tight">Vita</span>
        </button>

        {/* Right side */}
        {loading ? (
          <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
        ) : user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex items-center gap-2 rounded-full hover:bg-muted/60 px-2 py-1 transition-colors"
                data-testid="header-user-menu-trigger"
                aria-label="User menu"
              >
                <Avatar className="w-7 h-7">
                  <AvatarImage src={user.photoURL ?? undefined} alt={user.displayName ?? "User"} />
                  <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <div className="px-3 py-2">
                <p className="text-xs font-medium text-foreground truncate">
                  {user.displayName ?? user.email ?? "Signed in"}
                </p>
                {user.email && (
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                )}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => navigate("/my-routines")}
                className="gap-2 cursor-pointer"
                data-testid="header-my-routines-link"
              >
                <BookOpen className="w-4 h-4" />
                My Routines
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate("/rate-my-routine")}
                className="gap-2 cursor-pointer"
                data-testid="header-rate-my-routine-link"
              >
                <Star className="w-4 h-4" />
                Rate My Routine
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => signOut()}
                className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                data-testid="header-sign-out"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => signInWithGoogle()}
            className="gap-1.5 text-xs"
            data-testid="header-sign-in"
          >
            <LogIn className="w-3.5 h-3.5" />
            Sign In
          </Button>
        )}
      </div>
    </header>
  );
}
