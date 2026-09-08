import React from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  MinusCircle,
  Clock,
  ShieldCheck,
  ShieldAlert,
  AlertOctagon,
  Sparkles,
  FlaskConical,
  Lock,
  Unlock
} from 'lucide-react';
import { OutcomeStatus, VerificationStatus, RiskLevel, BidStatus, TenderStatus } from '../../types';

interface StatusBadgeProps {
  status: OutcomeStatus | VerificationStatus | RiskLevel | BidStatus | TenderStatus | string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  className = '',
  showIcon = true
}) => {
  const s = status.toUpperCase();

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3 py-1.5 gap-2 font-semibold'
  }[size];

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16
  }[size];

  // 1. Compliance / Verification Statuses
  if (s === 'COMPLIANT' || s === 'VERIFIED' || s === 'APPROVED' || s === 'AWARDED') {
    return (
      <span
        id={`badge-${s.toLowerCase()}`}
        className={`inline-flex items-center rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 ${sizeClasses} ${className}`}
      >
        {showIcon && <CheckCircle2 size={iconSizes} className="text-emerald-600 shrink-0" />}
        <span>{s.replace(/_/g, ' ')}</span>
      </span>
    );
  }

  if (s === 'NON_COMPLIANT' || s === 'NOT_VERIFIED' || s === 'REJECTED') {
    return (
      <span
        id={`badge-${s.toLowerCase()}`}
        className={`inline-flex items-center rounded-md bg-rose-50 text-rose-700 border border-rose-200 ${sizeClasses} ${className}`}
      >
        {showIcon && <XCircle size={iconSizes} className="text-rose-600 shrink-0" />}
        <span>{s.replace(/_/g, ' ')}</span>
      </span>
    );
  }

  if (s === 'NEEDS_REVIEW' || s === 'CLARIFICATION_REQUESTED') {
    return (
      <span
        id={`badge-${s.toLowerCase()}`}
        className={`inline-flex items-center rounded-md bg-amber-50 text-amber-800 border border-amber-300 badge-pulse-amber ${sizeClasses} ${className}`}
      >
        {showIcon && <AlertTriangle size={iconSizes} className="text-amber-600 shrink-0" />}
        <span>{s === 'CLARIFICATION_REQUESTED' ? 'CLARIFICATION NEEDED' : 'NEEDS REVIEW'}</span>
      </span>
    );
  }

  if (s === 'NOT_APPLICABLE') {
    return (
      <span
        id={`badge-${s.toLowerCase()}`}
        className={`inline-flex items-center rounded-md bg-slate-100 text-slate-600 border border-slate-200 ${sizeClasses} ${className}`}
      >
        {showIcon && <MinusCircle size={iconSizes} className="text-slate-500 shrink-0" />}
        <span>NOT APPLICABLE</span>
      </span>
    );
  }

  if (s === 'PENDING_VERIFICATION' || s === 'PENDING_OFFICER_DECISION' || s === 'OPEN') {
    return (
      <span
        id={`badge-${s.toLowerCase()}`}
        className={`inline-flex items-center rounded-md bg-teal-50 text-teal-800 border border-teal-200 ${sizeClasses} ${className}`}
      >
        {showIcon && <Clock size={iconSizes} className="text-teal-700 shrink-0" />}
        <span>{s === 'PENDING_OFFICER_DECISION' ? 'PENDING DECISION' : s.replace(/_/g, ' ')}</span>
      </span>
    );
  }

  if (s === 'CLOSED') {
    return (
      <span
        id={`badge-${s.toLowerCase()}`}
        className={`inline-flex items-center rounded-md bg-slate-100 text-slate-700 border border-slate-300 ${sizeClasses} ${className}`}
      >
        {showIcon && <Clock size={iconSizes} className="text-slate-500 shrink-0" />}
        <span>CLOSED</span>
      </span>
    );
  }

  // 2. Risk Levels
  if (s === 'LOW') {
    return (
      <span
        id="badge-risk-low"
        className={`inline-flex items-center rounded-md bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold ${sizeClasses} ${className}`}
      >
        {showIcon && <ShieldCheck size={iconSizes} className="text-emerald-600 shrink-0" />}
        <span>LOW RISK</span>
      </span>
    );
  }

  if (s === 'MEDIUM') {
    return (
      <span
        id="badge-risk-medium"
        className={`inline-flex items-center rounded-md bg-amber-50 text-amber-800 border border-amber-300 font-semibold ${sizeClasses} ${className}`}
      >
        {showIcon && <ShieldAlert size={iconSizes} className="text-amber-600 shrink-0" />}
        <span>MEDIUM RISK</span>
      </span>
    );
  }

  if (s === 'HIGH') {
    return (
      <span
        id="badge-risk-high"
        className={`inline-flex items-center rounded-md bg-orange-50 text-orange-800 border border-orange-300 font-semibold badge-pulse-orange ${sizeClasses} ${className}`}
      >
        {showIcon && <AlertOctagon size={iconSizes} className="text-orange-600 shrink-0" />}
        <span>HIGH RISK</span>
      </span>
    );
  }

  if (s === 'CRITICAL') {
    return (
      <span
        id="badge-risk-critical"
        className={`inline-flex items-center rounded-md bg-rose-100 text-rose-900 border border-rose-300 font-bold badge-pulse-rose ${sizeClasses} ${className}`}
      >
        {showIcon && <AlertOctagon size={iconSizes} className="text-rose-700 shrink-0" />}
        <span>CRITICAL RISK</span>
      </span>
    );
  }

  // Fallback generic badge
  return (
    <span className={`inline-flex items-center rounded-md bg-slate-100 text-slate-700 border border-slate-200 ${sizeClasses} ${className}`}>
      <span>{status}</span>
    </span>
  );
};

export const MockBadge: React.FC<{ label?: string; className?: string }> = ({
  label = 'MOCK / SYNTHETIC DATA',
  className = ''
}) => {
  return (
    <span
      id="badge-mock-data"
      title="Synthetic demo data for SIH26100 hackathon prototype. Not from live government servers."
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] tracking-wider uppercase font-semibold bg-violet-50 text-violet-700 border border-violet-200 shadow-2xs ${className}`}
    >
      <FlaskConical size={11} className="text-violet-600 shrink-0" />
      <span>{label}</span>
    </span>
  );
};

export const AIAdvisoryBadge: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <span
      id="badge-ai-advisory"
      title="AI Recommendation is non-binding and advisory. Officer retains sole decision-making authority."
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 ${className}`}
    >
      <Sparkles size={13} className="text-indigo-600 shrink-0" />
      <span>AI Recommendation — Advisory Only</span>
    </span>
  );
};

export const MaskedText: React.FC<{
  value: string;
  isMasked: boolean;
  onToggle?: () => void;
  className?: string;
}> = ({ value, isMasked, onToggle, className = '' }) => {
  const maskedValue = React.useMemo(() => {
    if (!isMasked || value.length <= 6) return value;
    const start = value.slice(0, 3);
    const end = value.slice(-3);
    const stars = '*'.repeat(Math.max(4, value.length - 6));
    return `${start}${stars}${end}`;
  }, [value, isMasked]);

  return (
    <span className={`inline-flex items-center gap-1.5 font-mono text-slate-800 ${className}`}>
      <span>{maskedValue}</span>
      {onToggle && (
        <button
          type="button"
          onClick={onToggle}
          title={isMasked ? 'Reveal full identifier' : 'Mask sensitive identifier'}
          className="text-slate-400 hover:text-slate-600 transition-colors p-0.5"
        >
          {isMasked ? <Lock size={12} /> : <Unlock size={12} className="text-amber-600" />}
        </button>
      )}
    </span>
  );
};
