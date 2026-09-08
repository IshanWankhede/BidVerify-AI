import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { RiskLevel } from '../../types';
import { prefersReducedMotion } from '../../lib/motion';

interface RadialScoreGaugeProps {
  score: number;
  riskLevel: RiskLevel;
  size?: number;
  strokeWidth?: number;
  showSubtitle?: boolean;
}

// Color stops along compliance spectrum:
// 0%: red (#e11d48)
// 50%: orange (#ea580c)
// 70%: amber (#d97706)
// 85%+: green (#2A835F)
const getColorForProgress = (progressRatio: number): string => {
  const colorInterpolator = gsap.utils.interpolate([
    '#e11d48', // 0% Critical
    '#ea580c', // 40% Low
    '#d97706', // 65% Moderate
    '#2A835F'  // 85%+ High
  ]);
  return colorInterpolator(Math.min(1, Math.max(0, progressRatio)));
};

export const RadialScoreGauge: React.FC<RadialScoreGaugeProps> = ({
  score,
  riskLevel,
  size = 140,
  strokeWidth = 12,
  showSubtitle = true
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.max(0, Math.min(100, score));

  // Current visual values animated by GSAP
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [currentStroke, setCurrentStroke] = useState<string>('#e11d48');
  const animRef = useRef<{ val: number }>({ val: 0 });

  useEffect(() => {
    if (prefersReducedMotion()) {
      setCurrentScore(clampedScore);
      setCurrentStroke(getColorForProgress(clampedScore / 100));
      return;
    }

    // Reset from 0 on initial mount or animate to new target on change
    const target = clampedScore;
    const startVal = animRef.current.val;

    const tween = gsap.to(animRef.current, {
      val: target,
      duration: 1.25,
      ease: 'power2.out',
      onUpdate: () => {
        const val = animRef.current.val;
        setCurrentScore(Math.round(val));
        const color = getColorForProgress(val / 100);
        setCurrentStroke(color);
      }
    });

    return () => {
      tween.kill();
    };
  }, [clampedScore]);

  const offset = circumference - (currentScore / 100) * circumference;

  const labelText = React.useMemo(() => {
    if (clampedScore >= 80) return 'HIGH COMPLIANCE';
    if (clampedScore >= 60) return 'MODERATE COMPLIANCE';
    if (clampedScore >= 40) return 'LOW COMPLIANCE';
    return 'CRITICAL DEFICIT';
  }, [clampedScore]);

  return (
    <div id="radial-score-gauge" className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
          />
          {/* Animated Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={currentStroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
          <span
            className="text-3xl sm:text-4xl font-extrabold tracking-tight transition-colors duration-150"
            style={{ color: currentStroke }}
          >
            {currentScore}
            <span className="text-sm font-semibold text-slate-400">/100</span>
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mt-0.5">
            Compliance Score
          </span>
        </div>
      </div>

      {showSubtitle && (
        <div className="mt-2 text-center">
          <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            {labelText}
          </span>
        </div>
      )}
    </div>
  );
};
