# PRD.md — Product Requirements Document
## BidVerify AI — AI-Powered Bidder Verification & Bid Compliance Platform

**Team:** TENACORE | **Problem Statement:** SIH26100 | **Event:** Smart India Hackathon 2026

> 📌 **Source fidelity note:** This document follows the project's official presentation (PPT) as the source of truth. Anything not explicitly shown in the PPT is marked **"Recommended Implementation"** with a reason — never presented as already built or confirmed.

---

## 1. Product Overview

BidVerify AI is a decision-support platform that helps Procurement Officers verify government tender bids faster and more consistently. It reads tender and bid documents, checks the bidder's statutory standing, checks the bid against the tender's specific requirements, and produces an evidence-backed Compliance Score and Risk Level — while the **Procurement Officer always makes the final decision.**

In one sentence: **AI assists. Rules evaluate. Officer decides.**

---

## 2. Problem Statement

Government e-Marketplace (GeM) procurement requires checking every bid against many statutory and tender-specific conditions — GST, PAN, Udyam/MSME status, turnover, experience, OEM authorization, and more. Today this is done manually: officers read stacks of unstructured PDF documents, cross-check scattered rules, and record findings by hand. This is slow, inconsistent between officers, and hard to audit later.

---

## 3. Background

- Public procurement decisions must be transparent, fair, and defensible — because public money is involved.
- Bid volume per tender can be large; manual review doesn't scale evenly.
- Verification information is split across many domains (tax, labor compliance, company registration, tender-specific technical criteria) with no single unified checklist tool today.
- Government verification sources vary in public accessibility — some have public lookups, most require formal authorization for automated integration (see `mock_api.md` for the honest breakdown per source).

---

## 4. Target Users

| User | Description |
|:---|:---|
| **Procurement Officer** | Primary user — reviews bids, evidence, and makes the final decision |
| **System Administrator** | Manages users, roles, and system configuration |
| **Bid Evaluation Committee Member** | Secondary reviewer for high-value tenders (Recommended Implementation — not detailed in PPT) |

---

## 5. Stakeholders

| Stakeholder | Interest |
|:---|:---|
| Government buyer organizations (e.g., CPSEs) | Faster, standardized, auditable procurement |
| Bidders/Sellers | Fair, consistent, transparent evaluation |
| Oversight/Audit bodies | Traceable evidence and decision history |

---

## 6. Goals

1. Reduce manual verification effort for Procurement Officers.
2. Ensure only *applicable* checks run per tender — not a blanket checklist.
3. Separate bidder-level verification from tender-specific bid compliance.
4. Make every result evidence-backed and explainable.
5. Keep the Procurement Officer as the sole final decision-maker.
6. Build an architecture where mock verification providers can be swapped for authorized ones without redesigning the core system.

## 7. Non-Goals

- The system will **not** auto-approve or auto-reject any bid.
- The system will **not** claim live integration with real government APIs in the MVP.
- The system will **not** attempt to cover every possible Indian government verification source in the first version — scope is limited to GST, Udyam, PAN, MCA, EPFO, ESIC, plus tender-specific document checks.
- The system will **not** store or process real bidder PAN/GSTIN/financial data in the hackathon demo — only clearly labeled synthetic data.

---

## 8. User Personas

### Persona 1 — Priya, Procurement Officer
- Reviews 15–30 bids per tender cycle.
- Needs fast, trustworthy compliance summaries she can defend in an audit.
- Not a data scientist — needs plain-language explanations, not raw model output.

### Persona 2 — Arjun, System Administrator
- Manages officer accounts, roles, and system health.
- Needs visibility into verification provider status (mock vs. authorized) and audit logs.

---

## 9. User Journeys

### Journey A — Reviewing a Bid
1. Priya logs in and opens a Tender.
2. She sees the Applicability Matrix — which checks apply to this tender.
3. She opens a specific Bid and sees Branch A (bidder verification) and Branch B (bid compliance) results.
4. She clicks into a flagged result and sees the Evidence Viewer — source document, page, highlighted text.
5. She reviews the Compliance Score, Risk Level, and AI recommendation with citations.
6. She records her decision: Approve / Reject / Seek Clarification.
7. The action is logged to the Audit Trail.

### Journey B — Setting Up a New Tender
1. Priya (or an admin) uploads a Tender document.
2. The system extracts requirements and generates the Applicability Matrix.
3. Priya confirms/adjusts which checks apply (Recommended Implementation: manual override capability).
4. Bidders' bids are uploaded/linked for verification.

---

## 10. Functional Requirements (Summary — full detail in `requirement.md`)

| ID | Requirement |
|:---|:---|
| FR-1 | Upload and process tender documents |
| FR-2 | Extract structured requirements from tender text (RAG-assisted) |
| FR-3 | Generate an Applicability Matrix per tender |
| FR-4 | Run Branch A (Bidder Verification) via mock/authorized adapters |
| FR-5 | Run Branch B (Bid Compliance) against tender-specific requirements |
| FR-6 | Evaluate compliance via a deterministic Rule Engine |
| FR-7 | Detect cross-document inconsistencies |
| FR-8 | Generate Compliance Score (0–100) and Risk Level |
| FR-9 | Generate an AI recommendation with citations (never a final decision) |
| FR-10 | Display evidence (document, page, extracted text) for every finding |
| FR-11 | Allow the officer to Approve / Reject / Seek Clarification |
| FR-12 | Maintain a complete audit trail |

## 11. Non-Functional Requirements (Summary)

| ID | Requirement |
|:---|:---|
| NFR-1 | System must never let AI output directly become a compliance verdict |
| NFR-2 | All mock data must be clearly labeled as synthetic |
| NFR-3 | Sensitive identifiers (PAN/GSTIN-style) must be maskable |
| NFR-4 | Verification providers must be swappable (mock ↔ authorized) without core redesign |
| NFR-5 | UI must be desktop-first, accessible, and evidence-oriented |

---

## 12. Features (MVP)

- Tender & bid document upload and processing
- Requirement extraction (RAG-grounded)
- Applicability Engine
- Branch A: Bidder Verification (mock providers — GST, Udyam, PAN, MCA, EPFO, ESIC)
- Branch B: Bid Compliance (documents, turnover, experience, certificates, OEM authorization)
- Deterministic Compliance/Rule Engine
- Cross-document mismatch detection
- Evidence Engine
- Compliance Score (0–100) + Risk Level
- AI Recommendation (RAG + LLM, citation-backed)
- Officer review & final decision workflow
- Audit trail

## 13. Future Scope

- Authorized (real) verification provider integrations, once official access/onboarding exists
- Multi-officer / committee review workflows
- Analytics dashboard across tenders
- Multilingual document support

---

## 14. Success Metrics

> ⚠️ Treated as **targets**, not proven results, until measured via real pilot testing.

| Metric | Target |
|:---|:---|
| Reduction in manual verification effort | 60–80% (target, per problem statement framing) |
| Time-to-decision per bid | Faster than current manual baseline |
| Evidence traceability | 100% of compliance results linked to source evidence |
| False auto-decisions | 0 — AI never makes a final call |

---

## 15. Risks

| Risk | Mitigation |
|:---|:---|
| LLM hallucination in requirement interpretation | RAG grounding + mandatory citation; Rule Engine never trusts ungrounded LLM output |
| OCR errors on scanned documents | Confidence scoring; low-confidence extractions flagged for review |
| No live government API access | Adapter pattern — mock now, real later, without redesign |
| False positive blacklist matches | Identifier-based matching + mandatory human review on any match |
| Overloading officer with information | Evidence-first, prioritized UI (see `design.md`) |

## 16. Assumptions

- The hackathon MVP uses synthetic/mock bidder and tender data (explicitly permitted by the problem statement).
- Real government API access is out of scope until formal authorization is granted.
- Officers have basic computer literacy; no special training assumed beyond a short onboarding.

## 17. Constraints

- No confirmed public bulk API exists for several sources (GST filing status, EPFO, ESIC, DigiLocker) — see `mock_api.md` for the full per-source breakdown.
- Team must not use real PAN/GSTIN/personal data anywhere in the build or demo.

## 18. Human-in-the-Loop Model

| Layer | Role |
|:---|:---|
| RAG + LLM | Understands documents, retrieves grounded context, drafts recommendations |
| Applicability Engine | Decides which checks apply |
| Rule Engine | Deterministically evaluates compliance — the only component allowed to output COMPLIANT/NON_COMPLIANT |
| Procurement Officer | Makes the final, authoritative decision: Approve / Reject / Seek Clarification |

**No component upstream of the Officer can finalize a bid's fate.**
