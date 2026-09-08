import React, { useState } from 'react';
import {
  CheckSquare,
  Building2,
  Calendar,
  Layers,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Filter,
  ArrowRight,
  ShieldCheck,
  FileText,
  Clock,
  Sparkles
} from 'lucide-react';
import { Tender, Bid } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { NavScreen } from '../common/Sidebar';

interface ApplicabilityMatrixViewProps {
  tenders: Tender[];
  selectedTenderId: string;
  onSelectTender: (tenderId: string) => void;
  bids: Bid[];
  onSelectBid: (bidId: string) => void;
  onNavigate: (screen: NavScreen) => void;
}

export const ApplicabilityMatrixView: React.FC<ApplicabilityMatrixViewProps> = ({
  tenders,
  selectedTenderId,
  onSelectTender,
  bids,
  onSelectBid,
  onNavigate
}) => {
  const [categoryFilter, setCategoryFilter] = useState<'ALL' | 'statutory' | 'financial' | 'technical'>('ALL');

  const currentTender = tenders.find(t => t.id === selectedTenderId) || tenders[0];
  const tenderBids = bids.filter(b => b.tenderId === currentTender.id);

  // Requirements for this tender
  const requirements = currentTender.requirements || [];
  const filteredRequirements = requirements.filter(req => {
    return categoryFilter === 'ALL' || req.category === categoryFilter;
  });

  const applicableCount = requirements.filter(r => r.isApplicable).length;
  const nonApplicableCount = requirements.filter(r => !r.isApplicable).length;

  return (
    <div id="applicability-matrix-view" className="space-y-6 pb-12">
      {/* Tender Header & Selector */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2A835F] bg-[#e4f1e7] px-2.5 py-0.5 rounded border border-[#8BBB92]/40">
                Applicability Engine
              </span>
              <span className="text-xs font-mono text-slate-400">
                Rule Deduplication &amp; Tailored Checklist
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {currentTender.title}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
              <span className="font-mono text-[#12544F] font-bold">{currentTender.refNo}</span>
              <span>&bull;</span>
              <span>{currentTender.authority}</span>
              <span>&bull;</span>
              <span>Deadline: {currentTender.submissionDeadline}</span>
              <span>&bull;</span>
              <span>Estimated Value: {currentTender.estimatedValue}</span>
            </div>
          </div>

          {/* Tender Selector Dropdown */}
          <div className="shrink-0 flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-500">
              Select Tender:
            </label>
            <select
              value={currentTender.id}
              onChange={e => onSelectTender(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold bg-white text-slate-800 shadow-2xs focus:ring-2 focus:ring-[#2A835F]"
            >
              {tenders.map(t => (
                <option key={t.id} value={t.id}>
                  {t.refNo} — {t.title.slice(0, 35)}...
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Applicability Principle Banner */}
        <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-3 text-xs text-slate-700">
          <Sparkles size={16} className="text-[#2A835F] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-slate-900">
              Why Applicability Pre-filtering Matters:
            </span>
            <p className="text-slate-600 leading-normal">
              Not every bidder needs every verification. For example, OEM Manufacturer Authorization is mandatory for hardware supply tenders, but strictly excluded for pure cloud SI contracts. Running non-applicable checks creates false flags and confuses procurement officers.
            </p>
          </div>
        </div>

        {/* Summary Counter Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
          <div className="p-3 rounded-lg bg-slate-100/70 border border-slate-200">
            <span className="text-slate-500 font-medium">Total Extracted Checks</span>
            <div className="text-2xl font-black text-slate-900 mt-0.5">
              {requirements.length} Rules
            </div>
          </div>
          <div className="p-3 rounded-lg bg-[#e4f1e7] border border-[#8BBB92]/40">
            <span className="text-[#12544F] font-semibold">Applicable Checks</span>
            <div className="text-2xl font-black text-[#2A835F] mt-0.5">
              {applicableCount} Active
            </div>
          </div>
          <div className="p-3 rounded-lg bg-slate-100 border border-slate-200">
            <span className="text-slate-600 font-medium">Not Applicable Checks</span>
            <div className="text-2xl font-black text-slate-600 mt-0.5">
              {nonApplicableCount} Excluded
            </div>
          </div>
          <div className="p-3 rounded-lg bg-[#e4f1e7] border border-[#8BBB92]/40">
            <span className="text-[#12544F] font-semibold">Bids Submitted</span>
            <div className="text-2xl font-black text-[#12544F] mt-0.5">
              {tenderBids.length} Submissions
            </div>
          </div>
        </div>
      </div>

      {/* Main Checklist: Requirements Matrix */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Requirements Applicability Checklist
            </h3>
            <p className="text-xs text-slate-500">
              Evaluated deterministically prior to running bidder verification
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-100 text-xs">
            {(['ALL', 'statutory', 'financial', 'technical'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 rounded-md font-semibold capitalize transition-colors ${
                  categoryFilter === cat
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat === 'ALL' ? 'All Domains' : cat}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-6">Check Code & Rule</th>
                <th className="py-3 px-4">Domain</th>
                <th className="py-3 px-4">Requirement Type</th>
                <th className="py-3 px-4">Applicability State</th>
                <th className="py-3 px-6">Deterministic Applicability Reason</th>
                <th className="py-3 px-4">Tender Clause</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredRequirements.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No requirements defined under this filter.
                  </td>
                </tr>
              ) : (
                filteredRequirements.map(req => (
                  <tr
                    key={req.id}
                    className={`transition-colors ${
                      req.isApplicable ? 'hover:bg-slate-50/80' : 'bg-slate-50/50 hover:bg-slate-100/60'
                    }`}
                  >
                    <td className="py-4 px-6 max-w-xs">
                      <div className="font-bold text-slate-900">
                        {req.title}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {req.description}
                      </div>
                    </td>

                    <td className="py-4 px-4 uppercase font-bold text-[10px] tracking-wider text-slate-500">
                      {req.category}
                    </td>

                    <td className="py-4 px-4">
                      {req.isMandatory ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          Mandatory (3x Weight)
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                          Optional (1x Weight)
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      {req.isApplicable ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold text-xs">
                          <CheckCircle2 size={13} className="text-emerald-600" />
                          <span>APPLICABLE</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 border border-slate-200 font-semibold text-xs">
                          <XCircle size={13} className="text-slate-400" />
                          <span>NOT APPLICABLE</span>
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6 max-w-sm">
                      <p className={`text-xs leading-relaxed ${req.isApplicable ? 'text-slate-700' : 'text-slate-500 italic'}`}>
                        {req.applicabilityReason}
                      </p>
                    </td>

                    <td className="py-4 px-4 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                      {req.clauseRef}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Submitted Bids Under This Tender */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Submitted Bids for Evaluation ({tenderBids.length})
            </h3>
            <p className="text-xs text-slate-500">
              Click any bid to inspect the full verification cockpit with evidence drawer
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tenderBids.map(bid => (
            <div
              key={bid.id}
              onClick={() => {
                onSelectBid(bid.id);
                onNavigate('bid-review');
              }}
              className="p-4 rounded-xl border border-slate-200 hover:border-[#2A835F] bg-white hover:shadow-md transition-all cursor-pointer space-y-3 group"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-slate-900 group-hover:text-[#2A835F] transition-colors">
                    {bid.bidder.companyName}
                  </h4>
                  <span className="text-[11px] font-mono text-slate-400">
                    {bid.bidder.registrationNumber}
                  </span>
                </div>
                <StatusBadge status={bid.riskLevel} size="sm" />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">
                    Score
                  </span>
                  <span className="text-lg font-black text-slate-900">
                    {bid.complianceScore}
                    <span className="text-xs text-slate-400 font-normal">/100</span>
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">
                    Decision Status
                  </span>
                  <StatusBadge status={bid.status} size="sm" />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-[#2A835F] font-semibold text-xs group-hover:translate-x-0.5 transition-transform">
                <span>Launch Bid Review Cockpit</span>
                <ArrowRight size={14} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
