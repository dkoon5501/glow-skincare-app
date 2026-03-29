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
  manufacturerUrl?: string;
  amazonUrl?: string;
  /** If true, this product contains photosensitizing ingredients (retinol, retinoids)
   *  and must ONLY be used in PM routines. Retinoids degrade in sunlight and increase
   *  photosensitivity per dermatologist consensus (Vogue, Dr. Sandra Lee, Dr. Bowe). */
  pmOnly?: boolean;
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

// Curated product database — every product recommended by a named derm influencer
export const productDatabase: Product[] = [
  // ─────────────────────────────────────────────
  // CLEANSERS
  // ─────────────────────────────────────────────
  {
    id: "cerave-hydrating-cleanser",
    name: "Hydrating Facial Cleanser",
    brand: "CeraVe",
    category: "cleanser",
    price: "$15.99",
    keyIngredients: ["Ceramides", "Hyaluronic Acid", "Glycerin"],
    bestFor: ["dry", "normal", "sensitive", "dehydration", "budget"],
    whyRecommended:
      "Restores and maintains the skin barrier without stripping moisture. Non-comedogenic and fragrance-free. Dr. Alexis Stephens recommends it as her go-to hydrating cleanser for dry and normal skin.",
    source: "Dr. Alexis Stephens (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=OeNJbShiOOw",
    manufacturerUrl: "https://www.cerave.com/skincare/cleansers/hydrating-facial-cleanser",
    amazonUrl: "https://www.amazon.com/dp/B01MSSDEPK?tag=glowskincar0c-20",
  },
  {
    id: "cerave-foaming-cleanser",
    name: "Foaming Facial Cleanser",
    brand: "CeraVe",
    category: "cleanser",
    price: "$15.99",
    keyIngredients: ["Ceramides", "Niacinamide", "Hyaluronic Acid"],
    bestFor: ["oily", "combination", "acne", "normal", "budget"],
    whyRecommended:
      "Removes excess oil and dirt without disrupting the skin barrier. Dr. Alexis Stephens recommends the foaming formula for oily and combination skin types who want a deeper cleanse while keeping ceramides intact.",
    source: "Dr. Alexis Stephens (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=OeNJbShiOOw",
    manufacturerUrl: "https://www.cerave.com/skincare/cleansers/foaming-facial-cleanser",
    amazonUrl: "https://www.amazon.com/dp/B01N1LL62W?tag=glowskincar0c-20",
  },
  {
    id: "lrp-toleriane-purifying-cleanser",
    name: "Toleriane Purifying Foaming Cleanser",
    brand: "La Roche-Posay",
    category: "cleanser",
    price: "$17.99",
    keyIngredients: ["Niacinamide", "Ceramide-3", "La Roche-Posay Thermal Spring Water"],
    bestFor: ["sensitive", "oily", "combination", "acne", "redness", "rosacea"],
    whyRecommended:
      "Clinically tested on sensitive skin with niacinamide to control oil and calm inflammation. Dr. Muneeb Shah, Dr. Daniel Sugai, and Dr. Alexis Stephens all recommend this cleanser for oily and sensitive skin types.",
    source: "Dr. Muneeb Shah & Dr. Daniel Sugai (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=6JjijIeEsZM",
    manufacturerUrl:
      "https://www.laroche-posay.us/our-products/face/face-wash/toleriane-purifying-foaming-facial-cleanser-tolerianefoamingfacialwash.html",
    // No Amazon ASIN available for this specific SKU in the spec
  },
  {
    id: "cetaphil-daily-facial-cleanser",
    name: "Daily Facial Cleanser",
    brand: "Cetaphil",
    category: "cleanser",
    price: "$13.99",
    keyIngredients: ["Glycerin", "Niacinamide", "Vitamin B5 (Panthenol)"],
    bestFor: ["oily", "combination", "normal", "sensitive", "budget"],
    whyRecommended:
      "A gel cleanser that turns into a low-lather foam — ideal for oily to combination skin. Dr. Daniel Sugai recommends the Cetaphil Daily Facial Cleanser for its gentle yet effective cleansing for oily and combination skin types.",
    source: "Dr. Daniel Sugai (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=VxG9rE4seIs",
    manufacturerUrl: "https://www.cetaphil.com/us/cleansers/daily-facial-cleanser/302993927985.html",
    // No ASIN listed in spec for this product
  },
  {
    id: "cerave-hydrating-foaming-oil-cleanser",
    name: "Hydrating Foaming Oil Cleanser",
    brand: "CeraVe",
    category: "cleanser",
    price: "$16.99",
    keyIngredients: ["Squalane Oil", "Ceramides", "Hyaluronic Acid"],
    bestFor: ["dry", "sensitive", "dehydration", "normal", "budget"],
    whyRecommended:
      "Dr. Karen Locke (The Budget Dermatologist) calls this one of her current favorite cleansers — it acts as a single-step double cleanse, breaking down makeup and sunscreen while keeping dry skin barrier-intact.",
    source: "Dr. Karen Locke / The Budget Dermatologist (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=iZc8UWcq5dY",
    manufacturerUrl: "https://www.cerave.com/skincare/cleansers/hydrating-foaming-oil-cleanser",
    // No ASIN in spec; omitting amazonUrl
  },

  // ─────────────────────────────────────────────
  // SERUMS — AM-SAFE
  // ─────────────────────────────────────────────
  {
    id: "skinceuticals-ce-ferulic",
    name: "C E Ferulic Serum",
    brand: "SkinCeuticals",
    category: "serum",
    price: "$182.00",
    keyIngredients: ["15% L-Ascorbic Acid (Vitamin C)", "1% Vitamin E", "0.5% Ferulic Acid"],
    bestFor: ["aging", "dullness", "hyperpigmentation", "dark_spots", "premium"],
    whyRecommended:
      "Considered the gold standard antioxidant serum. Dr. Shereene Idriss calls it the most studied and effective L-ascorbic acid serum on the market, citing its proprietary pH and synergistic vitamin C/E/ferulic acid ratio backed by clinical data.",
    source: "Dr. Shereene Idriss (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=1kLLEyFeZq8",
    manufacturerUrl:
      "https://www.skinceuticals.com/skincare/vitamin-c-serums/c-e-ferulic-with-15-l-ascorbic-acid/S17.html",
    // No Amazon listing for SkinCeuticals CE Ferulic per spec
  },
  {
    id: "ordinary-niacinamide",
    name: "Niacinamide 10% + Zinc 1%",
    brand: "The Ordinary",
    category: "serum",
    price: "$6.00",
    keyIngredients: ["10% Niacinamide", "1% Zinc PCA"],
    bestFor: ["oily", "acne", "pores", "budget", "breakouts", "hyperpigmentation", "dullness"],
    whyRecommended:
      "Consensus pick across multiple derm influencers. Controls oil, minimizes pores, reduces post-acne marks, and brightens — all at a fraction of the cost. Dr. Muneeb Shah and Dr. Daniel Sugai both frequently cite it as a go-to for oily and acne-prone skin.",
    source: "Dr. Muneeb Shah (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=IyxTc0iZ6V8",
    manufacturerUrl: "https://theordinary.com/en-us/niacinamide-10-zinc-1-serum-100436.html",
    amazonUrl: "https://www.amazon.com/dp/B01MDTVZTZ?tag=glowskincar0c-20",
  },
  {
    id: "maelove-glow-maker",
    name: "The Glow Maker Vitamin C Serum",
    brand: "Maelove",
    category: "serum",
    price: "$24.00",
    keyIngredients: ["15% L-Ascorbic Acid", "Vitamin E", "Ferulic Acid", "Hyaluronic Acid"],
    bestFor: ["dullness", "hyperpigmentation", "dark_spots", "aging", "budget", "midrange"],
    whyRecommended:
      "Dr. Karen Locke (The Budget Dermatologist) rates this as one of her top vitamin C serum picks, calling it a worthy budget alternative to SkinCeuticals CE Ferulic with the same 15% L-ascorbic acid + vitamin E + ferulic acid formula.",
    source: "Dr. Karen Locke / The Budget Dermatologist (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=OTlliSx7dQU",
    manufacturerUrl: "https://maelove.com/products/the-glow-maker",
    // No ASIN in spec; omitting amazonUrl
  },
  {
    id: "ordinary-hyaluronic-acid",
    name: "Hyaluronic Acid 2% + B5",
    brand: "The Ordinary",
    category: "serum",
    price: "$8.90",
    keyIngredients: ["Multi-weight Hyaluronic Acid", "Vitamin B5 (Panthenol)", "Ceramides"],
    bestFor: ["dehydration", "dry", "dullness", "budget", "normal", "sensitive"],
    whyRecommended:
      "Dr. Sam Ellis recommends The Ordinary's HA serum as a reliable, affordable hydration booster. Multi-molecular hyaluronic acid hydrates at surface and deeper skin levels; B5 soothes and supports barrier repair.",
    source: "Dr. Sam Ellis (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=iGBIxwOxfWU",
    manufacturerUrl:
      "https://theordinary.com/en-us/hyaluronic-acid-2-b5-serum-with-ceramides-100637.html",
    amazonUrl: "https://www.amazon.com/dp/B01MYEZPC8?tag=glowskincar0c-20",
  },
  {
    id: "neutrogena-collagen-bank-serum",
    name: "Collagen Bank Vitamin C Serum",
    brand: "Neutrogena",
    category: "serum",
    price: "$22.99",
    keyIngredients: ["15% L-Ascorbic Acid", "Jazzy Micropeptide", "Hydrolyzed Collagen"],
    bestFor: ["aging", "wrinkles", "hyperpigmentation", "dullness", "budget", "midrange"],
    whyRecommended:
      "Dr. Dray reviewed this as a compelling and affordable drugstore vitamin C serum, praising its 15% ascorbic acid formula, novel collagen-stimulating micropeptide, and good tolerance compared to typical vitamin C irritants.",
    source: "Dr. Dray (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=FLnu9Q8OzHE",
    manufacturerUrl:
      "https://www.neutrogena.com/products/skincare/neutrogena-collagen-bank-vitamin-c-serum/",
    // No ASIN in spec; omitting amazonUrl
  },

  // ─────────────────────────────────────────────
  // SERUMS — PM-ONLY (retinol-containing)
  // ─────────────────────────────────────────────
  {
    id: "lrp-retinol-b3",
    name: "Retinol B3 Serum",
    brand: "La Roche-Posay",
    category: "serum",
    price: "$46.99",
    keyIngredients: ["Pure Retinol", "Niacinamide (Vitamin B3)", "La Roche-Posay Thermal Spring Water"],
    bestFor: ["aging", "wrinkles", "dark_spots", "midrange", "retinoid_beginner", "sensitive"],
    whyRecommended:
      "Potent retinol paired with niacinamide for soothing. Recommended for those transitioning to retinol who also have sensitive skin concerns. Apply at night only — retinol degrades in sunlight and increases photosensitivity.",
    source: "Dr. Muneeb Shah & Dr. Daniel Sugai (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=6JjijIeEsZM",
    manufacturerUrl:
      "https://www.laroche-posay.us/our-products/face/face-serum/retinol-b3-pure-retinol-serum-3337875694469.html",
    amazonUrl: "https://www.amazon.com/dp/B07Z9Y4M3C?tag=glowskincar0c-20",
    pmOnly: true,
  },

  // ─────────────────────────────────────────────
  // EXFOLIANTS
  // ─────────────────────────────────────────────
  {
    id: "paulas-choice-bha",
    name: "Skin Perfecting 2% BHA Liquid Exfoliant",
    brand: "Paula's Choice",
    category: "exfoliant",
    price: "$34.00",
    keyIngredients: ["2% Salicylic Acid (BHA)", "Green Tea Extract", "Methylpropanediol"],
    bestFor: ["acne", "oily", "pores", "texture", "breakouts", "midrange"],
    whyRecommended:
      "Dr. Shereene Idriss and Dr. Daniel Sugai both recommend this iconic chemical exfoliant. It works inside the pore to unclog congestion, smooth texture, and reduce breakouts — consistently ranked as one of the most effective OTC BHA exfoliants.",
    source: "Dr. Shereene Idriss & Dr. Daniel Sugai (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=3-MoLqxNFtY",
    manufacturerUrl:
      "https://www.paulaschoice.com/skin-perfecting-2pct-bha-liquid-exfoliant/201-2010.html",
    amazonUrl: "https://www.amazon.com/dp/B07C5SS6YD?tag=glowskincar0c-20",
  },

  // ─────────────────────────────────────────────
  // MOISTURIZERS
  // ─────────────────────────────────────────────
  {
    id: "lrp-toleriane-double-repair",
    name: "Toleriane Double Repair Moisturizer",
    brand: "La Roche-Posay",
    category: "moisturizer",
    price: "$22.99",
    keyIngredients: ["Ceramide-3", "Niacinamide", "Prebiotic Thermal Spring Water"],
    bestFor: ["sensitive", "normal", "combination", "redness", "rosacea", "midrange"],
    whyRecommended:
      "Dr. Alexis Stephens and Dr. Karen Locke both recommend this lightweight yet effective barrier repair moisturizer. Its prebiotic formula supports the skin microbiome. Dr. Locke featured it in her complete acne routines for dry skin.",
    source: "Dr. Alexis Stephens & Dr. Karen Locke / The Budget Dermatologist (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=APC16_cpYyk",
    manufacturerUrl:
      "https://www.laroche-posay.us/our-products/face/face-moisturizer/toleriane-double-repair-face-moisturizer-tolerianedoublerepair.html",
    amazonUrl: "https://www.amazon.com/dp/B01NCWV3KM?tag=glowskincar0c-20",
  },
  {
    id: "cerave-moisturizing-cream",
    name: "Moisturizing Cream",
    brand: "CeraVe",
    category: "moisturizer",
    price: "$18.99",
    keyIngredients: ["Ceramides (1, 3, 6-II)", "Hyaluronic Acid", "MVE Technology"],
    bestFor: ["dry", "dehydration", "sensitive", "budget", "normal"],
    whyRecommended:
      "A derm consensus pick. Dr. Daniel Sugai features it as the gold standard for dry and eczema-prone skin, praising its patented MVE delivery technology for 24-hour continuous hydration and barrier restoration.",
    source: "Dr. Daniel Sugai (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=SvB_EaH29wQ",
    manufacturerUrl: "https://www.cerave.com/skincare/moisturizers/moisturizing-cream",
    amazonUrl: "https://www.amazon.com/dp/B00TTD9BRC?tag=glowskincar0c-20",
  },
  {
    id: "lrp-cicaplast-gel-b5",
    name: "Cicaplast Gel B5 Skin Protectant",
    brand: "La Roche-Posay",
    category: "moisturizer",
    price: "$22.99",
    keyIngredients: ["Glycerin", "Vitamin B5 (Panthenol)", "Madecassoside"],
    bestFor: ["sensitive", "redness", "rosacea", "dehydration", "dry", "midrange"],
    whyRecommended:
      "Dr. Dray calls this one of her most repurchased products, featuring it in her top skincare products of 2024 and 2025. A go-to for soothing damaged, sensitive, and post-procedure skin with a lightweight gel texture.",
    source: "Dr. Dray (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=ZmTQAMXjeys",
    manufacturerUrl:
      "https://www.laroche-posay.us/our-products/body/body-lotion/cicaplast-gel-b5-skin-protectant-3337875865302.html",
    // No ASIN in spec; omitting amazonUrl
  },
  {
    id: "cerave-pm-lotion",
    name: "PM Facial Moisturizing Lotion",
    brand: "CeraVe",
    category: "moisturizer",
    price: "$17.49",
    keyIngredients: ["Niacinamide", "Ceramides", "Hyaluronic Acid"],
    bestFor: ["oily", "acne", "combination", "budget", "normal"],
    whyRecommended:
      "Dr. Alexis Stephens recommends CeraVe PM as her go-to lightweight moisturizer for normal skin, praising its niacinamide content for calming and barrier support overnight. The oil-free formula won't clog pores.",
    source: "Dr. Alexis Stephens (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=APC16_cpYyk",
    manufacturerUrl: "https://www.cerave.com/skincare/moisturizers/pm-facial-moisturizing-lotion",
    // No ASIN listed for CeraVe PM Lotion in spec
  },
  {
    id: "neutrogena-hydro-boost",
    name: "Hydro Boost Water Gel",
    brand: "Neutrogena",
    category: "moisturizer",
    price: "$19.99",
    keyIngredients: ["Hyaluronic Acid", "Glycerin", "Dimethicone"],
    bestFor: ["oily", "combination", "dehydration", "budget", "normal"],
    whyRecommended:
      "A multi-derm consensus pick. Dr. Muneeb Shah and Dr. Daniel Sugai have both recommended this oil-free gel moisturizer for oily and combination skin. Absorbs instantly, providing deep hydration without heaviness — ideal under sunscreen.",
    source: "Dr. Muneeb Shah & Dr. Daniel Sugai (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=XYr2_QlQiyA",
    manufacturerUrl:
      "https://www.neutrogena.com/products/skincare/neutrogena-hydro-boost-water-gel-with-hyaluronic-acid/6811047",
    amazonUrl: "https://www.amazon.com/dp/B00NR1YQHM?tag=glowskincar0c-20",
  },

  // ─────────────────────────────────────────────
  // SUNSCREENS
  // ─────────────────────────────────────────────
  {
    id: "eltamd-uv-clear",
    name: "UV Clear Broad-Spectrum SPF 46",
    brand: "EltaMD",
    category: "sunscreen",
    price: "$41.00",
    keyIngredients: ["Zinc Oxide 9%", "Niacinamide", "Hyaluronic Acid"],
    bestFor: ["sensitive", "acne", "rosacea", "redness", "midrange"],
    whyRecommended:
      "Dr. Sam Ellis and Dr. Daniel Sugai both call this the #1 dermatologist-recommended sunscreen brand. Dr. Sugai gave it 4.5/5 stars in a dedicated video review, praising its niacinamide, sheer zinc formula, and no white cast.",
    source: "Dr. Sam Ellis & Dr. Daniel Sugai (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=fRwKPdSycFU",
    manufacturerUrl: "https://eltamd.com/products/uv-clear-broad-spectrum-spf-46",
    amazonUrl: "https://www.amazon.com/dp/B002MSN3QQ?tag=glowskincar0c-20",
  },
  {
    id: "lrp-anthelios-clear-skin",
    name: "Anthelios Clear Skin Dry Touch SPF 60",
    brand: "La Roche-Posay",
    category: "sunscreen",
    price: "$35.99",
    keyIngredients: ["Cell-Ox Shield XL Technology", "Silica", "Perlite"],
    bestFor: ["oily", "acne", "combination", "high_sun", "midrange"],
    whyRecommended:
      "Dr. Daniel Sugai recommends this for oily and acne-prone patients. Its oil-absorbing silica and dry-touch finish keep the face matte without clogging pores, and SPF 60 provides robust protection for high sun-exposure days.",
    source: "Dr. Daniel Sugai (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=NK6ThY5Pt74",
    manufacturerUrl:
      "https://www.laroche-posay.us/our-products/sun/face-sunscreen/anthelios-clear-skin-oil-free-sunscreen-spf-60-antheliosclearskin.html",
    amazonUrl: "https://www.amazon.com/dp/B07YZRFH5C?tag=glowskincar0c-20",
  },
  {
    id: "isdin-eryfotona",
    name: "Eryfotona Ageless Tinted SPF 50",
    brand: "ISDIN",
    category: "sunscreen",
    price: "$55.00",
    keyIngredients: ["Zinc Oxide", "Photolyase DNA Repair Enzyme", "Vitamin E"],
    bestFor: ["aging", "mature", "premium", "hyperpigmentation", "high_sun", "forties", "fiftyplus"],
    whyRecommended:
      "Dr. Daniel Sugai recommends ISDIN Eryfotona Ageless for mature skin, calling it an outstanding choice for those 40+ due to its DNA-repair photolyase enzyme technology, anti-aging peptides, and natural tint that suits deeper skin tones.",
    source: "Dr. Daniel Sugai (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=hHfcGTA7A70",
    manufacturerUrl: "https://www.isdin.com/us/p/ageless-34-fl-oz/3431",
    amazonUrl: "https://www.amazon.com/dp/B0CV85FYPJ?tag=glowskincar0c-20",
  },
  {
    id: "cerave-am-lotion",
    name: "AM Facial Moisturizing Lotion SPF 30",
    brand: "CeraVe",
    category: "sunscreen",
    price: "$17.99",
    keyIngredients: ["Zinc Oxide", "Ceramides", "Niacinamide"],
    bestFor: ["dry", "normal", "sensitive", "budget", "dehydration"],
    whyRecommended:
      "Dr. Daniel Sugai recommends this two-in-one moisturizer + SPF 30 for those who prefer a simplified morning routine. The ceramide and niacinamide formula supports barrier repair while delivering daily broad-spectrum sun protection at a drugstore price.",
    source: "Dr. Daniel Sugai (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=NK6ThY5Pt74",
    manufacturerUrl:
      "https://www.cerave.com/skincare/moisturizers/am-facial-moisturizing-lotion-with-sunscreen",
    amazonUrl: "https://www.amazon.com/dp/B00F97FHAW?tag=glowskincar0c-20",
  },

  // ─────────────────────────────────────────────
  // TREATMENTS — all PM-only (retinoids)
  // ─────────────────────────────────────────────
  {
    id: "differin-gel",
    name: "Adapalene Gel 0.1%",
    brand: "Differin",
    category: "treatment",
    price: "$14.99",
    keyIngredients: ["Adapalene 0.1% (OTC Retinoid)"],
    bestFor: ["acne", "breakouts", "retinoid_new", "retinoid_beginner", "budget", "pores", "texture", "hyperpigmentation"],
    whyRecommended:
      "The only FDA-approved OTC retinoid for acne. Dr. Dray is a long-time advocate, making it a top pick in her most-purchased skincare of 2025 list. Dr. Muneeb Shah also recommends adapalene as the best-evidenced OTC retinoid for acne. Apply at night only. Start 2–3× per week.",
    source: "Dr. Dray & Dr. Muneeb Shah (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=ZmTQAMXjeys",
    manufacturerUrl: "https://differin.com/shop/differin-gel/3029949.html",
    amazonUrl: "https://www.amazon.com/dp/B07V2BRPVS?tag=glowskincar0c-20",
    pmOnly: true,
  },
  {
    id: "medik8-crystal-retinal",
    name: "Crystal Retinal (Retinaldehyde Serum)",
    brand: "Medik8",
    category: "treatment",
    price: "$69.00",
    keyIngredients: ["Retinaldehyde (Retinal)", "Hyaluronic Acid", "Vitamin E"],
    bestFor: ["aging", "wrinkles", "acne", "retinoid_experienced", "retinoid_beginner", "premium", "midrange", "texture"],
    whyRecommended:
      "Dr. Karen Locke (The Budget Dermatologist) and Dr. Sam Ellis both recommend Medik8 Crystal Retinal. Dr. Ellis featured it in a video on how to make retinoids work better, demonstrating usage of Crystal Retinal's graduated strengths. Retinaldehyde is one step closer to retinoic acid than retinol — faster results with less irritation. Apply at night only.",
    source: "Dr. Karen Locke / The Budget Dermatologist & Dr. Sam Ellis (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=xE2ljf69hBc",
    manufacturerUrl: "https://us.medik8.com/products/crystal-retinal",
    // No ASIN in spec; omitting amazonUrl
    pmOnly: true,
  },
  {
    id: "ordinary-retinol-squalane",
    name: "Retinol 1% in Squalane",
    brand: "The Ordinary",
    category: "treatment",
    price: "$8.90",
    keyIngredients: ["1% Retinol", "Squalane"],
    bestFor: ["aging", "wrinkles", "acne", "budget", "retinoid_beginner", "texture"],
    whyRecommended:
      "Dr. Dray recommends The Ordinary's retinol range as affordable, effective OTC retinoids. The squalane base keeps the formula moisturizing and tolerable. Effective for mild acne, texture improvement, and early anti-aging. Apply at night only.",
    source: "Dr. Dray (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=o2CjoLldFCg",
    manufacturerUrl: "https://theordinary.com/en-us/retinol-1-in-squalane-serum-100441.html",
    amazonUrl: "https://www.amazon.com/dp/B0DQ6496LC?tag=glowskincar0c-20",
    pmOnly: true,
  },
  {
    id: "paulas-choice-retinol",
    name: "Clinical 1% Retinol Treatment",
    brand: "Paula's Choice",
    category: "treatment",
    price: "$65.00",
    keyIngredients: ["1% Retinol", "Peptides", "Vitamin C"],
    bestFor: ["aging", "wrinkles", "retinoid_experienced", "midrange", "premium", "texture"],
    whyRecommended:
      "Dr. Alexis Stephens references Paula's Choice as a strong clinical retinol option for experienced users. This high-strength formula combines 1% retinol with collagen-promoting peptides for advanced anti-aging results. Apply at night only.",
    source: "Dr. Alexis Stephens (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=evzPfPeGp8k",
    manufacturerUrl: "https://www.paulaschoice.com/clinical-1pct-retinol-treatment/801.html",
    amazonUrl: "https://www.amazon.com/dp/B00L5O31VK?tag=glowskincar0c-20",
    pmOnly: true,
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

export interface RecommendedRoutine {
  amRoutine: { step: RoutineStep; product: Product }[];
  pmRoutine: { step: RoutineStep; product: Product }[];
  skinProfile: {
    type: string;
    sensitivity: string;
    primaryConcern: string;
    baumannCode: string;
  };
  tips: string[];
}

export function generateRecommendation(answers: QuizAnswers): RecommendedRoutine {
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
    let candidates = productDatabase.filter(p => p.category === category);
    if (amSafeOnly) {
      candidates = candidates.filter(p => !p.pmOnly);
    }
    const scored = candidates.map(p => ({ product: p, score: scoreProduct(p) }));
    scored.sort((a, b) => b.score - a.score);
    return scored[0]?.product || candidates[0];
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

  // AM routine: cleanser → AM-safe serum → moisturizer → sunscreen
  const amRoutine: { step: RoutineStep; product: Product }[] = [
    { step: routineSteps[0], product: cleanser },
    { step: routineSteps[2], product: amSerum },
    { step: routineSteps[4], product: moisturizer },
    { step: routineSteps[5], product: sunscreen }
  ];

  // PM routine: cleanser → [exfoliant] → treatment OR serum → moisturizer
  const pmRoutine: { step: RoutineStep; product: Product }[] = [
    { step: routineSteps[0], product: cleanser },
  ];

  if (exfoliant) {
    pmRoutine.push({ step: routineSteps[1], product: exfoliant });
  }

  // PM active: use retinoid treatment for aging/acne concerns, otherwise PM serum
  if (allTags.includes("aging") || allTags.includes("wrinkles")) {
    pmRoutine.push({ step: routineSteps[3], product: treatment });
  } else if (allTags.includes("acne") || allTags.includes("breakouts")) {
    pmRoutine.push({ step: routineSteps[3], product: treatment });
  } else {
    pmRoutine.push({ step: routineSteps[2], product: pmSerum });
  }

  pmRoutine.push({ step: routineSteps[4], product: moisturizer });

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
