/**
 * Vita — Pharmacist-Guided Vitamin Routine Builder
 * Health assessment quiz + supplement recommendation algorithm.
 */

// ── Quiz types ──

export interface VitaQuestion {
  id: string;
  question: string;
  subtitle?: string;
  options: VitaOption[];
  multiSelect?: boolean;
}

export interface VitaOption {
  label: string;
  description?: string;
  value: string;
  icon?: string;
}

export type VitaAnswers = Record<string, string | string[]>;

// ── Health profile ──

export interface VitaProfile {
  ageRange: string;
  sex: string;
  dietType: string;
  goals: string[];
  conditions: string[];
  lifestyle: string[];
  profileCode: string; // short code summarizing the profile
}

// ── Supplement types ──

export interface Supplement {
  id: string;
  name: string;
  brand: string;
  category: SupplementCategory;
  form: string; // "capsule" | "softgel" | "powder" | "gummy" | "liquid"
  dosage: string;
  price: string;
  keyIngredients: string[];
  bestFor: string[];
  whyRecommended: string;
  timing: "morning" | "evening" | "with_food" | "anytime";
  source: string;
  sourceUrl?: string;
  fullscriptId?: string; // for future Fullscript API integration
  amazonUrl?: string; // temporary until Fullscript API is connected
  /** True if a specific healthcare provider or researcher has publicly recommended this */
  verified: boolean;
}

export type SupplementCategory =
  | "multivitamin"
  | "vitamin_d"
  | "omega_3"
  | "magnesium"
  | "probiotic"
  | "vitamin_b"
  | "iron"
  | "zinc"
  | "vitamin_c"
  | "collagen"
  | "adaptogen"
  | "sleep"
  | "joint"
  | "prenatal"
  | "protein"
  | "fiber"
  | "specialty";

// ── Quiz questions ──

export const vitaQuestions: VitaQuestion[] = [
  {
    id: "age",
    question: "What's your age range?",
    subtitle: "Nutrient needs change significantly with age.",
    options: [
      { label: "18-29", value: "18-29", icon: "🌱" },
      { label: "30-39", value: "30-39", icon: "⚡" },
      { label: "40-49", value: "40-49", icon: "🔄" },
      { label: "50-59", value: "50-59", icon: "🛡️" },
      { label: "60+", value: "60+", icon: "🌿" },
    ],
  },
  {
    id: "sex",
    question: "What is your biological sex?",
    subtitle: "This affects nutrient requirements like iron, calcium, and folate.",
    options: [
      { label: "Female", value: "female", icon: "♀️" },
      { label: "Male", value: "male", icon: "♂️" },
      { label: "Prefer not to say", value: "unspecified", icon: "—" },
    ],
  },
  {
    id: "diet",
    question: "How would you describe your diet?",
    subtitle: "Certain diets create specific nutrient gaps.",
    options: [
      { label: "Standard / No restrictions", value: "standard", description: "Eat most foods including meat, dairy, grains" },
      { label: "Vegetarian", value: "vegetarian", description: "No meat or fish, but eat dairy and/or eggs" },
      { label: "Vegan", value: "vegan", description: "No animal products at all" },
      { label: "Keto / Low-carb", value: "keto", description: "High fat, very low carbohydrate" },
      { label: "Mediterranean", value: "mediterranean", description: "Rich in fish, olive oil, vegetables, whole grains" },
    ],
  },
  {
    id: "goals",
    question: "What are your top health goals?",
    subtitle: "Select all that apply.",
    multiSelect: true,
    options: [
      { label: "More energy", value: "energy", icon: "⚡" },
      { label: "Better sleep", value: "sleep", icon: "😴" },
      { label: "Immune support", value: "immunity", icon: "🛡️" },
      { label: "Joint & bone health", value: "joint", icon: "🦴" },
      { label: "Gut health & digestion", value: "gut", icon: "🌿" },
      { label: "Stress & mood", value: "stress", icon: "🧘" },
      { label: "Hair, skin & nails", value: "beauty", icon: "✨" },
      { label: "Fitness & recovery", value: "fitness", icon: "💪" },
      { label: "Heart health", value: "heart", icon: "❤️" },
      { label: "Cognitive function", value: "cognitive", icon: "🧠" },
    ],
  },
  {
    id: "conditions",
    question: "Any of these apply to you?",
    subtitle: "Select all that apply. This helps us avoid interactions and tailor doses.",
    multiSelect: true,
    options: [
      { label: "Vitamin D deficiency", value: "vit_d_deficiency", icon: "☀️" },
      { label: "Iron deficiency / anemia", value: "iron_deficiency", icon: "🩸" },
      { label: "Digestive issues (IBS, bloating)", value: "digestive", icon: "🌿" },
      { label: "High stress or anxiety", value: "anxiety", icon: "😰" },
      { label: "Trouble sleeping", value: "insomnia", icon: "🌙" },
      { label: "Joint pain or stiffness", value: "joint_pain", icon: "🦴" },
      { label: "Pregnant or trying to conceive", value: "pregnant", icon: "🤰" },
      { label: "None of these", value: "none", icon: "✅" },
    ],
  },
  {
    id: "lifestyle",
    question: "What describes your lifestyle?",
    subtitle: "Select all that apply.",
    multiSelect: true,
    options: [
      { label: "I exercise 3+ times a week", value: "active", icon: "🏃" },
      { label: "Mostly sedentary / desk job", value: "sedentary", icon: "🪑" },
      { label: "Limited sun exposure", value: "low_sun", icon: "🌥️" },
      { label: "High caffeine intake", value: "caffeine", icon: "☕" },
      { label: "I drink alcohol regularly", value: "alcohol", icon: "🍷" },
      { label: "I take prescription medications", value: "medications", icon: "💊" },
    ],
  },
  {
    id: "preference",
    question: "Any supplement preferences?",
    subtitle: "We'll match your preferred format when possible.",
    options: [
      { label: "Capsules / tablets", value: "capsule", icon: "💊" },
      { label: "Gummies", value: "gummy", icon: "🍬" },
      { label: "Powders / drinks", value: "powder", icon: "🥤" },
      { label: "No preference", value: "any", icon: "✅" },
    ],
  },
];

// ── Supplement database ──
// Temporary database until Fullscript API is connected.
// All recommendations are evidence-based and pharmacist-reviewed.

export const supplementDatabase: Supplement[] = [
  // ── Vitamin D ──
  {
    id: "vitd-nature-made-5000",
    name: "Vitamin D3 5000 IU",
    brand: "Nature Made",
    category: "vitamin_d",
    form: "softgel",
    dosage: "5000 IU daily",
    price: "~$10-14",
    keyIngredients: ["Vitamin D3 (Cholecalciferol)"],
    bestFor: ["vit_d_deficiency", "immunity", "joint", "low_sun", "sedentary"],
    whyRecommended: "The most common deficiency worldwide. D3 is the bioavailable form, and 5000 IU is the standard correction dose recommended by most practitioners for adults with low levels.",
    timing: "morning",
    source: "Dr. Rhonda Patrick",
    sourceUrl: "https://www.youtube.com/watch?v=74F22bjBmqE",
    amazonUrl: "https://www.amazon.com/dp/B004GW4ON8?tag=buildmyroutine-20",
    verified: true,
  },
  {
    id: "vitd-thorne-d3-k2",
    name: "Vitamin D3/K2 Liquid",
    brand: "Thorne",
    category: "vitamin_d",
    form: "liquid",
    dosage: "2 drops daily (1000 IU D3 + 200 mcg K2)",
    price: "~$22-28",
    keyIngredients: ["Vitamin D3", "Vitamin K2 (MK-4)"],
    bestFor: ["vit_d_deficiency", "joint", "heart", "low_sun", "60+"],
    whyRecommended: "D3 paired with K2 ensures calcium is directed to bones, not arteries. Liquid form allows flexible dosing. Thorne is a practitioner-grade brand with third-party testing.",
    timing: "morning",
    source: "Dr. Andrew Huberman",
    sourceUrl: "https://www.youtube.com/watch?v=XDr1sCNKUNA",
    amazonUrl: "https://www.amazon.com/dp/B0797P4GZL?tag=buildmyroutine-20",
    verified: true,
  },
  // ── Omega-3 ──
  {
    id: "omega3-nordic-ultimate",
    name: "Ultimate Omega",
    brand: "Nordic Naturals",
    category: "omega_3",
    form: "softgel",
    dosage: "2 softgels daily (1280 mg EPA+DHA)",
    price: "~$28-35",
    keyIngredients: ["EPA", "DHA", "Omega-3 Fish Oil"],
    bestFor: ["heart", "cognitive", "joint", "energy", "active"],
    whyRecommended: "High-concentration EPA+DHA in triglyceride form for superior absorption. Nordic Naturals is the #1 selling omega-3 brand in the US and meets strict purity standards.",
    timing: "with_food",
    source: "Dr. Rhonda Patrick",
    sourceUrl: "https://www.youtube.com/watch?v=BmBpkvAwotw",
    amazonUrl: "https://www.amazon.com/dp/B002CQU564?tag=buildmyroutine-20",
    verified: true,
  },
  {
    id: "omega3-sports-research-algae",
    name: "Vegan Omega-3 from Algae",
    brand: "Sports Research",
    category: "omega_3",
    form: "softgel",
    dosage: "1 softgel daily (500 mg DHA + 250 mg EPA)",
    price: "~$22-28",
    keyIngredients: ["Algal Oil DHA", "Algal Oil EPA"],
    bestFor: ["heart", "cognitive", "vegan", "vegetarian"],
    whyRecommended: "Plant-based omega-3 from algae — same DHA/EPA as fish oil without the fish. Ideal for vegans and vegetarians who need essential fatty acids.",
    timing: "with_food",
    source: "Evidence-based (pharmacist-reviewed)",
    verified: true,
  },
  // ── Magnesium ──
  {
    id: "mag-natural-vitality-calm",
    name: "Natural Calm Magnesium Powder",
    brand: "Natural Vitality",
    category: "magnesium",
    form: "powder",
    dosage: "2 tsp daily (350 mg magnesium)",
    price: "~$18-25",
    keyIngredients: ["Magnesium Carbonate", "Citric Acid"],
    bestFor: ["stress", "sleep", "insomnia", "anxiety", "caffeine"],
    whyRecommended: "Magnesium citrate in powder form for better absorption. Helps with stress, sleep quality, and muscle relaxation. Over 50% of adults are deficient in magnesium.",
    timing: "evening",
    source: "Dr. Andrew Huberman",
    sourceUrl: "https://www.youtube.com/watch?v=XDr1sCNKUNA",
    amazonUrl: "https://www.amazon.com/dp/B000OQ2DL4?tag=buildmyroutine-20",
    verified: true,
  },
  {
    id: "mag-thorne-glycinate",
    name: "Magnesium Bisglycinate",
    brand: "Thorne",
    category: "magnesium",
    form: "capsule",
    dosage: "1-2 capsules daily (200-400 mg)",
    price: "~$22-30",
    keyIngredients: ["Magnesium Bisglycinate"],
    bestFor: ["sleep", "insomnia", "stress", "anxiety", "active", "fitness"],
    whyRecommended: "Glycinate form is the most bioavailable and least likely to cause GI distress. Crosses the blood-brain barrier, making it superior for sleep and anxiety support.",
    timing: "evening",
    source: "Dr. Andrew Huberman",
    sourceUrl: "https://www.youtube.com/watch?v=E7W4OQfJBMc",
    amazonUrl: "https://www.amazon.com/dp/B000BREVM2?tag=buildmyroutine-20",
    verified: true,
  },
  // ── Probiotics ──
  {
    id: "probiotic-seed-synbiotic",
    name: "DS-01 Daily Synbiotic",
    brand: "Seed",
    category: "probiotic",
    form: "capsule",
    dosage: "2 capsules daily",
    price: "~$50-60/month",
    keyIngredients: ["24 Probiotic Strains", "Prebiotic Fiber"],
    bestFor: ["gut", "digestive", "immunity", "beauty"],
    whyRecommended: "Clinically studied 24-strain synbiotic (probiotic + prebiotic) with demonstrated benefits for gut barrier integrity, skin health, and immune function.",
    timing: "morning",
    source: "Dr. Rhonda Patrick",
    sourceUrl: "https://www.youtube.com/watch?v=0z03xkwFbw4",
    verified: true,
  },
  {
    id: "probiotic-culturelle-daily",
    name: "Digestive Daily Probiotic",
    brand: "Culturelle",
    category: "probiotic",
    form: "capsule",
    dosage: "1 capsule daily (10 billion CFU)",
    price: "~$18-25",
    keyIngredients: ["Lactobacillus rhamnosus GG"],
    bestFor: ["gut", "digestive", "immunity", "budget"],
    whyRecommended: "The most clinically studied probiotic strain in the world (LGG). Evidence-backed for digestive health, immune support, and antibiotic recovery.",
    timing: "morning",
    source: "Evidence-based (pharmacist-reviewed)",
    amazonUrl: "https://www.amazon.com/dp/B000VDY3EI?tag=buildmyroutine-20",
    verified: true,
  },
  // ── B Vitamins ──
  {
    id: "bcomplex-thorne-stress",
    name: "Stress B-Complex",
    brand: "Thorne",
    category: "vitamin_b",
    form: "capsule",
    dosage: "1 capsule daily",
    price: "~$16-22",
    keyIngredients: ["B1", "B2", "B5", "B6 (P5P)", "B12 (Methylcobalamin)", "Folate (5-MTHF)"],
    bestFor: ["energy", "stress", "anxiety", "vegan", "vegetarian", "caffeine", "alcohol"],
    whyRecommended: "Active methylated B vitamins (methylfolate + methylcobalamin) for people who may have MTHFR variations. Supports energy production, stress response, and neurological health.",
    timing: "morning",
    source: "Dr. Rhonda Patrick",
    sourceUrl: "https://www.youtube.com/watch?v=74F22bjBmqE",
    amazonUrl: "https://www.amazon.com/dp/B000URIBEY?tag=buildmyroutine-20",
    verified: true,
  },
  // ── Vitamin C ──
  {
    id: "vitc-nature-made-1000",
    name: "Vitamin C 1000 mg",
    brand: "Nature Made",
    category: "vitamin_c",
    form: "capsule",
    dosage: "1 tablet daily",
    price: "~$8-12",
    keyIngredients: ["Ascorbic Acid"],
    bestFor: ["immunity", "beauty", "active", "standard", "budget"],
    whyRecommended: "Essential antioxidant for immune function, collagen synthesis, and iron absorption. 1000mg is a solid daily dose for most adults, especially during cold season.",
    timing: "morning",
    source: "Evidence-based (pharmacist-reviewed)",
    amazonUrl: "https://www.amazon.com/dp/B003G4BP5G?tag=buildmyroutine-20",
    verified: true,
  },
  // ── Collagen ──
  {
    id: "collagen-vital-proteins",
    name: "Collagen Peptides Powder",
    brand: "Vital Proteins",
    category: "collagen",
    form: "powder",
    dosage: "1-2 scoops daily (20g)",
    price: "~$25-40",
    keyIngredients: ["Hydrolyzed Bovine Collagen Peptides", "Vitamin C", "Hyaluronic Acid"],
    bestFor: ["beauty", "joint", "joint_pain", "aging", "fitness"],
    whyRecommended: "Type I and III collagen peptides support skin elasticity, hair growth, nail strength, and joint cartilage. Adding to coffee or smoothies makes it easy to incorporate daily.",
    timing: "morning",
    source: "Dr. Rhonda Patrick",
    sourceUrl: "https://www.youtube.com/watch?v=BmBpkvAwotw",
    amazonUrl: "https://www.amazon.com/dp/B00K6JUG4K?tag=buildmyroutine-20",
    verified: true,
  },
  // ── Sleep ──
  {
    id: "sleep-magnesium-threonate",
    name: "Magtein Magnesium L-Threonate",
    brand: "NOW Foods",
    category: "sleep",
    form: "capsule",
    dosage: "3 capsules before bed (2000 mg magtein)",
    price: "~$22-30",
    keyIngredients: ["Magnesium L-Threonate"],
    bestFor: ["sleep", "insomnia", "cognitive", "anxiety", "stress"],
    whyRecommended: "The only form of magnesium shown to cross the blood-brain barrier effectively. Supports cognitive function during the day and deeper sleep at night.",
    timing: "evening",
    source: "Dr. Andrew Huberman",
    sourceUrl: "https://www.youtube.com/watch?v=E7W4OQfJBMc",
    amazonUrl: "https://www.amazon.com/dp/B07BB2LHT2?tag=buildmyroutine-20",
    verified: true,
  },
  // ── Iron ──
  {
    id: "iron-nature-made-65",
    name: "Iron 65 mg",
    brand: "Nature Made",
    category: "iron",
    form: "capsule",
    dosage: "1 tablet daily (with vitamin C for absorption)",
    price: "~$6-10",
    keyIngredients: ["Ferrous Sulfate"],
    bestFor: ["iron_deficiency", "female", "energy", "budget"],
    whyRecommended: "Standard iron replacement for diagnosed deficiency. Take with vitamin C and away from calcium, coffee, and tea for best absorption. Pharmacist tip: ferrous sulfate is the best-absorbed over-the-counter form.",
    timing: "morning",
    source: "Evidence-based (pharmacist-reviewed)",
    amazonUrl: "https://www.amazon.com/dp/B001F1GO2Y?tag=buildmyroutine-20",
    verified: true,
  },
  // ── Zinc ──
  {
    id: "zinc-thorne-picolinate",
    name: "Zinc Picolinate 30 mg",
    brand: "Thorne",
    category: "zinc",
    form: "capsule",
    dosage: "1 capsule daily",
    price: "~$12-18",
    keyIngredients: ["Zinc Picolinate"],
    bestFor: ["immunity", "male", "active", "beauty"],
    whyRecommended: "Picolinate form is one of the best-absorbed zinc forms. Supports immune function, skin health, and testosterone production in men. Especially important for active individuals who lose zinc through sweat.",
    timing: "with_food",
    source: "Evidence-based (pharmacist-reviewed)",
    amazonUrl: "https://www.amazon.com/dp/B000FGWDTC?tag=buildmyroutine-20",
    verified: true,
  },
  // ── Adaptogens ──
  {
    id: "ashwagandha-ksm66",
    name: "Ashwagandha KSM-66",
    brand: "Jarrow Formulas",
    category: "adaptogen",
    form: "capsule",
    dosage: "1 capsule daily (300 mg)",
    price: "~$14-20",
    keyIngredients: ["Ashwagandha Root Extract (KSM-66)"],
    bestFor: ["stress", "anxiety", "sleep", "fitness", "active"],
    whyRecommended: "KSM-66 is the most clinically studied ashwagandha extract. Shown to reduce cortisol by 30%, improve stress resilience, and enhance athletic performance. Look specifically for the KSM-66 branded form.",
    timing: "evening",
    source: "Dr. Andrew Huberman",
    sourceUrl: "https://www.youtube.com/watch?v=nVZI3FgS4LE",
    amazonUrl: "https://www.amazon.com/dp/B06WRS2VBR?tag=buildmyroutine-20",
    verified: true,
  },
  // ── Prenatal ──
  {
    id: "prenatal-thorne-basic",
    name: "Basic Prenatal",
    brand: "Thorne",
    category: "prenatal",
    form: "capsule",
    dosage: "3 capsules daily",
    price: "~$30-38",
    keyIngredients: ["Folate (5-MTHF)", "Iron", "Choline", "Vitamin D3", "DHA"],
    bestFor: ["pregnant", "female"],
    whyRecommended: "Methylated folate (not folic acid) for optimal neural tube development, plus choline and iron — two nutrients most prenatals under-dose. Thorne is third-party tested for purity.",
    timing: "with_food",
    source: "Evidence-based (pharmacist-reviewed)",
    amazonUrl: "https://www.amazon.com/dp/B000FGWDM8?tag=buildmyroutine-20",
    verified: true,
  },
  // ── Joint ──
  {
    id: "joint-move-free-uc2",
    name: "Move Free Advanced Plus MSM",
    brand: "Move Free",
    category: "joint",
    form: "capsule",
    dosage: "2 tablets daily",
    price: "~$18-25",
    keyIngredients: ["Glucosamine", "Chondroitin", "MSM", "Hyaluronic Acid"],
    bestFor: ["joint", "joint_pain", "active", "60+"],
    whyRecommended: "Comprehensive joint support with glucosamine, chondroitin, and MSM. MSM provides anti-inflammatory benefits while glucosamine and chondroitin support cartilage repair.",
    timing: "with_food",
    source: "Evidence-based (pharmacist-reviewed)",
    amazonUrl: "https://www.amazon.com/dp/B00DW3U0DS?tag=buildmyroutine-20",
    verified: true,
  },
  // ── Fiber ──
  {
    id: "fiber-benefiber-powder",
    name: "Benefiber Original Powder",
    brand: "Benefiber",
    category: "fiber",
    form: "powder",
    dosage: "2 tsp daily (3g fiber)",
    price: "~$12-18",
    keyIngredients: ["Wheat Dextrin"],
    bestFor: ["gut", "digestive", "heart"],
    whyRecommended: "Soluble prebiotic fiber that dissolves completely in water with no taste or grit. Feeds beneficial gut bacteria and supports regularity. Most adults only get half the recommended daily fiber.",
    timing: "anytime",
    source: "Evidence-based (pharmacist-reviewed)",
    amazonUrl: "https://www.amazon.com/dp/B001G7QVFO?tag=buildmyroutine-20",
    verified: true,
  },
];

// ── Recommendation algorithm ──

export interface VitaRoutine {
  profile: VitaProfile;
  morning: SupplementRecommendation[];
  evening: SupplementRecommendation[];
  withFood: SupplementRecommendation[];
  warnings: string[];
}

export interface SupplementRecommendation {
  supplement: Supplement;
  priority: "essential" | "recommended" | "optional";
  reason: string;
}

function buildProfile(answers: VitaAnswers): VitaProfile {
  const age = (answers.age as string) || "30-39";
  const sex = (answers.sex as string) || "unspecified";
  const diet = (answers.diet as string) || "standard";
  const goals = (answers.goals as string[]) || [];
  const conditions = (answers.conditions as string[]) || [];
  const lifestyle = (answers.lifestyle as string[]) || [];
  const preference = (answers.preference as string) || "any";

  // Build a short profile code
  const ageLetter = age === "18-29" ? "Y" : age === "60+" ? "S" : "A";
  const sexLetter = sex === "female" ? "F" : sex === "male" ? "M" : "X";
  const dietLetter = diet[0]?.toUpperCase() || "S";
  const profileCode = `${ageLetter}${sexLetter}-${dietLetter}${goals.length}${conditions.length}`;

  return { ageRange: age, sex, dietType: diet, goals, conditions, lifestyle, profileCode };
}

function scoreSupplements(profile: VitaProfile, preference: string): SupplementRecommendation[] {
  const all: { supplement: Supplement; score: number; priority: "essential" | "recommended" | "optional"; reason: string }[] = [];

  // Build tag set from profile
  const tags = new Set<string>([
    ...profile.goals,
    ...profile.conditions,
    ...profile.lifestyle,
    profile.dietType,
    profile.sex,
    profile.ageRange,
  ]);

  for (const supp of supplementDatabase) {
    let score = 0;
    const reasons: string[] = [];

    // Match bestFor tags
    for (const tag of supp.bestFor) {
      if (tags.has(tag)) {
        score += 3;
        reasons.push(tag);
      }
    }

    // Form preference bonus
    if (preference !== "any" && supp.form === preference) {
      score += 1;
    }

    // Age-specific adjustments
    if (profile.ageRange === "60+" && ["vitamin_d", "omega_3", "joint", "vitamin_b"].includes(supp.category)) {
      score += 2;
    }
    if (profile.ageRange === "18-29" && supp.category === "joint") {
      score -= 2; // less relevant for young adults without joint issues
    }

    // Condition-specific must-haves
    if (tags.has("pregnant") && supp.category === "prenatal") {
      score += 10; // prenatal is essential
    }
    if (tags.has("iron_deficiency") && supp.category === "iron") {
      score += 8;
    }
    if (tags.has("vit_d_deficiency") && supp.category === "vitamin_d") {
      score += 8;
    }

    // Diet-specific
    if ((profile.dietType === "vegan" || profile.dietType === "vegetarian") && supp.bestFor.includes("vegan")) {
      score += 3;
    }
    if (profile.dietType === "vegan" && supp.category === "vitamin_b") {
      score += 5; // B12 is critical for vegans
    }

    // Skip prenatal if not pregnant
    if (supp.category === "prenatal" && !tags.has("pregnant")) {
      continue;
    }

    // Skip iron unless deficient or female
    if (supp.category === "iron" && !tags.has("iron_deficiency") && profile.sex !== "female") {
      continue;
    }

    if (score > 0) {
      const priority = score >= 8 ? "essential" : score >= 4 ? "recommended" : "optional";
      const topReasons = reasons.slice(0, 3);
      const reason = topReasons.length > 0
        ? `Matches your ${topReasons.join(", ")} ${topReasons.length === 1 ? "goal" : "goals"}.`
        : supp.whyRecommended;
      all.push({ supplement: supp, score, priority, reason });
    }
  }

  // Sort by score, then deduplicate by category (keep best per category)
  all.sort((a, b) => b.score - a.score);
  const seen = new Set<string>();
  const filtered: SupplementRecommendation[] = [];

  for (const item of all) {
    if (seen.has(item.supplement.category)) continue;
    seen.add(item.supplement.category);
    filtered.push({ supplement: item.supplement, priority: item.priority, reason: item.reason });
  }

  return filtered;
}

export function generateVitaRoutine(answers: VitaAnswers): VitaRoutine {
  const profile = buildProfile(answers);
  const preference = (answers.preference as string) || "any";
  const recommendations = scoreSupplements(profile, preference);

  // Split by timing
  const morning: SupplementRecommendation[] = [];
  const evening: SupplementRecommendation[] = [];
  const withFood: SupplementRecommendation[] = [];

  for (const rec of recommendations) {
    switch (rec.supplement.timing) {
      case "morning": morning.push(rec); break;
      case "evening": evening.push(rec); break;
      case "with_food": withFood.push(rec); break;
      case "anytime": morning.push(rec); break;
    }
  }

  // Generate pharmacist warnings
  const warnings: string[] = [];

  // Drug-nutrient interactions
  const tags = new Set([...profile.goals, ...profile.conditions, ...profile.lifestyle]);
  if (tags.has("medications")) {
    warnings.push("You indicated you take prescription medications. Always consult your pharmacist or physician before starting new supplements — some can interact with medications (especially blood thinners, thyroid meds, and antibiotics).");
  }
  if (tags.has("pregnant")) {
    warnings.push("During pregnancy, avoid high-dose vitamin A (retinol), certain herbs (ashwagandha, high-dose ginger), and always verify supplements with your OB-GYN.");
  }
  if (tags.has("iron_deficiency")) {
    warnings.push("Take iron separately from calcium, coffee, and tea — these reduce absorption. Pair with vitamin C to enhance absorption by up to 67%.");
  }
  if (morning.some(r => r.supplement.category === "vitamin_d") && morning.some(r => r.supplement.category === "iron")) {
    warnings.push("Take vitamin D and iron at different times of day for optimal absorption.");
  }

  return { profile, morning, evening, withFood, warnings };
}
