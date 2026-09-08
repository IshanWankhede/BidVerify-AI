import React from 'react';
import {
  LayoutDashboard,
  FileSpreadsheet,
  CheckSquare,
  FileCheck2,
  History,
  ShieldAlert,
  Settings,
  HelpCircle,
  Scale,
  UserCheck
} from 'lucide-react';
import { User, UserRole } from '../../types';

export type NavScreen = 
  | 'dashboard' 
  | 'tenders' 
  | 'applicability' 
  | 'bid-review' 
  | 'audit-trail' 
  | 'admin';

interface SidebarProps {
  currentScreen: NavScreen;
  onNavigate: (screen: NavScreen) => void;
  currentUser: User;
  pendingBidsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentScreen,
  onNavigate,
  currentUser,
  pendingBidsCount
}) => {
  const navItems = [
    {
      id: 'dashboard' as NavScreen,
      label: 'Dashboard',
      icon: LayoutDashboard,
      description: 'KPIs, risk distribution & trends'
    },
    {
      id: 'tenders' as NavScreen,
      label: 'Tenders Management',
      icon: FileSpreadsheet,
      description: 'Active CPCL & GeM tenders'
    },
    {
      id: 'applicability' as NavScreen,
      label: 'Applicability Matrix',
      icon: CheckSquare,
      description: 'Rule & check conditions'
    },
    {
      id: 'bid-review' as NavScreen,
      label: 'Bid Review & Decision',
      icon: FileCheck2,
      badge: pendingBidsCount > 0 ? `${pendingBidsCount} Pending` : undefined,
      description: 'Centerpiece verification cockpit'
    },
    {
      id: 'audit-trail' as NavScreen,
      label: 'Audit Trail',
      icon: History,
      description: 'Immutable historical logs'
    },
    ...(currentUser.role === 'SYSTEM_ADMIN' || true // Keep visible so user can see admin adapter panel anytime
      ? [
          {
            id: 'admin' as NavScreen,
            label: 'System Admin',
            icon: Settings,
            description: 'Adapters, roles & providers'
          }
        ]
      : [])
  ];

  return (
    <aside
      id="main-sidebar"
      className="w-64 bg-[#092328] text-slate-100 flex flex-col shrink-0 border-r border-[#12544F]/50 select-none h-screen sticky top-0"
    >
      {/* Brand Header */}
      <div className="p-5 border-b border-[#12544F]/40">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-[#2A835F] flex items-center justify-center text-white shadow-md shadow-[#092328]/60 font-bold">
            <Scale size={19} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-white">
                BidVerify<span className="text-[#8BBB92] font-bold">AI</span>
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#12544F] text-[#8BBB92] border border-[#2A835F]/50">
                SIH26100
              </span>
            </div>
            <p className="text-[11px] text-slate-300/80 font-medium tracking-wide">
              GovTech Compliance Suite
            </p>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Navigation
        </div>
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                isActive
                  ? 'bg-[#2A835F] text-white shadow-sm font-semibold'
                  : 'text-slate-300 hover:bg-[#12544F]/40 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon size={16} className={isActive ? 'text-white' : 'text-[#8BBB92]'} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                    isActive ? 'bg-[#12544F] text-white' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* System Status & Current User */}
      <div className="p-3 border-t border-[#12544F]/40 bg-[#06191d]">
        {/* User Card */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-[#12544F]/40 border border-[#2A835F]/30">
          <div className="flex items-center gap-2 truncate">
            <div className="w-7 h-7 rounded-full bg-[#12544F] border border-[#2A835F] text-[#8BBB92] text-xs font-bold flex items-center justify-center shrink-0">
              {currentUser.avatarInitials}
            </div>
            <div className="truncate">
              <div className="text-xs font-semibold text-slate-200 truncate">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {currentUser.role === 'PROCUREMENT_OFFICER'
                  ? 'Procurement Officer'
                  : 'System Administrator'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
