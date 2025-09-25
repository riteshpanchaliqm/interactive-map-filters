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

  const handleClearAll = () => {
    setSelectedFilters(new Set());
    setAnalysisResult(undefined);
  };



  // Auto-apply analysis when filters change
  useEffect(() => {
    if (selectedFilters.size > 0) {
      console.log('Filters changed, scheduling analysis...', Array.from(selectedFilters));
      const timeoutId = setTimeout(async () => {
        console.log('Executing analysis...');
        setLoading(true);
        try {
          const result = await voterDataLoader.analyzeFilters(selectedFilters);
          setAnalysisResult(result);
        } catch (error) {
          console.error('Error analyzing filters:', error);
        } finally {
          setLoading(false);
        }
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
        onClearAll={handleClearAll}
        analysisResult={analysisResult}
      />
      <MapView 
        selectedFilters={selectedFilters} 
        analysisResult={analysisResult}
      />
      
    </div>
  );
}