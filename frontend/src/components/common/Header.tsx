import React from 'react';
import {
  Lock,
  Unlock,
  UserCheck,
  ShieldCheck,
  Upload,
  Search,
  Building2,
  ChevronRight,
  Info
} from 'lucide-react';
import { User, UserRole } from '../../types';
import { NavScreen } from './Sidebar';

interface HeaderProps {
  currentScreen: NavScreen;
  currentUser: User;
  onSwitchRole: (role: UserRole) => void;
  isMasked: boolean;
  onToggleMask: () => void;
  onOpenUploadTender: () => void;
  activeTenderRef?: string;
  activeBidderName?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  currentUser,
  onSwitchRole,
  isMasked,
  onToggleMask,
  onOpenUploadTender,
  activeTenderRef,
  activeBidderName
}) => {
  const getScreenBreadcrumb = () => {
    switch (currentScreen) {
      case 'dashboard':
        return 'Executive Overview & Statistics';
      case 'tenders':
        return 'Procurement Tenders Roster';
      case 'applicability':
        return `Applicability Matrix / ${activeTenderRef || 'CPCL/REF/2026/VALVES/088'}`;
      case 'bid-review':
        return `Bid Compliance Review / ${activeBidderName || 'TechNova Solutions'}`;
      case 'audit-trail':
        return 'System Audit Trail & Decision Logs';
      case 'admin':
        return 'System Administrator / Provider Adapters';
      default:
        return 'BidVerify Platform';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xs border-b border-slate-200 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      {/* Main Top Bar */}
      <div className="px-6 py-3 flex items-center justify-between gap-4">
        {/* Breadcrumb / Screen Title */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 font-medium">
            <Building2 size={14} className="text-slate-400" />
            <span className="tracking-tight">Chennai Petroleum Corporation Limited (CPCL)</span>
            <ChevronRight size={12} className="text-slate-300" />
          </div>
          <span className="font-bold text-slate-900 text-sm tracking-tight">
            {getScreenBreadcrumb()}
          </span>
        </div>

        {/* Actions Cluster */}
        <div className="flex items-center gap-3">
          {/* Mask Sensitive Data Toggle */}
          <button
            type="button"
            id="toggle-mask-identifiers-btn"
            onClick={onToggleMask}
            title={isMasked ? 'Sensitive identifiers (GSTIN/PAN) are currently masked' : 'Unmasked mode active'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              isMasked
                ? 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
            }`}
          >
            {isMasked ? (
              <>
                <Lock size={13} className="text-slate-600" />
                <span>Identifiers Masked</span>
              </>
            ) : (
              <>
                <Unlock size={13} className="text-amber-700" />
                <span>Identifiers Revealed</span>
              </>
            )}
          </button>

          {/* Quick Role Switcher */}
          <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs">
            <button
              id="role-officer-btn"
              onClick={() => onSwitchRole('PROCUREMENT_OFFICER')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                currentUser.role === 'PROCUREMENT_OFFICER'
                  ? 'bg-[#2A835F] text-white shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Officer View
            </button>
            <button
              id="role-admin-btn"
              onClick={() => onSwitchRole('SYSTEM_ADMIN')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                currentUser.role === 'SYSTEM_ADMIN'
                  ? 'bg-[#092328] text-white shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Admin View
            </button>
          </div>

          {/* Upload New Tender CTA */}
          <button
            id="header-upload-tender-btn"
            onClick={onOpenUploadTender}
            className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#092328] hover:bg-[#12544F] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Upload size={13} />
            <span>Upload Tender</span>
          </button>
        </div>
      </div>
    </header>
  );
};
