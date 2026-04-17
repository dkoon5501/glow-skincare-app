/**
 * ExpertSourcesPanel
 *
 * Collapsible "Expert sources" panel for the Vita supplement card.
 * Renders 1-3 expert attributions with key quote, affiliation, and linked source.
 *
 * Data: client/src/lib/expert-index.json (built by scripts/build-expert-index.ts).
 */

import { useState } from "react";
import { BookOpen, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  getExpertSourcesFor,
  formatExpertLine,
  formatRecommendationType,
  type ExpertSourceItem,
} from "@/lib/expert-sources";

interface Props {
  /** Supplement category or nutrient tag, e.g. "vitamin_d", "omega_3". */
  nutrient: string;
  /** Max items to display. Defaults to 3. */
  limit?: number;
}

export function ExpertSourcesPanel({ nutrient, limit = 3 }: Props) {
  const [open, setOpen] = useState(false);
  const items = getExpertSourcesFor(nutrient, limit);

  if (items.length === 0) return null;

  return (
    <div className="mt-2 pt-2 border-t border-border">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-xs text-primary hover:underline"
        aria-expanded={open}
      >
        <BookOpen className="w-3 h-3" />
        {open
          ? "Hide expert sources"
          : `See expert sources (${items.length})`}
        {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>

      {open && (
        <ul className="mt-3 space-y-3">
          {items.map((item, idx) => (
            <ExpertSourceRow key={`${item.expertName}-${idx}`} item={item} />
          ))}
        </ul>
      )}
    </div>
  );
}

function ExpertSourceRow({ item }: { item: ExpertSourceItem }) {
  const stanceTone =
    item.stanceLabel === "warns_against" || item.stanceLabel === "skeptical"
      ? "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-900"
      : item.stanceLabel === "neutral" || item.stanceLabel === "neutral_to_skeptical"
      ? "bg-muted text-muted-foreground border-border"
      : "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950 dark:text-teal-300 dark:border-teal-900";

  const authorityTone =
    item.evidenceLevel === "high"
      ? "bg-primary/10 text-primary border-primary/20"
      : "bg-muted/50 text-muted-foreground border-border";

  return (
    <li className="rounded-lg border border-border bg-background/50 p-3">
      <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
        <Badge variant="outline" className={`text-[10px] ${authorityTone}`}>
          {item.evidenceLevel === "high" ? "High authority" : item.evidenceLevel === "medium" ? "Reputable" : "General"}
        </Badge>
        <Badge variant="outline" className={`text-[10px] ${stanceTone}`}>
          {formatRecommendationType(item.recommendationType)}
        </Badge>
      </div>

      <p className="text-xs font-medium text-foreground">{formatExpertLine(item)}</p>

      {item.keyQuote && (
        <blockquote className="mt-1.5 text-xs text-muted-foreground italic leading-relaxed border-l-2 border-border pl-2">
          "{item.keyQuote}"
        </blockquote>
      )}

      <a
        href={item.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-flex items-center gap-1 text-[11px] text-primary hover:underline"
      >
        <ExternalLink className="w-2.5 h-2.5" />
        {item.publisher ? `${item.publisher} — ` : ""}{item.sourceTitle}
      </a>
    </li>
  );
}
