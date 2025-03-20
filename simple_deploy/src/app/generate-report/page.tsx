'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ReportGenerator() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    growthWeight: 50,
    financialWeight: 30,
    performanceWeight: 20,
    topStocksCount: 5,
    includeAdditional: true,
    additionalCount: 5,
    includeSectors: true,
    includeStrategies: true,
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) : value,
    });
  };
  
  const handleWeightChange = (type: 'growth' | 'financial' | 'performance', value: number) => {
    // Update the specified weight
    if (type === 'growth') {
      setFormData({
        ...formData,
        growthWeight: value,
      });
    } else if (type === 'financial') {
      setFormData({
        ...formData,
        financialWeight: value,
      });
    } else {
      setFormData({
        ...formData,
        performanceWeight: value,
      });
    }
    
    // Recalculate other weights to ensure they sum to 100
    const total = 100;
    const remaining = total - value;
    
    if (type === 'growth') {
      // Maintain the ratio between financial and performance
      const ratio = formData.financialWeight / (formData.financialWeight + formData.performanceWeight);
      setFormData(prev => ({
        ...prev,
        financialWeight: Math.round(remaining * ratio),
        performanceWeight: Math.round(remaining * (1 - ratio)),
      }));
    } else if (type === 'financial') {
      // Maintain the ratio between growth and performance
      const ratio = formData.growthWeight / (formData.growthWeight + formData.performanceWeight);
      setFormData(prev => ({
        ...prev,
        growthWeight: Math.round(remaining * ratio),
        performanceWeight: Math.round(remaining * (1 - ratio)),
      }));
    } else {
      // Maintain the ratio between growth and financial
      const ratio = formData.growthWeight / (formData.growthWeight + formData.financialWeight);
      setFormData(prev => ({
        ...prev,
        growthWeight: Math.round(remaining * ratio),
        financialWeight: Math.round(remaining * (1 - ratio)),
      }));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Build query parameters
    const params = new URLSearchParams();
    params.append('growthWeight', (formData.growthWeight / 100).toString());
    params.append('financialWeight', (formData.financialWeight / 100).toString());
    params.append('performanceWeight', (formData.performanceWeight / 100).toString());
    params.append('topStocksCount', formData.topStocksCount.toString());
    params.append('includeAdditional', formData.includeAdditional.toString());
    params.append('additionalCount', formData.additionalCount.toString());
    params.append('includeSectors', formData.includeSectors.toString());
    params.append('includeStrategies', formData.includeStrategies.toString());
    
    // Navigate to report page with parameters
    router.push(`/report?${params.toString()}`);
  };
  
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Generate Stock Analysis Report</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Analysis Weights</h2>
            <p className="text-sm text-gray-500 mb-4">
              Adjust the importance of each factor in the analysis. The weights will automatically balance to sum to 100%.
            </p>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="growth-weight" className="block text-sm font-medium text-gray-700 mb-1">
                  Growth Potential: <span id="growth-weight-value">{formData.growthWeight}%</span>
                </label>
                <input
                  type="range"
                  id="growth-weight"
                  name="growthWeight"
                  className="w-full"
                  min="10"
                  max="80"
                  value={formData.growthWeight}
                  onChange={(e) => handleWeightChange('growth', parseInt(e.target.value))}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Includes analyst recommendations, upside potential, revenue growth, and profit margins.
                </p>
              </div>
              
              <div>
                <label htmlFor="financial-weight" className="block text-sm font-medium text-gray-700 mb-1">
                  Financial Health: <span id="financial-weight-value">{formData.financialWeight}%</span>
                </label>
                <input
                  type="range"
                  id="financial-weight"
                  name="financialWeight"
                  className="w-full"
                  min="10"
                  max="80"
                  value={formData.financialWeight}
                  onChange={(e) => handleWeightChange('financial', parseInt(e.target.value))}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Includes PE ratio, market capitalization, and profit margins.
                </p>
              </div>
              
              <div>
                <label htmlFor="performance-weight" className="block text-sm font-medium text-gray-700 mb-1">
                  Price Performance: <span id="performance-weight-value">{formData.performanceWeight}%</span>
                </label>
                <input
                  type="range"
                  id="performance-weight"
                  name="performanceWeight"
                  className="w-full"
                  min="10"
                  max="80"
                  value={formData.performanceWeight}
                  onChange={(e) => handleWeightChange('performance', parseInt(e.target.value))}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Includes yearly price change and position relative to 52-week high/low.
                </p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Report Settings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="topStocksCount" className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Top Stocks
                </label>
                <input
                  type="number"
                  id="topStocksCount"
                  name="topStocksCount"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  min="1"
                  max="20"
                  value={formData.topStocksCount}
                  onChange={handleChange}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Number of top-ranked stocks to highlight in the report.
                </p>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    id="includeAdditional"
                    name="includeAdditional"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={formData.includeAdditional}
                    onChange={handleChange}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="includeAdditional" className="font-medium text-gray-700">
                    Include Additional Stocks
                  </label>
                  <p className="text-gray-500">
                    Include a section with additional promising stocks beyond the top picks.
                  </p>
                </div>
              </div>
              
              {formData.includeAdditional && (
                <div>
                  <label htmlFor="additionalCount" className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Additional Stocks
                  </label>
                  <input
                    type="number"
                    id="additionalCount"
                    name="additionalCount"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    min="1"
                    max="20"
                    value={formData.additionalCount}
                    onChange={handleChange}
                  />
                </div>
              )}
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    id="includeSectors"
                    name="includeSectors"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={formData.includeSectors}
                    onChange={handleChange}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="includeSectors" className="font-medium text-gray-700">
                    Include Sector Analysis
                  </label>
                  <p className="text-gray-500">
                    Include a breakdown of stocks by sector with sector-specific insights.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    id="includeStrategies"
                    name="includeStrategies"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={formData.includeStrategies}
                    onChange={handleChange}
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="includeStrategies" className="font-medium text-gray-700">
                    Include Investment Strategies
                  </label>
                  <p className="text-gray-500">
                    Include investment considerations and strategies based on the analysis.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-6">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Generate Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
