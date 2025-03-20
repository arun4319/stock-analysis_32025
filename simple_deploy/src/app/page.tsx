'use client';

import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <div className="max-w-4xl w-full px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Stock Analysis Made Simple
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find US stocks under $15 with strong growth potential using our advanced analysis tools
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-blue-600 text-4xl mb-4">📊</div>
            <h2 className="text-xl font-semibold mb-2">Screen Stocks</h2>
            <p className="text-gray-600 mb-4">
              Filter stocks by price range, sector, and market cap to find opportunities that match your criteria.
            </p>
            <Link 
              href="/"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Start screening →
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-blue-600 text-4xl mb-4">📈</div>
            <h2 className="text-xl font-semibold mb-2">Analyze Performance</h2>
            <p className="text-gray-600 mb-4">
              Visualize stock performance with interactive charts and compare metrics across top performers.
            </p>
            <Link 
              href="/dashboard"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              View dashboard →
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-blue-600 text-4xl mb-4">📝</div>
            <h2 className="text-xl font-semibold mb-2">Generate Reports</h2>
            <p className="text-gray-600 mb-4">
              Create comprehensive stock analysis reports with customizable parameters and insights.
            </p>
            <Link 
              href="/generate-report"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Create report →
            </Link>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-8 mb-16">
          <h2 className="text-2xl font-bold mb-4">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center text-blue-600 font-bold text-xl mb-4">1</div>
              <h3 className="font-medium mb-2">Screen Stocks</h3>
              <p className="text-gray-600">Set your criteria to find stocks that match your investment goals</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center text-blue-600 font-bold text-xl mb-4">2</div>
              <h3 className="font-medium mb-2">Analyze Results</h3>
              <p className="text-gray-600">Review detailed analysis of growth potential, financial health, and price performance</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center text-blue-600 font-bold text-xl mb-4">3</div>
              <h3 className="font-medium mb-2">Make Decisions</h3>
              <p className="text-gray-600">Use insights and reports to make informed investment decisions</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-6">Ready to find your next investment?</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md"
            >
              Start Screening Now
            </Link>
            <Link 
              href="/generate-report"
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-6 rounded-md"
            >
              Generate Report
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
