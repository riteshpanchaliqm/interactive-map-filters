/**
 * FILTER VERIFICATION SYSTEM
 * 
 * This system tests all filters to ensure they have proper data sources and calculations.
 */

import { generateCatalogingReport, getFilterDataMapping } from './filterCataloging';
import { isCalculatedFilter, getCalculatedFilter } from './calculatedFilters';

export interface FilterTestResult {
  filterId: string;
  status: 'pass' | 'fail' | 'warning';
  issues: string[];
  dataSource: string;
  calculationMethod: string;
}

export interface VerificationReport {
  totalFilters: number;
  passedFilters: number;
  failedFilters: number;
  warningFilters: number;
  testResults: FilterTestResult[];
  summary: string;
}

/**
 * Test all filters in the catalog
 */
export function verifyAllFilters(): VerificationReport {
  const catalogingReport = generateCatalogingReport();
  const testResults: FilterTestResult[] = [];
  
  // Test each filter mapping
  catalogingReport.filterMappings.forEach(mapping => {
    const result = testFilter(mapping.filterId);
    testResults.push(result);
  });
  
  const passedFilters = testResults.filter(r => r.status === 'pass').length;
  const failedFilters = testResults.filter(r => r.status === 'fail').length;
  const warningFilters = testResults.filter(r => r.status === 'warning').length;
  
  const summary = `Verified ${catalogingReport.totalFilters} filters: ${passedFilters} passed, ${failedFilters} failed, ${warningFilters} warnings`;
  
  return {
    totalFilters: catalogingReport.totalFilters,
    passedFilters,
    failedFilters,
    warningFilters,
    testResults,
    summary
  };
}

/**
 * Test a single filter
 */
function testFilter(filterId: string): FilterTestResult {
  const issues: string[] = [];
  let status: 'pass' | 'fail' | 'warning' = 'pass';
  
  // Get filter mapping
  const mapping = getFilterDataMapping(filterId);
  if (!mapping) {
    issues.push('No data mapping found');
    return {
      filterId,
      status: 'fail',
      issues,
      dataSource: 'unknown',
      calculationMethod: 'unknown'
    };
  }
  
  // Check if filter has verified data
  if (mapping.validationStatus !== 'verified') {
    issues.push(`Validation status: ${mapping.validationStatus}`);
    status = 'warning';
  }
  
  // Check if it's a calculated filter
  if (mapping.dataSource === 'calculated') {
    if (!isCalculatedFilter(filterId)) {
      issues.push('Marked as calculated but not in calculated filters system');
      status = 'fail';
    } else {
      const calculatedFilter = getCalculatedFilter(filterId);
      if (!calculatedFilter) {
        issues.push('Calculated filter definition missing');
        status = 'fail';
      } else if (calculatedFilter.sourceSegments.length === 0) {
        issues.push('No source segments defined for calculated filter');
        status = 'fail';
      }
    }
  }
  
  // Check source segments
  if (mapping.sourceSegments.length === 0) {
    issues.push('No source segments defined');
    status = 'fail';
  }
  
  return {
    filterId,
    status,
    issues,
    dataSource: mapping.dataSource,
    calculationMethod: mapping.calculationMethod
  };
}

/**
 * Get filters that need attention
 */
export function getFiltersNeedingAttention(): FilterTestResult[] {
  const report = verifyAllFilters();
  return report.testResults.filter(result => 
    result.status === 'fail' || result.status === 'warning'
  );
}

/**
 * Generate detailed verification report
 */
export function generateDetailedReport(): string {
  const report = verifyAllFilters();
  const attentionFilters = getFiltersNeedingAttention();
  
  let output = `# FILTER VERIFICATION REPORT\n\n`;
  output += `## Summary\n`;
  output += `${report.summary}\n\n`;
  
  if (attentionFilters.length > 0) {
    output += `## Filters Needing Attention (${attentionFilters.length})\n\n`;
    
    attentionFilters.forEach(filter => {
      output += `### ${filter.filterId}\n`;
      output += `- Status: ${filter.status}\n`;
      output += `- Data Source: ${filter.dataSource}\n`;
      output += `- Calculation Method: ${filter.calculationMethod}\n`;
      output += `- Issues:\n`;
      filter.issues.forEach(issue => {
        output += `  - ${issue}\n`;
      });
      output += `\n`;
    });
  } else {
    output += `## All Filters Verified ✅\n\n`;
    output += `All ${report.totalFilters} filters have proper data sources and calculation logic.\n`;
  }
  
  return output;
}
