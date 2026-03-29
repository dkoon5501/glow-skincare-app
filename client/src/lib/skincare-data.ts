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

// Curated product database based on dermatologist recommendations
export const productDatabase: Product[] = [
  // CLEANSERS
  {
    id: "cerave-hydrating-cleanser",
    name: "Hydrating Facial Cleanser",
    brand: "CeraVe",
    category: "cleanser",
    price: "$15.99",
    keyIngredients: ["Ceramides", "Hyaluronic Acid", "Glycerin"],
    bestFor: ["dry", "normal", "sensitive", "dehydration"],
    whyRecommended: "Dermatologist-developed, restores and maintains the skin barrier without stripping moisture. Non-comedogenic and fragrance-free.",
    source: "Vogue (Dr. Corey L. Hartman, board-certified dermatologist)",
    sourceUrl: "https://www.vogue.com/article/cerave-cleanser-for-your-skin-type",
    manufacturerUrl: "https://www.cerave.com/skincare/cleansers/hydrating-facial-cleanser",
    amazonUrl: "https://www.amazon.com/dp/B01MSSDEPK?tag=glowskincar0c-20"
  },
  {
    id: "lrp-toleriane-cleanser",
    name: "Toleriane Hydrating Gentle Cleanser",
    brand: "La Roche-Posay",
    category: "cleanser",
    price: "$17.00",
    keyIngredients: ["Niacinamide", "Ceramide-3", "Thermal Spring Water"],
    bestFor: ["sensitive", "dry", "redness", "rosacea"],
    whyRecommended: "Clinically tested on sensitive skin. La Roche-Posay's thermal spring water provides soothing antioxidant benefits.",
    source: "Vogue (dermatologist-recommended gentle cleanser)",
    sourceUrl: "https://www.vogue.com/article/best-skincare-routines",
    manufacturerUrl: "https://www.laroche-posay.us/our-products/face/face-wash/toleriane-hydrating-gentle-facial-cleanser-tolerianehydratinggentlefacialcleanser.html",
    amazonUrl: "https://www.amazon.com/dp/B01N7T7JKJ?tag=glowskincar0c-20"
  },
  {
    id: "cerave-foaming-cleanser",
    name: "Foaming Facial Cleanser",
    brand: "CeraVe",
    category: "cleanser",
    price: "$15.99",
    keyIngredients: ["Ceramides", "Niacinamide", "Hyaluronic Acid"],
    bestFor: ["oily", "combination", "acne", "normal"],
    whyRecommended: "Removes excess oil and dirt without disrupting the skin barrier. Foaming formula is ideal for oily and combination skin types.",
    source: "Vogue (Dr. Kristi Collins, FAAD)",
    sourceUrl: "https://www.vogue.com/article/cerave-cleanser-for-your-skin-type",
    manufacturerUrl: "https://www.cerave.com/skincare/cleansers/foaming-facial-cleanser",
    amazonUrl: "https://www.amazon.com/dp/B01N1LL62W?tag=glowskincar0c-20"
  },
  {
    id: "lrp-effaclar-cleanser",
    name: "Effaclar Medicated Gel Cleanser",
    brand: "La Roche-Posay",
    category: "cleanser",
    price: "$17.99",
    keyIngredients: ["Salicylic Acid 2%", "Glycerin", "Zinc Pidolate"],
    bestFor: ["acne", "oily", "breakouts", "pores"],
    whyRecommended: "Medicated formula with 2% salicylic acid clears acne and unclogs pores. Recommended by dermatologists for acne-prone skin.",
    source: "La Roche-Posay (Dr. Jenny Liu, board-certified dermatologist)",
    sourceUrl: "https://www.laroche-posay.us/our-products/face/acne-products/effaclar-medicated-acne-face-wash-effaclaracnewash.html",
    manufacturerUrl: "https://www.laroche-posay.us/our-products/face/acne-products/effaclar-medicated-acne-face-wash-effaclaracnewash.html",
    amazonUrl: "https://www.amazon.com/dp/B00LO1DNXU?tag=glowskincar0c-20"
  },
  {
    id: "cerave-sa-cleanser",
    name: "SA Smoothing Cleanser",
    brand: "CeraVe",
    category: "cleanser",
    price: "$16.99",
    keyIngredients: ["Salicylic Acid", "Ceramides", "Niacinamide"],
    bestFor: ["texture", "acne", "pores", "combination"],
    whyRecommended: "Combines gentle chemical exfoliation with ceramide barrier support. Great for rough texture and bumpy skin.",
    source: "CeraVe (Dr. Tiffany Clay, board-certified dermatologist)",
    sourceUrl: "https://www.cerave.com/skincare/cleansers/renewing-sa-cleanser",
    manufacturerUrl: "https://www.cerave.com/skincare/cleansers/renewing-sa-cleanser",
    amazonUrl: "https://www.amazon.com/dp/B00U1YCRD8?tag=glowskincar0c-20"
  },

  // SERUMS
  {
    id: "skinceuticals-ce-ferulic",
    name: "C E Ferulic Serum",
    brand: "SkinCeuticals",
    category: "serum",
    price: "$182.00",
    keyIngredients: ["15% Vitamin C (L-Ascorbic Acid)", "Vitamin E", "Ferulic Acid"],
    bestFor: ["aging", "dullness", "hyperpigmentation", "dark_spots", "premium"],
    whyRecommended: "Considered the gold standard antioxidant serum by dermatologists. Provides photoprotection and brightens skin tone.",
    source: "Vogue (Dr. Corey L. Hartman & Dr. Vicki Rapaport, board-certified dermatologists)",
    sourceUrl: "https://www.vogue.com/article/skinceuticals-ce-ferulic-vitamin-c-review",
    manufacturerUrl: "https://www.skinceuticals.com/skincare/vitamin-c-serums/c-e-ferulic-with-15-l-ascorbic-acid/S17.html"
  },
  {
    id: "ordinary-niacinamide",
    name: "Niacinamide 10% + Zinc 1%",
    brand: "The Ordinary",
    category: "serum",
    price: "$6.00",
    keyIngredients: ["10% Niacinamide", "1% Zinc PCA"],
    bestFor: ["oily", "acne", "pores", "budget", "breakouts"],
    whyRecommended: "Highly effective at controlling oil production and minimizing pores. One of the most cost-effective serums on the market.",
    source: "NBC News (Dr. Annie Chiu, board-certified dermatologist)",
    sourceUrl: "https://www.nbcnews.com/select/shopping/best-niacinamide-products-ncna1303572",
    manufacturerUrl: "https://theordinary.com/en-us/niacinamide-10-zinc-1-serum-100436.html",
    amazonUrl: "https://www.amazon.com/dp/B01MDTVZTZ?tag=glowskincar0c-20"
  },
  {
    id: "ordinary-hyaluronic-acid",
    name: "Hyaluronic Acid 2% + B5",
    brand: "The Ordinary",
    category: "serum",
    price: "$8.90",
    keyIngredients: ["Hyaluronic Acid (multi-weight)", "Vitamin B5"],
    bestFor: ["dehydration", "dry", "dullness", "budget", "normal"],
    whyRecommended: "Multi-weight hyaluronic acid provides deep and surface-level hydration. Excellent value for a hydration booster.",
    source: "The Ordinary (widely recommended hydration serum by dermatologists)",
    sourceUrl: "https://theordinary.com/en-us/hyaluronic-acid-2-b5-serum-with-ceramides-100637.html",
    manufacturerUrl: "https://theordinary.com/en-us/hyaluronic-acid-2-b5-serum-with-ceramides-100637.html",
    amazonUrl: "https://www.amazon.com/dp/B01MYEZPC8?tag=glowskincar0c-20"
  },
  {
    id: "ordinary-vitamin-c",
    name: "Vitamin C Suspension 23% + HA Spheres 2%",
    brand: "The Ordinary",
    category: "serum",
    price: "$6.80",
    keyIngredients: ["23% L-Ascorbic Acid", "Hyaluronic Acid Spheres"],
    bestFor: ["dullness", "hyperpigmentation", "dark_spots", "aging", "budget"],
    whyRecommended: "High-concentration vitamin C at a fraction of the cost. Brightens skin tone, provides antioxidant protection, and enhances sunscreen effectiveness when used in the morning.",
    source: "The Ordinary (high-concentration vitamin C per dermatologist guidance)",
    sourceUrl: "https://theordinary.com/en-us/vitamin-c-suspension-23-ha-spheres-2-vitamin-c-100451.html",
    manufacturerUrl: "https://theordinary.com/en-us/vitamin-c-suspension-23-ha-spheres-2-vitamin-c-100451.html",
    amazonUrl: "https://www.amazon.com/dp/B07Y556CPP?tag=glowskincar0c-20"
  },
  {
    id: "lrp-retinol-b3",
    name: "Retinol B3 Serum",
    brand: "La Roche-Posay",
    category: "serum",
    price: "$46.99",
    keyIngredients: ["Pure Retinol", "Niacinamide (Vitamin B3)", "Thermal Spring Water"],
    bestFor: ["aging", "wrinkles", "dark_spots", "midrange", "retinoid_beginner"],
    whyRecommended: "Potent retinol combined with niacinamide for soothing. Excellent for those transitioning to retinol with sensitive skin concerns. Apply at night only — retinol degrades in sunlight.",
    source: "La Roche-Posay (Dr. Anna Karp, board-certified dermatologist)",
    sourceUrl: "https://www.laroche-posay.us/our-products/face/face-serum/retinol-b3-pure-retinol-serum-3337875694469.html",
    manufacturerUrl: "https://www.laroche-posay.us/our-products/face/face-serum/retinol-b3-pure-retinol-serum-3337875694469.html",
    amazonUrl: "https://www.amazon.com/dp/B07Z9Y4M3C?tag=glowskincar0c-20",
    pmOnly: true
  },
  {
    id: "paulas-choice-bha",
    name: "Skin Perfecting 2% BHA Liquid Exfoliant",
    brand: "Paula's Choice",
    category: "exfoliant",
    price: "$34.00",
    keyIngredients: ["2% Salicylic Acid (BHA)", "Green Tea Extract", "Methylpropanediol"],
    bestFor: ["acne", "oily", "pores", "texture", "breakouts", "midrange"],
    whyRecommended: "The iconic chemical exfoliant. Unclogs pores, smooths texture, and reduces breakouts. Works inside the pore for deep cleaning.",
    source: "Paula's Choice (widely cited as top BHA exfoliant by dermatologists)",
    sourceUrl: "https://www.paulaschoice.com/skin-perfecting-2pct-bha-liquid-exfoliant/201-2010.html",
    manufacturerUrl: "https://www.paulaschoice.com/skin-perfecting-2pct-bha-liquid-exfoliant/201-2010.html",
    amazonUrl: "https://www.amazon.com/dp/B07C5SS6YD?tag=glowskincar0c-20"
  },

  // MOISTURIZERS
  {
    id: "cerave-moisturizing-cream",
    name: "Moisturizing Cream",
    brand: "CeraVe",
    category: "moisturizer",
    price: "$18.99",
    keyIngredients: ["Ceramides (1, 3, 6-II)", "Hyaluronic Acid", "MVE Technology"],
    bestFor: ["dry", "dehydration", "sensitive", "budget"],
    whyRecommended: "Rich, long-lasting moisture with patented MVE delivery technology for 24-hour hydration. The gold standard for dry and eczema-prone skin.",
    source: "Dr. Daniel Sugai, board-certified dermatologist",
    sourceUrl: "https://www.youtube.com/watch?v=SvB_EaH29wQ",
    manufacturerUrl: "https://www.cerave.com/skincare/moisturizers/moisturizing-cream",
    amazonUrl: "https://www.amazon.com/dp/B00TTD9BRC?tag=glowskincar0c-20"
  },
  {
    id: "lrp-toleriane-moisturizer",
    name: "Toleriane Double Repair Moisturizer",
    brand: "La Roche-Posay",
    category: "moisturizer",
    price: "$22.99",
    keyIngredients: ["Ceramide-3", "Niacinamide", "Prebiotic Thermal Water"],
    bestFor: ["sensitive", "normal", "combination", "redness", "rosacea"],
    whyRecommended: "Lightweight yet effective barrier repair with prebiotic formula that supports the skin microbiome. Fast-absorbing and fragrance-free.",
    source: "People Magazine (Dr. Hovenic & Dr. Viola, board-certified dermatologists)",
    sourceUrl: "https://people.com/mature-skincare-routine-dermatologist-recommendations-january-2026-11891556",
    manufacturerUrl: "https://www.laroche-posay.us/our-products/face/face-moisturizer/toleriane-double-repair-face-moisturizer-tolerianedoublerepair.html",
    amazonUrl: "https://www.amazon.com/dp/B01NCWV3KM?tag=glowskincar0c-20"
  },
  {
    id: "neutrogena-hydro-boost",
    name: "Hydro Boost Water Gel",
    brand: "Neutrogena",
    category: "moisturizer",
    price: "$19.99",
    keyIngredients: ["Hyaluronic Acid", "Glycerin", "Dimethicone"],
    bestFor: ["oily", "combination", "dehydration", "budget", "normal"],
    whyRecommended: "Oil-free gel formula provides deep hydration without heaviness. Absorbs instantly, making it ideal under sunscreen and makeup.",
    source: "Who What Wear (Dr. Jessie Cheung & Dr. Sheila Farhang, board-certified dermatologists)",
    sourceUrl: "https://www.whowhatwear.com/beauty/skin/neutrogena-hydro-boost-water-gel-review",
    manufacturerUrl: "https://www.neutrogena.com/products/skincare/neutrogena-hydro-boost-water-gel-with-hyaluronic-acid/6811047",
    amazonUrl: "https://www.amazon.com/dp/B00NR1YQHM?tag=glowskincar0c-20"
  },
  {
    id: "cerave-pm-lotion",
    name: "PM Facial Moisturizing Lotion",
    brand: "CeraVe",
    category: "moisturizer",
    price: "$17.49",
    keyIngredients: ["Niacinamide", "Ceramides", "Hyaluronic Acid"],
    bestFor: ["oily", "acne", "combination", "budget", "normal"],
    whyRecommended: "Lightweight, oil-free formula with niacinamide to calm skin overnight. Won't clog pores — perfect for acne-prone skin.",
    source: "NewBeauty (Dr. Kenneth Beer, board-certified dermatologist)",
    sourceUrl: "https://www.newbeauty.com/view/the-best-moisturizers-to-use-with-tretinoin",
    manufacturerUrl: "https://www.cerave.com/skincare/moisturizers/pm-facial-moisturizing-lotion"
  },

  // SUNSCREENS
  {
    id: "eltamd-uv-clear",
    name: "UV Clear Broad-Spectrum SPF 46",
    brand: "EltaMD",
    category: "sunscreen",
    price: "$41.00",
    keyIngredients: ["Zinc Oxide 9%", "Niacinamide", "Hyaluronic Acid"],
    bestFor: ["sensitive", "acne", "rosacea", "redness", "midrange"],
    whyRecommended: "The #1 dermatologist-recommended sunscreen brand. Sheer, no white cast, calming niacinamide. Suitable for post-procedure skin.",
    source: "People Magazine (Dr. Engelman, board-certified dermatologist)",
    sourceUrl: "https://people.com/mature-skincare-routine-dermatologist-recommendations-january-2026-11891556",
    manufacturerUrl: "https://eltamd.com/products/uv-clear-broad-spectrum-spf-46",
    amazonUrl: "https://www.amazon.com/dp/B002MSN3QQ?tag=glowskincar0c-20"
  },
  {
    id: "lrp-anthelios",
    name: "Anthelios Clear Skin Dry Touch SPF 60",
    brand: "La Roche-Posay",
    category: "sunscreen",
    price: "$35.99",
    keyIngredients: ["Cell-Ox Shield Technology", "Silica", "Perlite"],
    bestFor: ["oily", "acne", "combination", "high_sun"],
    whyRecommended: "Oil-absorbing, dry-touch finish perfect for oily and acne-prone skin. SPF 60 provides strong protection for high sun exposure.",
    source: "Vogue (dermatologist-recommended sunscreen for oily skin)",
    sourceUrl: "https://www.vogue.com/article/best-skincare-routines",
    manufacturerUrl: "https://www.laroche-posay.us/our-products/sun/face-sunscreen/anthelios-clear-skin-oil-free-sunscreen-spf-60-antheliosclearskin.html",
    amazonUrl: "https://www.amazon.com/dp/B07YZRFH5C?tag=glowskincar0c-20"
  },
  {
    id: "cerave-am-lotion",
    name: "AM Facial Moisturizing Lotion SPF 30",
    brand: "CeraVe",
    category: "sunscreen",
    price: "$17.99",
    keyIngredients: ["Zinc Oxide", "Ceramides", "Niacinamide"],
    bestFor: ["dry", "normal", "sensitive", "budget", "dehydration"],
    whyRecommended: "Combines moisturizing ceramides with broad-spectrum SPF 30. Two-in-one convenience at a drugstore price point.",
    source: "CeraVe (Dr. Ted Lain, board-certified dermatologist)",
    sourceUrl: "https://www.cerave.com/skincare/moisturizers/am-facial-moisturizing-lotion-with-sunscreen",
    manufacturerUrl: "https://www.cerave.com/skincare/moisturizers/am-facial-moisturizing-lotion-with-sunscreen",
    amazonUrl: "https://www.amazon.com/dp/B00F97FHAW?tag=glowskincar0c-20"
  },
  {
    id: "isdin-eryfotona",
    name: "Eryfotona Ageless Tinted SPF 50",
    brand: "ISDIN",
    category: "sunscreen",
    price: "$55.00",
    keyIngredients: ["Zinc Oxide", "Peptide Technology", "Vitamin E"],
    bestFor: ["aging", "mature", "premium", "hyperpigmentation", "high_sun"],
    whyRecommended: "Combines photoprotection with peptide anti-aging technology. The tint provides a natural, even finish. Repairs existing photodamage.",
    source: "CNN Underscored (Dr. Jaimie Glick, board-certified dermatologist)",
    sourceUrl: "https://www.cnn.com/cnn-underscored/beauty/best-sunscreens-for-mature-skin",
    manufacturerUrl: "https://www.isdin.com/us/p/ageless-34-fl-oz/3431",
    amazonUrl: "https://www.amazon.com/dp/B0CV85FYPJ?tag=glowskincar0c-20"
  },

  // TREATMENTS
  {
    id: "differin-gel",
    name: "Adapalene Gel 0.1%",
    brand: "Differin",
    category: "treatment",
    price: "$14.99",
    keyIngredients: ["Adapalene 0.1%"],
    bestFor: ["acne", "breakouts", "retinoid_new", "retinoid_beginner", "budget", "pores", "texture"],
    whyRecommended: "The only FDA-approved OTC retinoid for acne. Prevents future breakouts, normalizes cell turnover. Apply at night only. Start 2-3x per week.",
    source: "Dr. Heather Rogers, board-certified dermatologist",
    sourceUrl: "https://www.doctorrogers.com/blogs/blog/dermatologist-s-retinol-recommendations-for-every-skin-type",
    manufacturerUrl: "https://differin.com/shop/differin-gel/3029949.html",
    amazonUrl: "https://www.amazon.com/dp/B07V2BRPVS?tag=glowskincar0c-20",
    pmOnly: true
  },
  {
    id: "ordinary-retinol-squalane",
    name: "Retinol 1% in Squalane",
    brand: "The Ordinary",
    category: "treatment",
    price: "$8.90",
    keyIngredients: ["1% Retinol", "Squalane"],
    bestFor: ["aging", "wrinkles", "acne", "budget", "retinoid_beginner", "texture"],
    whyRecommended: "Budget-friendly retinol in a moisturizing squalane base. Effective for mild acne, texture improvement, and early anti-aging. Apply at night only.",
    source: "Dr. Heather Rogers, board-certified dermatologist",
    sourceUrl: "https://www.doctorrogers.com/blogs/blog/dermatologist-s-retinol-recommendations-for-every-skin-type",
    manufacturerUrl: "https://theordinary.com/en-us/retinol-1-in-squalane-serum-100441.html",
    amazonUrl: "https://www.amazon.com/dp/B0DQ6496LC?tag=glowskincar0c-20",
    pmOnly: true
  },
  {
    id: "paulas-choice-retinol",
    name: "Clinical 1% Retinol Treatment",
    brand: "Paula's Choice",
    category: "treatment",
    price: "$65.00",
    keyIngredients: ["1% Retinol", "Peptides", "Vitamin C"],
    bestFor: ["aging", "wrinkles", "retinoid_experienced", "midrange", "premium", "texture"],
    whyRecommended: "High-strength retinol with collagen-promoting peptides. For experienced retinol users seeking advanced anti-aging results. Apply at night only.",
    source: "Dr. Heather Rogers, board-certified dermatologist",
    sourceUrl: "https://www.doctorrogers.com/blogs/blog/dermatologist-s-retinol-recommendations-for-every-skin-type",
    manufacturerUrl: "https://www.paulaschoice.com/clinical-1pct-retinol-treatment/801.html",
    amazonUrl: "https://www.amazon.com/dp/B00L5O31VK?tag=glowskincar0c-20",
    pmOnly: true
  },
  {
    id: "skinceuticals-retinol",
    name: "Retinol 1.0",
    brand: "SkinCeuticals",
    category: "treatment",
    price: "$102.00",
    keyIngredients: ["1.0% Pure Retinol", "Bisabolol"],
    bestFor: ["aging", "wrinkles", "acne", "retinoid_experienced", "premium", "texture"],
    whyRecommended: "High-potency retinol for experienced users. Tackles deep wrinkles, stubborn acne, and rough texture with clinical-grade results. Apply at night only.",
    source: "Dr. Heather Rogers, board-certified dermatologist",
    sourceUrl: "https://www.doctorrogers.com/blogs/blog/dermatologist-s-retinol-recommendations-for-every-skin-type",
    manufacturerUrl: "https://www.skinceuticals.com/skincare/retinol-creams/retinol-1.0/S70.html",
    pmOnly: true
  }
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
