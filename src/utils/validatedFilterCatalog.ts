import { FilterCategory, FilterSection, FilterItem } from './filterCatalog';
import { validateDataSources, DataValidationResult } from './dataValidator';

/**
 * Creates a validated filter catalog based on actual CSV data
 * This ensures all filters have corresponding data sources
 */
export async function createValidatedFilterCatalog(): Promise<FilterCategory[]> {
  console.log('Creating validated filter catalog...');
  
  // Load validation result
  const validationResult = await validateDataSources();
  
  // Create filter categories based on actual data
  const categories: FilterCategory[] = [];

  // Core Demographics
  const coreDemographics: FilterCategory = {
    id: 'core-demographics',
    title: 'Core Demographics',
    icon: '👥',
    description: 'Basic demographic information including gender, age, and ethnicity',
    sections: []
  };

  // Gender section
  if (validationResult.availableTaxonomies.find(t => t.taxonomy === 'voters_gender')) {
    coreDemographics.sections.push({
      title: 'Gender',
      description: 'Voter gender distribution',
      searchable: true,
      collapsible: true,
      items: [
        {
          id: 'voters_gender_male',
          label: 'Male Voters',
          description: 'Male voter segments (M)',
          category: 'Demographics',
          taxonomy: 'voters_gender',
          count: 0,
          states: []
        },
        {
          id: 'voters_gender_female',
          label: 'Female Voters',
          description: 'Female voter segments (F)',
          category: 'Demographics',
          taxonomy: 'voters_gender',
          count: 0,
          states: []
        }
      ]
    });
  }

  // Age section
  if (validationResult.availableTaxonomies.find(t => t.taxonomy === 'voters_age')) {
    coreDemographics.sections.push({
      title: 'Age Groups',
      description: 'Voter age distribution (18-100 age buckets)',
      searchable: true,
      collapsible: true,
      items: [
        {
          id: 'voters_age_25_34',
          label: 'Ages 25-34',
          description: 'Young adult voters',
          category: 'Demographics',
          taxonomy: 'voters_age',
          count: 0,
          states: []
        },
        {
          id: 'voters_age_35_44',
          label: 'Ages 35-44',
          description: 'Middle-aged voters',
          category: 'Demographics',
          taxonomy: 'voters_age',
          count: 0,
          states: []
        },
        {
          id: 'voters_age_45_54',
          label: 'Ages 45-54',
          description: 'Mature voters',
          category: 'Demographics',
          taxonomy: 'voters_age',
          count: 0,
          states: []
        },
        {
          id: 'voters_age_55_64',
          label: 'Ages 55-64',
          description: 'Pre-retirement voters',
          category: 'Demographics',
          taxonomy: 'voters_age',
          count: 0,
          states: []
        },
        {
          id: 'voters_age_65_75',
          label: 'Ages 65-75',
          description: 'Senior voters',
          category: 'Demographics',
          taxonomy: 'voters_age',
          count: 0,
          states: []
        }
      ]
    });
  }

  // Ethnicity section
  if (validationResult.availableTaxonomies.find(t => t.taxonomy === 'ethnic_description')) {
    coreDemographics.sections.push({
      title: 'Ethnicity',
      description: 'Ethnic and racial demographics',
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
        }
      ]
    });
  }

  if (coreDemographics.sections.length > 0) {
    categories.push(coreDemographics);
  }

  // Household & Income
  const householdIncome: FilterCategory = {
    id: 'household-income',
    title: 'Household & Income',
    icon: '🏠',
    description: 'Household composition and income brackets',
    sections: []
  };

  // Income section
  if (validationResult.availableTaxonomies.find(t => t.taxonomy === 'commercialdata_estimatedhhincome')) {
    householdIncome.sections.push({
      title: 'Income Brackets',
      description: 'Household income distribution (calculated from specific amounts)',
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
          description: 'Households earning over $100,000 (aggregated)',
          category: 'Income',
          taxonomy: 'commercialdata_estimatedhhincome',
          count: 0,
          states: []
        }
      ]
    });
  }

  if (householdIncome.sections.length > 0) {
    categories.push(householdIncome);
  }

  // Political Views & Attitudes (hs_* taxonomies)
  const politicalViews: FilterCategory = {
    id: 'political-views',
    title: 'Political Views & Attitudes',
    icon: '🗳️',
    description: 'Political opinions, attitudes, and ideological positions (hs_* taxonomies)',
    sections: []
  };

  // Get all hs_* taxonomies from the data
  const hsTaxonomies = validationResult.availableTaxonomies.filter(t => t.taxonomy.startsWith('hs_'));
  
  if (hsTaxonomies.length > 0) {
    // Group by category
    const categories_map: { [key: string]: any[] } = {};
    
    hsTaxonomies.forEach(taxonomy => {
      let category = 'General';
      if (taxonomy.taxonomy.includes('israel') || taxonomy.taxonomy.includes('military')) {
        category = 'Foreign Policy';
      } else if (taxonomy.taxonomy.includes('ideology')) {
        category = 'Ideology';
      } else if (taxonomy.taxonomy.includes('voting') || taxonomy.taxonomy.includes('fraud')) {
        category = 'Democracy';
      } else if (taxonomy.taxonomy.includes('gun') || taxonomy.taxonomy.includes('crime') || taxonomy.taxonomy.includes('unions')) {
        category = 'Social Issues';
      } else if (taxonomy.taxonomy.includes('tv') || taxonomy.taxonomy.includes('trust') || taxonomy.taxonomy.includes('science')) {
        category = 'Media Trust';
      } else if (taxonomy.taxonomy.includes('trump') || taxonomy.taxonomy.includes('harris') || taxonomy.taxonomy.includes('tribalism')) {
        category = 'Elections';
      } else if (taxonomy.taxonomy.includes('aliens') || taxonomy.taxonomy.includes('conspiracy')) {
        category = 'Conspiracy';
      }
      
      if (!categories_map[category]) {
        categories_map[category] = [];
      }
      categories_map[category].push(taxonomy);
    });

    // Create sections for each category
    Object.entries(categories_map).forEach(([categoryName, taxonomies]) => {
      const section: FilterSection = {
        title: categoryName,
        description: `${categoryName} related political views`,
        searchable: true,
        collapsible: true,
        items: taxonomies.map(taxonomy => {
          const baseName = taxonomy.taxonomy.replace('hs_', '').replace(/_/g, ' ');
          return [
            {
              id: `${taxonomy.taxonomy}_supporter`,
              label: `${baseName} (Supporter)`,
              description: `Supports ${baseName} (segment >65)`,
              category: categoryName,
              taxonomy: taxonomy.taxonomy,
              count: taxonomy.totalRecords,
              states: taxonomy.states
            },
            {
              id: `${taxonomy.taxonomy}_opposer`,
              label: `${baseName} (Opposer)`,
              description: `Opposes ${baseName} (segment ≤65)`,
              category: categoryName,
              taxonomy: taxonomy.taxonomy,
              count: taxonomy.totalRecords,
              states: taxonomy.states
            }
          ];
        }).flat()
      };
      
      politicalViews.sections.push(section);
    });
  }

  if (politicalViews.sections.length > 0) {
    categories.push(politicalViews);
  }

  // Consumer Data
  const consumerData: FilterCategory = {
    id: 'consumer-data',
    title: 'Consumer Data',
    icon: '🚗',
    description: 'Consumer behavior and purchasing patterns',
    sections: []
  };

  // Auto make sections
  const autoMake1 = validationResult.availableTaxonomies.find(t => t.taxonomy === 'consumerdata_auto_make_1');
  const autoMake2 = validationResult.availableTaxonomies.find(t => t.taxonomy === 'consumerdata_auto_make_2');
  
  if (autoMake1 || autoMake2) {
    const automotiveSection: FilterSection = {
      title: 'Automotive',
      description: 'Car ownership and preferences',
      searchable: true,
      collapsible: true,
      items: []
    };

    if (autoMake1) {
      // Get unique car makes from segments
      const carMakes = Object.keys(autoMake1.segments);
      carMakes.forEach(make => {
        automotiveSection.items.push({
          id: `consumerdata_auto_make_1_${make.toLowerCase().replace(/\s+/g, '_')}`,
          label: `${make} Owners`,
          description: `${make} vehicle owners`,
          category: 'Consumer',
          taxonomy: 'consumerdata_auto_make_1',
          count: autoMake1.segments[make],
          states: autoMake1.states
        });
      });
    }

    if (automotiveSection.items.length > 0) {
      consumerData.sections.push(automotiveSection);
    }
  }

  if (consumerData.sections.length > 0) {
    categories.push(consumerData);
  }

  // Migration
  const migration = validationResult.availableTaxonomies.find(t => t.taxonomy === 'voters_movedfrom_state');
  if (migration) {
    const migrationCategory: FilterCategory = {
      id: 'migration',
      title: 'Migration',
      icon: '🚚',
      description: 'Migration patterns and origins',
      sections: [{
        title: 'Migration Origins',
        description: 'States where voters moved from (sum shows % moved into state)',
        searchable: true,
        collapsible: true,
        items: Object.keys(migration.segments).map(state => ({
          id: `voters_movedfrom_state_${state.toLowerCase()}`,
          label: `Moved from ${state}`,
          description: `Voters who moved from ${state}`,
          category: 'Migration',
          taxonomy: 'voters_movedfrom_state',
          count: migration.segments[state],
          states: migration.states
        }))
      }]
    };
    
    categories.push(migrationCategory);
  }

  // Add area selection category
  const areaSelectionCategory: FilterCategory = {
    id: 'area-selection',
    title: 'Area Selection',
    icon: '🗺️',
    description: 'Geographic area selection',
    sections: [{
      title: 'States',
      description: 'Select states to analyze',
      searchable: true,
      collapsible: true,
      items: [
        {
          id: 'state-CA',
          label: 'California (CA)',
          description: 'California state',
          category: 'Geographic Areas',
          taxonomy: 'state',
          count: 0,
          states: ['CA']
        },
        {
          id: 'state-NY',
          label: 'New York (NY)',
          description: 'New York state',
          category: 'Geographic Areas',
          taxonomy: 'state',
          count: 0,
          states: ['NY']
        },
        {
          id: 'state-WY',
          label: 'Wyoming (WY)',
          description: 'Wyoming state',
          category: 'Geographic Areas',
          taxonomy: 'state',
          count: 0,
          states: ['WY']
        }
      ]
    }]
  };

  categories.unshift(areaSelectionCategory);

  console.log('Validated filter catalog created with', categories.length, 'categories');
  return categories;
}
