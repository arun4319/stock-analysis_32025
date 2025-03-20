'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { StockAnalysisResult } from '@/lib/stock-analysis/types';

interface ScoreChartProps {
  data: StockAnalysisResult[];
}

export const TopStocksBarChart: React.FC<ScoreChartProps> = ({ data }) => {
  // Only use top 5 stocks for the chart
  const chartData = data.slice(0, 5).map(stock => ({
    name: stock.ticker,
    growth: parseFloat(stock.growthScore.toFixed(2)),
    financial: parseFloat(stock.financialHealthScore.toFixed(2)),
    performance: parseFloat(stock.pricePerformanceScore.toFixed(2)),
    overall: parseFloat(stock.overallScore.toFixed(2))
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={chartData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis domain={[0, 5]} />
        <Tooltip />
        <Legend />
        <Bar dataKey="growth" name="Growth Score" fill="#8884d8" />
        <Bar dataKey="financial" name="Financial Health" fill="#82ca9d" />
        <Bar dataKey="performance" name="Price Performance" fill="#ffc658" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const OverallScoreChart: React.FC<ScoreChartProps> = ({ data }) => {
  // Only use top 10 stocks for the chart
  const chartData = data.slice(0, 10).map(stock => ({
    name: stock.ticker,
    score: parseFloat(stock.overallScore.toFixed(2))
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={chartData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis domain={[0, 5]} />
        <Tooltip />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="score" 
          name="Overall Score" 
          stroke="#ff7300" 
          activeDot={{ r: 8 }} 
          strokeWidth={2}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export const SectorDistributionChart: React.FC<{ data: any[] }> = ({ data }) => {
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658'];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value, name, props) => [`${value} stocks`, name]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export const StockComparisonRadarChart: React.FC<ScoreChartProps> = ({ data }) => {
  // Only use top 3 stocks for the radar chart
  const topStocks = data.slice(0, 3);
  
  const chartData = [
    { subject: 'Growth', A: 0, B: 0, C: 0 },
    { subject: 'Financial', A: 0, B: 0, C: 0 },
    { subject: 'Performance', A: 0, B: 0, C: 0 },
    { subject: 'Overall', A: 0, B: 0, C: 0 },
  ];
  
  // Populate chart data
  if (topStocks.length > 0) {
    chartData[0].A = parseFloat(topStocks[0].growthScore.toFixed(2));
    chartData[1].A = parseFloat(topStocks[0].financialHealthScore.toFixed(2));
    chartData[2].A = parseFloat(topStocks[0].pricePerformanceScore.toFixed(2));
    chartData[3].A = parseFloat(topStocks[0].overallScore.toFixed(2));
  }
  
  if (topStocks.length > 1) {
    chartData[0].B = parseFloat(topStocks[1].growthScore.toFixed(2));
    chartData[1].B = parseFloat(topStocks[1].financialHealthScore.toFixed(2));
    chartData[2].B = parseFloat(topStocks[1].pricePerformanceScore.toFixed(2));
    chartData[3].B = parseFloat(topStocks[1].overallScore.toFixed(2));
  }
  
  if (topStocks.length > 2) {
    chartData[0].C = parseFloat(topStocks[2].growthScore.toFixed(2));
    chartData[1].C = parseFloat(topStocks[2].financialHealthScore.toFixed(2));
    chartData[2].C = parseFloat(topStocks[2].pricePerformanceScore.toFixed(2));
    chartData[3].C = parseFloat(topStocks[2].overallScore.toFixed(2));
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" />
        <PolarRadiusAxis angle={30} domain={[0, 5]} />
        {topStocks.length > 0 && (
          <Radar name={topStocks[0].ticker} dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
        )}
        {topStocks.length > 1 && (
          <Radar name={topStocks[1].ticker} dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
        )}
        {topStocks.length > 2 && (
          <Radar name={topStocks[2].ticker} dataKey="C" stroke="#ffc658" fill="#ffc658" fillOpacity={0.6} />
        )}
        <Legend />
        <Tooltip />
      </RadarChart>
    </ResponsiveContainer>
  );
};
