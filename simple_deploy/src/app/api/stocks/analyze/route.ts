import { mockStocks } from '@/lib/stock-analysis/data';
import { analyzeStocks } from '@/lib/stock-analysis/analyzer';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters for analysis weights
    const searchParams = request.nextUrl.searchParams;
    
    // Get analysis weights
    const growthWeight = parseFloat(searchParams.get('growthWeight') || '0.5');
    const financialWeight = parseFloat(searchParams.get('financialWeight') || '0.3');
    const performanceWeight = parseFloat(searchParams.get('performanceWeight') || '0.2');
    
    // Normalize weights to ensure they sum to 1
    const totalWeight = growthWeight + financialWeight + performanceWeight;
    const normalizedGrowthWeight = growthWeight / totalWeight;
    const normalizedFinancialWeight = financialWeight / totalWeight;
    const normalizedPerformanceWeight = performanceWeight / totalWeight;
    
    // Analyze stocks with custom weights
    const analysisResults = analyzeStocks(mockStocks, {
      stockCriteria: {
        maxPrice: 15,
        minPrice: 0.1,
      },
      analysisWeights: {
        growthPotential: normalizedGrowthWeight,
        financialHealth: normalizedFinancialWeight,
        pricePerformance: normalizedPerformanceWeight,
      },
      growthMetrics: {
        analystRecommendation: 0.25,
        upsidePotential: 0.35,
        revenueGrowth: 0.25,
        profitMargins: 0.15,
      },
      financialMetrics: {
        peRatio: 0.4,
        marketCap: 0.3,
        profitMargins: 0.3,
      },
      performanceMetrics: {
        yearlyPriceChange: 0.4,
        distanceFromHigh: 0.3,
        distanceFromLow: 0.3,
      },
      reportSettings: {
        topStocksCount: 5,
        includeAdditionalStocks: true,
        additionalStocksCount: 5,
        includeSectorAnalysis: true,
        includeInvestmentStrategies: true,
      },
    });

    // Return the analysis results
    return Response.json({ 
      success: true, 
      count: analysisResults.length,
      results: analysisResults 
    });
  } catch (error) {
    console.error('Error in stock analysis API:', error);
    return Response.json({ 
      success: false, 
      error: 'Failed to analyze stocks' 
    }, { status: 500 });
  }
}
