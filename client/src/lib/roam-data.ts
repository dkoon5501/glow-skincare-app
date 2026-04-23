/**
 * Roam — Creator-Vetted Travel Picks
 * 24 hand-curated Kara & Nate YouTube episodes across 6 regions.
 * Source: Kara & Nate (YouTube creators) — youtube.com/@KaraandNate
 */

// ── Types ──

export type VibeTag = "luxury" | "budget" | "offbeat" | "adventure";
export type Region = "Asia" | "Europe" | "Americas" | "Africa" | "Middle East" | "Oceania";
export type Duration = "week" | "twoWeeks" | "month";
export type TravelStyle = "solo" | "partner" | "family" | "group";

export interface RoamQuestion {
  id: string;
  question: string;
  subtitle?: string;
  options: RoamOption[];
}

export interface RoamOption {
  label: string;
  value: string;
  description?: string;
  icon?: string;
}

export type RoamAnswers = Record<string, string>;

export interface RoamEpisode {
  id: string;
  title: string;
  destination: string;
  country: string;
  region: Region;
  videoId: string;
  vibeTags: VibeTag[];
  duration: Duration[];
  travelStyle: TravelStyle[];
  description: string;
  highlights: string[];
}

// ── Quiz questions ──

export const roamQuestions: RoamQuestion[] = [
  {
    id: "vibe",
    question: "What's your travel vibe?",
    subtitle: "Pick the one that feels most like you right now.",
    options: [
      { label: "Luxury", value: "luxury", icon: "✨", description: "Five-star resorts, elevated experiences, zero compromises" },
      { label: "Budget", value: "budget", icon: "🎒", description: "Street food, hostels, and maximum experiences per dollar" },
      { label: "Offbeat", value: "offbeat", icon: "🗺️", description: "Fewer tourists, unusual landscapes, stories nobody else has" },
      { label: "Adventure", value: "adventure", icon: "⛰️", description: "Hikes, dives, adrenaline, and earning the view" },
    ],
  },
  {
    id: "region",
    question: "Which region calls to you?",
    subtitle: "Where in the world are you drawn?",
    options: [
      { label: "Asia", value: "Asia", icon: "🌏" },
      { label: "Europe", value: "Europe", icon: "🏰" },
      { label: "Americas", value: "Americas", icon: "🌎" },
      { label: "Africa", value: "Africa", icon: "🌍" },
      { label: "Middle East", value: "Middle East", icon: "🕌" },
      { label: "Oceania", value: "Oceania", icon: "🦘" },
    ],
  },
  {
    id: "duration",
    question: "How long are you planning to travel?",
    options: [
      { label: "About a week", value: "week", icon: "📅", description: "7–9 days" },
      { label: "Two weeks", value: "twoWeeks", icon: "🗓️", description: "10–18 days" },
      { label: "A month or more", value: "month", icon: "🌐", description: "3+ weeks" },
    ],
  },
  {
    id: "travelStyle",
    question: "Who are you traveling with?",
    options: [
      { label: "Solo", value: "solo", icon: "🧭" },
      { label: "Partner / couple", value: "partner", icon: "👫" },
      { label: "Family", value: "family", icon: "👨‍👩‍👧" },
      { label: "Group of friends", value: "group", icon: "👥" },
    ],
  },
];

// ── Episode database ──
// 24 episodes across 6 regions (4 per region).
// All videoIds belong to Kara & Nate (youtube.com/@KaraandNate).

export const roamEpisodes: RoamEpisode[] = [
  // ── ASIA ──
  {
    id: "maldives-soneva-jani",
    title: "Maldives: Soneva Jani Overwater Villa",
    destination: "Soneva Jani, Maldives",
    country: "Maldives",
    region: "Asia",
    videoId: "NjU9O3o11lA",
    vibeTags: ["luxury"],
    duration: ["week"],
    travelStyle: ["partner"],
    description: "Kara & Nate experience one of the world's most coveted overwater villas at the ultra-luxury Soneva Jani resort — slide directly into the Indian Ocean from your private deck.",
    highlights: ["Private overwater villa with water slide", "Snorkeling straight from your deck", "Michelin-level dining in the ocean"],
  },
  {
    id: "nepal-everest-base-camp",
    title: "Nepal: Everest Base Camp Trek",
    destination: "Everest Base Camp, Nepal",
    country: "Nepal",
    region: "Asia",
    videoId: "rW1wTBSKieU",
    vibeTags: ["offbeat", "adventure"],
    duration: ["twoWeeks"],
    travelStyle: ["group"],
    description: "Kara & Nate tackle the iconic Everest Base Camp trek starting with the notoriously terrifying Lukla flight — one of the world's most memorable journeys on foot.",
    highlights: ["Legendary Lukla mountain airstrip landing", "Trek through Sherpa villages", "Standing at 5,364m Everest Base Camp"],
  },
  {
    id: "vietnam-dads-first-trip",
    title: "Vietnam: Surprising Dad with His First Trip",
    destination: "Vietnam",
    country: "Vietnam",
    region: "Asia",
    videoId: "E-ioeGwcXr0",
    vibeTags: ["budget", "offbeat"],
    duration: ["twoWeeks"],
    travelStyle: ["family"],
    description: "Kara surprises her dad with his first-ever trip to Vietnam — a budget-friendly adventure through markets, motorbike rides, and street food that changed his perspective on travel.",
    highlights: ["Family-friendly budget travel", "Street food immersion", "Local market experiences"],
  },
  {
    id: "bali-day-trips",
    title: "Bali: Best Day Trips & Hidden Adventures",
    destination: "Bali, Indonesia",
    country: "Indonesia",
    region: "Asia",
    videoId: "KETPV_Lncp0",
    vibeTags: ["adventure", "budget"],
    duration: ["week"],
    travelStyle: ["solo"],
    description: "Kara & Nate discover Bali's best day trips from base camp — waterfalls, rice terraces, and experiences you won't find in the guidebook (yes, Kara takes a tumble).",
    highlights: ["Off-the-beaten-path waterfalls", "Rice terrace treks", "Budget-friendly full-day adventures"],
  },

  // ── EUROPE ──
  {
    id: "iceland-fairytale-landscapes",
    title: "Iceland: Fairytale Landscapes & Hidden Gems",
    destination: "Iceland",
    country: "Iceland",
    region: "Europe",
    videoId: "FPrV2i-ZN9I",
    vibeTags: ["offbeat", "adventure"],
    duration: ["twoWeeks"],
    travelStyle: ["partner"],
    description: "Kara & Nate roam Iceland's surreal landscape — yes, they trespassed a little — finding hidden waterfalls, black sand beaches, and fairytale villages most visitors never see.",
    highlights: ["Hidden waterfalls off the Ring Road", "Trespassing for the best views", "Midnight sun landscapes"],
  },
  {
    id: "portugal-lisbon-first-day",
    title: "Portugal: First Day in Lisbon",
    destination: "Lisbon, Portugal",
    country: "Portugal",
    region: "Europe",
    videoId: "GWx3zL1uOcg",
    vibeTags: ["budget"],
    duration: ["week"],
    travelStyle: ["solo"],
    description: "Kara & Nate hit Lisbon on day one — cobblestone hills, pastel de nata, tram rides, and a budget-friendly city that punches way above its weight for food and culture.",
    highlights: ["Tram 28 through historic districts", "Pastéis de Belém tasting", "Viewpoint-hopping at sunset"],
  },
  {
    id: "italy-vespa-tour",
    title: "Italy: Vespa Tour, Cheese Farm & Villa Pool",
    destination: "Le Marche, Italy",
    country: "Italy",
    region: "Europe",
    videoId: "QJTBCQQDdcI",
    vibeTags: ["luxury"],
    duration: ["twoWeeks"],
    travelStyle: ["partner"],
    description: "Kara & Nate explore the Italian countryside by Vespa — visiting a working cheese farm, swimming at a private villa, and discovering the slow-travel version of Italy few tourists find.",
    highlights: ["Vespa tour through Le Marche", "Traditional cheese-making farm visit", "Private villa with pool"],
  },
  {
    id: "switzerland-interlaken",
    title: "Switzerland: 48 Hours in Europe's Adventure Capital",
    destination: "Interlaken, Switzerland",
    country: "Switzerland",
    region: "Europe",
    videoId: "lQDU4J_Xb3c",
    vibeTags: ["adventure"],
    duration: ["week"],
    travelStyle: ["group"],
    description: "Kara & Nate pack canyoning, bungy jumping, skydiving, canyon swinging, and paragliding into 48 hours in Interlaken — Europe's adventure capital delivers on every promise.",
    highlights: ["Skydiving over the Swiss Alps", "Canyon swinging at 165m", "Paragliding above Lake Brienz"],
  },

  // ── AMERICAS ──
  {
    id: "bolivia-uyuni-salt-flats",
    title: "Bolivia: Uyuni Salt Flats — World's Biggest Mirror",
    destination: "Salar de Uyuni, Bolivia",
    country: "Bolivia",
    region: "Americas",
    videoId: "1vPMD3wmaZo",
    vibeTags: ["offbeat"],
    duration: ["twoWeeks"],
    travelStyle: ["partner"],
    description: "Kara & Nate drive onto the world's largest salt flat after rain transforms it into a perfect mirror — one of the most otherworldly landscapes on earth.",
    highlights: ["Driving on a reflective infinity mirror", "Flamingos in high-altitude lagoons", "Staying in a salt hotel"],
  },
  {
    id: "peru-machu-picchu",
    title: "Peru: We Saw Machu Picchu! (kinda)",
    destination: "Machu Picchu, Peru",
    country: "Peru",
    region: "Americas",
    videoId: "V58jVJpkUQI",
    vibeTags: ["adventure", "offbeat"],
    duration: ["twoWeeks"],
    travelStyle: ["partner"],
    description: "Kara & Nate make the pilgrimage to Machu Picchu — spoiler: the clouds had other plans. Still one of the most memorable experiences they've ever documented.",
    highlights: ["Aguas Calientes train journey", "Sunrise hike to the Sun Gate", "Ancient Inca citadel at 2,430m"],
  },
  {
    id: "colombia-cartagena",
    title: "Colombia: 24 Hours in Cartagena",
    destination: "Cartagena, Colombia",
    country: "Colombia",
    region: "Americas",
    videoId: "odPPV3jPUIE",
    vibeTags: ["budget"],
    duration: ["week"],
    travelStyle: ["partner"],
    description: "Kara & Nate pack their last Colombian stop — Cartagena's walled city — with a Medellín food tour, colorful street art, and Caribbean coast vibes, all on a backpacker budget.",
    highlights: ["Walled old city exploration", "Medellín street food tour", "Caribbean sunset on the ramparts"],
  },
  {
    id: "peru-motorbike",
    title: "Peru: 8 Days Surviving on a Tiny Motorbike",
    destination: "Andes, Peru",
    country: "Peru",
    region: "Americas",
    videoId: "B2rFUbI0ER8",
    vibeTags: ["adventure"],
    duration: ["twoWeeks"],
    travelStyle: ["solo"],
    description: "Kara & Nate take on one of their most physically demanding trips — 8 days navigating Peru's winding mountain roads on a small motorbike through the Andes.",
    highlights: ["Andean mountain passes by motorbike", "Remote villages with no tourist infrastructure", "Camping under Andean skies"],
  },

  // ── AFRICA ──
  {
    id: "kenya-maasai-mara-safari",
    title: "Kenya: African Safari in Maasai Mara",
    destination: "Maasai Mara, Kenya",
    country: "Kenya",
    region: "Africa",
    videoId: "ZLLR8nGl0s0",
    vibeTags: ["luxury", "adventure"],
    duration: ["week"],
    travelStyle: ["partner"],
    description: "Kara & Nate tick off one of the world's greatest bucket list experiences — a full-immersion safari in Kenya's Maasai Mara, where the Big Five roam freely.",
    highlights: ["Big Five game drives at dawn", "Hot air balloon safari over the plains", "Maasai village cultural visit"],
  },
  {
    id: "zanzibar-stone-town",
    title: "Zanzibar: Stone Town Street Food & History",
    destination: "Stone Town, Zanzibar",
    country: "Tanzania",
    region: "Africa",
    videoId: "R1DiRTXY6oc",
    vibeTags: ["budget", "offbeat"],
    duration: ["week"],
    travelStyle: ["solo"],
    description: "Kara & Nate explore Zanzibar's UNESCO-listed Stone Town — a maze of spice-scented alleyways, colonial history, and some of the best street food in East Africa.",
    highlights: ["Forodhani Gardens night food market", "Spice farm tour", "Freddie Mercury's birthplace"],
  },
  {
    id: "morocco-sahara-marrakech",
    title: "Morocco: Sahara Desert to Marrakech",
    destination: "Sahara to Marrakech, Morocco",
    country: "Morocco",
    region: "Africa",
    videoId: "Y5WgJiL-aMw",
    vibeTags: ["offbeat", "adventure"],
    duration: ["twoWeeks"],
    travelStyle: ["partner"],
    description: "Kara & Nate journey from Morocco's surreal Sahara dunes all the way to the sensory overload of Marrakech's medina — two wildly different worlds in one country.",
    highlights: ["Camel trek into the Sahara at sunset", "Sleeping under the Saharan stars", "Djemaa el-Fna square at night"],
  },
  {
    id: "namibia-emptiest-country",
    title: "Africa: 8 Days in the Continent's Emptiest Country",
    destination: "Namibia, Africa",
    country: "Namibia",
    region: "Africa",
    videoId: "Uytj_nfa_7E",
    vibeTags: ["offbeat", "adventure"],
    duration: ["twoWeeks"],
    travelStyle: ["partner"],
    description: "Kara & Nate self-drive through Africa's least-visited country — desert landscapes, coastal ghost towns, and a self-drive safari in one of the world's most dramatic destinations.",
    highlights: ["Namib Desert — world's oldest desert", "Skeleton Coast ghost towns", "Self-drive Etosha National Park safari"],
  },

  // ── MIDDLE EAST ──
  {
    id: "oman-overlanding-pt1",
    title: "Oman: 9 Days Overlanding — Into the Wild",
    destination: "Oman",
    country: "Oman",
    region: "Middle East",
    videoId: "mrUe7JmecNQ",
    vibeTags: ["adventure", "offbeat"],
    duration: ["twoWeeks"],
    travelStyle: ["partner"],
    description: "Kara & Nate begin an epic 9-day overland journey through Oman — wadis, canyons, desert camps, and a country that consistently surprises even seasoned travelers.",
    highlights: ["Wadi canyon swimming", "Overnight desert camp under the stars", "Sultanate forts and traditional souqs"],
  },
  {
    id: "oman-first-impressions",
    title: "Oman: First Impressions & Why It Surprised Us",
    destination: "Muscat, Oman",
    country: "Oman",
    region: "Middle East",
    videoId: "TCD-gDwwFXM",
    vibeTags: ["offbeat"],
    duration: ["week"],
    travelStyle: ["solo"],
    description: "Kara & Nate share honest first impressions of Oman — a Middle Eastern destination that's everything Dubai isn't: authentic, genuinely surprising, and far more affordable.",
    highlights: ["Old Muscat exploration", "Sultan Qaboos Grand Mosque", "Traditional Omani market (souq)"],
  },
  {
    id: "dubai-desert-safari",
    title: "Dubai: Desert Safari & Overnight Desert Camp",
    destination: "Dubai, UAE",
    country: "United Arab Emirates",
    region: "Middle East",
    videoId: "iRgK7F9W7Kw",
    vibeTags: ["luxury", "adventure"],
    duration: ["week"],
    travelStyle: ["partner"],
    description: "Kara & Nate take on Dubai's legendary desert safari — dune bashing, camel riding, and an overnight camp beneath a sea of stars just outside the city's glass towers.",
    highlights: ["4x4 dune bashing in the desert", "Traditional Bedouin camp dinner", "Overnight under desert stars"],
  },
  {
    id: "middle-east-van-life",
    title: "Middle East: Van Life Adventure Off the Beaten Path",
    destination: "Oman / UAE",
    country: "Oman",
    region: "Middle East",
    videoId: "A6gSZ_CP5d4",
    vibeTags: ["adventure"],
    duration: ["month"],
    travelStyle: ["group"],
    description: "Kara & Nate join a van life crew to explore the Middle East the slow way — living on the road through remote desert regions, mountain villages, and coastal wadis.",
    highlights: ["Remote wadi camping spots", "Mountain village overnight stays", "Off-road desert driving"],
  },

  // ── OCEANIA ──
  {
    id: "new-zealand-perfect-day",
    title: "New Zealand: The Perfect Day",
    destination: "New Zealand",
    country: "New Zealand",
    region: "Oceania",
    videoId: "SwGF-A_A6dY",
    vibeTags: ["offbeat", "adventure"],
    duration: ["week"],
    travelStyle: ["partner"],
    description: "Kara & Nate find their version of a perfect day in New Zealand — equal parts jaw-dropping scenery, outdoor adventure, and the kind of calm you only find at the edge of the world.",
    highlights: ["Fiordland fjord exploration", "Hobbiton movie set visit", "Bungee jumping above a turquoise river"],
  },
  {
    id: "australia-wallabies-diving",
    title: "Australia: Wallabies & World-Class Diving",
    destination: "Queensland, Australia",
    country: "Australia",
    region: "Oceania",
    videoId: "VZEab3eF-S0",
    vibeTags: ["adventure", "budget"],
    duration: ["twoWeeks"],
    travelStyle: ["solo"],
    description: "Kara & Nate discover why Australia is awesome — wallabies on the beach, world-class Great Barrier Reef diving, and an East Coast that delivers at every turn.",
    highlights: ["Great Barrier Reef scuba diving", "Whitsunday Islands sailing", "Wildlife encounters with wallabies"],
  },
  {
    id: "australia-melbourne",
    title: "Australia: An Afternoon in Melbourne",
    destination: "Melbourne, Australia",
    country: "Australia",
    region: "Oceania",
    videoId: "97IdFfIqk24",
    vibeTags: ["budget"],
    duration: ["week"],
    travelStyle: ["solo"],
    description: "Kara & Nate explore Melbourne's famously liveable city — world-class coffee culture, laneway street art, the Queen Vic Market, and an afternoon well spent.",
    highlights: ["Coffee culture in the laneways", "Street art in Hosier Lane", "Queen Victoria Market food tour"],
  },
  {
    id: "australia-sydney-byron-bay",
    title: "Australia: Sydney to Byron Bay by Campervan",
    destination: "New South Wales, Australia",
    country: "Australia",
    region: "Oceania",
    videoId: "1WuM41aPnUo",
    vibeTags: ["adventure"],
    duration: ["twoWeeks"],
    travelStyle: ["group"],
    description: "Kara & Nate road trip the iconic Sydney to Byron Bay route by campervan — beach towns, national parks, whale watching, and the freedom of the open East Coast road.",
    highlights: ["Royal National Park coastal walk", "Byron Bay lighthouse sunrise", "Nimbin alternative village detour"],
  },
];

// ── Scoring algorithm ──

export interface RoamResult {
  episode: RoamEpisode;
  score: number;
  isTopPick: boolean;
}

export function generateRoamResults(answers: RoamAnswers): RoamResult[] {
  const { vibe, region, duration, travelStyle } = answers;

  // Filter to matching region
  const regionEpisodes = region
    ? roamEpisodes.filter((ep) => ep.region === region)
    : roamEpisodes;

  const scored = regionEpisodes.map((ep) => {
    let score = 0;

    // Vibe match — highest weight
    if (vibe && ep.vibeTags.includes(vibe as VibeTag)) score += 4;

    // Duration match
    if (duration && ep.duration.includes(duration as Duration)) score += 3;

    // Travel style match
    if (travelStyle && ep.travelStyle.includes(travelStyle as TravelStyle)) score += 2;

    // Tie-break: more diverse vibe tags = more broadly useful
    score += ep.vibeTags.length * 0.1;

    return { episode: ep, score, isTopPick: false };
  });

  // Sort by score descending; randomize equal scores for variety
  scored.sort((a, b) => b.score - a.score || (Math.random() > 0.5 ? 1 : -1));

  // Mark top pick
  if (scored.length > 0) scored[0].isTopPick = true;

  return scored;
}
