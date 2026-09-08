import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Search,
  Filter,
  Upload,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  Sparkles,
  FileText,
  AlertCircle
} from 'lucide-react';
import { Tender, TenderStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { NavScreen } from '../common/Sidebar';

interface TendersViewProps {
  tenders: Tender[];
  onSelectTender: (tenderId: string) => void;
  onNavigate: (screen: NavScreen) => void;
  onOpenUploadModal: () => void;
}

export const TendersView: React.FC<TendersViewProps> = ({
  tenders,
  onSelectTender,
  onNavigate,
  onOpenUploadModal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | TenderStatus>('ALL');

  const filteredTenders = tenders.filter(t => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.refNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.authority.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div id="tenders-view" className="space-y-6 pb-12">
      {/* Top Banner & Upload Action */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2A835F] bg-[#e4f1e7] px-2.5 py-0.5 rounded border border-[#8BBB92]/40">
              Procurement Inventory
            </span>
            <span className="text-xs font-mono text-slate-400">Total: {tenders.length} Tenders</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Government Tenders Management
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-xl">
            Each tender executes the Applicability Engine to extract specific criteria and eliminate redundant verification checks.
          </p>
        </div>

        <button
          onClick={onOpenUploadModal}
          id="btn-upload-new-tender"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#2A835F] hover:bg-[#12544F] text-white text-xs font-semibold shadow-xs transition-colors shrink-0 cursor-pointer"
        >
          <Upload size={14} />
          <span>Upload Tender Document</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search tender title, reference number, or authority..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#2A835F] focus:border-[#2A835F] text-slate-900"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 shrink-0">
            <Filter size={13} /> Filter:
          </span>
          {(['ALL', 'OPEN', 'CLOSED', 'AWARDED'] as const).map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors shrink-0 ${
                statusFilter === status
                  ? 'bg-[#092328] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Tenders Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-6">Tender Details</th>
                <th className="py-3 px-4">Authority &amp; Category</th>
                <th className="py-3 px-4">Estimated Value</th>
                <th className="py-3 px-4">Submission Deadline</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Bids Submitted</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredTenders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No tenders match the specified filter or search query.
                  </td>
                </tr>
              ) : (
                filteredTenders.map(tender => (
                  <tr key={tender.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-6 max-w-xs sm:max-w-sm">
                      <div className="font-semibold text-slate-900 leading-snug">
                        {tender.title}
                      </div>
                      <div className="text-[11px] font-mono text-[#12544F] font-bold mt-1">
                        {tender.refNo}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                        {tender.description}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="font-semibold text-slate-800">{tender.authority}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{tender.category}</div>
                    </td>

                    <td className="py-4 px-4 font-mono font-bold text-slate-900">
                      {tender.estimatedValue}
                    </td>

                    <td className="py-4 px-4 font-mono text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-slate-400" />
                        <span>{tender.submissionDeadline}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <StatusBadge status={tender.status} size="sm" />
                    </td>

                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
                        {tender.bidsCount} Bids
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                      <button
                        onClick={() => {
                          onSelectTender(tender.id);
                          onNavigate('applicability');
                        }}
                        className="px-2.5 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-[11px] transition-colors cursor-pointer"
                      >
                        Applicability
                      </button>
                      <button
                        onClick={() => {
                          onSelectTender(tender.id);
                          onNavigate('bid-review');
                        }}
                        className="px-2.5 py-1.5 rounded bg-[#e4f1e7] hover:bg-[#c9e3ce] text-[#12544F] font-bold text-[11px] transition-colors cursor-pointer"
                      >
                        Review Bids
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
