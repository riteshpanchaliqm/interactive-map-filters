/**
 * COMPREHENSIVE FILTER CATALOGING SYSTEM
 * 
 * This system maps every filter in the catalog to its data source and calculation method.
 * It ensures all filters have proper data backing and calculation logic.
 */

export interface FilterDataMapping {
  filterId: string;
  taxonomy: string;
  dataSource: 'direct' | 'calculated' | 'aggregated';
  calculationMethod: 'exact_match' | 'sum' | 'average' | 'range_sum' | 'category_sum';
  sourceSegments: (string | number)[];
  description: string;
  validationStatus: 'verified' | 'needs_verification' | 'missing_data';
}

export interface CatalogingReport {
  totalFilters: number;
  verifiedFilters: number;
  calculatedFilters: number;
  missingDataFilters: number;
  filterMappings: FilterDataMapping[];
  recommendations: string[];
}

/**
 * COMPREHENSIVE FILTER MAPPINGS
 * Maps every filter to its data source and calculation method
 */
export const FILTER_DATA_MAPPINGS: Record<string, FilterDataMapping> = {
  // AREA SELECTION
  'state-CA': {
    filterId: 'state-CA',
    taxonomy: 'geographic_filter',
    dataSource: 'direct',
    calculationMethod: 'exact_match',
    sourceSegments: ['CA'],
    description: 'California state filter',
    validationStatus: 'verified'
  },
  'state-NY': {
    filterId: 'state-NY',
    taxonomy: 'geographic_filter',
    dataSource: 'direct',
    calculationMethod: 'exact_match',
    sourceSegments: ['NY'],
    description: 'New York state filter',
    validationStatus: 'verified'
  },
  'state-WY': {
    filterId: 'state-WY',
    taxonomy: 'geographic_filter',
    dataSource: 'direct',
    calculationMethod: 'exact_match',
    sourceSegments: ['WY'],
    description: 'Wyoming state filter',
    validationStatus: 'verified'
  },

  // GENDER - Direct data
  'voters_gender_male': {
    filterId: 'voters_gender_male',
    taxonomy: 'voters_gender',
    dataSource: 'direct',
    calculationMethod: 'exact_match',
    sourceSegments: ['M'],
    description: 'Male voters',
    validationStatus: 'verified'
  },
  'voters_gender_female': {
    filterId: 'voters_gender_female',
    taxonomy: 'voters_gender',
    dataSource: 'direct',
    calculationMethod: 'exact_match',
    sourceSegments: ['F'],
    description: 'Female voters',
    validationStatus: 'verified'
  },

  // AGE GROUPS - Calculated from individual ages
  'voters_age_18_34': {
    filterId: 'voters_age_18_34',
    taxonomy: 'voters_age',
    dataSource: 'calculated',
    calculationMethod: 'range_sum',
    sourceSegments: [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34],
    description: 'Sum of ages 18-34',
    validationStatus: 'verified'
  },
  'voters_age_35_54': {
    filterId: 'voters_age_35_54',
    taxonomy: 'voters_age',
    dataSource: 'calculated',
    calculationMethod: 'range_sum',
    sourceSegments: [35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54],
    description: 'Sum of ages 35-54',
    validationStatus: 'verified'
  },
  'voters_age_55_74': {
    filterId: 'voters_age_55_74',
    taxonomy: 'voters_age',
    dataSource: 'calculated',
    calculationMethod: 'range_sum',
    sourceSegments: [55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74],
    description: 'Sum of ages 55-74',
    validationStatus: 'verified'
  },
  'voters_age_75_plus': {
    filterId: 'voters_age_75_plus',
    taxonomy: 'voters_age',
    dataSource: 'calculated',
    calculationMethod: 'range_sum',
    sourceSegments: [75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100],
    description: 'Sum of ages 75+',
    validationStatus: 'verified'
  },

  // ETHNICITY - Calculated from specific ethnicities
  'ethnic_description_african_american': {
    filterId: 'ethnic_description_african_american',
    taxonomy: 'ethnic_description',
    dataSource: 'calculated',
    calculationMethod: 'category_sum',
    sourceSegments: ['African or Af-Am Self Reported', 'Likely Af-Am (Modeled)'],
    description: 'Sum of African American related ethnicities',
    validationStatus: 'verified'
  },
  'ethnic_description_hispanic': {
    filterId: 'ethnic_description_hispanic',
    taxonomy: 'ethnic_description',
    dataSource: 'direct',
    calculationMethod: 'exact_match',
    sourceSegments: ['Hispanic'],
    description: 'Hispanic ethnicity',
    validationStatus: 'verified'
  },
  'ethnic_description_white': {
    filterId: 'ethnic_description_white',
    taxonomy: 'ethnic_description',
    dataSource: 'calculated',
    calculationMethod: 'category_sum',
    sourceSegments: [
      'English/Welsh', 'German', 'Irish', 'Italian', 'French', 'Dutch (Netherlands)',
      'Norwegian', 'Swedish', 'Danish', 'Finnish', 'Polish', 'Czech', 'Hungarian',
      'Austrian', 'Swiss', 'Scots'
    ],
    description: 'Sum of European descent ethnicities',
    validationStatus: 'verified'
  },
  'ethnic_description_asian': {
    filterId: 'ethnic_description_asian',
    taxonomy: 'ethnic_description',
    dataSource: 'calculated',
    calculationMethod: 'category_sum',
    sourceSegments: [
      'Chinese', 'Japanese', 'Korean', 'Vietnamese', 'Filipino', 'Indian/Hindu',
      'Pakistani', 'Bangladeshi', 'Sri Lankan', 'Thai', 'Indonesian', 'Malay',
      'Myanmar (Burmese)', 'Laotian', 'Khmer', 'Tibetan', 'Bhutanese', 'Tonga',
      'Unknown Asian'
    ],
    description: 'Sum of Asian descent ethnicities',
    validationStatus: 'verified'
  },

  // INCOME BRACKETS - Direct data
  'commercialdata_estimatedhhincome_under_25k': {
    filterId: 'commercialdata_estimatedhhincome_under_25k',
    taxonomy: 'commercialdata_estimatedhhincome',
    dataSource: 'direct',
    calculationMethod: 'exact_match',
    sourceSegments: ['$1-25000'],
    description: 'Household income under $25,000',
    validationStatus: 'verified'
  },
  'commercialdata_estimatedhhincome_25k_50k': {
    filterId: 'commercialdata_estimatedhhincome_25k_50k',
    taxonomy: 'commercialdata_estimatedhhincome',
    dataSource: 'direct',
    calculationMethod: 'exact_match',
    sourceSegments: ['$25001-50000'],
    description: 'Household income $25,000-$50,000',
    validationStatus: 'verified'
  },
  'commercialdata_estimatedhhincome_50k_75k': {
    filterId: 'commercialdata_estimatedhhincome_50k_75k',
    taxonomy: 'commercialdata_estimatedhhincome',
    dataSource: 'direct',
    calculationMethod: 'exact_match',
    sourceSegments: ['$50001-75000'],
    description: 'Household income $50,000-$75,000',
    validationStatus: 'verified'
  },
  'commercialdata_estimatedhhincome_75k_100k': {
    filterId: 'commercialdata_estimatedhhincome_75k_100k',
    taxonomy: 'commercialdata_estimatedhhincome',
    dataSource: 'direct',
    calculationMethod: 'exact_match',
    sourceSegments: ['$75001-100000'],
    description: 'Household income $75,000-$100,000',
    validationStatus: 'verified'
  },
  'commercialdata_estimatedhhincome_over_100k': {
    filterId: 'commercialdata_estimatedhhincome_over_100k',
    taxonomy: 'commercialdata_estimatedhhincome',
    dataSource: 'calculated',
    calculationMethod: 'sum',
    sourceSegments: [
      '$100001-125000', '$125001-150000', '$150001-175000', '$175001-200000',
      '$200001-225000', '$225001-250000', '$250000+'
    ],
    description: 'Sum of household income over $100,000',
    validationStatus: 'verified'
  },

  // CONSUMER DATA - Direct data
  'consumerdata_auto_make_ford': {
    filterId: 'consumerdata_auto_make_ford',
    taxonomy: 'consumerdata_auto_make_1',
    dataSource: 'direct',
    calculationMethod: 'exact_match',
    sourceSegments: ['Ford'],
    description: 'Ford vehicle owners',
    validationStatus: 'verified'
  },
  'consumerdata_auto_make_toyota': {
    filterId: 'consumerdata_auto_make_toyota',
    taxonomy: 'consumerdata_auto_make_1',
    dataSource: 'direct',
    calculationMethod: 'exact_match',
    sourceSegments: ['Toyota'],
    description: 'Toyota vehicle owners',
    validationStatus: 'verified'
  },
  'consumerdata_auto_make_honda': {
    filterId: 'consumerdata_auto_make_honda',
    taxonomy: 'consumerdata_auto_make_1',
    dataSource: 'direct',
    calculationMethod: 'exact_match',
    sourceSegments: ['Honda'],
    description: 'Honda vehicle owners',
    validationStatus: 'verified'
  },
  'consumerdata_auto_make_chevrolet': {
    filterId: 'consumerdata_auto_make_chevrolet',
    taxonomy: 'consumerdata_auto_make_1',
    dataSource: 'direct',
    calculationMethod: 'exact_match',
    sourceSegments: ['Chevrolet'],
    description: 'Chevrolet vehicle owners',
    validationStatus: 'verified'
  },
  'consumerdata_auto_make_nissan': {
    filterId: 'consumerdata_auto_make_nissan',
    taxonomy: 'consumerdata_auto_make_1',
    dataSource: 'direct',
    calculationMethod: 'exact_match',
    sourceSegments: ['Nissan'],
    description: 'Nissan vehicle owners',
    validationStatus: 'verified'
  },

  // MIGRATION - Direct data
  'voters_movedfrom_state_ca': {
    filterId: 'voters_movedfrom_state_ca',
    taxonomy: 'voters_movedfrom_state',
    dataSource: 'direct',
    calculationMethod: 'exact_match',
    sourceSegments: ['CA'],
    description: 'Moved from California',
    validationStatus: 'verified'
  },
  'voters_movedfrom_state_ny': {
    filterId: 'voters_movedfrom_state_ny',
    taxonomy: 'voters_movedfrom_state',
    dataSource: 'direct',
    calculationMethod: 'exact_match',
    sourceSegments: ['NY'],
    description: 'Moved from New York',
    validationStatus: 'verified'
  },
  'voters_movedfrom_state_tx': {
    filterId: 'voters_movedfrom_state_tx',
    taxonomy: 'voters_movedfrom_state',
    dataSource: 'direct',
    calculationMethod: 'exact_match',
    sourceSegments: ['TX'],
    description: 'Moved from Texas',
    validationStatus: 'verified'
  },
  'voters_movedfrom_state_fl': {
    filterId: 'voters_movedfrom_state_fl',
    taxonomy: 'voters_movedfrom_state',
    dataSource: 'direct',
    calculationMethod: 'exact_match',
    sourceSegments: ['FL'],
    description: 'Moved from Florida',
    validationStatus: 'verified'
  }
};

/**
 * Get data mapping for a filter
 */
export function getFilterDataMapping(filterId: string): FilterDataMapping | undefined {
  return FILTER_DATA_MAPPINGS[filterId];
}

/**
 * Check if a filter has verified data
 */
export function isFilterDataVerified(filterId: string): boolean {
  const mapping = getFilterDataMapping(filterId);
  return mapping?.validationStatus === 'verified';
}

/**
 * Get all filters that need verification
 */
export function getFiltersNeedingVerification(): FilterDataMapping[] {
  return Object.values(FILTER_DATA_MAPPINGS).filter(
    mapping => mapping.validationStatus === 'needs_verification'
  );
}

/**
 * Generate cataloging report
 */
export function generateCatalogingReport(): CatalogingReport {
  const mappings = Object.values(FILTER_DATA_MAPPINGS);
  
  const verifiedFilters = mappings.filter(m => m.validationStatus === 'verified').length;
  const calculatedFilters = mappings.filter(m => m.dataSource === 'calculated').length;
  const missingDataFilters = mappings.filter(m => m.validationStatus === 'missing_data').length;
  
  const recommendations: string[] = [];
  
  if (missingDataFilters > 0) {
    recommendations.push(`Fix ${missingDataFilters} filters with missing data`);
  }
  
  if (calculatedFilters > 0) {
    recommendations.push(`Verify ${calculatedFilters} calculated filters are working correctly`);
  }
  
  return {
    totalFilters: mappings.length,
    verifiedFilters,
    calculatedFilters,
    missingDataFilters,
    filterMappings: mappings,
    recommendations
  };
}
