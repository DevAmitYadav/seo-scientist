"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AuditDetailsRenderer from '../audit-details-renderer/page';
import LoadingSpinner from '../loading-spinner/page';

const AuditItem = ({ audit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);

  if (!audit) return null;

  const passed = audit.score === 1;
  const notApplicable = audit.scoreDisplayMode === 'notApplicable';

  // Gradient colors based on status
  const statusGradient = notApplicable
    ? 'from-gray-400 to-gray-600'
    : passed
    ? 'from-green-400 to-green-600'
    : 'from-red-400 to-red-600';

  const statusText = notApplicable ? 'N/A' : passed ? 'Passed' : 'Failed';

  const toggleDetails = () => {
    if (!isOpen && !audit.details) {
      setLoadingDetails(true);
      setTimeout(() => {
        setLoadingDetails(false);
      }, 800);
    }
    setIsOpen(!isOpen);
  };

  return (
    <motion.div
      layout
      className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-3xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
    >
      {/* Colored accent bar */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-2 rounded-l-3xl bg-gradient-to-b ${statusGradient}`}
      />

      <button
        onClick={toggleDetails}
        className="w-full p-5 flex items-center justify-between focus:outline-none"
        aria-expanded={isOpen}
        aria-controls={`audit-details-${audit.id || audit.title.replace(/\s+/g, '-')}`}
      >
        <div className="flex-1 pr-6 text-left">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 select-none">
            {audit.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 select-none">
            {audit.description}
          </p>
        </div>

        <div className="flex-shrink-0 flex items-center space-x-4">
          <span
            className={`font-semibold text-lg ${
              notApplicable
                ? 'text-gray-500'
                : passed
                ? 'text-green-700 dark:text-green-400'
                : 'text-red-700 dark:text-red-400'
            } select-none`}
          >
            {statusText}
          </span>
          <svg
            className={`w-7 h-7 transform transition-transform duration-300 ${
              isOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            focusable="false"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="details"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="bg-gray-50 dark:bg-gray-800 p-6 pt-0 border-t border-gray-300 dark:border-gray-700 rounded-b-3xl text-gray-700 dark:text-gray-300"
            id={`audit-details-${audit.id || audit.title.replace(/\s+/g, '-')}`}
            role="region"
            aria-live="polite"
          >
            {loadingDetails ? (
              <div className="flex justify-center items-center py-6">
                <LoadingSpinner />
              </div>
            ) : audit.details ? (
              <AuditDetailsRenderer details={audit.details} />
            ) : (
              <div className="text-sm text-gray-500 dark:text-gray-400 p-4 rounded-md italic">
                No additional details available.
              </div>
            )}

            {audit.warnings && audit.warnings.length > 0 && (
              <div className="mt-6 p-4 bg-yellow-100 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-300 rounded-lg text-sm shadow-inner">
                <span className="font-semibold">Warnings:</span>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  {audit.warnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}

            {audit.learnMoreEl && audit.learnMoreEl.href && (
              <div className="mt-6 text-sm">
                <a
                  href={audit.learnMoreEl.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 dark:text-blue-400 hover:underline font-medium"
                >
                  Learn more
                </a>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AuditItem;
