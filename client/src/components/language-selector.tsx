import { useState, useEffect } from "react";
import { Globe, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LANGUAGES, getCurrentLanguage, setLanguage, type LanguageCode } from "@/lib/language";

export function LanguageSelector() {
  const [current, setCurrent] = useState<LanguageCode>("en");

  useEffect(() => {
    setCurrent(getCurrentLanguage());
  }, []);

  const active = LANGUAGES.find((l) => l.code === current) ?? LANGUAGES[0];

  const handleSelect = (code: LanguageCode) => {
    if (code === current) return;
    setLanguage(code); // reloads the page
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="notranslate flex items-center gap-1.5 rounded-full hover:bg-muted/60 px-2 py-1.5 transition-colors text-xs font-medium text-muted-foreground hover:text-foreground"
          data-testid="language-selector-trigger"
          aria-label={`Change language, currently ${active.englishName}`}
          title="Language"
        >
          <Globe className="w-3.5 h-3.5" />
          <span className="hidden sm:inline uppercase text-[10px] font-semibold tracking-wide">
            {active.code === "zh-CN" ? "ZH" : active.code.toUpperCase()}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="notranslate w-48">
        {LANGUAGES.map((lang) => {
          const isActive = lang.code === current;
          return (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className="gap-2 cursor-pointer"
              data-testid={`language-option-${lang.code}`}
            >
              <span className="text-base leading-none">{lang.flag}</span>
              <span className="flex-1 text-sm">{lang.label}</span>
              {isActive && <Check className="w-3.5 h-3.5 text-primary" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
