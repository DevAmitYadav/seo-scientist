'use client';
import React, { useState } from 'react';
import ScoreCircle from '../score-circle/page';
import AuditCategorySection from '../audit-category-section/page';
import LoadingSpinner from '../loading-spinner/page';

const LighthouseReport = ({ data }) => {
  if (!data || !data.lighthouseResult) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 p-12 italic select-none">
        No audit report data available. Please check the input URL or try again.
      </div>
    );
  }

  const { lighthouseResult } = data;
  const { categories, audits, requestedUrl, fetchTime } = lighthouseResult;

  if (!categories || !audits) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 p-12 italic select-none">
        Incomplete audit data. Please re-run the report.
      </div>
    );
  }

  const CATEGORY_ORDER = ['performance', 'accessibility', 'best-practices', 'seo'];
  const totalScore = CATEGORY_ORDER.reduce((sum, key) => {
    const cat = categories[key];
    return sum + (cat?.score ?? 0);
  }, 0);
  const overallScore = Math.round((totalScore / CATEGORY_ORDER.length) * 100);

  const categoryMap = {
    Performance: categories.performance,
    Accessibility: categories.accessibility,
    'Best Practices': categories['best-practices'],
    SEO: categories.seo,
  };

  const computeCustomSEOScore = (audits) => {
    const keyAuditIds = ['meta-description', 'viewport', 'robots-txt', 'hreflang', 'font-size', 'is-crawlable'];
    const totalAuditScore = keyAuditIds.reduce((sum, id) => {
      const audit = audits?.[id];
      return sum + (audit && typeof audit.score === 'number' ? audit.score : 0);
    }, 0);
    return Math.round((totalAuditScore / keyAuditIds.length) * 100);
  };

  const [selectedTab, setSelectedTab] = useState('Performance');

  const getAuditsForCategoryKey = (key) => {
    const category = categoryMap[key];
    if (!category || !category.auditRefs) return [];
    return category.auditRefs.map((ref) => audits[ref.id]).filter(Boolean);
  };

  const categorizeAudits = (categoryAudits) => {
    const opportunities = [];
    const diagnostics = [];
    const passed = [];

    categoryAudits.forEach((audit) => {
      if (audit.scoreDisplayMode === 'notApplicable') return;
      if (audit.score === 0) opportunities.push(audit);
      else if (audit.score === 1) passed.push(audit);
      else if (audit.scoreDisplayMode === 'informative' || audit.scoreDisplayMode === 'manual') {
        diagnostics.push(audit);
      } else if (audit.score > 0 && audit.score < 1) {
        opportunities.push(audit);
      }
    });

    return { opportunities, diagnostics, passed };
  };

  const renderDetailedContent = () => {
    const auditsForCategory = getAuditsForCategoryKey(selectedTab);
    const { opportunities, diagnostics, passed } = categorizeAudits(auditsForCategory);

    if (auditsForCategory.length === 0) {
      return (
        <p className="text-center text-gray-500 dark:text-gray-400 py-8 italic select-none">
          No audit insights found for this category.
        </p>
      );
    }

    return (
      <div className="space-y-14">
        {opportunities.length > 0 && (
          <AuditCategorySection
            title="Top Opportunities for Improvement"
            audits={opportunities}
            type="opportunities"
          />
        )}
        {diagnostics.length > 0 && (
          <AuditCategorySection
            title="Technical Diagnostics & Recommendations"
            audits={diagnostics}
            type="diagnostics"
          />
        )}
        {passed.length > 0 && (
          <AuditCategorySection
            title="Passed Audits (Well-Implemented)"
            audits={passed}
            type="passed"
          />
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto mt-12 p-10 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl animate-fadeIn">
      {/* Header */}
      <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-indigo-600 dark:from-purple-400 dark:to-indigo-500 mb-10 text-center tracking-tight drop-shadow-lg">
        Website Lighthouse Audit Report
      </h2>

      {/* Report Info */}
      <p className="text-center text-gray-700 dark:text-gray-300 text-lg mb-16 select-text max-w-3xl mx-auto">
        Comprehensive performance and accessibility audit for:{' '}
        <span className="font-semibold text-indigo-600 dark:text-indigo-400 break-words underline decoration-indigo-400/50 decoration-2">
          {requestedUrl || 'N/A'}
        </span>
        <br />
        <span className="block mt-2 text-sm font-medium text-gray-600 dark:text-gray-400">
          Generated on{' '}
          <time dateTime={fetchTime}>
            {fetchTime ? new Date(fetchTime).toLocaleString() : 'N/A'}
          </time>
        </span>
      </p>

      {/* Summary Scores */}
      <section className="mb-14 border-b border-gray-300 dark:border-gray-700 pb-14">
        <h3 className="text-3xl font-semibold text-purple-800 dark:text-purple-300 mb-12 text-center tracking-wide">
          Overview of Key Metrics
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-10 justify-items-center">
          <ScoreCircle
            key="overall"
            score={overallScore}
            label="Overall Score"
            color="text-purple-600 dark:text-purple-400"
          />
          {CATEGORY_ORDER.map((key) => {
            const category = categories[key];
            if (!category) return null;
            const score =
              key === 'seo'
                ? computeCustomSEOScore(audits)
                : category.score != null
                ? Math.round(category.score * 100)
                : 0;
            const color =
              score >= 90
                ? 'text-green-600 dark:text-green-400'
                : score >= 50
                ? 'text-yellow-500 dark:text-yellow-400'
                : 'text-red-600 dark:text-red-400';
            return (
              <ScoreCircle
                key={key}
                score={score}
                label={category.title}
                color={color}
              />
            );
          })}
        </div>
      </section>

      {/* Category Tabs */}
      <nav
        className="mb-12 flex justify-center border-b border-gray-300 dark:border-gray-700"
        aria-label="Select Audit Category"
      >
        <ul className="flex space-x-8 relative">
          {Object.keys(categoryMap).map((tab) => (
            <li key={tab} className="relative">
              <button
                type="button"
                onClick={() => setSelectedTab(tab)}
                className={`relative px-8 py-3 text-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-400 rounded-full ${
                  selectedTab === tab
                    ? 'text-white bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg'
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
                aria-current={selectedTab === tab ? 'page' : undefined}
              >
                {tab}
                {selectedTab === tab && (
                  <span
                    className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-14 h-1 bg-blue-500 rounded-full shadow-md"
                    aria-hidden="true"
                  />
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Detailed Results */}
      <section>{renderDetailedContent()}</section>
    </div>
  );
};

export default LighthouseReport;
