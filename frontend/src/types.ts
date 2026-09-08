export type OutcomeStatus = 
  | 'COMPLIANT' 
  | 'NON_COMPLIANT' 
  | 'NEEDS_REVIEW' 
  | 'NOT_APPLICABLE' 
  | 'PENDING_VERIFICATION';

export type VerificationStatus = 
  | 'VERIFIED' 
  | 'NOT_VERIFIED' 
  | 'NEEDS_REVIEW' 
  | 'SOURCE_UNAVAILABLE' 
  | 'NOT_APPLICABLE';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type TenderStatus = 'OPEN' | 'CLOSED' | 'AWARDED';

export type BidStatus = 
  | 'PENDING_OFFICER_DECISION' 
  | 'APPROVED' 
  | 'REJECTED' 
  | 'CLARIFICATION_REQUESTED';

export type UserRole = 'PROCUREMENT_OFFICER' | 'SYSTEM_ADMIN' | 'COMMITTEE_MEMBER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  designation: string;
  department: string;
  avatarInitials: string;
}

export interface TenderRequirement {
  id: string;
  tenderId: string;
  category: 'financial' | 'statutory' | 'technical';
  code: string;
  title: string;
  description: string;
  ruleType: 'numeric_minimum' | 'document_present' | 'string_match' | 'date_valid' | 'percentage_threshold';
  ruleValue: string;
  isMandatory: boolean;
  isApplicable: boolean;
  applicabilityReason: string;
  clauseRef: string;
}

export interface Tender {
  id: string;
  refNo: string;
  title: string;
  authority: string;
  department: string;
  category: string;
  submissionDeadline: string;
  status: TenderStatus;
  estimatedValue: string;
  bidsCount: number;
  requirementsCount: number;
  description: string;
  createdAt: string;
  requirements: TenderRequirement[];
}

export interface Bidder {
  id: string;
  companyName: string;
  registrationNumber: string;
  cin: string;
  pan: string;
  gstin: string;
  udyam: string;
  epfo: string;
  esic: string;
  address: string;
  city: string;
  state: string;
  contactPerson: string;
  email: string;
  phone: string;
}

export interface BranchAResult {
  checkType: 'GST' | 'PAN' | 'UDYAM' | 'MCA' | 'EPFO' | 'ESIC' | 'BLACKLIST';
  label: string;
  identifier: string;
  status: VerificationStatus;
  confidence: number;
  source: string;
  isMock: boolean;
  remarks: string;
  evidenceId: string;
  lastChecked: string;
}

export interface BranchBResult {
  requirementId: string;
  title: string;
  category: 'financial' | 'statutory' | 'technical';
  isMandatory: boolean;
  outcome: OutcomeStatus;
  requiredValue: string;
  observedValue: string;
  explanation: string;
  evidenceId: string;
  clauseRef: string;
}

export interface Evidence {
  id: string;
  title: string;
  documentRef: string;
  documentType: string;
  pageNumber: number;
  extractedText: string;
  highlightKeywords: string[];
  confidenceScore: number;
  isSynthetic: boolean;
  timestamp: string;
  providerSource: string;
  clauseRef?: string;
}

export interface AIRecommendation {
  summaryText: string;
  overallTone: 'favorable' | 'caution' | 'disqualify_risk';
  citations: {
    label: string;
    evidenceId: string;
    clauseRef?: string;
  }[];
  keyFindings: string[];
  suggestedAction: string;
}

export interface OfficerDecision {
  decision: 'APPROVED' | 'REJECTED' | 'CLARIFICATION_REQUESTED';
  comment: string;
  officerName: string;
  officerRole: string;
  decidedAt: string;
}

export interface Bid {
  id: string;
  tenderId: string;
  bidderId: string;
  bidder: Bidder;
  status: BidStatus;
  complianceScore: number;
  riskLevel: RiskLevel;
  submittedAt: string;
  branchAResults: BranchAResult[];
  branchBResults: BranchBResult[];
  evidenceList: Record<string, Evidence>;
  aiRecommendation: AIRecommendation;
  officerDecision?: OfficerDecision;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId?: string;
  userName: string;
  userRole: string;
  tenderId?: string;
  tenderRef?: string;
  bidId?: string;
  bidderName?: string;
  action: 
    | 'TENDER_CREATED' 
    | 'VERIFICATION_RUN' 
    | 'DOCUMENT_UPLOADED' 
    | 'BID_SUBMITTED' 
    | 'BID_APPROVED' 
    | 'BID_REJECTED' 
    | 'CLARIFICATION_REQUESTED' 
    | 'PROVIDER_MODE_TOGGLED' 
    | 'APPLICABILITY_OVERRIDDEN';
  summary: string;
  previousResult?: Record<string, unknown>;
  updatedResult?: Record<string, unknown>;
}

export interface VerificationProvider {
  id: string;
  name: string;
  checkType: string;
  status: 'OPERATIONAL' | 'DEGRADED';
  mode: 'MOCK' | 'AUTHORIZED';
  lastSync: string;
  description: string;
  authRequiredNote: string;
}
