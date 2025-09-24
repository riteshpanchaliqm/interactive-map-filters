import React, { useState, useEffect } from 'react';
import { FilterSidebar } from './components/FilterSidebar';
import { MapView } from './components/MapView';
import { voterDataLoader, AnalysisResult } from './utils/dataLoader';

export default function App() {
  const [selectedFilters, setSelectedFilters] = useState<Set<string>>(new Set());
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | undefined>();
  const [loading, setLoading] = useState(false);

  const handleFilterChange = (filterId: string, checked: boolean) => {
    const newFilters = new Set(selectedFilters);
    if (checked) {
      newFilters.add(filterId);
    } else {
      newFilters.delete(filterId);
    }
    setSelectedFilters(newFilters);
  };

  const handleReset = () => {
    setSelectedFilters(new Set());
    setAnalysisResult(undefined);
  };

  const handleApply = async () => {
    if (selectedFilters.size === 0) {
      setAnalysisResult(undefined);
      return;
    }

    setLoading(true);
    try {
      const result = voterDataLoader.analyzeFilters(selectedFilters);
      setAnalysisResult(result);
    } catch (error) {
      console.error('Error analyzing filters:', error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-apply analysis when filters change
  useEffect(() => {
    if (selectedFilters.size > 0) {
      console.log('Filters changed, scheduling analysis...', Array.from(selectedFilters));
      const timeoutId = setTimeout(() => {
        console.log('Executing analysis...');
        handleApply();
      }, 500); // Debounce analysis

      return () => clearTimeout(timeoutId);
    } else {
      setAnalysisResult(undefined);
    }
  }, [selectedFilters]);

  return (
    <div className="h-screen w-full flex bg-background">
      <FilterSidebar
        selectedFilters={selectedFilters}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
        onApply={handleApply}
        analysisResult={analysisResult}
      />
      <MapView 
        selectedFilters={selectedFilters} 
        analysisResult={analysisResult}
      />
    </div>
  );
}