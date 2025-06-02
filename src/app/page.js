'use client';
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import SEOForm from './components/seo-form/page';
import LighthouseReport from './components/lighthouse-report/page';
import SEOResults from './components/seo-result/page';
import LoadingSpinner from './components/loading-spinner/page';

const cardClasses =
  'bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 ring-1 ring-gray-200 dark:ring-gray-700';

const sidebarWidth = 360; // px

const Home = () => {
  const [results, setResults] = useState(null);
  const [sourceUrl, setSourceUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [liveUpdateEnabled, setLiveUpdateEnabled] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    setShowSidebar(!results);
  }, [results]);

  const fetchAuditData = async (url) => {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!apiBase) {
      throw new Error('API base URL is not set in .env.local');
    }
    try {
      const query = new URLSearchParams({ url });
      const res = await fetch(`${apiBase}/pagespeed?${query.toString()}`);
      if (!res.ok) {
        let errMsg = 'Failed to fetch audit data.';
        try {
          const errData = await res.json();
          errMsg = errData.error || errMsg;
        } catch {
          errMsg = `Error ${res.status}: ${res.statusText}`;
        }
        throw new Error(errMsg);
      }
      const data = await res.json();
      return data;
    } catch (err) {
      console.error('Audit error:', err);
      throw err;
    }
  };

  const handleRunTest = async ({ url }) => {
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = `https://${url}`;
      }
      setSourceUrl(url);
      const data = await fetchAuditData(url);
      setResults(data);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred during the audit.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let intervalId;
    if (liveUpdateEnabled && sourceUrl) {
      intervalId = setInterval(async () => {
        try {
          const data = await fetchAuditData(sourceUrl);
          setResults(data);
        } catch (err) {
          console.error('Live update error:', err);
        }
      }, 60000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [liveUpdateEnabled, sourceUrl]);

  return (
    <>
      <Head>
        <title>LightHouse - Advanced SEO & Performance Audit</title>
        <meta
          name="description"
          content="Analyze your website's performance, SEO, accessibility, and more with our advanced Lighthouse auditing tool."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-100 p-6 sm:p-12 transition-colors duration-700">
        <div className="max-w-7xl mx-auto relative">
          {/* Toggle Sidebar Button */}
          {results && (
            <button
              onClick={() => setShowSidebar((prev) => !prev)}
              aria-label={showSidebar ? 'Hide form sidebar' : 'Show form sidebar'}
              title={showSidebar ? 'Hide form sidebar' : 'Show form sidebar'}
              className={`fixed top-6 left-6 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-400 transform transition-transform duration-500 ${
                showSidebar ? 'rotate-180' : 'rotate-0'
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="currentColor"
                strokeWidth={3}
                viewBox="0 0 24 24"
                className="w-7 h-7"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          <div className="flex gap-10">
            {/* Sidebar */}
            <AnimatePresence initial={false}>
              {showSidebar && (
                <motion.aside
                  key="sidebar"
                  initial={{ x: -sidebarWidth - 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -sidebarWidth - 20, opacity: 0 }}
                  transition={{ duration: 0.45, ease: 'easeInOut' }}
                  className={`${cardClasses} sticky top-14 max-h-[calc(100vh-3.5rem)] overflow-y-auto w-[${sidebarWidth}px] min-w-[${sidebarWidth}px] bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800`}
                  style={{ flexShrink: 0, width: sidebarWidth, boxShadow: '0 8px 24px rgba(99, 102, 241, 0.15)' }}
                >
                  <SEOForm onSubmit={handleRunTest} loading={loading} />
                </motion.aside>
              )}
            </AnimatePresence>

            {/* Main Results area */}
            <div
              className="flex-1 space-y-12"
              style={{
                maxWidth: showSidebar ? `calc(100% - ${sidebarWidth}px)` : '100%',
                transition: 'max-width 0.45s ease',
              }}
            >
              {/* Live Update & Results Card */}
              <AnimatePresence>
                {results && (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    className={`${cardClasses} space-y-8`}
                    style={{
                      boxShadow: '0 12px 28px rgba(139, 92, 246, 0.2)',
                      border: '1px solid transparent',
                      backgroundImage: 'linear-gradient(white, white), radial-gradient(circle at top left, #7c3aed, #4338ca)',
                      backgroundOrigin: 'border-box',
                      backgroundClip: 'padding-box, border-box',
                    }}
                  >
                    {/* Live Update Toggle */}
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-indigo-900 dark:text-indigo-300 select-none">
                        Live Updates
                      </span>
                      <div className="flex items-center space-x-5">
                        <button
                          onClick={() => setLiveUpdateEnabled((prev) => !prev)}
                          className={`px-5 py-2 rounded-full font-semibold transition-colors duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-500 ${
                            liveUpdateEnabled
                              ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                              : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                          }`}
                        >
                          {liveUpdateEnabled ? 'On' : 'Off'}
                        </button>
                        {liveUpdateEnabled && (
                          <span className="text-sm text-indigo-600 dark:text-indigo-400 animate-pulse select-none">
                            Updating every 60 seconds...
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Results Display */}
                    <div className="space-y-8">
                      <LighthouseReport data={results} />
                      <SEOResults data={results} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Loading State Card */}
              <AnimatePresence>
                {loading && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`${cardClasses} flex flex-col items-center justify-center animate-fadeIn`}
                    style={{
                      boxShadow: '0 12px 24px rgba(99, 102, 241, 0.1)',
                    }}
                  >
                    <LoadingSpinner />
                    <p className="mt-5 text-xl font-medium text-indigo-900 dark:text-indigo-200 select-none">
                      Running Lighthouse audit, please wait...
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error State Card */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-red-50 dark:bg-red-900 rounded-3xl shadow-lg p-8 border border-red-300 dark:border-red-700 animate-fadeIn"
                    style={{ boxShadow: '0 6px 18px rgba(220, 38, 38, 0.25)' }}
                  >
                    <h3 className="font-extrabold text-2xl mb-3 text-red-700 dark:text-red-400 select-none">
                      Error!
                    </h3>
                    <p className="text-red-700 dark:text-red-300 select-text">{error}</p>
                    <p className="mt-3 text-sm text-red-600 dark:text-red-400 select-text">
                      Please check the URL and ensure your backend is running at{' '}
                      <code className="bg-red-200 dark:bg-red-800 px-1 py-0.5 rounded font-mono select-all">
                        {process.env.NEXT_PUBLIC_API_BASE_URL}/pagespeed
                      </code>
                      .
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
