It has 137,415 rows with these columns:

state_code → State abbreviations (CA, NY, WY, etc.)

taxonomy → Category identifier (e.g., hs_israel_military_actions_gop_support, voters_gender, 2001_us_zipcode)

segment → Numeric bucket / label (e.g., 63, 73, 90210)

population_pct → Percentage of population in that bucket

Based on your guidance, I’ll build a taxonomy catalog & estimation guide specific to this dataset, making sure it’s normalized, structured, and usable.

📑 Taxonomy Reference & Estimation Guide (Cataloged for wycany.csv)
1. Core Demographics

voters_gender

M = Male

F = Female

voters_age

Single age buckets (25, 30, …, 75).

Use combined ranges (e.g., >=45 includes 45, 50, 55...).

ethnic_description

Segments: African American, Hispanic, White, Asian, Other.

2. Geography (Districts & ZIPs)

2010_state_senate_district

WY: 01–30

CA: 01–40

Normalize leading zeros (e.g., 01, 09).

Always use 2010 version.

2001_us_congressional_district

CA: 01–53

NY: 01–29

Normalize leading zeros.

2001_us_zipcode

Standard 5-digit ZIPs (e.g., 90210).

3. Household & Income

commercialdata_hhcomposition

Categories of household types.

Always include all variants with children.

commercialdata_estimatedhhincome

Brackets: <25k, 25–50k, 50–75k, 75–100k, >100k.

For estimation, aggregate all 100,001+ ranges.

4. Consumer Data

consumerdata_auto_make_1, consumerdata_auto_make_2

Car ownership (Ford, Toyota, Kia, Hyundai, etc.).

If multiple cars, second taxonomy captures overflow.

5. Household / Family Background

hs_military_family_relationship_yes

Segment >65 = Yes (military family present).

hs_military_family_relationship_no

Segment <=65 = No (no military family).

6. Opinions, Politics, Attitudes (hs_*)

All hs_* taxonomies = scaled opinion scores.

Rule:

>65 = Supporter / Positive

<=65 = Opposer / Negative

7. Migration

voters_movedfrom_state

Coded by origin state (NJ, OH, VA, …).

Summation shows % migrated into given state.

📊 Estimation Logic

Filter rows matching the query (state, taxonomy).

Sum percentages within each taxonomy & state.

Multiply across taxonomies for intersections.

Scale by state population (external input required).

⚙️ Special Rules & Normalization

Always normalize district codes with leading zeros.

Always include children household compositions.

Aggregate all income brackets >100k.

Apply the >65 rule for hs_* taxonomies.

Migration must be state-level aggregated.