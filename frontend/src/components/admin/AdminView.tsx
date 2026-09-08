import React, { useState } from 'react';
import {
  Settings,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  AlertCircle,
  FlaskConical,
  Lock,
  UserCheck,
  CheckCircle2,
  ExternalLink,
  Cpu,
  Layers,
  Sparkles,
  Sliders
} from 'lucide-react';
import { VerificationProvider, User } from '../../types';
import { MOCK_USERS, MOCK_PROVIDERS } from '../../data/mockData';

interface AdminViewProps {
  currentUser: User;
  onUserRoleChange: (userId: string, newRole: string) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  currentUser,
  onUserRoleChange
}) => {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [providers, setProviders] = useState<VerificationProvider[]>(MOCK_PROVIDERS);
  const [mandatoryWeight, setMandatoryWeight] = useState(3);
  const [optionalWeight, setOptionalWeight] = useState(1);
  const [lowRiskThreshold, setLowRiskThreshold] = useState(80);

  const handleToggleMockAttempt = (providerName: string) => {
    alert(
      `Notice: "${providerName}" is in MOCK mode for the SIH26100 hackathon prototype.\n\nSwitching to AUTHORIZED mode requires live GSP / API requester production credentials from the respective government ministry, as architected under the adapter pattern.`
    );
  };

  return (
    <div id="admin-view" className="space-y-6 pb-16">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
            System Administration
          </span>
          <span className="text-xs font-mono text-slate-400">Adapter-Swap Architecture &amp; Governance</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Verification Provider Adapters &amp; System Configuration
        </h2>
        <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
          The adapter pattern decouples the Rule Engine from the underlying verification data source. The prototype uses mock adapters that return normalized verification schemas identical to future production APIs.
        </p>
      </div>

      {/* 1. Verification Provider Status Panel (Adapter Architecture) */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Cpu size={16} className="text-blue-600" />
              <span>Government Registry Verification Adapters ({providers.length})</span>
            </h3>
            <p className="text-xs text-slate-500">
              Active adapters configured via ProviderFactory pattern
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-violet-50 text-violet-800 border border-violet-200 text-xs font-semibold">
            <FlaskConical size={13} className="text-violet-600" />
            <span>Mode: All Mock Providers Active</span>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {providers.map(prov => (
            <div
              key={prov.id}
              className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
            >
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center gap-2.5">
                  <span className="font-bold text-slate-900 text-sm">
                    {prov.name}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-bold border border-slate-200">
                    {prov.checkType}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    OPERATIONAL
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-normal">
                  {prov.description}
                </p>
                <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2 pt-1">
                  <span>Last health-check: {prov.lastSync}</span>
                  <span>&bull;</span>
                  <span className="text-amber-700 font-semibold">{prov.authRequiredNote}</span>
                </div>
              </div>

              {/* MOCK vs AUTHORIZED Toggle */}
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-lg border border-slate-200 text-xs">
                  <span className="px-2 py-1 rounded bg-violet-600 text-white font-bold text-[11px] shadow-2xs">
                    MOCK (ACTIVE)
                  </span>
                  <button
                    type="button"
                    onClick={() => handleToggleMockAttempt(prov.name)}
                    title="Authorized production connection requires ministry credentials"
                    className="px-2 py-1 rounded text-slate-400 font-semibold text-[11px] cursor-not-allowed hover:text-slate-600 flex items-center gap-1"
                  >
                    <Lock size={10} />
                    <span>AUTHORIZED (OFF)</span>
                  </button>
                </div>
                <span className="text-[10px] text-slate-400">
                  Swappable without altering rule engine logic
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. User & Role Management Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <UserCheck size={16} className="text-blue-600" />
            <span>User & Access Governance</span>
          </h3>
          <p className="text-xs text-slate-500">
            Role-Based Access Control (RBAC) across procurement committees
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-6">Official Name & Designation</th>
                <th className="py-3 px-4">Email Address</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Current Role</th>
                <th className="py-3 px-6 text-right">Access Permission</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-slate-50/70">
                  <td className="py-3.5 px-6">
                    <div className="font-bold text-slate-900">{u.name}</div>
                    <div className="text-[11px] text-slate-500">{u.designation}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">{u.email}</td>
                  <td className="py-3.5 px-4">{u.department}</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                      {u.role.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <span className="text-[11px] text-emerald-700 font-semibold">
                      Full Decision Authority
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Deterministic Scoring Weights Configurator */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center gap-2">
          <Sliders size={18} className="text-blue-600" />
          <h3 className="text-sm font-bold text-slate-900">
            Deterministic Scoring Formula Weights
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-semibold text-slate-700">Mandatory Rule Weight:</span>
            <div className="text-xl font-extrabold text-slate-900">{mandatoryWeight}x multiplier</div>
            <p className="text-[11px] text-slate-500">A failure on a mandatory check immediately drops score severely.</p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-semibold text-slate-700">Optional Rule Weight:</span>
            <div className="text-xl font-extrabold text-slate-900">{optionalWeight}x multiplier</div>
            <p className="text-[11px] text-slate-500">Evaluates supplementary preference criteria (e.g. MSME / Startups).</p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
            <span className="font-semibold text-slate-700">Low Risk Threshold:</span>
            <div className="text-xl font-extrabold text-emerald-700">&ge; {lowRiskThreshold}%</div>
            <p className="text-[11px] text-slate-500">Bids at or above this score are prioritized for straightforward review.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
