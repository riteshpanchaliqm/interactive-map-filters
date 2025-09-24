// Estimation Logic - Implements the 4-step process from Taxonomy Reference Guide
// This utility implements the exact estimation logic specified in the taxonomy reference guide

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
export function applyEstimationLogic(
  data: Array<{
    state_code: string;
    taxonomy: string;
    segment: number;
    population_pct: number;
  }>,
  selectedFilters: Set<string>
): EstimationResult {
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
  
  // Parse filters into taxonomy + segment combinations
  const filterCombinations = parseFiltersToCombinations(selectedFilters);
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
    
    stateResults.forEach((stateResult, state) => {
      if (selectedStates.includes(state)) {
        // For selected states, show 100% of population if no data filters
        // or apply data filters if they exist
        if (dataFilters.length > 0) {
          const stateData = data.filter(row => row.state_code === state);
          const intersectionPercentage = calculateIntersection(stateData, dataFilters);
          stateResult.matching = intersectionPercentage;
        } else {
          stateResult.matching = 100; // 100% of state population
        }
        stateResult.total = 100;
        console.log(`State ${state} (selected): ${stateResult.matching}%`);
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
function parseFiltersToCombinations(selectedFilters: Set<string>): Array<{
  taxonomy: string;
  segment: number | number[] | string;
  rule: string;
  isGeographicFilter?: boolean;
  targetState?: string;
}> {
  const combinations: Array<{
    taxonomy: string;
    segment: number | number[] | string;
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
    const segment = determineSegmentFromFilter(filterId, taxonomy);
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
function determineSegmentFromFilter(filterId: string, taxonomy: string): number | number[] | string {
  // Handle different filter types based on taxonomy
  if (taxonomy === 'voters_gender') {
    return filterId.includes('male') ? 77 : 78; // M = 77, F = 78
  }
  
  if (taxonomy === 'voters_age') {
    if (filterId.includes('25_34')) return [25, 30];
    if (filterId.includes('35_44')) return [35, 40];
    if (filterId.includes('45_54')) return [45, 50];
    if (filterId.includes('55_64')) return [55, 60];
    if (filterId.includes('65_75')) return [65, 70, 75];
    if (filterId.includes('45_plus')) return [45, 50, 55, 60, 65, 70, 75];
    return [25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75];
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
    if (filterId.includes('under_25k')) return [0, 24999];
    if (filterId.includes('25k_50k')) return [25000, 49999];
    if (filterId.includes('50k_75k')) return [50000, 74999];
    if (filterId.includes('75k_100k')) return [75000, 99999];
    if (filterId.includes('over_100k')) return [100000, 999999];
    return [0, 999999];
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
    return '>65'; // Default to supporter/positive
  }
  
  return 'All';
}

// Calculate intersection percentage for a state
function calculateIntersection(
  stateData: Array<{
    state_code: string;
    taxonomy: string;
    segment: number;
    population_pct: number;
  }>,
  filterCombinations: Array<{
    taxonomy: string;
    segment: number | number[] | string;
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
    // For now, if geographic filters are selected, we'll show a base percentage
    // This represents the total population of the selected state(s)
    return 100; // 100% of the state's population
  }
  
  // If no geographic filters, proceed with normal data filtering
  if (dataFilters.length === 0) return 0;
  
  // Calculate percentage for each data filter combination
  const filterPercentages: number[] = [];
  
  dataFilters.forEach(combination => {
    const matchingData = stateData.filter(row => {
      if (row.taxonomy !== combination.taxonomy) return false;
      
      // Apply special rules based on taxonomy type
      return applySpecialRules(row, combination);
    });
    
    if (matchingData.length > 0) {
      const totalPercentage = matchingData.reduce((sum, row) => sum + row.population_pct, 0);
      filterPercentages.push(totalPercentage);
      console.log(`Filter ${combination.taxonomy}: ${totalPercentage}%`);
    } else {
      filterPercentages.push(0);
    }
  });
  
  // Apply intersection logic: multiply percentages
  if (filterPercentages.length === 0) return 0;
  
  const intersectionPercentage = filterPercentages.reduce((product, percentage) => {
    return product * (percentage / 100);
  }, 1) * 100;
  
  console.log(`Intersection calculation: ${filterPercentages.join(' × ')} = ${intersectionPercentage}%`);
  
  return intersectionPercentage;
}

// Apply special rules for different taxonomy types
function applySpecialRules(
  row: {
    state_code: string;
    taxonomy: string;
    segment: number;
    population_pct: number;
  },
  combination: {
    taxonomy: string;
    segment: number | number[] | string;
    rule: string;
  }
): boolean {
  // Normalize leading zeros in district codes
  if (combination.taxonomy === '2010_state_senate_district' || combination.taxonomy === '2001_us_congressional_district') {
    const normalizedSegment = row.segment.toString().padStart(2, '0');
    if (Array.isArray(combination.segment)) {
      const [min, max] = combination.segment;
      return row.segment >= min && row.segment <= max;
    }
    return false;
  }
  
  // Aggregate all income brackets above 100k
  if (combination.taxonomy === 'commercialdata_estimatedhhincome') {
    if (Array.isArray(combination.segment)) {
      const [min, max] = combination.segment;
      return row.segment >= min && row.segment <= max;
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
    if (combination.segment === '>65') {
      return row.segment > 65;
    } else if (combination.segment === '<=65') {
      return row.segment <= 65;
    }
    return false;
  }
  
  // Default matching logic
  if (typeof combination.segment === 'number') {
    return row.segment === combination.segment;
  }
  
  if (Array.isArray(combination.segment)) {
    return combination.segment.includes(row.segment);
  }
  
  if (typeof combination.segment === 'string') {
    // Handle string-based matching (ethnicity, car makes, etc.)
    return true; // This would need more specific logic based on actual data
  }
  
  return false;
}

// Extract taxonomy from filter ID
function extractTaxonomyFromFilterId(filterId: string): string | null {
  // Handle different filter ID patterns
  if (filterId.includes('_')) {
    const parts = filterId.split('_');
    if (parts.length >= 2) {
      // For filters like 'voters_gender_male', extract 'voters_gender'
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
    segment: number;
    population_pct: number;
  }>,
  rule: EstimationRule
): Array<{
  state_code: string;
  taxonomy: string;
  segment: number;
  population_pct: number;
}> {
  switch (rule.rule) {
    case 'segment_threshold':
      if (rule.threshold !== undefined) {
        return data.filter(row => row.segment > rule.threshold!);
      }
      break;
    
    case 'segment_range':
      if (rule.range) {
        const [min, max] = rule.range;
        return data.filter(row => row.segment >= min && row.segment <= max);
      }
      break;
    
    case 'segment_exact':
      if (rule.segments && rule.segments.length > 0) {
        return data.filter(row => rule.segments!.includes(row.segment));
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
    segment: number;
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
