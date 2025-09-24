import React, { useState, useEffect } from 'react';
import { Search, ChevronRight, Filter, X } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { voterDataLoader, FilterCategory, AnalysisResult } from '../utils/dataLoader';


interface FilterSidebarProps {
  selectedFilters: Set<string>;
  onFilterChange: (filterId: string, checked: boolean) => void;
  onReset: () => void;
  onApply: () => void;
  analysisResult?: AnalysisResult;
}

export function FilterSidebar({ selectedFilters, onFilterChange, onReset, onApply, analysisResult }: FilterSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sectionSearchTerms, setSectionSearchTerms] = useState<Record<string, string>>({});
  const [filterCategories, setFilterCategories] = useState<FilterCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
        try {
          await voterDataLoader.loadData();
          const categories = await voterDataLoader.getEnhancedFilterCategories();
        
        // Use the categories directly from the finalized catalog (includes Area Selection)
        setFilterCategories(categories);
        setLoading(false);
      } catch (error) {
        console.error('Error loading filter categories:', error);
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const updateSectionSearch = (sectionKey: string, term: string) => {
    setSectionSearchTerms(prev => ({
      ...prev,
      [sectionKey]: term
    }));
  };

  const filteredCategories = filterCategories.filter(category =>
    category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.sections.some(section =>
      section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.items.some(item => item.label.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  );

  if (loading) {
    return (
      <div className="w-80 bg-white border-r border-border flex flex-col h-full">
        <div className="p-4 border-b border-border">
          <h2 className="mb-4">Filters</h2>
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading voter data...</p>
              <p className="text-xs text-muted-foreground mt-1">Parsing 137K+ records</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-r border-border flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </h2>
          {selectedFilters.size > 0 && (
            <Badge variant="default" className="bg-blue-600">
              {selectedFilters.size} selected
            </Badge>
          )}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search by Filter Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          <Accordion type="multiple" className="space-y-2">
            {filteredCategories.map((category) => (
              <AccordionItem key={category.id} value={category.id} className="border border-border rounded-lg">
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{category.icon}</span>
                    <span>{category.title}</span>
                    <Badge variant="secondary" className="ml-auto">
                      {category.sections.reduce((total, section) => total + section.items.length, 0)}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-4">
                    {category.sections.map((section, sectionIndex) => {
                      const sectionKey = `${category.id}-${sectionIndex}`;
                      const sectionSearchTerm = sectionSearchTerms[sectionKey] || '';
                      
                      const filteredItems = section.items.filter(item =>
                        item.label.toLowerCase().includes(sectionSearchTerm.toLowerCase())
                      );

                      return (
                        <div key={sectionIndex} className="space-y-2">
                          <h4 className="text-sm font-medium text-muted-foreground">{section.title}</h4>
                          
                          {section.searchable && (
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-3 h-3" />
                              <Input
                                placeholder={`Search ${section.title}`}
                                value={sectionSearchTerm}
                                onChange={(e) => updateSectionSearch(sectionKey, e.target.value)}
                                className="pl-8 h-8 text-sm"
                              />
                            </div>
                          )}
                          
                          <div className="max-h-48 overflow-y-auto space-y-2">
                            {filteredItems.map((item, itemIndex) => {
                              const filterId = item.id;
                              return (
                                <div key={itemIndex} className="flex items-center space-x-2">
                                  <Checkbox
                                    id={filterId}
                                    checked={selectedFilters.has(filterId)}
                                    onCheckedChange={(checked) => 
                                      onFilterChange(filterId, checked as boolean)
                                    }
                                  />
                                  <label
                                    htmlFor={filterId}
                                    className="text-sm cursor-pointer flex-1"
                                  >
                                    {item.label}
                                  </label>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </ScrollArea>

      {/* Sample Filter Presets */}
      <div className="p-4 border-t border-border bg-gray-50">
        <h3 className="text-sm font-medium mb-2">Quick Filters</h3>
        <div className="space-y-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-xs"
            onClick={() => {
              // Add some sample political attitude filters
              const sampleFilters = new Set(selectedFilters);
              sampleFilters.add('Political Attitudes-hs_gun_control_support');
              sampleFilters.add('Political Attitudes-hs_ideology_fiscal_conserv');
              onFilterChange('Political Attitudes-hs_gun_control_support', true);
              onFilterChange('Political Attitudes-hs_ideology_fiscal_conserv', true);
            }}
          >
            Gun Control + Fiscal Conservative
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full text-xs"
            onClick={() => {
              // Add some sample consumer data filters
              const sampleFilters = new Set(selectedFilters);
              sampleFilters.add('Consumer Data-consumerdata_estimated_income_amount');
              onFilterChange('Consumer Data-consumerdata_estimated_income_amount', true);
            }}
          >
            High Income Voters
          </Button>
        </div>
      </div>

      {/* Analysis Results Summary */}
      {analysisResult && analysisResult.totalPopulation > 0 && (
        <div className="p-4 border-t border-border bg-blue-50">
          <h3 className="text-sm font-medium mb-2">Analysis Results</h3>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span>Total Population:</span>
              <span className="font-medium">{analysisResult.totalPopulation.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Matching Population:</span>
              <span className="font-medium text-blue-600">{analysisResult.matchingPopulation.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Percentage:</span>
              <span className="font-medium text-blue-600">{analysisResult.percentage.toFixed(2)}%</span>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 border-t border-border flex gap-2">
        <Button variant="outline" onClick={onReset} className="flex-1">
          Reset
        </Button>
        <Button onClick={onApply} className="flex-1">
          Apply
        </Button>
      </div>
    </div>
  );
}