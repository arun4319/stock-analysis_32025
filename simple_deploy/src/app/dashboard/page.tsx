'use client';

import React, { useState, useEffect } from 'react';
import { 
  TopStocksBarChart, 
  OverallScoreChart, 
  SectorDistributionChart,
  StockComparisonRadarChart 
} from '@/components/StockCharts';
import { StockData, StockAnalysisResult } from '@/lib/stock-analysis/types';

export default function Dashboard() {
  const [analysisResults, setAnalysisResults] = useState<StockAnalysisResult[]>([]);
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [sectorData, setSectorData] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('bar');
  const [isLoading, setIsLoading] = useState(false);

  // Load initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        // Fetch analysis results with default weights
        const response = await fetch('/api/stocks/analyze');
        const data = await response.json();
        
        if (data.success) {
          setAnalysisResults(data.results);
          
          // Calculate sector distribution
          const sectorMap = new Map<string, number>();
          data.results.forEach((result: StockAnalysisResult) => {
            const stock = stocks.find(s => s.ticker === result.ticker);
            if (stock && stock.sector) {
              sectorMap.set(stock.sector, (sectorMap.get(stock.sector) || 0) + 1);
            }
          });
          
          const sectorChartData = Array.from(sectorMap.entries()).map(([name, value]) => ({
            name,
            value
          }));
          
          setSectorData(sectorChartData);
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Fetch stock data first
    const fetchStocks = async () => {
      try {
        const response = await fetch('/api/stocks/screen');
        const data = await response.json();
        
        if (data.success) {
          setStocks(data.stocks);
          fetchInitialData();
        }
      } catch (error) {
        console.error('Error fetching stocks:', error);
        setIsLoading(false);
      }
    };
    
    fetchStocks();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Stock Analysis Visualizations</h2>
      
      {isLoading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : analysisResults.length > 0 ? (
        <>
          <div className="mb-4">
            <div className="flex border-b">
              <button
                className={`px-4 py-2 ${activeTab === 'bar' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('bar')}
              >
                Score Comparison
              </button>
              <button
                className={`px-4 py-2 ${activeTab === 'line' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('line')}
              >
                Overall Ranking
              </button>
              <button
                className={`px-4 py-2 ${activeTab === 'radar' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('radar')}
              >
                Top Stock Comparison
              </button>
              <button
                className={`px-4 py-2 ${activeTab === 'pie' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('pie')}
              >
                Sector Distribution
              </button>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-md">
            {activeTab === 'bar' && (
              <div>
                <h3 className="text-lg font-medium mb-2">Score Comparison for Top Stocks</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Compare growth, financial health, and price performance scores for the top 5 stocks.
                </p>
                <TopStocksBarChart data={analysisResults} />
              </div>
            )}
            
            {activeTab === 'line' && (
              <div>
                <h3 className="text-lg font-medium mb-2">Overall Score Ranking</h3>
                <p className="text-sm text-gray-500 mb-4">
                  View the overall score trend across the top 10 ranked stocks.
                </p>
                <OverallScoreChart data={analysisResults} />
              </div>
            )}
            
            {activeTab === 'radar' && (
              <div>
                <h3 className="text-lg font-medium mb-2">Top 3 Stocks Comparison</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Compare the top 3 stocks across all scoring dimensions.
                </p>
                <StockComparisonRadarChart data={analysisResults} />
              </div>
            )}
            
            {activeTab === 'pie' && (
              <div>
                <h3 className="text-lg font-medium mb-2">Sector Distribution</h3>
                <p className="text-sm text-gray-500 mb-4">
                  View the distribution of top stocks across different sectors.
                </p>
                {sectorData.length > 0 ? (
                  <SectorDistributionChart data={sectorData} />
                ) : (
                  <div className="h-64 flex items-center justify-center">
                    <p className="text-gray-500">No sector data available</p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="mt-6 text-sm text-gray-500">
            <p>
              These visualizations help you understand the relative strengths and weaknesses of each stock
              across different evaluation criteria. Use these insights to make more informed investment decisions.
            </p>
          </div>
        </>
      ) : (
        <div className="h-64 bg-white p-6 rounded-lg shadow-md flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 mb-4">No analysis data available.</p>
            <p className="text-gray-500">Use the screening form to analyze stocks.</p>
          </div>
        </div>
      )}
    </div>
  );
}
