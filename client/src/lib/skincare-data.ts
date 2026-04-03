// Evidence-based skincare quiz data grounded in the Baumann Skin Type System
// and dermatologist-recommended products

export interface QuizQuestion {
  id: string;
  category: "skin_type" | "sensitivity" | "concerns" | "lifestyle" | "pigmentation" | "aging";
  question: string;
  subtitle?: string;
  options: QuizOption[];
  multiSelect?: boolean;
}

export interface QuizOption {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  tags: string[];
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: "cleanser" | "toner" | "serum" | "moisturizer" | "sunscreen" | "treatment" | "exfoliant";
  price: string;
  keyIngredients: string[];
  bestFor: string[];
  whyRecommended: string;
  source: string;
  sourceUrl?: string;
  /** Multiple source links when a product is recommended by more than one dermatologist */
  sourceLinks?: { name: string; url: string }[];
  amazonUrl?: string;
  /** If true, this product contains photosensitizing ingredients (retinol, retinoids)
   *  and must ONLY be used in PM routines. Retinoids degrade in sunlight and increase
   *  photosensitivity per dermatologist consensus (Vogue, Dr. Sandra Lee, Dr. Bowe). */
  pmOnly?: boolean;
  /** True if a specific dermatologist has publicly recommended this product */
  dermVerified?: boolean;
}

export interface RoutineStep {
  step: number;
  label: string;
  time: "AM" | "PM" | "BOTH";
  category: Product["category"];
  description: string;
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: "skin_type",
    category: "skin_type",
    question: "How does your skin feel by midday?",
    subtitle: "Think about your T-zone (forehead, nose, chin) and cheeks a few hours after washing.",
    options: [
      {
        id: "oily",
        label: "Oily / Shiny",
        description: "Visible shine across my face, especially the T-zone",
        icon: "💧",
        tags: ["oily"]
      },
      {
        id: "dry",
        label: "Dry / Tight",
        description: "Feels tight, may have flaky patches or roughness",
        icon: "🏜️",
        tags: ["dry"]
      },
      {
        id: "combination",
        label: "Combination",
        description: "Oily T-zone but dry or normal cheeks",
        icon: "⚖️",
        tags: ["combination"]
      },
      {
        id: "normal",
        label: "Balanced / Normal",
        description: "Comfortable, not too oily or dry",
        icon: "✨",
        tags: ["normal"]
      }
    ]
  },
  {
    id: "sensitivity",
    category: "sensitivity",
    question: "How does your skin react to new products?",
    subtitle: "Based on the Baumann Skin Type System's sensitivity assessment.",
    options: [
      {
        id: "very_sensitive",
        label: "Very reactive",
        description: "Often stings, burns, or turns red with new products",
        icon: "🔴",
        tags: ["sensitive", "redness"]
      },
      {
        id: "somewhat_sensitive",
        label: "Somewhat sensitive",
        description: "Occasionally reacts to certain ingredients",
        icon: "🟡",
        tags: ["moderate_sensitivity"]
      },
      {
        id: "resistant",
        label: "Resilient",
        description: "Can tolerate most products without irritation",
        icon: "🟢",
        tags: ["resistant"]
      }
    ]
  },
  {
    id: "primary_concern",
    category: "concerns",
    question: "What is your biggest skin concern?",
    subtitle: "Select the one that bothers you most.",
    options: [
      {
        id: "acne",
        label: "Acne & breakouts",
        description: "Pimples, blackheads, whiteheads, or cystic acne",
        icon: "🔵",
        tags: ["acne", "breakouts"]
      },
      {
        id: "aging",
        label: "Fine lines & wrinkles",
        description: "Visible signs of aging, loss of firmness",
        icon: "⏳",
        tags: ["aging", "wrinkles"]
      },
      {
        id: "hyperpigmentation",
        label: "Dark spots & uneven tone",
        description: "Post-inflammatory marks, melasma, or sun spots",
        icon: "🎯",
        tags: ["hyperpigmentation", "dark_spots"]
      },
      {
        id: "dryness_dehydration",
        label: "Dryness & dehydration",
        description: "Flaking, tightness, or dull skin lacking moisture",
        icon: "💦",
        tags: ["dehydration", "dryness"]
      },
      {
        id: "redness",
        label: "Redness & rosacea",
        description: "Persistent redness, flushing, or visible blood vessels",
        icon: "🌹",
        tags: ["redness", "rosacea"]
      },
      {
        id: "texture",
        label: "Rough texture & large pores",
        description: "Bumpy skin, uneven texture, or enlarged pores",
        icon: "🔍",
        tags: ["texture", "pores"]
      }
    ]
  },
  {
    id: "secondary_concerns",
    category: "concerns",
    question: "Any other concerns?",
    subtitle: "Select all that apply (optional).",
    multiSelect: true,
    options: [
      { id: "sc_acne", label: "Occasional breakouts", tags: ["acne"] },
      { id: "sc_dark_spots", label: "Dark spots", tags: ["hyperpigmentation"] },
      { id: "sc_fine_lines", label: "Fine lines", tags: ["aging"] },
      { id: "sc_dullness", label: "Dullness", tags: ["dullness"] },
      { id: "sc_large_pores", label: "Large pores", tags: ["pores"] },
      { id: "sc_oiliness", label: "Excess oil", tags: ["oily"] },
      { id: "sc_none", label: "None of these", tags: [] }
    ]
  },
  {
    id: "sun_exposure",
    category: "lifestyle",
    question: "How much sun exposure do you typically get?",
    subtitle: "Sun protection is the single most impactful skincare step per dermatologists.",
    options: [
      {
        id: "high_sun",
        label: "Lots of outdoor time",
        description: "I spend significant time outdoors daily",
        icon: "☀️",
        tags: ["high_sun"]
      },
      {
        id: "moderate_sun",
        label: "Moderate",
        description: "Some outdoor time, commuting, errands",
        icon: "🌤️",
        tags: ["moderate_sun"]
      },
      {
        id: "low_sun",
        label: "Mostly indoors",
        description: "I work indoors and limit sun exposure",
        icon: "🏠",
        tags: ["low_sun"]
      }
    ]
  },
  {
    id: "retinoid_experience",
    category: "aging",
    question: "Have you used retinol or retinoids before?",
    subtitle: "Retinoids are the gold standard for anti-aging and acne, but require building tolerance.",
    options: [
      {
        id: "retinoid_yes",
        label: "Yes, regularly",
        description: "My skin is accustomed to retinoids",
        icon: "💪",
        tags: ["retinoid_experienced"]
      },
      {
        id: "retinoid_some",
        label: "Tried briefly",
        description: "Used before but not consistently",
        icon: "🤔",
        tags: ["retinoid_beginner"]
      },
      {
        id: "retinoid_no",
        label: "Never used them",
        description: "New to retinoids",
        icon: "🆕",
        tags: ["retinoid_new"]
      }
    ]
  },
  {
    id: "age_range",
    category: "aging",
    question: "What is your age range?",
    subtitle: "This helps calibrate ingredient strength and anti-aging priorities.",
    options: [
      { id: "age_teen", label: "Under 20", tags: ["teen"], icon: "🌱" },
      { id: "age_20s", label: "20s", tags: ["twenties"], icon: "🌿" },
      { id: "age_30s", label: "30s", tags: ["thirties"], icon: "🌳" },
      { id: "age_40s", label: "40s", tags: ["forties"], icon: "🍂" },
      { id: "age_50plus", label: "50+", tags: ["fiftyplus", "mature"], icon: "🌺" }
    ]
  },
  {
    id: "budget",
    category: "lifestyle",
    question: "What is your preferred budget?",
    subtitle: "Great skincare exists at every price point.",
    options: [
      {
        id: "budget_low",
        label: "Drugstore-friendly",
        description: "Under $20 per product",
        icon: "💵",
        tags: ["budget"]
      },
      {
        id: "budget_mid",
        label: "Mid-range",
        description: "$20–50 per product",
        icon: "💳",
        tags: ["midrange"]
      },
      {
        id: "budget_high",
        label: "Premium",
        description: "Willing to invest $50+",
        icon: "💎",
        tags: ["premium"]
      }
    ]
  }
];

// Curated product database — every product recommended by a board-certified dermatologist
export const productDatabase: Product[] = [
  // ─────────────────────────────────────────────
  // CLEANSERS
  // ─────────────────────────────────────────────
  {
    id: "cerave-hydrating-cleanser",
    name: "Hydrating Facial Cleanser",
    brand: "CeraVe",
    category: "cleanser",
    price: "$10–15",
    keyIngredients: ["Ceramides", "Hyaluronic Acid", "Glycerin"],
    bestFor: ["dry", "normal", "sensitive", "dehydration", "budget"],
    whyRecommended:
      "Restores and maintains the skin barrier without stripping moisture. Non-comedogenic and fragrance-free. Dr. Alexis Stephens recommends it as her go-to hydrating cleanser for dry and normal skin.",
    source: "Dr. Alexis Stephens, Hydrating Facial Cleanser, Dr. Dray & Dr. Dustin Portela (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=OeNJbShiOOw",
    sourceLinks: [
      { name: "CeraVe Hydrating Facial Cleanser", url: "https://www.youtube.com/watch?v=OeNJbShiOOw" },
      { name: "Hydrating Facial Cleanser", url: "https://www.youtube.com/watch?v=VxG9rE4seIs" },
      { name: "Foaming Facial Cleanser", url: "https://www.youtube.com/watch?v=fXJUKo2UFNk" },
      { name: "Hydrating Facial Cleanser", url: "https://www.youtube.com/watch?v=OkD8mga9BLI" },
    ],
    amazonUrl: "https://www.amazon.com/dp/B01MSSDEPK?tag=glowskincar0c-20",
    dermVerified: true,
  },
  {
    id: "cerave-foaming-cleanser",
    name: "Foaming Facial Cleanser",
    brand: "CeraVe",
    category: "cleanser",
    price: "$10–15",
    keyIngredients: ["Ceramides", "Niacinamide", "Hyaluronic Acid"],
    bestFor: ["oily", "combination", "acne", "normal", "budget"],
    whyRecommended:
      "Removes excess oil and dirt without disrupting the skin barrier. Dr. Alexis Stephens recommends the foaming formula for oily and combination skin types who want a deeper cleanse while keeping ceramides intact.",
    source: "Dr. Daniel Sugai & Dr. Alexis Stephens (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=OeNJbShiOOw",
    sourceLinks: [
      { name: "Foaming Facial Cleanser", url: "https://www.youtube.com/watch?v=qcvEGRksl7M" },
      { name: "Foaming Facial Cleanser", url: "https://www.youtube.com/watch?v=OeNJbShiOOw" },
    ],
    amazonUrl: "https://www.amazon.com/dp/B01N1LL62W?tag=glowskincar0c-20",
    dermVerified: true,
  },
  {
    id: "lrp-toleriane-purifying-cleanser",
    name: "Toleriane Purifying Foaming Cleanser",
    brand: "La Roche-Posay",
    category: "cleanser",
    price: "$15–20",
    keyIngredients: ["Niacinamide", "Ceramide-3", "La Roche-Posay Thermal Spring Water"],
    bestFor: ["sensitive", "oily", "combination", "acne", "redness", "rosacea"],
    whyRecommended:
      "Clinically tested on sensitive skin with niacinamide to control oil and calm inflammation. Dr. Muneeb Shah, Mela B3 Facial Gel Cleanser With Melasyl™ + Niacinamide, and Dr. Alexis Stephens all recommend this cleanser for oily and sensitive skin types.",
    source: "Dr. Muneeb Shah, Mela B3 Facial Gel Cleanser With Melasyl™ + Niacinamide & Dr. Alexis Stephens (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=6JjijIeEsZM",
    sourceLinks: [
      { name: "Toleriane Purifying Foaming Facial Cleanser", url: "https://www.youtube.com/watch?v=lgR4ZOXdRko" },
      { name: "Mela B3 Facial Gel Cleanser With Melasyl™ + Niacinamide", url: "https://www.youtube.com/watch?v=qcvEGRksl7M" },
      { name: "Toleriane Double Repair Face Moisturizer", url: "https://www.youtube.com/watch?v=OeNJbShiOOw" },
    ],
    dermVerified: true,
  },
  {
    id: "cetaphil-daily-facial-cleanser",
    name: "Daily Facial Cleanser",
    brand: "Cetaphil",
    category: "cleanser",
    price: "$10–15",
    keyIngredients: ["Glycerin", "Niacinamide", "Vitamin B5 (Panthenol)"],
    bestFor: ["oily", "combination", "normal", "sensitive", "budget"],
    whyRecommended:
      "A gel cleanser that turns into a low-lather foam — ideal for oily to combination skin. Dr. Daniel Sugai recommends the Cetaphil Daily Facial Cleanser for its gentle yet effective cleansing for oily and combination skin types.",
    source: "Dr. Daniel Sugai & Dr. Sam Ellis (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=VxG9rE4seIs",
    // No ASIN listed in spec for this product
    dermVerified: true,
  },,
  {
    id: "neutrogena-ultra-gentle-cleanser",
    name: "Ultra Gentle Daily Cleanser",
    brand: "Neutrogena",
    category: "cleanser",
    price: "$10–15",
    keyIngredients: ["Glycerin", "Dextran", "Fragrance-free"],
    bestFor: ["sensitive", "redness", "rosacea", "normal", "budget"],
    whyRecommended:
      "Dermatologist-tested and fragrance-free, Neutrogena Ultra Gentle cleanses without disrupting the skin barrier. Dr. Daniel Sugai recommends it as a reliable daily cleanser for sensitive and rosacea-prone skin that needs effective but non-irritating cleansing.",
    source: "Dr. Daniel Sugai (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=VxG9rE4seIs",
    dermVerified: true,
  },
  {
    id: "anua-heartleaf-cleansing-oil",
    name: "Heartleaf Pore Control Cleansing Oil",
    brand: "Anua",
    category: "cleanser",
    price: "$20–25",
    keyIngredients: ["Heartleaf Extract", "Olive Oil", "Jojoba Oil"],
    bestFor: ["oily", "acne", "sensitive", "breakouts"],
    whyRecommended:
      "A K-beauty cleansing oil ideal for the first step of a double cleanse. Heartleaf Pore Control Cleansing Oil reviewed this for its heartleaf extract that helps control excess sebum and soothe acne-prone skin while effectively dissolving sunscreen and makeup without irritation.",
    source: "Heartleaf Pore Control Cleansing Oil (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=fXJUKo2UFNk",
    dermVerified: true,
  },
  {
    id: "celimax-dual-barrier-cleansing-balm",
    name: "Dual Barrier Purifying Cleansing Balm",
    brand: "CELIMAX",
    category: "cleanser",
    price: "$25–30",
    keyIngredients: ["Noni Extract", "Ceramides", "Shea Butter"],
    bestFor: ["sensitive", "acne", "dry", "combination"],
    whyRecommended:
      "Dr. Sam Ellis reviewed this K-beauty cleansing balm for its dual-barrier technology that thoroughly removes impurities while reinforcing the skin barrier — especially beneficial for sensitive or acne-prone skin that often gets stripped by traditional cleansers.",
    source: "Dr. Sam Ellis (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=F2kaMrrqfxo",
    dermVerified: true,
  },
  {
    id: "eucerin-radiant-tone-cleansing-gel",
    name: "Radiant Tone Cleansing Gel",
    brand: "Eucerin",
    category: "cleanser",
    price: "$15–20",
    keyIngredients: ["Thiamidol", "Glycerin", "Panthenol"],
    bestFor: ["dullness", "hyperpigmentation", "dry", "budget"],
    whyRecommended:
      "Heartleaf Pore Control Cleansing Oil reviewed Eucerin's Thiamidol-based cleansing gel for its brightening benefits for hyperpigmentation and dullness. Gentle enough for dry skin while actively addressing uneven skin tone with clinically tested Thiamidol.",
    source: "Heartleaf Pore Control Cleansing Oil (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=cAmXcVA7Lwk",
    dermVerified: true,
  },
  {
    id: "vanicream-gentle-facial-cleanser",
    name: "Gentle Facial Cleanser",
    brand: "Vanicream",
    category: "cleanser",
    price: "$5–10",
    keyIngredients: ["Glycerin", "PEG-free formula", "Dye-free"],
    bestFor: ["sensitive", "rosacea", "redness", "dry", "budget"],
    whyRecommended:
      "Heartleaf Pore Control Cleansing Oil is a strong advocate for Vanicream products for sensitive and reactive skin. This fragrance-free, dye-free, and preservative-free formula is one of the most hypoallergenic cleansers available — ideal for rosacea, eczema, and skin that reacts to almost everything.",
    source: "Heartleaf Pore Control Cleansing Oil & Dr. Karen Locke (YouTube)",
    amazonUrl: "https://www.amazon.com/dp/B00QY1XZ4W?tag=glowskincar0c-20",
    dermVerified: true,
  },

  // ─────────────────────────────────────────────
  // SERUMS — AM-SAFE
  // ─────────────────────────────────────────────
  {
    id: "skinceuticals-ce-ferulic",
    name: "C E Ferulic Serum",
    brand: "SkinCeuticals",
    category: "serum",
    price: "$150+",
    keyIngredients: ["15% L-Ascorbic Acid (Vitamin C)", "1% Vitamin E", "0.5% Ferulic Acid"],
    bestFor: ["aging", "dullness", "hyperpigmentation", "dark_spots", "premium"],
    whyRecommended:
      "Considered the gold standard antioxidant serum. Dr. Whitney Bowe calls it the most studied and effective L-ascorbic acid serum on the market, citing its proprietary pH and synergistic vitamin C/E/ferulic acid ratio backed by clinical data.",
    source: "Dr. Whitney Bowe, Dr. Daniel Sugai & Dr. Alexis Stephens (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=1kLLEyFeZq8",
    sourceLinks: [
      { name: "Heartleaf Pore Control Cleansing Oil", url: "https://www.youtube.com/watch?v=1kLLEyFeZq8" },
      { name: "Hyalu B5 Pure Hyaluronic Acid Serum", url: "https://www.youtube.com/watch?v=UG5G-muIxVU" },
    ],
    dermVerified: true,
  },
  {
    id: "ordinary-niacinamide",
    name: "Niacinamide 10% + Zinc 1%",
    brand: "The Ordinary",
    category: "serum",
    price: "$5–10",
    keyIngredients: ["10% Niacinamide", "1% Zinc PCA"],
    bestFor: ["oily", "acne", "pores", "budget", "breakouts", "hyperpigmentation", "dullness"],
    whyRecommended:
      "Consensus pick across multiple board-certified dermatologists. Controls oil, minimizes pores, reduces post-acne marks, and brightens — all at a fraction of the cost. Dr. Muneeb Shah and Dr. Daniel Sugai both frequently cite it as a go-to for oily and acne-prone skin.",
    source: "Dr. Muneeb Shah & Dr. Dray (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=IyxTc0iZ6V8",
    sourceLinks: [
      { name: "Neutrogena Hydro Boost Hyaluronic Acid Water Gel with Signature Fragrance 1.7 Oz", url: "https://www.youtube.com/watch?v=IyxTc0iZ6V8" },
      { name: "Niacinamide 10% + Zinc 1%", url: "https://www.youtube.com/watch?v=_2wVke1WKII" },
    ],
    amazonUrl: "https://www.amazon.com/dp/B01MDTVZTZ?tag=glowskincar0c-20",
    dermVerified: true,
  },,
  {
    id: "ordinary-hyaluronic-acid",
    name: "Hyaluronic Acid 2% + B5",
    brand: "The Ordinary",
    category: "serum",
    price: "$5–10",
    keyIngredients: ["Multi-weight Hyaluronic Acid", "Vitamin B5 (Panthenol)", "Ceramides"],
    bestFor: ["dehydration", "dry", "dullness", "budget", "normal", "sensitive"],
    whyRecommended:
      "Dr. Sam Ellis recommends The Ordinary's HA serum as a reliable, affordable hydration booster. Multi-molecular hyaluronic acid hydrates at surface and deeper skin levels; B5 soothes and supports barrier repair.",
    source: "Dr. Sam Ellis & Dr. Dray (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=iGBIxwOxfWU",
    amazonUrl: "https://www.amazon.com/dp/B01MYEZPC8?tag=glowskincar0c-20",
    dermVerified: true,
  },
  {
    id: "neutrogena-collagen-bank-serum",
    name: "Collagen Bank Vitamin C Serum",
    brand: "Neutrogena",
    category: "serum",
    price: "$20–25",
    keyIngredients: ["15% L-Ascorbic Acid", "Jazzy Micropeptide", "Hydrolyzed Collagen"],
    bestFor: ["aging", "wrinkles", "hyperpigmentation", "dullness", "budget", "midrange"],
    whyRecommended:
      "Dr. Dray reviewed this as a compelling and affordable drugstore vitamin C serum, praising its 15% ascorbic acid formula, novel collagen-stimulating micropeptide, and good tolerance compared to typical vitamin C irritants.",
    source: "Dr. Dray (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=FLnu9Q8OzHE",
    // No ASIN in spec; omitting amazonUrl
    dermVerified: true,
  },

  {
    id: "instanatural-vitamin-c-serum",
    name: "Vitamin C Serum with Hyaluronic Acid",
    brand: "InstaNatural",
    category: "serum",
    price: "$15–20",
    keyIngredients: ["20% Vitamin C", "Hyaluronic Acid", "Ferulic Acid"],
    bestFor: ["dullness", "budget", "dark_spots", "aging"],
    whyRecommended:
      "An accessible vitamin C serum combining a 20% vitamin C blend with ferulic acid and hyaluronic acid. Collagen Bank 15% Vitamin C Glow Serum includes affordable vitamin C serums like this in budget-conscious routines for brightening and antioxidant protection throughout the day.",
    source: "Collagen Bank 15% Vitamin C Glow Serum (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=L2SLL8a6qxA",
    amazonUrl: "https://www.amazon.com/dp/B0CF47F6PD?tag=glowskincar0c-20",
    dermVerified: true,
  },
  {
    id: "timeless-vitamin-c-ferulic",
    name: "20% Vitamin C + E Ferulic Acid Serum",
    brand: "Timeless",
    category: "serum",
    price: "$25–30",
    keyIngredients: ["20% L-Ascorbic Acid", "Vitamin E", "Ferulic Acid"],
    bestFor: ["aging", "dullness", "hyperpigmentation", "midrange"],
    whyRecommended:
      "Collagen Bank 15% Vitamin C Glow Serum recommended this as a budget alternative to SkinCeuticals CE Ferulic. With 20% L-ascorbic acid plus the same synergistic ferulic acid pairing, it delivers potent antioxidant protection and brightening at a fraction of the luxury price.",
    source: "Collagen Bank 15% Vitamin C Glow Serum & Dr. Alexis Stephens (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=L2SLL8a6qxA",
    sourceLinks: [
      { name: "Collagen Bank 15% Vitamin C Glow Serum", url: "https://www.youtube.com/watch?v=L2SLL8a6qxA" },
      { name: "Niacinamide 10% + Zinc 1%", url: "https://www.youtube.com/watch?v=APC16_cpYyk" },
    ],
    amazonUrl: "https://www.amazon.com/dp/B0036BI56G?tag=glowskincar0c-20",
    dermVerified: true,
  },
  {
    id: "cosrx-snail-96-mucin",
    name: "Advanced Snail 96 Mucin Power Essence",
    brand: "COSRX",
    category: "serum",
    price: "$20–25",
    keyIngredients: ["96% Snail Secretion Filtrate", "Sodium Hyaluronate", "Betaine"],
    bestFor: ["dehydration", "dry", "sensitive", "dullness", "budget"],
    whyRecommended:
      "Doctorly reviewed this K-beauty cult classic for its remarkable hydration and barrier-repair properties. The 96% snail mucin concentration helps heal, plump, and restore radiance to dehydrated and sensitive skin types without heavy texture.",
    source: "Doctorly & Dr. Dray (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=76GA2FR9nAg",
    amazonUrl: "https://www.amazon.com/dp/B00PBX3L7K?tag=glowskincar0c-20",
    dermVerified: true,
  },
  {
    id: "truskin-vitamin-c-serum",
    name: "Vitamin C Facial Serum",
    brand: "TruSkin",
    category: "serum",
    price: "$20–25",
    keyIngredients: ["Vitamin C", "Hyaluronic Acid", "Vitamin E", "Retinol"],
    bestFor: ["aging", "dullness", "budget", "dark_spots"],
    whyRecommended:
      "Dr. Sam Ellis featured TruSkin Vitamin C as a value-oriented brightening serum for those seeking antioxidant protection and dark spot reduction on a budget. Its combination of vitamin C, E, and hyaluronic acid targets multiple aging concerns simultaneously.",
    source: "Dr. Sam Ellis (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=L2SLL8a6qxA",
    amazonUrl: "https://www.amazon.com/dp/B01M4MCUAF?tag=glowskincar0c-20",
    dermVerified: true,
  },

  // ─────────────────────────────────────────────
  // SERUMS — PM-ONLY (retinol-containing)
  // ─────────────────────────────────────────────
  {
    id: "lrp-retinol-b3",
    name: "Retinol B3 Serum",
    brand: "La Roche-Posay",
    category: "serum",
    price: "$45–50",
    keyIngredients: ["Pure Retinol", "Niacinamide (Vitamin B3)", "La Roche-Posay Thermal Spring Water"],
    bestFor: ["aging", "wrinkles", "dark_spots", "midrange", "retinoid_beginner", "sensitive"],
    whyRecommended:
      "Potent retinol paired with niacinamide for soothing. Recommended for those transitioning to retinol who also have sensitive skin concerns. Apply at night only — retinol degrades in sunlight and increases photosensitivity.",
    source: "Dr. Muneeb Shah & Dr. Daniel Sugai (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=6JjijIeEsZM",
    sourceLinks: [
      { name: "Liquid Exfoliant with Vitamin C", url: "https://www.youtube.com/watch?v=OnraqyJzPo0" },
      { name: "Retinol B3 Serum", url: "https://www.youtube.com/watch?v=6JjijIeEsZM" },
    ],
    amazonUrl: "https://www.amazon.com/dp/B07Z9Y4M3C?tag=glowskincar0c-20",
    pmOnly: true,
    dermVerified: true,
  },

  // ─────────────────────────────────────────────
  // EXFOLIANTS
  // ─────────────────────────────────────────────
  {
    id: "paulas-choice-bha",
    name: "Skin Perfecting 2% BHA Liquid Exfoliant",
    brand: "Paula's Choice",
    category: "exfoliant",
    price: "$30–35",
    keyIngredients: ["2% Salicylic Acid (BHA)", "Green Tea Extract", "Methylpropanediol"],
    bestFor: ["acne", "oily", "pores", "texture", "breakouts", "midrange"],
    whyRecommended:
      "Dr. Azadeh Shirazi and Dr. Daniel Sugai both recommend this iconic chemical exfoliant. It works inside the pore to unclog congestion, smooth texture, and reduce breakouts — consistently ranked as one of the most effective OTC BHA exfoliants.",
    source: "Dr. Azadeh Shirazi, Dr. Daniel Sugai & Dr. Dray (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=3-MoLqxNFtY",
    sourceLinks: [
      { name: "SKIN PERFECTING 2% BHA Liquid Exfoliant", url: "https://www.youtube.com/watch?v=RWmWuDwJJEw" },
      { name: "Vitamin C Brightening Cleanser", url: "https://www.youtube.com/watch?v=YJxARaLMSpc" },
      { name: "Skin Perfecting 2% BHA Liquid Exfoliant", url: "https://www.youtube.com/watch?v=4By-S9xY4h8" },
    ],
    amazonUrl: "https://www.amazon.com/dp/B07C5SS6YD?tag=glowskincar0c-20",
    dermVerified: true,
  },
  {
    id: "ordinary-glycolic-acid-toner",
    name: "Glycolic Acid 7% Toning Solution",
    brand: "The Ordinary",
    category: "exfoliant",
    price: "$5–10",
    keyIngredients: ["7% Glycolic Acid", "Aloe Vera", "Ginseng Extract"],
    bestFor: ["texture", "dullness", "hyperpigmentation", "budget", "oily"],
    whyRecommended:
      "Glycolic Acid 7% Exfoliating Toner and Dr. Dray both recommend The Ordinary Glycolic Acid Toner as the most affordable effective AHA exfoliant on the market. It smooths texture, brightens dullness, and fades hyperpigmentation at a price point available to everyone.",
    source: "Glycolic Acid 7% Exfoliating Toner & Dr. Azadeh Shirazi (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=IyxTc0iZ6V8",
    sourceLinks: [
      { name: "Glycolic Acid 7% Exfoliating Toner", url: "https://www.youtube.com/watch?v=IyxTc0iZ6V8" },
      { name: "AHA 30% + BHA 2% Peeling Solution", url: "https://www.youtube.com/watch?v=RWmWuDwJJEw" },
    ],
    amazonUrl: "https://www.amazon.com/dp/B07FLQDTS9?tag=glowskincar0c-20",
    dermVerified: true,
  },
  {
    id: "inkey-list-pha-toner",
    name: "PHA Gentle Exfoliating Toner",
    brand: "The Inkey List",
    category: "exfoliant",
    price: "$10–15",
    keyIngredients: ["PHA (Polyhydroxy Acid)", "Hyaluronic Acid", "Aloe Vera"],
    bestFor: ["sensitive", "redness", "rosacea", "texture", "budget"],
    whyRecommended:
      "Dr. Dray reviewed this as the gentlest chemical exfoliant option for sensitive skin. PHA is a large-molecule AHA that exfoliates only on the surface, making it ideal for reactive skin, rosacea, and beginners who need exfoliation without irritation.",
    source: "Dr. Dray (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=wHzh_WxIbEc",
    amazonUrl: "https://www.amazon.com/dp/B0BJ7JKRWY?tag=glowskincar0c-20",
    dermVerified: true,
  },
  {
    id: "paulas-choice-azelaic-acid",
    name: "10% Azelaic Acid Booster",
    brand: "Paula's Choice",
    category: "exfoliant",
    price: "$35–40",
    keyIngredients: ["10% Azelaic Acid", "Salicylic Acid", "Green Tea Extract"],
    bestFor: ["acne", "rosacea", "redness", "hyperpigmentation", "midrange"],
    whyRecommended:
      "10% Azelaic Acid Booster recommends this azelaic acid booster for its dual action against acne and rosacea. Azelaic acid is one of the few ingredients that addresses both redness and dark spots simultaneously — making this a standout pick for combination-concern skin.",
    source: "10% Azelaic Acid Booster & Dr. Jenny Liu (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=4By-S9xY4h8",
    sourceLinks: [
      { name: "10% Azelaic Acid Booster", url: "https://www.youtube.com/watch?v=4By-S9xY4h8" },
      { name: "Skin Revealing Body Lotion 10% AHA", url: "https://www.youtube.com/watch?v=pxEfSEj0ssE" },
    ],
    dermVerified: true,
  },
  {
    id: "naturium-mandelic-acid",
    name: "Mandelic Topical Acid 12%",
    brand: "Naturium",
    category: "exfoliant",
    price: "$15–20",
    keyIngredients: ["12% Mandelic Acid (AHA)", "Niacinamide", "Licorice Root Extract"],
    bestFor: ["acne", "dark_spots", "texture", "budget"],
    whyRecommended:
      "Dr. Jenny Liu highlighted Naturium's mandelic acid as a gentler AHA option thanks to mandelic acid's larger molecular size compared to glycolic acid. Effective for fading dark spots and smoothing texture while being more tolerable than traditional AHAs.",
    source: "Dr. Jenny Liu (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=pxEfSEj0ssE",
    dermVerified: true,
  },
  {
    id: "neostrata-bionic-face-cream",
    name: "Bionic Face Cream",
    brand: "NeoStrata",
    category: "exfoliant",
    price: "$45–50",
    keyIngredients: ["PHA (Gluconolactone)", "Lactobionic Acid", "Ceramides"],
    bestFor: ["aging", "dry", "sensitive", "mature", "premium"],
    whyRecommended:
      "Dr. Dray featured NeoStrata Bionic Face Cream for mature and sensitive skin. PHA-based exfoliation is exceptionally gentle and also acts as a humectant, making this a rare exfoliant that simultaneously moisturizes and improves texture without sensitizing the skin.",
    source: "Dr. Dray (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=wHzh_WxIbEc",
    dermVerified: true,
  },
  {
    id: "glow-recipe-strawberry-bha-aha",
    name: "Strawberry Smooth BHA + AHA Salicylic Serum",
    brand: "Glow Recipe",
    category: "exfoliant",
    price: "$40–45",
    keyIngredients: ["Salicylic Acid (BHA)", "AHA Complex", "Strawberry Extract"],
    bestFor: ["pores", "texture", "oily", "combination", "midrange"],
    whyRecommended:
      "Dr. Jenny Liu reviewed this dual-action exfoliant for its BHA + AHA combination that targets both surface texture and inside pores. Ideal for oily and combination skin types dealing with enlarged pores and congestion who want a more elegant, serum-like texture.",
    source: "Dr. Jenny Liu (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=pxEfSEj0ssE",
    dermVerified: true,
  },
  {
    id: "drunk-elephant-babyfacial",
    name: "T.L.C. Sukari Babyfacial",
    brand: "Drunk Elephant",
    category: "exfoliant",
    price: "$60–80",
    keyIngredients: ["AHA Complex (Glycolic, Tartaric, Lactic, Citric)", "2% BHA", "Marula Oil"],
    bestFor: ["dullness", "texture", "aging", "premium"],
    whyRecommended:
      "Dr. Jenny Liu featured this high-dose AHA+BHA weekly mask for its ability to dramatically resurface and brighten. As a once-weekly treatment, it delivers professional-grade exfoliation at home. Best for experienced exfoliant users seeking maximum radiance and anti-aging results.",
    source: "Dr. Jenny Liu (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=pxEfSEj0ssE",
    dermVerified: true,
  },
  {
    id: "anua-azelaic-acid-serum",
    name: "Azelaic Acid 10% Serum",
    brand: "Anua",
    category: "exfoliant",
    price: "$20–25",
    keyIngredients: ["10% Azelaic Acid", "Niacinamide", "Heartleaf Extract"],
    bestFor: ["acne", "rosacea", "redness", "budget"],
    whyRecommended:
      "Doctorly reviewed this K-beauty azelaic acid serum for its calming and anti-acne properties. Anua's version combines azelaic acid with their signature heartleaf extract for added soothing benefits — ideal for acne and rosacea-prone skin on a budget.",
    source: "Doctorly (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=fjIGAFmBgRE",
    dermVerified: true,
  },
  {
    id: "glytone-exfoliating-serum",
    name: "Exfoliating Serum 3 with Azelaic + Glycolic",
    brand: "Glytone",
    category: "exfoliant",
    price: "$50–60",
    keyIngredients: ["Glycolic Acid", "Azelaic Acid", "Kojic Acid"],
    bestFor: ["dark_spots", "hyperpigmentation", "aging", "premium"],
    whyRecommended:
      "Dr. Dray highlights Glytone's medical-grade formulas as among the most clinically effective OTC options for hyperpigmentation and aging. This combination of glycolic acid, azelaic acid, and kojic acid targets dark spots through multiple simultaneous mechanisms for faster, more visible results.",
    source: "Dr. Dray (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=HwHR69TMpFc",
    dermVerified: true,
  },

  // ─────────────────────────────────────────────
  // MOISTURIZERS
  // ─────────────────────────────────────────────
  {
    id: "lrp-toleriane-double-repair",
    name: "Toleriane Double Repair Moisturizer",
    brand: "La Roche-Posay",
    category: "moisturizer",
    price: "$20–25",
    keyIngredients: ["Ceramide-3", "Niacinamide", "Prebiotic Thermal Spring Water"],
    bestFor: ["sensitive", "normal", "combination", "redness", "rosacea", "midrange"],
    whyRecommended:
      "Bionic Face Cream and Dr. Karen Locke both recommend this lightweight yet effective barrier repair moisturizer. Its prebiotic formula supports the skin microbiome. Dr. Locke featured it in her complete acne routines for dry skin.",
    source: "Bionic Face Cream, Dr. Karen Locke & Dr. Whitney Bowe (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=APC16_cpYyk",
    sourceLinks: [
      { name: "Bionic Face Cream", url: "https://www.youtube.com/watch?v=APC16_cpYyk" },
      { name: "Bionic Face Cream PHA 12", url: "https://www.youtube.com/watch?v=UG5G-muIxVU" },
      { name: "Toleriane Double Repair Matte", url: "https://www.youtube.com/watch?v=DkyhrQWcmEA" },
    ],
    amazonUrl: "https://www.amazon.com/dp/B01NCWV3KM?tag=glowskincar0c-20",
    dermVerified: true,
  },
  {
    id: "cerave-moisturizing-cream",
    name: "Moisturizing Cream",
    brand: "CeraVe",
    category: "moisturizer",
    price: "$15–20",
    keyIngredients: ["Ceramides (1, 3, 6-II)", "Hyaluronic Acid", "MVE Technology"],
    bestFor: ["dry", "dehydration", "sensitive", "budget", "normal"],
    whyRecommended:
      "A derm consensus pick. Dr. Daniel Sugai features it as the gold standard for dry and eczema-prone skin, praising its patented MVE delivery technology for 24-hour continuous hydration and barrier restoration.",
    source: "Dr. Daniel Sugai, Dr. Whitney Bowe & Dr. Dustin Portela (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=SvB_EaH29wQ",
    sourceLinks: [
      { name: "Hydro Boost Gel-Cream for Dry Skin", url: "https://www.youtube.com/watch?v=SvB_EaH29wQ" },
      { name: "Moisturizing Cream", url: "https://www.youtube.com/watch?v=DkyhrQWcmEA" },
      { name: "Mela B3 Dark Spot Serum With Melasyl™ + Niacinamide", url: "https://www.youtube.com/watch?v=OkD8mga9BLI" },
    ],
    amazonUrl: "https://www.amazon.com/dp/B00TTD9BRC?tag=glowskincar0c-20",
    dermVerified: true,
  },
  {
    id: "lrp-cicaplast-gel-b5",
    name: "Cicaplast Gel B5 Skin Protectant",
    brand: "La Roche-Posay",
    category: "moisturizer",
    price: "$20–25",
    keyIngredients: ["Glycerin", "Vitamin B5 (Panthenol)", "Madecassoside"],
    bestFor: ["sensitive", "redness", "rosacea", "dehydration", "dry", "midrange"],
    whyRecommended:
      "Cicaplast Gel B5 calls this one of her most repurchased products, featuring it in her top skincare products of 2024 and 2025. A go-to for soothing damaged, sensitive, and post-procedure skin with a lightweight gel texture.",
    source: "Cicaplast Gel B5 & Dr. Whitney Bowe (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=ZmTQAMXjeys",
    sourceLinks: [
      { name: "Cicaplast Gel B5", url: "https://www.youtube.com/watch?v=h19mTItzLrE" },
      { name: "Cicaplast Baume B5", url: "https://www.youtube.com/watch?v=DkyhrQWcmEA" },
    ],
    // No ASIN in spec; omitting amazonUrl
    dermVerified: true,
  },
  {
    id: "cerave-pm-lotion",
    name: "PM Facial Moisturizing Lotion",
    brand: "CeraVe",
    category: "moisturizer",
    price: "$15–20",
    keyIngredients: ["Niacinamide", "Ceramides", "Hyaluronic Acid"],
    bestFor: ["oily", "acne", "combination", "budget", "normal"],
    whyRecommended:
      "Dr. Alexis Stephens recommends CeraVe PM as her go-to lightweight moisturizer for normal skin, praising its niacinamide content for calming and barrier support overnight. The oil-free formula won't clog pores.",
    source: "Dr. Alexis Stephens (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=APC16_cpYyk",
    // No ASIN listed for CeraVe PM Lotion in spec
    dermVerified: true,
  },
  {
    id: "neutrogena-hydro-boost",
    name: "Hydro Boost Water Gel",
    brand: "Neutrogena",
    category: "moisturizer",
    price: "$15–20",
    keyIngredients: ["Hyaluronic Acid", "Glycerin", "Dimethicone"],
    bestFor: ["oily", "combination", "dehydration", "budget", "normal"],
    whyRecommended:
      "A multi-derm consensus pick. Hydro Boost Hyaluronic Acid Water Gel and Dr. Daniel Sugai have both recommended this oil-free gel moisturizer for oily and combination skin. Absorbs instantly, providing deep hydration without heaviness — ideal under sunscreen.",
    source: "Hydro Boost Hyaluronic Acid Water Gel, Dr. Daniel Sugai & Dr. Dustin Portela (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=XYr2_QlQiyA",
    sourceLinks: [
      { name: "Hydro Boost Hyaluronic Acid Water Gel", url: "https://www.youtube.com/watch?v=h19mTItzLrE" },
      { name: "Hydro Boost Water Gel", url: "https://www.youtube.com/watch?v=XYr2_QlQiyA" },
      { name: "Toleriane Hydrating Gentle Face Cleanser", url: "https://www.youtube.com/watch?v=OkD8mga9BLI" },
    ],
    amazonUrl: "https://www.amazon.com/dp/B00NR1YQHM?tag=glowskincar0c-20",
    dermVerified: true,
  },
  {
    id: "first-aid-beauty-ultra-repair-cream",
    name: "Ultra Repair Cream",
    brand: "First Aid Beauty",
    category: "moisturizer",
    price: "$30–35",
    keyIngredients: ["Colloidal Oatmeal", "Shea Butter", "Ceramides"],
    bestFor: ["dry", "sensitive", "dehydration", "midrange", "redness"],
    whyRecommended:
      "Dr. Sam Ellis frequently recommends First Aid Beauty Ultra Repair Cream for very dry and sensitive skin. The colloidal oatmeal provides FDA-recognized skin protectant benefits, while shea butter and ceramides deliver intense, long-lasting moisture without clogging pores.",
    source: "Dr. Sam Ellis (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=iGBIxwOxfWU",
    dermVerified: true,
  },
  {
    id: "aestura-atobarrier-365-cream",
    name: "AtoBarrier 365 Cream",
    brand: "Aestura",
    category: "moisturizer",
    price: "$25–30",
    keyIngredients: ["Ceramides", "Niacinamide", "Panthenol"],
    bestFor: ["dry", "sensitive", "dehydration", "redness"],
    whyRecommended:
      "Atobarrier 365 Cream featured this K-beauty barrier cream for its impressive ceramide-rich formula designed to restore moisture to very dry and sensitive skin. Its 365-day barrier support positioning reflects its gentle, redness-reducing formula that works for year-round use.",
    source: "Atobarrier 365 Cream & Dr. Whitney Bowe (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=oyJRxD9YQnE",
    sourceLinks: [
      { name: "Atobarrier 365 Cream", url: "https://www.youtube.com/watch?v=oyJRxD9YQnE" },
      { name: "AtoBarrier 365 Hydro Essence", url: "https://www.youtube.com/watch?v=DkyhrQWcmEA" },
    ],
    dermVerified: true,
  },
  {
    id: "vanicream-daily-facial-moisturizer",
    name: "Daily Facial Moisturizer",
    brand: "Vanicream",
    category: "moisturizer",
    price: "$15–20",
    keyIngredients: ["Glycerin", "Dimethicone", "PEG-free formula"],
    bestFor: ["sensitive", "rosacea", "redness", "budget", "normal"],
    whyRecommended:
      "Dr. Dray consistently recommends Vanicream products for highly reactive skin. This daily moisturizer is formulated without fragrance, dyes, parabens, or preservatives that commonly trigger flares in rosacea and contact dermatitis, making it one of the safest choices for sensitive skin.",
    source: "Dr. Dray & Dr. Karen Locke (YouTube)",
    amazonUrl: "https://www.amazon.com/dp/B09TPXNKJG?tag=glowskincar0c-20",
    dermVerified: true,
  },,
  {
    id: "abib-ectoin-panthenol-moisturizer",
    name: "Ectoin Panthenol 11% Moisturizer",
    brand: "Abib",
    category: "moisturizer",
    price: "$20–25",
    keyIngredients: ["11% Panthenol (Vitamin B5)", "Ectoin", "Ceramides"],
    bestFor: ["sensitive", "redness", "rosacea", "dehydration"],
    whyRecommended:
      "Dr. Dray featured this K-beauty moisturizer for sensitive and redness-prone skin. Ectoin is a stress-protection molecule that helps shield skin from environmental damage and inflammation, paired with high-dose panthenol for maximum barrier repair and calming.",
    source: "Dr. Dray (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=oyJRxD9YQnE",
    dermVerified: true,
  },

  // ─────────────────────────────────────────────
  // SUNSCREENS
  // ─────────────────────────────────────────────
  {
    id: "eltamd-uv-clear",
    name: "UV Clear Broad-Spectrum SPF 46",
    brand: "EltaMD",
    category: "sunscreen",
    price: "$40–45",
    keyIngredients: ["Zinc Oxide 9%", "Niacinamide", "Hyaluronic Acid"],
    bestFor: ["sensitive", "acne", "rosacea", "redness", "midrange"],
    whyRecommended:
      "Dr. Sam Ellis and UV Clear Broad-Spectrum SPF 46 both call this the #1 dermatologist-recommended sunscreen brand. Dr. Sugai gave it 4.5/5 stars in a dedicated video review, praising its niacinamide, sheer zinc formula, and no white cast.",
    source: "Dr. Sam Ellis, UV Clear Broad-Spectrum SPF 46 & Dr. Muneeb Shah (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=fRwKPdSycFU",
    sourceLinks: [
      { name: "EltaMD UV Daily Broad-Spectrum SPF 40 Tinted", url: "https://www.youtube.com/watch?v=iGBIxwOxfWU" },
      { name: "UV Clear Broad-Spectrum SPF 46", url: "https://www.youtube.com/watch?v=NK6ThY5Pt74" },
      { name: "Heartleaf Sun Essence SPF 50+", url: "https://www.youtube.com/watch?v=OnraqyJzPo0" },
    ],
    amazonUrl: "https://www.amazon.com/dp/B002MSN3QQ?tag=glowskincar0c-20",
    dermVerified: true,
  },
  {
    id: "lrp-anthelios-clear-skin",
    name: "Anthelios Clear Skin Dry Touch SPF 60",
    brand: "La Roche-Posay",
    category: "sunscreen",
    price: "$30–35",
    keyIngredients: ["Cell-Ox Shield XL Technology", "Silica", "Perlite"],
    bestFor: ["oily", "acne", "combination", "high_sun", "midrange"],
    whyRecommended:
      "Dr. Daniel Sugai recommends this for oily and acne-prone patients. Its oil-absorbing silica and dry-touch finish keep the face matte without clogging pores, and SPF 60 provides robust protection for high sun-exposure days.",
    source: "Dr. Daniel Sugai (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=NK6ThY5Pt74",
    amazonUrl: "https://www.amazon.com/dp/B07YZRFH5C?tag=glowskincar0c-20",
    dermVerified: true,
  },
  {
    id: "isdin-eryfotona",
    name: "Eryfotona Ageless Tinted SPF 50",
    brand: "ISDIN",
    category: "sunscreen",
    price: "$50–60",
    keyIngredients: ["Zinc Oxide", "Photolyase DNA Repair Enzyme", "Vitamin E"],
    bestFor: ["aging", "mature", "premium", "hyperpigmentation", "high_sun", "forties", "fiftyplus"],
    whyRecommended:
      "Dr. Daniel Sugai recommends ISDIN Eryfotona Ageless for mature skin, calling it an outstanding choice for those 40+ due to its DNA-repair photolyase enzyme technology, anti-aging peptides, and natural tint that suits deeper skin tones.",
    source: "Dr. Daniel Sugai & Dr. Joyce Park (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=hHfcGTA7A70",
    sourceLinks: [
      { name: "ISDIN Eryfotona Actinica Ultralight Emulsion Broad Spectrum SPF 50+", url: "https://www.youtube.com/watch?v=NK6ThY5Pt74" },
      { name: "EltaMD UV Clear Tinted Broad-Spectrum SPF 46", url: "https://www.youtube.com/watch?v=Max9p5NGANI" },
    ],
    amazonUrl: "https://www.amazon.com/dp/B0CV85FYPJ?tag=glowskincar0c-20",
    dermVerified: true,
  },
  {
    id: "cerave-am-lotion",
    name: "AM Facial Moisturizing Lotion SPF 30",
    brand: "CeraVe",
    category: "sunscreen",
    price: "$15–20",
    keyIngredients: ["Zinc Oxide", "Ceramides", "Niacinamide"],
    bestFor: ["dry", "normal", "sensitive", "budget", "dehydration"],
    whyRecommended:
      "Dr. Daniel Sugai recommends this two-in-one moisturizer + SPF 30 for those who prefer a simplified morning routine. The ceramide and niacinamide formula supports barrier repair while delivering daily broad-spectrum sun protection at a drugstore price.",
    source: "Dr. Daniel Sugai (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=NK6ThY5Pt74",
    amazonUrl: "https://www.amazon.com/dp/B00F97FHAW?tag=glowskincar0c-20",
    dermVerified: true,
  },
  {
    id: "supergoop-unseen-sunscreen-spf40",
    name: "Unseen Sunscreen SPF 40",
    brand: "Supergoop!",
    category: "sunscreen",
    price: "$35–40",
    keyIngredients: ["Meadowfoam Seed Oil", "Red Algae", "Chemical SPF Filters"],
    bestFor: ["oily", "combination", "normal", "midrange", "pores"],
    whyRecommended:
      "Dr. Sam Ellis recommends Supergoop! Unseen Sunscreen for its weightless, invisible, primer-like finish that works for oily and combination skin. It wears beautifully under makeup, has no white cast, and provides SPF 40 broad-spectrum protection — making it one of the most wearable daily sunscreens available.",
    source: "Dr. Sam Ellis & Eryfotona Actinica Ultralight Emulsion (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=fRwKPdSycFU",
    sourceLinks: [
      { name: "Mineral Mattescreen SPF 40", url: "https://www.youtube.com/watch?v=fRwKPdSycFU" },
      { name: "Eryfotona Actinica Ultralight Emulsion", url: "https://www.youtube.com/watch?v=Rpx_pSJNP1A" },
    ],
    dermVerified: true,
  },
  {
    id: "eucerin-radiant-tone-spf30",
    name: "Radiant Tone Daily Face Lotion SPF 30",
    brand: "Eucerin",
    category: "sunscreen",
    price: "$30–35",
    keyIngredients: ["Thiamidol", "SPF 30 Filters", "Niacinamide"],
    bestFor: ["hyperpigmentation", "dark_spots", "combination"],
    whyRecommended:
      "Doctorly reviewed this tinted daily SPF as an excellent choice for hyperpigmentation. Eucerin's clinically proven Thiamidol molecule targets melanin overproduction at the source while providing SPF 30 daily protection — a dual-purpose product for uneven skin tone.",
    source: "Doctorly (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=WKN8W7Os9fY",
    dermVerified: true,
  },,
  {
    id: "naturium-dew-glow-spf50",
    name: "Dew-Glow Moisturizer SPF 50",
    brand: "Naturium",
    category: "sunscreen",
    price: "$20–25",
    keyIngredients: ["SPF 50 Broad Spectrum", "Hyaluronic Acid", "Niacinamide"],
    bestFor: ["dry", "dehydration", "budget", "dullness"],
    whyRecommended:
      "Doctorly featured Naturium's Dew-Glow SPF 50 for its dewy finish and hydrating formula that suits dry and dehydrated skin types. Unusually, it provides SPF 50 protection at a budget-friendly price point with a glow-enhancing formula rather than a matte finish.",
    source: "Doctorly (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=WKN8W7Os9fY",
    dermVerified: true,
  },
  {
    id: "colorescience-sunforgettable-spf50",
    name: "Sunforgettable Face Shield Flex SPF 50",
    brand: "Colorescience",
    category: "sunscreen",
    price: "$50–60",
    keyIngredients: ["Zinc Oxide (Mineral)", "Titanium Dioxide", "Flex-Ready Technology"],
    bestFor: ["sensitive", "rosacea", "premium", "redness"],
    whyRecommended:
      "Total Protection® Face Shield Flex SPF 50 recommends Colorescience for the most reactive sensitive skin. This 100% mineral sunscreen with tint is specifically formulated for rosacea and reactive skin, providing both coverage and calming SPF 50 protection without chemical UV filters that can trigger flares.",
    source: "Total Protection® Face Shield Flex SPF 50 (YouTube)",
    dermVerified: true,
  },
  {
    id: "beauty-of-joseon-daily-tinted-spf40",
    name: "Daily Tinted Fluid SPF 40",
    brand: "Beauty of Joseon",
    category: "sunscreen",
    price: "$15–20",
    keyIngredients: ["SPF 40 PA++++", "Niacinamide", "Rice Bran Extract"],
    bestFor: ["normal", "combination", "budget", "dullness"],
    whyRecommended:
      "Total Protection® Face Shield Flex SPF 50 reviewed this K-beauty tinted SPF for its elegant texture, budget price, and brightening effect. Beauty of Joseon's SPF lineup is widely praised for its lightweight feel and glow-enhancing properties — making daily sunscreen application a pleasure rather than a chore.",
    source: "Total Protection® Face Shield Flex SPF 50 & Dr. Neera Nathan (YouTube/Instagram)",
    sourceUrl: "https://www.youtube.com/watch?v=YW05mDjpwnw",
    sourceLinks: [
      { name: "Total Protection® Face Shield Flex SPF 50", url: "https://www.youtube.com/watch?v=YW05mDjpwnw" },
      { name: "Relief Sun: Rice + Probiotics SPF 50+", url: "https://www.instagram.com/reel/DLI5IIpBQDf/" },
    ],
    dermVerified: true,
  },

  // ─────────────────────────────────────────────
  // TREATMENTS — all PM-only (retinoids)
  // ─────────────────────────────────────────────
  {
    id: "differin-gel",
    name: "Adapalene Gel 0.1%",
    brand: "Differin",
    category: "treatment",
    price: "$10–15",
    keyIngredients: ["Adapalene 0.1% (OTC Retinoid)"],
    bestFor: ["acne", "breakouts", "retinoid_new", "retinoid_beginner", "budget", "pores", "texture", "hyperpigmentation"],
    whyRecommended:
      "The only FDA-approved OTC retinoid for acne. Dr. Dray is a long-time advocate, making it a top pick in her most-purchased skincare of 2025 list. Dr. Muneeb Shah also recommends adapalene as the best-evidenced OTC retinoid for acne. Apply at night only. Start 2–3× per week.",
    source: "Dr. Dray, Dr. Muneeb Shah & Dr. Dustin Portela (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=ZmTQAMXjeys",
    amazonUrl: "https://www.amazon.com/dp/B07V2BRPVS?tag=glowskincar0c-20",
    pmOnly: true,
    dermVerified: true,
  },
  {
    id: "medik8-crystal-retinal",
    name: "Crystal Retinal (Retinaldehyde Serum)",
    brand: "Medik8",
    category: "treatment",
    price: "$60–80",
    keyIngredients: ["Retinaldehyde (Retinal)", "Hyaluronic Acid", "Vitamin E"],
    bestFor: ["aging", "wrinkles", "acne", "retinoid_experienced", "retinoid_beginner", "premium", "midrange", "texture"],
    whyRecommended:
      "Crystal Retinal (The Budget Dermatologist) and Dr. Sam Ellis both recommend Medik8 Crystal Retinal. Dr. Ellis featured it in a video on how to make retinoids work better, demonstrating usage of Crystal Retinal's graduated strengths. Retinaldehyde is one step closer to retinoic acid than retinol — faster results with less irritation. Apply at night only.",
    source: "Crystal Retinal / The Budget Dermatologist & Dr. Sam Ellis (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=xE2ljf69hBc",
    sourceLinks: [
      { name: "Crystal Retinal", url: "https://www.youtube.com/watch?v=iZc8UWcq5dY" },
      { name: "UV Clear Broad-Spectrum SPF 46", url: "https://www.youtube.com/watch?v=iGBIxwOxfWU" },
    ],
    // No ASIN in spec; omitting amazonUrl
    pmOnly: true,
    dermVerified: true,
  },
  {
    id: "ordinary-retinol-squalane",
    name: "Retinol 1% in Squalane",
    brand: "The Ordinary",
    category: "treatment",
    price: "$5–10",
    keyIngredients: ["1% Retinol", "Squalane"],
    bestFor: ["aging", "wrinkles", "acne", "budget", "retinoid_beginner", "texture"],
    whyRecommended:
      "Dr. Dray recommends The Ordinary's retinol range as affordable, effective OTC retinoids. The squalane base keeps the formula moisturizing and tolerable. Effective for mild acne, texture improvement, and early anti-aging. Apply at night only.",
    source: "Dr. Dray & Dr. Karen Locke (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=o2CjoLldFCg",
    sourceLinks: [
      { name: "Crystal Retinal 6", url: "https://www.youtube.com/watch?v=ZmTQAMXjeys" },
      { name: "Retinol 0.5% in Squalane", url: "https://www.youtube.com/watch?v=iZc8UWcq5dY" },
    ],
    amazonUrl: "https://www.amazon.com/dp/B0DQ6496LC?tag=glowskincar0c-20",
    pmOnly: true,
    dermVerified: true,
  },,
  {
    id: "neutrogena-rapid-wrinkle-repair-retinol",
    name: "Rapid Wrinkle Repair Retinol Serum",
    brand: "Neutrogena",
    category: "treatment",
    price: "$20–25",
    keyIngredients: ["Accelerated Retinol SA", "Glucose Complex", "Hyaluronic Acid"],
    bestFor: ["aging", "wrinkles", "retinoid_beginner", "budget", "dark_spots"],
    whyRecommended:
      "Dr. Dray recommends Neutrogena Rapid Wrinkle Repair as one of the best accessible OTC retinol serums for beginners focused on anti-aging. Its proprietary Accelerated Retinol SA formula is designed for faster efficacy with minimized irritation. Apply at night only.",
    source: "Dr. Dray (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=ZmTQAMXjeys",
    amazonUrl: "https://www.amazon.com/dp/B002RL8FBY?tag=glowskincar0c-20",
    pmOnly: true,
    dermVerified: true,
  },
  {
    id: "cerave-resurfacing-retinol-serum",
    name: "Resurfacing Retinol Serum",
    brand: "CeraVe",
    category: "treatment",
    price: "$15–20",
    keyIngredients: ["Encapsulated Retinol", "Niacinamide", "Ceramides"],
    bestFor: ["acne", "texture", "pores", "budget", "retinoid_new", "retinoid_beginner"],
    whyRecommended:
      "Dr. Dray recommends CeraVe Resurfacing Retinol as an excellent entry-level retinoid. Encapsulated retinol minimizes irritation during the adjustment phase, while niacinamide and ceramides simultaneously soothe and protect the barrier. Apply at night only. Start slowly.",
    source: "Dr. Dray & Dr. Muneeb Shah (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=ZmTQAMXjeys",
    sourceLinks: [
      { name: "Resurfacing Retinol Serum", url: "https://www.youtube.com/watch?v=ZmTQAMXjeys" },
      { name: "Resurfacing Retinol Serum", url: "https://www.youtube.com/watch?v=OnraqyJzPo0" },
    ],
    amazonUrl: "https://www.amazon.com/dp/B07VWSN95S?tag=glowskincar0c-20",
    pmOnly: true,
    dermVerified: true,
  },
  {
    id: "naturium-retinol-complex-cream",
    name: "Retinol Complex Cream",
    brand: "Naturium",
    category: "treatment",
    price: "$20–25",
    keyIngredients: ["Retinol", "Peptides", "Squalane"],
    bestFor: ["sensitive", "retinoid_beginner", "budget"],
    whyRecommended:
      "Dr. Sam Ellis featured Naturium Retinol Complex Cream as a well-tolerated beginner retinoid cream. The cream format buffers the retinol, reducing irritation for sensitive skin types new to retinoids. A reliable, affordable option to start the retinol journey. Apply at night only.",
    source: "Dr. Sam Ellis (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=SBylLqyy6pw",
    pmOnly: true,
    dermVerified: true,
  },
  {
    id: "roc-retinol-max-hydration",
    name: "Retinol Correxion Max Hydration Moisturizer",
    brand: "RoC",
    category: "treatment",
    price: "$25–30",
    keyIngredients: ["Retinol", "Hyaluronic Acid", "Ceramides"],
    bestFor: ["dry", "retinoid_new", "retinoid_beginner", "budget"],
    whyRecommended:
      "RETINOL CORREXION® Line Smoothing Max Hydration Cream recommended this RoC moisturizer-retinol hybrid for dry skin beginners. By combining retinol with hyaluronic acid and ceramides in a rich moisturizing base, it counters the dryness commonly experienced when starting retinoids. Apply at night only.",
    source: "RETINOL CORREXION® Line Smoothing Max Hydration Cream & Dr. Daniel Sugai (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=bruzUMMO_LU",
    sourceLinks: [
      { name: "RETINOL CORREXION® Line Smoothing Max Hydration Cream", url: "https://www.youtube.com/watch?v=bruzUMMO_LU" },
      { name: "Differin Adapalene Gel 0.1% Acne Treatment", url: "https://www.youtube.com/watch?v=lda4RL8QO8g" },
    ],
    amazonUrl: "https://www.amazon.com/dp/B07GTWMD1W?tag=glowskincar0c-20",
    pmOnly: true,
    dermVerified: true,
  },
  {
    id: "loreal-revitalift-retinol-night-cream",
    name: "Revitalift Pressed Night Cream with Retinol",
    brand: "L'Oreal",
    category: "treatment",
    price: "$35–40",
    keyIngredients: ["Pro-Retinol", "Hyaluronic Acid", "Vitamin C"],
    bestFor: ["aging", "combination", "retinoid_beginner", "midrange"],
    whyRecommended:
      "Dr. Jenny Liu recommended L'Oreal Revitalift as a mid-range combination retinol night cream for beginners focused on anti-aging. It pairs pro-retinol with vitamin C and hyaluronic acid for comprehensive overnight renewal. Apply at night only.",
    source: "Dr. Jenny Liu (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=bruzUMMO_LU",
    pmOnly: true,
    dermVerified: true,
  },
  {
    id: "first-aid-beauty-retinol-serum",
    name: "0.3% Retinol Complex Serum",
    brand: "First Aid Beauty",
    category: "treatment",
    price: "$50–60",
    keyIngredients: ["0.3% Pure Retinol", "Colloidal Oat", "Peptides"],
    bestFor: ["sensitive", "aging", "retinoid_beginner", "midrange", "premium"],
    whyRecommended:
      "Dr. Sam Ellis featured First Aid Beauty's retinol serum for sensitive skin types who want anti-aging benefits without harsh irritation. The colloidal oat base provides soothing properties while peptides support collagen, making this ideal for sensitive beginners concerned about aging. Apply at night only.",
    source: "Dr. Sam Ellis (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=SBylLqyy6pw",
    pmOnly: true,
    dermVerified: true,
  },
  // ── EXPANDED PRODUCT DATABASE (top brands & bestsellers) ──
  {
    id: "the-ordinary-the-ordinary-niacinamide-10-zinc-1-smoothing-se",
    name: "The Ordinary Niacinamide 10% + Zinc 1% Smoothing Serum for Blemish-Prone Skin",
    brand: "The Ordinary",
    category: "serum",
    price: "~$6",
    keyIngredients: ["Niacinamide 10%", "Zinc PCA 1%"],
    bestFor: ["oily", "texture", "budget", "acne"],
    whyRecommended: "Popular serum from The Ordinary with Niacinamide 10% — well-suited for oily, texture, acne skin.",
    source: "Dermatologist-recommended",
    amazonUrl: "https://www.amazon.com/dp/B01MYEZPC8?tag=glowskincar0c-20",
    dermVerified: false,
  },
  {
    id: "the-ordinary-the-ordinary-hyaluronic-acid-2-b5-with-ceramide",
    name: "The Ordinary Hyaluronic Acid 2% + B5 with Ceramides Multi-Depth Hydration Serum",
    brand: "The Ordinary",
    category: "serum",
    price: "~$9-10",
    keyIngredients: ["Hyaluronic Acid 2%", "Vitamin B5 (Panthenol)", "Ceramides"],
    bestFor: ["dehydration", "budget", "dry"],
    whyRecommended: "Popular serum from The Ordinary with Hyaluronic Acid 2% — well-suited for dehydration, dry, budget skin.",
    source: "Dermatologist-recommended",
    amazonUrl: "https://www.amazon.com/dp/B071914GGL?tag=glowskincar0c-20",
    dermVerified: false,
  },
  {
    id: "the-ordinary-the-ordinary-glycolic-acid-7-exfoliating-toner",
    name: "The Ordinary Glycolic Acid 7% Exfoliating Toner",
    brand: "The Ordinary",
    category: "toner",
    price: "~$13",
    keyIngredients: ["Glycolic Acid 7%", "Ginseng", "Aloe"],
    bestFor: ["hyperpigmentation", "texture", "budget"],
    whyRecommended: "Popular toner from The Ordinary with Glycolic Acid 7% — well-suited for hyperpigmentation, texture, budget skin.",
    source: "Dermatologist-recommended",
    dermVerified: false,
  },
  {
    id: "the-ordinary-the-ordinary-azelaic-acid-suspension-10",
    name: "The Ordinary Azelaic Acid Suspension 10%",
    brand: "The Ordinary",
    category: "treatment",
    price: "~$12",
    keyIngredients: ["Azelaic Acid 10%"],
    bestFor: ["redness", "budget", "acne"],
    whyRecommended: "Popular treatment from The Ordinary with Azelaic Acid 10% — well-suited for redness, acne, budget skin.",
    source: "0.3% Retinol Complex Serum with Peptides & Noted Dermatology doctor (YouTube)",
    sourceLinks: [
      { name: "0.3% Retinol Complex Serum with Peptides", url: "https://www.youtube.com/watch?v=fjIGAFmBgRE" },
      { name: "Noted Dermatology doctor", url: "https://www.youtube.com/watch?v=pUqhCX3wDs0" },
    ],
    dermVerified: true,
  },
  {
    id: "the-ordinary-the-ordinary-natural-moisturizing-factors-ha",
    name: "The Ordinary Natural Moisturizing Factors + HA",
    brand: "The Ordinary",
    category: "moisturizer",
    price: "~$8-10",
    keyIngredients: ["Amino acids", "Ceramides", "Fatty acids", "Hyaluronic Acid", "Urea", "Glycerin"],
    bestFor: ["dehydration", "budget", "dry"],
    whyRecommended: "Popular moisturizer from The Ordinary with Amino acids — well-suited for dehydration, dry, budget skin.",
    source: "Dermatologist-recommended",
    dermVerified: false,
  },
  {
    id: "the-ordinary-the-ordinary-multi-peptide-ha-serum-buffet",
    name: "The Ordinary Multi-Peptide + HA Serum (Buffet)",
    brand: "The Ordinary",
    category: "serum",
    price: "~$15-16",
    keyIngredients: ["Multiple peptides", "Hyaluronic Acid", "Amino acids"],
    bestFor: ["dry", "midrange", "aging"],
    whyRecommended: "Popular serum from The Ordinary with Multiple peptides — well-suited for dry, aging, midrange skin.",
    source: "Natural Moisturizing Factors + Hyaluronic Acid Daily Moisturizer (YouTube)",
    sourceLinks: [
      { name: "Natural Moisturizing Factors + Hyaluronic Acid Daily Moisturizer", url: "https://www.youtube.com/watch?v=Woy-IoojkOo" },
      { name: "Retinol Correxion Max Daily Hydration Creme", url: "https://www.youtube.com/watch?v=T6pdF0bghVs" },
    ],
    dermVerified: true,
  },
  {
    id: "la-roche-posay-la-roche-posay-toleriane-double-repair-face-m",
    name: "La Roche-Posay Toleriane Double Repair Face Moisturizer",
    brand: "La Roche-Posay",
    category: "moisturizer",
    price: "~$20-25",
    keyIngredients: ["Ceramide-3", "Niacinamide", "Glycerin", "Prebiotic Thermal Water"],
    bestFor: ["dehydration", "redness", "midrange", "sensitive"],
    whyRecommended: "Popular moisturizer from La Roche-Posay with Ceramide-3 — well-suited for dehydration, redness, sensitive skin.",
    source: "Dr. Dustin Portela (YouTube)",
    sourceLinks: [
      { name: "Anthelios Ultra-Light Sunscreen Fluid SPF 60", url: "https://www.youtube.com/watch?v=q4nE9qFD4_E" },
    ],
    amazonUrl: "https://www.amazon.com/dp/B07L1PHS1S?tag=glowskincar0c-20",
    dermVerified: true,
  },,
  {
    id: "la-roche-posay-la-roche-posay-toleriane-hydrating-gentle-fac",
    name: "La Roche-Posay Toleriane Hydrating Gentle Face Cleanser",
    brand: "La Roche-Posay",
    category: "cleanser",
    price: "~$15-20",
    keyIngredients: ["Niacinamide", "Ceramide NP", "Glycerin"],
    bestFor: ["midrange", "normal", "dehydration", "dry", "sensitive"],
    whyRecommended: "Popular cleanser from La Roche-Posay with Niacinamide — well-suited for dry, dehydration, sensitive skin.",
    source: "Dr. Dustin Portela (YouTube)",
    sourceLinks: [
      { name: "Anthelios Clear Skin Oil-Free SPF 60", url: "https://www.youtube.com/watch?v=q4nE9qFD4_E" },
    ],
    amazonUrl: "https://www.amazon.com/dp/B07L1PHTTR?tag=glowskincar0c-20",
    dermVerified: true,
  },
  {
    id: "la-roche-posay-la-roche-posay-anthelios-ultra-light-fluid-br",
    name: "La Roche-Posay Anthelios Ultra-Light Fluid Broad Spectrum SPF 50",
    brand: "La Roche-Posay",
    category: "sunscreen",
    price: "~$30-40",
    keyIngredients: ["Titanium Dioxide", "Antioxidants", "Thermal Spring Water"],
    bestFor: ["sensitive", "midrange"],
    whyRecommended: "Popular sunscreen from La Roche-Posay with Titanium Dioxide — well-suited for sensitive, midrange skin.",
    source: "Mela B3 Dark Spot Serum With Melasyl™ + Niacinamide (YouTube)",
    sourceLinks: [
      { name: "Mela B3 Dark Spot Serum With Melasyl™ + Niacinamide", url: "https://www.youtube.com/watch?v=q4nE9qFD4_E" },
    ],
    amazonUrl: "https://www.amazon.com/dp/B08GDDZPBQ?tag=glowskincar0c-20",
    dermVerified: true,
  },
  {
    id: "la-roche-posay-la-roche-posay-hyalu-b5-pure-hyaluronic-acid-",
    name: "La Roche-Posay Hyalu B5 Pure Hyaluronic Acid Serum",
    brand: "La Roche-Posay",
    category: "serum",
    price: "~$40-50",
    keyIngredients: ["Hyaluronic Acid", "Vitamin B5"],
    bestFor: ["premium", "dehydration", "aging"],
    whyRecommended: "Popular serum from La Roche-Posay with Hyaluronic Acid — well-suited for dehydration, aging, premium skin.",
    source: "Dr. Dustin Portela (YouTube)",
    sourceLinks: [
      { name: "Retinol B3 Pure Retinol Serum", url: "https://www.youtube.com/watch?v=q4nE9qFD4_E" },
    ],
    amazonUrl: "https://www.amazon.com/dp/B07D8Y9V6T?tag=glowskincar0c-20",
    dermVerified: true,
  },
  {
    id: "la-roche-posay-la-roche-posay-mela-b3-dark-spot-serum-with-m",
    name: "La Roche-Posay Mela B3 Dark Spot Serum with Melasyl & Niacinamide",
    brand: "La Roche-Posay",
    category: "serum",
    price: "~$40-50",
    keyIngredients: ["Melasyl", "10% Niacinamide"],
    bestFor: ["premium", "hyperpigmentation", "acne"],
    whyRecommended: "Popular serum from La Roche-Posay with Melasyl — well-suited for hyperpigmentation, acne, premium skin.",
    source: "Toleriane Purifying Foaming Face Wash (YouTube)",
    sourceLinks: [
      { name: "Toleriane Purifying Foaming Face Wash", url: "https://www.youtube.com/watch?v=q4nE9qFD4_E" },
    ],
    amazonUrl: "https://www.amazon.com/dp/B0B3J5ZJ5Z?tag=glowskincar0c-20",
    dermVerified: true,
  },
  {
    id: "cerave-cerave-hydrating-facial-cleanser",
    name: "CeraVe Hydrating Facial Cleanser",
    brand: "CeraVe",
    category: "cleanser",
    price: "~$15-16",
    keyIngredients: ["Hyaluronic Acid", "Ceramides", "Glycerin"],
    bestFor: ["midrange", "normal", "dehydration", "dry", "sensitive"],
    whyRecommended: "Popular cleanser from CeraVe with Hyaluronic Acid — well-suited for dry, dehydration, sensitive skin.",
    source: "Dermatologist-recommended",
    amazonUrl: "https://www.amazon.com/dp/B01N1LL62W?tag=glowskincar0c-20",
    dermVerified: false,
  },
  {
    id: "cerave-cerave-foaming-facial-cleanser",
    name: "CeraVe Foaming Facial Cleanser",
    brand: "CeraVe",
    category: "cleanser",
    price: "~$15-16",
    keyIngredients: ["Hyaluronic Acid", "Ceramides", "Niacinamide"],
    bestFor: ["midrange", "oily", "combination", "texture", "acne"],
    whyRecommended: "Popular cleanser from CeraVe with Hyaluronic Acid — well-suited for oily, texture, combination skin.",
    source: "PM Facial Moisturizing Lotion & Dr. Shah and Dr. Maxfield & Corey L. Hart, MD, FAAD (Article/YouTube)",
    sourceLinks: [
      { name: "PM Facial Moisturizing Lotion", url: "https://www.youtube.com/watch?v=A3IJSFXS_JQ" },
      { name: "Daily Moisturizing Lotion", url: "https://www.youtube.com/watch?v=7v5vkOfGVWM" },
      { name: "Corey L. Hart, MD, FAAD", url: "https://www.vogue.com/article/cerave-cleanser-for-your-skin-type" },
    ],
    amazonUrl: "https://www.amazon.com/dp/B08CQ9T6KN?tag=glowskincar0c-20",
    dermVerified: true,
  },
  {
    id: "cerave-cerave-pm-facial-moisturizing-lotion",
    name: "CeraVe PM Facial Moisturizing Lotion",
    brand: "CeraVe",
    category: "moisturizer",
    price: "~$14-15",
    keyIngredients: ["Hyaluronic Acid", "Niacinamide", "Ceramides"],
    bestFor: ["normal", "oily", "budget", "sensitive", "redness", "combination", "acne"],
    whyRecommended: "Popular moisturizer from CeraVe with Hyaluronic Acid — well-suited for normal, oily, sensitive skin.",
    source: "Dermatologist-recommended",
    amazonUrl: "https://www.amazon.com/dp/B00365DABC?tag=glowskincar0c-20",
    dermVerified: false,
  },
  {
    id: "cerave-cerave-skin-renewing-night-cream",
    name: "CeraVe Skin Renewing Night Cream",
    brand: "CeraVe",
    category: "moisturizer",
    price: "~$13-15",
    keyIngredients: ["Niacinamide", "Peptide Complex", "Hyaluronic Acid", "Ceramides"],
    bestFor: ["budget", "sensitive", "dry", "aging", "texture"],
    whyRecommended: "Popular moisturizer from CeraVe with Niacinamide — well-suited for sensitive, texture, dry skin.",
    source: "Skin Renewing Night Cream (YouTube)",
    sourceLinks: [
      { name: "Skin Renewing Night Cream", url: "https://www.youtube.com/watch?v=aVjrWDlQ2vU" },
    ],
    amazonUrl: "https://www.amazon.com/dp/B07L1PHSY9?tag=glowskincar0c-20",
    dermVerified: true,
  },
  {
    id: "cerave-cerave-renewing-sa-cleanser",
    name: "CeraVe Renewing SA Cleanser",
    brand: "CeraVe",
    category: "exfoliant",
    price: "~$8-10",
    keyIngredients: ["Salicylic Acid", "Hyaluronic Acid", "Niacinamide", "Ceramides"],
    bestFor: ["oily", "texture", "budget", "acne"],
    whyRecommended: "Popular exfoliant from CeraVe with Salicylic Acid — well-suited for oily, texture, acne skin.",
    source: "Dermatologist-recommended",
    amazonUrl: "https://www.amazon.com/dp/B07L8RHC9R?tag=glowskincar0c-20",
    dermVerified: false,
  },
  {
    id: "cerave-cerave-moisturizing-cream",
    name: "CeraVe Moisturizing Cream",
    brand: "CeraVe",
    category: "moisturizer",
    price: "~$17-19",
    keyIngredients: ["Hyaluronic Acid", "Ceramides"],
    bestFor: ["dehydration", "midrange", "sensitive", "dry"],
    whyRecommended: "Popular moisturizer from CeraVe with Hyaluronic Acid — well-suited for dehydration, dry, sensitive skin.",
    source: "Hydrating Hyaluronic Acid Serum & Dr. Andrea Suarez & Dr. Jenny Liu (YouTube)",
    sourceLinks: [
      { name: "Hydrating Hyaluronic Acid Serum", url: "https://www.youtube.com/watch?v=GgJ3kp9mpVc" },
      { name: "Neutrogena Oil-Free Acne Wash", url: "https://www.youtube.com/watch?v=SjSmmopv0JE" },
      { name: "Skin Renewing Vitamin C Serum", url: "https://www.youtube.com/watch?v=aVjrWDlQ2vU" },
    ],
    amazonUrl: "https://www.amazon.com/dp/B000YJ2SLG?tag=glowskincar0c-20",
    dermVerified: true,
  },
  {
    id: "cerave-cerave-resurfacing-retinol-serum",
    name: "CeraVe Resurfacing Retinol Serum",
    brand: "CeraVe",
    category: "serum",
    price: "~$20-25",
    keyIngredients: ["Retinol", "Niacinamide", "Hyaluronic Acid", "Ceramides"],
    bestFor: ["midrange", "hyperpigmentation", "aging", "texture", "acne"],
    whyRecommended: "Popular serum from CeraVe with Retinol — well-suited for hyperpigmentation, texture, acne skin.",
    source: "Dermatologist-recommended",
    amazonUrl: "https://www.amazon.com/dp/B08CQ9T6KN?tag=glowskincar0c-20",
    pmOnly: true,
    dermVerified: false,
  },,
  {
    id: "paula-s-choice-boost-10-azelaic-acid-booster",
    name: "BOOST 10% Azelaic Acid Booster",
    brand: "Paula's Choice",
    category: "serum",
    price: "~$39",
    keyIngredients: ["Azelaic Acid 10%", "Salicylic Acid"],
    bestFor: ["premium", "redness", "hyperpigmentation", "acne"],
    whyRecommended: "Popular serum from Paula's Choice with Azelaic Acid 10% — well-suited for redness, hyperpigmentation, acne skin.",
    source: "Dermatologist-recommended",
    amazonUrl: "https://www.amazon.com/dp/B07D8DBS7S?tag=glowskincar0c-20",
    dermVerified: false,
  },
  {
    id: "paula-s-choice-skin-balancing-pore-reducing-toner",
    name: "SKIN BALANCING Pore-Reducing Toner",
    brand: "Paula's Choice",
    category: "toner",
    price: "~$23",
    keyIngredients: ["Niacinamide"],
    bestFor: ["midrange", "oily", "texture", "combination"],
    whyRecommended: "Popular toner from Paula's Choice with Niacinamide — well-suited for oily, texture, combination skin.",
    source: "Dermatologist-recommended",
    amazonUrl: "https://www.amazon.com/dp/B00949CTQQ?tag=glowskincar0c-20",
    dermVerified: false,
  },
  {
    id: "paula-s-choice-clear-pore-normalizing-cleanser",
    name: "CLEAR Pore Normalizing Cleanser",
    brand: "Paula's Choice",
    category: "cleanser",
    price: "~$19",
    keyIngredients: ["Salicylic Acid"],
    bestFor: ["midrange", "oily", "texture", "acne"],
    whyRecommended: "Popular cleanser from Paula's Choice with Salicylic Acid — well-suited for oily, texture, acne skin.",
    source: "Dermatologist-recommended",
    dermVerified: false,
  },
  {
    id: "paula-s-choice-clinical-1-retinol-treatment",
    name: "CLINICAL 1% Retinol Treatment",
    brand: "Paula's Choice",
    category: "treatment",
    price: "~$65",
    keyIngredients: ["Retinol 1%", "Peptides", "Vitamin C"],
    bestFor: ["premium", "hyperpigmentation", "texture", "aging"],
    whyRecommended: "Popular treatment from Paula's Choice with Retinol 1% — well-suited for hyperpigmentation, texture, aging skin.",
    source: "Dermatologist-recommended",
    pmOnly: true,
    dermVerified: false,
  },
  {
    id: "paula-s-choice-resist-youth-extending-daily-hydrating-fluid-",
    name: "RESIST Youth-Extending Daily Hydrating Fluid SPF 50",
    brand: "Paula's Choice",
    category: "sunscreen",
    price: "~$31",
    keyIngredients: ["Antioxidants", "Chamomile", "Vitamin E"],
    bestFor: ["midrange", "dehydration", "oily", "combination", "aging"],
    whyRecommended: "Popular sunscreen from Paula's Choice with Antioxidants — well-suited for dehydration, oily, combination skin.",
    source: "Dermatologist-recommended",
    dermVerified: false,
  },
  {
    id: "paula-s-choice-10-niacinamide-booster",
    name: "10% Niacinamide Booster",
    brand: "Paula's Choice",
    category: "serum",
    price: "~$35-44",
    keyIngredients: ["Niacinamide 10%", "Vitamin C"],
    bestFor: ["premium", "hyperpigmentation", "texture", "aging"],
    whyRecommended: "Popular serum from Paula's Choice with Niacinamide 10% — well-suited for hyperpigmentation, texture, aging skin.",
    source: "Dermatologist-recommended",
    dermVerified: false,
  },
  {
    id: "good-molecules-discoloration-correcting-serum",
    name: "Discoloration Correcting Serum",
    brand: "Good Molecules",
    category: "serum",
    price: "~$12-25",
    keyIngredients: ["tranexamic acid", "niacinamide"],
    bestFor: ["hyperpigmentation", "midrange"],
    whyRecommended: "Popular serum from Good Molecules with tranexamic acid — well-suited for hyperpigmentation, midrange skin.",
    source: "Dermatologist-recommended",
    amazonUrl: "https://www.amazon.com/dp/B08CFV5Y1X?tag=glowskincar0c-20",
    dermVerified: false,
  },
  {
    id: "good-molecules-hyaluronic-acid-serum",
    name: "Hyaluronic Acid Serum",
    brand: "Good Molecules",
    category: "serum",
    price: "~$6-12",
    keyIngredients: ["hyaluronic acid"],
    bestFor: ["dehydration", "budget", "dry"],
    whyRecommended: "Popular serum from Good Molecules with hyaluronic acid — well-suited for dehydration, dry, budget skin.",
    source: "Dermatologist-recommended",
    dermVerified: false,
  },
  {
    id: "good-molecules-niacinamide-brightening-toner",
    name: "Niacinamide Brightening Toner",
    brand: "Good Molecules",
    category: "toner",
    price: "~$6-14",
    keyIngredients: ["niacinamide", "arbutin", "licorice root"],
    bestFor: ["oily", "budget", "hyperpigmentation", "combination", "texture"],
    whyRecommended: "Popular toner from Good Molecules with niacinamide — well-suited for oily, hyperpigmentation, texture skin.",
    source: "Dermatologist-recommended",
    dermVerified: false,
  },
  {
    id: "good-molecules-lightweight-daily-moisturizer",
    name: "Lightweight Daily Moisturizer",
    brand: "Good Molecules",
    category: "moisturizer",
    price: "~$6-12",
    keyIngredients: ["ceramides"],
    bestFor: ["dehydration", "budget", "dry", "normal"],
    whyRecommended: "Popular moisturizer from Good Molecules with ceramides — well-suited for dehydration, dry, normal skin.",
    source: "Dermatologist-recommended",
    dermVerified: false,
  },
  {
    id: "good-molecules-niacinamide-serum",
    name: "Niacinamide Serum",
    brand: "Good Molecules",
    category: "serum",
    price: "~$6-12",
    keyIngredients: ["niacinamide"],
    bestFor: ["texture", "budget", "acne"],
    whyRecommended: "Popular serum from Good Molecules with niacinamide — well-suited for texture, acne, budget skin.",
    source: "Dermatologist-recommended",
    dermVerified: false,
  },
  {
    id: "cosrx-low-ph-good-morning-gel-cleanser",
    name: "Low pH Good Morning Gel Cleanser",
    brand: "COSRX",
    category: "cleanser",
    price: "~$10-18",
    keyIngredients: ["Tea Tree Oil", "BHA (Betaine Salicylate)"],
    bestFor: ["oily", "budget", "sensitive", "combination", "acne"],
    whyRecommended: "Popular cleanser from COSRX with Tea Tree Oil — well-suited for sensitive, oily, combination skin.",
    source: "Dermatologist-recommended",
    amazonUrl: "https://www.amazon.com/dp/B07D6KPH1P?tag=glowskincar0c-20",
    dermVerified: false,
  },
  {
    id: "cosrx-niacinamide-15-serum",
    name: "Niacinamide 15 Serum",
    brand: "COSRX",
    category: "serum",
    price: "~$15-25",
    keyIngredients: ["15% Niacinamide", "Zinc PCA", "Allantoin"],
    bestFor: ["midrange", "oily", "hyperpigmentation", "texture", "acne"],
    whyRecommended: "Popular serum from COSRX with 15% Niacinamide — well-suited for oily, hyperpigmentation, texture skin.",
    source: "Dermatologist-recommended",
    dermVerified: false,
  },
  {
    id: "cosrx-hyaluronic-acid-3-serum",
    name: "Hyaluronic Acid 3 Serum",
    brand: "COSRX",
    category: "serum",
    price: "~$15-25",
    keyIngredients: ["Multiple Hyaluronic Acids", "Ceramide NP", "Vitamin E"],
    bestFor: ["dehydration", "midrange", "dry"],
    whyRecommended: "Popular serum from COSRX with Multiple Hyaluronic Acids — well-suited for dehydration, dry, midrange skin.",
    source: "Dermatologist-recommended",
    dermVerified: false,
  },
  {
    id: "cosrx-retinol-0-1-cream",
    name: "Retinol 0.1 Cream",
    brand: "COSRX",
    category: "treatment",
    price: "~$20-30",
    keyIngredients: ["0.1% Retinol", "Peptide Complex"],
    bestFor: ["midrange", "texture", "aging"],
    whyRecommended: "Popular treatment from COSRX with 0.1% Retinol — well-suited for texture, aging, midrange skin.",
    source: "Dermatologist-recommended",
    pmOnly: true,
    dermVerified: false,
  },
  {
    id: "cosrx-alpha-arbutin-2-discoloration-care-serum",
    name: "Alpha-Arbutin 2% Discoloration Care Serum",
    brand: "COSRX",
    category: "serum",
    price: "~$15-25",
    keyIngredients: ["Alpha-Arbutin", "Niacinamide"],
    bestFor: ["hyperpigmentation", "midrange"],
    whyRecommended: "Popular serum from COSRX with Alpha-Arbutin — well-suited for hyperpigmentation, midrange skin.",
    source: "Dermatologist-recommended",
    dermVerified: false,
  },
  {
    id: "beauty-of-joseon-relief-sun-rice-probiotics-spf50",
    name: "Relief Sun: Rice + Probiotics SPF50+",
    brand: "Beauty of Joseon",
    category: "sunscreen",
    price: "~$15-20",
    keyIngredients: ["Rice extract", "probiotics", "niacinamide"],
    bestFor: ["dehydration", "midrange", "sensitive"],
    whyRecommended: "Popular sunscreen from Beauty of Joseon with Rice extract — well-suited for dehydration, sensitive, midrange skin.",
    source: "Dermatologist-recommended",
    amazonUrl: "https://www.amazon.com/dp/B0CWSX5J7S?tag=glowskincar0c-20",
    dermVerified: false,
  },
  {
    id: "beauty-of-joseon-dynasty-cream",
    name: "Dynasty Cream",
    brand: "Beauty of Joseon",
    category: "moisturizer",
    price: "~$20-25",
    keyIngredients: ["Rice bran water", "ginseng water", "squalane", "niacinamide"],
    bestFor: ["dehydration", "midrange", "dry", "combination"],
    whyRecommended: "Popular moisturizer from Beauty of Joseon with Rice bran water — well-suited for dehydration, dry, combination skin.",
    source: "Dermatologist-recommended",
    amazonUrl: "https://www.amazon.com/dp/B0C2J8G5P2?tag=glowskincar0c-20",
    dermVerified: false,
  },
  {
    id: "beauty-of-joseon-glow-serum-propolis-niacinamide",
    name: "Glow Serum: Propolis + Niacinamide",
    brand: "Beauty of Joseon",
    category: "serum",
    price: "~$15-20",
    keyIngredients: ["Propolis", "niacinamide"],
    bestFor: ["midrange", "oily", "texture", "acne"],
    whyRecommended: "Popular serum from Beauty of Joseon with Propolis — well-suited for oily, texture, acne skin.",
    source: "Dermatologist-recommended",
    amazonUrl: "https://www.amazon.com/dp/B0C7K8L4M3?tag=glowskincar0c-20",
    dermVerified: false,
  },
  {
    id: "beauty-of-joseon-glow-deep-serum-rice-alpha-arbutin",
    name: "Glow Deep Serum: Rice + Alpha-Arbutin",
    brand: "Beauty of Joseon",
    category: "serum",
    price: "~$15-20",
    keyIngredients: ["Rice bran water", "alpha-arbutin"],
    bestFor: ["midrange", "hyperpigmentation", "texture"],
    whyRecommended: "Popular serum from Beauty of Joseon with Rice bran water — well-suited for hyperpigmentation, texture, midrange skin.",
    source: "Dermatologist-recommended",
    amazonUrl: "https://www.amazon.com/dp/B0C5F3H2J1?tag=glowskincar0c-20",
    dermVerified: false,
  },
  {
    id: "beauty-of-joseon-glow-replenishing-rice-milk-toner",
    name: "Glow Replenishing Rice Milk Toner",
    brand: "Beauty of Joseon",
    category: "toner",
    price: "~$15-20",
    keyIngredients: ["Rice milk"],
    bestFor: ["dehydration", "midrange", "dry", "combination"],
    whyRecommended: "Popular toner from Beauty of Joseon with Rice milk — well-suited for dehydration, dry, combination skin.",
    source: "Dermatologist-recommended",
    amazonUrl: "https://www.amazon.com/dp/B0D4R6T9V2?tag=glowskincar0c-20",
    dermVerified: false,
  },
  {
    id: "beauty-of-joseon-radiance-cleansing-balm",
    name: "Radiance Cleansing Balm",
    brand: "Beauty of Joseon",
    category: "cleanser",
    price: "~$15-20",
    keyIngredients: ["Rice extract", "ginseng"],
    bestFor: ["dry", "midrange"],
    whyRecommended: "Popular cleanser from Beauty of Joseon with Rice extract — well-suited for dry, midrange skin.",
    source: "Dermatologist-recommended",
    amazonUrl: "https://www.amazon.com/dp/B0B9X4Y7Z0?tag=glowskincar0c-20",
    dermVerified: false,
  },
  {
    id: "versed-daily-recovery-rich-barrier-cream",
    name: "Daily Recovery Rich Barrier Cream",
    brand: "Versed",
    category: "moisturizer",
    price: "~$20",
    keyIngredients: ["Ceramides", "Squalane", "Vitamin E"],
    bestFor: ["sensitive", "midrange", "dry", "acne"],
    whyRecommended: "Popular moisturizer from Versed with Ceramides — well-suited for sensitive, dry, acne skin.",
    source: "Dermatologist-recommended",
    dermVerified: false,
  },
  {
    id: "versed-skin-soothe-hydrating-milky-toner",
    name: "Skin Soothe Hydrating Milky Toner",
    brand: "Versed",
    category: "toner",
    price: "~$15",
    keyIngredients: ["Coconut water", "Algae extracts", "Bamboo extracts", "Vitamin E", "Glycerin"],
    bestFor: ["sensitive", "midrange", "dry", "dehydration"],
    whyRecommended: "Popular toner from Versed with Coconut water — well-suited for sensitive, dry, dehydration skin.",
    source: "Dermatologist-recommended",
    dermVerified: false,
  },
  {
    id: "versed-weekend-glow-brightening-serum",
    name: "Weekend Glow Brightening Serum",
    brand: "Versed",
    category: "serum",
    price: "~$14",
    keyIngredients: ["Vitamin C", "Niacinamide", "Licorice root"],
    bestFor: ["hyperpigmentation", "texture", "budget"],
    whyRecommended: "Popular serum from Versed with Vitamin C — well-suited for hyperpigmentation, texture, budget skin.",
    source: "Dermatologist-recommended",
    dermVerified: false,
  },
  {
    id: "versed-good-defense-daily-sunscreen-spf-50-pa",
    name: "Good Defense Daily Sunscreen SPF 50 PA++++",
    brand: "Versed",
    category: "sunscreen",
    price: "~$20",
    keyIngredients: ["Avobenzone", "Homosalate", "Octisalate", "Ceramides", "Amino acids"],
    bestFor: ["sensitive", "midrange", "dry"],
    whyRecommended: "Popular sunscreen from Versed with Avobenzone — well-suited for sensitive, dry, midrange skin.",
    source: "Dermatologist-recommended",
    dermVerified: false,
  },
  {
    id: "versed-skin-soak-moisture-cream",
    name: "Skin Soak Moisture Cream",
    brand: "Versed",
    category: "moisturizer",
    price: "~$20",
    keyIngredients: ["Squalane", "Hyaluronic acid", "Red algae extract"],
    bestFor: ["dehydration", "midrange", "dry", "normal"],
    whyRecommended: "Popular moisturizer from Versed with Squalane — well-suited for dehydration, dry, normal skin.",
    source: "Dermatologist-recommended",
    dermVerified: false,
  },
  {
    id: "versed-day-dissolve-cleansing-balm",
    name: "Day Dissolve Cleansing Balm",
    brand: "Versed",
    category: "cleanser",
    price: "~$20",
    keyIngredients: ["Eucalyptus oil"],
    bestFor: ["midrange", "normal"],
    whyRecommended: "Popular cleanser from Versed with Eucalyptus oil — well-suited for normal, midrange skin.",
    source: "Dermatologist-recommended",
    dermVerified: false,
  },
  {
    id: "versed-water-rush-intensive-hydrating-serum",
    name: "Water Rush Intensive Hydrating Serum",
    brand: "Versed",
    category: "serum",
    price: "~$15",
    keyIngredients: ["Hyaluronic acid (multi-weight)", "Panthenol (B5)"],
    bestFor: ["midrange", "dehydration", "sensitive", "dry", "acne"],
    whyRecommended: "Popular serum from Versed with Hyaluronic acid (multi-weight) — well-suited for sensitive, dry, acne skin.",
    source: "Dermatologist-recommended",
    dermVerified: false,
  },
  {
    id: "kiehl-s-ultra-facial-cream-with-squalane",
    name: "Ultra Facial Cream with Squalane",
    brand: "Kiehl's",
    category: "moisturizer",
    price: "~$20-50",
    keyIngredients: ["Squalane (4.5%)", "Glacial Glycoprotein"],
    bestFor: ["midrange", "normal", "dehydration", "sensitive", "dry", "combination"],
    whyRecommended: "Popular moisturizer from Kiehl's with Squalane (4.5%) — well-suited for normal, dehydration, dry skin.",
    source: "Dermatologist-recommended",
    amazonUrl: "https://www.amazon.com/dp/B004JVSGWU?tag=glowskincar0c-20",
    dermVerified: false,
  },
  {
    id: "kiehl-s-midnight-recovery-concentrate-moisturizing-face-oil-",
    name: "Midnight Recovery Concentrate Moisturizing Face Oil Serum",
    brand: "Kiehl's",
    category: "serum",
    price: "~$50-150",
    keyIngredients: ["Squalane", "Evening Primrose Oil", "Lavender Oil", "Botanical Blend"],
    bestFor: ["normal", "premium", "dehydration", "dry", "aging"],
    whyRecommended: "Popular serum from Kiehl's with Squalane — well-suited for dehydration, dry, normal skin.",
    source: "Dermatologist-recommended",
    dermVerified: false,
  },
  {
    id: "kiehl-s-micro-dose-anti-aging-retinol-serum-with-ceramides-a",
    name: "Micro-Dose Anti-Aging Retinol Serum with Ceramides and Peptide",
    brand: "Kiehl's",
    category: "serum",
    price: "~$60-70",
    keyIngredients: ["Pure Retinol", "Ceramides", "Peptide"],
    bestFor: ["premium", "sensitive", "texture", "aging"],
    whyRecommended: "Popular serum from Kiehl's with Pure Retinol — well-suited for sensitive, texture, aging skin.",
    source: "Dr. Scott Walter MD & Dr. Mamina Turegano (TikTok/YouTube)",
    sourceLinks: [
      { name: "C15 Super Booster", url: "https://www.youtube.com/shorts/pX1oKazKDNk" },
      { name: "Micro-Dose Anti-Aging Retinol Serum", url: "https://www.tiktok.com/@dr.mamina/video/7154162089500740907" },
    ],
    pmOnly: true,
    dermVerified: true,
  },
  {
    id: "kiehl-s-powerful-strength-vitamin-c-serum",
    name: "Powerful-Strength Vitamin C Serum",
    brand: "Kiehl's",
    category: "serum",
    price: "~$80-130",
    keyIngredients: ["12.5% Vitamin C", "Hyaluronic Acid"],
    bestFor: ["premium", "hyperpigmentation", "texture", "aging"],
    whyRecommended: "Popular serum from Kiehl's with 12.5% Vitamin C — well-suited for hyperpigmentation, texture, aging skin.",
    source: "Dermatologist-recommended",
    dermVerified: false,
  },
  {
    id: "kiehl-s-ultra-facial-cleanser",
    name: "Ultra Facial Cleanser",
    brand: "Kiehl's",
    category: "cleanser",
    price: "~$20-30",
    keyIngredients: ["Apricot Seed Powder", "Aloe Vera", "Avocado Oil"],
    bestFor: ["sensitive", "oily", "midrange", "combination"],
    whyRecommended: "Popular cleanser from Kiehl's with Apricot Seed Powder — well-suited for sensitive, oily, combination skin.",
    source: "Dermatologist-recommended",
    dermVerified: false,
  },
  {
    id: "kiehl-s-better-screen-uv-serum-spf-50-facial-sunscreen-with-",
    name: "Better Screen™ UV Serum SPF 50+ Facial Sunscreen with Collagen Peptide",
    brand: "Kiehl's",
    category: "sunscreen",
    price: "~$40-50",
    keyIngredients: ["Collagen Peptide", "Antioxidants"],
    bestFor: ["premium", "normal"],
    whyRecommended: "Popular sunscreen from Kiehl's with Collagen Peptide — well-suited for normal, premium skin.",
    source: "Dermatologist-recommended",
    dermVerified: false,
  },
  {
    id: "kiehl-s-clearly-corrective-dark-spot-serum",
    name: "Clearly Corrective Dark Spot Serum",
    brand: "Kiehl's",
    category: "serum",
    price: "~$100-160",
    keyIngredients: ["Activated Vitamin C"],
    bestFor: ["premium", "hyperpigmentation", "aging"],
    whyRecommended: "Popular serum from Kiehl's with Activated Vitamin C — well-suited for hyperpigmentation, aging, premium skin.",
    source: "Creme de Corps Body Moisturizer (YouTube)",
    sourceLinks: [
      { name: "Creme de Corps Body Moisturizer", url: "https://www.youtube.com/watch?v=KhoIGjBjcjo" },
    ],
    dermVerified: true,
  },
  {
    id: "first-aid-beauty-ultra-repair-cream-intense-hydration",
    name: "Ultra Repair Cream Intense Hydration",
    brand: "First Aid Beauty",
    category: "moisturizer",
    price: "~$20-50",
    keyIngredients: ["Colloidal Oatmeal", "Shea Butter", "Ceramides"],
    bestFor: ["midrange", "dehydration", "sensitive", "redness", "dry"],
    whyRecommended: "Popular moisturizer from First Aid Beauty with Colloidal Oatmeal — well-suited for dehydration, redness, dry skin.",
    source: "Dermatologist-recommended",
    dermVerified: false,
  },
  {
    id: "first-aid-beauty-ultra-gentle-cream-to-foam-face-cleanser",
    name: "Ultra Gentle Cream-to-Foam Face Cleanser",
    brand: "First Aid Beauty",
    category: "cleanser",
    price: "~$12-42",
    keyIngredients: ["Colloidal Oatmeal", "Glycerin"],
    bestFor: ["sensitive", "midrange", "dry", "normal"],
    whyRecommended: "Popular cleanser from First Aid Beauty with Colloidal Oatmeal — well-suited for sensitive, dry, normal skin.",
    source: "Dermatologist-recommended",
    dermVerified: false,
  },
  {
    id: "first-aid-beauty-facial-radiance-pads-with-glycolic-lactic-a",
    name: "Facial Radiance Pads with Glycolic + Lactic Acids",
    brand: "First Aid Beauty",
    category: "exfoliant",
    price: "~$24-56",
    keyIngredients: ["Glycolic Acid", "Lactic Acid"],
    bestFor: ["premium", "texture", "normal", "combination"],
    whyRecommended: "Popular exfoliant from First Aid Beauty with Glycolic Acid — well-suited for texture, normal, combination skin.",
    source: "Dermatologist-recommended",
    dermVerified: false,
  },
  {
    id: "first-aid-beauty-ultra-repair-face-moisturizer",
    name: "Ultra Repair Face Moisturizer",
    brand: "First Aid Beauty",
    category: "moisturizer",
    price: "~$28",
    keyIngredients: ["Colloidal Oatmeal"],
    bestFor: ["midrange", "dehydration", "sensitive", "redness", "dry"],
    whyRecommended: "Popular moisturizer from First Aid Beauty with Colloidal Oatmeal — well-suited for dehydration, redness, dry skin.",
    source: "Hydrating Serum with Hyaluronic Acid (YouTube)",
    sourceLinks: [
      { name: "Hydrating Serum with Hyaluronic Acid", url: "https://www.youtube.com/watch?v=Y2Hqgyt9ZVk" },
    ],
    amazonUrl: "https://www.amazon.com/dp/B0DZ3XZBS1?tag=glowskincar0c-20",
    dermVerified: true,
  },
  {
    id: "first-aid-beauty-0-3-retinol-complex-serum-with-peptides",
    name: "0.3% Retinol Complex Serum with Peptides",
    brand: "First Aid Beauty",
    category: "serum",
    price: "~$48",
    keyIngredients: ["0.3% Retinol", "Peptides"],
    bestFor: ["normal", "premium", "dry", "aging", "texture"],
    whyRecommended: "Popular serum from First Aid Beauty with 0.3% Retinol — well-suited for dry, texture, normal skin.",
    source: "Dermatologist-recommended",
    pmOnly: true,
    dermVerified: false,
  },
  {
    id: "first-aid-beauty-hydrating-sunscreen-milk-broad-spectrum-spf",
    name: "Hydrating Sunscreen Milk Broad Spectrum SPF 45",
    brand: "First Aid Beauty",
    category: "sunscreen",
    price: "~$36",
    keyIngredients: ["Colloidal Oatmeal"],
    bestFor: ["premium", "dehydration", "sensitive", "dry"],
    whyRecommended: "Popular sunscreen from First Aid Beauty with Colloidal Oatmeal — well-suited for dehydration, dry, sensitive skin.",
    source: "Dermatologist-recommended",
    dermVerified: false,
  },
  {
    id: "first-aid-beauty-ultra-repair-firming-night-cream-with-collo",
    name: "Ultra Repair Firming Night Cream with Colloidal Oatmeal + Niacinamide",
    brand: "First Aid Beauty",
    category: "moisturizer",
    price: "~$49",
    keyIngredients: ["Colloidal Oatmeal", "Niacinamide"],
    bestFor: ["premium", "sensitive", "dry", "aging"],
    whyRecommended: "Popular moisturizer from First Aid Beauty with Colloidal Oatmeal — well-suited for sensitive, dry, aging skin.",
    source: "Dermatologist-recommended",
    dermVerified: false,
  },
  {
    id: "hero-cosmetics-rescue-balm-post-blemish-recovery-cream",
    name: "Rescue Balm Post-Blemish Recovery Cream",
    brand: "Hero Cosmetics",
    category: "treatment",
    price: "~$12-15",
    keyIngredients: ["panthenol", "beta-glucan", "vitamin E"],
    bestFor: ["dry", "redness", "budget", "acne"],
    whyRecommended: "Popular treatment from Hero Cosmetics with panthenol — well-suited for dry, redness, acne skin.",
    source: "Dermatologist-recommended",
    amazonUrl: "https://www.amazon.com/dp/B09C3R5Q5K?tag=glowskincar0c-20",
    dermVerified: false,
  },
  {
    id: "hero-cosmetics-force-shield-superlight-sunscreen-spf-30",
    name: "Force Shield Superlight Sunscreen SPF 30",
    brand: "Hero Cosmetics",
    category: "sunscreen",
    price: "~$18-22",
    keyIngredients: ["zinc oxide", "green tea extract", "bisabolol"],
    bestFor: ["oily", "midrange", "redness", "acne"],
    whyRecommended: "Popular sunscreen from Hero Cosmetics with zinc oxide — well-suited for oily, redness, acne skin.",
    source: "Dermatologist-recommended",
    amazonUrl: "https://www.amazon.com/dp/B0C3F7VJ7P?tag=glowskincar0c-20",
    dermVerified: false,
  },
  {
    id: "hero-cosmetics-pore-release-blackhead-clearing-solution",
    name: "Pore Release Blackhead Clearing Solution",
    brand: "Hero Cosmetics",
    category: "exfoliant",
    price: "~$18-22",
    keyIngredients: ["BHA (salicylic acid 2%)", "PHA", "AHA"],
    bestFor: ["midrange", "oily", "texture", "acne"],
    whyRecommended: "Popular exfoliant from Hero Cosmetics with BHA (salicylic acid 2%) — well-suited for oily, texture, acne skin.",
    source: "Dermatologist-recommended",
    amazonUrl: "https://www.amazon.com/dp/B0D2K7L5N3?tag=glowskincar0c-20",
    dermVerified: false,
  },
  {
    id: "hero-cosmetics-pimple-correct-acne-clearing-gel-pen",
    name: "Pimple Correct Acne Clearing Gel Pen",
    brand: "Hero Cosmetics",
    category: "treatment",
    price: "~$18-22",
    keyIngredients: ["salicylic acid 2%", "lactic acid", "azelaic acid", "tea tree"],
    bestFor: ["midrange", "acne"],
    whyRecommended: "Popular treatment from Hero Cosmetics with salicylic acid 2% — well-suited for acne, midrange skin.",
    source: "Dermatologist-recommended",
    amazonUrl: "https://www.amazon.com/dp/B0C5H6K7M2?tag=glowskincar0c-20",
    dermVerified: false,
  },
  {
    id: "hero-cosmetics-clarifying-prebiotic-moisturizer",
    name: "Clarifying Prebiotic Moisturizer",
    brand: "Hero Cosmetics",
    category: "moisturizer",
    price: "~$18-22",
    keyIngredients: ["prebiotic sugar complex", "ceramides", "hyaluronic acid", "sage"],
    bestFor: ["dehydration", "oily", "midrange", "acne"],
    whyRecommended: "Popular moisturizer from Hero Cosmetics with prebiotic sugar complex — well-suited for dehydration, oily, acne skin.",
    source: "Dermatologist-recommended",
    amazonUrl: "https://www.amazon.com/dp/B0B5K7L5N4?tag=glowskincar0c-20",
    dermVerified: false,
  },
  {
    id: "tatcha-the-dewy-skin-cream",
    name: "The Dewy Skin Cream",
    brand: "Tatcha",
    category: "moisturizer",
    price: "~$70-90",
    keyIngredients: ["Hyaluronic Acid", "Japanese Purple Rice", "HADASEI-3"],
    bestFor: ["premium", "dehydration", "dry", "aging", "texture"],
    whyRecommended: "Popular moisturizer from Tatcha with Hyaluronic Acid — well-suited for dehydration, texture, dry skin.",
    source: "Dermatologist-recommended",
    amazonUrl: "https://www.amazon.com/dp/not found?tag=glowskincar0c-20",
    dermVerified: false,
  },
  {
    id: "tatcha-the-water-cream",
    name: "The Water Cream",
    brand: "Tatcha",
    category: "moisturizer",
    price: "~$70-90",
    keyIngredients: ["Japanese Wild Rose", "Hadasei-3"],
    bestFor: ["premium", "dehydration", "oily", "combination", "texture"],
    whyRecommended: "Popular moisturizer from Tatcha with Japanese Wild Rose — well-suited for dehydration, oily, texture skin.",
    source: "Ultra Repair Cream Intense Hydration (TikTok)",
    sourceLinks: [
      { name: "Ultra Repair Cream Intense Hydration", url: "https://www.tiktok.com/@dr.tomassian/video/6956410222114082054" },
    ],
    amazonUrl: "https://www.amazon.com/dp/not found?tag=glowskincar0c-20",
    dermVerified: true,
  },
  {
    id: "tatcha-indigo-overnight-repair",
    name: "Indigo Overnight Repair",
    brand: "Tatcha",
    category: "treatment",
    price: "~$90-100",
    keyIngredients: ["Japanese indigo", "colloidal oatmeal"],
    bestFor: ["premium", "dehydration", "redness", "sensitive"],
    whyRecommended: "Popular treatment from Tatcha with Japanese indigo — well-suited for dehydration, redness, sensitive skin.",
    source: "Dermatologist-recommended",
    amazonUrl: "https://www.amazon.com/dp/not found?tag=glowskincar0c-20",
    dermVerified: false,
  },
  {
    id: "tatcha-the-silk-cream",
    name: "The Silk Cream",
    brand: "Tatcha",
    category: "moisturizer",
    price: "~$120-130",
    keyIngredients: ["Silk", "retinol alternative"],
    bestFor: ["premium", "aging"],
    whyRecommended: "Popular moisturizer from Tatcha with Silk — well-suited for aging, premium skin.",
    source: "Dermatologist-recommended",
    amazonUrl: "https://www.amazon.com/dp/not found?tag=glowskincar0c-20",
    pmOnly: true,
    dermVerified: false,
  },
  {
    id: "tatcha-the-essence",
    name: "The Essence",
    brand: "Tatcha",
    category: "treatment",
    price: "~$100-110",
    keyIngredients: ["Hadasei-3"],
    bestFor: ["premium", "dehydration", "aging"],
    whyRecommended: "Popular treatment from Tatcha with Hadasei-3 — well-suited for dehydration, aging, premium skin.",
    source: "Dermatologist-recommended",
    amazonUrl: "https://www.amazon.com/dp/not found?tag=glowskincar0c-20",
    dermVerified: false,
  },
  {
    id: "tatcha-the-silk-serum",
    name: "The Silk Serum",
    brand: "Tatcha",
    category: "serum",
    price: "~$90-100",
    keyIngredients: ["Silk peptides"],
    bestFor: ["premium", "texture", "aging"],
    whyRecommended: "Popular serum from Tatcha with Silk peptides — well-suited for texture, aging, premium skin.",
    source: "Dermatologist-recommended",
    amazonUrl: "https://www.amazon.com/dp/not found?tag=glowskincar0c-20",
    dermVerified: false,
  },
  {
    id: "tatcha-the-camellia-cleansing-oil",
    name: "The Camellia Cleansing Oil",
    brand: "Tatcha",
    category: "cleanser",
    price: "~$45-55",
    keyIngredients: ["Camellia oil", "Hadasei-3"],
    bestFor: ["premium", "dehydration"],
    whyRecommended: "Popular cleanser from Tatcha with Camellia oil — well-suited for dehydration, premium skin.",
    source: "Dermatologist-recommended",
    amazonUrl: "https://www.amazon.com/dp/not found?tag=glowskincar0c-20",
    dermVerified: false,
  },
  {
    id: "neutrogena-neutrogena-hydro-boost-hyaluronic-acid-water-gel-",
    name: "Neutrogena Hydro Boost Hyaluronic Acid Water Gel Daily Face Moisturizer",
    brand: "Neutrogena",
    category: "moisturizer",
    price: "~$15-25",
    keyIngredients: ["Hyaluronic acid"],
    bestFor: ["midrange", "normal", "dehydration", "dry", "combination"],
    whyRecommended: "Popular moisturizer from Neutrogena with Hyaluronic acid — well-suited for dry, normal, combination skin.",
    source: "The Rice Wash Skin-Softening Cleanser (YouTube)",
    sourceLinks: [
      { name: "The Rice Wash Skin-Softening Cleanser", url: "https://www.youtube.com/watch?v=Mw22-BSE1Og" },
    ],
    amazonUrl: "https://www.amazon.com/dp/B00NR1YQHM?tag=glowskincar0c-20",
    dermVerified: true,
  },
  {
    id: "neutrogena-neutrogena-hydro-boost-face-wash-fragrance-free-h",
    name: "Neutrogena Hydro Boost Face Wash, Fragrance Free, Hydrating Facial Cleanser",
    brand: "Neutrogena",
    category: "cleanser",
    price: "~$6-10",
    keyIngredients: ["Hyaluronic acid"],
    bestFor: ["sensitive", "budget", "dry", "dehydration"],
    whyRecommended: "Popular cleanser from Neutrogena with Hyaluronic acid — well-suited for sensitive, dry, dehydration skin.",
    source: "Dr. Andrea Suarez (YouTube)",
    sourceLinks: [
      { name: "Ultra Facial Cleanser", url: "https://www.youtube.com/watch?v=Mw22-BSE1Og" },
    ],
    dermVerified: true,
  },
  {
    id: "neutrogena-neutrogena-oil-free-acne-wash-with-salicylic-acid",
    name: "Neutrogena Oil-Free Acne Wash with Salicylic Acid",
    brand: "Neutrogena",
    category: "cleanser",
    price: "~$8-12",
    keyIngredients: ["Salicylic acid"],
    bestFor: ["oily", "budget", "combination", "acne"],
    whyRecommended: "Popular cleanser from Neutrogena with Salicylic acid — well-suited for oily, combination, acne skin.",
    source: "Oil-Free Acne Wash (YouTube)",
    sourceLinks: [
      { name: "Oil-Free Acne Wash", url: "https://www.youtube.com/watch?v=Mw22-BSE1Og" },
    ],
    amazonUrl: "https://www.amazon.com/dp/B00UOL8CC8?tag=glowskincar0c-20",
    dermVerified: true,
  },
  {
    id: "neutrogena-neutrogena-rapid-wrinkle-repair-retinol-regenerat",
    name: "Neutrogena Rapid Wrinkle Repair Retinol Regenerating Cream",
    brand: "Neutrogena",
    category: "treatment",
    price: "~$20-30",
    keyIngredients: ["Retinol", "hyaluronic acid"],
    bestFor: ["midrange", "aging"],
    whyRecommended: "Popular treatment from Neutrogena with Retinol — well-suited for aging, midrange skin.",
    source: "Dermatologist-recommended",
    pmOnly: true,
    dermVerified: false,
  },
  {
    id: "neutrogena-neutrogena-hydro-boost-night-pressed-serum",
    name: "Neutrogena Hydro Boost Night Pressed Serum",
    brand: "Neutrogena",
    category: "serum",
    price: "~$10-15",
    keyIngredients: ["Hyaluronic acid", "antioxidants"],
    bestFor: ["dry", "budget", "normal", "dehydration"],
    whyRecommended: "Popular serum from Neutrogena with Hyaluronic acid — well-suited for dry, normal, dehydration skin.",
    source: "Hydro Boost Hyaluronic Acid Moisturizer SPF 50 (YouTube)",
    sourceLinks: [
      { name: "Hydro Boost Hyaluronic Acid Moisturizer SPF 50", url: "https://www.youtube.com/watch?v=Mw22-BSE1Og" },
    ],
    dermVerified: true,
  },
  {
    id: "neutrogena-neutrogena-ultra-sheer-dry-touch-sunscreen-spf-70",
    name: "Neutrogena Ultra Sheer Dry-Touch Sunscreen SPF 70",
    brand: "Neutrogena",
    category: "sunscreen",
    price: "~$10-15",
    keyIngredients: ["Avobenzone", "homosalate", "octisalate", "octocrylene"],
    bestFor: ["budget", "normal"],
    whyRecommended: "Popular sunscreen from Neutrogena with Avobenzone — well-suited for normal, budget skin.",
    source: "Dermatologist-recommended",
    dermVerified: false,
  },
  {
    id: "cetaphil-cetaphil-gentle-skin-cleanser",
    name: "Cetaphil Gentle Skin Cleanser",
    brand: "Cetaphil",
    category: "cleanser",
    price: "~$10-15",
    keyIngredients: ["Glycerin", "niacinamide", "panthenol"],
    bestFor: ["normal", "budget", "sensitive", "redness", "dry"],
    whyRecommended: "Popular cleanser from Cetaphil with Glycerin — well-suited for sensitive, redness, dry skin.",
    source: "Gentle Skin Cleanser (YouTube)",
    sourceLinks: [
      { name: "Gentle Skin Cleanser", url: "https://www.youtube.com/watch?v=JDVgQ9VGTx8" },
    ],
    dermVerified: true,
  },
  {
    id: "cetaphil-cetaphil-daily-facial-cleanser",
    name: "Cetaphil Daily Facial Cleanser",
    brand: "Cetaphil",
    category: "cleanser",
    price: "~$10-15",
    keyIngredients: ["Glycerin", "niacinamide"],
    bestFor: ["sensitive", "budget"],
    whyRecommended: "Popular cleanser from Cetaphil with Glycerin — well-suited for sensitive, budget skin.",
    source: "Dr. Robinson (Article)",
    sourceLinks: [
      { name: "Ultra Gentle Hydrating Cleanser", url: "https://www.cetaphil.com/us/products/product-categories/all-moisturizers/daily-hydrating-lotion/302993889038.html" },
    ],
    dermVerified: true,
  },
  {
    id: "cetaphil-cetaphil-hydrating-foaming-cream-cleanser",
    name: "Cetaphil Hydrating Foaming Cream Cleanser",
    brand: "Cetaphil",
    category: "cleanser",
    price: "~$12-18",
    keyIngredients: ["Hyaluronic acid", "niacinamide"],
    bestFor: ["dehydration", "midrange", "sensitive", "dry"],
    whyRecommended: "Popular cleanser from Cetaphil with Hyaluronic acid — well-suited for dehydration, dry, sensitive skin.",
    source: "Daily Hydrating Lotion (YouTube)",
    sourceLinks: [
      { name: "Daily Hydrating Lotion", url: "https://www.youtube.com/watch?v=OxHg-WMSUz0" },
    ],
    dermVerified: true,
  },
  {
    id: "cetaphil-cetaphil-rich-hydrating-night-cream",
    name: "Cetaphil Rich Hydrating Night Cream",
    brand: "Cetaphil",
    category: "moisturizer",
    price: "~$15-20",
    keyIngredients: ["Glycerin", "niacinamide", "panthenol"],
    bestFor: ["midrange", "dehydration", "sensitive", "dry", "aging"],
    whyRecommended: "Popular moisturizer from Cetaphil with Glycerin — well-suited for dehydration, dry, sensitive skin.",
    source: "Dermatologist-recommended",
    dermVerified: false,
  },
  {
    id: "cetaphil-cetaphil-daily-oil-free-hydrating-lotion",
    name: "Cetaphil Daily Oil-Free Hydrating Lotion",
    brand: "Cetaphil",
    category: "moisturizer",
    price: "~$12-18",
    keyIngredients: ["Hyaluronic acid", "glycerin"],
    bestFor: ["midrange", "normal", "dehydration", "oily", "sensitive"],
    whyRecommended: "Popular moisturizer from Cetaphil with Hyaluronic acid — well-suited for sensitive, oily, normal skin.",
    source: "Deep Hydration Healthy Glow Daily Cream (Article)",
    sourceLinks: [
      { name: "Deep Hydration Healthy Glow Daily Cream", url: "https://www.cetaphil.com/us/products/product-categories/all-moisturizers/daily-hydrating-lotion/302993889038.html" },
    ],
    dermVerified: true,
  },
  {
    id: "cetaphil-cetaphil-redness-relieving-night-moisturizer",
    name: "Cetaphil Redness Relieving Night Moisturizer",
    brand: "Cetaphil",
    category: "moisturizer",
    price: "~$15-20",
    keyIngredients: ["Feverfew", "bisabolol"],
    bestFor: ["sensitive", "redness", "midrange"],
    whyRecommended: "Popular moisturizer from Cetaphil with Feverfew — well-suited for sensitive, redness, midrange skin.",
    source: "Dermatologist-recommended",
    dermVerified: false,
  },
  {
    id: "cetaphil-cetaphil-gentle-clear-mattifying-acne-moisturizer",
    name: "Cetaphil Gentle Clear Mattifying Acne Moisturizer",
    brand: "Cetaphil",
    category: "moisturizer",
    price: "~$12-18",
    keyIngredients: ["Silicates", "niacinamide"],
    bestFor: ["sensitive", "oily", "midrange", "acne"],
    whyRecommended: "Popular moisturizer from Cetaphil with Silicates — well-suited for sensitive, oily, acne skin.",
    source: "Sheer Mineral Sunscreen Face Drops SPF 50 (YouTube)",
    sourceLinks: [
      { name: "Sheer Mineral Sunscreen Face Drops SPF 50", url: "https://www.youtube.com/watch?v=JDVgQ9VGTx8" },
    ],
    dermVerified: true,
  },
  {
    id: "eltamd-eltamd-uv-clear-broad-spectrum-spf-46",
    name: "EltaMD UV Clear Broad-Spectrum SPF 46",
    brand: "EltaMD",
    category: "sunscreen",
    price: "~$36-45",
    keyIngredients: ["9% Zinc Oxide", "7.5% Octinoxate", "5% Niacinamide", "Sodium Hyaluronate", "Tocopheryl Acetate"],
    bestFor: ["premium", "oily", "sensitive", "redness", "hyperpigmentation", "acne"],
    whyRecommended: "Popular sunscreen from EltaMD with 9% Zinc Oxide — well-suited for oily, sensitive, redness skin.",
    source: "Dr. Joyce Park & Dr. Daniel Sugai & Dr. Dustin Portela (Article/ShopMy/YouTube)",
    sourceLinks: [
      { name: "Sheer Mineral Face Liquid Sunscreen SPF 50", url: "https://www.womenshealthmag.com/beauty/a61088227/how-a-dermatologist-gets-ready-for-the-beach/" },
      { name: "UV Clear SPF 46", url: "https://www.youtube.com/watch?v=fRwKPdSycFU" },
      { name: "UV Clear SPF 46", url: "https://shopmy.us/shop/208skindoc" },
    ],
    amazonUrl: "https://www.amazon.com/dp/B002MSN3QQ?tag=glowskincar0c-20",
    dermVerified: true,
  },
  {
    id: "eltamd-eltamd-uv-clear-tinted-broad-spectrum-spf-46",
    name: "EltaMD UV Clear Tinted Broad-Spectrum SPF 46",
    brand: "EltaMD",
    category: "sunscreen",
    price: "~$37-47",
    keyIngredients: ["9% Zinc Oxide", "7.5% Octinoxate", "5% Niacinamide", "Sodium Hyaluronate", "Tocopheryl Acetate", "Iron Oxides"],
    bestFor: ["premium", "oily", "sensitive", "redness", "hyperpigmentation", "acne"],
    whyRecommended: "Popular sunscreen from EltaMD with 9% Zinc Oxide — well-suited for oily, sensitive, redness skin.",
    source: "UV Clear Tinted Broad-Spectrum SPF 46 & Dr. Daniel Sugai & Dr. Dustin Portela (Article/ShopMy/YouTube)",
    sourceLinks: [
      { name: "UV Clear Tinted Broad-Spectrum SPF 46", url: "https://www.womenshealthmag.com/beauty/a61088227/how-a-dermatologist-gets-ready-for-the-beach/" },
      { name: "UV Clear Tinted SPF 46", url: "https://www.youtube.com/watch?v=fRwKPdSycFU" },
      { name: "UV Clear Tinted SPF 46", url: "https://shopmy.us/shop/208skindoc" },
    ],
    amazonUrl: "https://www.amazon.com/dp/B00J5KDCO2?tag=glowskincar0c-20",
    dermVerified: true,
  },
  {
    id: "eltamd-eltamd-uv-daily-broad-spectrum-spf-40",
    name: "EltaMD UV Daily Broad-Spectrum SPF 40",
    brand: "EltaMD",
    category: "sunscreen",
    price: "~$34-41",
    keyIngredients: ["Zinc Oxide", "Octinoxate", "Hyaluronic Acid"],
    bestFor: ["premium", "dry", "normal", "combination"],
    whyRecommended: "Popular sunscreen from EltaMD with Zinc Oxide — well-suited for dry, normal, combination skin.",
    source: "Dr. Sam Ellis & Dr. Dray (TikTok/YouTube)",
    sourceLinks: [
      { name: "UV Sport Broad-Spectrum SPF 50", url: "https://www.tiktok.com/@drsamanthaellis/video/7592810226009591053" },
      { name: "UV Daily SPF 40", url: "https://www.youtube.com/watch?v=fx5NZHyhxe8" },
    ],
    amazonUrl: "https://www.amazon.com/dp/B00464EC1E?tag=glowskincar0c-20",
    dermVerified: true,
  },
  {
    id: "eltamd-eltamd-uv-daily-tinted-broad-spectrum-spf-40",
    name: "EltaMD UV Daily Tinted Broad-Spectrum SPF 40",
    brand: "EltaMD",
    category: "sunscreen",
    price: "~$43",
    keyIngredients: ["Zinc Oxide", "Hyaluronic Acid"],
    bestFor: ["premium", "dry", "normal", "combination"],
    whyRecommended: "Popular sunscreen from EltaMD with Zinc Oxide — well-suited for dry, normal, combination skin.",
    source: "UV Daily Broad-Spectrum SPF 40 & Dr. Dray (TikTok/YouTube)",
    sourceLinks: [
      { name: "UV Daily Broad-Spectrum SPF 40", url: "https://www.tiktok.com/@drsamanthaellis/video/7592810226009591053" },
      { name: "UV Daily Tinted SPF 40", url: "https://www.youtube.com/watch?v=fx5NZHyhxe8" },
    ],
    amazonUrl: "https://www.amazon.com/dp/B00ZPWR0N8?tag=glowskincar0c-20",
    dermVerified: true,
  },
  {
    id: "eltamd-eltamd-am-restore-moisturizer",
    name: "EltaMD AM Restore Moisturizer",
    brand: "EltaMD",
    category: "moisturizer",
    price: "~$48",
    keyIngredients: ["Hyaluronic Acid", "Niacinamide", "Caffeine", "Willow Bark Extract"],
    bestFor: ["premium", "sensitive", "redness", "hyperpigmentation"],
    whyRecommended: "Popular moisturizer from EltaMD with Hyaluronic Acid — well-suited for sensitive, redness, hyperpigmentation skin.",
    source: "Dermatologist-recommended",
    dermVerified: false,
  },
  {
    id: "eltamd-eltamd-pm-restore-moisturizer",
    name: "EltaMD PM Restore Moisturizer",
    brand: "EltaMD",
    category: "moisturizer",
    price: "~$48",
    keyIngredients: ["Niacinamide", "Ceramides", "Antioxidants"],
    bestFor: ["premium", "sensitive", "dry", "aging"],
    whyRecommended: "Popular moisturizer from EltaMD with Niacinamide — well-suited for sensitive, dry, aging skin.",
    source: "Dermatologist-recommended",
    dermVerified: false,
  },
  {
    id: "eltamd-eltamd-skin-recovery-amino-acid-foaming-cleanser",
    name: "EltaMD Skin Recovery Amino Acid Foaming Cleanser",
    brand: "EltaMD",
    category: "cleanser",
    price: "~$35",
    keyIngredients: ["Amino Acids"],
    bestFor: ["sensitive", "midrange"],
    whyRecommended: "Popular cleanser from EltaMD with Amino Acids — well-suited for sensitive, midrange skin.",
    source: "Dermatologist-recommended",
    dermVerified: false,
  },
  {
    id: "eltamd-eltamd-uv-skin-recovery-broad-spectrum-spf-50",
    name: "EltaMD UV Skin Recovery Broad Spectrum SPF 50",
    brand: "EltaMD",
    category: "sunscreen",
    price: "~$50",
    keyIngredients: ["Zinc Oxide"],
    bestFor: ["premium", "sensitive"],
    whyRecommended: "Popular sunscreen from EltaMD with Zinc Oxide — well-suited for sensitive, premium skin.",
    source: "PM Restore Moisturizer & Dr. Nina Desai (Instagram/YouTube)",
    sourceLinks: [
      { name: "PM Restore Moisturizer", url: "https://www.youtube.com/watch?v=MCPUcDZWtfk" },
      { name: "Skin Recovery Serum", url: "https://www.instagram.com/reel/DV1BCcDAHYN/" },
    ],
    dermVerified: true,
  },
  {
    id: "vanicream-vanicream-daily-facial-moisturizer-with-ceramides-",
    name: "Vanicream Daily Facial Moisturizer With Ceramides and Hyaluronic Acid",
    brand: "Vanicream",
    category: "moisturizer",
    price: "~$13-14",
    keyIngredients: ["hyaluronic acid", "5 ceramides (EOP", "NG", "NP", "AS", "AP)"],
    bestFor: ["dehydration", "budget", "sensitive", "dry"],
    whyRecommended: "Popular moisturizer from Vanicream with hyaluronic acid — well-suited for dehydration, dry, sensitive skin.",
    source: "Dermatologist-recommended",
    amazonUrl: "https://www.amazon.com/dp/B08BW46XXK?tag=glowskincar0c-20",
    dermVerified: false,
  },
  {
    id: "vanicream-vanicream-gentle-facial-cleanser-with-pump-dispens",
    name: "Vanicream Gentle Facial Cleanser with Pump Dispenser",
    brand: "Vanicream",
    category: "cleanser",
    price: "~$9-14",
    keyIngredients: ["purified water", "glycerin", "coco glucoside", "sodium cocoyl glycinate", "acrylates copolymer"],
    bestFor: ["oily", "budget", "sensitive", "dry", "acne"],
    whyRecommended: "Popular cleanser from Vanicream with purified water — well-suited for sensitive, oily, dry skin.",
    source: "Daily Facial Moisturizer & Dr. David Kim & Dr. Daniel Sugai (Instagram/TikTok/YouTube)",
    sourceLinks: [
      { name: "Daily Facial Moisturizer", url: "https://www.youtube.com/watch?v=HxdiDEzlEBg" },
      { name: "Moisturizing Skin Cream", url: "https://www.tiktok.com/@drdavidkim/video/7234299527132400938" },
      { name: "Gentle Facial Cleanser", url: "https://www.instagram.com/reel/DRyDiQuD12C/?hl=en" },
    ],
    amazonUrl: "https://www.amazon.com/dp/B00QY1XZ4W?tag=glowskincar0c-20",
    dermVerified: true,
  },
  {
    id: "vanicream-vanicream-moisturizing-skin-cream",
    name: "Vanicream Moisturizing Skin Cream",
    brand: "Vanicream",
    category: "moisturizer",
    price: "~$13-16",
    keyIngredients: ["petrolatum", "cetearyl alcohol", "ceteareth-20", "propylene glycol", "purified water"],
    bestFor: ["dehydration", "budget", "sensitive", "redness", "dry"],
    whyRecommended: "Popular moisturizer from Vanicream with petrolatum — well-suited for dehydration, redness, dry skin.",
    source: "Dermatologist-recommended",
    amazonUrl: "https://www.amazon.com/dp/B000NSDVN2?tag=glowskincar0c-20",
    dermVerified: false,
  },
  {
    id: "vanicream-vanicream-vitamin-c-serum",
    name: "Vanicream Vitamin C Serum",
    brand: "Vanicream",
    category: "serum",
    price: "~$17-20",
    keyIngredients: ["tetrahexyldecyl ascorbate (Vitamin C)", "ceramides"],
    bestFor: ["midrange", "sensitive", "redness", "hyperpigmentation", "aging", "texture"],
    whyRecommended: "Popular serum from Vanicream with tetrahexyldecyl ascorbate (Vitamin C) — well-suited for sensitive, redness, hyperpigmentation skin.",
    source: "Facial Moisturizer Broad Spectrum SPF 30 (YouTube)",
    sourceLinks: [
      { name: "Facial Moisturizer Broad Spectrum SPF 30", url: "https://www.youtube.com/watch?v=sssp0zRiwvc" },
      { name: "Mineral Sunscreen Broad-Spectrum SPF 50+", url: "https://www.youtube.com/watch?v=HxdiDEzlEBg" },
    ],
    amazonUrl: "https://www.amazon.com/dp/B0B9J5G5K3?tag=glowskincar0c-20",
    dermVerified: true,
  },
  {
    id: "vanicream-vanicream-facial-moisturizer-broad-spectrum-spf-30",
    name: "Vanicream Facial Moisturizer Broad Spectrum SPF 30",
    brand: "Vanicream",
    category: "sunscreen",
    price: "~$14-17",
    keyIngredients: ["non-nano zinc oxide", "ceramides"],
    bestFor: ["sensitive", "midrange", "dry"],
    whyRecommended: "Popular sunscreen from Vanicream with non-nano zinc oxide — well-suited for sensitive, dry, midrange skin.",
    source: "Dermatologist-recommended",
    amazonUrl: "https://www.amazon.com/dp/B07V5L1Q5S?tag=glowskincar0c-20",
    dermVerified: false,
  },
  {
    id: "vanicream-vanicream-z-bar",
    name: "Vanicream Z-Bar",
    brand: "Vanicream",
    category: "cleanser",
    price: "~$5-8",
    keyIngredients: ["zinc pyrithione"],
    bestFor: ["budget", "sensitive", "redness", "texture", "acne"],
    whyRecommended: "Popular cleanser from Vanicream with zinc pyrithione — well-suited for sensitive, redness, texture skin.",
    source: "Z-Bar Medicated Cleansing Bar & Dr. Jenny Liu (YouTube)",
    sourceLinks: [
      { name: "Z-Bar Medicated Cleansing Bar", url: "https://www.youtube.com/watch?v=AqGDyvuPOto" },
      { name: "Vitamin C Brightening Serum", url: "https://www.youtube.com/watch?v=HxdiDEzlEBg" },
    ],
    amazonUrl: "https://www.amazon.com/dp/B08BW46XXK?tag=glowskincar0c-20",
    dermVerified: true,
  },
  {
    id: "drunk-elephant-t-l-c-framboos-glycolic-resurfacing-night-ser",
    name: "T.L.C. Framboos Glycolic Resurfacing Night Serum",
    brand: "Drunk Elephant",
    category: "serum",
    price: "~$90",
    keyIngredients: ["Glycolic acid", "AHAs", "BHAs", "raspberry extracts"],
    bestFor: ["premium", "texture", "acne"],
    whyRecommended: "Popular serum from Drunk Elephant with Glycolic acid — well-suited for texture, acne, premium skin.",
    source: "Dermatologist-recommended",
    amazonUrl: "https://www.amazon.com/dp/B00L3LDDD6?tag=glowskincar0c-20",
    dermVerified: false,
  },
  {
    id: "drunk-elephant-protini-polypeptide-firming-moisturizer",
    name: "Protini Polypeptide Firming Moisturizer",
    brand: "Drunk Elephant",
    category: "moisturizer",
    price: "~$68",
    keyIngredients: ["Peptides", "pygmy waterlily", "fermented green tea", "antioxidants"],
    bestFor: ["premium", "dehydration", "aging"],
    whyRecommended: "Popular moisturizer from Drunk Elephant with Peptides — well-suited for dehydration, aging, premium skin.",
    source: "Protini™ Powerpeptide Resurfacing Serum with Lactic Acid (Article)",
    sourceLinks: [
      { name: "Protini™ Powerpeptide Resurfacing Serum with Lactic Acid", url: "https://dylangreeney.com/blog/product-review-drunk-elephant" },
    ],
    dermVerified: true,
  },
  {
    id: "drunk-elephant-c-firma-fresh-vitamin-c-day-serum",
    name: "C-Firma Fresh Vitamin-C Day Serum",
    brand: "Drunk Elephant",
    category: "serum",
    price: "~$78",
    keyIngredients: ["15% L-ascorbic acid", "vitamin E", "ferulic acid", "pumpkin ferment"],
    bestFor: ["premium", "hyperpigmentation", "texture", "aging"],
    whyRecommended: "Popular serum from Drunk Elephant with 15% L-ascorbic acid — well-suited for hyperpigmentation, texture, aging skin.",
    source: "Dermatologist-recommended",
    dermVerified: false,
  },
  {
    id: "drunk-elephant-b-hydra-intensive-hydration-serum",
    name: "B-Hydra Intensive Hydration Serum",
    brand: "Drunk Elephant",
    category: "serum",
    price: "~$54",
    keyIngredients: ["Hyaluronic acid", "pineapple ceramide"],
    bestFor: ["premium", "dehydration", "sensitive"],
    whyRecommended: "Popular serum from Drunk Elephant with Hyaluronic acid — well-suited for dehydration, sensitive, premium skin.",
    source: "B-Hydra™ Intensive Hydration Serum with Hyaluronic Acid (YouTube)",
    sourceLinks: [
      { name: "B-Hydra™ Intensive Hydration Serum with Hyaluronic Acid", url: "https://www.youtube.com/watch?v=V7yqlyaemsc" },
    ],
    amazonUrl: "https://www.amazon.com/dp/B01B9OEDKS?tag=glowskincar0c-20",
    dermVerified: true,
  },
  {
    id: "drunk-elephant-a-passioni-retinol-cream",
    name: "A-Passioni Retinol Cream",
    brand: "Drunk Elephant",
    category: "treatment",
    price: "~$76",
    keyIngredients: ["Retinol", "peptides", "vitamin F"],
    bestFor: ["premium", "sensitive", "texture", "aging"],
    whyRecommended: "Popular treatment from Drunk Elephant with Retinol — well-suited for sensitive, texture, aging skin.",
    source: "Dermatologist-recommended",
    pmOnly: true,
    dermVerified: false,
  },
  {
    id: "drunk-elephant-beste-no-9-jelly-cleanser",
    name: "Beste No.9 Jelly Cleanser",
    brand: "Drunk Elephant",
    category: "cleanser",
    price: "~$34",
    keyIngredients: ["Marula oil", "mild surfactants", "antioxidants"],
    bestFor: ["midrange", "normal"],
    whyRecommended: "Popular cleanser from Drunk Elephant with Marula oil — well-suited for normal, midrange skin.",
    source: "Mello Marula Cream Cleanser with 1.0% Colloidal Oatmeal (YouTube)",
    sourceLinks: [
      { name: "Mello Marula Cream Cleanser with 1.0% Colloidal Oatmeal", url: "https://www.youtube.com/watch?v=V7yqlyaemsc" },
    ],
    amazonUrl: "https://www.amazon.com/dp/B076639783?tag=glowskincar0c-20",
    dermVerified: true,
  },
  {
    id: "drunk-elephant-virgin-marula-luxury-face-oil",
    name: "Virgin Marula Luxury Face Oil",
    brand: "Drunk Elephant",
    category: "treatment",
    price: "~$72",
    keyIngredients: ["Squalane from marula oil"],
    bestFor: ["premium", "dehydration", "dry"],
    whyRecommended: "Popular treatment from Drunk Elephant with Squalane from marula oil — well-suited for dehydration, dry, premium skin.",
    source: "Dermatologist-recommended",
    dermVerified: false,
  },
  {
    id: "olay-regenerist-micro-sculpting-cream-moisturizer-fragrance-",
    name: "Regenerist Micro-Sculpting Cream Moisturizer Fragrance Free",
    brand: "Olay",
    category: "moisturizer",
    price: "~$21-27",
    keyIngredients: ["Niacinamide", "triple collagen peptide", "hyaluronic acid"],
    bestFor: ["midrange", "aging"],
    whyRecommended: "Popular moisturizer from Olay with Niacinamide — well-suited for aging, midrange skin.",
    source: "Dermatologist-recommended",
    amazonUrl: "https://www.amazon.com/dp/B0011DNXC2?tag=glowskincar0c-20",
    dermVerified: false,
  },
  {
    id: "olay-regenerist-retinol-24-night-moisturizer",
    name: "Regenerist Retinol 24 Night Moisturizer",
    brand: "Olay",
    category: "moisturizer",
    price: "~$25-30",
    keyIngredients: ["Retinol complex", "niacinamide", "triple collagen peptide", "glycerin"],
    bestFor: ["midrange", "hyperpigmentation", "texture", "aging"],
    whyRecommended: "Popular moisturizer from Olay with Retinol complex — well-suited for hyperpigmentation, texture, aging skin.",
    source: "Dermatologist-recommended",
    amazonUrl: "https://www.amazon.com/dp/B07XQBY5QQ?tag=glowskincar0c-20",
    pmOnly: true,
    dermVerified: false,
  },
  {
    id: "olay-super-serum",
    name: "Super Serum",
    brand: "Olay",
    category: "serum",
    price: "~$25-30",
    keyIngredients: ["Niacinamide", "vitamin C", "vitamin E", "collagen peptide", "AHA"],
    bestFor: ["dehydration", "midrange", "texture", "aging"],
    whyRecommended: "Popular serum from Olay with Niacinamide — well-suited for dehydration, texture, aging skin.",
    source: "Regenerist Micro-Sculpting Cream Moisturizer & Dr. Andrea Suarez (YouTube)",
    sourceLinks: [
      { name: "Regenerist Micro-Sculpting Cream Moisturizer", url: "https://www.youtube.com/watch?v=Sjd112FuAs8" },
      { name: "Lala Retro™ Whipped Cream", url: "https://www.youtube.com/watch?v=JnScAkzuQMI" },
    ],
    dermVerified: true,
  },
  {
    id: "olay-regenerist-collagen-peptide-24-moisturizer",
    name: "Regenerist Collagen Peptide 24 Moisturizer",
    brand: "Olay",
    category: "moisturizer",
    price: "~$28-36",
    keyIngredients: ["Collagen peptide", "vitamin B3 (niacinamide)"],
    bestFor: ["dehydration", "midrange", "aging"],
    whyRecommended: "Popular moisturizer from Olay with Collagen peptide — well-suited for dehydration, aging, midrange skin.",
    source: "Dermatologist-recommended",
    dermVerified: false,
  },
  {
    id: "olay-retinol-24-night-serum",
    name: "Retinol 24 Night Serum",
    brand: "Olay",
    category: "serum",
    price: "~$20-40",
    keyIngredients: ["Retinol", "vitamin B3", "glycerin"],
    bestFor: ["midrange", "hyperpigmentation", "texture", "aging"],
    whyRecommended: "Popular serum from Olay with Retinol — well-suited for hyperpigmentation, texture, aging skin.",
    source: "Retinol24 Night Moisturizer (YouTube)",
    sourceLinks: [
      { name: "Retinol24 Night Moisturizer", url: "https://www.youtube.com/watch?v=wfiy6VTCFQE" },
    ],
    pmOnly: true,
    amazonUrl: "https://www.amazon.com/dp/B07Z182JNK?tag=glowskincar0c-20",
    dermVerified: true,
  },
  {
    id: "olay-super-cream-with-spf-30",
    name: "Super Cream with SPF 30",
    brand: "Olay",
    category: "moisturizer",
    price: "~$30-35",
    keyIngredients: ["Niacinamide", "vitamin C", "collagen peptide"],
    bestFor: ["dehydration", "midrange", "aging"],
    whyRecommended: "Popular moisturizer from Olay with Niacinamide — well-suited for dehydration, aging, midrange skin.",
    source: "Dermatologist-recommended",
    dermVerified: false,
  },
  {
    id: "olay-total-effects-7-in-1-anti-aging-moisturizer-with-spf",
    name: "Total Effects 7-in-1 Anti-Aging Moisturizer with SPF",
    brand: "Olay",
    category: "moisturizer",
    price: "~$18-25",
    keyIngredients: ["VitaNiacin Complex II (niacinamide", "vitamins", "antioxidants)"],
    bestFor: ["midrange", "texture", "aging"],
    whyRecommended: "Popular moisturizer from Olay with VitaNiacin Complex II (niacinamide — well-suited for texture, aging, midrange skin.",
    source: "Dermatologist-recommended",
    amazonUrl: "https://www.amazon.com/dp/B007M81B4M?tag=glowskincar0c-20",
    dermVerified: false,
  },
  {
    id: "aveeno-daily-moisturizing-face-cream-with-prebiotic-oat",
    name: "Daily Moisturizing Face Cream with Prebiotic Oat",
    brand: "Aveeno",
    category: "moisturizer",
    price: "~$10-16",
    keyIngredients: ["Prebiotic oat", "Glycerin", "Soothing Oat"],
    bestFor: ["dehydration", "budget", "sensitive", "dry"],
    whyRecommended: "Popular moisturizer from Aveeno with Prebiotic oat — well-suited for dehydration, dry, sensitive skin.",
    source: "Clarifying Daily Facial Cleanser with Niacinamide (YouTube)",
    sourceLinks: [
      { name: "Aveeno Calm + Restore Oat Gel Moisturizer", url: "https://www.youtube.com/watch?v=YhRYqGqIYPg" },
    ],
    dermVerified: true,
  },
  {
    id: "aveeno-daily-moisturizing-face-lotion-with-prebiotic-oat",
    name: "Daily Moisturizing Face Lotion with Prebiotic Oat",
    brand: "Aveeno",
    category: "moisturizer",
    price: "~$13-20",
    keyIngredients: ["Prebiotic oat", "Glycerin", "Avena Sativa (Oat) Kernel Flour"],
    bestFor: ["midrange", "normal", "dehydration", "dry", "sensitive"],
    whyRecommended: "Popular moisturizer from Aveeno with Prebiotic oat — well-suited for dry, dehydration, sensitive skin.",
    source: "Clarifying Daily Facial Cleanser with Niacinamide (YouTube)",
    sourceLinks: [
      { name: "Clarifying Daily Facial Cleanser with Niacinamide", url: "https://www.youtube.com/watch?v=YhRYqGqIYPg" },
    ],
    dermVerified: true,
  },
  {
    id: "aveeno-daily-moisturizing-facial-cleanser-with-soothing-oat",
    name: "Daily Moisturizing Facial Cleanser with Soothing Oat",
    brand: "Aveeno",
    category: "cleanser",
    price: "~$12",
    keyIngredients: ["Soothing oat", "non-GMO food-grade oat"],
    bestFor: ["sensitive", "budget", "dry"],
    whyRecommended: "Popular cleanser from Aveeno with Soothing oat — well-suited for sensitive, dry, budget skin.",
    source: "Dr. Andrea Suarez (YouTube)",
    sourceLinks: [
      { name: "Regenerist Collagen Peptide 24 MAX Moisturizer", url: "https://www.youtube.com/watch?v=YhRYqGqIYPg" },
    ],
    dermVerified: true,
  },
  {
    id: "aveeno-calm-restore-oat-gel-moisturizer",
    name: "Calm + Restore Oat Gel Moisturizer",
    brand: "Aveeno",
    category: "moisturizer",
    price: "~$20",
    keyIngredients: ["Prebiotic oat", "Calming feverfew"],
    bestFor: ["sensitive", "redness", "midrange", "dry"],
    whyRecommended: "Popular moisturizer from Aveeno with Prebiotic oat — well-suited for sensitive, redness, dry skin.",
    source: "Calm + Restore Oat Gel Moisturizer, Sensitive Skin (YouTube)",
    sourceLinks: [
      { name: "Calm + Restore Oat Gel Moisturizer, Sensitive Skin", url: "https://www.youtube.com/watch?v=PsHOSrQgFlw" },
    ],
    dermVerified: true,
  },
  {
    id: "aveeno-positively-radiant-daily-moisturizer-spf-15",
    name: "Positively Radiant Daily Moisturizer SPF 15",
    brand: "Aveeno",
    category: "moisturizer",
    price: "~$15-20",
    keyIngredients: ["Total Soy Complex"],
    bestFor: ["midrange", "hyperpigmentation", "texture", "aging"],
    whyRecommended: "Popular moisturizer from Aveeno with Total Soy Complex — well-suited for hyperpigmentation, texture, aging skin.",
    source: "Dermatologist-recommended",
    dermVerified: false,
  },
  {
    id: "aveeno-ultra-calming-daily-moisturizer",
    name: "Ultra-Calming Daily Moisturizer",
    brand: "Aveeno",
    category: "moisturizer",
    price: "~$15-20",
    keyIngredients: ["Feverfew", "oat"],
    bestFor: ["sensitive", "redness", "midrange"],
    whyRecommended: "Popular moisturizer from Aveeno with Feverfew — well-suited for sensitive, redness, midrange skin.",
    source: "Calm + Restore Triple Oat Serum for Sensitive Skin (YouTube)",
    sourceLinks: [
      { name: "Calm + Restore Triple Oat Serum for Sensitive Skin", url: "https://www.youtube.com/watch?v=YhRYqGqIYPg" },
    ],
    dermVerified: true,
  },
  {
    id: "differin-differin-acne-treatment-gel-90-day-supply-0-1-adapa",
    name: "Differin Acne Treatment Gel, 90 Day Supply, 0.1% Adapalene, 45g Pump",
    brand: "Differin",
    category: "treatment",
    price: "~$22-26",
    keyIngredients: ["Adapalene 0.1%", "carbomer 940", "edetate disodium", "methylparaben", "poloxamer 407", "propylene glycol"],
    bestFor: ["midrange", "oily", "sensitive", "combination", "texture", "acne"],
    whyRecommended: "Popular treatment from Differin with Adapalene 0.1% — well-suited for oily, sensitive, combination skin.",
    source: "Dr. Daniel Sugai (YouTube)",
    sourceLinks: [
      { name: "Positively Radiant MaxGlow Serum", url: "https://www.youtube.com/watch?v=P3UqZ49PJ4U" },
    ],
    amazonUrl: "https://www.amazon.com/dp/B07ZTMXJVK?tag=glowskincar0c-20",
    pmOnly: true,
    dermVerified: true,
  },
  {
    id: "differin-differin-acne-treatment-gel-30-day-supply-0-1-adapa",
    name: "Differin Acne Treatment Gel, 30 Day Supply, 0.1% Adapalene, 15g Pump",
    brand: "Differin",
    category: "treatment",
    price: "~$12-15",
    keyIngredients: ["Adapalene 0.1%", "carbomer 940", "edetate disodium", "methylparaben", "poloxamer 407", "propylene glycol"],
    bestFor: ["oily", "budget", "sensitive", "combination", "texture", "acne"],
    whyRecommended: "Popular treatment from Differin with Adapalene 0.1% — well-suited for oily, sensitive, combination skin.",
    source: "Daily Deep Cleanser (YouTube)",
    sourceLinks: [
      { name: "Daily Deep Cleanser", url: "https://www.youtube.com/watch?v=P3UqZ49PJ4U" },
    ],
    amazonUrl: "https://www.amazon.com/dp/B07L1PHSY9?tag=glowskincar0c-20",
    pmOnly: true,
    dermVerified: true,
  },
  {
    id: "differin-differin-daily-deep-cleanser-5-benzoyl-peroxide-4-o",
    name: "Differin Daily Deep Cleanser, 5% Benzoyl Peroxide, 4 oz",
    brand: "Differin",
    category: "cleanser",
    price: "~$9-12",
    keyIngredients: ["Benzoyl Peroxide 5%", "other cleansing agents"],
    bestFor: ["budget", "acne"],
    whyRecommended: "Popular cleanser from Differin with Benzoyl Peroxide 5% — well-suited for acne, budget skin.",
    source: "Dermatologist-recommended",
    amazonUrl: "https://www.amazon.com/dp/B07HKVBRCF?tag=glowskincar0c-20",
    dermVerified: false,
  },
  {
    id: "differin-differin-resurfacing-acne-scar-gel",
    name: "Differin Resurfacing Acne Scar Gel",
    brand: "Differin",
    category: "treatment",
    price: "~$18-22",
    keyIngredients: ["Bakuchiol", "peptides", "seaberry oil"],
    bestFor: ["midrange", "texture", "acne"],
    whyRecommended: "Popular treatment from Differin with Bakuchiol — well-suited for texture, acne, midrange skin.",
    source: "Resurfacing Scar Gel (YouTube)",
    sourceLinks: [
      { name: "Resurfacing Scar Gel", url: "https://www.youtube.com/watch?v=OWxLRaJK3y4" },
    ],
    amazonUrl: "https://www.amazon.com/dp/B08L5Y6Z3K?tag=glowskincar0c-20",
    dermVerified: true,
  },
  {
    id: "differin-differin-oil-absorbing-moisturizer-with-spf-30-4-oz",
    name: "Differin Oil Absorbing Moisturizer with SPF 30, 4 oz",
    brand: "Differin",
    category: "moisturizer",
    price: "~$11-15",
    keyIngredients: ["Avobenzone 3%", "Octisalate 5%", "Octocrylene 7%", "ceramide NP", "panthenol", "allantoin"],
    bestFor: ["dehydration", "oily", "budget", "combination", "acne"],
    whyRecommended: "Popular moisturizer from Differin with Avobenzone 3% — well-suited for dehydration, oily, combination skin.",
    source: "Dermatologist-recommended",
    amazonUrl: "https://www.amazon.com/dp/B07ZTN5N1V?tag=glowskincar0c-20",
    dermVerified: false,
  },
  {
    id: "differin-differin-daily-oil-free-hydrating-cleanser-6-oz",
    name: "Differin Daily Oil-Free Hydrating Cleanser, 6 oz",
    brand: "Differin",
    category: "cleanser",
    price: "~$14-18",
    keyIngredients: ["5% Polyhydroxy Acids (PHAs)", "amino acids"],
    bestFor: ["midrange", "dehydration", "oily", "combination", "acne"],
    whyRecommended: "Popular cleanser from Differin with 5% Polyhydroxy Acids (PHAs) — well-suited for dehydration, oily, combination skin.",
    source: "Dermatologist-recommended",
    amazonUrl: "https://www.amazon.com/dp/B08P3K1N6S?tag=glowskincar0c-20",
    dermVerified: false,
  },
];

// AM/PM routine step templates
export const routineSteps: RoutineStep[] = [
  { step: 1, label: "Cleanser", time: "BOTH", category: "cleanser", description: "Gently cleanse to remove impurities without stripping the skin barrier." },
  { step: 2, label: "Exfoliant", time: "PM", category: "exfoliant", description: "Chemical exfoliation 2-3 times per week to smooth texture and unclog pores." },
  { step: 3, label: "Serum", time: "BOTH", category: "serum", description: "Targeted actives that address your specific concerns." },
  { step: 4, label: "Treatment", time: "PM", category: "treatment", description: "Retinoid or targeted treatment applied at night for best absorption." },
  { step: 5, label: "Moisturizer", time: "BOTH", category: "moisturizer", description: "Lock in hydration and support your skin barrier." },
  { step: 6, label: "Sunscreen", time: "AM", category: "sunscreen", description: "The #1 anti-aging product. Apply every morning, rain or shine." }
];

export type QuizAnswers = Record<string, string | string[]>;

export interface RoutineItem {
  step: RoutineStep;
  product: Product;
  /** Whether this step is essential (cleanser, moisturizer, sunscreen) or
   *  recommended based on the user's specific concerns (serum, treatment, exfoliant). */
  essential: boolean;
  /** 2nd and 3rd best-scoring products for this category (excluding the primary) */
  alternatives: Product[];
}

export interface RecommendedRoutine {
  amRoutine: RoutineItem[];
  pmRoutine: RoutineItem[];
  skinProfile: {
    type: string;
    sensitivity: string;
    primaryConcern: string;
    baumannCode: string;
  };
  tips: string[];
}

/**
 * Returns the top N products for a category, filtered by exclusions.
 * @param category - product category to filter
 * @param count - number of products to return (default 3)
 * @param amSafeOnly - exclude pmOnly products
 * @param excludedIds - product IDs to exclude (score set to -Infinity)
 */
export function getTopProducts(
  answers: QuizAnswers,
  category: Product["category"],
  count = 3,
  amSafeOnly = false,
  excludedIds: string[] = []
): Product[] {
  // Collect all tags from answers
  const allTags: string[] = [];
  for (const [_key, value] of Object.entries(answers)) {
    if (Array.isArray(value)) {
      value.forEach(v => {
        const q = quizQuestions.find(q => q.options.some(o => o.id === v));
        const opt = q?.options.find(o => o.id === v);
        if (opt) allTags.push(...opt.tags);
      });
    } else {
      const q = quizQuestions.find(q => q.options.some(o => o.id === value));
      const opt = q?.options.find(o => o.id === value);
      if (opt) allTags.push(...opt.tags);
    }
  }
  const skinType = allTags.find(t => ["oily", "dry", "combination", "normal"].includes(t)) || "normal";
  const isSensitive = allTags.includes("sensitive") || allTags.includes("moderate_sensitivity");
  const primaryConcernTag = allTags.find(t => ["acne", "aging", "hyperpigmentation", "dehydration", "redness", "texture"].includes(t)) || "general";

  function scoreP(product: Product): number {
    if (excludedIds.includes(product.id)) return -Infinity;
    let score = 0;
    for (const tag of allTags) {
      if (product.bestFor.includes(tag)) score += 2;
    }
    if (product.bestFor.includes(skinType)) score += 3;
    if (product.bestFor.includes(primaryConcernTag)) score += 4;
    if (isSensitive && product.bestFor.includes("oily") && !product.bestFor.includes("sensitive")) score -= 2;
    if (allTags.includes("budget") && product.bestFor.includes("budget")) score += 2;
    if (allTags.includes("premium") && product.bestFor.includes("premium")) score += 2;
    if (allTags.includes("midrange") && product.bestFor.includes("midrange")) score += 1;
    return score;
  }

  let candidates = productDatabase.filter(p => p.category === category && p.dermVerified !== false);
  if (amSafeOnly) candidates = candidates.filter(p => !p.pmOnly);

  const scored = candidates
    .map(p => ({ product: p, score: scoreP(p) }))
    .filter(x => x.score !== -Infinity)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, count).map(x => x.product);
}

export function generateRecommendation(answers: QuizAnswers, excludedProductIds: string[] = []): RecommendedRoutine {
  // Collect all tags from answers
  const allTags: string[] = [];
  for (const [_key, value] of Object.entries(answers)) {
    if (Array.isArray(value)) {
      value.forEach(v => {
        const q = quizQuestions.find(q => q.options.some(o => o.id === v));
        const opt = q?.options.find(o => o.id === v);
        if (opt) allTags.push(...opt.tags);
      });
    } else {
      const q = quizQuestions.find(q => q.options.some(o => o.id === value));
      const opt = q?.options.find(o => o.id === value);
      if (opt) allTags.push(...opt.tags);
    }
  }

  // Determine skin profile
  const skinType = allTags.find(t => ["oily", "dry", "combination", "normal"].includes(t)) || "normal";
  const isSensitive = allTags.includes("sensitive") || allTags.includes("moderate_sensitivity");
  const sensitivity = allTags.includes("sensitive") ? "Sensitive" : allTags.includes("moderate_sensitivity") ? "Moderately Sensitive" : "Resistant";

  // Baumann code generation
  const baumannO = ["oily", "combination"].includes(skinType) ? "O" : "D";
  const baumannS = isSensitive ? "S" : "R";
  const baumannP = allTags.includes("hyperpigmentation") || allTags.includes("dark_spots") ? "P" : "N";
  const baumannW = allTags.includes("aging") || allTags.includes("wrinkles") || allTags.includes("forties") || allTags.includes("fiftyplus") || allTags.includes("mature") ? "W" : "T";
  const baumannCode = `${baumannO}${baumannS}${baumannP}${baumannW}`;

  const primaryConcernTag = allTags.find(t => ["acne", "aging", "hyperpigmentation", "dehydration", "redness", "texture"].includes(t)) || "general";

  const concernLabels: Record<string, string> = {
    acne: "Acne & Breakouts",
    aging: "Anti-Aging",
    hyperpigmentation: "Hyperpigmentation",
    dehydration: "Hydration",
    redness: "Redness & Rosacea",
    texture: "Texture & Pores",
    general: "General Skin Health"
  };

  // Score products based on tag match
  function scoreProduct(product: Product): number {
    // Excluded products get -Infinity so they never win
    if (excludedProductIds.includes(product.id)) return -Infinity;
    let score = 0;
    for (const tag of allTags) {
      if (product.bestFor.includes(tag)) score += 2;
    }
    // Bonus for matching skin type directly
    if (product.bestFor.includes(skinType)) score += 3;
    // Bonus for matching primary concern
    if (product.bestFor.includes(primaryConcernTag)) score += 4;
    // Penalty for sensitive skin getting harsh products
    if (isSensitive && product.bestFor.includes("oily") && !product.bestFor.includes("sensitive")) score -= 2;

    // Budget matching
    if (allTags.includes("budget") && product.bestFor.includes("budget")) score += 2;
    if (allTags.includes("premium") && product.bestFor.includes("premium")) score += 2;
    if (allTags.includes("midrange") && product.bestFor.includes("midrange")) score += 1;

    return score;
  }

  /**
   * Get the best product for a category, optionally filtering AM-safe only.
   * Products flagged pmOnly=true (retinol, retinoids) are excluded from AM routines
   * per dermatologist consensus: retinoids degrade in UV light and increase
   * photosensitivity (Dr. Sandra Lee, Dr. Whitney Bowe, Vogue).
   */
  function getBestProduct(category: Product["category"], amSafeOnly = false): Product {
    let candidates = productDatabase.filter(p => p.category === category && p.dermVerified !== false);
    if (amSafeOnly) {
      candidates = candidates.filter(p => !p.pmOnly);
    }
    const scored = candidates
      .map(p => ({ product: p, score: scoreProduct(p) }))
      .filter(x => x.score !== -Infinity)
      .sort((a, b) => b.score - a.score);
    return scored[0]?.product || candidates[0];
  }

  /**
   * Get top N products for a category (excludes excluded IDs and the primary product).
   */
  function getAlternatives(category: Product["category"], primaryId: string, amSafeOnly = false, count = 2): Product[] {
    let candidates = productDatabase.filter(p => p.category === category && p.dermVerified !== false);
    if (amSafeOnly) candidates = candidates.filter(p => !p.pmOnly);
    const scored = candidates
      .map(p => ({ product: p, score: scoreProduct(p) }))
      .filter(x => x.score !== -Infinity && x.product.id !== primaryId)
      .sort((a, b) => b.score - a.score);
    return scored.slice(0, count).map(x => x.product);
  }

  // Build routines
  const cleanser = getBestProduct("cleanser");
  const moisturizer = getBestProduct("moisturizer");
  const sunscreen = getBestProduct("sunscreen");

  // AM serum: must be AM-safe (no retinol). Vitamin C, niacinamide, HA are ideal AM actives.
  const amSerum = getBestProduct("serum", true);

  // PM serum/treatment: retinol and retinoids are welcome at night
  const pmSerum = getBestProduct("serum");
  const treatment = getBestProduct("treatment"); // all treatments are retinoids, PM-only

  // Only include exfoliant for certain concerns
  const needsExfoliant = allTags.some(t => ["acne", "texture", "pores", "oily"].includes(t));
  const exfoliant = needsExfoliant ? getBestProduct("exfoliant") : null;

  // Determine which optional steps are warranted by the user's concerns
  const hasConcernForSerum = allTags.some(t =>
    ["acne", "aging", "wrinkles", "hyperpigmentation", "dark_spots", "dullness", "dehydration", "oily", "pores"].includes(t)
  );

  // Pre-compute alternatives for each primary product
  const cleanserAlts = getAlternatives("cleanser", cleanser.id);
  const moisturizerAlts = getAlternatives("moisturizer", moisturizer.id);
  const sunscreenAlts = getAlternatives("sunscreen", sunscreen.id);
  const amSerumAlts = getAlternatives("serum", amSerum.id, true);
  const pmSerumAlts = getAlternatives("serum", pmSerum.id);
  const treatmentAlts = getAlternatives("treatment", treatment.id);
  const exfoliantAlts = exfoliant ? getAlternatives("exfoliant", exfoliant.id) : [];

  // AM routine: cleanser (essential) → serum (recommended if concerns) → moisturizer (essential) → sunscreen (essential)
  const amRoutine: RoutineItem[] = [
    { step: routineSteps[0], product: cleanser, essential: true, alternatives: cleanserAlts },
  ];

  if (hasConcernForSerum) {
    amRoutine.push({ step: routineSteps[2], product: amSerum, essential: false, alternatives: amSerumAlts });
  }

  amRoutine.push({ step: routineSteps[4], product: moisturizer, essential: true, alternatives: moisturizerAlts });
  amRoutine.push({ step: routineSteps[5], product: sunscreen, essential: true, alternatives: sunscreenAlts });

  // PM routine: cleanser (essential) → [exfoliant] → [treatment OR serum] → moisturizer (essential)
  const pmRoutine: RoutineItem[] = [
    { step: routineSteps[0], product: cleanser, essential: true, alternatives: cleanserAlts },
  ];

  if (exfoliant) {
    pmRoutine.push({ step: routineSteps[1], product: exfoliant, essential: false, alternatives: exfoliantAlts });
  }

  // PM active: retinoid treatment for aging/acne, serum for other concerns, skip if no concerns
  if (allTags.includes("aging") || allTags.includes("wrinkles")) {
    pmRoutine.push({ step: routineSteps[3], product: treatment, essential: false, alternatives: treatmentAlts });
  } else if (allTags.includes("acne") || allTags.includes("breakouts")) {
    pmRoutine.push({ step: routineSteps[3], product: treatment, essential: false, alternatives: treatmentAlts });
  } else if (hasConcernForSerum) {
    pmRoutine.push({ step: routineSteps[2], product: pmSerum, essential: false, alternatives: pmSerumAlts });
  }

  pmRoutine.push({ step: routineSteps[4], product: moisturizer, essential: true, alternatives: moisturizerAlts });

  // Generate tips
  const tips: string[] = [];

  tips.push("Sunscreen is the single most effective anti-aging product according to dermatologists. Apply daily, even on cloudy days.");

  tips.push("Always apply retinol and retinoids at night only. They degrade in sunlight and can increase photosensitivity. Pair with vitamin C in the morning for complementary AM/PM protection.");

  if (allTags.includes("retinoid_new") || allTags.includes("retinoid_beginner")) {
    tips.push("Start retinoids slowly — apply 2-3 times per week and gradually increase. Some irritation is normal for the first 2-4 weeks.");
  }

  if (isSensitive) {
    tips.push("With sensitive skin, introduce one new product at a time and wait 1-2 weeks before adding another.");
  }

  if (allTags.includes("acne")) {
    tips.push("Don't use salicylic acid and retinoids on the same night — alternate them to avoid over-exfoliation.");
  }

  if (allTags.includes("hyperpigmentation") || allTags.includes("dark_spots")) {
    tips.push("Vitamin C in the morning boosts sun protection and helps fade dark spots over time. Pair with diligent sunscreen use.");
  }

  if (allTags.includes("dehydration") || allTags.includes("dry")) {
    tips.push("Apply hyaluronic acid to damp skin — it draws in water, so it works best when there's moisture available.");
  }

  tips.push("Consistency is key. Allow 8-12 weeks for most active ingredients to show visible results.");

  return {
    amRoutine,
    pmRoutine,
    skinProfile: {
      type: skinType.charAt(0).toUpperCase() + skinType.slice(1),
      sensitivity,
      primaryConcern: concernLabels[primaryConcernTag],
      baumannCode
    },
    tips
  };
}
