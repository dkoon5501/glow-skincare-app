import json

new_positions = [
    # --- nih_ods_selenium_hp: add 2nd position ---
    {
        "id": "pos_nih_ods_selenium_thyroid",
        "expert_id": "nih_ods",
        "source_id": "nih_ods_selenium_hp",
        "topic": "Selenium role in thyroid hormone metabolism",
        "nutrient": "selenium",
        "population": ["general_adults"],
        "stance_label": "neutral",
        "recommendation_type": "situationally_recommended",
        "recommendation_strength": "moderate",
        "key_quote": "Selenium is a component of about two dozen selenoproteins that play critical roles in reproduction, thyroid hormone metabolism, DNA synthesis, and protection from oxidative damage and infection.",
        "key_points": [
            "Selenoproteins are required for thyroid hormone conversion (T4 to T3)",
            "RDA for selenium: 55 mcg/day for adults",
            "Brazil nuts provide very high selenium — even 1–2/day can meet RDA",
            "Dietary selenium in US adults is generally adequate"
        ],
        "preferred_use_cases": ["documented_deficiency", "thyroid_conditions"],
        "risk_notes": [
            "UL: 400 mcg/day; excess selenium causes selenosis — hair loss, nail changes, GI distress",
            "Selenium supplementation not recommended for general adults with adequate dietary intake"
        ],
        "last_extracted_at": "2026-04-17",
        "extraction_method": "manual"
    },

    # --- nutrition_gov_supplements: add 2nd position ---
    {
        "id": "pos_nutrition_gov_safety_guidance",
        "expert_id": "nutrition_gov",
        "source_id": "nutrition_gov_supplements",
        "topic": "Supplement safety and reporting adverse events",
        "nutrient": "supplement_regulation",
        "population": ["general_adults"],
        "stance_label": "neutral",
        "recommendation_type": "not_routinely_recommended",
        "recommendation_strength": "moderate",
        "key_quote": "Dietary supplements are not required to be proven safe or effective before they are sold. It's up to manufacturers to ensure their products are safe and that their claims are truthful.",
        "key_points": [
            "FDA does not test supplements for safety or effectiveness before sale",
            "DSHEA 1994 shifted burden of proof to FDA to demonstrate unsafety",
            "Consumers can report adverse events via FDA MedWatch",
            "Nutrition.gov aggregates federal nutrition and supplement guidance"
        ],
        "preferred_use_cases": ["supplement_shoppers"],
        "risk_notes": [
            "Read product labels carefully; beware of supplements claiming to treat diseases",
            "Consult healthcare provider before starting new supplement"
        ],
        "last_extracted_at": "2026-04-17",
        "extraction_method": "manual"
    },

    # --- grassrootshealth_vitamin_d_experts: add 2nd position ---
    {
        "id": "pos_grassrootshealth_expert_consensus",
        "expert_id": "grassrootshealth",
        "source_id": "grassrootshealth_vitamin_d_experts",
        "topic": "Scientific expert panel consensus on optimal vitamin D levels",
        "nutrient": "vitamin_d",
        "population": ["general_adults"],
        "stance_label": "supportive",
        "recommendation_type": "lab_guided",
        "recommendation_strength": "moderate",
        "key_quote": "GrassrootsHealth convened a panel of 48 vitamin D scientists to evaluate and reach consensus on optimal vitamin D levels for health.",
        "key_points": [
            "48-scientist consensus panel concluded 40–60 ng/mL as optimal range",
            "Requires higher supplementation doses than current RDA (600–800 IU/day) for most people",
            "Individual testing (25-OH-D blood test) essential to guide dosing",
            "Panel includes leading researchers from multiple institutions and countries"
        ],
        "preferred_use_cases": ["limited_sun_exposure", "general_adults", "older_adults_50+"],
        "risk_notes": [
            "Target ranges above official IOM recommendations — consult physician",
            "Not all mainstream organizations endorse 40–60 ng/mL as target"
        ],
        "last_extracted_at": "2026-04-17",
        "extraction_method": "manual"
    },

    # --- grassrootshealth_vitamin_d_level: add 2nd position ---
    {
        "id": "pos_grassrootshealth_vd_testing",
        "expert_id": "grassrootshealth",
        "source_id": "grassrootshealth_vitamin_d_level",
        "topic": "GrassrootsHealth D*action project and testing recommendations",
        "nutrient": "vitamin_d",
        "population": ["general_adults"],
        "stance_label": "supportive",
        "recommendation_type": "lab_guided",
        "recommendation_strength": "moderate",
        "key_quote": "The D*action project is designed to solve the vitamin D deficiency epidemic by encouraging vitamin D blood testing and optimizing levels through supplementation.",
        "key_points": [
            "At-home 25(OH)D testing available through D*action program",
            "Longitudinal data from thousands of participants guide dosing curves",
            "Population-level data show most people need 1,000–4,000 IU/day to reach 40 ng/mL",
            "Winter months and higher latitudes significantly reduce vitamin D production"
        ],
        "preferred_use_cases": ["limited_sun_exposure", "general_adults"],
        "risk_notes": [
            "Self-guided supplementation without testing may lead to over- or under-dosing"
        ],
        "last_extracted_at": "2026-04-17",
        "extraction_method": "manual"
    },

    # --- holick_bu_profile: add 2nd position ---
    {
        "id": "pos_holick_uv_synthesis",
        "expert_id": "michael_holick",
        "source_id": "holick_bu_profile",
        "topic": "Holick's research on UV-B and cutaneous vitamin D synthesis",
        "nutrient": "vitamin_d",
        "population": ["general_adults"],
        "stance_label": "supportive",
        "recommendation_type": "situationally_recommended",
        "recommendation_strength": "moderate",
        "key_quote": "Dr. Holick pioneered research on the photosynthesis of vitamin D3 in human skin and its metabolism to the biologically active form, 1,25-dihydroxyvitamin D.",
        "key_points": [
            "Identified and characterized the active form of vitamin D (1,25-dihydroxyvitamin D)",
            "UV-B exposure (290–315 nm) triggers synthesis of pre-vitamin D3 in skin",
            "Skin pigmentation, sunscreen use, latitude, and season all affect production",
            "Author of >500 peer-reviewed papers on vitamin D deficiency and supplementation"
        ],
        "preferred_use_cases": ["limited_sun_exposure", "vitamin_D_deficient", "older_adults_50+"],
        "risk_notes": [
            "Sun exposure must be balanced against skin cancer risk",
            "D3 supplementation remains preferred when sun exposure is insufficient"
        ],
        "last_extracted_at": "2026-04-17",
        "extraction_method": "manual"
    },

    # --- willett_multivitamin_harvard_health: add 2nd position ---
    {
        "id": "pos_willett_mvm_foundation",
        "expert_id": "walter_willett",
        "source_id": "willett_multivitamin_harvard_health",
        "topic": "Willett's recommendation for multivitamin as nutritional foundation",
        "nutrient": "multivitamin",
        "population": ["general_adults"],
        "stance_label": "supportive",
        "recommendation_type": "routinely_recommended",
        "recommendation_strength": "moderate",
        "key_quote": "In my view, taking a standard multivitamin every day is reasonable nutritional insurance, particularly for people who don't have perfect diets.",
        "key_points": [
            "Multivitamin recommended as low-cost safety net for dietary gaps",
            "Does not replace healthy eating — nutrients from food have synergistic benefits",
            "Particularly important for folic acid (women of childbearing age) and vitamin D (older adults)",
            "No strong evidence multivitamins reduce cancer or CVD risk in well-nourished populations"
        ],
        "preferred_use_cases": ["general_adults", "poor_dietary_variety"],
        "risk_notes": [
            "Avoid megadose formulas — RDA-level multivitamins are preferable",
            "Not a license to eat poorly"
        ],
        "last_extracted_at": "2026-04-17",
        "extraction_method": "manual"
    },

    # --- huberman_sleep_toolkit: add 2nd position ---
    {
        "id": "pos_huberman_sleep_magnesium_l3",
        "expert_id": "andrew_huberman",
        "source_id": "huberman_sleep_toolkit",
        "topic": "Huberman sleep stack: magnesium L-threonate and theanine",
        "nutrient": "magnesium",
        "population": ["general_adults"],
        "stance_label": "supportive",
        "recommendation_type": "situationally_recommended",
        "recommendation_strength": "weak",
        "key_quote": "I take 300–400 mg of magnesium threonate or bisglycinate 30–60 min before sleep. This can potentiate the effects of sleep-promoting compounds and improve sleep quality.",
        "key_points": [
            "Magnesium threonate and bisglycinate preferred for sleep vs. magnesium oxide",
            "300–400 mg magnesium 30–60 min before bed — part of Huberman's sleep stack",
            "Stacked with 200 mg L-theanine and 50 mg apigenin",
            "Protocol not for everyone — start with one supplement at a time to assess tolerance"
        ],
        "preferred_use_cases": ["sleep_quality", "general_adults"],
        "risk_notes": [
            "Magnesium can cause loose stools at higher doses — threonate/bisglycinate are gentler",
            "Not FDA-approved sleep aids; evidence is largely mechanistic and anecdotal"
        ],
        "last_extracted_at": "2026-04-17",
        "extraction_method": "manual"
    },

    # --- uspstf_folic_acid_ntd: add 2nd position ---
    {
        "id": "pos_uspstf_folate_dose_timing",
        "expert_id": "uspstf",
        "source_id": "uspstf_folic_acid_ntd",
        "topic": "USPSTF grade A: folic acid dose and timing for NTD prevention",
        "nutrient": "folate",
        "population": ["women_childbearing_age", "pregnancy"],
        "stance_label": "supportive",
        "recommendation_type": "routinely_recommended",
        "recommendation_strength": "strong",
        "key_quote": "The USPSTF recommends that all women who are planning or capable of pregnancy take a daily supplement containing 0.4 to 0.8 mg (400 to 800 mcg) of folic acid.",
        "key_points": [
            "Grade A recommendation — highest evidence level for folic acid supplementation",
            "0.4–0.8 mg/day for all women capable of pregnancy",
            "Supplementation must begin ≥1 month before conception to be effective",
            "NTDs occur in first 28 days of neural tube closure — often before pregnancy is confirmed"
        ],
        "preferred_use_cases": ["women_childbearing_age", "pregnancy"],
        "risk_notes": [
            "Women with prior NTD-affected pregnancy may need 4 mg/day — consult physician",
            "High folic acid may mask B12 deficiency in older adults"
        ],
        "last_extracted_at": "2026-04-17",
        "extraction_method": "manual"
    },

    # --- uspstf_vitamin_mineral_supp_2022: add 2nd position ---
    {
        "id": "pos_uspstf_mvm_2022_cancer",
        "expert_id": "uspstf",
        "source_id": "uspstf_vitamin_mineral_supp_2022",
        "topic": "USPSTF 2022: insufficient evidence for multivitamins and cancer/CVD prevention",
        "nutrient": "multivitamin",
        "population": ["general_adults"],
        "stance_label": "neutral_to_skeptical",
        "recommendation_type": "not_routinely_recommended",
        "recommendation_strength": "moderate",
        "key_quote": "The USPSTF concludes that the current evidence is insufficient to assess the balance of benefits and harms of the use of multivitamin supplements for the prevention of cardiovascular disease or cancer in adults.",
        "key_points": [
            "I-grade (insufficient evidence) for multivitamins re: CVD and cancer prevention",
            "Evidence too inconsistent and inconclusive to make a recommendation either way",
            "This does not mean multivitamins are harmful — just that evidence doesn't support primary prevention claim",
            "Separate Grade A for folic acid in women of childbearing age remains"
        ],
        "preferred_use_cases": [],
        "risk_notes": [
            "Beta-carotene supplementation discouraged for lung cancer risk in smokers",
            "Vitamin E supplementation discouraged — no CVD or cancer benefit, possible harm"
        ],
        "last_extracted_at": "2026-04-17",
        "extraction_method": "manual"
    },

    # --- who_calcium_pregnancy: add 2nd position ---
    {
        "id": "pos_who_calcium_preeclampsia_prevention",
        "expert_id": "who",
        "source_id": "who_calcium_pregnancy",
        "topic": "WHO recommendation: calcium supplementation to prevent pre-eclampsia",
        "nutrient": "calcium",
        "population": ["pregnancy"],
        "stance_label": "supportive",
        "recommendation_type": "routinely_recommended",
        "recommendation_strength": "strong",
        "key_quote": "WHO recommends calcium supplementation during pregnancy for the prevention of pre-eclampsia in pregnant women, particularly those with low dietary calcium intake.",
        "key_points": [
            "1.5–2 g elemental calcium/day recommended in populations with low intake",
            "Reduces risk of pre-eclampsia (high blood pressure in pregnancy)",
            "Pre-eclampsia is a leading cause of maternal and perinatal mortality globally",
            "Supplementation most important in low-income countries where dairy intake is limited"
        ],
        "preferred_use_cases": ["pregnancy"],
        "risk_notes": [
            "Calcium and iron supplements should be taken at different times to avoid absorption interference",
            "Excess calcium can cause constipation and kidney stones"
        ],
        "last_extracted_at": "2026-04-17",
        "extraction_method": "manual"
    },

    # --- examine_magnesium: add 2nd position ---
    {
        "id": "pos_examine_mg_forms",
        "expert_id": "examine_com",
        "source_id": "examine_magnesium",
        "topic": "Comparison of magnesium supplement forms: glycinate vs oxide vs threonate",
        "nutrient": "magnesium",
        "population": ["general_adults"],
        "stance_label": "supportive",
        "recommendation_type": "situationally_recommended",
        "recommendation_strength": "moderate",
        "key_quote": "Magnesium glycinate and malate are better tolerated and have higher bioavailability than magnesium oxide. Magnesium L-threonate is the only form shown to cross the blood-brain barrier, making it relevant for cognitive applications.",
        "key_points": [
            "Glycinate: best tolerated, good bioavailability — general first choice",
            "Oxide: cheapest, lowest bioavailability, most laxative effect",
            "L-Threonate: brain-crossing, may support cognitive function",
            "Malate: good bioavailability, often preferred for muscle fatigue"
        ],
        "preferred_use_cases": ["sleep_quality", "general_adults", "older_adults_50+"],
        "risk_notes": [
            "Magnesium oxide should be avoided as main form due to poor absorption",
            "Total supplement magnesium UL is 350 mg/day from non-food sources"
        ],
        "last_extracted_at": "2026-04-17",
        "extraction_method": "manual"
    },

    # --- examine_vitamin_d: add 2nd position ---
    {
        "id": "pos_examine_vd_cofactors",
        "expert_id": "examine_com",
        "source_id": "examine_vitamin_d",
        "topic": "Vitamin D co-factors: K2 and magnesium for optimal metabolism",
        "nutrient": "vitamin_d",
        "population": ["general_adults", "older_adults_50+"],
        "stance_label": "supportive",
        "recommendation_type": "situationally_recommended",
        "recommendation_strength": "moderate",
        "key_quote": "Vitamin D3 paired with vitamin K2 is commonly recommended to help direct calcium to bones rather than arteries. Magnesium is also required for vitamin D activation in the liver and kidneys.",
        "key_points": [
            "Vitamin K2 (MK-7 form) helps direct calcium to bones and away from arterial walls",
            "Magnesium is a cofactor for both vitamin D binding protein and hydroxylation enzymes",
            "Deficiency in magnesium may blunt response to vitamin D supplementation",
            "D3 + K2 + Mg is a common evidence-informed trio for bone and cardiovascular health"
        ],
        "preferred_use_cases": ["osteoporosis", "older_adults_50+", "limited_sun_exposure"],
        "risk_notes": [
            "K2 supplementation should be discussed with providers on warfarin",
            "Full synergy claims need more large-scale RCT evidence"
        ],
        "last_extracted_at": "2026-04-17",
        "extraction_method": "manual"
    },

    # --- harvard_gazette_omega3_meta_2019: add 2nd position ---
    {
        "id": "pos_harvard_gazette_omega3_dose_response",
        "expert_id": "joann_manson",
        "source_id": "harvard_gazette_omega3_meta_2019",
        "topic": "Dose-response relationship of omega-3 and CVD risk",
        "nutrient": "omega_3",
        "population": ["general_adults", "existing_chd"],
        "stance_label": "supportive",
        "recommendation_type": "situationally_recommended",
        "recommendation_strength": "moderate",
        "key_quote": "A meta-analysis found that higher doses of omega-3 fatty acids were associated with greater reductions in multiple CVD risk factors, pointing to a significant dose-response relationship.",
        "key_points": [
            "Higher omega-3 doses (>2 g EPA+DHA/day) associated with greater cardiovascular benefits",
            "Reduction in triglycerides: well-established dose-response",
            "13 RCTs, 120,000+ participants in meta-analysis basis",
            "Prescription-grade omega-3s (Vascepa, Lovaza) most studied at therapeutic doses"
        ],
        "preferred_use_cases": ["hypertriglyceridemia", "existing_chd"],
        "risk_notes": [
            "High doses (>4 g/day) may increase atrial fibrillation risk — consult cardiologist"
        ],
        "last_extracted_at": "2026-04-17",
        "extraction_method": "manual"
    },

    # --- mayo_clinic_multivitamin_insurance: add 2nd position ---
    {
        "id": "pos_mayo_mvm_pregnancy",
        "expert_id": "mayo_clinic",
        "source_id": "mayo_clinic_multivitamin_insurance",
        "topic": "Prenatal multivitamin recommendations: folate and iron",
        "nutrient": "multivitamin",
        "population": ["pregnancy", "women_childbearing_age"],
        "stance_label": "supportive",
        "recommendation_type": "routinely_recommended",
        "recommendation_strength": "strong",
        "key_quote": "Prenatal vitamins typically contain higher amounts of folic acid and iron than found in a typical adult multivitamin to support fetal neural tube development and maternal blood volume expansion.",
        "key_points": [
            "Prenatal MVM provides higher folate (600–800 mcg) and iron (27 mg) vs regular MVM",
            "Iron requirement doubles in pregnancy due to increased blood volume",
            "DHA should be included or separately supplemented in prenatal period",
            "Recommended to begin before conception and continue through breastfeeding"
        ],
        "preferred_use_cases": ["pregnancy", "women_childbearing_age"],
        "risk_notes": [
            "Iron supplementation can cause constipation and GI upset — take with food",
            "Consult OB/GYN for personalized prenatal supplementation plan"
        ],
        "last_extracted_at": "2026-04-17",
        "extraction_method": "manual"
    },

    # --- endocrine_society_news_vd_2024: add 2nd position ---
    {
        "id": "pos_endocrine_2024_children_vd",
        "expert_id": "endocrine_society",
        "source_id": "endocrine_society_news_vd_2024",
        "topic": "Endocrine Society 2024: vitamin D for children and adolescents",
        "nutrient": "vitamin_d",
        "population": ["children", "teens_adolescents"],
        "stance_label": "supportive",
        "recommendation_type": "routinely_recommended",
        "recommendation_strength": "moderate",
        "key_quote": "We suggest vitamin D supplementation for children and adolescents 1–18 years of age to reduce the risk of respiratory tract infections.",
        "key_points": [
            "Children 1–18: vitamin D recommended to reduce respiratory infection risk",
            "Evidence stronger for children than for healthy adults under 75",
            "Supplementation beyond IOM RDA may be warranted for children with limited sun exposure",
            "Guideline also supports supplementation in pregnant women and adults 75+"
        ],
        "preferred_use_cases": ["children", "teens_adolescents"],
        "risk_notes": [
            "Dose should be age-appropriate — pediatric formulations available",
            "Infants: AAP recommends 400 IU/day for breastfed and partially breastfed infants"
        ],
        "last_extracted_at": "2026-04-17",
        "extraction_method": "manual"
    },

    # --- foundmyfitness_supplement_routine: add 2nd position ---
    {
        "id": "pos_foundmyfitness_magnesium_vd",
        "expert_id": "rhonda_patrick",
        "source_id": "foundmyfitness_supplement_routine",
        "topic": "Rhonda Patrick's vitamin D and magnesium protocol",
        "nutrient": "magnesium",
        "population": ["general_adults", "athletes"],
        "stance_label": "supportive",
        "recommendation_type": "lab_guided",
        "recommendation_strength": "moderate",
        "key_quote": "In this clip, Dr. Rhonda Patrick shares her supplement routine including her vitamin D dose, magnesium glycinate for sleep, and the importance of testing 25(OH)D levels regularly.",
        "key_points": [
            "Magnesium glycinate used primarily for sleep quality enhancement",
            "Vitamin D dose adjusted based on regular 25(OH)D blood testing",
            "Patrick targets 50–60 ng/mL 25(OH)D — above mainstream recommendations",
            "Emphasizes importance of cofactors: K2 taken alongside D3"
        ],
        "preferred_use_cases": ["sleep_quality", "limited_sun_exposure", "general_adults"],
        "risk_notes": [
            "Target 25(OH)D level is above IOM/Endocrine Society guidelines for general adults",
            "Individual data-driven approach requires testing infrastructure"
        ],
        "last_extracted_at": "2026-04-17",
        "extraction_method": "manual"
    },

    # --- aha_fish_oil_advisory: add 2nd position ---
    {
        "id": "pos_aha_fish_oil_secondary_prevention",
        "expert_id": "aha",
        "source_id": "aha_fish_oil_advisory",
        "topic": "AHA advisory: omega-3 for secondary prevention of coronary heart disease",
        "nutrient": "omega_3",
        "population": ["existing_chd"],
        "stance_label": "supportive",
        "recommendation_type": "routinely_recommended",
        "recommendation_strength": "strong",
        "key_quote": "The American Heart Association recommends eating fish (particularly fatty fish) at least two times per week, and for patients with documented CHD, the AHA recommends consuming approximately 1 g of EPA+DHA per day.",
        "key_points": [
            "1 g EPA+DHA/day recommended for patients with documented CHD",
            "Prescription omega-3 formulations preferred for clinical use",
            "OTC supplements acceptable alternative when dietary fish intake is insufficient",
            "Reduces risk of sudden cardiac death and non-fatal MI in CHD patients"
        ],
        "preferred_use_cases": ["existing_chd", "low_fish_intake"],
        "risk_notes": [
            "Patients on blood thinners should inform physicians about omega-3 supplementation",
            "Dose must be clinically supervised in CHD patients"
        ],
        "last_extracted_at": "2026-04-17",
        "extraction_method": "manual"
    },

    # --- vital_trial_bwh: add 3rd position (vitamin D arm) ---
    {
        "id": "pos_vital_vd_cancer_reduction",
        "expert_id": "joann_manson",
        "source_id": "vital_trial_bwh",
        "topic": "VITAL trial: vitamin D3 and cancer mortality reduction",
        "nutrient": "vitamin_d",
        "population": ["general_adults", "older_adults_50+"],
        "stance_label": "supportive",
        "recommendation_type": "situationally_recommended",
        "recommendation_strength": "moderate",
        "key_quote": "In the VITAL trial, vitamin D3 supplementation (2,000 IU/day) reduced cancer mortality by 25% overall and by 17% for cancer incidence in years 2–5, suggesting a benefit that emerges over time.",
        "key_points": [
            "2,000 IU/day vitamin D3 for 5+ years reduced cancer death by 25%",
            "Cancer incidence benefit emerged primarily after the first two years",
            "No significant reduction in first-occurrence cancer across the full trial period",
            "Largest RCT of vitamin D in primary CVD and cancer prevention (25,871 adults)"
        ],
        "preferred_use_cases": ["cancer_risk_reduction", "older_adults_50+"],
        "risk_notes": [
            "Benefit for cancer incidence more modest than cancer mortality",
            "Not approved by FDA as cancer prevention therapy"
        ],
        "last_extracted_at": "2026-04-17",
        "extraction_method": "manual"
    },

    # --- acog_nutrition_pregnancy: add 3rd position ---
    {
        "id": "pos_acog_omega3_pregnancy",
        "expert_id": "acog",
        "source_id": "acog_nutrition_pregnancy",
        "topic": "ACOG: DHA omega-3 supplementation in pregnancy",
        "nutrient": "omega_3",
        "population": ["pregnancy"],
        "stance_label": "supportive",
        "recommendation_type": "situationally_recommended",
        "recommendation_strength": "moderate",
        "key_quote": "Omega-3 fatty acids are important for your baby's brain and eye development. Good sources include fatty fish, walnuts, and fortified foods; a prenatal supplement with DHA is reasonable if dietary intake is low.",
        "key_points": [
            "DHA (docosahexaenoic acid) critical for fetal brain and retinal development",
            "200 mg DHA/day recommended during pregnancy",
            "Low-mercury fatty fish (salmon, sardines) preferred dietary source",
            "Prenatal DHA supplement appropriate if fish intake is inadequate"
        ],
        "preferred_use_cases": ["pregnancy"],
        "risk_notes": [
            "Avoid high-mercury fish (shark, swordfish, tilefish) during pregnancy",
            "Limit albacore tuna to 6 oz/week"
        ],
        "last_extracted_at": "2026-04-17",
        "extraction_method": "manual"
    },

    # --- nih_ods_folate_hp: add 3rd position ---
    {
        "id": "pos_nih_ods_folate_cancer",
        "expert_id": "nih_ods",
        "source_id": "nih_ods_folate_hp",
        "topic": "Folate and cancer risk: complex relationship",
        "nutrient": "folate",
        "population": ["general_adults"],
        "stance_label": "neutral",
        "recommendation_type": "not_routinely_recommended",
        "recommendation_strength": "moderate",
        "key_quote": "The relationship between folate and cancer is complex. Adequate folate may protect against certain cancers, but supplemental folic acid at very high doses might promote the progression of existing premalignant lesions.",
        "key_points": [
            "Adequate folate from food linked to lower colorectal cancer risk",
            "High-dose supplemental folic acid may accelerate progression of pre-existing dysplastic lesions",
            "Recommended to stay within RDA (400 mcg/day for non-pregnant adults)",
            "UL for folic acid from supplements: 1,000 mcg/day"
        ],
        "preferred_use_cases": ["documented_deficiency", "women_childbearing_age"],
        "risk_notes": [
            "Very high folic acid supplementation may mask vitamin B12 deficiency",
            "Excess folic acid may theoretically promote existing precancerous cells"
        ],
        "last_extracted_at": "2026-04-17",
        "extraction_method": "manual"
    },

    # --- nih_ods_zinc_hp: add 3rd position ---
    {
        "id": "pos_nih_ods_zinc_immune",
        "expert_id": "nih_ods",
        "source_id": "nih_ods_zinc_hp",
        "topic": "Zinc supplementation for immune function and cold duration",
        "nutrient": "zinc",
        "population": ["general_adults"],
        "stance_label": "supportive",
        "recommendation_type": "situationally_recommended",
        "recommendation_strength": "moderate",
        "key_quote": "Zinc lozenges or syrup started within 24 hours of the onset of cold symptoms reduces the duration and severity of the common cold. Zinc is also essential for immune cell development and signaling.",
        "key_points": [
            "Zinc acetate and gluconate lozenges reduce cold duration when started within 24h",
            "RDA: 8 mg/day women, 11 mg/day men",
            "Deficiency impairs immune cell function, wound healing, and taste/smell",
            "High-dose zinc (40+ mg/day) can interfere with copper absorption"
        ],
        "preferred_use_cases": ["immune_support", "general_adults", "vegetarians_vegans"],
        "risk_notes": [
            "UL: 40 mg/day — long-term high-dose zinc causes copper deficiency",
            "Zinc lozenges: short-term use during illness, not preventive daily supplementation"
        ],
        "last_extracted_at": "2026-04-17",
        "extraction_method": "manual"
    },

    # --- nih_ods_vitamin_c_hp: add 3rd position ---
    {
        "id": "pos_nih_ods_vitc_antioxidant",
        "expert_id": "nih_ods",
        "source_id": "nih_ods_vitamin_c_hp",
        "topic": "Vitamin C as antioxidant and immune support",
        "nutrient": "vitamin_c",
        "population": ["general_adults"],
        "stance_label": "neutral",
        "recommendation_type": "situationally_recommended",
        "recommendation_strength": "moderate",
        "key_quote": "As an antioxidant, vitamin C might protect against damage caused by free radicals. Evidence that vitamin C supplements benefit healthy people who do not have a deficiency is limited.",
        "key_points": [
            "Vitamin C is an essential antioxidant and cofactor for collagen synthesis",
            "RDA: 75 mg/day women, 90 mg/day men; smokers need 35 mg/day extra",
            "Mega-doses (≥200 mg/day) show no additional benefit in non-deficient adults",
            "Only well-established role in immunity: deficiency impairs immune function"
        ],
        "preferred_use_cases": ["documented_deficiency", "smokers", "low_fruit_vegetable_intake"],
        "risk_notes": [
            "UL: 2,000 mg/day — excess causes osmotic diarrhea and kidney stones (oxalate)",
            "High-dose C can interfere with glucose monitoring in diabetics"
        ],
        "last_extracted_at": "2026-04-17",
        "extraction_method": "manual"
    },

    # --- nih_ods_probiotics_hp: add 3rd position ---
    {
        "id": "pos_nih_ods_probiotics_evidence_gaps",
        "expert_id": "nih_ods",
        "source_id": "nih_ods_probiotics_hp",
        "topic": "NIH ODS: probiotic research gaps and safety considerations",
        "nutrient": "probiotics",
        "population": ["general_adults"],
        "stance_label": "neutral",
        "recommendation_type": "not_routinely_recommended",
        "recommendation_strength": "weak",
        "key_quote": "Although probiotics have an adequate safety profile in healthy people, people with compromised immune systems or serious illnesses should consult a healthcare provider before using probiotic supplements.",
        "key_points": [
            "Strain specificity matters — different organisms have different effects",
            "Evidence strongest for antibiotic-associated diarrhea (Lactobacillus rhamnosus GG)",
            "Limited evidence for IBS, inflammatory bowel disease, and general wellness",
            "Safety concern: immunocompromised individuals should consult physician first"
        ],
        "preferred_use_cases": ["digestive_health", "antibiotic_use"],
        "risk_notes": [
            "Immunocompromised patients: rare risk of bacteremia or fungemia",
            "Probiotic products vary widely — strain, CFU count, and viability not standardized"
        ],
        "last_extracted_at": "2026-04-17",
        "extraction_method": "manual"
    },

    # --- cdc_folic_acid_ntd: add 3rd position ---
    {
        "id": "pos_cdc_folate_b12_interaction",
        "expert_id": "cdc_birth_defects",
        "source_id": "cdc_folic_acid_ntd",
        "topic": "CDC: folic acid and B12 interaction in older adults",
        "nutrient": "vitamin_b12",
        "population": ["older_adults_50+"],
        "stance_label": "neutral",
        "recommendation_type": "lab_guided",
        "recommendation_strength": "moderate",
        "key_quote": "High folic acid intake can correct the anemia caused by vitamin B12 deficiency, but it cannot prevent the accompanying neurological damage. This makes it important to test for B12 deficiency before increasing folic acid intake.",
        "key_points": [
            "Folic acid can mask megaloblastic anemia — a warning sign of B12 deficiency",
            "Without detection, subclinical B12 deficiency progresses to irreversible neurological damage",
            "Adults 50+: test serum B12 before starting high-dose folic acid supplementation",
            "Combined supplementation requires monitoring in at-risk populations"
        ],
        "preferred_use_cases": ["older_adults_50+", "documented_deficiency"],
        "risk_notes": [
            "Never treat B12 deficiency with folic acid alone",
            "Metformin use significantly increases B12 depletion risk"
        ],
        "last_extracted_at": "2026-04-17",
        "extraction_method": "manual"
    }
]

# Load existing and append
existing = []
with open('positions.ndjson', 'r') as f:
    for line in f:
        line = line.strip()
        if line:
            existing.append(json.loads(line))

print(f"Existing positions: {len(existing)}")
print(f"New positions to add: {len(new_positions)}")

# Check for ID collisions
existing_ids = {p['id'] for p in existing}
new_ids = [p['id'] for p in new_positions]
collisions = [nid for nid in new_ids if nid in existing_ids]
if collisions:
    print(f"ID COLLISIONS (must fix): {collisions}")
else:
    print("No ID collisions — safe to append")

print(f"Total after merge: {len(existing) + len(new_positions)}")

# Write merged file
all_positions = existing + new_positions
with open('positions.ndjson', 'w') as f:
    for pos in all_positions:
        f.write(json.dumps(pos) + '\n')

print(f"Written: {len(all_positions)} positions to positions.ndjson")

# Verify valid JSON
with open('positions.ndjson') as f:
    verify = [json.loads(l) for l in f if l.strip()]
print(f"JSON verification: {len(verify)} records, all valid")
