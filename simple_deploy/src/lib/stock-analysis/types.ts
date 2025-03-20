// Stock analysis types

export interface StockCriteria {
  maxPrice: number;
  minPrice: number;
  sectors?: string[];
  excludeSectors?: string[];
  minMarketCap?: number;
}

export interface StockData {
  ticker: string;
  companyName: string;
  currentPrice: number;
  sector?: string;
  industry?: string;
  marketCap?: number;
  peRatio?: number;
  targetPrice?: number;
  recommendation?: string;
  revenueGrowth?: number;
  profitMargins?: number;
  yearlyPriceChangePct?: number;
  weekHigh52?: number;
  weekLow52?: number;
  description?: string;
}

export interface StockAnalysisResult {
  ticker: string;
  companyName: string;
  currentPrice: number;
  growthScore: number;
  financialHealthScore: number;
  pricePerformanceScore: number;
  overallScore: number;
  rank: number;
}

export interface StockReport {
  timestamp: string;
  topStocks: StockAnalysisResult[];
  additionalStocks?: StockAnalysisResult[];
  sectorAnalysis?: Record<string, StockAnalysisResult[]>;
}

export interface AnalysisWeights {
  growthPotential: number;
  financialHealth: number;
  pricePerformance: number;
}

export interface GrowthMetrics {
  analystRecommendation: number;
  upsidePotential: number;
  revenueGrowth: number;
  profitMargins: number;
}

export interface FinancialMetrics {
  peRatio: number;
  marketCap: number;
  profitMargins: number;
}

export interface PerformanceMetrics {
  yearlyPriceChange: number;
  distanceFromHigh: number;
  distanceFromLow: number;
}

export interface AnalysisConfig {
  stockCriteria: StockCriteria;
  analysisWeights: AnalysisWeights;
  growthMetrics: GrowthMetrics;
  financialMetrics: FinancialMetrics;
  performanceMetrics: PerformanceMetrics;
  reportSettings: {
    topStocksCount: number;
    includeAdditionalStocks: boolean;
    additionalStocksCount: number;
    includeSectorAnalysis: boolean;
    includeInvestmentStrategies: boolean;
  };
}
