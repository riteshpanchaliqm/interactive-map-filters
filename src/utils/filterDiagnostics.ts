/**
 * COMPREHENSIVE FILTER DIAGNOSTICS
 * 
 * This system tests each filter individually to identify exactly which ones
 * are not getting data and why.
 */

export interface FilterDiagnosticResult {
  filterId: string;
  taxonomy: string;
  hasData: boolean;
  dataCount: number;
  sampleData: any[];
  issues: string[];
  segmentMapping: string | number | (string | number)[];
  csvSegments: (string | number)[];
  matchStatus: 'exact' | 'partial' | 'none';
}

export interface DiagnosticReport {
  totalFilters: number;
  workingFilters: number;
  brokenFilters: number;
  results: FilterDiagnosticResult[];
  summary: string;
}

/**
 * Test a single filter against CSV data
 */
export async function testSingleFilter(filterId: string): Promise<FilterDiagnosticResult> {
  console.log(`\n=== TESTING FILTER: ${filterId} ===`);
  
  const issues: string[] = [];
  let hasData = false;
  let dataCount = 0;
  let sampleData: any[] = [];
  let segmentMapping: string | number | (string | number)[] = [];
  let csvSegments: (string | number)[] = [];
  let matchStatus: 'exact' | 'partial' | 'none' = 'none';
  let taxonomy: string = 'unknown';
  
  try {
    // Load CSV data
    const response = await fetch('/Data/wycany.csv');
    const csvText = await response.text();
    const lines = csvText.split('\n');
    
    // Extract taxonomy from filter ID
    taxonomy = extractTaxonomyFromFilterId(filterId) || 'unknown';
    console.log(`Taxonomy: ${taxonomy}`);
    
    // Handle geographic filters (state filters) - these don't have CSV data
    if (taxonomy === 'geographic_filter') {
      console.log('Geographic filter - no CSV data needed');
      return {
        filterId,
        taxonomy: 'geographic_filter',
        hasData: true, // Geographic filters are always valid
        dataCount: 1,
        sampleData: [{ state: filterId.replace('state-', ''), type: 'geographic' }],
        issues: [],
        segmentMapping: filterId.replace('state-', ''),
        csvSegments: [],
        matchStatus: 'exact'
      };
    }
    
    if (!taxonomy) {
      issues.push('Cannot extract taxonomy from filter ID');
      return {
        filterId,
        taxonomy: 'unknown',
        hasData: false,
        dataCount: 0,
        sampleData: [],
        issues,
        segmentMapping: [],
        csvSegments: [],
        matchStatus: 'none'
      };
    }
    
    // Get all segments for this taxonomy from CSV
    const taxonomyData = lines.slice(1)
      .map(line => {
        const [state, tax, segment, pct] = line.split(',');
        if (tax === taxonomy && segment && pct) {
          return {
            state: state.trim(),
            segment: segment.trim(),
            percentage: parseFloat(pct)
          };
        }
        return null;
      })
      .filter(Boolean);
    
    console.log(`Found ${taxonomyData.length} records for taxonomy ${taxonomy}`);
    csvSegments = [...new Set(taxonomyData.map(d => d.segment))];
    console.log(`CSV segments: ${csvSegments.slice(0, 10).join(', ')}${csvSegments.length > 10 ? '...' : ''}`);
    
    // Determine expected segments for this filter
    segmentMapping = determineExpectedSegments(filterId, taxonomy);
    console.log(`Expected segments: ${Array.isArray(segmentMapping) ? segmentMapping.join(', ') : segmentMapping}`);
    
    // Check for matches
    const matchingData = taxonomyData.filter(record => {
      if (Array.isArray(segmentMapping)) {
        // For age filters, check if the segment is a number and matches our range
        if (taxonomy === 'voters_age') {
          const age = parseFloat(record.segment);
          if (!isNaN(age)) {
            return segmentMapping.includes(age);
          }
        }
        return segmentMapping.includes(record.segment);
      } else if (segmentMapping === 'supporter') {
        // For political supporters, match segments > 65
        return parseFloat(record.segment) > 65;
      } else if (segmentMapping === 'opposer') {
        // For political opposers, match segments <= 65
        return parseFloat(record.segment) <= 65;
      } else {
        return record.segment === segmentMapping;
      }
    });
    
    console.log(`Matching records: ${matchingData.length}`);
    sampleData = matchingData.slice(0, 5);
    
    if (matchingData.length > 0) {
      hasData = true;
      dataCount = matchingData.length;
      matchStatus = 'exact';
    } else {
      // Check for partial matches
      const partialMatches = taxonomyData.filter(record => {
        if (Array.isArray(segmentMapping)) {
          // For age filters, check if the segment is a number and matches our range
          if (taxonomy === 'voters_age') {
            const age = parseFloat(record.segment);
            if (!isNaN(age)) {
              return segmentMapping.includes(age);
            }
          }
          return segmentMapping.some(seg => 
            record.segment.toString().toLowerCase().includes(seg.toString().toLowerCase())
          );
        } else if (segmentMapping === 'supporter' || segmentMapping === 'opposer') {
          // For political filters, check if the segment is a number
          const num = parseFloat(record.segment);
          if (!isNaN(num)) {
            if (segmentMapping === 'supporter') return num > 65;
            if (segmentMapping === 'opposer') return num <= 65;
          }
          return false;
        } else {
          return record.segment.toString().toLowerCase().includes(segmentMapping.toString().toLowerCase());
        }
      });
      
      if (partialMatches.length > 0) {
        matchStatus = 'partial';
        issues.push(`Only partial matches found. Expected: ${segmentMapping}, Found: ${partialMatches.map(m => m.segment).join(', ')}`);
      } else {
        matchStatus = 'none';
        issues.push(`No matches found. Expected: ${segmentMapping}, Available: ${csvSegments.slice(0, 5).join(', ')}`);
      }
    }
    
  } catch (error) {
    console.error(`Error testing filter ${filterId}:`, error);
    issues.push(`Error testing filter: ${error}`);
  }
  
  console.log(`Result: ${hasData ? 'HAS DATA' : 'NO DATA'} (${dataCount} records)`);
  
  return {
    filterId,
    taxonomy,
    hasData,
    dataCount,
    sampleData,
    issues,
    segmentMapping,
    csvSegments,
    matchStatus
  };
}

/**
 * Extract taxonomy from filter ID
 */
function extractTaxonomyFromFilterId(filterId: string): string | null {
  console.log(`Extracting taxonomy from filterId: ${filterId}`);
  
  // Handle state filters - these are geographic filters, not CSV taxonomies
  if (filterId.startsWith('state-')) {
    console.log('State filter detected - this is a geographic filter');
    return 'geographic_filter';
  }
  
  // Handle other filters
  const parts = filterId.split('_');
  console.log(`Filter parts: ${parts.join(', ')}`);
  
  if (parts.length >= 2) {
    // For filters like 'voters_gender_male', return 'voters_gender'
    if (parts[0] === 'voters' && parts[1] === 'gender') {
      console.log('Gender filter detected');
      return 'voters_gender';
    }
    if (parts[0] === 'voters' && parts[1] === 'age') {
      console.log('Age filter detected');
      return 'voters_age';
    }
    if (parts[0] === 'ethnic' && parts[1] === 'description') {
      console.log('Ethnicity filter detected');
      return 'ethnic_description';
    }
    if (parts[0] === 'commercialdata' && parts[1] === 'estimatedhhincome') {
      console.log('Income filter detected');
      return 'commercialdata_estimatedhhincome';
    }
    if (parts[0] === 'consumerdata' && parts[1] === 'auto' && parts[2] === 'make') {
      console.log('Auto make filter detected');
      return 'consumerdata_auto_make_1';
    }
    if (parts[0] === 'voters' && parts[1] === 'movedfrom' && parts[2] === 'state') {
      console.log('Migration filter detected');
      return 'voters_movedfrom_state';
    }
    if (parts[0] === 'hs') {
      console.log('Political filter detected');
      return filterId.replace(/_supporter$|_opposer$/, '');
    }
  }
  
  console.log('No taxonomy match found');
  return null;
}

/**
 * Determine expected segments for a filter
 */
function determineExpectedSegments(filterId: string, taxonomy: string): string | number | (string | number)[] {
  // Gender filters
  if (taxonomy === 'voters_gender') {
    return filterId.includes('male') ? 'M' : 'F';
  }
  
  // Age filters - CSV has individual ages, so we need to match them directly
  if (taxonomy === 'voters_age') {
    if (filterId.includes('18_34')) return [18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34];
    if (filterId.includes('35_54')) return [35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54];
    if (filterId.includes('55_74')) return [55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74];
    if (filterId.includes('75_plus')) return [75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100];
  }
  
  // Ethnicity filters
  if (taxonomy === 'ethnic_description') {
    if (filterId.includes('african_american')) return ['African or Af-Am Self Reported', 'Likely Af-Am (Modeled)'];
    if (filterId.includes('hispanic')) return 'Hispanic';
    if (filterId.includes('white')) return ['English/Welsh', 'German', 'Irish', 'Italian', 'French', 'Dutch (Netherlands)', 'Norwegian', 'Swedish', 'Danish', 'Finnish', 'Polish', 'Czech', 'Hungarian', 'Austrian', 'Swiss', 'Scots'];
    if (filterId.includes('asian')) return ['Chinese', 'Japanese', 'Korean', 'Vietnamese', 'Filipino', 'Indian/Hindu', 'Pakistani', 'Bangladeshi', 'Sri Lankan', 'Thai', 'Indonesian', 'Malay', 'Myanmar (Burmese)', 'Laotian', 'Khmer', 'Tibetan', 'Bhutanese', 'Tonga', 'Unknown Asian'];
  }
  
  // Income filters
  if (taxonomy === 'commercialdata_estimatedhhincome') {
    if (filterId.includes('under_25k')) return '$1-25000';
    if (filterId.includes('25k_50k')) return '$25001-50000';
    if (filterId.includes('50k_75k')) return '$50001-75000';
    if (filterId.includes('75k_100k')) return '$75001-100000';
    if (filterId.includes('over_100k')) return ['$100001-125000', '$125001-150000', '$150001-175000', '$175001-200000', '$200001-225000', '$225001-250000', '$250000+'];
  }
  
  // Consumer data filters
  if (taxonomy === 'consumerdata_auto_make_1') {
    if (filterId.includes('ford')) return 'Ford';
    if (filterId.includes('toyota')) return 'Toyota';
    if (filterId.includes('honda')) return 'Honda';
    if (filterId.includes('chevrolet')) return 'Chevrolet';
    if (filterId.includes('nissan')) return 'Nissan';
  }
  
  // Migration filters
  if (taxonomy === 'voters_movedfrom_state') {
    if (filterId.includes('ca')) return 'CA';
    if (filterId.includes('ny')) return 'NY';
    if (filterId.includes('tx')) return 'TX';
    if (filterId.includes('fl')) return 'FL';
  }
  
  // Political filters (hs_*) - these have numeric segments representing percentages
  if (taxonomy.startsWith('hs_')) {
    // For political filters, the segments are numeric percentages
    // We need to check if the filter is for supporter (>65%) or opposer (<=65%)
    if (filterId.includes('supporter')) {
      // Supporter means >65% - we need to find segments > 65
      return 'supporter';
    } else if (filterId.includes('opposer')) {
      // Opposer means <=65% - we need to find segments <= 65
      return 'opposer';
    }
    return 'supporter'; // Default to supporter
  }
  
  return [];
}

/**
 * Test all filters systematically
 */
export async function testAllFilters(): Promise<DiagnosticReport> {
  console.log('🔍 STARTING COMPREHENSIVE FILTER DIAGNOSTICS...\n');
  
  // Get all filter IDs from the catalog
  const allFilterIds = [
    // Area Selection
    'state-CA', 'state-NY', 'state-WY',
    
    // Gender
    'voters_gender_male', 'voters_gender_female',
    
    // Age
    'voters_age_18_34', 'voters_age_35_54', 'voters_age_55_74', 'voters_age_75_plus',
    
    // Ethnicity
    'ethnic_description_african_american', 'ethnic_description_hispanic', 'ethnic_description_white', 'ethnic_description_asian',
    
    // Income
    'commercialdata_estimatedhhincome_under_25k', 'commercialdata_estimatedhhincome_25k_50k', 'commercialdata_estimatedhhincome_50k_75k', 'commercialdata_estimatedhhincome_75k_100k', 'commercialdata_estimatedhhincome_over_100k',
    
    // Consumer Data
    'consumerdata_auto_make_ford', 'consumerdata_auto_make_toyota', 'consumerdata_auto_make_honda', 'consumerdata_auto_make_chevrolet', 'consumerdata_auto_make_nissan',
    
    // Migration
    'voters_movedfrom_state_ca', 'voters_movedfrom_state_ny', 'voters_movedfrom_state_tx', 'voters_movedfrom_state_fl',
    
    // Political (sample)
    'hs_trump_approval_supporter', 'hs_trump_approval_opposer', 'hs_biden_approval_supporter', 'hs_biden_approval_opposer'
  ];
  
  const results: FilterDiagnosticResult[] = [];
  
  for (const filterId of allFilterIds) {
    const result = await testSingleFilter(filterId);
    results.push(result);
  }
  
  const workingFilters = results.filter(r => r.hasData).length;
  const brokenFilters = results.filter(r => !r.hasData).length;
  
  const summary = `Tested ${results.length} filters: ${workingFilters} working, ${brokenFilters} broken`;
  
  console.log(`\n📊 DIAGNOSTIC SUMMARY: ${summary}\n`);
  
  return {
    totalFilters: results.length,
    workingFilters,
    brokenFilters,
    results,
    summary
  };
}

/**
 * Generate detailed diagnostic report
 */
export function generateDiagnosticReport(results: FilterDiagnosticResult[]): string {
  let report = '# FILTER DIAGNOSTIC REPORT\n\n';
  
  const working = results.filter(r => r.hasData);
  const broken = results.filter(r => !r.hasData);
  
  report += `## Summary\n`;
  report += `- Total Filters: ${results.length}\n`;
  report += `- Working: ${working.length}\n`;
  report += `- Broken: ${broken.length}\n\n`;
  
  if (broken.length > 0) {
    report += `## Broken Filters (${broken.length})\n\n`;
    
    broken.forEach(result => {
      report += `### ${result.filterId}\n`;
      report += `- Taxonomy: ${result.taxonomy}\n`;
      report += `- Expected Segments: ${Array.isArray(result.segmentMapping) ? result.segmentMapping.join(', ') : result.segmentMapping}\n`;
      report += `- CSV Segments: ${result.csvSegments.slice(0, 5).join(', ')}${result.csvSegments.length > 5 ? '...' : ''}\n`;
      report += `- Match Status: ${result.matchStatus}\n`;
      report += `- Issues:\n`;
      result.issues.forEach(issue => {
        report += `  - ${issue}\n`;
      });
      report += `\n`;
    });
  }
  
  return report;
}
