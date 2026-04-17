# Vita Expert Dataset Schema

Three newline-delimited JSON files live in this folder:

- `experts.ndjson` — named researchers, clinicians, and institutional orgs
- `sources.ndjson` — public URLs (fact sheets, articles, videos, etc.)
- `positions.ndjson` — individual stance records, keyed to expert + source + nutrient

Plus:

- `consensus.md` — human-readable nutrient-by-nutrient consensus mapping
- `expert-index.json` — generated at build time; powers the UI (see `scripts/build-expert-index.ts`)

---

## 1) Expert

```json
{
  "id": "expert_slug",                 // stable snake_case slug, e.g. "joann_manson"
  "full_name": "",
  "credentials": [],                   // ["MD", "MPH", "PhD", "DrPH", "RD", "PharmD"]
  "professional_titles": [],
  "specialties": [],
  "primary_affiliations": [],
  "country": "US",
  "is_currently_practicing": true,
  "license_types": [],
  "bio_short": "",
  "expert_type": "academic_researcher | clinician | public_educator | institution | rd_nutritionist | pharmacist",
  "focus_area": "",
  "websites": [{"label": "", "url": ""}],
  "social_links": [{"platform": "", "url": ""}],
  "evidence_level": "high | medium | low",
  "typical_audience": [],
  "tags": [],
  "source_ids": [],
  "created_at": "2026-04-17",
  "updated_at": "2026-04-17",
  "ingest_method": "manual"
}
```

## 2) Source

```json
{
  "id": "source_slug",
  "title": "",
  "type": "article | video | podcast | fact_sheet | webpage | website | guideline",
  "publisher": "",
  "publisher_type": "government | academic | hospital | professional_association | professional_media | media | nonprofit",
  "url": "",
  "publish_date": "YYYY-MM-DD | YYYY | ''",
  "is_open_access": true,
  "expert_ids": [],
  "topics": [],
  "stance_summary": "",
  "intended_audience": [],
  "geography_focus": "US",
  "raw_ingest_source": "manual",
  "last_checked_at": "2026-04-17"
}
```

## 3) Position

```json
{
  "id": "position_slug",
  "expert_id": "",
  "source_id": "",
  "topic": "",
  "nutrient": "vitamin_d | vitamin_b12 | vitamin_c | folate | iron | calcium | magnesium | omega_3 | zinc | multivitamin | supplement_quality | ...",
  "population": ["general_adults", "pregnancy", "vegans", "older_adults_50+", "older_adults_75+", "infants", "pre_diabetics", "smokers", "athletes"],
  "stance_label": "supportive | neutral | neutral_to_skeptical | skeptical | warns_against",
  "recommendation_type": "routinely_recommended | situationally_recommended | not_routinely_recommended | lab_guided | safety_caution",
  "recommendation_strength": "strong | moderate | weak",
  "key_quote": "",
  "key_points": [],
  "preferred_use_cases": [],
  "risk_notes": [],
  "last_extracted_at": "2026-04-17",
  "extraction_method": "manual"
}
```

---

## Nutrient tag vocabulary (use exactly)

`vitamin_d`, `vitamin_b12`, `vitamin_c`, `vitamin_e`, `vitamin_a`, `vitamin_k`, `folate`, `iron`, `calcium`, `magnesium`, `omega_3`, `zinc`, `selenium`, `iodine`, `probiotics`, `fiber`, `multivitamin`, `creatine`, `coq10`, `supplement_quality`, `supplement_regulation`

## Population tag vocabulary (use exactly)

`general_adults`, `pregnancy`, `pregnancy_low_calcium_intake`, `lactating`, `women_childbearing_age`, `older_adults_50+`, `older_adults_75+`, `infants`, `breastfed_infants`, `children`, `adolescents`, `vegans`, `vegetarians`, `pre_diabetics`, `smokers`, `athletes`, `existing_chd`, `hypertriglyceridemia`, `limited_sun_exposure`
