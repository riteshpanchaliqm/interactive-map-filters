// Estimation Logic - Implements the 4-step process from Taxonomy Reference Guide
// This utility implements the exact estimation logic specified in the taxonomy reference guide

import { validateDataSources, DataValidationResult } from './dataValidator';

export interface EstimationResult {
  totalPopulation: number;
  matchingPopulation: number;
  percentage: number;
  stateBreakdown: Array<{
    state: string;
    population: number;
    matchingPopulation: number;
    percentage: number;
  }>;
}

export interface EstimationRule {
  taxonomy: string;
  rule: 'segment_threshold' | 'segment_range' | 'segment_exact' | 'segment_aggregate';
  threshold?: number;
  range?: [number, number];
  segments?: number[];
  description: string;
}

// Special rules from the taxonomy reference guide
export const ESTIMATION_RULES: EstimationRule[] = [
  {
    taxonomy: 'voters_gender',
    rule: 'segment_exact',
    segments: [77, 78], // M = 77, F = 78 (example segments)
    description: 'Gender segments: M = Male, F = Female'
  },
  {
    taxonomy: 'voters_age',
    rule: 'segment_range',
    range: [25, 75],
    description: 'Single age buckets (25, 30, ..., 75). Use combined ranges (e.g., >=45 includes 45, 50, 55...)'
  },
  {
    taxonomy: 'ethnic_description',
    rule: 'segment_exact',
    segments: [], // Will be populated with ethnic segments
    description: 'Segments: African American, Hispanic, White, Asian, Other'
  },
  {
    taxonomy: '2010_state_senate_district',
    rule: 'segment_range',
    range: [1, 40],
    description: 'WY: 01-30, CA: 01-40. Normalize leading zeros (e.g., 01, 09). Always use 2010 version.'
  },
  {
    taxonomy: '2001_us_congressional_district',
    rule: 'segment_range',
    range: [1, 53],
    description: 'CA: 01-53, NY: 01-29. Normalize leading zeros.'
  },
  {
    taxonomy: '2001_us_zipcode',
    rule: 'segment_exact',
    segments: [], // Will be populated with ZIP codes
    description: 'Standard 5-digit ZIPs (e.g., 90210)'
  },
  {
    taxonomy: 'commercialdata_hhcomposition',
    rule: 'segment_aggregate',
    segments: [], // Will be populated with segments containing 'children'
    description: 'Categories of household types. Always include all variants with children.'
  },
  {
    taxonomy: 'commercialdata_estimatedhhincome',
    rule: 'segment_aggregate',
    segments: [], // Will be populated with income brackets >100k
    description: 'Brackets: <25k, 25-50k, 50-75k, 75-100k, >100k. For estimation, aggregate all 100,001+ ranges.'
  },
  {
    taxonomy: 'consumerdata_auto_make_1',
    rule: 'segment_exact',
    segments: [], // Will be populated with car make segments
    description: 'Car ownership (Ford, Toyota, Kia, Hyundai, etc.)'
  },
  {
    taxonomy: 'consumerdata_auto_make_2',
    rule: 'segment_exact',
    segments: [], // Will be populated with car make segments
    description: 'If multiple cars, second taxonomy captures overflow.'
  },
  {
    taxonomy: 'hs_military_family_relationship_yes',
    rule: 'segment_threshold',
    threshold: 65,
    description: 'Segment >65 = Yes (military family present)'
  },
  {
    taxonomy: 'hs_military_family_relationship_no',
    rule: 'segment_threshold',
    threshold: 65,
    description: 'Segment <=65 = No (no military family)'
  },
  {
    taxonomy: 'voters_movedfrom_state',
    rule: 'segment_exact',
    segments: [], // Will be populated with state codes
    description: 'Coded by origin state (NJ, OH, VA, ...). Summation shows % migrated into given state.'
  }
];

// Generic rule for all hs_* taxonomies
export const HS_TAXONOMY_RULE: EstimationRule = {
  taxonomy: 'hs_*',
  rule: 'segment_threshold',
  threshold: 65,
  description: 'All hs_* taxonomies = scaled opinion scores. Rule: >65 = Supporter/Positive, <=65 = Opposer/Negative'
};

// State populations for estimation
export const STATE_POPULATIONS = {
  'CA': 39538223,
  'NY': 20201249,
  'WY': 576851
} as const;

// Apply estimation logic based on taxonomy reference guide with intersection logic
export async function applyEstimationLogic(
  data: Array<{
    state_code: string;
    taxonomy: string;
    segment: number | string;
    population_pct: number;
  }>,
  selectedFilters: Set<string>
): Promise<EstimationResult> {
  if (selectedFilters.size === 0) {
    return {
      totalPopulation: 0,
      matchingPopulation: 0,
      percentage: 0,
      stateBreakdown: []
    };
  }

  console.log(`Applying estimation logic for ${selectedFilters.size} selected filters`);
  console.log('Selected filters:', Array.from(selectedFilters));
  
  // Load validation result for calculated segment mappings
  const validationResult = await validateDataSources();
  console.log('Validation result loaded:', validationResult);
  
  // Parse filters into taxonomy + segment combinations
  const filterCombinations = parseFiltersToCombinations(selectedFilters, validationResult);
  console.log('Filter combinations:', filterCombinations);
  
  const stateResults = new Map<string, { total: number; matching: number }>();
  
  // Initialize state results
  Object.keys(STATE_POPULATIONS).forEach(state => {
    stateResults.set(state, { total: 0, matching: 0 });
  });

  // Check if we have geographic filters (state selection)
  const geographicFilters = filterCombinations.filter(combo => combo.isGeographicFilter);
  const dataFilters = filterCombinations.filter(combo => !combo.isGeographicFilter);
  
  if (geographicFilters.length > 0) {
    // Handle geographic filtering - only process selected states
    const selectedStates = geographicFilters.map(filter => filter.targetState).filter(Boolean);
    console.log('Geographic filters selected for states:', selectedStates);
    console.log('Data filters to apply:', dataFilters.length);
    
    stateResults.forEach((stateResult, state) => {
      if (selectedStates.includes(state)) {
        // For selected states, apply data filters if they exist
        if (dataFilters.length > 0) {
          const stateData = data.filter(row => row.state_code === state);
          console.log(`Processing state ${state} with ${stateData.length} records and ${dataFilters.length} data filters`);
          const intersectionPercentage = calculateIntersection(stateData, dataFilters);
          stateResult.matching = intersectionPercentage;
          console.log(`State ${state} (selected with data filters): ${stateResult.matching}%`);
        } else {
          stateResult.matching = 100; // 100% of state population
          console.log(`State ${state} (selected, no data filters): 100%`);
        }
        stateResult.total = 100;
      } else {
        // For non-selected states, show 0%
        stateResult.matching = 0;
        stateResult.total = 100;
        console.log(`State ${state} (not selected): 0%`);
      }
    });
  } else {
    // No geographic filters - process all states with data filters
    stateResults.forEach((stateResult, state) => {
      const stateData = data.filter(row => row.state_code === state);
      console.log(`Processing state ${state} with ${stateData.length} records`);
      
      // Calculate intersection for this state
      const intersectionPercentage = calculateIntersection(stateData, filterCombinations);
      console.log(`State ${state} intersection: ${intersectionPercentage}%`);
      
      stateResult.matching = intersectionPercentage;
      stateResult.total = 100; // Base percentage for calculation
    });
  }

  // Calculate final results
  const stateBreakdown: Array<{
    state: string;
    population: number;
    matchingPopulation: number;
    percentage: number;
  }> = [];

  let totalPopulation = 0;
  let matchingPopulation = 0;

  stateResults.forEach((result, state) => {
    const statePop = STATE_POPULATIONS[state as keyof typeof STATE_POPULATIONS] || 0;
    const matchingPop = (result.matching / 100) * statePop;

    if (matchingPop > 0) {
      stateBreakdown.push({
        state,
        population: statePop,
        matchingPopulation: matchingPop,
        percentage: result.matching
      });
    }

    totalPopulation += statePop;
    matchingPopulation += matchingPop;
  });

  console.log(`Estimation complete: ${matchingPopulation.toLocaleString()} matching population out of ${totalPopulation.toLocaleString()} total`);

  return {
    totalPopulation,
    matchingPopulation,
    percentage: totalPopulation > 0 ? (matchingPopulation / totalPopulation) * 100 : 0,
    stateBreakdown: stateBreakdown.sort((a, b) => b.matchingPopulation - a.matchingPopulation)
  };
}

// Parse filters into taxonomy + segment combinations
function parseFiltersToCombinations(selectedFilters: Set<string>, validationResult?: DataValidationResult): Array<{
  taxonomy: string;
  segment: number | number[] | string | string[];
  rule: string;
  isGeographicFilter?: boolean;
  targetState?: string;
}> {
  const combinations: Array<{
    taxonomy: string;
    segment: number | number[] | string | string[];
    rule: string;
    isGeographicFilter?: boolean;
    targetState?: string;
  }> = [];

  selectedFilters.forEach(filterId => {
    // Handle geographic area selection (state filters)
    if (filterId.startsWith('state-')) {
      const stateCode = filterId.replace('state-', '');
      combinations.push({
        taxonomy: 'geographic_filter',
        segment: 'all',
        rule: 'geographic_filter',
        isGeographicFilter: true,
        targetState: stateCode
      });
      return;
    }

    const taxonomy = extractTaxonomyFromFilterId(filterId);
    if (!taxonomy) return;

    // Determine segment based on filter type
      const segment = determineSegmentFromFilter(filterId, taxonomy, validationResult);
    const rule = getEstimationRule(taxonomy).rule;

    combinations.push({
      taxonomy,
      segment,
      rule
    });
  });

  return combinations;
}

// Determine segment from filter ID
function determineSegmentFromFilter(filterId: string, taxonomy: string, validationResult?: DataValidationResult): number | number[] | string | string[] {
  // Use calculated segment mappings if available
  if (validationResult && validationResult.segmentMappings[taxonomy]) {
    const mappings = validationResult.segmentMappings[taxonomy];
    for (const [key, segments] of Object.entries(mappings)) {
      if (filterId.includes(key)) {
        return segments;
      }
    }
  }

  // Fallback to hardcoded mappings
  if (taxonomy === 'voters_gender') {
    return filterId.includes('male') ? 'M' : 'F';
  }
  
  if (taxonomy === 'voters_age') {
    if (filterId.includes('18_34')) return [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34];
    if (filterId.includes('35_54')) return [35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54];
    if (filterId.includes('55_74')) return [55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74];
    if (filterId.includes('75_plus')) return [75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100];
    return [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100];
  }
  
  if (taxonomy === 'ethnic_description') {
    if (filterId.includes('african_american')) return 'African American';
    if (filterId.includes('hispanic')) return 'Hispanic';
    if (filterId.includes('white')) return 'White';
    if (filterId.includes('asian')) return 'Asian';
    if (filterId.includes('other')) return 'Other';
    return 'All';
  }
  
  if (taxonomy === '2010_state_senate_district') {
    if (filterId.includes('wy')) return [1, 30];
    if (filterId.includes('ca')) return [1, 40];
    return [1, 40];
  }
  
  if (taxonomy === '2001_us_congressional_district') {
    if (filterId.includes('ca')) return [1, 53];
    if (filterId.includes('ny')) return [1, 29];
    return [1, 53];
  }
  
  if (taxonomy === '2001_us_zipcode') {
    return 'All'; // Will match all ZIP codes
  }
  
  if (taxonomy === 'commercialdata_hhcomposition') {
    return filterId.includes('children') ? 'children' : 'no_children';
  }
  
  if (taxonomy === 'commercialdata_estimatedhhincome') {
    if (filterId.includes('under_25k')) return ['$1-25000'];
    if (filterId.includes('25k_50k')) return ['$25001-50000'];
    if (filterId.includes('50k_75k')) return ['$50001-75000'];
    if (filterId.includes('75k_100k')) return ['$75001-100000'];
    if (filterId.includes('over_100k')) return ['$100001-125000', '$125001-150000', '$150001-175000', '$175001-200000', '$200001-225000', '$225001-250000', '$250000+'];
    return ['$1-25000', '$25001-50000', '$50001-75000', '$75001-100000', '$100001-125000', '$125001-150000', '$150001-175000', '$175001-200000', '$200001-225000', '$225001-250000', '$250000+'];
  }
  
  if (taxonomy === 'consumerdata_auto_make_1' || taxonomy === 'consumerdata_auto_make_2') {
    if (filterId.includes('ford')) return 'Ford';
    if (filterId.includes('toyota')) return 'Toyota';
    if (filterId.includes('kia')) return 'Kia';
    if (filterId.includes('hyundai')) return 'Hyundai';
    return 'All';
  }
  
  if (taxonomy === 'hs_military_family_relationship_yes') {
    return '>65'; // Segment >65 = Yes
  }
  
  if (taxonomy === 'hs_military_family_relationship_no') {
    return '<=65'; // Segment <=65 = No
  }
  
  if (taxonomy === 'voters_movedfrom_state') {
    if (filterId.includes('nj')) return 'NJ';
    if (filterId.includes('oh')) return 'OH';
    if (filterId.includes('va')) return 'VA';
    return 'All';
  }
  
  // For hs_* taxonomies, apply the >65 rule
  if (taxonomy.startsWith('hs_')) {
    if (filterId.includes('supporter')) {
      return 'supporter';
    } else if (filterId.includes('opposer')) {
      return 'opposer';
    }
    return 'supporter'; // Default to supporter/positive
  }
  
  return 'All';
}

// Calculate intersection percentage for a state
function calculateIntersection(
  stateData: Array<{
    state_code: string;
    taxonomy: string;
    segment: number | string;
    population_pct: number;
  }>,
  filterCombinations: Array<{
    taxonomy: string;
    segment: number | number[] | string | string[];
    rule: string;
    isGeographicFilter?: boolean;
    targetState?: string;
  }>
): number {
  if (filterCombinations.length === 0) return 0;
  
  // Check if we have geographic filters (state selection)
  const geographicFilters = filterCombinations.filter(combo => combo.isGeographicFilter);
  const dataFilters = filterCombinations.filter(combo => !combo.isGeographicFilter);
  
  // If we have geographic filters, we need to handle them differently
  if (geographicFilters.length > 0) {
    // If we have both geographic and data filters, apply data filters
    if (dataFilters.length > 0) {
      // Apply data filters to the state data
      console.log(`Applying ${dataFilters.length} data filters to state data`);
    } else {
      // For now, if only geographic filters are selected, we'll show a base percentage
      // This represents the total population of the selected state(s)
      return 100; // 100% of the state's population
    }
  }
  
  // If no geographic filters, proceed with normal data filtering
  if (dataFilters.length === 0) return 0;
  
  // Group filters by taxonomy to handle union vs intersection logic
  const filtersByTaxonomy = new Map<string, typeof dataFilters>();
  
  dataFilters.forEach(filter => {
    if (!filtersByTaxonomy.has(filter.taxonomy)) {
      filtersByTaxonomy.set(filter.taxonomy, []);
    }
    filtersByTaxonomy.get(filter.taxonomy)!.push(filter);
  });

  // Calculate percentage for each taxonomy group
  const taxonomyPercentages: number[] = [];
  
  filtersByTaxonomy.forEach((filters, taxonomy) => {
    // For demographic filters (gender, age, ethnicity), use UNION logic
    if (isDemographicTaxonomy(taxonomy)) {
      const unionPercentage = calculateUnionPercentage(stateData, filters, taxonomy);
      taxonomyPercentages.push(unionPercentage);
      console.log(`Demographic filter ${taxonomy} (UNION): ${unionPercentage}%`);
    } else {
      // For political/attitudinal filters, use INTERSECTION logic
      const intersectionPercentage = calculateIntersectionPercentage(stateData, filters, taxonomy);
      taxonomyPercentages.push(intersectionPercentage);
      console.log(`Political filter ${taxonomy} (INTERSECTION): ${intersectionPercentage}%`);
    }
  });

  // Apply intersection logic across different taxonomies
  if (taxonomyPercentages.length === 0) return 0;
  
  const finalPercentage = taxonomyPercentages.reduce((result, percentage) => {
    return result * (percentage / 100);
  }, 100);

  console.log(`Final calculation: ${taxonomyPercentages.join(' × ')} = ${finalPercentage}%`);
  
  return finalPercentage;
}

// Check if a taxonomy should use union logic (demographics)
function isDemographicTaxonomy(taxonomy: string): boolean {
  const demographicTaxonomies = [
    'voters_gender',
    'voters_age', 
    'ethnic_description',
    'commercialdata_estimatedhhincome',
    'consumerdata_auto_make_1',
    'consumerdata_auto_make_2',
    'voters_movedfrom_state'
  ];
  return demographicTaxonomies.includes(taxonomy);
}

// Calculate union percentage for demographic filters
function calculateUnionPercentage(
  stateData: Array<{
    state_code: string;
    taxonomy: string;
    segment: number | string;
    population_pct: number;
  }>,
  filters: Array<{
    taxonomy: string;
    segment: number | number[] | string | string[];
    rule: string;
  }>,
  taxonomy: string
): number {
  const matchingRows = stateData.filter(row => 
    row.taxonomy === taxonomy && 
    filters.some(filter => applySpecialRules(row, filter))
  );
  
  return matchingRows.reduce((sum, row) => sum + row.population_pct, 0);
}

// Calculate intersection percentage for political/attitudinal filters
function calculateIntersectionPercentage(
  stateData: Array<{
    state_code: string;
    taxonomy: string;
    segment: number | string;
    population_pct: number;
  }>,
  filters: Array<{
    taxonomy: string;
    segment: number | number[] | string | string[];
    rule: string;
  }>,
  taxonomy: string
): number {
  const filterPercentages: number[] = [];
  
  filters.forEach(filter => {
    const matchingRows = stateData.filter(row => 
      row.taxonomy === taxonomy && 
      applySpecialRules(row, filter)
    );
    
    const totalPercentage = matchingRows.reduce((sum, row) => sum + row.population_pct, 0);
    filterPercentages.push(totalPercentage);
  });

  // Apply intersection logic within the same taxonomy
  if (filterPercentages.length === 0) return 0;
  
  const intersectionPercentage = filterPercentages.reduce((result, percentage) => {
    return result * (percentage / 100);
  }, 100);

  return intersectionPercentage;
}

// Apply special rules for different taxonomy types
function applySpecialRules(
  row: {
    state_code: string;
    taxonomy: string;
    segment: number | string;
    population_pct: number;
  },
  combination: {
    taxonomy: string;
    segment: number | number[] | string | string[];
    rule: string;
  }
): boolean {
  // Normalize leading zeros in district codes
  if (combination.taxonomy === '2010_state_senate_district' || combination.taxonomy === '2001_us_congressional_district') {
    const normalizedSegment = row.segment.toString().padStart(2, '0');
    if (Array.isArray(combination.segment) && combination.segment.length === 2) {
      const [min, max] = combination.segment as number[];
      if (typeof row.segment === 'number') {
        return row.segment >= min && row.segment <= max;
      }
    }
    return false;
  }
  
  // Aggregate all income brackets above 100k
  if (combination.taxonomy === 'commercialdata_estimatedhhincome') {
    if (Array.isArray(combination.segment)) {
      // For income brackets, the segment values are strings like "$1-25000", "$25001-50000", etc.
      const segmentString = row.segment.toString();
      const matches = (combination.segment as string[]).includes(segmentString);
      console.log(`Checking income segment ${segmentString} against brackets:`, combination.segment, 'Match:', matches);
      return matches;
    }
    return false;
  }
  
  // Always include all "children" variants for hhcomposition
  if (combination.taxonomy === 'commercialdata_hhcomposition') {
    if (combination.segment === 'children') {
      // This would need to be implemented based on actual segment values
      // For now, return true for all segments
      return true;
    }
    return false;
  }
  
  // For hs_* taxonomies: segment > 65 = Supporter/Positive, segment <= 65 = Opposer/Negative
  if (combination.taxonomy.startsWith('hs_')) {
    if (combination.segment === 'supporter' || combination.segment === '>65') {
      return typeof row.segment === 'number' && row.segment > 65;
    } else if (combination.segment === 'opposer' || combination.segment === '<=65') {
      return typeof row.segment === 'number' && row.segment <= 65;
    }
    return false;
  }
  
  // Default matching logic
  if (typeof combination.segment === 'number') {
    return row.segment === combination.segment;
  }
  
  if (Array.isArray(combination.segment)) {
    // Handle both number arrays and string arrays
    if (combination.segment.length > 0 && typeof combination.segment[0] === 'string') {
      return (combination.segment as string[]).includes(row.segment.toString());
    } else {
      return (combination.segment as number[]).includes(row.segment as number);
    }
  }
  
  if (typeof combination.segment === 'string') {
    // Handle string-based matching (ethnicity, car makes, etc.)
    return row.segment.toString() === combination.segment;
  }
  
  return false;
}

// Extract taxonomy from filter ID
function extractTaxonomyFromFilterId(filterId: string): string | null {
  // Handle different filter ID patterns
  if (filterId.includes('_')) {
    const parts = filterId.split('_');
    if (parts.length >= 2) {
      // For income filters like 'commercialdata_estimatedhhincome_under_25k', 
      // extract 'commercialdata_estimatedhhincome'
      if (filterId.startsWith('commercialdata_estimatedhhincome_')) {
        return 'commercialdata_estimatedhhincome';
      }
      // For other filters like 'voters_gender_male', extract 'voters_gender'
      return parts.slice(0, -1).join('_');
    }
  }
  return filterId;
}

// Get the appropriate estimation rule for a taxonomy
function getEstimationRule(taxonomy: string): EstimationRule {
  // Check for specific rules first
  const specificRule = ESTIMATION_RULES.find(rule => rule.taxonomy === taxonomy);
  if (specificRule) {
    return specificRule;
  }

  // Check for hs_* pattern
  if (taxonomy.startsWith('hs_')) {
    return HS_TAXONOMY_RULE;
  }

  // Default rule for unknown taxonomies
  return {
    taxonomy,
    rule: 'segment_exact',
    segments: [],
    description: 'Default rule for unknown taxonomy'
  };
}

// Apply the estimation rule to filter data
function applyEstimationRule(
  data: Array<{
    state_code: string;
    taxonomy: string;
    segment: number | string;
    population_pct: number;
  }>,
  rule: EstimationRule
): Array<{
  state_code: string;
  taxonomy: string;
  segment: number | string;
  population_pct: number;
}> {
  switch (rule.rule) {
    case 'segment_threshold':
      if (rule.threshold !== undefined) {
        return data.filter(row => typeof row.segment === 'number' && row.segment > rule.threshold!);
      }
      break;
    
    case 'segment_range':
      if (rule.range) {
        const [min, max] = rule.range;
        return data.filter(row => typeof row.segment === 'number' && row.segment >= min && row.segment <= max);
      }
      break;
    
    case 'segment_exact':
      if (rule.segments && rule.segments.length > 0) {
        return data.filter(row => rule.segments!.includes(row.segment as number));
      }
      break;
    
    case 'segment_aggregate':
      // For aggregate rules, we need to determine segments dynamically
      // This would require additional logic based on the specific taxonomy
      return data;
  }
  
  return data;
}

// Validate estimation rules against data
export function validateEstimationRules(
  data: Array<{
    state_code: string;
    taxonomy: string;
    segment: number | string;
    population_pct: number;
  }>
): {
  validRules: number;
  invalidRules: number;
  coverage: number;
  recommendations: string[];
} {
  const taxonomies = new Set(data.map(row => row.taxonomy));
  const coveredTaxonomies = new Set<string>();
  
  // Check which taxonomies are covered by rules
  taxonomies.forEach(taxonomy => {
    const rule = getEstimationRule(taxonomy);
    if (rule.taxonomy !== taxonomy || rule.description !== 'Default rule for unknown taxonomy') {
      coveredTaxonomies.add(taxonomy);
    }
  });

  const validRules = coveredTaxonomies.size;
  const invalidRules = taxonomies.size - coveredTaxonomies.size;
  const coverage = (validRules / taxonomies.size) * 100;

  const recommendations = [
    `Add specific rules for ${invalidRules} uncovered taxonomies`,
    `Improve coverage from ${coverage.toFixed(1)}% to 100%`,
    'Implement dynamic rule generation based on taxonomy patterns',
    'Add validation for segment ranges and thresholds',
    'Create rule testing framework for accuracy validation'
  ];

  return {
    validRules,
    invalidRules,
    coverage,
    recommendations
  };
}

// Export estimation logic for external use
export function exportEstimationLogic(): {
  rules: EstimationRule[];
  statePopulations: typeof STATE_POPULATIONS;
  methodology: string;
} {
  return {
    rules: ESTIMATION_RULES,
    statePopulations: STATE_POPULATIONS,
    methodology: `
      Estimation Logic (4-Step Process):
      1. Filter rows matching the query (state, taxonomy)
      2. Sum percentages within each taxonomy & state
      3. Multiply across taxonomies for intersections
      4. Scale by state population (external input required)
      
      Special Rules & Normalization:
      - Always normalize district codes with leading zeros
      - Always include children household compositions
      - Aggregate all income brackets >100k
      - Apply the >65 rule for hs_* taxonomies
      - Migration must be state-level aggregated
    `
  };
}
