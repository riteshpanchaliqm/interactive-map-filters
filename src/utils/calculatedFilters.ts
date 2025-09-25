/**
 * CALCULATED FILTERS SYSTEM
 * 
 * This system handles filters that need aggregation or calculation from individual data points.
 * For example: age ranges (18-34) from individual ages (18, 19, 20, etc.)
 */

export interface CalculatedFilter {
  filterId: string;
  taxonomy: string;
  calculationType: 'sum' | 'average' | 'count' | 'range';
  sourceSegments: (string | number)[];
  description: string;
}

export interface FilterCalculationResult {
  filterId: string;
  totalPercentage: number;
  matchingRecords: number;
  sourceData: Array<{
    segment: string | number;
    percentage: number;
    count: number;
  }>;
}

/**
 * CALCULATED FILTER DEFINITIONS
 * Maps filter IDs to their calculation logic
 */
export const CALCULATED_FILTERS: Record<string, CalculatedFilter> = {
  // AGE RANGES - Sum individual ages
  'voters_age_18_34': {
    filterId: 'voters_age_18_34',
    taxonomy: 'voters_age',
    calculationType: 'sum',
    sourceSegments: [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34],
    description: 'Sum of ages 18-34'
  },
  'voters_age_35_54': {
    filterId: 'voters_age_35_54',
    taxonomy: 'voters_age',
    calculationType: 'sum',
    sourceSegments: [35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54],
    description: 'Sum of ages 35-54'
  },
  'voters_age_55_74': {
    filterId: 'voters_age_55_74',
    taxonomy: 'voters_age',
    calculationType: 'sum',
    sourceSegments: [55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74],
    description: 'Sum of ages 55-74'
  },
  'voters_age_75_plus': {
    filterId: 'voters_age_75_plus',
    taxonomy: 'voters_age',
    calculationType: 'sum',
    sourceSegments: [75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100],
    description: 'Sum of ages 75+'
  },

  // ETHNICITY GROUPS - Sum related ethnicities
  'ethnic_description_african_american': {
    filterId: 'ethnic_description_african_american',
    taxonomy: 'ethnic_description',
    calculationType: 'sum',
    sourceSegments: ['African or Af-Am Self Reported', 'Likely Af-Am (Modeled)'],
    description: 'Sum of African American related ethnicities'
  },
  'ethnic_description_white': {
    filterId: 'ethnic_description_white',
    taxonomy: 'ethnic_description',
    calculationType: 'sum',
    sourceSegments: [
      'English/Welsh', 'German', 'Irish', 'Italian', 'French', 'Dutch (Netherlands)',
      'Norwegian', 'Swedish', 'Danish', 'Finnish', 'Polish', 'Czech', 'Hungarian',
      'Austrian', 'Swiss', 'Scots'
    ],
    description: 'Sum of European descent ethnicities'
  },
  'ethnic_description_asian': {
    filterId: 'ethnic_description_asian',
    taxonomy: 'ethnic_description',
    calculationType: 'sum',
    sourceSegments: [
      'Chinese', 'Japanese', 'Korean', 'Vietnamese', 'Filipino', 'Indian/Hindu',
      'Pakistani', 'Bangladeshi', 'Sri Lankan', 'Thai', 'Indonesian', 'Malay',
      'Myanmar (Burmese)', 'Laotian', 'Khmer', 'Tibetan', 'Bhutanese', 'Tonga',
      'Unknown Asian'
    ],
    description: 'Sum of Asian descent ethnicities'
  },
  'ethnic_description_other': {
    filterId: 'ethnic_description_other',
    taxonomy: 'ethnic_description',
    calculationType: 'sum',
    sourceSegments: [
      'Native American', 'Hawaiian', 'Arab', 'Armenian', 'Persian', 'Turkish',
      'Albanian', 'Bulgarian', 'Croatian', 'Serbian', 'Slovenian', 'Slovakian',
      'Romanian', 'Russian (omitting former Soviet States)', 'Ukrainian', 'Byelorussian',
      'Estonian', 'Latvian', 'Lithuanian', 'Georgian', 'Azerb', 'Kazak', 'Uzbek',
      'Turkmenistan', 'Mongolian', 'Afghan', 'Belgian', 'Greek', 'Portuguese'
    ],
    description: 'Sum of other ethnicities'
  },

  // INCOME BRACKETS - Sum income ranges
  'commercialdata_estimatedhhincome_under_25k': {
    filterId: 'commercialdata_estimatedhhincome_under_25k',
    taxonomy: 'commercialdata_estimatedhhincome',
    calculationType: 'sum',
    sourceSegments: ['$1-25000'],
    description: 'Household income under $25,000'
  },
  'commercialdata_estimatedhhincome_25k_50k': {
    filterId: 'commercialdata_estimatedhhincome_25k_50k',
    taxonomy: 'commercialdata_estimatedhhincome',
    calculationType: 'sum',
    sourceSegments: ['$25001-50000'],
    description: 'Household income $25,000-$50,000'
  },
  'commercialdata_estimatedhhincome_50k_75k': {
    filterId: 'commercialdata_estimatedhhincome_50k_75k',
    taxonomy: 'commercialdata_estimatedhhincome',
    calculationType: 'sum',
    sourceSegments: ['$50001-75000'],
    description: 'Household income $50,000-$75,000'
  },
  'commercialdata_estimatedhhincome_75k_100k': {
    filterId: 'commercialdata_estimatedhhincome_75k_100k',
    taxonomy: 'commercialdata_estimatedhhincome',
    calculationType: 'sum',
    sourceSegments: ['$75001-100000'],
    description: 'Household income $75,000-$100,000'
  },
  'commercialdata_estimatedhhincome_over_100k': {
    filterId: 'commercialdata_estimatedhhincome_over_100k',
    taxonomy: 'commercialdata_estimatedhhincome',
    calculationType: 'sum',
    sourceSegments: [
      '$100001-125000', '$125001-150000', '$150001-175000', '$175001-200000',
      '$200001-225000', '$225001-250000', '$250000+'
    ],
    description: 'Household income over $100,000'
  }
};

/**
 * Calculate percentage for a calculated filter
 */
export function calculateFilterPercentage(
  data: Array<{
    state_code: string;
    taxonomy: string;
    segment: number | string;
    population_pct: number;
  }>,
  calculatedFilter: CalculatedFilter,
  targetStates?: string[]
): FilterCalculationResult {
  const matchingRecords = data.filter(row => {
    // Filter by taxonomy
    if (row.taxonomy !== calculatedFilter.taxonomy) return false;
    
    // Filter by target states if specified
    if (targetStates && targetStates.length > 0 && !targetStates.includes(row.state_code)) {
      return false;
    }
    
    // Check if segment matches any source segments
    return calculatedFilter.sourceSegments.includes(row.segment);
  });

  const totalPercentage = matchingRecords.reduce((sum, record) => sum + record.population_pct, 0);
  
  const sourceData = matchingRecords.map(record => ({
    segment: record.segment,
    percentage: record.population_pct,
    count: 1
  }));

  return {
    filterId: calculatedFilter.filterId,
    totalPercentage,
    matchingRecords: matchingRecords.length,
    sourceData
  };
}

/**
 * Get all calculated filters for a taxonomy
 */
export function getCalculatedFiltersForTaxonomy(taxonomy: string): CalculatedFilter[] {
  return Object.values(CALCULATED_FILTERS).filter(filter => filter.taxonomy === taxonomy);
}

/**
 * Check if a filter ID is a calculated filter
 */
export function isCalculatedFilter(filterId: string): boolean {
  return filterId in CALCULATED_FILTERS;
}

/**
 * Get calculated filter by ID
 */
export function getCalculatedFilter(filterId: string): CalculatedFilter | undefined {
  return CALCULATED_FILTERS[filterId];
}
