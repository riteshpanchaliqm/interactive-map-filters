Taxonomy Reference & Estimation Guide
1. Core Demographics
- voters_gender: M = Male, F = Female
- voters_age: Age buckets (25...75). Combine for ranges (e.g., >=45).
- ethnic_description: Ethnicity (African American, Hispanic, etc.)
2. Geography (Districts & ZIPs)
- 2010_state_senate_district (WY): 01-30, normalize leading zeros
- 2010_state_senate_district (CA): 01-40, normalize leading zeros (always use 2010 version)
- 2001_us_congressional_district (CA, NY): 01-53, normalize leading zeros
- 2001_us_zipcode: ZIP codes (e.g., 90210)
3. Household & Income
- commercialdata_hhcomposition: Household structure. Use segments with 'children'.
- commercialdata_estimatedhhincome: Income brackets. For >100k, include all 100001+ ranges.
4. Consumer Data
- consumerdata_auto_make_1: Car ownership by brand (Ford, Toyota, Kia, Hyundai, etc.)
- consumerdata_auto_make_2: Additional car ownership info.
5. Household / Family Background
- hs_military_family_relationship_yes: Military in household (segment >65 = Yes)
- hs_military_family_relationship_no: No military in household (segment >65 = No)
6. Opinions, Politics, Attitudes (hs_* taxonomies)
- Any hs_ taxonomy: Opinion/attitude scores. Rule: >65 = Supporter/Positive, <=65 = Opposer/Negative.
7. Migration
- voters_movedfrom_state: Migration origins (NJ, OH, VA...). Sum shows % moved into state.
Estimation Logic:
1. Filter rows matching query.
2. Sum percentages within each taxonomy & state.
3. Multiply across taxonomies.
4. Apply state population.
Special Rules:
- Normalize leading zeros in all district codes.
- Include all 'children' household variants.
- Aggregate all income brackets above threshold.
- Apply >65 rule for hs_ taxonomies.