'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { StockReport } from '@/lib/stock-analysis/types';

function ReportContent() {
  const searchParams = useSearchParams();
  const [report, setReport] = useState<StockReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setIsLoading(true);
        // Get all search params and pass them to the API
        const params = new URLSearchParams();
        searchParams.forEach((value, key) => {
          params.append(key, value);
        });

        const response = await fetch(`/api/stocks/report?${params.toString()}`);
        const data = await response.json();

        if (data.success) {
          setReport(data.report);
        } else {
          setError(data.error || 'Failed to generate report');
        }
      } catch (err) {
        setError('An error occurred while generating the report');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg">Generating comprehensive stock report...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold mb-2">Error</h1>
          <p className="text-gray-600">{error}</p>
          <button 
            onClick={() => window.history.back()}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-yellow-500 text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold mb-2">No Report Data</h1>
          <p className="text-gray-600">No report data is available.</p>
          <button 
            onClick={() => window.history.back()}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Format date for display
  const reportDate = new Date(report.timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Stock Analysis Report</h1>
            <div className="text-sm text-gray-500">{reportDate}</div>
          </div>

          <div className="prose max-w-none">
            <h2 className="text-2xl font-semibold mb-4">Executive Summary</h2>
            <p className="mb-6">
              This report presents a comprehensive analysis of US stocks under $15 with strong growth potential.
              Through a multi-stage research and analysis process, we identified promising stocks across various sectors,
              with particular focus on technology, quantum computing, and AI. After thorough evaluation using a weighted
              scoring system that considered growth metrics, financial health, and price performance, we identified the
              top recommendations that offer the best combination of growth potential and reasonable risk.
            </p>

            <h2 className="text-2xl font-semibold mb-4">Top Stock Recommendations</h2>
            <div className="overflow-x-auto mb-8">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticker</th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Growth</th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Financial</th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                    <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Overall</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {report.topStocks.map((stock) => (
                    <tr key={stock.ticker}>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">{stock.rank}</td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{stock.ticker}</td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">{stock.companyName}</td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">${stock.currentPrice.toFixed(2)}</td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">{stock.growthScore.toFixed(1)}</td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">{stock.financialHealthScore.toFixed(1)}</td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">{stock.pricePerformanceScore.toFixed(1)}</td>
                      <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-green-600">{stock.overallScore.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {report.additionalStocks && report.additionalStocks.length > 0 && (
              <>
                <h2 className="text-2xl font-semibold mb-4">Additional Promising Stocks</h2>
                <div className="overflow-x-auto mb-8">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticker</th>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Overall</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {report.additionalStocks.map((stock) => (
                        <tr key={stock.ticker}>
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">{stock.rank}</td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{stock.ticker}</td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">{stock.companyName}</td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">${stock.currentPrice.toFixed(2)}</td>
                          <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-green-600">{stock.overallScore.toFixed(1)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {report.sectorAnalysis && Object.keys(report.sectorAnalysis).length > 0 && (
              <>
                <h2 className="text-2xl font-semibold mb-4">Sector Analysis</h2>
                {Object.entries(report.sectorAnalysis).map(([sector, stocks]) => (
                  <div key={sector} className="mb-6">
                    <h3 className="text-xl font-medium mb-3">{sector}</h3>
                    <p className="mb-3">
                      {sector === 'Technology' && 'The technology sector continues to drive innovation and growth across the economy. Companies in this space benefit from digital transformation trends and increasing technology adoption.'}
                      {sector === 'Healthcare' && 'Healthcare remains a defensive sector with growth opportunities driven by aging populations, medical innovations, and increasing healthcare spending.'}
                      {sector === 'Consumer Cyclical' && 'Consumer cyclical stocks are sensitive to economic cycles but can offer strong growth during economic expansions and recovery periods.'}
                      {sector === 'Communication Services' && 'Communication services companies benefit from increasing digital connectivity, content consumption, and the growth of social media platforms.'}
                      {sector === 'Industrials' && 'Industrial companies are positioned to benefit from infrastructure spending, manufacturing reshoring, and automation trends.'}
                      {!['Technology', 'Healthcare', 'Consumer Cyclical', 'Communication Services', 'Industrials'].includes(sector) && 
                        `Companies in the ${sector} sector offer exposure to specific market dynamics and growth opportunities within their industry.`}
                    </p>
                    <div className="overflow-x-auto mb-4">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticker</th>
                            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Overall Score</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {stocks.map((stock) => (
                            <tr key={stock.ticker}>
                              <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{stock.ticker}</td>
                              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">{stock.companyName}</td>
                              <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">${stock.currentPrice.toFixed(2)}</td>
                              <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-green-600">{stock.overallScore.toFixed(1)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </>
            )}

            <h2 className="text-2xl font-semibold mb-4">Investment Considerations</h2>
            <p className="mb-3">When considering these recommendations, investors should keep in mind:</p>
            <ol className="list-decimal pl-6 mb-6 space-y-2">
              <li><strong>Risk Tolerance:</strong> Many of these stocks, particularly in the technology and growth sectors, represent companies with higher volatility. Investors should align their selections with their risk tolerance.</li>
              <li><strong>Diversification:</strong> Consider spreading investments across different sectors rather than concentrating in a single industry.</li>
              <li><strong>Investment Horizon:</strong> These recommendations are based on growth potential, which may take time to materialize. A longer investment horizon is generally recommended.</li>
              <li><strong>Market Conditions:</strong> The broader market environment and economic conditions can impact all stocks, regardless of individual company performance.</li>
              <li><strong>Due Diligence:</strong> While our analysis is comprehensive, investors should conduct their own research and due diligence before making investment decisions.</li>
            </ol>

            <h2 className="text-2xl font-semibold mb-4">Methodology</h2>
            <p className="mb-3">Our analysis followed a structured approach:</p>
            <ol className="list-decimal pl-6 mb-6 space-y-2">
              <li><strong>Initial Screening:</strong> We conducted extensive screening to identify stocks under $15 with growth potential, focusing on price, sector, and market capitalization criteria.</li>
              <li><strong>Data Collection:</strong> We gathered comprehensive data on promising stocks, including current prices, 52-week highs and lows, company descriptions, financial metrics, analyst recommendations, and growth indicators.</li>
              <li><strong>Multi-Factor Analysis:</strong> We evaluated each stock across three key dimensions:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li><strong>Growth Potential (50% weight):</strong> Analyst recommendations, upside potential, revenue growth, profit margins</li>
                  <li><strong>Financial Health (30% weight):</strong> PE ratio, market capitalization, profit margins</li>
                  <li><strong>Price Performance (20% weight):</strong> Yearly price change, position relative to 52-week high/low</li>
                </ul>
              </li>
              <li><strong>Scoring System:</strong> Each stock received scores in these categories, which were weighted to calculate an overall score that determined our final rankings.</li>
            </ol>

            <div className="border-t border-gray-200 pt-6 mt-8">
              <p className="text-sm text-gray-500">
                <strong>Disclaimer:</strong> This report is for informational purposes only and does not constitute investment advice. 
                Always conduct your own research and consult with a financial advisor before making investment decisions.
                Stock prices and metrics are as of {reportDate}.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-6 text-center">
        <button 
          onClick={() => window.print()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md mr-4"
        >
          Print Report
        </button>
        <button 
          onClick={() => window.history.back()}
          className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default function ReportPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg">Loading report...</p>
        </div>
      </div>
    }>
      <ReportContent />
    </Suspense>
  );
}
