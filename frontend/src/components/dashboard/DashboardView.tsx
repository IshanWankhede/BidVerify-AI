import React from 'react';
import {
  FileText,
  Clock,
  CheckCircle2,
  TrendingUp,
  AlertOctagon,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  Calendar,
  Layers,
  ChevronRight,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Tender, Bid, AuditLog } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { NavScreen } from '../common/Sidebar';

interface DashboardViewProps {
  tenders: Tender[];
  bids: Bid[];
  auditLogs: AuditLog[];
  onNavigate: (screen: NavScreen) => void;
  onSelectTender: (tenderId: string) => void;
  onSelectBid: (bidId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  tenders,
  bids,
  auditLogs,
  onNavigate,
  onSelectTender,
  onSelectBid
}) => {
  // KPI Calculations
  const activeTendersCount = tenders.filter(t => t.status === 'OPEN').length;
  const pendingBidsCount = bids.filter(b => b.status === 'PENDING_OFFICER_DECISION').length;
  const approvedBidsCount = bids.filter(b => b.status === 'APPROVED').length;
  const avgComplianceScore = Math.round(
    bids.reduce((acc, b) => acc + b.complianceScore, 0) / (bids.length || 1)
  );
  const highRiskBidsCount = bids.filter(b => b.riskLevel === 'HIGH' || b.riskLevel === 'CRITICAL').length;

  // Risk Distribution
  const riskCounts = {
    LOW: bids.filter(b => b.riskLevel === 'LOW').length,
    MEDIUM: bids.filter(b => b.riskLevel === 'MEDIUM').length,
    HIGH: bids.filter(b => b.riskLevel === 'HIGH').length,
    CRITICAL: bids.filter(b => b.riskLevel === 'CRITICAL').length
  };
  const totalBids = bids.length || 1;

  return (
    <div id="dashboard-view" className="space-y-6 pb-12">
      {/* Welcome & Core Directive Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2A835F] bg-[#e4f1e7] px-2.5 py-0.5 rounded border border-[#8BBB92]/40">
              Procurement Officer Cockpit
            </span>
            <span className="text-xs font-mono text-slate-400">SIH26100</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Bidder Verification &amp; Compliance Intelligence
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
            Deterministic rule engine evaluates uploaded tender criteria and statutory registries. The officer retains sole authoritative approval power.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => onNavigate('bid-review')}
            className="px-4 py-2.5 rounded-lg bg-[#2A835F] hover:bg-[#12544F] text-white text-xs font-semibold shadow-xs flex items-center gap-2 transition-all hover:shadow-md cursor-pointer"
          >
            <span>Review Pending Bids ({pendingBidsCount})</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* 5 KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KPI 1 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold tracking-tight">Active Tenders</span>
            <FileText size={16} className="text-[#12544F]" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            {activeTendersCount}
          </div>
          <div className="text-[11px] text-slate-500">
            Across CPCL &amp; GeM portals
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold tracking-tight">Bids Pending Review</span>
            <Clock size={16} className="text-amber-600" />
          </div>
          <div className="text-3xl font-black text-amber-600">
            {pendingBidsCount}
          </div>
          <div className="text-[11px] text-amber-700 font-medium">
            Requires human officer decision
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold tracking-tight">Bids Approved</span>
            <CheckCircle2 size={16} className="text-[#2A835F]" />
          </div>
          <div className="text-3xl font-black text-[#2A835F]">
            {approvedBidsCount}
          </div>
          <div className="text-[11px] text-slate-500">
            Qualified for price bid opening
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold tracking-tight">Avg Compliance Score</span>
            <TrendingUp size={16} className="text-[#2A835F]" />
          </div>
          <div className="text-3xl font-black text-[#2A835F]">
            {avgComplianceScore}%
          </div>
          <div className="text-[11px] text-slate-500">
            Weighted across mandatory rules
          </div>
        </div>

        {/* KPI 5 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold tracking-tight">High / Critical Risk</span>
            <AlertOctagon size={16} className="text-rose-600" />
          </div>
          <div className="text-3xl font-black text-rose-600">
            {highRiskBidsCount}
          </div>
          <div className="text-[11px] text-rose-700 font-medium">
            Contains critical rule failures
          </div>
        </div>
      </div>

      {/* Visual Analytics & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Distribution Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Risk Level Distribution
            </h3>
            <span className="text-xs text-slate-500">{bids.length} Total Submissions</span>
          </div>

          <div className="space-y-3">
            {/* Low Risk Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-emerald-700 flex items-center gap-1">
                  <ShieldCheck size={13} /> Low Risk (Score 80–100)
                </span>
                <span className="text-slate-700">{riskCounts.LOW} ({Math.round((riskCounts.LOW / totalBids) * 100)}%)</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${(riskCounts.LOW / totalBids) * 100}%` }}
                />
              </div>
            </div>

            {/* Medium Risk Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-amber-700 flex items-center gap-1">
                  <ShieldAlert size={13} /> Medium Risk (Score 60–79)
                </span>
                <span className="text-slate-700">{riskCounts.MEDIUM} ({Math.round((riskCounts.MEDIUM / totalBids) * 100)}%)</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${(riskCounts.MEDIUM / totalBids) * 100}%` }}
                />
              </div>
            </div>

            {/* High Risk Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-orange-700 flex items-center gap-1">
                  <AlertOctagon size={13} /> High Risk (Score 40–59)
                </span>
                <span className="text-slate-700">{riskCounts.HIGH} ({Math.round((riskCounts.HIGH / totalBids) * 100)}%)</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500 rounded-full"
                  style={{ width: `${(riskCounts.HIGH / totalBids) * 100}%` }}
                />
              </div>
            </div>

            {/* Critical Risk Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-rose-700 flex items-center gap-1">
                  <AlertOctagon size={13} /> Critical Risk (Score 0–39)
                </span>
                <span className="text-slate-700">{riskCounts.CRITICAL} ({Math.round((riskCounts.CRITICAL / totalBids) * 100)}%)</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full"
                  style={{ width: `${(riskCounts.CRITICAL / totalBids) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-600 border border-slate-200">
            <span className="font-semibold text-slate-800">Scoring Methodology:</span> Mandatory requirements hold 3x weight; optional requirements hold 1x weight. Scores below 60 represent major compliance deficits.
          </div>
        </div>

        {/* Verification Category Compliance Rates */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Pass Rates by Requirement Domain
            </h3>
            <span className="text-xs text-slate-500">Deterministic Evaluation</span>
          </div>

          <div className="space-y-4 pt-1">
            <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/70 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800">Branch A: Statutory Registrations</span>
                <p className="text-[11px] text-slate-500">GST, PAN, Udyam, MCA, EPFO, ESIC</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-black text-emerald-600">92.8%</span>
                <p className="text-[10px] text-slate-400">Pass rate</p>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/70 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800">Branch B: Financial Capacity</span>
                <p className="text-[11px] text-slate-500">3-Yr Turnover & Net Worth Thresholds</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-black text-amber-600">75.0%</span>
                <p className="text-[10px] text-slate-400">Pass rate</p>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/70 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800">Branch B: Technical Credentials</span>
                <p className="text-[11px] text-slate-500">Past Orders, OEM Letter, MII Local %</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-black text-[#2A835F]">83.3%</span>
                <p className="text-[10px] text-slate-400">Pass rate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Review Dispatcher */}
        <div className="bg-gradient-to-br from-[#092328] to-[#12544F] text-white p-5 rounded-xl shadow-md border border-[#12544F] flex flex-col justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-[#2A835F]/30 text-[#8BBB92] text-[10px] uppercase font-bold tracking-wider border border-[#8BBB92]/40">
              <Sparkles size={11} /> Priority Queue
            </div>
            <h3 className="text-lg font-bold text-white">
              Attention Required
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              <strong>Alpha Systems Pvt Ltd</strong> has a trade name discrepancy on the GST registry, and <strong>Kaveri Heavy Engineering</strong> falls short of mandatory turnover.
            </p>
          </div>

          <div className="pt-4 space-y-2">
            <button
              onClick={() => {
                onSelectBid('bid-002');
                onNavigate('bid-review');
              }}
              className="w-full py-2.5 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-between transition-colors shadow-xs cursor-pointer"
            >
              <span>Inspect Alpha Systems (Needs Review)</span>
              <ArrowRight size={14} />
            </button>
            <button
              onClick={() => {
                onSelectBid('bid-001');
                onNavigate('bid-review');
              }}
              className="w-full py-2.5 px-3 rounded-lg bg-white/10 hover:bg-[#2A835F]/40 text-white font-semibold text-xs flex items-center justify-between transition-colors cursor-pointer border border-[#8BBB92]/20"
            >
              <span>Inspect TechNova Solutions (92% Score)</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Active Tenders Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Current Procurement Tenders
            </h3>
            <p className="text-xs text-slate-500">
              Active procurement contracts under evaluation
            </p>
          </div>
          <button
            onClick={() => onNavigate('tenders')}
            className="text-xs font-semibold text-[#2A835F] hover:text-[#12544F] flex items-center gap-1 cursor-pointer"
          >
            <span>View All Tenders</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-6">Tender Reference &amp; Title</th>
                <th className="py-3 px-4">Authority</th>
                <th className="py-3 px-4">Deadline</th>
                <th className="py-3 px-4">Bids Received</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {tenders.map(t => (
                <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-6">
                    <div className="font-semibold text-slate-900">{t.title}</div>
                    <div className="text-[11px] text-[#12544F] font-mono font-bold mt-0.5">{t.refNo}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{t.authority}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">{t.submissionDeadline}</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded bg-slate-100 font-semibold text-slate-800">
                      {t.bidsCount} Bids
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={t.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-6 text-right space-x-2">
                    <button
                      onClick={() => {
                        onSelectTender(t.id);
                        onNavigate('applicability');
                      }}
                      className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-[11px] transition-colors cursor-pointer"
                    >
                      Applicability Matrix
                    </button>
                    <button
                      onClick={() => {
                        onSelectTender(t.id);
                        onNavigate('bid-review');
                      }}
                      className="px-2.5 py-1 rounded bg-[#e4f1e7] hover:bg-[#c9e3ce] text-[#12544F] font-bold text-[11px] transition-colors cursor-pointer"
                    >
                      Inspect Bids
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activity / Audit Feed Snippet */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Recent Verification &amp; Decision Activity
            </h3>
            <p className="text-xs text-slate-500">Live feed of deterministic checks and officer decisions</p>
          </div>
          <button
            onClick={() => onNavigate('audit-trail')}
            className="text-xs font-semibold text-[#2A835F] hover:text-[#12544F] flex items-center gap-1 cursor-pointer"
          >
            <span>Open Full Audit Trail</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {auditLogs.slice(0, 4).map(log => (
            <div key={log.id} className="py-3 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900">{log.userName}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200 font-medium">
                    {log.userRole}
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">&bull; {log.action}</span>
                </div>
                <p className="text-slate-600">{log.summary}</p>
              </div>
              <span className="text-[11px] text-slate-400 font-mono shrink-0">
                {log.timestamp}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
