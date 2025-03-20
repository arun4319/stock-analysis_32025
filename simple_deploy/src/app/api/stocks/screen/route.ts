import { mockStocks } from '@/lib/stock-analysis/data';
import { analyzeStocks, screenStocks } from '@/lib/stock-analysis/analyzer';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '15');
    const minPrice = parseFloat(searchParams.get('minPrice') || '0.1');
    const sectors = searchParams.get('sectors')?.split(',') || [];
    const excludeSectors = searchParams.get('excludeSectors')?.split(',') || [];
    const minMarketCap = parseFloat(searchParams.get('minMarketCap') || '50000000');

    // Screen stocks based on criteria
    const screenedStocks = screenStocks(mockStocks, {
      maxPrice,
      minPrice,
      sectors: sectors.length > 0 ? sectors : undefined,
      excludeSectors: excludeSectors.length > 0 ? excludeSectors : undefined,
      minMarketCap: isNaN(minMarketCap) ? undefined : minMarketCap,
    });

    // Return the screened stocks
    return Response.json({ 
      success: true, 
      count: screenedStocks.length,
      stocks: screenedStocks 
    });
  } catch (error) {
    console.error('Error in stock screening API:', error);
    return Response.json({ 
      success: false, 
      error: 'Failed to screen stocks' 
    }, { status: 500 });
  }
}
