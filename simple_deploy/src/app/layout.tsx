import React from 'react';
import Navbar from '@/components/Navbar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-6xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
      <footer className="bg-white mt-12 py-6 border-t">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} StockAnalyzer. All rights reserved.</p>
          <p className="mt-2">
            This application is for educational purposes only. Not financial advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
