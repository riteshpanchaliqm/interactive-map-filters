// Comprehensive Filter Catalog - Aligned with CSV Data and Taxonomy Reference Guide
// This file provides a complete catalog of all available filters based on the actual CSV data
// and follows the taxonomy reference guide for proper categorization and estimation logic

export interface FilterCategory {
  id: string;
  title: string;
  icon: string;
  description: string;
  sections: FilterSection[];
}

export interface FilterSection {
  title: string;
  description: string;
  items: FilterItem[];
  searchable: boolean;
  collapsible?: boolean;
}

export interface FilterItem {
  id: string;
  label: string;
  description: string;
  category: string;
  taxonomy: string;
  count: number;
  states: string[];
}

// State codes mapping
export const STATE_CODES = {
  'CA': 'California',
  'NY': 'New York', 
  'WY': 'Wyoming'
} as const;

// Comprehensive filter catalog based on actual CSV data and taxonomy reference guide
export const FILTER_CATALOG: FilterCategory[] = [
  {
    id: 'core-demographics',
    title: 'Core Demographics',
    icon: '👥',
    description: 'Basic demographic information including gender, age, and ethnicity',
    sections: [
      {
        title: 'Gender',
        description: 'Voter gender distribution',
        searchable: true,
        collapsible: true,
        items: [
          {
            id: 'voters_gender_male',
            label: 'Male Voters (M)',
            description: 'Male voter segments - M = Male',
            category: 'Demographics',
            taxonomy: 'voters_gender',
            count: 0,
            states: []
          },
          {
            id: 'voters_gender_female',
            label: 'Female Voters (F)',
            description: 'Female voter segments - F = Female',
            category: 'Demographics',
            taxonomy: 'voters_gender',
            count: 0,
            states: []
          }
        ]
      },
      {
        title: 'Age Groups',
        description: 'Single age buckets (25, 30, ..., 75). Use combined ranges (e.g., >=45 includes 45, 50, 55...)',
        searchable: true,
        collapsible: true,
        items: [
          {
            id: 'voters_age_25_34',
            label: 'Ages 25-34',
            description: 'Young adult voters (25, 30)',
            category: 'Demographics',
            taxonomy: 'voters_age',
            count: 0,
            states: []
          },
          {
            id: 'voters_age_35_44',
            label: 'Ages 35-44',
            description: 'Middle-aged voters (35, 40)',
            category: 'Demographics',
            taxonomy: 'voters_age',
            count: 0,
            states: []
          },
          {
            id: 'voters_age_45_54',
            label: 'Ages 45-54',
            description: 'Mature voters (45, 50)',
            category: 'Demographics',
            taxonomy: 'voters_age',
            count: 0,
            states: []
          },
          {
            id: 'voters_age_55_64',
            label: 'Ages 55-64',
            description: 'Pre-retirement voters (55, 60)',
            category: 'Demographics',
            taxonomy: 'voters_age',
            count: 0,
            states: []
          },
          {
            id: 'voters_age_65_75',
            label: 'Ages 65-75',
            description: 'Senior voters (65, 70, 75)',
            category: 'Demographics',
            taxonomy: 'voters_age',
            count: 0,
            states: []
          },
          {
            id: 'voters_age_45_plus',
            label: 'Ages 45+',
            description: 'Combined range >=45 (includes 45, 50, 55, 60, 65, 70, 75)',
            category: 'Demographics',
            taxonomy: 'voters_age',
            count: 0,
            states: []
          }
        ]
      },
      {
        title: 'Ethnicity',
        description: 'Ethnic and racial demographics - Segments: African American, Hispanic, White, Asian, Other',
        searchable: true,
        collapsible: true,
        items: [
          {
            id: 'ethnic_description_african_american',
            label: 'African American',
            description: 'African American voters',
            category: 'Demographics',
            taxonomy: 'ethnic_description',
            count: 0,
            states: []
          },
          {
            id: 'ethnic_description_hispanic',
            label: 'Hispanic',
            description: 'Hispanic voters',
            category: 'Demographics',
            taxonomy: 'ethnic_description',
            count: 0,
            states: []
          },
          {
            id: 'ethnic_description_white',
            label: 'White',
            description: 'White voters',
            category: 'Demographics',
            taxonomy: 'ethnic_description',
            count: 0,
            states: []
          },
          {
            id: 'ethnic_description_asian',
            label: 'Asian',
            description: 'Asian voters',
            category: 'Demographics',
            taxonomy: 'ethnic_description',
            count: 0,
            states: []
          },
          {
            id: 'ethnic_description_other',
            label: 'Other',
            description: 'Other ethnicities',
            category: 'Demographics',
            taxonomy: 'ethnic_description',
            count: 0,
            states: []
          }
        ]
      }
    ]
  },
  {
    id: 'geography',
    title: 'Geography',
    icon: '🗺️',
    description: 'Geographic districts, ZIP codes, and administrative boundaries',
    sections: [
      {
        title: 'State Senate Districts',
        description: '2010 state senate districts - WY: 01-30, CA: 01-40. Normalize leading zeros (e.g., 01, 09). Always use 2010 version.',
        searchable: true,
        collapsible: true,
        items: [
          {
            id: '2010_state_senate_district_wy',
            label: 'Wyoming Senate Districts (01-30)',
            description: 'Wyoming state senate districts 01-30 with normalized leading zeros',
            category: 'Geography',
            taxonomy: '2010_state_senate_district',
            count: 0,
            states: ['WY']
          },
          {
            id: '2010_state_senate_district_ca',
            label: 'California Senate Districts (01-40)',
            description: 'California state senate districts 01-40 with normalized leading zeros',
            category: 'Geography',
            taxonomy: '2010_state_senate_district',
            count: 0,
            states: ['CA']
          }
        ]
      },
      {
        title: 'Congressional Districts',
        description: '2001 US Congressional districts - CA: 01-53, NY: 01-29. Normalize leading zeros.',
        searchable: true,
        collapsible: true,
        items: [
          {
            id: '2001_us_congressional_district_ca',
            label: 'California Congressional Districts (01-53)',
            description: 'California US Congressional districts 01-53 with normalized leading zeros',
            category: 'Geography',
            taxonomy: '2001_us_congressional_district',
            count: 0,
            states: ['CA']
          },
          {
            id: '2001_us_congressional_district_ny',
            label: 'New York Congressional Districts (01-29)',
            description: 'New York US Congressional districts 01-29 with normalized leading zeros',
            category: 'Geography',
            taxonomy: '2001_us_congressional_district',
            count: 0,
            states: ['NY']
          }
        ]
      },
      {
        title: 'ZIP Codes',
        description: 'Standard 5-digit ZIPs (e.g., 90210)',
        searchable: true,
        collapsible: true,
        items: [
          {
            id: '2001_us_zipcode',
            label: 'ZIP Codes',
            description: 'Standard 5-digit ZIP codes (e.g., 90210)',
            category: 'Geography',
            taxonomy: '2001_us_zipcode',
            count: 0,
            states: []
          }
        ]
      }
    ]
  },
  {
    id: 'household-income',
    title: 'Household & Income',
    icon: '🏠',
    description: 'Household composition and income brackets',
    sections: [
      {
        title: 'Household Composition',
        description: 'Categories of household types. Always include all variants with children.',
        searchable: true,
        collapsible: true,
        items: [
          {
            id: 'commercialdata_hhcomposition_children',
            label: 'Households with Children',
            description: 'Households with children - Always include all variants with children',
            category: 'Household',
            taxonomy: 'commercialdata_hhcomposition',
            count: 0,
            states: []
          },
          {
            id: 'commercialdata_hhcomposition_no_children',
            label: 'Households without Children',
            description: 'Households without children',
            category: 'Household',
            taxonomy: 'commercialdata_hhcomposition',
            count: 0,
            states: []
          }
        ]
      },
      {
        title: 'Income Brackets',
        description: 'Brackets: <25k, 25-50k, 50-75k, 75-100k, >100k. For estimation, aggregate all 100,001+ ranges.',
        searchable: true,
        collapsible: true,
        items: [
          {
            id: 'commercialdata_estimatedhhincome_under_25k',
            label: 'Under $25,000',
            description: 'Households earning under $25,000',
            category: 'Income',
            taxonomy: 'commercialdata_estimatedhhincome',
            count: 0,
            states: []
          },
          {
            id: 'commercialdata_estimatedhhincome_25k_50k',
            label: '$25,000 - $50,000',
            description: 'Households earning $25,000 - $50,000',
            category: 'Income',
            taxonomy: 'commercialdata_estimatedhhincome',
            count: 0,
            states: []
          },
          {
            id: 'commercialdata_estimatedhhincome_50k_75k',
            label: '$50,000 - $75,000',
            description: 'Households earning $50,000 - $75,000',
            category: 'Income',
            taxonomy: 'commercialdata_estimatedhhincome',
            count: 0,
            states: []
          },
          {
            id: 'commercialdata_estimatedhhincome_75k_100k',
            label: '$75,000 - $100,000',
            description: 'Households earning $75,000 - $100,000',
            category: 'Income',
            taxonomy: 'commercialdata_estimatedhhincome',
            count: 0,
            states: []
          },
          {
            id: 'commercialdata_estimatedhhincome_over_100k',
            label: 'Over $100,000',
            description: 'Households earning over $100,000 (aggregate all 100,001+ ranges)',
            category: 'Income',
            taxonomy: 'commercialdata_estimatedhhincome',
            count: 0,
            states: []
          }
        ]
      }
    ]
  },
  {
    id: 'consumer-data',
    title: 'Consumer Data',
    icon: '🚗',
    description: 'Consumer behavior and purchasing patterns',
    sections: [
      {
        title: 'Automotive',
        description: 'Car ownership (Ford, Toyota, Kia, Hyundai, etc.). If multiple cars, second taxonomy captures overflow.',
        searchable: true,
        collapsible: true,
        items: [
          {
            id: 'consumerdata_auto_make_1_ford',
            label: 'Ford Owners (Primary)',
            description: 'Ford vehicle owners - Primary car',
            category: 'Consumer',
            taxonomy: 'consumerdata_auto_make_1',
            count: 0,
            states: []
          },
          {
            id: 'consumerdata_auto_make_1_toyota',
            label: 'Toyota Owners (Primary)',
            description: 'Toyota vehicle owners - Primary car',
            category: 'Consumer',
            taxonomy: 'consumerdata_auto_make_1',
            count: 0,
            states: []
          },
          {
            id: 'consumerdata_auto_make_1_kia',
            label: 'Kia Owners (Primary)',
            description: 'Kia vehicle owners - Primary car',
            category: 'Consumer',
            taxonomy: 'consumerdata_auto_make_1',
            count: 0,
            states: []
          },
          {
            id: 'consumerdata_auto_make_1_hyundai',
            label: 'Hyundai Owners (Primary)',
            description: 'Hyundai vehicle owners - Primary car',
            category: 'Consumer',
            taxonomy: 'consumerdata_auto_make_1',
            count: 0,
            states: []
          },
          {
            id: 'consumerdata_auto_make_2_ford',
            label: 'Ford Owners (Secondary)',
            description: 'Ford vehicle owners - Secondary car',
            category: 'Consumer',
            taxonomy: 'consumerdata_auto_make_2',
            count: 0,
            states: []
          },
          {
            id: 'consumerdata_auto_make_2_toyota',
            label: 'Toyota Owners (Secondary)',
            description: 'Toyota vehicle owners - Secondary car',
            category: 'Consumer',
            taxonomy: 'consumerdata_auto_make_2',
            count: 0,
            states: []
          }
        ]
      }
    ]
  },
  {
    id: 'military-family',
    title: 'Military & Family Background',
    icon: '🎖️',
    description: 'Military service and family background',
    sections: [
      {
        title: 'Military Service',
        description: 'Military service in household - Segment >65 = Yes, Segment <=65 = No',
        searchable: true,
        collapsible: true,
        items: [
          {
            id: 'hs_military_family_relationship_yes',
            label: 'Military in Household',
            description: 'Military service in household - Segment >65 = Yes (military family present)',
            category: 'Military',
            taxonomy: 'hs_military_family_relationship_yes',
            count: 0,
            states: []
          },
          {
            id: 'hs_military_family_relationship_no',
            label: 'No Military in Household',
            description: 'No military service in household - Segment <=65 = No (no military family)',
            category: 'Military',
            taxonomy: 'hs_military_family_relationship_no',
            count: 0,
            states: []
          }
        ]
      }
    ]
  },
  {
    id: 'political-views',
    title: 'Political Views & Attitudes',
    icon: '🗳️',
    description: 'All hs_* taxonomies = scaled opinion scores. Rule: >65 = Supporter/Positive, <=65 = Opposer/Negative',
    sections: [
      {
        title: 'Israel & Foreign Policy',
        description: 'Views on Israel, military actions, and foreign policy',
        searchable: true,
        collapsible: true,
        items: [
          {
            id: 'hs_israel_military_actions_gop_support',
            label: 'Israel Military Actions GOP Support',
            description: 'Support for GOP stance on Israel military actions (segment >65 = Supporter)',
            category: 'Foreign Policy',
            taxonomy: 'hs_israel_military_actions_gop_support',
            count: 0,
            states: []
          },
          {
            id: 'hs_ro_khanna_disapproval',
            label: 'Ro Khanna Disapproval',
            description: 'Disapproval of Representative Ro Khanna (segment >65 = Disapprover)',
            category: 'Political Figures',
            taxonomy: 'hs_ro_khanna_disapproval',
            count: 0,
            states: []
          }
        ]
      },
      {
        title: 'Ideology & Values',
        description: 'Core ideological beliefs and value systems',
        searchable: true,
        collapsible: true,
        items: [
          {
            id: 'hs_ideology_fiscal_conserv',
            label: 'Fiscal Conservative',
            description: 'Conservative fiscal policy views',
            category: 'Economic Policy',
            taxonomy: 'hs_ideology_fiscal_conserv',
            count: 0,
            states: []
          },
          {
            id: 'hs_wealth_acquired_hardwork',
            label: 'Wealth Through Hard Work',
            description: 'Belief that wealth is acquired through hard work',
            category: 'Economic Views',
            taxonomy: 'hs_wealth_acquired_hardwork',
            count: 0,
            states: []
          },
          {
            id: 'hs_wealth_acquired_advantages',
            label: 'Wealth Through Advantages',
            description: 'Belief that wealth comes from advantages',
            category: 'Economic Views',
            taxonomy: 'hs_wealth_acquired_advantages',
            count: 0,
            states: []
          }
        ]
      },
      {
        title: 'Voting & Democracy',
        description: 'Views on voting, democracy, and political participation',
        searchable: true,
        collapsible: true,
        items: [
          {
            id: 'hs_voting_fraud_concern_oppression',
            label: 'Voting Fraud Concern',
            description: 'Concern about voting fraud and oppression',
            category: 'Democracy',
            taxonomy: 'hs_voting_fraud_concern_oppression',
            count: 0,
            states: []
          }
        ]
      }
    ]
  },
  {
    id: 'social-issues',
    title: 'Social Issues',
    icon: '👥',
    description: 'Social policy positions and community views',
    sections: [
      {
        title: 'Gun Control',
        description: 'Views on gun control and firearm regulations',
        searchable: true,
        collapsible: true,
        items: [
          {
            id: 'hs_gun_control_support',
            label: 'Gun Control Support',
            description: 'Support for gun control measures',
            category: 'Public Safety',
            taxonomy: 'hs_gun_control_support',
            count: 0,
            states: []
          }
        ]
      },
      {
        title: 'Crime & Safety',
        description: 'Views on crime, safety, and law enforcement',
        searchable: true,
        collapsible: true,
        items: [
          {
            id: 'hs_violent_crime_not_worried',
            label: 'Not Worried About Violent Crime',
            description: 'Not concerned about violent crime',
            category: 'Public Safety',
            taxonomy: 'hs_violent_crime_not_worried',
            count: 0,
            states: []
          }
        ]
      },
      {
        title: 'Labor & Unions',
        description: 'Views on labor unions and workers rights',
        searchable: true,
        collapsible: true,
        items: [
          {
            id: 'hs_unions_beneficial',
            label: 'Unions Beneficial',
            description: 'Belief that unions are beneficial',
            category: 'Labor',
            taxonomy: 'hs_unions_beneficial',
            count: 0,
            states: []
          }
        ]
      }
    ]
  },
  {
    id: 'media-trust',
    title: 'Media & Trust',
    icon: '📺',
    description: 'Media consumption and trust in information sources',
    sections: [
      {
        title: 'News Sources',
        description: 'Preferred news sources and media trust',
        searchable: true,
        collapsible: true,
        items: [
          {
            id: 'hs_tv_most_trusted_news_msnbc',
            label: 'MSNBC Most Trusted News',
            description: 'MSNBC as most trusted news source',
            category: 'Media Trust',
            taxonomy: 'hs_tv_most_trusted_news_msnbc',
            count: 0,
            states: []
          }
        ]
      },
      {
        title: 'Science Trust',
        description: 'Trust in science and scientific institutions',
        searchable: true,
        collapsible: true,
        items: [
          {
            id: 'hs_trust_science_rarely',
            label: 'Rarely Trust Science',
            description: 'Rarely trust scientific institutions',
            category: 'Science',
            taxonomy: 'hs_trust_science_rarely',
            count: 0,
            states: []
          },
          {
            id: 'hs_trust_science_always',
            label: 'Always Trust Science',
            description: 'Always trust scientific institutions',
            category: 'Science',
            taxonomy: 'hs_trust_science_always',
            count: 0,
            states: []
          }
        ]
      }
    ]
  },
  {
    id: 'candidates',
    title: 'Candidates & Elections',
    icon: '🏛️',
    description: 'Candidate preferences and electoral choices',
    sections: [
      {
        title: '2024 Election',
        description: 'Views on 2024 presidential candidates',
        searchable: true,
        collapsible: true,
        items: [
          {
            id: 'hs_trump_vs_harris_favor_harris',
            label: 'Favor Harris Over Trump',
            description: 'Prefer Harris over Trump in 2024',
            category: '2024 Election',
            taxonomy: 'hs_trump_vs_harris_favor_harris',
            count: 0,
            states: []
          }
        ]
      },
      {
        title: 'Political Teams',
        description: 'Team affiliation and political identity',
        searchable: true,
        collapsible: true,
        items: [
          {
            id: 'hs_tribalism_team_gop',
            label: 'Team GOP',
            description: 'Identify with GOP team',
            category: 'Political Identity',
            taxonomy: 'hs_tribalism_team_gop',
            count: 0,
            states: []
          },
          {
            id: 'hs_tribalism_team_dem',
            label: 'Team Democratic',
            description: 'Identify with Democratic team',
            category: 'Political Identity',
            taxonomy: 'hs_tribalism_team_dem',
            count: 0,
            states: []
          }
        ]
      }
    ]
  },
  {
    id: 'conspiracy-theories',
    title: 'Conspiracy Theories',
    icon: '🛸',
    description: 'Beliefs in conspiracy theories and alternative explanations',
    sections: [
      {
        title: 'Government Disclosure',
        description: 'Views on government transparency and disclosure',
        searchable: true,
        collapsible: true,
        items: [
          {
            id: 'hs_aliens_governenment_disclosed_all',
            label: 'Government Disclosed All About Aliens',
            description: 'Belief that government has disclosed all about aliens',
            category: 'Conspiracy Theories',
            taxonomy: 'hs_aliens_governenment_disclosed_all',
            count: 0,
            states: []
          }
        ]
      }
    ]
  },
  {
    id: 'geographic-areas',
    title: 'Geographic Areas',
    icon: '🗺️',
    description: 'Geographic and administrative boundaries',
    sections: [
      {
        title: 'Administrative Districts',
        description: 'Various administrative and political districts',
        searchable: true,
        collapsible: true,
        items: [
          {
            id: 'hamlet_community_area',
            label: 'Hamlet Community Area',
            description: 'Hamlet community areas',
            category: 'Administrative',
            taxonomy: 'hamlet_community_area',
            count: 1165,
            states: []
          },
          {
            id: 'unified_school_district',
            label: 'Unified School District',
            description: 'Unified school districts',
            category: 'Education',
            taxonomy: 'unified_school_district',
            count: 1037,
            states: []
          },
          {
            id: 'town_district',
            label: 'Town District',
            description: 'Town districts',
            category: 'Administrative',
            taxonomy: 'town_district',
            count: 1035,
            states: []
          },
          {
            id: 'county_legislative_district',
            label: 'County Legislative District',
            description: 'County legislative districts',
            category: 'Political',
            taxonomy: 'county_legislative_district',
            count: 578,
            states: []
          },
          {
            id: 'village',
            label: 'Village',
            description: 'Villages',
            category: 'Administrative',
            taxonomy: 'village',
            count: 556,
            states: []
          },
          {
            id: 'city',
            label: 'City',
            description: 'Cities',
            category: 'Administrative',
            taxonomy: 'city',
            count: 543,
            states: []
          }
        ]
      }
    ]
  },
  {
    id: 'economic-data',
    title: 'Economic Data',
    icon: '💰',
    description: 'Economic indicators and income data',
    sections: [
      {
        title: 'Income Data',
        description: 'Estimated household income and economic status',
        searchable: true,
        collapsible: true,
        items: [
          {
            id: 'consumerdata_estimated_income_amount',
            label: 'Estimated Income Amount',
            description: 'Consumer data estimated income amount',
            category: 'Income',
            taxonomy: 'consumerdata_estimated_income_amount',
            count: 443,
            states: []
          },
          {
            id: 'commercialdata_estimatedhhincomeamount',
            label: 'Estimated HH Income Amount',
            description: 'Commercial data estimated household income',
            category: 'Income',
            taxonomy: 'commercialdata_estimatedhhincomeamount',
            count: 443,
            states: []
          },
          {
            id: 'consumerdata_estimatedareamedianhhincome',
            label: 'Area Median HH Income',
            description: 'Consumer data estimated area median household income',
            category: 'Income',
            taxonomy: 'consumerdata_estimatedareamedianhhincome',
            count: 425,
            states: []
          }
        ]
      }
    ]
  },
  {
    id: 'migration',
    title: 'Migration',
    icon: '🚚',
    description: 'Coded by origin state (NJ, OH, VA, ...). Summation shows % migrated into given state.',
    sections: [
      {
        title: 'Migration Origins',
        description: 'States where voters moved from. Summation shows % migrated into given state.',
        searchable: true,
        collapsible: true,
        items: [
          {
            id: 'voters_movedfrom_state_nj',
            label: 'Moved from New Jersey',
            description: 'Voters who moved from New Jersey',
            category: 'Migration',
            taxonomy: 'voters_movedfrom_state',
            count: 0,
            states: []
          },
          {
            id: 'voters_movedfrom_state_oh',
            label: 'Moved from Ohio',
            description: 'Voters who moved from Ohio',
            category: 'Migration',
            taxonomy: 'voters_movedfrom_state',
            count: 0,
            states: []
          },
          {
            id: 'voters_movedfrom_state_va',
            label: 'Moved from Virginia',
            description: 'Voters who moved from Virginia',
            category: 'Migration',
            taxonomy: 'voters_movedfrom_state',
            count: 0,
            states: []
          }
        ]
      }
    ]
  }
];

// Helper function to get filter by taxonomy
export function getFilterByTaxonomy(taxonomy: string): FilterItem | null {
  for (const category of FILTER_CATALOG) {
    for (const section of category.sections) {
      for (const item of section.items) {
        if (item.taxonomy === taxonomy) {
          return item;
        }
      }
    }
  }
  return null;
}

// Helper function to get all taxonomies
export function getAllTaxonomies(): string[] {
  const taxonomies: string[] = [];
  for (const category of FILTER_CATALOG) {
    for (const section of category.sections) {
      for (const item of section.items) {
        taxonomies.push(item.taxonomy);
      }
    }
  }
  return taxonomies;
}

// Helper function to get filters by category
export function getFiltersByCategory(categoryId: string): FilterItem[] {
  const category = FILTER_CATALOG.find(cat => cat.id === categoryId);
  if (!category) return [];
  
  const items: FilterItem[] = [];
  for (const section of category.sections) {
    items.push(...section.items);
  }
  return items;
}

// Helper function to search filters
export function searchFilters(query: string): FilterItem[] {
  const results: FilterItem[] = [];
  const searchQuery = query.toLowerCase();
  
  for (const category of FILTER_CATALOG) {
    for (const section of category.sections) {
      for (const item of section.items) {
        if (
          item.label.toLowerCase().includes(searchQuery) ||
          item.description.toLowerCase().includes(searchQuery) ||
          item.taxonomy.toLowerCase().includes(searchQuery) ||
          item.category.toLowerCase().includes(searchQuery)
        ) {
          results.push(item);
        }
      }
    }
  }
  return results;
}
