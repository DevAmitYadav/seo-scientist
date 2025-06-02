import React, { useEffect } from 'react';
import ScoreCircle from '../score-circle/page'; 

const SEOResults = ({ data }) => {
  if (!data || !data.lighthouseResult) return null;

  const { lighthouseResult } = data;
  const audits = lighthouseResult?.audits;

  // For debugging
  useEffect(() => {
    console.log('SEO Category:', lighthouseResult.categories?.seo);
    console.log('SEO Audits:', audits);
  }, [lighthouseResult]);

  const keyAuditIds = [
    'meta-description',
    'viewport',
    'robots-txt',
    'hreflang',
    'font-size',
    'is-crawlable',
  ];

  // Compute custom SEO score (0–100 scale)
  const totalScore = keyAuditIds.reduce((acc, id) => {
    const audit = audits?.[id];
    return acc + (audit && typeof audit.score === 'number' ? audit.score : 0);
  }, 0);
  const averageScore = Math.round((totalScore / keyAuditIds.length) * 100);

  // Optionally get other scores
  const performance = Math.round((lighthouseResult.categories.performance?.score || 0) * 100);
  const accessibility = Math.round((lighthouseResult.categories.accessibility?.score || 0) * 100);
  const bestPractices = Math.round((lighthouseResult.categories['best-practices']?.score || 0) * 100);
  const seo = Math.round((lighthouseResult.categories.seo?.score || 0) * 100);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 py-10 max-w-6xl mx-auto">
      <ScoreCircle score={performance} label="Performance" />
      <ScoreCircle score={accessibility} label="Accessibility" />
      <ScoreCircle score={bestPractices} label="Best Practices" />
      <ScoreCircle score={seo} label="SEO" />
      <ScoreCircle score={averageScore} label="Custom SEO Score" color="#6366f1" />
    </div>
  );
};

export default SEOResults;
