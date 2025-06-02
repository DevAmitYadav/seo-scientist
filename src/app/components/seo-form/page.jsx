import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertCircle, FiCheckCircle, FiX } from 'react-icons/fi';
import { debounce } from 'lodash';
import { useTheme } from 'next-themes';

const useUrlValidation = (initialUrl = '') => {
  const [url, setUrl] = useState(initialUrl);
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState('');

  const validateUrl = debounce((value) => {
    try {
      new URL(value);
      setIsValid(true);
      setError('');
    } catch {
      setIsValid(false);
      setError('Please enter a valid URL.');
    }
  }, 300);

  useEffect(() => {
    if (url.trim()) {
      validateUrl(url);
    } else {
      setIsValid(false);
      setError('');
    }
    return () => {
      validateUrl.cancel();
    };
  }, [url]);

  return { url, setUrl, isValid, error };
};

const SEOForm = ({ onSubmit, loading }) => {
  const { url, setUrl, isValid, error } = useUrlValidation();
  const inputRef = useRef(null);
  const { theme } = useTheme();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid || !url.trim()) {
      inputRef.current.focus();
      return;
    }
    onSubmit({ url: url.trim() });
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-xl mx-auto p-8 bg-gray-50 dark:bg-gray-900 rounded-3xl shadow-2xl space-y-8 transform transition-all duration-300 hover:shadow-3xl"
      noValidate
    >
      <div className="text-center">
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="text-5xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 dark:from-sky-400 dark:via-blue-400 dark:to-indigo-400"
        >
          SEO Scientist
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-800 dark:text-gray-200 text-lg mt-2"
        >
          Analyze your website's Performance, Accessibility, Best Practices, and SEO.
        </motion.p>
      </div>

      <div className="relative">
        <label htmlFor="url" className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
          Website URL
        </label>
        <div className="relative">
          <input
            ref={inputRef}
            id="url"
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            aria-invalid={error ? 'true' : 'false'}
            className={`w-full px-5 py-4 pr-12 border rounded-lg focus:outline-none focus:ring-4 transition duration-300 ease-in-out text-lg ${
              error
                ? 'border-red-500 focus:ring-red-300'
                : 'border-gray-300 focus:ring-indigo-300 dark:border-gray-700 dark:focus:ring-indigo-700 dark:bg-gray-800'
            }`}
          />
          <AnimatePresence>
            {url && (
              <motion.button
                type="button"
                onClick={() => setUrl('')}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-gray-300 hover:text-gray-800"
              >
                <FiX size={20} />
              </motion.button>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-red-500"
              >
                <FiAlertCircle size={20} />
              </motion.div>
            )}
            {!error && url.trim() !== '' && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-emerald-500"
              >
                <FiCheckCircle size={20} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-2 text-sm text-red-600"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <motion.button
        type="submit"
        disabled={loading || !isValid}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`w-full py-4 text-white font-semibold rounded-lg shadow-lg focus:outline-none focus:ring-4 transition duration-300 ease-in-out text-lg ${
          loading || !isValid
            ? 'bg-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500 hover:from-sky-600 hover:via-blue-600 hover:to-indigo-600 focus:ring-sky-300'
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <motion.svg
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
              className="h-5 w-5 text-white mr-3"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </motion.svg>
            Analyzing...
          </span>
        ) : (
          'Run Full Audit'
        )}
      </motion.button>
    </motion.form>
  );
};

export default SEOForm;
