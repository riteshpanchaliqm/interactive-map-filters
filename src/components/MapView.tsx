import React, { useState, useEffect, useRef } from 'react';
import { Map, BarChart3, MapPin, Users, TrendingUp, Target } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { AnalysisResult, StateBreakdown } from '../utils/dataLoader';
import realStatesGeoJSON from '../data/realStatesGeoJSON.json';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

// Mock regional data for visualization
const mockRegions = [
  {
    id: 'california',
    name: 'California',
    position: { top: '45%', left: '8%' },
    size: 'large',
    population: 39538223,
    audienceSize: 'Large',
    potentialReach: '92.1M (5%)'
  },
  {
    id: 'texas',
    name: 'Texas',
    position: { top: '65%', left: '35%' },
    size: 'large',
    population: 29145505,
    audienceSize: 'Large',
    potentialReach: '78.3M (4%)'
  },
  {
    id: 'new-york',
    name: 'New York',
    position: { top: '25%', left: '78%' },
    size: 'medium',
    population: 19453561,
    audienceSize: 'Moderate',
    potentialReach: '45.2M (3%)'
  },
  {
    id: 'florida',
    name: 'Florida',
    position: { top: '75%', left: '75%' },
    size: 'medium',
    population: 21538187,
    audienceSize: 'Moderate',
    potentialReach: '52.8M (3%)'
  },
  {
    id: 'illinois',
    name: 'Illinois',
    position: { top: '35%', left: '55%' },
    size: 'medium',
    population: 12671821,
    audienceSize: 'Moderate',
    potentialReach: '38.2M (2%)'
  },
  {
    id: 'pennsylvania',
    name: 'Pennsylvania',
    position: { top: '30%', left: '72%' },
    size: 'small',
    population: 12801989,
    audienceSize: 'Small',
    potentialReach: '28.5M (2%)'
  }
];

const mockCityData = [
  {
    id: 1,
    name: "San Francisco",
    position: { top: '42%', left: '5%' },
    potentialReach: "82.1M (5%)",
    audienceSize: "Moderate"
  },
  {
    id: 2,
    name: "Los Angeles",
    position: { top: '55%', left: '10%' },
    potentialReach: "95.3M (6%)",
    audienceSize: "Large"
  },
  {
    id: 3,
    name: "Las Vegas",
    position: { top: '50%', left: '15%' },
    potentialReach: "45.7M (3%)",
    audienceSize: "Moderate"
  },
  {
    id: 4,
    name: "San Diego",
    position: { top: '65%', left: '8%' },
    potentialReach: "38.2M (2%)",
    audienceSize: "Moderate"
  },
  {
    id: 5,
    name: "Chicago",
    position: { top: '32%', left: '58%' },
    potentialReach: "67.4M (4%)",
    audienceSize: "Large"
  },
  {
    id: 6,
    name: "Toronto",
    position: { top: '18%', left: '70%' },
    potentialReach: "28.9M (2%)",
    audienceSize: "Moderate"
  },
  {
    id: 7,
    name: "Ottawa",
    position: { top: '12%', left: '68%' },
    potentialReach: "15.3M (1%)",
    audienceSize: "Small"
  },
  {
    id: 8,
    name: "Winnipeg",
    position: { top: '8%', left: '45%' },
    potentialReach: "12.1M (1%)",
    audienceSize: "Small"
  }
];

interface MapViewProps {
  selectedFilters: Set<string>;
  analysisResult?: AnalysisResult;
}

export function MapView({ selectedFilters, analysisResult }: MapViewProps) {
  const [activeTab, setActiveTab] = useState('map');
  const [selectedRegion, setSelectedRegion] = useState<any>(null);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);

  // Initialize MapLibre GL map
  useEffect(() => {
    if (mapContainer.current && !map.current) {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: {
          version: 8,
          sources: {
            'osm': {
              type: 'raster',
              tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
              tileSize: 256,
              attribution: '© OpenStreetMap contributors'
            }
          },
          layers: [
            {
              id: 'osm',
              type: 'raster',
              source: 'osm'
            }
          ]
        },
        center: [-98.5795, 39.8283], // Center of US
        zoom: 4
      });

      map.current.addControl(new maplibregl.NavigationControl());
      
      // Add click interaction for state information
      map.current.on('click', 'voter-heatmap', (e) => {
        const properties = e.features[0].properties;
        const stateCode = properties.name === 'California' ? 'CA' : 
                         properties.name === 'New York' ? 'NY' : 
                         properties.name === 'Wyoming' ? 'WY' : properties.name;
        setSelectedRegion({
          name: properties.name,
          state: stateCode,
          population: properties.density || 0,
          matchingPopulation: properties.matchingPopulation || 0,
          percentage: properties.percentage || 0
        });
      });

      // Change cursor on hover
      map.current.on('mouseenter', 'voter-heatmap', () => {
        if (map.current) {
          map.current.getCanvas().style.cursor = 'pointer';
        }
      });

      map.current.on('mouseleave', 'voter-heatmap', () => {
        if (map.current) {
          map.current.getCanvas().style.cursor = '';
        }
      });
      
      // Wait for the map to be fully loaded before adding data
      map.current.on('load', () => {
        console.log('Map loaded, ready to add state boundaries and heatmap');
        
        // Always add state boundaries first
        addStateBoundaries();
        
        // Then add data based on whether filters are applied
        if (analysisResult) {
          addHeatmapToMap(analysisResult);
        } else {
          // Show sample data with state boundaries
          addSampleHeatmap();
        }
      });
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Add state boundaries to the map
  const addStateBoundaries = () => {
    if (!map.current) return;
    
    console.log('Adding state boundaries...');
    
    // Add state boundaries source
    map.current.addSource('state-boundaries', {
      type: 'geojson',
      data: realStatesGeoJSON
    });

    // Add state fill layer
    map.current.addLayer({
      id: 'state-fill',
      type: 'fill',
      source: 'state-boundaries',
      paint: {
        'fill-color': '#e1f5fe',
        'fill-opacity': 0.3
      }
    });

    // Add state border layer
    map.current.addLayer({
      id: 'state-borders',
      type: 'line',
      source: 'state-boundaries',
      paint: {
        'line-color': '#1976d2',
        'line-width': 2
      }
    });

    console.log('State boundaries added');
  };

  // Helper function to add sample heatmap with state boundaries
  const addSampleHeatmap = () => {
    if (!map.current) return;
    
    console.log('Adding sample heatmap with state boundaries...');
    
    // Create sample data with state boundaries and sample voter data
    const sampleData = {
      type: 'FeatureCollection',
      features: realStatesGeoJSON.features.map(state => {
        const stateCode = state.properties.name === 'California' ? 'CA' : 
                         state.properties.name === 'New York' ? 'NY' : 
                         state.properties.name === 'Wyoming' ? 'WY' : state.properties.name;
        let matchingPopulation = 0;
        let percentage = 0;
        
        // Sample data for each state
        switch (stateCode) {
          case 'CA':
            matchingPopulation = 5000000;
            percentage = 12.6;
            break;
          case 'NY':
            matchingPopulation = 2500000;
            percentage = 12.8;
            break;
          case 'WY':
            matchingPopulation = 75000;
            percentage = 13.0;
            break;
        }
        
        return {
          ...state,
          properties: {
            ...state.properties,
            matchingPopulation,
            percentage
          }
        };
      })
    };

    if (map.current.getSource('voter-heatmap')) {
      map.current.removeLayer('voter-heatmap');
      map.current.removeSource('voter-heatmap');
    }

    map.current.addSource('voter-heatmap', {
      type: 'geojson',
      data: sampleData
    });

    // Add sample heatmap fill layer
    map.current.addLayer({
      id: 'voter-heatmap',
      type: 'fill',
      source: 'voter-heatmap',
      paint: {
        'fill-color': [
          'interpolate',
          ['linear'],
          ['get', 'percentage'],
          0, '#e1f5fe',
          5, '#81d4fa',
          10, '#4fc3f7',
          15, '#29b6f6',
          20, '#03a9f4',
          25, '#0288d1'
        ],
        'fill-opacity': 0.7
      }
    });

    console.log('Sample heatmap added to map');
  };

  // Helper function to add heatmap for analysis data
  const addHeatmapToMap = (result: AnalysisResult) => {
    if (!map.current || result.stateBreakdown.length === 0) return;
    
    console.log('Adding heatmap to map with analysis data:', result.stateBreakdown);
    
    // Create a map of state data for quick lookup
    const stateDataMap = new Map();
    result.stateBreakdown.forEach(state => {
      stateDataMap.set(state.state, state);
    });
    
    // Create heatmap data by combining state boundaries with analysis results
    const heatmapData = {
      type: 'FeatureCollection',
      features: realStatesGeoJSON.features.map(state => {
        const stateCode = state.properties.name === 'California' ? 'CA' : 
                         state.properties.name === 'New York' ? 'NY' : 
                         state.properties.name === 'Wyoming' ? 'WY' : state.properties.name;
        const analysisData = stateDataMap.get(stateCode);
        
        if (analysisData) {
          return {
            ...state,
            properties: {
              ...state.properties,
              matchingPopulation: analysisData.matchingPopulation,
              percentage: analysisData.percentage,
              population: analysisData.population
            }
          };
        } else {
          // If no analysis data, show as neutral
          return {
            ...state,
            properties: {
              ...state.properties,
              matchingPopulation: 0,
              percentage: 0,
              population: state.properties.population || 0
            }
          };
        }
      })
    };

    console.log('Heatmap data for map:', heatmapData);

    if (map.current.getSource('voter-heatmap')) {
      map.current.removeLayer('voter-heatmap');
      map.current.removeSource('voter-heatmap');
    }

    map.current.addSource('voter-heatmap', {
      type: 'geojson',
      data: heatmapData
    });

    // Add heatmap fill layer
    map.current.addLayer({
      id: 'voter-heatmap',
      type: 'fill',
      source: 'voter-heatmap',
      paint: {
        'fill-color': [
          'interpolate',
          ['linear'],
          ['get', 'percentage'],
          0, '#e1f5fe',
          5, '#81d4fa',
          10, '#4fc3f7',
          15, '#29b6f6',
          20, '#03a9f4',
          25, '#0288d1'
        ],
        'fill-opacity': 0.7
      }
    });

    console.log('Heatmap added to map successfully');
  };

  // Update map with analysis results
  useEffect(() => {
    if (map.current && map.current.isStyleLoaded()) {
      if (analysisResult && analysisResult.stateBreakdown.length > 0) {
        // Add state boundaries and real analysis data
        addStateBoundaries();
        addHeatmapToMap(analysisResult);
      } else {
        // Show sample data with state boundaries
        addStateBoundaries();
        addSampleHeatmap();
      }
    }
  }, [analysisResult]);

  const getStateCoordinates = (stateCode: string): [number, number] => {
    const coordinates: Record<string, [number, number]> = {
      'CA': [-119.4179, 36.7783], 'TX': [-99.9018, 31.9686], 'FL': [-81.5158, 27.7663],
      'NY': [-74.9481, 42.1657], 'PA': [-77.1945, 41.2033], 'IL': [-89.3985, 40.3363],
      'OH': [-82.7649, 40.3888], 'GA': [-83.1136, 32.1656], 'NC': [-79.0193, 35.7596],
      'MI': [-84.5467, 43.3266], 'NJ': [-74.4057, 40.2989], 'VA': [-78.1694, 37.7693],
      'WA': [-121.4905, 47.4009], 'AZ': [-111.4312, 33.7298], 'MA': [-71.5301, 42.2373],
      'TN': [-86.7816, 35.7478], 'IN': [-86.1349, 39.7909], 'MO': [-92.1893, 38.4561],
      'MD': [-76.8021, 39.0458], 'WI': [-89.6165, 44.2685], 'CO': [-105.3111, 39.0598],
      'MN': [-94.6859, 46.7296], 'SC': [-80.9007, 33.8569], 'AL': [-86.7911, 32.8067],
      'LA': [-92.4731, 31.1695], 'KY': [-84.6701, 37.6681], 'OR': [-122.0709, 44.5721],
      'OK': [-97.5164, 35.4676], 'CT': [-72.7554, 41.5978], 'UT': [-111.8926, 40.1505],
      'IA': [-93.0977, 42.0115], 'NV': [-117.0554, 38.4199], 'AR': [-92.3731, 34.9697],
      'MS': [-89.3985, 32.3207], 'KS': [-98.4842, 38.5266], 'NM': [-106.2485, 34.8405],
      'NE': [-99.9018, 41.1254], 'WV': [-80.9696, 38.3495], 'ID': [-114.4788, 44.2405],
      'HI': [-157.4983, 21.0943], 'NH': [-71.5653, 43.4525], 'ME': [-69.7653, 44.3235],
      'RI': [-71.5118, 41.8236], 'MT': [-110.4544, 46.9219], 'DE': [-75.5277, 39.1612],
      'SD': [-99.9018, 44.2998], 'ND': [-101.0020, 47.5289], 'AK': [-152.4044, 61.3707],
      'VT': [-72.7317, 44.0459], 'WY': [-107.3025, 41.1455], 'DC': [-77.0369, 38.9072]
    };
    return coordinates[stateCode] || [-98.5795, 39.8283];
  };

  const getRegionColor = (audienceSize: string) => {
    switch (audienceSize) {
      case 'Large':
        return 'bg-blue-600';
      case 'Moderate':
        return 'bg-blue-400';
      default:
        return 'bg-blue-200';
    }
  };

  const getRegionSize = (size: string) => {
    switch (size) {
      case 'large':
        return 'w-16 h-12';
      case 'medium':
        return 'w-12 h-9';
      default:
        return 'w-8 h-6';
    }
  };

  const getCityMarkerColor = (audienceSize: string) => {
    switch (audienceSize) {
      case 'Large':
        return 'bg-red-600';
      case 'Moderate':
        return 'bg-orange-500';
      default:
        return 'bg-green-600';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col h-full">
        <div className="p-4 border-b border-border bg-white">
          <TabsList className="grid w-fit grid-cols-2">
            <TabsTrigger value="map" className="flex items-center gap-2">
              <Map className="w-4 h-4" />
              Map View
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Insights View
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="map" className="flex-1 m-0">
          <div className="relative h-full">
            {/* MapLibre GL Map */}
            <div ref={mapContainer} className="w-full h-full" />
            
            {/* Analysis Results Overlay */}
            {analysisResult && analysisResult.totalPopulation > 0 && (
              <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg border border-border max-w-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {analysisResult.matchingPopulation.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Matching Population</div>
                  <div className="text-lg font-medium mt-1">
                    ({analysisResult.percentage.toFixed(2)}%)
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-border">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Total Population: {analysisResult.totalPopulation.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Legend */}
            <div className="absolute bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border border-border">
              <h4 className="font-medium mb-3">Voter Segment Heatmap</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-600 rounded"></div>
                  <span className="text-sm">High (20%+)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-400 rounded"></div>
                  <span className="text-sm">Medium (10-20%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-200 rounded"></div>
                  <span className="text-sm">Low (5-10%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-200 rounded"></div>
                  <span className="text-sm">No Data (0-5%)</span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Showing: CA, NY, WY states
                </p>
              </div>
            </div>

            {/* Selected Filters Display */}
            {selectedFilters.size > 0 && (
              <div className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-lg border border-border max-w-sm">
                <h3 className="font-medium mb-2">Active Filters</h3>
                <div className="space-y-1">
                  {Array.from(selectedFilters).slice(0, 3).map(filterId => (
                    <Badge key={filterId} variant="secondary" className="mr-1 mb-1">
                      {filterId.split('-').pop()}
                    </Badge>
                  ))}
                  {selectedFilters.size > 3 && (
                    <Badge variant="outline">
                      +{selectedFilters.size - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="flex-1 m-0 p-8">
          <div className="h-full overflow-y-auto">
            {analysisResult && analysisResult.totalPopulation > 0 ? (
              <div className="space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Population</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{analysisResult.totalPopulation.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">US Total</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Matching Population</CardTitle>
                      <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-600">{analysisResult.matchingPopulation.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">{analysisResult.percentage.toFixed(2)}% of total</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Active Filters</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{selectedFilters.size}</div>
                      <p className="text-xs text-muted-foreground">Filters applied</p>
                    </CardContent>
                  </Card>
                </div>

                {/* State Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle>State-by-State Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analysisResult.stateBreakdown.slice(0, 10).map((state, index) => (
                        <div key={state.state} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </div>
                            <div>
                              <div className="font-medium">{state.state}</div>
                              <div className="text-sm text-muted-foreground">
                                {state.population.toLocaleString()} total population
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-blue-600">
                              {state.matchingPopulation.toLocaleString()}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {state.percentage.toFixed(2)}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Filter Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Applied Filters</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {Array.from(selectedFilters).map(filterId => (
                        <Badge key={filterId} variant="secondary" className="mb-2">
                          {filterId.split('-').pop()}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center space-y-4">
                  <BarChart3 className="w-16 h-16 mx-auto text-muted-foreground" />
                  <h3>Insights View</h3>
                  <p className="text-muted-foreground max-w-md">
                    Select filters to see detailed analytics and insights. This will include demographic breakdowns, 
                    reach statistics, and state-by-state analysis of your voter segments.
                  </p>
                  <div className="pt-4">
                    <Badge variant="secondary" className="mr-2">
                      {selectedFilters.size} filters applied
                    </Badge>
                    {selectedFilters.size > 0 && (
                      <Badge variant="outline">
                        Ready for analysis
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}