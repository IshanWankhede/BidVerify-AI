import React, { useState } from 'react';
import {
  History,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  User,
  Clock,
  Building2,
  FileCheck2,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { AuditLog, Tender, Bid } from '../../types';

interface AuditTrailViewProps {
  auditLogs: AuditLog[];
  tenders: Tender[];
  bids: Bid[];
}

export const AuditTrailView: React.FC<AuditTrailViewProps> = ({
  auditLogs,
  tenders,
  bids
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('ALL');
  const [expandedLogIds, setExpandedLogIds] = useState<Record<string, boolean>>({
    'audit-101': true,
    'audit-102': true
  });

  const toggleExpand = (id: string) => {
    setExpandedLogIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch =
      log.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.bidderName && log.bidderName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.tenderRef && log.tenderRef.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesAction = actionFilter === 'ALL' || log.action === actionFilter;

    return matchesSearch && matchesAction;
  });

  const getActionBadgeClass = (action: string) => {
    if (action.includes('APPROVED')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (action.includes('REJECTED')) return 'bg-rose-50 text-rose-700 border-rose-200';
    if (action.includes('CLARIFICATION')) return 'bg-amber-50 text-amber-700 border-amber-200';
    if (action.includes('VERIFICATION')) return 'bg-blue-50 text-blue-700 border-blue-200';
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  return (
    <div id="audit-trail-view" className="space-y-6 pb-16">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
              Governance &amp; Integrity Ledger
            </span>
            <span className="text-xs font-mono text-slate-400">Total: {auditLogs.length} Entries</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Chronological Audit Trail &amp; State Diffs
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-xl">
            Immutable log of all automated extraction runs, rule evaluations, and authoritative officer determinations with before &amp; after state diffs.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by officer, bidder name, tender ref..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 text-slate-900"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 shrink-0">
            <Filter size={13} /> Action:
          </span>
          {[
            { id: 'ALL', label: 'All Actions' },
            { id: 'BID_APPROVED', label: 'Approvals' },
            { id: 'VERIFICATION_RUN', label: 'Rule Runs' },
            { id: 'TENDER_CREATED', label: 'Tenders' },
            { id: 'CLARIFICATION_REQUESTED', label: 'Clarifications' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setActionFilter(f.id)}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors shrink-0 ${
                actionFilter === f.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline List */}
      <div className="space-y-4">
        {filteredLogs.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-400 text-xs">
            No audit records match the current criteria.
          </div>
        ) : (
          filteredLogs.map(log => {
            const isExpanded = !!expandedLogIds[log.id];
            return (
              <div
                key={log.id}
                id={`audit-card-${log.id}`}
                className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden transition-all hover:border-slate-300"
              >
                {/* Summary Row */}
                <div
                  onClick={() => toggleExpand(log.id)}
                  className="p-4 sm:px-6 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">
                        {log.userName}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-slate-100 text-slate-600 border border-slate-200">
                        {log.userRole}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${getActionBadgeClass(log.action)}`}>
                        {log.action}
                      </span>
                      {log.bidderName && (
                        <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                          {log.bidderName}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-700 leading-normal">
                      {log.summary}
                    </p>

                    {log.tenderRef && (
                      <div className="text-[11px] text-slate-400 font-mono">
                        Tender: {log.tenderRef}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <span className="text-[11px] font-mono text-slate-500 block">
                        {log.timestamp}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Tamper-Evident SHA Hash
                      </span>
                    </div>

                    <div className="text-slate-400 hover:text-slate-600 p-1">
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </div>
                </div>

                {/* Expandable State Diff Panel */}
                {isExpanded && (log.previousResult || log.updatedResult) && (
                  <div className="px-6 py-4 bg-slate-900 text-slate-200 border-t border-slate-200 text-xs font-mono space-y-3">
                    <div className="flex items-center justify-between text-slate-400 text-[11px]">
                      <span>State Transition Payload:</span>
                      <span>Action ID: {log.id}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Previous Result */}
                      <div className="space-y-1">
                        <span className="text-slate-400 font-bold block text-[10px] uppercase">
                          Previous State:
                        </span>
                        <pre className="p-3 rounded bg-slate-950 text-amber-300 overflow-x-auto text-[11px] border border-slate-800">
                          {JSON.stringify(log.previousResult || { status: 'INITIAL' }, null, 2)}
                        </pre>
                      </div>

                      {/* Updated Result */}
                      <div className="space-y-1">
                        <span className="text-emerald-400 font-bold block text-[10px] uppercase">
                          Updated State:
                        </span>
                        <pre className="p-3 rounded bg-slate-950 text-emerald-300 overflow-x-auto text-[11px] border border-slate-800">
                          {JSON.stringify(log.updatedResult || {}, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
