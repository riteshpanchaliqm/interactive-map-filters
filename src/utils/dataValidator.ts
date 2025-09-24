import { VoterData } from './dataLoader';

export interface TaxonomyData {
  taxonomy: string;
  segments: { [key: string]: number }; // segment -> count
  states: string[];
  totalRecords: number;
}

export interface DataValidationResult {
  availableTaxonomies: TaxonomyData[];
  missingTaxonomies: string[];
  segmentMappings: { [taxonomy: string]: { [segment: string]: string[] } }; // taxonomy -> segment -> filterIds
}

/**
 * Validates that all filter selections have actual data sources in the CSV
 * and creates proper segment mappings for calculated filters
 */
export async function validateDataSources(): Promise<DataValidationResult> {
  console.log('Starting data source validation...');
  
  // Load CSV data
  const response = await fetch('/Data/wycany.csv');
  if (!response.ok) {
    throw new Error(`Failed to load CSV: ${response.status} ${response.statusText}`);
  }
  
  const csvText = await response.text();
  const lines = csvText.split('\n');
  const data: VoterData[] = [];

  // Parse CSV data
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const columns = line.split(',');
    if (columns.length >= 4) {
      const [state_code, taxonomy, segment, population_pct] = columns;
      
      if (state_code && taxonomy && segment && population_pct) {
        const parsedPct = parseFloat(population_pct);
        
        if (!isNaN(parsedPct)) {
          const parsedSegment = parseInt(segment);
          const finalSegment = !isNaN(parsedSegment) ? parsedSegment : segment.trim();
          
          data.push({
            state_code: state_code.trim(),
            taxonomy: taxonomy.trim(),
            segment: finalSegment,
            population_pct: parsedPct
          });
        }
      }
    }
  }

  console.log(`Parsed ${data.length} records for validation`);

  // Analyze taxonomies
  const taxonomyMap = new Map<string, { segments: { [key: string]: number }, states: Set<string>, totalRecords: number }>();
  
  data.forEach(row => {
    if (!taxonomyMap.has(row.taxonomy)) {
      taxonomyMap.set(row.taxonomy, { segments: {}, states: new Set(), totalRecords: 0 });
    }
    
    const taxonomyData = taxonomyMap.get(row.taxonomy)!;
    const segmentKey = row.segment.toString();
    taxonomyData.segments[segmentKey] = (taxonomyData.segments[segmentKey] || 0) + 1;
    taxonomyData.states.add(row.state_code);
    taxonomyData.totalRecords++;
  });

  // Convert to array format
  const availableTaxonomies: TaxonomyData[] = Array.from(taxonomyMap.entries()).map(([taxonomy, info]) => ({
    taxonomy,
    segments: info.segments,
    states: Array.from(info.states).sort(),
    totalRecords: info.totalRecords
  }));

  // Create segment mappings for calculated filters
  const segmentMappings: { [taxonomy: string]: { [segment: string]: string[] } } = {};

  // Income brackets - aggregate specific amounts into ranges
  if (taxonomyMap.has('commercialdata_estimatedhhincome')) {
    const incomeData = taxonomyMap.get('commercialdata_estimatedhhincome')!;
    const incomeSegments = Object.keys(incomeData.segments);
    
    segmentMappings['commercialdata_estimatedhhincome'] = {
      'under_25k': incomeSegments.filter(seg => {
        const numValue = parseFloat(seg.replace(/[$,]/g, ''));
        return !isNaN(numValue) && numValue < 25000;
      }),
      '25k_50k': incomeSegments.filter(seg => {
        const numValue = parseFloat(seg.replace(/[$,]/g, ''));
        return !isNaN(numValue) && numValue >= 25000 && numValue < 50000;
      }),
      '50k_75k': incomeSegments.filter(seg => {
        const numValue = parseFloat(seg.replace(/[$,]/g, ''));
        return !isNaN(numValue) && numValue >= 50000 && numValue < 75000;
      }),
      '75k_100k': incomeSegments.filter(seg => {
        const numValue = parseFloat(seg.replace(/[$,]/g, ''));
        return !isNaN(numValue) && numValue >= 75000 && numValue < 100000;
      }),
      'over_100k': incomeSegments.filter(seg => {
        const numValue = parseFloat(seg.replace(/[$,]/g, ''));
        return !isNaN(numValue) && numValue >= 100000;
      })
    };
  }

  // Age groups - aggregate specific ages into ranges
  if (taxonomyMap.has('voters_age')) {
    const ageData = taxonomyMap.get('voters_age')!;
    const ageSegments = Object.keys(ageData.segments).map(Number).sort((a, b) => a - b);
    
    segmentMappings['voters_age'] = {
      '18_34': ageSegments.filter(age => age >= 18 && age <= 34).map(String),
      '35_54': ageSegments.filter(age => age >= 35 && age <= 54).map(String),
      '55_74': ageSegments.filter(age => age >= 55 && age <= 74).map(String),
      '75_plus': ageSegments.filter(age => age >= 75).map(String)
    };
  }

  // Gender mapping
  if (taxonomyMap.has('voters_gender')) {
    segmentMappings['voters_gender'] = {
      'male': ['M'],
      'female': ['F']
    };
  }

  // Ethnicity mapping - group similar ethnicities
  if (taxonomyMap.has('ethnic_description')) {
    const ethnicityData = taxonomyMap.get('ethnic_description')!;
    const ethnicitySegments = Object.keys(ethnicityData.segments);
    
    segmentMappings['ethnic_description'] = {
      'african_american': ethnicitySegments.filter(seg => 
        seg.includes('African') || seg.includes('Af-Am') || seg.includes('Af-Am')
      ),
      'hispanic': ethnicitySegments.filter(seg => 
        seg.includes('Hispanic')
      ),
      'white': ethnicitySegments.filter(seg => 
        seg.includes('White') || seg.includes('European') || 
        seg.includes('German') || seg.includes('Irish') || seg.includes('Italian') ||
        seg.includes('English') || seg.includes('French') || seg.includes('Dutch') ||
        seg.includes('Swedish') || seg.includes('Norwegian') || seg.includes('Danish')
      ),
      'asian': ethnicitySegments.filter(seg => 
        seg.includes('Asian') || seg.includes('Chinese') || seg.includes('Japanese') ||
        seg.includes('Korean') || seg.includes('Vietnamese') || seg.includes('Filipino') ||
        seg.includes('Indian') || seg.includes('Pakistani') || seg.includes('Bangladeshi')
      )
    };
  }

  // Check for missing taxonomies (taxonomies in filter catalog but not in CSV)
  const missingTaxonomies: string[] = [];
  const catalogTaxonomies = [
    'voters_gender', 'voters_age', 'ethnic_description',
    'commercialdata_estimatedhhincome', 'commercialdata_hhcomposition',
    'consumerdata_auto_make_1', 'consumerdata_auto_make_2',
    'hs_military_family_relationship_yes', 'hs_military_family_relationship_no',
    'hs_israel_military_actions_gop_support', 'hs_ro_khanna_disapproval',
    'hs_ideology_fiscal_conserv', 'hs_ideology_social_liberal',
    'hs_voting_fraud_concern_oppression', 'hs_gun_control_support',
    'hs_violent_crime_not_worried', 'hs_unions_beneficial',
    'hs_tv_most_trusted_news_msnbc', 'hs_trust_science_rarely',
    'hs_trust_science_always', 'hs_trump_vs_harris_favor_harris',
    'hs_tribalism_team_gop', 'hs_tribalism_team_dem',
    'hs_aliens_governenment_disclosed_all', 'voters_movedfrom_state'
  ];

  catalogTaxonomies.forEach(taxonomy => {
    if (!taxonomyMap.has(taxonomy)) {
      missingTaxonomies.push(taxonomy);
    }
  });

  const result: DataValidationResult = {
    availableTaxonomies,
    missingTaxonomies,
    segmentMappings
  };

  console.log('Data validation completed:', result);
  return result;
}

/**
 * Get the actual segment values for a specific taxonomy
 */
export function getTaxonomySegments(taxonomy: string, validationResult: DataValidationResult): string[] {
  const taxonomyData = validationResult.availableTaxonomies.find(t => t.taxonomy === taxonomy);
  return taxonomyData ? Object.keys(taxonomyData.segments) : [];
}

/**
 * Get the calculated segment mapping for a filter
 */
export function getCalculatedSegments(taxonomy: string, filterId: string, validationResult: DataValidationResult): string[] {
  const mappings = validationResult.segmentMappings[taxonomy];
  if (!mappings) return [];
  
  // Find the mapping that matches the filter ID
  for (const [key, segments] of Object.entries(mappings)) {
    if (filterId.includes(key)) {
      return segments;
    }
  }
  
  return [];
}
