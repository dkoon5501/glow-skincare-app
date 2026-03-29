import { cn } from "@/lib/utils";

// Brand colors for product thumbnails
const BRAND_COLORS: Record<string, string> = {
  "CeraVe": "#1a5276",
  "La Roche-Posay": "#004c8c",
  "The Ordinary": "#2c2c2c",
  "Paula's Choice": "#5b2c6f",
  "Neutrogena": "#e67e22",
  "EltaMD": "#1e8449",
  "ISDIN": "#2471a3",
  "Differin": "#6c3483",
  "Cetaphil": "#148f77",
  "SkinCeuticals": "#1c2833",
  "Vanicream": "#5dade2",
  "Maelove": "#e74c3c",
  "COSRX": "#2c3e50",
  "TruSkin": "#27ae60",
  "Timeless": "#8e44ad",
  "Naturium": "#b7950b",
  "Glow Recipe": "#e8838a",
  "Drunk Elephant": "#e67e22",
  "NeoStrata": "#1a5276",
  "Glytone": "#2e86c1",
  "The Inkey List": "#17a589",
  "Anua": "#45b39d",
  "Medik8": "#c0392b",
  "First Aid Beauty": "#d35400",
  "RoC": "#1f618d",
  "L'Oreal": "#2c3e50",
  "Kiehl's": "#1c2833",
  "Supergoop!": "#d4ac0d",
  "DRMTLGY": "#2e4053",
  "Colorescience": "#7d3c98",
  "Beauty of Joseon": "#c5a36a",
  "Eucerin": "#2874a6",
  "Aestura": "#48c9b0",
  "CELIMAX": "#1abc9c",
  "Abib": "#5d6d7e",
  "InstaNatural": "#28b463",
};

function getBrandInitials(brand: string): string {
  const map: Record<string, string> = {
    "La Roche-Posay": "LRP",
    "The Ordinary": "TO",
    "The Inkey List": "TIL",
    "Paula's Choice": "PC",
    "First Aid Beauty": "FAB",
    "Beauty of Joseon": "BOJ",
    "Glow Recipe": "GR",
    "Drunk Elephant": "DE",
    "Supergoop!": "SG",
  };
  if (map[brand]) return map[brand];
  const words = brand.replace(/[''!]/g, "").split(/\s+/);
  if (words.length === 1) return brand.slice(0, 2).toUpperCase();
  return words.map(w => w[0]).join("").slice(0, 3).toUpperCase();
}

interface ProductImageProps {
  brand: string;
  className?: string;
}

export function ProductImage({ brand, className }: ProductImageProps) {
  const color = BRAND_COLORS[brand] || "#6b7280";
  const initials = getBrandInitials(brand);

  return (
    <div
      className={cn(
        "rounded-lg flex items-center justify-center shrink-0 select-none",
        className
      )}
      style={{ backgroundColor: color }}
      data-testid={`img-product-${brand.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <span className="font-semibold text-white leading-none" style={{ fontSize: "0.6rem" }}>
        {initials}
      </span>
    </div>
  );
}
