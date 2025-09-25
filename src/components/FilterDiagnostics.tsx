import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { testAllFilters, generateDiagnosticReport, FilterDiagnosticResult } from '../utils/filterDiagnostics';

export function FilterDiagnostics() {
  const [results, setResults] = useState<FilterDiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [report, setReport] = useState('');

  const runDiagnostics = async () => {
    setIsRunning(true);
    try {
      const diagnosticReport = await testAllFilters();
      setResults(diagnosticReport.results);
      setReport(generateDiagnosticReport(diagnosticReport.results));
    } catch (error) {
      console.error('Diagnostic error:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const workingFilters = results.filter(r => r.hasData);
  const brokenFilters = results.filter(r => !r.hasData);

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Filter Diagnostics</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={runDiagnostics} disabled={isRunning}>
            {isRunning ? 'Running Diagnostics...' : 'Run Filter Diagnostics'}
          </Button>
          
          {results.length > 0 && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{workingFilters.length}</div>
                  <div className="text-sm text-gray-600">Working Filters</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{brokenFilters.length}</div>
                  <div className="text-sm text-gray-600">Broken Filters</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{results.length}</div>
                  <div className="text-sm text-gray-600">Total Filters</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {brokenFilters.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Broken Filters ({brokenFilters.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {brokenFilters.map((result, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{result.filterId}</h3>
                    <Badge variant="destructive">Broken</Badge>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div><strong>Taxonomy:</strong> {result.taxonomy}</div>
                    <div><strong>Expected:</strong> {Array.isArray(result.segmentMapping) ? result.segmentMapping.join(', ') : result.segmentMapping}</div>
                    <div><strong>Available:</strong> {result.csvSegments.slice(0, 5).join(', ')}{result.csvSegments.length > 5 ? '...' : ''}</div>
                    <div><strong>Match Status:</strong> {result.matchStatus}</div>
                  </div>
                  {result.issues.length > 0 && (
                    <div className="mt-2">
                      <div className="text-sm font-medium text-red-600">Issues:</div>
                      <ul className="text-sm text-red-600 list-disc list-inside">
                        {result.issues.map((issue, i) => (
                          <li key={i}>{issue}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {workingFilters.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">Working Filters ({workingFilters.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {workingFilters.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded">
                  <span className="text-sm font-medium">{result.filterId}</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {result.dataCount} records
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {report && (
        <Card>
          <CardHeader>
            <CardTitle>Detailed Report</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto max-h-96">
              {report}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
