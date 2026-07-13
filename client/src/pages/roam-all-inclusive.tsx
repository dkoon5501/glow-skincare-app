import { useMemo, useState } from "react";
import { useHashLocation } from "wouter/use-hash-location";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, Play, ExternalLink, MapPin, Users, Heart, Search, Info,
} from "lucide-react";
import { roamResorts, type Resort, type ResortTag } from "@/lib/roam-resorts";
import type { Region } from "@/lib/roam-data";

const PAGE_SIZE = 12;

type WhoFilter = "any" | "adultsOnly" | "family";

const TAG_LABELS: Record<ResortTag, string> = {
  luxury: "Luxury", value: "Value", boutique: "Boutique", overwater: "Overwater",
  beachfront: "Beachfront", golf: "Golf", spa: "Spa", party: "Lively",
  romantic: "Romantic", "swim-up": "Swim-up", adventure: "Adventure",
  diving: "Diving", safari: "Safari", rainforest: "Rainforest",
};

/**
 * ~7% of videos have no maxresdefault; YouTube serves a decodable 120x90 gray
 * placeholder with the 404 so onError never fires. Detect via naturalWidth and
 * swap to hqdefault, which exists for every video. (Same fix as roam-home.)
 */
function swapPlaceholderThumb(e: React.SyntheticEvent<HTMLImageElement>, videoId: string) {
  const img = e.currentTarget;
  if (img.naturalWidth === 120 && !img.dataset.fallback) {
    img.dataset.fallback = "1";
    img.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }
}

function ResortCard({ resort }: { resort: Resort }) {
  const { video } = resort;
  const watchUrl = video ? `https://www.youtube.com/watch?v=${video.videoId}` : null;

  return (
    <div
      className="rounded-xl overflow-hidden border border-card-border bg-card flex flex-col"
      data-testid={`card-resort-${resort.id}`}
    >
      {video ? (
        <a
          href={watchUrl!}
          target="_blank"
          rel="noopener noreferrer"
          className="relative aspect-video bg-muted group block"
          data-testid={`link-tour-${resort.id}`}
        >
          <img
            src={`https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`}
            alt={`${resort.name} resort tour`}
            loading="lazy"
            className="w-full h-full object-cover"
            onLoad={(e) => swapPlaceholderThumb(e, video.videoId)}
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/35 transition-colors flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-sm">
              <Play className="w-5 h-5 text-amber-600 ml-0.5" fill="currentColor" />
            </div>
          </div>
          {/* The tour year is shown, not hidden: a 2019 walkthrough shouldn't pose as current. */}
          <span className="absolute bottom-2 right-2 text-[11px] font-medium text-white bg-black/65 px-2 py-0.5 rounded-full">
            Tour filmed {video.tourYear}
          </span>
        </a>
      ) : (
        <div className="relative aspect-video bg-muted flex items-center justify-center px-4">
          <p className="text-xs text-muted-foreground text-center leading-relaxed">
            No verified property tour found — we'd rather show nothing than the wrong resort.
          </p>
        </div>
      )}

      <div className="p-4 flex flex-col gap-2.5 flex-1">
        <div>
          <h3 className="text-sm font-bold text-foreground leading-snug">{resort.name}</h3>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3 shrink-0" />
            {resort.destination}
          </p>
        </div>

        <div className="flex flex-wrap gap-1">
          {resort.adultsOnly && (
            <Badge variant="outline" className="text-[10px] gap-1 border-amber-300 text-amber-700 dark:border-amber-700 dark:text-amber-300">
              <Heart className="w-2.5 h-2.5" /> Adults only
            </Badge>
          )}
          {resort.familyFriendly && (
            <Badge variant="outline" className="text-[10px] gap-1">
              <Users className="w-2.5 h-2.5" /> Family
            </Badge>
          )}
          {resort.tags.slice(0, 3).map((t) => (
            <Badge key={t} variant="outline" className="text-[10px]">{TAG_LABELS[t] ?? t}</Badge>
          ))}
        </div>

        <ul className="text-xs text-muted-foreground space-y-1 leading-relaxed flex-1">
          {resort.highlights.slice(0, 3).map((h, i) => (
            <li key={i} className="flex gap-1.5">
              <span className="text-amber-500 shrink-0">·</span>
              <span>{h}</span>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 pt-1">
          {video && (
            <span className="text-[11px] text-muted-foreground truncate">
              Tour by {video.channel}
            </span>
          )}
          <a
            href={resort.officialSite}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto text-[11px] font-medium text-amber-700 dark:text-amber-400 hover:underline inline-flex items-center gap-1 shrink-0"
            data-testid={`link-site-${resort.id}`}
          >
            Official site <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default function RoamAllInclusive() {
  const [, navigate] = useHashLocation();
  const [region, setRegion] = useState<Region | "all">("all");
  const [who, setWho] = useState<WhoFilter>("any");
  const [query, setQuery] = useState("");
  const [shown, setShown] = useState(PAGE_SIZE);

  // Only offer regions that actually have resorts — an empty filter chip is a lie.
  const regions = useMemo(() => {
    const counts: Partial<Record<Region, number>> = {};
    for (const r of roamResorts) counts[r.region] = (counts[r.region] ?? 0) + 1;
    return (Object.entries(counts) as [Region, number][]).sort((a, b) => b[1] - a[1]);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return roamResorts.filter((r) => {
      if (region !== "all" && r.region !== region) return false;
      if (who === "adultsOnly" && !r.adultsOnly) return false;
      if (who === "family" && !r.familyFriendly) return false;
      if (q && !(`${r.name} ${r.destination} ${r.brand} ${r.country}`.toLowerCase().includes(q))) return false;
      return true;
    });
  }, [region, who, query]);

  const visible = filtered.slice(0, shown);
  const withVideo = roamResorts.filter((r) => r.video).length;

  const reset = (fn: () => void) => { fn(); setShown(PAGE_SIZE); };

  const chip = (active: boolean) =>
    `px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
      active
        ? "border-amber-400 bg-amber-50 text-amber-800 dark:border-amber-600 dark:bg-amber-950/40 dark:text-amber-200"
        : "border-card-border bg-card text-muted-foreground hover:border-amber-300 dark:hover:border-amber-700"
    }`;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 -ml-2 text-muted-foreground"
          onClick={() => navigate("/roam")}
          data-testid="button-back-roam"
        >
          <ArrowLeft className="w-4 h-4" /> Roam
        </Button>

        <header className="space-y-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 dark:text-amber-300 dark:bg-amber-950/40 dark:border-amber-800 px-3.5 py-1.5 rounded-full">
            All-inclusive
          </span>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Find an all-inclusive resort
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
            {roamResorts.length} genuinely all-inclusive properties — the rate covers your meals and
            drinks. {withVideo} of them link to a real property tour on YouTube, so you can see the
            place before you book it.
          </p>
          <p className="text-xs text-muted-foreground flex items-start gap-1.5 max-w-2xl">
            <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>
              No prices here on purpose. All-inclusive rates swing hard by season, room and package,
              and we won't make numbers up — check the resort's own site for what it costs today.
            </span>
          </p>
        </header>

        <div className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => reset(() => setQuery(e.target.value))}
              placeholder="Search resort, brand, or place…"
              className="w-full pl-9 pr-3 h-10 rounded-xl border border-card-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-amber-400 dark:focus:border-amber-600"
              data-testid="input-search-resorts"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            <button className={chip(region === "all")} onClick={() => reset(() => setRegion("all"))} data-testid="filter-region-all">
              All regions
            </button>
            {regions.map(([r, n]) => (
              <button key={r} className={chip(region === r)} onClick={() => reset(() => setRegion(r))} data-testid={`filter-region-${r}`}>
                {r} <span className="opacity-60">{n}</span>
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {([["any", "Anyone"], ["adultsOnly", "Adults only"], ["family", "Family-friendly"]] as const).map(
              ([v, label]) => (
                <button key={v} className={chip(who === v)} onClick={() => reset(() => setWho(v))} data-testid={`filter-who-${v}`}>
                  {label}
                </button>
              ),
            )}
          </div>
        </div>

        <p className="text-xs text-muted-foreground" data-testid="text-result-count">
          {filtered.length} {filtered.length === 1 ? "resort" : "resorts"}
        </p>

        {filtered.length === 0 ? (
          <div className="p-8 rounded-xl bg-card border border-card-border text-center">
            <p className="text-sm text-muted-foreground">
              Nothing matches that combination. Try a different region or clear the search.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {visible.map((r) => (
                <ResortCard key={r.id} resort={r} />
              ))}
            </div>

            {shown < filtered.length && (
              <div className="flex justify-center pt-2">
                <Button
                  variant="outline"
                  className="rounded-full px-6"
                  onClick={() => setShown((s) => s + PAGE_SIZE)}
                  data-testid="button-show-more"
                >
                  Show more ({filtered.length - shown} left)
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
