"use client";

import React, { useState, useEffect } from 'react';

const ScoreCircle = ({ score, label, color }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let start = null;
    const duration = 800;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const percent = Math.min(progress / duration, 1);
      setAnimatedScore(Math.floor(percent * score));
      if (progress < duration) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, [score]);

  const offset = circumference - (animatedScore / 100) * circumference;

  const getColorClass = (value) => {
    if (value >= 90) return 'text-green-500';
    if (value >= 50) return 'text-orange-500';
    return 'text-red-500';
  };

  const strokeColorClass = color || getColorClass(score);

  return (
    <div className="flex flex-col items-center justify-center p-4 transition-transform hover:scale-105">
      <div className="relative h-28 w-28 md:h-32 md:w-32">
        <svg className="h-full w-full" viewBox="0 0 120 120">
          {/* Background Circle */}
          <circle
            className="text-gray-300"
            stroke="currentColor"
            strokeWidth="10"
            fill="transparent"
            r={radius}
            cx="60"
            cy="60"
          />
          {/* Foreground Progress Circle */}
          <circle
            className={`${strokeColorClass}`}
            stroke="currentColor"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            r={radius}
            cx="60"
            cy="60"
            style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
          />
          {/* Score Text */}
          <text
            x="60"
            y="68"
            textAnchor="middle"
            className={`font-bold text-3xl ${strokeColorClass}`}
          >
            {animatedScore}
          </text>
        </svg>
      </div>
      <p className="mt-2 text-center text-lg font-semibold text-gray-800">
        {label}
      </p>
    </div>
  );
};

export default ScoreCircle;
