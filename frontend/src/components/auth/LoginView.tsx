import React from 'react';
import {
  Scale,
  ShieldCheck,
  UserCheck,
  Sparkles,
  ArrowRight,
  FlaskConical,
  Building2,
  Lock,
  FileCheck2
} from 'lucide-react';
import { User, UserRole } from '../../types';
import { MOCK_USERS } from '../../data/mockData';

interface LoginViewProps {
  onSelectUser: (user: User) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onSelectUser }) => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-6 text-slate-100">
      <div className="max-w-xl w-full space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-950/80 text-teal-300 border border-teal-800/80 text-xs font-semibold">
            <Sparkles size={13} />
            <span>Smart India Hackathon &bull; SIH26100</span>
          </div>

          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-700 flex items-center justify-center text-white shadow-xl shadow-teal-700/30 font-bold">
              <Scale size={28} />
            </div>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-white">
              BidVerify<span className="text-teal-400">AI</span>
            </h1>
          </div>

          <p className="text-sm text-slate-400 max-w-md mx-auto">
            AI-Assisted Bidder Verification &amp; Deterministic Bid Compliance Platform for Government Tender Procurement
          </p>
        </div>

        {/* Demo Mode Notice Banner */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1 text-center shadow-lg">
          <div className="flex items-center justify-center gap-2 text-violet-400 font-bold">
            <FlaskConical size={15} />
            <span>DEMO MODE — SINGLE-CLICK PERSONA SELECTOR</span>
          </div>
          <p className="text-slate-400">
            Select an official profile to enter the prototype. No credentials or passwords required. All verification results are synthetic.
          </p>
        </div>

        {/* Persona Cards */}
        <div className="space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 text-center">
            Select Role to Launch Cockpit
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Persona 1: Procurement Officer */}
            <div
              id="login-as-officer-card"
              onClick={() => onSelectUser(MOCK_USERS[0])}
              className="p-5 rounded-2xl bg-slate-900 hover:bg-slate-800/90 border border-slate-800 hover:border-blue-500 transition-all cursor-pointer space-y-3 group shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-300 font-bold flex items-center justify-center">
                  PS
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                  Primary Flow
                </span>
              </div>

              <div>
                <h3 className="font-bold text-white text-base group-hover:text-blue-400 transition-colors">
                  Priya Sharma
                </h3>
                <div className="text-xs text-slate-400">
                  Senior Procurement Officer &bull; CPCL
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Review automated verification results, inspect evidence documents, and record authoritative procurement determinations.
              </p>

              <div className="pt-2 flex items-center justify-between text-blue-400 font-bold text-xs group-hover:translate-x-1 transition-transform">
                <span>Enter as Procurement Officer</span>
                <ArrowRight size={14} />
              </div>
            </div>

            {/* Persona 2: System Administrator */}
            <div
              id="login-as-admin-card"
              onClick={() => onSelectUser(MOCK_USERS[1])}
              className="p-5 rounded-2xl bg-slate-900 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-500 transition-all cursor-pointer space-y-3 group shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-amber-600/20 border border-amber-500/30 text-amber-300 font-bold flex items-center justify-center">
                  AM
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                  Admin Flow
                </span>
              </div>

              <div>
                <h3 className="font-bold text-white text-base group-hover:text-amber-400 transition-colors">
                  Arjun Mehta
                </h3>
                <div className="text-xs text-slate-400">
                  Principal System Administrator
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Manage registry verification adapters (MOCK vs AUTHORIZED), configure deterministic scoring weights, and inspect user audits.
              </p>

              <div className="pt-2 flex items-center justify-between text-amber-400 font-bold text-xs group-hover:translate-x-1 transition-transform">
                <span>Enter as System Admin</span>
                <ArrowRight size={14} />
              </div>
            </div>
          </div>
        </div>

        {/* Core Principle Footer */}
        <div className="text-center text-xs text-slate-500">
          <p className="italic">
            &ldquo;AI assists. Deterministic rules evaluate. The officer decides.&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
};
