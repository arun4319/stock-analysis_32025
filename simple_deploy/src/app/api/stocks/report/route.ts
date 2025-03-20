import { mockStocks } from '@/lib/stock-analysis/data';
import { generateStockReport, screenStocks } from '@/lib/stock-analysis/analyzer';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    
    // Get report settings
    const topStocksCount = parseInt(searchParams.get('topStocksCount') || '5');
    const includeAdditionalStocks = searchParams.get('includeAdditional') === 'true';
    const additionalStocksCount = parseInt(searchParams.get('additionalCount') || '5');
    const includeSectorAnalysis = searchParams.get('includeSectors') === 'true';
    const includeInvestmentStrategies = searchParams.get('includeStrategies') === 'true';
    
    // Get analysis weights
    const growthWeight = parseFloat(searchParams.get('growthWeight') || '0.5');
    const financialWeight = parseFloat(searchParams.get('financialWeight') || '0.3');
    const performanceWeight = parseFloat(searchParams.get('performanceWeight') || '0.2');
    
    // Normalize weights to ensure they sum to 1
    const totalWeight = growthWeight + financialWeight + performanceWeight;
    const normalizedGrowthWeight = growthWeight / totalWeight;
    const normalizedFinancialWeight = financialWeight / totalWeight;
    const normalizedPerformanceWeight = performanceWeight / totalWeight;
    
    // Generate report
    const report = generateStockReport(mockStocks, {
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
        topStocksCount,
        includeAdditionalStocks,
        additionalStocksCount,
        includeSectorAnalysis,
        includeInvestmentStrategies,
      },
    });

    // Return the report
    return Response.json({ 
      success: true, 
      report
    });
  } catch (error) {
    console.error('Error in stock report API:', error);
    return Response.json({ 
      success: false, 
      error: 'Failed to generate stock report' 
    }, { status: 500 });
  }
}
