# Filter Cataloging System Guide

## Overview

This guide explains the comprehensive filter cataloging system that aligns with the CSV data and follows the taxonomy reference guide for proper estimation logic.

## System Architecture

### 1. Filter Catalog (`filterCatalog.ts`)
- **Core Demographics**: Gender, age, ethnicity
- **Geography**: Districts, ZIP codes, administrative boundaries
- **Household & Income**: Composition, income brackets
- **Consumer Data**: Automotive preferences
- **Military & Family**: Military service background
- **Political Views**: Political opinions and attitudes (hs_* taxonomies)
- **Migration**: Migration patterns and origins

### 2. CSV Analyzer (`csvAnalyzer.ts`)
- Analyzes actual CSV data structure
- Extracts unique taxonomies and counts
- Categorizes taxonomies automatically
- Provides data statistics and insights

### 3. Estimation Logic (`estimationLogic.ts`)
- Implements 4-step estimation process from taxonomy reference guide
- Applies special rules for different taxonomy types
- Handles segment thresholds and ranges
- Follows >65 rule for hs_* taxonomies

### 4. Filter Validator (`filterValidator.ts`)
- Validates filter alignment with CSV data
- Identifies missing and extra taxonomies
- Calculates alignment scores
- Provides recommendations for improvement

## Taxonomy Reference Guide Implementation

### Core Demographics
- **voters_gender**: M = Male, F = Female
- **voters_age**: Age buckets (25...75), combine for ranges
- **ethnic_description**: Ethnicity (African American, Hispanic, etc.)

### Geography
- **2010_state_senate_district**: WY (01-30), CA (01-40), normalize leading zeros
- **2001_us_congressional_district**: CA, NY (01-53), normalize leading zeros
- **2001_us_zipcode**: ZIP codes (e.g., 90210)

### Household & Income
- **commercialdata_hhcomposition**: Household structure, use segments with 'children'
- **commercialdata_estimatedhhincome**: Income brackets, for >100k include all 100001+ ranges

### Consumer Data
- **consumerdata_auto_make_1**: Car ownership by brand (Ford, Toyota, Kia, Hyundai, etc.)
- **consumerdata_auto_make_2**: Additional car ownership info

### Military & Family
- **hs_military_family_relationship_yes**: Military in household (segment >65 = Yes)
- **hs_military_family_relationship_no**: No military in household (segment >65 = No)

### Political Views (hs_* taxonomies)
- **Any hs_ taxonomy**: Opinion/attitude scores
- **Rule**: >65 = Supporter/Positive, <=65 = Opposer/Negative

### Migration
- **voters_movedfrom_state**: Migration origins (NJ, OH, VA...)
- **Sum shows % moved into state**

## Estimation Logic (4-Step Process)

1. **Filter rows matching query**
2. **Sum percentages within each taxonomy & state**
3. **Multiply across taxonomies**
4. **Apply state population**

## Special Rules

- **Normalize leading zeros** in all district codes
- **Include all 'children'** household variants
- **Aggregate all income brackets** above threshold
- **Apply >65 rule** for hs_ taxonomies

## Usage Examples

### Basic Filter Application
```typescript
const selectedFilters = new Set([
  'voters_gender_male',
  'voters_age_45_54',
  'hs_ideology_fiscal_conserv'
]);

const result = voterDataLoader.analyzeFilters(selectedFilters);
```

### Enhanced Filter Categories
```typescript
const enhancedCategories = voterDataLoader.getEnhancedFilterCategories();
// Returns categories with actual data counts from CSV analysis
```

### Validation
```typescript
const validation = validateFilterAlignment(csvAnalysis);
console.log(`Alignment score: ${validation.alignmentScore}%`);
```

## Data Flow

1. **Load CSV Data** → Parse and extract taxonomies
2. **Analyze Data** → Generate comprehensive analysis
3. **Create Catalog** → Build filter categories
4. **Apply Filters** → Use estimation logic
5. **Validate Results** → Check alignment and accuracy

## Benefits

- **Accurate Alignment**: Filters properly aligned with CSV data
- **Comprehensive Coverage**: All taxonomy types included
- **Proper Estimation**: Follows taxonomy reference guide
- **Validation**: Ensures data consistency
- **Extensible**: Easy to add new taxonomies and rules

## Future Enhancements

- Dynamic filter generation based on CSV analysis
- Real-time validation during data load
- Advanced estimation rules for complex taxonomies
- Machine learning-based taxonomy categorization
- Automated rule generation from data patterns
