import React from 'react';
import AuditItem from '../audit-item/page';

const AuditCategorySection = ({ title, audits, type, isLoading }) => {
  if (isLoading) {
    return (
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">{title}</h3>
        <div className="flex justify-center items-center p-6">
          <svg
            className="animate-spin h-10 w-10 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
        </div>
      </div>
    );
  }

  // If there are no audits and the category is not opportunities or diagnostics, show a success message.
  if (!audits || audits.length === 0) {
    if (type === 'opportunities' || type === 'diagnostics') return null;
    return (
      <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-2xl shadow-lg border border-green-200 dark:border-green-700">
        <h3 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-3">{title}</h3>
        <p className="text-gray-700 dark:text-gray-300 text-lg">All audits in this category passed!</p>
      </div>
    );
  }

  return (
    <div className="mb-8 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 animate-fadeIn transition-all hover:shadow-2xl">
      <div className="mb-6">
        <h3 className="text-2xl leading-snug font-bold text-gray-900 dark:text-gray-100 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500">
          {title}
        </h3>
      </div>
      <div className="space-y-4">
        {audits.map((audit) => (
          <AuditItem key={audit.id} audit={audit} />
        ))}
      </div>
    </div>
  );
};

export default AuditCategorySection;
