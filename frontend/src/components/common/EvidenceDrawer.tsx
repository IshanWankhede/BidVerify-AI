import React, { useState } from 'react';
import {
  X,
  FileText,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  FlaskConical,
  Clock,
  Layers
} from 'lucide-react';
import { Evidence } from '../../types';
import { MockBadge } from './StatusBadge';

interface EvidenceDrawerProps {
  evidence: Evidence | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EvidenceDrawer: React.FC<EvidenceDrawerProps> = ({
  evidence,
  isOpen,
  onClose
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !evidence) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `[Evidence: ${evidence.title}]\nDocument: ${evidence.documentRef} (Page ${evidence.pageNumber})\nSource: ${evidence.providerSource}\nExtracted Text: "${evidence.extractedText}"`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to highlight matching keywords in the extracted text
  const renderHighlightedText = (text: string, keywords: string[]) => {
    if (!keywords || keywords.length === 0) return <span>{text}</span>;

    // Build regex from keywords
    const escapedKeywords = keywords.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const regex = new RegExp(`(${escapedKeywords.join('|')})`, 'gi');
    const parts = text.split(regex);

    return (
      <span className="leading-relaxed">
        {parts.map((part, index) => {
          const isMatch = keywords.some(k => k.toLowerCase() === part.toLowerCase());
          if (isMatch) {
            return (
              <mark
                key={index}
                className="bg-amber-100 text-amber-950 font-semibold px-1 py-0.5 rounded border border-amber-300"
              >
                {part}
              </mark>
            );
          }
          return <span key={index}>{part}</span>;
        })}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          id="evidence-slideover-drawer"
          className="w-screen max-w-xl bg-white shadow-2xl border-l border-slate-200 flex flex-col"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <FileText className="text-blue-600" size={18} />
                <h3 className="text-base font-bold text-slate-900">
                  Verification Evidence Inspector
                </h3>
              </div>
              <p className="text-xs text-slate-500">
                Ground-truth audit trail linking findings directly to source document excerpts
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Synthetic Alert Banner */}
          <div className="px-6 py-3 bg-violet-50 border-b border-violet-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FlaskConical size={16} className="text-violet-600 shrink-0" />
              <span className="text-xs font-semibold text-violet-900">
                MOCK / SYNTHETIC DEMO EVIDENCE
              </span>
            </div>
            <span className="text-[11px] text-violet-700">
              SIH26100 Prototype Data
            </span>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
            {/* Title & Document Badge */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Finding Title
              </span>
              <h4 className="text-lg font-bold text-slate-900 mt-1">
                {evidence.title}
              </h4>
              {evidence.clauseRef && (
                <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
                  <Layers size={13} className="text-slate-500" />
                  <span>Mapped to Tender: {evidence.clauseRef}</span>
                </div>
              )}
            </div>

            {/* Document Details Grid */}
            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 font-medium">Source Document:</span>
                <div className="font-semibold text-slate-800 flex items-center gap-1.5 mt-0.5 truncate" title={evidence.documentRef}>
                  <FileText size={13} className="text-blue-600 shrink-0" />
                  <span className="truncate">{evidence.documentRef}</span>
                </div>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Location:</span>
                <div className="font-semibold text-slate-800 mt-0.5">
                  Page {evidence.pageNumber}
                </div>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Document Type:</span>
                <div className="font-semibold text-slate-800 mt-0.5">
                  {evidence.documentType.replace(/_/g, ' ')}
                </div>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Extraction Confidence:</span>
                <div className="font-semibold text-emerald-700 flex items-center gap-1 mt-0.5">
                  <ShieldCheck size={13} />
                  <span>{(evidence.confidenceScore * 100).toFixed(1)}%</span>
                </div>
              </div>
              <div className="col-span-2 pt-2 border-t border-slate-200/80">
                <span className="text-slate-500 font-medium">Provider Source:</span>
                <div className="font-mono text-slate-700 text-[11px] mt-0.5">
                  {evidence.providerSource}
                </div>
              </div>
            </div>

            {/* Extracted Snippet with Highlights */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Extracted Text Excerpt
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
                >
                  {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                  <span>{copied ? 'Copied' : 'Copy Snippet'}</span>
                </button>
              </div>

              <div className="p-4 rounded-lg bg-slate-900 text-slate-100 font-mono text-xs border border-slate-800 shadow-inner">
                {renderHighlightedText(evidence.extractedText, evidence.highlightKeywords)}
              </div>
            </div>

            {/* Keyword tags */}
            {evidence.highlightKeywords && evidence.highlightKeywords.length > 0 && (
              <div>
                <span className="text-xs font-semibold text-slate-500 block mb-1.5">
                  Key Verification Tokens Highlighted:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {evidence.highlightKeywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-xs bg-amber-50 text-amber-800 border border-amber-200 font-mono"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Advisory Note */}
            <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-100 text-xs text-blue-900 flex items-start gap-2.5">
              <AlertCircle size={16} className="text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Audit Integrity Note:</span>
                <p className="mt-0.5 text-blue-800 leading-normal">
                  In accordance with SIH26100 architecture, every extraction is immutably linked to page-level coordinates. No decision is finalized by AI; this evidence is prepared exclusively for human officer determination.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock size={12} />
              <span>Extracted {evidence.timestamp.replace('T', ' ').slice(0, 19)}</span>
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              Done Inspecting
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
