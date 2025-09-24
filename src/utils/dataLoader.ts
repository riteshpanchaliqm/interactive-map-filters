export interface VoterData {
  state_code: string;
  taxonomy: string;
  segment: number;
  population_pct: number;
}

export interface TaxonomyInfo {
  name: string;
  count: number;
  category: string;
}

export interface FilterCategory {
  id: string;
  title: string;
  icon: string;
  sections: FilterSection[];
}

export interface FilterSection {
  title: string;
  items: FilterItem[];
  searchable?: boolean;
}

export interface FilterItem {
  id: string;
  label: string;
  taxonomy?: string;
  segment?: number;
  category?: string;
}

export interface AnalysisResult {
  totalPopulation: number;
  matchingPopulation: number;
  percentage: number;
  stateBreakdown: StateBreakdown[];
}

export interface StateBreakdown {
  state: string;
  population: number;
  matchingPopulation: number;
  percentage: number;
}

// State population data (approximate 2020 census data)
const STATE_POPULATIONS: Record<string, number> = {
  'CA': 39538223, 'TX': 29145505, 'FL': 21538187, 'NY': 19453561,
  'PA': 12801989, 'IL': 12671821, 'OH': 11799448, 'GA': 10711908,
  'NC': 10439388, 'MI': 10037261, 'NJ': 9288994, 'VA': 8631393,
  'WA': 7705281, 'AZ': 7151502, 'MA': 7029917, 'TN': 6910840,
  'IN': 6785528, 'MO': 6154913, 'MD': 6177224, 'WI': 5893718,
  'CO': 5773714, 'MN': 5706494, 'SC': 5118425, 'AL': 5024279,
  'LA': 4657757, 'KY': 4505836, 'OR': 4237256, 'OK': 3959353,
  'CT': 3605944, 'UT': 3271616, 'IA': 3190369, 'NV': 3104614,
  'AR': 3011524, 'MS': 2961279, 'KS': 2937880, 'NM': 2117522,
  'NE': 1961504, 'WV': 1793716, 'ID': 1839106, 'HI': 1455271,
  'NH': 1377529, 'ME': 1344212, 'RI': 1097379, 'MT': 1084225,
  'DE': 989948, 'SD': 886667, 'ND': 779094, 'AK': 733391,
  'VT': 643077, 'WY': 576851, 'DC': 689545
};

// Taxonomy categories mapping
const TAXONOMY_CATEGORIES: Record<string, string> = {
  'hs_': 'Political Attitudes',
  'consumerdata_': 'Consumer Data',
  'commercialdata_': 'Commercial Data',
  'hamlet_': 'Geographic Areas',
  'unified_school_district': 'Education',
  'town_district': 'Geographic Areas',
  'county_legislative_district': 'Political Districts',
  'village': 'Geographic Areas',
  'city': 'Geographic Areas'
};

import { FILTER_CATALOG, getFilterByTaxonomy, getAllTaxonomies } from './filterCatalog';
import { analyzeCSVData, CSVAnalysisResult } from './csvAnalyzer';
import { applyEstimationLogic, EstimationResult } from './estimationLogic';

export class VoterDataLoader {
  private data: VoterData[] = [];
  private taxonomies: TaxonomyInfo[] = [];
  private csvAnalysis: CSVAnalysisResult | null = null;
  private debugMode: boolean = true;

  async loadData(): Promise<void> {
    try {
      console.log('Loading voter data from CSV...');
      const response = await fetch('/Data/wycany.csv');
      
      if (!response.ok) {
        throw new Error(`Failed to load CSV: ${response.status} ${response.statusText}`);
      }
      
      const csvText = await response.text();
      console.log('CSV loaded, parsing data...');
      
      this.data = this.parseCSV(csvText);
      console.log(`Parsed ${this.data.length} voter data records`);
      
      this.taxonomies = this.extractTaxonomies();
      console.log(`Extracted ${this.taxonomies.length} taxonomies`);
      
      // Analyze CSV data for accurate cataloging
      this.csvAnalysis = await analyzeCSVData();
      console.log('CSV Analysis completed:', this.csvAnalysis);
    } catch (error) {
      console.error('Error loading voter data:', error);
      throw error;
    }
  }

  private parseCSV(csvText: string): VoterData[] {
    const lines = csvText.split('\n');
    const data: VoterData[] = [];
    
    console.log(`Processing ${lines.length} lines from CSV`);
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      // Handle CSV parsing more robustly
      const columns = line.split(',');
      if (columns.length >= 4) {
        const [state_code, taxonomy, segment, population_pct] = columns;
        
        if (state_code && taxonomy && segment && population_pct) {
          const parsedSegment = parseInt(segment);
          const parsedPct = parseFloat(population_pct);
          
          if (!isNaN(parsedSegment) && !isNaN(parsedPct)) {
            data.push({
              state_code: state_code.trim(),
              taxonomy: taxonomy.trim(),
              segment: parsedSegment,
              population_pct: parsedPct
            });
          }
        }
      }
    }
    
    console.log(`Successfully parsed ${data.length} valid records`);
    return data;
  }

  private extractTaxonomies(): TaxonomyInfo[] {
    const taxonomyMap = new Map<string, number>();
    
    this.data.forEach(row => {
      const taxonomy = row.taxonomy;
      taxonomyMap.set(taxonomy, (taxonomyMap.get(taxonomy) || 0) + 1);
    });
    
    return Array.from(taxonomyMap.entries())
      .map(([name, count]) => ({
        name,
        count,
        category: this.getTaxonomyCategory(name)
      }))
      .sort((a, b) => b.count - a.count);
  }

  private getTaxonomyCategory(taxonomy: string): string {
    for (const [prefix, category] of Object.entries(TAXONOMY_CATEGORIES)) {
      if (taxonomy.startsWith(prefix)) {
        return category;
      }
    }
    return 'Other';
  }

  getFilterCategories(): FilterCategory[] {
    // Use the comprehensive filter catalog
    return FILTER_CATALOG;
  }
  
  // Get enhanced filter categories with actual data counts
  getEnhancedFilterCategories(): FilterCategory[] {
    if (!this.csvAnalysis) {
      return FILTER_CATALOG;
    }
    
    // Enhance the catalog with actual data from CSV analysis
    return FILTER_CATALOG.map(category => ({
      ...category,
      sections: category.sections.map(section => ({
        ...section,
        items: section.items.map(item => {
          // Find matching taxonomy in CSV analysis
          const taxonomyData = this.csvAnalysis?.taxonomies.find(t => t.taxonomy === item.taxonomy);
          if (taxonomyData) {
            return {
              ...item,
              count: taxonomyData.count,
              states: taxonomyData.states
            };
          }
          return item;
        })
      }))
    }));
  }

  private getCategoryIcon(category: string): string {
    const iconMap: Record<string, string> = {
      'Political Attitudes': '🗳️',
      'Consumer Data': '💰',
      'Commercial Data': '🏢',
      'Geographic Areas': '🗺️',
      'Education': '🎓',
      'Political Districts': '🏛️',
      'Other': '📊'
    };
    return iconMap[category] || '📊';
  }

  private getSectionTitle(taxonomy: string): string {
    if (taxonomy.startsWith('hs_')) {
      return 'Political Attitudes';
    } else if (taxonomy.includes('income')) {
      return 'Income Data';
    } else if (taxonomy.includes('district')) {
      return 'Districts';
    } else if (taxonomy.includes('school')) {
      return 'Education';
    } else if (taxonomy.includes('hamlet') || taxonomy.includes('city') || taxonomy.includes('village')) {
      return 'Geographic Areas';
    }
    return 'Other';
  }

  private formatTaxonomyLabel(taxonomy: string): string {
    return taxonomy
      .replace(/hs_/g, '')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }

  analyzeFilters(selectedFilters: Set<string>): AnalysisResult {
    if (selectedFilters.size === 0) {
      return {
        totalPopulation: 0,
        matchingPopulation: 0,
        percentage: 0,
        stateBreakdown: []
      };
    }

    console.log(`Analyzing ${selectedFilters.size} selected filters using estimation logic`);
    
    // Use the new estimation logic that follows the taxonomy reference guide
    const estimationResult = applyEstimationLogic(this.data, selectedFilters);
    
    console.log(`Estimation complete: ${estimationResult.matchingPopulation.toLocaleString()} matching population out of ${estimationResult.totalPopulation.toLocaleString()} total`);

    return estimationResult;
  }

  private extractTaxonomyFromFilterId(filterId: string): string | null {
    // Handle different filter ID formats
    if (filterId.startsWith('state-')) {
      return null; // Skip state filters for now
    }
    
    // Try to find taxonomy in the filter categories
    for (const category of this.getFilterCategories()) {
      for (const section of category.sections) {
        for (const item of section.items) {
          if (item.id === filterId && item.taxonomy) {
            return item.taxonomy;
          }
        }
      }
    }
    
    return null;
  }

  getData(): VoterData[] {
    return this.data;
  }

  getTaxonomies(): TaxonomyInfo[] {
    return this.taxonomies;
  }
}

export const voterDataLoader = new VoterDataLoader();
