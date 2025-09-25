// CSV Data Analyzer - Extracts and analyzes the actual CSV data
// This utility analyzes the wycany.csv file to create accurate filter catalogs

export interface TaxonomyAnalysis {
  taxonomy: string;
  count: number;
  states: string[];
  segments: number[];
  avgPopulationPct: number;
  maxPopulationPct: number;
  minPopulationPct: number;
}

export interface StateAnalysis {
  state: string;
  totalRecords: number;
  uniqueTaxonomies: number;
  totalPopulationPct: number;
}

export interface CSVAnalysisResult {
  totalRecords: number;
  uniqueTaxonomies: number;
  states: StateAnalysis[];
  taxonomies: TaxonomyAnalysis[];
  taxonomyCategories: Record<string, TaxonomyAnalysis[]>;
}

// Analyze the CSV data to extract taxonomy information
export async function analyzeCSVData(): Promise<CSVAnalysisResult> {
  try {
    const response = await fetch('/wycany.csv');
    const csvText = await response.text();
    
    const lines = csvText.split('\n');
    const records = [];
    
    // Parse CSV data
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const columns = line.split(',');
      if (columns.length >= 4) {
        const [state_code, taxonomy, segment, population_pct] = columns;
        
        if (state_code && taxonomy && segment && population_pct) {
          const parsedSegment = parseInt(segment);
          const parsedPct = parseFloat(population_pct);
          
          if (!isNaN(parsedSegment) && !isNaN(parsedPct)) {
            records.push({
              state_code: state_code.trim(),
              taxonomy: taxonomy.trim(),
              segment: parsedSegment,
              population_pct: parsedPct
            });
          }
        }
      }
    }
    
    console.log(`Analyzed ${records.length} records from CSV`);
    
    // Analyze taxonomies
    const taxonomyMap = new Map<string, {
      count: number;
      states: Set<string>;
      segments: Set<number>;
      populationPcts: number[];
    }>();
    
    // Analyze states
    const stateMap = new Map<string, {
      totalRecords: number;
      uniqueTaxonomies: Set<string>;
      totalPopulationPct: number;
    }>();
    
    records.forEach(record => {
      // Taxonomy analysis
      if (!taxonomyMap.has(record.taxonomy)) {
        taxonomyMap.set(record.taxonomy, {
          count: 0,
          states: new Set(),
          segments: new Set(),
          populationPcts: []
        });
      }
      
      const taxonomyData = taxonomyMap.get(record.taxonomy)!;
      taxonomyData.count++;
      taxonomyData.states.add(record.state_code);
      taxonomyData.segments.add(record.segment);
      taxonomyData.populationPcts.push(record.population_pct);
      
      // State analysis
      if (!stateMap.has(record.state_code)) {
        stateMap.set(record.state_code, {
          totalRecords: 0,
          uniqueTaxonomies: new Set(),
          totalPopulationPct: 0
        });
      }
      
      const stateData = stateMap.get(record.state_code)!;
      stateData.totalRecords++;
      stateData.uniqueTaxonomies.add(record.taxonomy);
      stateData.totalPopulationPct += record.population_pct;
    });
    
    // Convert to analysis results
    const taxonomies: TaxonomyAnalysis[] = Array.from(taxonomyMap.entries()).map(([taxonomy, data]) => ({
      taxonomy,
      count: data.count,
      states: Array.from(data.states),
      segments: Array.from(data.segments),
      avgPopulationPct: data.populationPcts.reduce((a, b) => a + b, 0) / data.populationPcts.length,
      maxPopulationPct: Math.max(...data.populationPcts),
      minPopulationPct: Math.min(...data.populationPcts)
    })).sort((a, b) => b.count - a.count);
    
    const states: StateAnalysis[] = Array.from(stateMap.entries()).map(([state, data]) => ({
      state,
      totalRecords: data.totalRecords,
      uniqueTaxonomies: data.uniqueTaxonomies.size,
      totalPopulationPct: data.totalPopulationPct
    })).sort((a, b) => b.totalRecords - a.totalRecords);
    
    // Categorize taxonomies
    const taxonomyCategories: Record<string, TaxonomyAnalysis[]> = {};
    
    taxonomies.forEach(taxonomy => {
      const category = categorizeTaxonomy(taxonomy.taxonomy);
      if (!taxonomyCategories[category]) {
        taxonomyCategories[category] = [];
      }
      taxonomyCategories[category].push(taxonomy);
    });
    
    return {
      totalRecords: records.length,
      uniqueTaxonomies: taxonomies.length,
      states,
      taxonomies,
      taxonomyCategories
    };
    
  } catch (error) {
    console.error('Error analyzing CSV data:', error);
    throw error;
  }
}

// Categorize taxonomy based on its name
function categorizeTaxonomy(taxonomy: string): string {
  const lowerTaxonomy = taxonomy.toLowerCase();
  
  if (lowerTaxonomy.includes('hs_')) {
    if (lowerTaxonomy.includes('israel') || lowerTaxonomy.includes('military') || lowerTaxonomy.includes('foreign')) {
      return 'Foreign Policy';
    }
    if (lowerTaxonomy.includes('ideology') || lowerTaxonomy.includes('fiscal') || lowerTaxonomy.includes('conserv')) {
      return 'Political Ideology';
    }
    if (lowerTaxonomy.includes('voting') || lowerTaxonomy.includes('fraud') || lowerTaxonomy.includes('democracy')) {
      return 'Democracy & Voting';
    }
    if (lowerTaxonomy.includes('gun') || lowerTaxonomy.includes('crime') || lowerTaxonomy.includes('safety')) {
      return 'Public Safety';
    }
    if (lowerTaxonomy.includes('union') || lowerTaxonomy.includes('labor') || lowerTaxonomy.includes('worker')) {
      return 'Labor & Unions';
    }
    if (lowerTaxonomy.includes('tv') || lowerTaxonomy.includes('news') || lowerTaxonomy.includes('media')) {
      return 'Media & News';
    }
    if (lowerTaxonomy.includes('science') || lowerTaxonomy.includes('trust')) {
      return 'Science & Trust';
    }
    if (lowerTaxonomy.includes('trump') || lowerTaxonomy.includes('harris') || lowerTaxonomy.includes('election')) {
      return 'Elections & Candidates';
    }
    if (lowerTaxonomy.includes('tribalism') || lowerTaxonomy.includes('team')) {
      return 'Political Identity';
    }
    if (lowerTaxonomy.includes('wealth') || lowerTaxonomy.includes('income') || lowerTaxonomy.includes('economic')) {
      return 'Economic Views';
    }
    if (lowerTaxonomy.includes('alien') || lowerTaxonomy.includes('conspiracy') || lowerTaxonomy.includes('disclosure')) {
      return 'Conspiracy Theories';
    }
    return 'Political Views';
  }
  
  if (lowerTaxonomy.includes('consumerdata') || lowerTaxonomy.includes('commercialdata')) {
    return 'Economic Data';
  }
  
  if (lowerTaxonomy.includes('hamlet') || lowerTaxonomy.includes('district') || lowerTaxonomy.includes('city') || lowerTaxonomy.includes('village')) {
    return 'Geographic Areas';
  }
  
  return 'Other';
}

// Get taxonomy statistics
export function getTaxonomyStats(taxonomies: TaxonomyAnalysis[]): {
  totalTaxonomies: number;
  topTaxonomies: TaxonomyAnalysis[];
  categories: Record<string, number>;
} {
  const topTaxonomies = taxonomies.slice(0, 20);
  
  const categories: Record<string, number> = {};
  taxonomies.forEach(taxonomy => {
    const category = categorizeTaxonomy(taxonomy.taxonomy);
    categories[category] = (categories[category] || 0) + 1;
  });
  
  return {
    totalTaxonomies: taxonomies.length,
    topTaxonomies,
    categories
  };
}

// Export taxonomy data for filter generation
export function exportTaxonomyData(analysis: CSVAnalysisResult): {
  taxonomies: Array<{
    taxonomy: string;
    count: number;
    states: string[];
    category: string;
  }>;
  categories: Record<string, string[]>;
} {
  const taxonomies = analysis.taxonomies.map(t => ({
    taxonomy: t.taxonomy,
    count: t.count,
    states: t.states,
    category: categorizeTaxonomy(t.taxonomy)
  }));
  
  const categories: Record<string, string[]> = {};
  taxonomies.forEach(t => {
    if (!categories[t.category]) {
      categories[t.category] = [];
    }
    categories[t.category].push(t.taxonomy);
  });
  
  return { taxonomies, categories };
}
