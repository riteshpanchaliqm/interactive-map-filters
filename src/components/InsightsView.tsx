import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { AnalysisResult } from '../utils/dataLoader';

interface InsightsViewProps {
  analysisResult: AnalysisResult | null;
  selectedFilters: Set<string>;
}

export function InsightsView({ analysisResult, selectedFilters }: InsightsViewProps) {
  console.log('InsightsView rendering:', { analysisResult, selectedFilters });
  console.log('Analysis result data:', {
    totalPopulation: Math.round(analysisResult?.totalPopulation || 0),
    matchingPopulation: Math.round(analysisResult?.matchingPopulation || 0),
    percentage: analysisResult?.percentage,
    stateBreakdown: analysisResult?.stateBreakdown
  });
  
  if (!analysisResult) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-2xl font-semibold text-muted-foreground">No Analysis Results</div>
          <div className="text-sm text-muted-foreground">Apply filters to see insights</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6" style={{ 
      padding: '24px', 
      backgroundColor: '#f8fafc', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
    }}>

      {/* Key Metrics Tiles */}
      <div className="grid grid-cols-3 gap-6 mb-8" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px' }}>
        {/* Match Rate Tile */}
        <Card style={{ 
          border: '2px solid #3b82f6', 
          backgroundColor: '#eff6ff',
          borderRadius: '16px',
          boxShadow: '0 8px 25px -5px rgba(59, 130, 246, 0.3)',
          transition: 'all 0.3s ease'
        }}>
          <CardContent style={{ padding: '32px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: '56px', fontWeight: 'bold', color: '#1d4ed8', marginBottom: '12px', textShadow: '0 2px 4px rgba(29, 78, 216, 0.1)' }}>
              {analysisResult.percentage.toFixed(2)}%
            </div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#1e40af', marginBottom: '8px' }}>
              Match Rate
            </div>
            <div style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.5' }}>
              Population matching your filters
            </div>
          </CardContent>
        </Card>

        {/* Matching Population Tile */}
        <Card style={{ 
          border: '2px solid #10b981', 
          backgroundColor: '#f0fdf4',
          borderRadius: '16px',
          boxShadow: '0 8px 25px -5px rgba(16, 185, 129, 0.3)',
          transition: 'all 0.3s ease'
        }}>
          <CardContent style={{ padding: '32px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#059669', marginBottom: '12px', textShadow: '0 2px 4px rgba(5, 150, 105, 0.1)' }}>
              {Math.round(analysisResult.matchingPopulation / 1000000)}M
            </div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#047857', marginBottom: '8px' }}>
              Matching Population
            </div>
            <div style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.5' }}>
              {Math.round(analysisResult.matchingPopulation).toLocaleString()} people
            </div>
          </CardContent>
        </Card>

        {/* Filters Applied Tile */}
        <Card style={{ 
          border: '2px solid #8b5cf6', 
          backgroundColor: '#faf5ff',
          borderRadius: '16px',
          boxShadow: '0 8px 25px -5px rgba(139, 92, 246, 0.3)',
          transition: 'all 0.3s ease'
        }}>
          <CardContent style={{ padding: '32px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: '56px', fontWeight: 'bold', color: '#7c3aed', marginBottom: '12px', textShadow: '0 2px 4px rgba(124, 58, 237, 0.1)' }}>
              {selectedFilters.size}
            </div>
            <div style={{ fontSize: '20px', fontWeight: '700', color: '#6b21a8', marginBottom: '8px' }}>
              Filters Applied
            </div>
            <div style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.5' }}>
              Active filter{selectedFilters.size !== 1 ? 's' : ''}
            </div>
          </CardContent>
        </Card>
      </div>


      {/* Population Distribution Chart */}
      <Card style={{ border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <CardHeader style={{ backgroundColor: '#f8fafc', padding: '20px 24px', borderBottom: '1px solid #e5e7eb' }}>
          <CardTitle className="flex items-center gap-2" style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937' }}>
            <div className="w-3 h-3 bg-blue-500 rounded-full" style={{ width: '12px', height: '12px', backgroundColor: '#3b82f6', borderRadius: '50%' }}></div>
            Population Distribution
          </CardTitle>
        </CardHeader>
        <CardContent style={{ padding: '24px' }}>
          <div className="space-y-6" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Recharts Pie Chart */}
            <div className="h-80" style={{ height: '320px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <PieChart width={400} height={300}>
                <Pie
                  data={[
                    { name: 'Matching', value: analysisResult.matchingPopulation },
                    { name: 'Remaining', value: analysisResult.totalPopulation - analysisResult.matchingPopulation }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  dataKey="value"
                >
                  <Cell fill="#3b82f6" />
                  <Cell fill="#e5e7eb" />
                </Pie>
              </PieChart>
            </div>
            
            {/* Enhanced Legend with Numbers */}
            <div className="grid grid-cols-2 gap-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                padding: '16px', 
                backgroundColor: '#eff6ff', 
                borderRadius: '8px',
                border: '1px solid #dbeafe'
              }}>
                <div className="w-4 h-4 bg-blue-500 rounded-full" style={{ width: '16px', height: '16px', backgroundColor: '#3b82f6', borderRadius: '50%' }}></div>
                <div>
                  <div className="text-sm font-medium text-blue-900" style={{ fontSize: '14px', fontWeight: '500', color: '#1e40af' }}>Matching Population</div>
                  <div className="text-xs text-blue-700" style={{ fontSize: '12px', color: '#1d4ed8' }}>{Math.round(analysisResult.matchingPopulation).toLocaleString()}</div>
                  <div className="text-xs text-blue-600 font-semibold" style={{ fontSize: '12px', color: '#1e40af', fontWeight: '600' }}>{analysisResult.percentage.toFixed(2)}%</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                padding: '16px', 
                backgroundColor: '#f9fafb', 
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}>
                <div className="w-4 h-4 bg-gray-400 rounded-full" style={{ width: '16px', height: '16px', backgroundColor: '#9ca3af', borderRadius: '50%' }}></div>
                <div>
                  <div className="text-sm font-medium text-gray-900" style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>Remaining Population</div>
                  <div className="text-xs text-gray-700" style={{ fontSize: '12px', color: '#4b5563' }}>{Math.round(analysisResult.totalPopulation - analysisResult.matchingPopulation).toLocaleString()}</div>
                  <div className="text-xs text-gray-600 font-semibold" style={{ fontSize: '12px', color: '#4b5563', fontWeight: '600' }}>{(100 - analysisResult.percentage).toFixed(2)}%</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* State Performance Bar Chart */}
      <Card style={{ border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <CardHeader style={{ backgroundColor: '#f0fdf4', padding: '20px 24px', borderBottom: '1px solid #e5e7eb' }}>
          <CardTitle className="flex items-center gap-2" style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937' }}>
            <div className="w-3 h-3 bg-green-500 rounded-full" style={{ width: '12px', height: '12px', backgroundColor: '#10b981', borderRadius: '50%' }}></div>
            State Performance
          </CardTitle>
        </CardHeader>
        <CardContent style={{ padding: '24px' }}>
          <div className="space-y-6" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Recharts Bar Chart */}
            <div className="h-80" style={{ height: '320px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <BarChart
                width={600}
                height={300}
                data={analysisResult.stateBreakdown.slice(0, 5).map((state, index) => ({
                  state: state.state,
                  percentage: state.percentage,
                  matchingPopulation: state.matchingPopulation,
                  population: state.population,
                  rank: index + 1
                }))}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="state" 
                    tick={{ fontSize: 12 }}
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    axisLine={{ stroke: '#e5e7eb' }}
                    label={{ value: 'Match Rate (%)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    formatter={(value: number, name: string) => [
                      name === 'percentage' ? `${value.toFixed(2)}%` : Math.round(value).toLocaleString(),
                      name === 'percentage' ? 'Match Rate' : 'Population'
                    ]}
                    labelStyle={{ color: '#374151' }}
                    contentStyle={{ 
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar 
                    dataKey="percentage" 
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
            </div>
            
            {/* State Details */}
            <div className="space-y-3">
              {analysisResult.stateBreakdown.slice(0, 5).map((state, index) => {
                const isTopPerformer = index === 0;
                return (
                  <div key={state.state} className={`flex items-center justify-between p-3 rounded-lg ${
                    isTopPerformer ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        isTopPerformer ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{state.state}</div>
                        <div className="text-sm text-muted-foreground">
                          {Math.round(state.population).toLocaleString()} total
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">
                        {state.percentage.toFixed(2)}%
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {Math.round(state.matchingPopulation).toLocaleString()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trend Analysis */}
      <Card style={{ border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <CardHeader style={{ backgroundColor: '#faf5ff', padding: '20px 24px', borderBottom: '1px solid #e5e7eb' }}>
          <CardTitle className="flex items-center gap-2" style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937' }}>
            <div className="w-3 h-3 bg-purple-500 rounded-full" style={{ width: '12px', height: '12px', backgroundColor: '#8b5cf6', borderRadius: '50%' }}></div>
            Population Trend Analysis
          </CardTitle>
        </CardHeader>
        <CardContent style={{ padding: '24px' }}>
          <div className="space-y-6" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Recharts Line Chart */}
            <div className="h-80" style={{ height: '320px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <LineChart
                width={600}
                height={300}
                data={analysisResult.stateBreakdown.slice(0, 6).map((state, index) => ({
                  state: state.state,
                  percentage: state.percentage,
                  matchingPopulation: state.matchingPopulation,
                  population: state.population,
                  rank: index + 1
                }))}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="state" 
                    tick={{ fontSize: 12 }}
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }}
                    axisLine={{ stroke: '#e5e7eb' }}
                    label={{ value: 'Match Rate (%)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    formatter={(value: number, name: string) => [
                      name === 'percentage' ? `${value.toFixed(2)}%` : Math.round(value).toLocaleString(),
                      name === 'percentage' ? 'Match Rate' : 'Population'
                    ]}
                    labelStyle={{ color: '#374151' }}
                    contentStyle={{ 
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="percentage" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, stroke: '#3b82f6', strokeWidth: 2 }}
                  />
                </LineChart>
            </div>
            
            {/* Performance Summary */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-sm font-medium text-blue-900">Average Match Rate</div>
                <div className="text-2xl font-bold text-blue-600">
                  {(analysisResult.stateBreakdown.reduce((sum, state) => sum + state.percentage, 0) / analysisResult.stateBreakdown.length).toFixed(2)}%
                </div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-sm font-medium text-green-900">Top Performer</div>
                <div className="text-lg font-bold text-green-600">
                  {analysisResult.stateBreakdown[0]?.state} ({analysisResult.stateBreakdown[0]?.percentage.toFixed(2)}%)
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Complete State Analysis Table */}
      <Card style={{ border: '2px solid orange', marginBottom: '20px' }}>
        <CardHeader style={{ backgroundColor: '#f9fafb', padding: '16px' }}>
          <CardTitle className="flex items-center gap-2" style={{ fontSize: '18px', fontWeight: '600' }}>
            <div className="w-2 h-2 bg-orange-500 rounded-full" style={{ width: '8px', height: '8px', backgroundColor: '#f97316', borderRadius: '50%' }}></div>
            Complete State Analysis
          </CardTitle>
        </CardHeader>
        <CardContent style={{ padding: '16px' }}>
          <div className="overflow-x-auto" style={{ overflowX: 'auto' }}>
            <table className="w-full text-sm" style={{ width: '100%', fontSize: '14px' }}>
              <thead>
                <tr className="border-b" style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900" style={{ textAlign: 'left', padding: '12px 16px', fontWeight: '600', color: '#111827' }}>State</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900" style={{ textAlign: 'right', padding: '12px 16px', fontWeight: '600', color: '#111827' }}>Total Population</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900" style={{ textAlign: 'right', padding: '12px 16px', fontWeight: '600', color: '#111827' }}>Matching Population</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900" style={{ textAlign: 'right', padding: '12px 16px', fontWeight: '600', color: '#111827' }}>Match Rate</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900" style={{ textAlign: 'right', padding: '12px 16px', fontWeight: '600', color: '#111827' }}>Rank</th>
                </tr>
              </thead>
              <tbody>
                {analysisResult.stateBreakdown.map((state, index) => (
                  <tr key={state.state} className="border-b hover:bg-gray-50" style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb' }}>
                    <td className="py-3 px-4 font-medium text-gray-900" style={{ padding: '12px 16px', fontWeight: '500', color: '#111827' }}>{state.state}</td>
                    <td className="py-3 px-4 text-right text-gray-600" style={{ padding: '12px 16px', textAlign: 'right', color: '#4b5563' }}>{Math.round(state.population).toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-gray-600" style={{ padding: '12px 16px', textAlign: 'right', color: '#4b5563' }}>{Math.round(state.matchingPopulation).toLocaleString()}</td>
                    <td className="py-3 px-4 text-right" style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <span className={`font-semibold ${
                        state.percentage > 5 ? 'text-green-600' : 
                        state.percentage > 2 ? 'text-yellow-600' : 'text-red-600'
                      }`} style={{ 
                        fontWeight: '600',
                        color: state.percentage > 5 ? '#059669' : 
                               state.percentage > 2 ? '#d97706' : '#dc2626'
                      }}>
                        {state.percentage.toFixed(2)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right" style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        index === 0 ? 'bg-green-100 text-green-800' :
                        index === 1 ? 'bg-blue-100 text-blue-800' :
                        index === 2 ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`} style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '4px 8px',
                        borderRadius: '9999px',
                        fontSize: '12px',
                        fontWeight: '500',
                        backgroundColor: index === 0 ? '#dcfce7' :
                                       index === 1 ? '#dbeafe' :
                                       index === 2 ? '#e9d5ff' : '#f3f4f6',
                        color: index === 0 ? '#166534' :
                               index === 1 ? '#1e40af' :
                               index === 2 ? '#7c3aed' : '#374151'
                      }}>
                        #{index + 1}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Filter Impact Analysis */}
      <Card style={{ border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <CardHeader style={{ backgroundColor: '#eef2ff', padding: '20px 24px', borderBottom: '1px solid #e5e7eb' }}>
          <CardTitle className="flex items-center gap-2" style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937' }}>
            <div className="w-3 h-3 bg-indigo-500 rounded-full" style={{ width: '12px', height: '12px', backgroundColor: '#6366f1', borderRadius: '50%' }}></div>
            Filter Impact Analysis
          </CardTitle>
        </CardHeader>
        <CardContent style={{ padding: '24px' }}>
          <div className="space-y-6">
            {/* Filter Categories Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900">Filter Categories</h4>
                <div className="space-y-3">
                  {Array.from(selectedFilters).slice(0, 6).map((filterId, index) => {
                    const category = filterId.split('_')[0];
                    const colors = [
                      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 
                      'bg-orange-500', 'bg-red-500', 'bg-indigo-500'
                    ];
                    const categoryNames = {
                      'voters': 'Demographics',
                      'commercialdata': 'Household',
                      'consumerdata': 'Consumer',
                      'hs': 'Political',
                      'ethnic': 'Ethnicity',
                      'state': 'Geography'
                    };
                    return (
                      <div key={filterId} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className={`w-4 h-4 rounded-full ${colors[index % colors.length]}`}></div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {categoryNames[category] || category}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {filterId.split('_').slice(1).join(' ')}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900">Filter Distribution</h4>
                <div className="space-y-3">
                  {Array.from(selectedFilters).slice(0, 6).map((filterId, index) => {
                    const percentage = (1 / selectedFilters.size) * 100;
                    const colors = [
                      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 
                      'bg-orange-500', 'bg-red-500', 'bg-indigo-500'
                    ];
                    return (
                      <div key={filterId} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-900">
                            {filterId.split('_').pop()}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {percentage.toFixed(2)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${colors[index % colors.length]}`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            {/* Filter Summary Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{selectedFilters.size}</div>
                <div className="text-sm text-blue-700">Active Filters</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {Array.from(selectedFilters).map(f => f.split('_')[0]).filter((v, i, a) => a.indexOf(v) === i).length}
                </div>
                <div className="text-sm text-green-700">Categories</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.round(analysisResult.percentage)}%
                </div>
                <div className="text-sm text-purple-700">Match Rate</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applied Filters */}
      <Card style={{ border: '2px solid pink', marginBottom: '20px' }}>
        <CardHeader style={{ backgroundColor: '#fdf2f8', padding: '16px' }}>
          <CardTitle className="flex items-center gap-2" style={{ fontSize: '18px', fontWeight: '600' }}>
            <div className="w-2 h-2 bg-pink-500 rounded-full" style={{ width: '8px', height: '8px', backgroundColor: '#ec4899', borderRadius: '50%' }}></div>
            Applied Filters
          </CardTitle>
        </CardHeader>
        <CardContent style={{ padding: '16px' }}>
          <div className="space-y-4" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="text-sm text-gray-600 mb-4" style={{ fontSize: '14px', color: '#4b5563', marginBottom: '16px' }}>
              {selectedFilters.size} filter{selectedFilters.size !== 1 ? 's' : ''} currently applied
            </div>
            <div className="flex flex-wrap gap-2" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {Array.from(selectedFilters).map((filterId, index) => {
                const colors = [
                  'bg-blue-100 text-blue-800 border-blue-200',
                  'bg-green-100 text-green-800 border-green-200',
                  'bg-purple-100 text-purple-800 border-purple-200',
                  'bg-orange-100 text-orange-800 border-orange-200',
                  'bg-red-100 text-red-800 border-red-200',
                  'bg-indigo-100 text-indigo-800 border-indigo-200'
                ];
                return (
                  <Badge 
                    key={filterId} 
                    variant="outline" 
                    className={`px-3 py-1 text-sm font-medium border ${colors[index % colors.length]}`}
                    style={{
                      padding: '8px 12px',
                      fontSize: '14px',
                      fontWeight: '500',
                      border: '1px solid',
                      borderRadius: '6px',
                      backgroundColor: index % 6 === 0 ? '#dbeafe' :
                                     index % 6 === 1 ? '#dcfce7' :
                                     index % 6 === 2 ? '#e9d5ff' :
                                     index % 6 === 3 ? '#fed7aa' :
                                     index % 6 === 4 ? '#fecaca' : '#e0e7ff',
                      color: index % 6 === 0 ? '#1e40af' :
                             index % 6 === 1 ? '#166534' :
                             index % 6 === 2 ? '#7c3aed' :
                             index % 6 === 3 ? '#ea580c' :
                             index % 6 === 4 ? '#dc2626' : '#3730a3',
                      borderColor: index % 6 === 0 ? '#93c5fd' :
                                  index % 6 === 1 ? '#86efac' :
                                  index % 6 === 2 ? '#c4b5fd' :
                                  index % 6 === 3 ? '#fdba74' :
                                  index % 6 === 4 ? '#fca5a5' : '#a5b4fc'
                    }}
                  >
                    {filterId.split('_').pop()?.replace(/_/g, ' ')}
                  </Badge>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
