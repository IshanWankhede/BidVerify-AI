import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { User, UserRole, Tender, Bid, AuditLog, Evidence } from './types';
import { MOCK_USERS, MOCK_TENDERS, MOCK_BIDS, MOCK_AUDIT_LOGS } from './data/mockData';
import { Sidebar, NavScreen } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { EvidenceDrawer } from './components/common/EvidenceDrawer';
import { ToastContainer, ToastMessage } from './components/common/Toast';
import { DashboardView } from './components/dashboard/DashboardView';
import { TendersView } from './components/tenders/TendersView';
import { ApplicabilityMatrixView } from './components/tenders/ApplicabilityMatrixView';
import { BidReviewView } from './components/bids/BidReviewView';
import { AuditTrailView } from './components/audit/AuditTrailView';
import { AdminView } from './components/admin/AdminView';
import { UploadTenderModal } from './components/tenders/UploadTenderModal';
import { LoginView } from './components/auth/LoginView';

export default function App() {
  // Authentication / Active Persona
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[0]);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

  // Navigation State
  const [currentScreen, setCurrentScreen] = useState<NavScreen>('dashboard');

  // Core Data States
  const [tenders, setTenders] = useState<Tender[]>(MOCK_TENDERS);
  const [selectedTenderId, setSelectedTenderId] = useState<string>('tender-001');

  const [bids, setBids] = useState<Bid[]>(MOCK_BIDS);
  const [selectedBidId, setSelectedBidId] = useState<string>('bid-001');

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(MOCK_AUDIT_LOGS);

  // UI States
  const [isMasked, setIsMasked] = useState<boolean>(true);
  const [activeEvidence, setActiveEvidence] = useState<Evidence | null>(null);
  const [isEvidenceOpen, setIsEvidenceOpen] = useState<boolean>(false);
  const [isUploadTenderOpen, setIsUploadTenderOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Toast Helper
  const addToast = (type: 'success' | 'warning' | 'error' | 'info', title: string, message: string) => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}-${Math.random()}`,
      type,
      title,
      message
    };
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Role Switcher Handler
  const handleSwitchRole = (role: UserRole) => {
    const targetUser = MOCK_USERS.find(u => u.role === role) || MOCK_USERS[0];
    setCurrentUser(targetUser);
    addToast('info', 'Active Persona Switched', `Now operating as ${targetUser.name} (${targetUser.designation})`);
  };

  // Evidence Drawer Handler
  const handleOpenEvidence = (evidence: Evidence) => {
    setActiveEvidence(evidence);
    setIsEvidenceOpen(true);
  };

  // Officer Decision Submission
  const handleSubmitDecision = (
    bidId: string,
    decision: 'APPROVED' | 'REJECTED' | 'CLARIFICATION_REQUESTED',
    comment: string
  ) => {
    const targetBid = bids.find(b => b.id === bidId);
    if (!targetBid) return;

    const previousStatus = targetBid.status;
    const nowTimestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);

    // Update Bid State
    const updatedBids = bids.map(b => {
      if (b.id === bidId) {
        return {
          ...b,
          status: decision,
          officerDecision: {
            officerName: currentUser.name,
            officerRole: currentUser.role,
            decision: decision,
            comment: comment,
            decidedAt: nowTimestamp
          }
        };
      }
      return b;
    });
    setBids(updatedBids);

    // Append to Audit Trail
    const actionLabel = decision === 'APPROVED' 
      ? 'BID_APPROVED' 
      : decision === 'REJECTED' 
      ? 'BID_REJECTED' 
      : 'CLARIFICATION_REQUESTED';

    const newAuditEntry: AuditLog = {
      id: `audit-${Date.now()}`,
      timestamp: nowTimestamp,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.designation,
      action: actionLabel,
      tenderId: targetBid.tenderId,
      tenderRef: tenders.find(t => t.id === targetBid.tenderId)?.refNo,
      bidId: targetBid.id,
      bidderName: targetBid.bidder.companyName,
      summary: `Official human procurement decision recorded: ${decision.replace(/_/g, ' ')}. Justification: "${comment}"`,
      previousResult: {
        status: previousStatus,
        complianceScore: targetBid.complianceScore,
        officerDecision: targetBid.officerDecision
      },
      updatedResult: {
        status: decision,
        officerDecision: {
          decision,
          comment,
          officer: currentUser.name,
          timestamp: nowTimestamp
        }
      }
    };

    setAuditLogs(prev => [newAuditEntry, ...prev]);

    addToast(
      decision === 'APPROVED' ? 'success' : decision === 'REJECTED' ? 'error' : 'warning',
      'Determination Recorded into Audit Ledger',
      `${targetBid.bidder.companyName} determination set to ${decision.replace(/_/g, ' ')}.`
    );
  };

  // Tender Creation Handler
  const handleTenderCreated = (newTender: Tender) => {
    setTenders(prev => [newTender, ...prev]);
    setSelectedTenderId(newTender.id);

    // Append audit log
    const nowTimestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const newAuditEntry: AuditLog = {
      id: `audit-${Date.now()}`,
      timestamp: nowTimestamp,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.designation,
      action: 'TENDER_CREATED',
      tenderId: newTender.id,
      tenderRef: newTender.refNo,
      summary: `Tender ingested: ${newTender.title}. 5 rules generated via Applicability Engine.`,
      updatedResult: {
        refNo: newTender.refNo,
        authority: newTender.authority,
        requirementsCount: newTender.requirementsCount
      }
    };
    setAuditLogs(prev => [newAuditEntry, ...prev]);

    addToast(
      'success',
      'Tender Ingestion Complete',
      `Matrix built for ${newTender.refNo}. Switched to Applicability Matrix.`
    );
    setCurrentScreen('applicability');
  };

  // Current active entity names for Header breadcrumb
  const currentTender = tenders.find(t => t.id === selectedTenderId);
  const currentBid = bids.find(b => b.id === selectedBidId);
  const pendingBidsCount = bids.filter(b => b.status === 'PENDING_OFFICER_DECISION').length;

  if (showLoginModal) {
    return (
      <LoginView
        onSelectUser={user => {
          setCurrentUser(user);
          setShowLoginModal(false);
          addToast('success', 'Session Established', `Operating as ${user.name}`);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans antialiased text-slate-900">
      <div className="flex flex-1 w-full">
        {/* Persistent Left Navigation Sidebar */}
        <Sidebar
          currentScreen={currentScreen}
          onNavigate={screen => setCurrentScreen(screen)}
          currentUser={currentUser}
          pendingBidsCount={pendingBidsCount}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Header
            currentScreen={currentScreen}
            currentUser={currentUser}
            onSwitchRole={handleSwitchRole}
            isMasked={isMasked}
            onToggleMask={() => setIsMasked(!isMasked)}
            onOpenUploadTender={() => setIsUploadTenderOpen(true)}
            activeTenderRef={currentTender?.refNo}
            activeBidderName={currentBid?.bidder.companyName}
          />

          <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={currentScreen}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1.0] }}
                className="w-full"
              >
                {currentScreen === 'dashboard' && (
                  <DashboardView
                    tenders={tenders}
                    bids={bids}
                    auditLogs={auditLogs}
                    onNavigate={screen => setCurrentScreen(screen)}
                    onSelectTender={id => setSelectedTenderId(id)}
                    onSelectBid={id => setSelectedBidId(id)}
                  />
                )}

                {currentScreen === 'tenders' && (
                  <TendersView
                    tenders={tenders}
                    onSelectTender={id => setSelectedTenderId(id)}
                    onNavigate={screen => setCurrentScreen(screen)}
                    onOpenUploadModal={() => setIsUploadTenderOpen(true)}
                  />
                )}

                {currentScreen === 'applicability' && (
                  <ApplicabilityMatrixView
                    tenders={tenders}
                    selectedTenderId={selectedTenderId}
                    onSelectTender={id => setSelectedTenderId(id)}
                    bids={bids}
                    onSelectBid={id => setSelectedBidId(id)}
                    onNavigate={screen => setCurrentScreen(screen)}
                  />
                )}

                {currentScreen === 'bid-review' && (
                  <BidReviewView
                    bids={bids}
                    selectedBidId={selectedBidId}
                    onSelectBid={id => setSelectedBidId(id)}
                    tenders={tenders}
                    isMasked={isMasked}
                    onToggleMask={() => setIsMasked(!isMasked)}
                    onOpenEvidence={handleOpenEvidence}
                    onSubmitDecision={handleSubmitDecision}
                  />
                )}

                {currentScreen === 'audit-trail' && (
                  <AuditTrailView
                    auditLogs={auditLogs}
                    tenders={tenders}
                    bids={bids}
                  />
                )}

                {currentScreen === 'admin' && (
                  <AdminView
                    currentUser={currentUser}
                    onUserRoleChange={(userId, newRole) => {
                      addToast('info', 'Permissions Updated', `User permissions reconfigured.`);
                    }}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* Slide-over Evidence Drawer */}
      <EvidenceDrawer
        isOpen={isEvidenceOpen}
        evidence={activeEvidence}
        onClose={() => setIsEvidenceOpen(false)}
      />

      {/* Upload Tender Modal */}
      <UploadTenderModal
        isOpen={isUploadTenderOpen}
        onClose={() => setIsUploadTenderOpen(false)}
        onTenderCreated={handleTenderCreated}
      />

      {/* Floating System Toasts */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
