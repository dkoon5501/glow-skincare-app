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
  {
    id: "neutrogena-ultra-gentle-cleanser",
    name: "Ultra Gentle Daily Cleanser",
    brand: "Neutrogena",
    category: "cleanser",
    price: "$11.99",
    keyIngredients: ["Glycerin", "Dextran", "Fragrance-free"],
    bestFor: ["sensitive", "redness", "rosacea", "normal", "budget"],
    whyRecommended:
      "Dermatologist-tested and fragrance-free, Neutrogena Ultra Gentle cleanses without disrupting the skin barrier. Dr. Daniel Sugai recommends it as a reliable daily cleanser for sensitive and rosacea-prone skin that needs effective but non-irritating cleansing.",
    source: "Dr. Daniel Sugai (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=VxG9rE4seIs",
    manufacturerUrl: "https://www.neutrogena.com",
  },
  {
    id: "anua-heartleaf-cleansing-oil",
    name: "Heartleaf Pore Control Cleansing Oil",
    brand: "Anua",
    category: "cleanser",
    price: "$22.00",
    keyIngredients: ["Heartleaf Extract", "Olive Oil", "Jojoba Oil"],
    bestFor: ["oily", "acne", "sensitive", "breakouts"],
    whyRecommended:
      "A K-beauty cleansing oil ideal for the first step of a double cleanse. Dr. Dray reviewed this for its heartleaf extract that helps control excess sebum and soothe acne-prone skin while effectively dissolving sunscreen and makeup without irritation.",
    source: "Dr. Dray (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=fXJUKo2UFNk",
    manufacturerUrl: "https://anua.us",
  },
  {
    id: "celimax-dual-barrier-cleansing-balm",
    name: "Dual Barrier Purifying Cleansing Balm",
    brand: "CELIMAX",
    category: "cleanser",
    price: "$28.00",
    keyIngredients: ["Noni Extract", "Ceramides", "Shea Butter"],
    bestFor: ["sensitive", "acne", "dry", "combination"],
    whyRecommended:
      "Dr. Sam Ellis reviewed this K-beauty cleansing balm for its dual-barrier technology that thoroughly removes impurities while reinforcing the skin barrier — especially beneficial for sensitive or acne-prone skin that often gets stripped by traditional cleansers.",
    source: "Dr. Sam Ellis (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=F2kaMrrqfxo",
  },
  {
    id: "eucerin-radiant-tone-cleansing-gel",
    name: "Radiant Tone Cleansing Gel",
    brand: "Eucerin",
    category: "cleanser",
    price: "$19.00",
    keyIngredients: ["Thiamidol", "Glycerin", "Panthenol"],
    bestFor: ["dullness", "hyperpigmentation", "dry", "budget"],
    whyRecommended:
      "Dr. Dray reviewed Eucerin's Thiamidol-based cleansing gel for its brightening benefits for hyperpigmentation and dullness. Gentle enough for dry skin while actively addressing uneven skin tone with clinically tested Thiamidol.",
    source: "Dr. Dray (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=cAmXcVA7Lwk",
    manufacturerUrl: "https://www.eucerinus.com",
  },
  {
    id: "vanicream-gentle-facial-cleanser",
    name: "Gentle Facial Cleanser",
    brand: "Vanicream",
    category: "cleanser",
    price: "$9.00",
    keyIngredients: ["Glycerin", "PEG-free formula", "Dye-free"],
    bestFor: ["sensitive", "rosacea", "redness", "dry", "budget"],
    whyRecommended:
      "Dr. Dray is a strong advocate for Vanicream products for sensitive and reactive skin. This fragrance-free, dye-free, and preservative-free formula is one of the most hypoallergenic cleansers available — ideal for rosacea, eczema, and skin that reacts to almost everything.",
    source: "Dr. Dray (YouTube)",
    manufacturerUrl: "https://www.vanicream.com",
    amazonUrl: "https://www.amazon.com/dp/B00QY1XZ4W?tag=glowskincar0c-20",
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

  {
    id: "instanatural-vitamin-c-serum",
    name: "Vitamin C Serum with Hyaluronic Acid",
    brand: "InstaNatural",
    category: "serum",
    price: "$20.00",
    keyIngredients: ["20% Vitamin C", "Hyaluronic Acid", "Ferulic Acid"],
    bestFor: ["dullness", "budget", "dark_spots", "aging"],
    whyRecommended:
      "An accessible vitamin C serum combining a 20% vitamin C blend with ferulic acid and hyaluronic acid. Dr. Sam Ellis includes affordable vitamin C serums like this in budget-conscious routines for brightening and antioxidant protection throughout the day.",
    source: "Dr. Sam Ellis (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=L2SLL8a6qxA",
  },
  {
    id: "timeless-vitamin-c-ferulic",
    name: "20% Vitamin C + E Ferulic Acid Serum",
    brand: "Timeless",
    category: "serum",
    price: "$26.00",
    keyIngredients: ["20% L-Ascorbic Acid", "Vitamin E", "Ferulic Acid"],
    bestFor: ["aging", "dullness", "hyperpigmentation", "midrange"],
    whyRecommended:
      "Dr. Sam Ellis recommended this as a budget alternative to SkinCeuticals CE Ferulic. With 20% L-ascorbic acid plus the same synergistic ferulic acid pairing, it delivers potent antioxidant protection and brightening at a fraction of the luxury price.",
    source: "Dr. Sam Ellis (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=L2SLL8a6qxA",
    manufacturerUrl: "https://www.timelessha.com",
    amazonUrl: "https://www.amazon.com/dp/B0036BI56G?tag=glowskincar0c-20",
  },
  {
    id: "cosrx-snail-96-mucin",
    name: "Advanced Snail 96 Mucin Power Essence",
    brand: "COSRX",
    category: "serum",
    price: "$25.00",
    keyIngredients: ["96% Snail Secretion Filtrate", "Sodium Hyaluronate", "Betaine"],
    bestFor: ["dehydration", "dry", "sensitive", "dullness", "budget"],
    whyRecommended:
      "Doctorly reviewed this K-beauty cult classic for its remarkable hydration and barrier-repair properties. The 96% snail mucin concentration helps heal, plump, and restore radiance to dehydrated and sensitive skin types without heavy texture.",
    source: "Doctorly (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=76GA2FR9nAg",
    manufacturerUrl: "https://www.cosrx.com",
    amazonUrl: "https://www.amazon.com/dp/B00PBX3L7K?tag=glowskincar0c-20",
  },
  {
    id: "truskin-vitamin-c-serum",
    name: "Vitamin C Facial Serum",
    brand: "TruSkin",
    category: "serum",
    price: "$22.00",
    keyIngredients: ["Vitamin C", "Hyaluronic Acid", "Vitamin E", "Retinol"],
    bestFor: ["aging", "dullness", "budget", "dark_spots"],
    whyRecommended:
      "Dr. Sam Ellis featured TruSkin Vitamin C as a value-oriented brightening serum for those seeking antioxidant protection and dark spot reduction on a budget. Its combination of vitamin C, E, and hyaluronic acid targets multiple aging concerns simultaneously.",
    source: "Dr. Sam Ellis (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=L2SLL8a6qxA",
    manufacturerUrl: "https://www.truskin.com",
    amazonUrl: "https://www.amazon.com/dp/B01M4MCUAF?tag=glowskincar0c-20",
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
  {
    id: "ordinary-glycolic-acid-toner",
    name: "Glycolic Acid 7% Toning Solution",
    brand: "The Ordinary",
    category: "exfoliant",
    price: "$9.50",
    keyIngredients: ["7% Glycolic Acid", "Aloe Vera", "Ginseng Extract"],
    bestFor: ["texture", "dullness", "hyperpigmentation", "budget", "oily"],
    whyRecommended:
      "Dr. Muneeb Shah and Dr. Dray both recommend The Ordinary Glycolic Acid Toner as the most affordable effective AHA exfoliant on the market. It smooths texture, brightens dullness, and fades hyperpigmentation at a price point available to everyone.",
    source: "Dr. Muneeb Shah (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=IyxTc0iZ6V8",
    manufacturerUrl: "https://theordinary.com",
    amazonUrl: "https://www.amazon.com/dp/B07FLQDTS9?tag=glowskincar0c-20",
  },
  {
    id: "inkey-list-pha-toner",
    name: "PHA Gentle Exfoliating Toner",
    brand: "The Inkey List",
    category: "exfoliant",
    price: "$15.00",
    keyIngredients: ["PHA (Polyhydroxy Acid)", "Hyaluronic Acid", "Aloe Vera"],
    bestFor: ["sensitive", "redness", "rosacea", "texture", "budget"],
    whyRecommended:
      "Dr. Dray reviewed this as the gentlest chemical exfoliant option for sensitive skin. PHA is a large-molecule AHA that exfoliates only on the surface, making it ideal for reactive skin, rosacea, and beginners who need exfoliation without irritation.",
    source: "Dr. Dray (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=wHzh_WxIbEc",
  },
  {
    id: "paulas-choice-azelaic-acid",
    name: "10% Azelaic Acid Booster",
    brand: "Paula's Choice",
    category: "exfoliant",
    price: "$39.00",
    keyIngredients: ["10% Azelaic Acid", "Salicylic Acid", "Green Tea Extract"],
    bestFor: ["acne", "rosacea", "redness", "hyperpigmentation", "midrange"],
    whyRecommended:
      "Dr. Dray recommends this azelaic acid booster for its dual action against acne and rosacea. Azelaic acid is one of the few ingredients that addresses both redness and dark spots simultaneously — making this a standout pick for combination-concern skin.",
    source: "Dr. Dray (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=4By-S9xY4h8",
  },
  {
    id: "naturium-mandelic-acid",
    name: "Mandelic Topical Acid 12%",
    brand: "Naturium",
    category: "exfoliant",
    price: "$20.00",
    keyIngredients: ["12% Mandelic Acid (AHA)", "Niacinamide", "Licorice Root Extract"],
    bestFor: ["acne", "dark_spots", "texture", "budget"],
    whyRecommended:
      "Dr. Jenny Liu highlighted Naturium's mandelic acid as a gentler AHA option thanks to mandelic acid's larger molecular size compared to glycolic acid. Effective for fading dark spots and smoothing texture while being more tolerable than traditional AHAs.",
    source: "Dr. Jenny Liu (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=pxEfSEj0ssE",
  },
  {
    id: "neostrata-bionic-face-cream",
    name: "Bionic Face Cream",
    brand: "NeoStrata",
    category: "exfoliant",
    price: "$50.00",
    keyIngredients: ["PHA (Gluconolactone)", "Lactobionic Acid", "Ceramides"],
    bestFor: ["aging", "dry", "sensitive", "mature", "premium"],
    whyRecommended:
      "Dr. Dray featured NeoStrata Bionic Face Cream for mature and sensitive skin. PHA-based exfoliation is exceptionally gentle and also acts as a humectant, making this a rare exfoliant that simultaneously moisturizes and improves texture without sensitizing the skin.",
    source: "Dr. Dray (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=wHzh_WxIbEc",
  },
  {
    id: "glow-recipe-strawberry-bha-aha",
    name: "Strawberry Smooth BHA + AHA Salicylic Serum",
    brand: "Glow Recipe",
    category: "exfoliant",
    price: "$42.00",
    keyIngredients: ["Salicylic Acid (BHA)", "AHA Complex", "Strawberry Extract"],
    bestFor: ["pores", "texture", "oily", "combination", "midrange"],
    whyRecommended:
      "Dr. Jenny Liu reviewed this dual-action exfoliant for its BHA + AHA combination that targets both surface texture and inside pores. Ideal for oily and combination skin types dealing with enlarged pores and congestion who want a more elegant, serum-like texture.",
    source: "Dr. Jenny Liu (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=pxEfSEj0ssE",
  },
  {
    id: "drunk-elephant-babyfacial",
    name: "T.L.C. Sukari Babyfacial",
    brand: "Drunk Elephant",
    category: "exfoliant",
    price: "$80.00",
    keyIngredients: ["AHA Complex (Glycolic, Tartaric, Lactic, Citric)", "2% BHA", "Marula Oil"],
    bestFor: ["dullness", "texture", "aging", "premium"],
    whyRecommended:
      "Dr. Jenny Liu featured this high-dose AHA+BHA weekly mask for its ability to dramatically resurface and brighten. As a once-weekly treatment, it delivers professional-grade exfoliation at home. Best for experienced exfoliant users seeking maximum radiance and anti-aging results.",
    source: "Dr. Jenny Liu (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=pxEfSEj0ssE",
  },
  {
    id: "anua-azelaic-acid-serum",
    name: "Azelaic Acid 10% Serum",
    brand: "Anua",
    category: "exfoliant",
    price: "$25.00",
    keyIngredients: ["10% Azelaic Acid", "Niacinamide", "Heartleaf Extract"],
    bestFor: ["acne", "rosacea", "redness", "budget"],
    whyRecommended:
      "Doctorly reviewed this K-beauty azelaic acid serum for its calming and anti-acne properties. Anua's version combines azelaic acid with their signature heartleaf extract for added soothing benefits — ideal for acne and rosacea-prone skin on a budget.",
    source: "Doctorly (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=fjIGAFmBgRE",
  },
  {
    id: "glytone-exfoliating-serum",
    name: "Exfoliating Serum 3 with Azelaic + Glycolic",
    brand: "Glytone",
    category: "exfoliant",
    price: "$60.00",
    keyIngredients: ["Glycolic Acid", "Azelaic Acid", "Kojic Acid"],
    bestFor: ["dark_spots", "hyperpigmentation", "aging", "premium"],
    whyRecommended:
      "Dr. Dray highlights Glytone's medical-grade formulas as among the most clinically effective OTC options for hyperpigmentation and aging. This combination of glycolic acid, azelaic acid, and kojic acid targets dark spots through multiple simultaneous mechanisms for faster, more visible results.",
    source: "Dr. Dray (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=HwHR69TMpFc",
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
  {
    id: "first-aid-beauty-ultra-repair-cream",
    name: "Ultra Repair Cream",
    brand: "First Aid Beauty",
    category: "moisturizer",
    price: "$34.00",
    keyIngredients: ["Colloidal Oatmeal", "Shea Butter", "Ceramides"],
    bestFor: ["dry", "sensitive", "dehydration", "midrange", "redness"],
    whyRecommended:
      "Dr. Sam Ellis frequently recommends First Aid Beauty Ultra Repair Cream for very dry and sensitive skin. The colloidal oatmeal provides FDA-recognized skin protectant benefits, while shea butter and ceramides deliver intense, long-lasting moisture without clogging pores.",
    source: "Dr. Sam Ellis (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=iGBIxwOxfWU",
  },
  {
    id: "aestura-atobarrier-365-cream",
    name: "AtoBarrier 365 Cream",
    brand: "Aestura",
    category: "moisturizer",
    price: "$30.00",
    keyIngredients: ["Ceramides", "Niacinamide", "Panthenol"],
    bestFor: ["dry", "sensitive", "dehydration", "redness"],
    whyRecommended:
      "Dr. Dray featured this K-beauty barrier cream for its impressive ceramide-rich formula designed to restore moisture to very dry and sensitive skin. Its 365-day barrier support positioning reflects its gentle, redness-reducing formula that works for year-round use.",
    source: "Dr. Dray (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=oyJRxD9YQnE",
  },
  {
    id: "vanicream-daily-facial-moisturizer",
    name: "Daily Facial Moisturizer",
    brand: "Vanicream",
    category: "moisturizer",
    price: "$16.00",
    keyIngredients: ["Glycerin", "Dimethicone", "PEG-free formula"],
    bestFor: ["sensitive", "rosacea", "redness", "budget", "normal"],
    whyRecommended:
      "Dr. Dray consistently recommends Vanicream products for highly reactive skin. This daily moisturizer is formulated without fragrance, dyes, parabens, or preservatives that commonly trigger flares in rosacea and contact dermatitis, making it one of the safest choices for sensitive skin.",
    source: "Dr. Dray (YouTube)",
    manufacturerUrl: "https://www.vanicream.com",
    amazonUrl: "https://www.amazon.com/dp/B09TPXNKJG?tag=glowskincar0c-20",
  },
  {
    id: "kiehls-ultra-facial-cream",
    name: "Ultra Facial Cream",
    brand: "Kiehl's",
    category: "moisturizer",
    price: "$35.00",
    keyIngredients: ["Glacial Glycoprotein", "Squalane", "Imperata Cylindrica Root Extract"],
    bestFor: ["normal", "combination", "dry", "midrange"],
    whyRecommended:
      "Doctorly reviewed Kiehl's Ultra Facial Cream as a classic, well-rounded moisturizer for normal to dry skin. Its unique glacial glycoprotein and squalane combination delivers 24-hour hydration with a comfortable, non-greasy texture that works well under makeup.",
    source: "Doctorly (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=h19mTItzLrE",
    manufacturerUrl: "https://www.kiehls.com",
  },
  {
    id: "abib-ectoin-panthenol-moisturizer",
    name: "Ectoin Panthenol 11% Moisturizer",
    brand: "Abib",
    category: "moisturizer",
    price: "$25.00",
    keyIngredients: ["11% Panthenol (Vitamin B5)", "Ectoin", "Ceramides"],
    bestFor: ["sensitive", "redness", "rosacea", "dehydration"],
    whyRecommended:
      "Dr. Dray featured this K-beauty moisturizer for sensitive and redness-prone skin. Ectoin is a stress-protection molecule that helps shield skin from environmental damage and inflammation, paired with high-dose panthenol for maximum barrier repair and calming.",
    source: "Dr. Dray (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=oyJRxD9YQnE",
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
  {
    id: "supergoop-unseen-sunscreen-spf40",
    name: "Unseen Sunscreen SPF 40",
    brand: "Supergoop!",
    category: "sunscreen",
    price: "$38.00",
    keyIngredients: ["Meadowfoam Seed Oil", "Red Algae", "Chemical SPF Filters"],
    bestFor: ["oily", "combination", "normal", "midrange", "pores"],
    whyRecommended:
      "Dr. Sam Ellis recommends Supergoop! Unseen Sunscreen for its weightless, invisible, primer-like finish that works for oily and combination skin. It wears beautifully under makeup, has no white cast, and provides SPF 40 broad-spectrum protection — making it one of the most wearable daily sunscreens available.",
    source: "Dr. Sam Ellis (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=fRwKPdSycFU",
  },
  {
    id: "eucerin-radiant-tone-spf30",
    name: "Radiant Tone Daily Face Lotion SPF 30",
    brand: "Eucerin",
    category: "sunscreen",
    price: "$35.00",
    keyIngredients: ["Thiamidol", "SPF 30 Filters", "Niacinamide"],
    bestFor: ["hyperpigmentation", "dark_spots", "combination"],
    whyRecommended:
      "Doctorly reviewed this tinted daily SPF as an excellent choice for hyperpigmentation. Eucerin's clinically proven Thiamidol molecule targets melanin overproduction at the source while providing SPF 30 daily protection — a dual-purpose product for uneven skin tone.",
    source: "Doctorly (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=WKN8W7Os9fY",
  },
  {
    id: "drmtlgy-tinted-moisturizer-spf46",
    name: "Universal Tinted Moisturizer SPF 46",
    brand: "DRMTLGY",
    category: "sunscreen",
    price: "$40.00",
    keyIngredients: ["SPF 46 Broad Spectrum", "Universal Tint", "Hyaluronic Acid"],
    bestFor: ["normal", "combination", "oily", "midrange"],
    whyRecommended:
      "Doctorly reviewed DRMTLGY Universal Tinted Moisturizer for its versatile hybrid formula that provides light coverage and SPF 46 protection. The universal tint adapts to a wide range of skin tones, making it a practical 3-in-1 SPF, moisturizer, and tint.",
    source: "Doctorly (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=WKN8W7Os9fY",
    amazonUrl: "https://www.amazon.com/dp/B07NV8YLBT?tag=glowskincar0c-20",
  },
  {
    id: "naturium-dew-glow-spf50",
    name: "Dew-Glow Moisturizer SPF 50",
    brand: "Naturium",
    category: "sunscreen",
    price: "$25.00",
    keyIngredients: ["SPF 50 Broad Spectrum", "Hyaluronic Acid", "Niacinamide"],
    bestFor: ["dry", "dehydration", "budget", "dullness"],
    whyRecommended:
      "Doctorly featured Naturium's Dew-Glow SPF 50 for its dewy finish and hydrating formula that suits dry and dehydrated skin types. Unusually, it provides SPF 50 protection at a budget-friendly price point with a glow-enhancing formula rather than a matte finish.",
    source: "Doctorly (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=WKN8W7Os9fY",
  },
  {
    id: "colorescience-sunforgettable-spf50",
    name: "Sunforgettable Face Shield Flex SPF 50",
    brand: "Colorescience",
    category: "sunscreen",
    price: "$52.00",
    keyIngredients: ["Zinc Oxide (Mineral)", "Titanium Dioxide", "Flex-Ready Technology"],
    bestFor: ["sensitive", "rosacea", "premium", "redness"],
    whyRecommended:
      "Dr. Dray recommends Colorescience for the most reactive sensitive skin. This 100% mineral sunscreen with tint is specifically formulated for rosacea and reactive skin, providing both coverage and calming SPF 50 protection without chemical UV filters that can trigger flares.",
    source: "Dr. Dray (YouTube)",
    manufacturerUrl: "https://www.colorescience.com",
  },
  {
    id: "beauty-of-joseon-daily-tinted-spf40",
    name: "Daily Tinted Fluid SPF 40",
    brand: "Beauty of Joseon",
    category: "sunscreen",
    price: "$20.00",
    keyIngredients: ["SPF 40 PA++++", "Niacinamide", "Rice Bran Extract"],
    bestFor: ["normal", "combination", "budget", "dullness"],
    whyRecommended:
      "Dr. Dray reviewed this K-beauty tinted SPF for its elegant texture, budget price, and brightening effect. Beauty of Joseon's SPF lineup is widely praised for its lightweight feel and glow-enhancing properties — making daily sunscreen application a pleasure rather than a chore.",
    source: "Dr. Dray (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=YW05mDjpwnw",
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
  {
    id: "neutrogena-rapid-wrinkle-repair-retinol",
    name: "Rapid Wrinkle Repair Retinol Serum",
    brand: "Neutrogena",
    category: "treatment",
    price: "$22.99",
    keyIngredients: ["Accelerated Retinol SA", "Glucose Complex", "Hyaluronic Acid"],
    bestFor: ["aging", "wrinkles", "retinoid_beginner", "budget", "dark_spots"],
    whyRecommended:
      "Dr. Dray recommends Neutrogena Rapid Wrinkle Repair as one of the best accessible OTC retinol serums for beginners focused on anti-aging. Its proprietary Accelerated Retinol SA formula is designed for faster efficacy with minimized irritation. Apply at night only.",
    source: "Dr. Dray (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=ZmTQAMXjeys",
    manufacturerUrl: "https://www.neutrogena.com",
    amazonUrl: "https://www.amazon.com/dp/B002RL8FBY?tag=glowskincar0c-20",
    pmOnly: true,
  },
  {
    id: "cerave-resurfacing-retinol-serum",
    name: "Resurfacing Retinol Serum",
    brand: "CeraVe",
    category: "treatment",
    price: "$19.99",
    keyIngredients: ["Encapsulated Retinol", "Niacinamide", "Ceramides"],
    bestFor: ["acne", "texture", "pores", "budget", "retinoid_new", "retinoid_beginner"],
    whyRecommended:
      "Dr. Dray recommends CeraVe Resurfacing Retinol as an excellent entry-level retinoid. Encapsulated retinol minimizes irritation during the adjustment phase, while niacinamide and ceramides simultaneously soothe and protect the barrier. Apply at night only. Start slowly.",
    source: "Dr. Dray (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=ZmTQAMXjeys",
    amazonUrl: "https://www.amazon.com/dp/B07VWSN95S?tag=glowskincar0c-20",
    pmOnly: true,
  },
  {
    id: "naturium-retinol-complex-cream",
    name: "Retinol Complex Cream",
    brand: "Naturium",
    category: "treatment",
    price: "$25.00",
    keyIngredients: ["Retinol", "Peptides", "Squalane"],
    bestFor: ["sensitive", "retinoid_beginner", "budget"],
    whyRecommended:
      "Dr. Sam Ellis featured Naturium Retinol Complex Cream as a well-tolerated beginner retinoid cream. The cream format buffers the retinol, reducing irritation for sensitive skin types new to retinoids. A reliable, affordable option to start the retinol journey. Apply at night only.",
    source: "Dr. Sam Ellis (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=SBylLqyy6pw",
    pmOnly: true,
  },
  {
    id: "roc-retinol-max-hydration",
    name: "Retinol Correxion Max Hydration Moisturizer",
    brand: "RoC",
    category: "treatment",
    price: "$30.00",
    keyIngredients: ["Retinol", "Hyaluronic Acid", "Ceramides"],
    bestFor: ["dry", "retinoid_new", "retinoid_beginner", "budget"],
    whyRecommended:
      "Dr. Jenny Liu recommended this RoC moisturizer-retinol hybrid for dry skin beginners. By combining retinol with hyaluronic acid and ceramides in a rich moisturizing base, it counters the dryness commonly experienced when starting retinoids. Apply at night only.",
    source: "Dr. Jenny Liu (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=bruzUMMO_LU",
    amazonUrl: "https://www.amazon.com/dp/B07GTWMD1W?tag=glowskincar0c-20",
    pmOnly: true,
  },
  {
    id: "loreal-revitalift-retinol-night-cream",
    name: "Revitalift Pressed Night Cream with Retinol",
    brand: "L'Oreal",
    category: "treatment",
    price: "$40.00",
    keyIngredients: ["Pro-Retinol", "Hyaluronic Acid", "Vitamin C"],
    bestFor: ["aging", "combination", "retinoid_beginner", "midrange"],
    whyRecommended:
      "Dr. Jenny Liu recommended L'Oreal Revitalift as a mid-range combination retinol night cream for beginners focused on anti-aging. It pairs pro-retinol with vitamin C and hyaluronic acid for comprehensive overnight renewal. Apply at night only.",
    source: "Dr. Jenny Liu (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=bruzUMMO_LU",
    pmOnly: true,
  },
  {
    id: "first-aid-beauty-retinol-serum",
    name: "0.3% Retinol Complex Serum",
    brand: "First Aid Beauty",
    category: "treatment",
    price: "$60.00",
    keyIngredients: ["0.3% Pure Retinol", "Colloidal Oat", "Peptides"],
    bestFor: ["sensitive", "aging", "retinoid_beginner", "midrange", "premium"],
    whyRecommended:
      "Dr. Sam Ellis featured First Aid Beauty's retinol serum for sensitive skin types who want anti-aging benefits without harsh irritation. The colloidal oat base provides soothing properties while peptides support collagen, making this ideal for sensitive beginners concerned about aging. Apply at night only.",
    source: "Dr. Sam Ellis (YouTube)",
    sourceUrl: "https://www.youtube.com/watch?v=SBylLqyy6pw",
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

  let candidates = productDatabase.filter(p => p.category === category);
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
    let candidates = productDatabase.filter(p => p.category === category);
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
    let candidates = productDatabase.filter(p => p.category === category);
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
