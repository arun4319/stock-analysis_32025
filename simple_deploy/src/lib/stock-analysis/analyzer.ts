import { StockData, StockAnalysisResult, AnalysisConfig } from './types';
import { defaultConfig } from './data';

/**
 * Screens stocks based on the provided criteria
 * @param stocks List of stocks to screen
 * @param criteria Screening criteria
 * @returns Filtered list of stocks that match the criteria
 */
export function screenStocks(stocks: StockData[], criteria = defaultConfig.stockCriteria): StockData[] {
  return stocks.filter(stock => {
    // Price range filter
    if (stock.currentPrice < criteria.minPrice || stock.currentPrice > criteria.maxPrice) {
      return false;
    }
    
    // Sector filter (if specified)
    if (criteria.sectors && criteria.sectors.length > 0) {
      if (!stock.sector || !criteria.sectors.includes(stock.sector)) {
        return false;
      }
    }
    
    // Exclude sectors (if specified)
    if (criteria.excludeSectors && criteria.excludeSectors.length > 0) {
      if (stock.sector && criteria.excludeSectors.includes(stock.sector)) {
        return false;
      }
    }
    
    // Market cap filter (if specified)
    if (criteria.minMarketCap && (!stock.marketCap || stock.marketCap < criteria.minMarketCap)) {
      return false;
    }
    
    return true;
  });
}

/**
 * Analyzes growth potential for each stock
 * @param stocks List of stocks to analyze
 * @param config Analysis configuration
 * @returns Map of tickers to growth scores
 */
export function analyzeGrowthPotential(stocks: StockData[], config = defaultConfig): Map<string, number> {
  const growthScores = new Map<string, number>();
  const weights = config.growthMetrics;
  
  stocks.forEach(stock => {
    let score = 0;
    
    // Analyst recommendation score (1-5)
    const recommendationScores: Record<string, number> = {
      'strong buy': 5,
      'buy': 4,
      'hold': 3,
      'underperform': 2,
      'sell': 1,
    };
    
    const recommendationScore = stock.recommendation 
      ? recommendationScores[stock.recommendation.toLowerCase()] || 3 
      : 3;
    
    // Upside potential score
    let upsidePotentialScore = 3; // Default neutral score
    if (stock.targetPrice && stock.currentPrice > 0) {
      const upsidePercent = (stock.targetPrice / stock.currentPrice - 1) * 100;
      // Scale from -100% to +100% to 1-5 score
      upsidePotentialScore = Math.max(1, Math.min(5, (upsidePercent + 100) / 40));
    }
    
    // Revenue growth score
    let revenueGrowthScore = 3; // Default neutral score
    if (stock.revenueGrowth !== undefined) {
      // Scale from -100% to +100% to 1-5 score
      revenueGrowthScore = Math.max(1, Math.min(5, (stock.revenueGrowth * 100 + 100) / 40));
    }
    
    // Profit margins score
    let profitMarginsScore = 3; // Default neutral score
    if (stock.profitMargins !== undefined) {
      // Scale from -50% to +50% to 1-5 score
      profitMarginsScore = Math.max(1, Math.min(5, (stock.profitMargins * 100 + 50) / 20));
    }
    
    // Calculate weighted score
    score = (
      recommendationScore * weights.analystRecommendation +
      upsidePotentialScore * weights.upsidePotential +
      revenueGrowthScore * weights.revenueGrowth +
      profitMarginsScore * weights.profitMargins
    );
    
    growthScores.set(stock.ticker, score);
  });
  
  return growthScores;
}

/**
 * Analyzes financial health for each stock
 * @param stocks List of stocks to analyze
 * @param config Analysis configuration
 * @returns Map of tickers to financial health scores
 */
export function analyzeFinancialHealth(stocks: StockData[], config = defaultConfig): Map<string, number> {
  const financialScores = new Map<string, number>();
  const weights = config.financialMetrics;
  
  stocks.forEach(stock => {
    let score = 0;
    
    // PE ratio score (lower is better, but negative is bad)
    let peRatioScore = 3; // Default neutral score
    if (stock.peRatio !== undefined && stock.peRatio !== null) {
      if (stock.peRatio <= 0) {
        peRatioScore = 1; // Negative PE is bad
      } else if (stock.peRatio <= 15) {
        peRatioScore = 5; // PE <= 15 is excellent
      } else if (stock.peRatio <= 25) {
        peRatioScore = 4; // PE <= 25 is good
      } else if (stock.peRatio <= 35) {
        peRatioScore = 3; // PE <= 35 is average
      } else if (stock.peRatio <= 50) {
        peRatioScore = 2; // PE <= 50 is below average
      } else {
        peRatioScore = 1; // PE > 50 is poor
      }
    }
    
    // Market cap score (higher is better for stability)
    let marketCapScore = 3; // Default neutral score
    if (stock.marketCap !== undefined) {
      if (stock.marketCap >= 10e9) {
        marketCapScore = 5; // Market cap >= $10B is excellent
      } else if (stock.marketCap >= 2e9) {
        marketCapScore = 4; // Market cap >= $2B is good
      } else if (stock.marketCap >= 500e6) {
        marketCapScore = 3; // Market cap >= $500M is average
      } else if (stock.marketCap >= 100e6) {
        marketCapScore = 2; // Market cap >= $100M is below average
      } else {
        marketCapScore = 1; // Market cap < $100M is poor
      }
    }
    
    // Profit margins score (higher is better)
    let profitMarginsScore = 3; // Default neutral score
    if (stock.profitMargins !== undefined) {
      const margins = stock.profitMargins * 100;
      if (margins >= 20) {
        profitMarginsScore = 5; // Profit margins >= 20% is excellent
      } else if (margins >= 10) {
        profitMarginsScore = 4; // Profit margins >= 10% is good
      } else if (margins >= 5) {
        profitMarginsScore = 3; // Profit margins >= 5% is average
      } else if (margins >= 0) {
        profitMarginsScore = 2; // Profit margins >= 0% is below average
      } else {
        profitMarginsScore = 1; // Profit margins < 0% is poor
      }
    }
    
    // Calculate weighted score
    score = (
      peRatioScore * weights.peRatio +
      marketCapScore * weights.marketCap +
      profitMarginsScore * weights.profitMargins
    );
    
    financialScores.set(stock.ticker, score);
  });
  
  return financialScores;
}

/**
 * Analyzes price performance for each stock
 * @param stocks List of stocks to analyze
 * @param config Analysis configuration
 * @returns Map of tickers to price performance scores
 */
export function analyzePricePerformance(stocks: StockData[], config = defaultConfig): Map<string, number> {
  const performanceScores = new Map<string, number>();
  const weights = config.performanceMetrics;
  
  stocks.forEach(stock => {
    let score = 0;
    
    // Yearly price change score
    let yearlyPriceChangeScore = 3; // Default neutral score
    if (stock.yearlyPriceChangePct !== undefined) {
      // Scale from -100% to +100% to 1-5 score
      yearlyPriceChangeScore = Math.max(1, Math.min(5, (stock.yearlyPriceChangePct + 100) / 40));
    }
    
    // Distance from 52-week high score (higher distance = higher score, more room to grow)
    let distanceFromHighScore = 3; // Default neutral score
    if (stock.weekHigh52 !== undefined && stock.currentPrice > 0) {
      const distancePercent = (stock.weekHigh52 - stock.currentPrice) / stock.weekHigh52 * 100;
      // Scale from 0% to 100% to 1-5 score
      distanceFromHighScore = Math.max(1, Math.min(5, distancePercent / 20));
    }
    
    // Distance from 52-week low score (lower distance = higher score, less downside risk)
    let distanceFromLowScore = 3; // Default neutral score
    if (stock.weekLow52 !== undefined && stock.weekLow52 > 0) {
      const distancePercent = (stock.currentPrice - stock.weekLow52) / stock.weekLow52 * 100;
      // Scale from 0% to 100% to 5-1 score (inverse relationship)
      distanceFromLowScore = Math.max(1, Math.min(5, 6 - distancePercent / 20));
    }
    
    // Calculate weighted score
    score = (
      yearlyPriceChangeScore * weights.yearlyPriceChange +
      distanceFromHighScore * weights.distanceFromHigh +
      distanceFromLowScore * weights.distanceFromLow
    );
    
    performanceScores.set(stock.ticker, score);
  });
  
  return performanceScores;
}

/**
 * Calculates overall scores and ranks stocks
 * @param stocks List of stocks to analyze
 * @param config Analysis configuration
 * @returns Array of stock analysis results sorted by overall score
 */
export function analyzeStocks(stocks: StockData[], config = defaultConfig): StockAnalysisResult[] {
  // Get scores for each category
  const growthScores = analyzeGrowthPotential(stocks, config);
  const financialScores = analyzeFinancialHealth(stocks, config);
  const performanceScores = analyzePricePerformance(stocks, config);
  
  // Calculate overall scores
  const results: StockAnalysisResult[] = stocks.map(stock => {
    const growthScore = growthScores.get(stock.ticker) || 3;
    const financialHealthScore = financialScores.get(stock.ticker) || 3;
    const pricePerformanceScore = performanceScores.get(stock.ticker) || 3;
    
    // Calculate weighted overall score
    const overallScore = (
      growthScore * config.analysisWeights.growthPotential +
      financialHealthScore * config.analysisWeights.financialHealth +
      pricePerformanceScore * config.analysisWeights.pricePerformance
    );
    
    return {
      ticker: stock.ticker,
      companyName: stock.companyName,
      currentPrice: stock.currentPrice,
      growthScore,
      financialHealthScore,
      pricePerformanceScore,
      overallScore,
      rank: 0, // Will be set after sorting
    };
  });
  
  // Sort by overall score and assign ranks
  results.sort((a, b) => b.overallScore - a.overallScore);
  results.forEach((result, index) => {
    result.rank = index + 1;
  });
  
  return results;
}

/**
 * Generates a stock analysis report
 * @param stocks List of stocks to analyze
 * @param config Analysis configuration
 * @returns Stock report with top stocks and additional analysis
 */
export function generateStockReport(stocks: StockData[], config = defaultConfig) {
  // Analyze stocks
  const analysisResults = analyzeStocks(stocks, config);
  
  // Get top stocks
  const topStocks = analysisResults.slice(0, config.reportSettings.topStocksCount);
  
  // Get additional stocks if requested
  let additionalStocks: StockAnalysisResult[] | undefined;
  if (config.reportSettings.includeAdditionalStocks) {
    const startIdx = config.reportSettings.topStocksCount;
    const endIdx = startIdx + config.reportSettings.additionalStocksCount;
    additionalStocks = analysisResults.slice(startIdx, endIdx);
  }
  
  // Generate sector analysis if requested
  let sectorAnalysis: Record<string, StockAnalysisResult[]> | undefined;
  if (config.reportSettings.includeSectorAnalysis) {
    sectorAnalysis = {};
    
    // Get sectors from all analyzed stocks
    const sectors = new Set<string>();
    stocks.forEach(stock => {
      if (stock.sector) {
        sectors.add(stock.sector);
      }
    });
    
    // Group analysis results by sector
    sectors.forEach(sector => {
      const sectorStocks = analysisResults.filter(result => {
        const stockData = stocks.find(s => s.ticker === result.ticker);
        return stockData?.sector === sector;
      });
      
      if (sectorStocks.length > 0) {
        sectorAnalysis![sector] = sectorStocks;
      }
    });
  }
  
  return {
    timestamp: new Date().toISOString(),
    topStocks,
    additionalStocks,
    sectorAnalysis,
  };
}
