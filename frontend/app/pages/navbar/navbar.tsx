import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Loader2 } from 'lucide-react';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false); // Just for example, not connected to anything here
  const [error, setError] = useState<string | null>(null); // An example error, if one were to occur

  // Little loading message
  const LoadingIndicator = () => (
    <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
      <Loader2 className="h-4 w-4 animate-spin" />
      <span>Loading...</span>
    </div>
  );

  // For when something goes wrong
  const ErrorDisplay = ({ message }: { message: string }) => (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-3 py-2 rounded-md shadow-sm flex items-center gap-2">
      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
      <span className="text-sm">{message}</span>
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-900">
      <header className="relative py-4 md:py-6 z-50">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between py-2">
            <Link to="/" className="text-xl font-bold text-gray-900 dark:text-white">
              PolicySim
            </Link>

            {/* Main navigation links */}
            <nav className="hidden lg:flex lg:items-center lg:space-x-12">
              <Link to="/search" className="text-base font-medium text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300">
                Policies
              </Link>
              <Link to="/simulator" className="text-base font-medium text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300">
                Simulation
              </Link>
              <Link to="/support" className="text-base font-medium text-gray-900 dark:text-white hover:text-gray-700 dark:hover:text-gray-300">
                Support
              </Link>
            </nav>

            <div className="lg:hidden">
              {/* This button opens the mobile menu */}
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 text-gray-900 dark:text-white rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <span className="sr-only">Toggle main menu</span>
                <svg
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Just showing these beneath the nav for a consistent look. */}
          {loading && <LoadingIndicator />}
          {error && <ErrorDisplay message={error} />}

          {isMenuOpen && (
            <div className="lg:hidden py-4">
              <div className="flex flex-col space-y-4">
                {/* Mobile menu links */}
                <Link to="/search" className="text-base font-medium text-gray-900 dark:text-white" onClick={() => setIsMenuOpen(false)}>
                  Policies
                </Link>
                <Link to="/simulator" className="text-base font-medium text-gray-900 dark:text-white" onClick={() => setIsMenuOpen(false)}>
                  Simulation
                </Link>
                <Link to="/support" className="text-base font-medium text-gray-900 dark:text-white" onClick={() => setIsMenuOpen(false)}>
                  Support
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>
    </div>
  );
}