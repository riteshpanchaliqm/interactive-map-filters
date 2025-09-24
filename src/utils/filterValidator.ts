// Filter Validation Utility - Ensures filter alignment with CSV data
// This utility validates that all filters are properly aligned with the actual CSV data

import { FILTER_CATALOG } from './filterCatalog';
import { CSVAnalysisResult } from './csvAnalyzer';

export interface FilterValidationResult {
  isValid: boolean;
  totalFilters: number;
  validFilters: number;
  invalidFilters: number;
  missingTaxonomies: string[];
  extraTaxonomies: string[];
  alignmentScore: number;
  recommendations: string[];
}

export interface TaxonomyValidation {
  taxonomy: string;
  existsInCSV: boolean;
  existsInCatalog: boolean;
  count: number;
  states: string[];
  category: string;
}

// Validate filter alignment with CSV data
export function validateFilterAlignment(csvAnalysis: CSVAnalysisResult): FilterValidationResult {
  const catalogTaxonomies = new Set<string>();
  const csvTaxonomies = new Set<string>();
  
  // Extract taxonomies from catalog
  FILTER_CATALOG.forEach(category => {
    category.sections.forEach(section => {
      section.items.forEach(item => {
        catalogTaxonomies.add(item.taxonomy);
      });
    });
  });
  
  // Extract taxonomies from CSV analysis
  csvAnalysis.taxonomies.forEach(taxonomy => {
    csvTaxonomies.add(taxonomy.taxonomy);
  });
  
  // Find missing and extra taxonomies
  const missingTaxonomies = Array.from(csvTaxonomies).filter(t => !catalogTaxonomies.has(t));
  const extraTaxonomies = Array.from(catalogTaxonomies).filter(t => !csvTaxonomies.has(t));
  
  const totalFilters = catalogTaxonomies.size;
  const validFilters = totalFilters - extraTaxonomies.length;
  const invalidFilters = extraTaxonomies.length;
  const alignmentScore = (validFilters / totalFilters) * 100;
  
  const recommendations = [
    `Add ${missingTaxonomies.length} missing taxonomies to filter catalog`,
    `Remove ${extraTaxonomies.length} extra taxonomies from filter catalog`,
    `Improve alignment score from ${alignmentScore.toFixed(1)}% to 100%`,
    'Implement dynamic filter generation based on CSV analysis',
    'Add filter validation on data load',
    'Create filter update mechanism for new taxonomies'
  ];
  
  return {
    isValid: missingTaxonomies.length === 0 && extraTaxonomies.length === 0,
    totalFilters,
    validFilters,
    invalidFilters,
    missingTaxonomies,
    extraTaxonomies,
    alignmentScore,
    recommendations
  };
}

// Validate individual taxonomy
export function validateTaxonomy(taxonomy: string, csvAnalysis: CSVAnalysisResult): TaxonomyValidation {
  const csvTaxonomy = csvAnalysis.taxonomies.find(t => t.taxonomy === taxonomy);
  const catalogTaxonomy = FILTER_CATALOG
    .flatMap(category => category.sections)
    .flatMap(section => section.items)
    .find(item => item.taxonomy === taxonomy);
  
  return {
    taxonomy,
    existsInCSV: !!csvTaxonomy,
    existsInCatalog: !!catalogTaxonomy,
    count: csvTaxonomy?.count || 0,
    states: csvTaxonomy?.states || [],
    category: catalogTaxonomy?.category || 'Unknown'
  };
}

// Get comprehensive taxonomy validation report
export function getTaxonomyValidationReport(csvAnalysis: CSVAnalysisResult): TaxonomyValidation[] {
  const allTaxonomies = new Set<string>();
  
  // Collect all taxonomies from both sources
  csvAnalysis.taxonomies.forEach(t => allTaxonomies.add(t.taxonomy));
  FILTER_CATALOG.forEach(category => {
    category.sections.forEach(section => {
      section.items.forEach(item => {
        allTaxonomies.add(item.taxonomy);
      });
    });
  });
  
  return Array.from(allTaxonomies).map(taxonomy => 
    validateTaxonomy(taxonomy, csvAnalysis)
  ).sort((a, b) => b.count - a.count);
}

// Generate filter alignment report
export function generateFilterAlignmentReport(csvAnalysis: CSVAnalysisResult): {
  summary: {
    totalTaxonomies: number;
    catalogFilters: number;
    csvTaxonomies: number;
    alignmentScore: number;
  };
  categories: Array<{
    category: string;
    totalFilters: number;
    alignedFilters: number;
    missingFilters: string[];
    extraFilters: string[];
  }>;
  topTaxonomies: Array<{
    taxonomy: string;
    count: number;
    states: string[];
    inCatalog: boolean;
    category: string;
  }>;
} {
  const validation = validateFilterAlignment(csvAnalysis);
  
  // Group by category
  const categories = FILTER_CATALOG.map(category => {
    const categoryTaxonomies = new Set<string>();
    category.sections.forEach(section => {
      section.items.forEach(item => {
        categoryTaxonomies.add(item.taxonomy);
      });
    });
    
    const missingFilters = validation.missingTaxonomies.filter(t => 
      categoryTaxonomies.has(t) || category.sections.some(section => 
        section.items.some(item => item.taxonomy === t)
      )
    );
    
    const extraFilters = validation.extraTaxonomies.filter(t => 
      categoryTaxonomies.has(t)
    );
    
    return {
      category: category.title,
      totalFilters: categoryTaxonomies.size,
      alignedFilters: categoryTaxonomies.size - extraFilters.length,
      missingFilters,
      extraFilters
    };
  });
  
  // Get top taxonomies
  const topTaxonomies = csvAnalysis.taxonomies
    .slice(0, 20)
    .map(taxonomy => ({
      taxonomy: taxonomy.taxonomy,
      count: taxonomy.count,
      states: taxonomy.states,
      inCatalog: FILTER_CATALOG.some(category => 
        category.sections.some(section => 
          section.items.some(item => item.taxonomy === taxonomy.taxonomy)
        )
      ),
      category: 'Unknown' // Would need to determine from catalog
    }));
  
  return {
    summary: {
      totalTaxonomies: csvAnalysis.uniqueTaxonomies,
      catalogFilters: validation.totalFilters,
      csvTaxonomies: csvAnalysis.taxonomies.length,
      alignmentScore: validation.alignmentScore
    },
    categories,
    topTaxonomies
  };
}

// Export validation report as JSON
export function exportValidationReport(csvAnalysis: CSVAnalysisResult): string {
  const report = generateFilterAlignmentReport(csvAnalysis);
  return JSON.stringify(report, null, 2);
}
