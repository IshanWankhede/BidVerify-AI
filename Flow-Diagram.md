<div align="center">

# 🔀 Flow Diagrams — BidVerify AI
### Two-Branch Verification Workflows

[![SIH](https://img.shields.io/badge/SIH-2026-orange?style=for-the-badge)]()
[![Problem Statement](https://img.shields.io/badge/PS%20ID-SIH26100-blue?style=for-the-badge)]()
[![Doc Type](https://img.shields.io/badge/Doc-Flow%20Diagrams-purple?style=for-the-badge)]()

</div>

<br>

> 💡 For domain background see [`info.md`](./info.md); for component details see [`architecture.md`](./architecture.md); for the data model see [`database.md`](./database.md).

<br>

## 📑 Diagrams in This File

1. [Complete End-to-End Workflow](#1-complete-end-to-end-workflow)
2. [Bidder-Level Verification Flow (Branch A)](#2-bidder-level-verification-flow-branch-a)
3. [Tender-Specific Compliance Flow (Branch B)](#3-tender-specific-compliance-flow-branch-b)
4. [Applicability Engine Flow](#4-applicability-engine-flow)
5. [Multi-Portal Verification Flow](#5-multi-portal-verification-flow)
6. [DigiLocker / Document Verification Flow](#6-digilocker--document-verification-flow)
7. [Blacklisting / Debarment Verification Flow](#7-blacklisting--debarment-verification-flow)
8. [Compliance Decision Flow](#8-compliance-decision-flow)
9. [Human-in-the-Loop Flow](#9-human-in-the-loop-flow)
10. [Audit Trail Flow](#10-audit-trail-flow)

<br>

---

## 1. Complete End-to-End Workflow

This is the full journey, showing the **two parallel verification branches** clearly — the most important structural correction versus earlier versions of this document.

```mermaid
flowchart TD
    A[📢 Tender] --> B[Requirement Extraction]
    B --> C[🎯 Applicability Engine]
    C --> D[✅ Generate Required Compliance Checklist]
    D --> E["🏢 Branch A:<br/>Bidder-Level Verification"]
    D --> F["📄 Branch B:<br/>Tender-Specific Bid Verification"]
    E --> G[Combine Results]
    F --> G
    G --> H[⚖️ Compliance Engine]
    H --> I[Evidence-Backed Findings]
    I --> J[📊 Compliance Score + Risk Level]
    J --> K[🤖 AI Recommendation]
    K --> L[🖥️ Procurement Officer Review]
    L --> M[👤 Final Decision]

    style E fill:#e8f0fe,stroke:#2e74b5
    style F fill:#fff4e5,stroke:#e69500
    style H fill:#fce8e6,stroke:#d93025
    style M fill:#e6f4ea,stroke:#1e8e3e
```

**In plain words:** The tender is read and its requirements extracted. The Applicability Engine decides which checks actually matter for *this* tender, producing a checklist. That checklist then drives **two branches at once** — checking the bidder's general statutory standing, and checking whether this specific bid meets this specific tender's requirements. Both sets of results are combined by the Compliance Engine into evidence-backed findings, scored and risk-rated, summarized by an AI recommendation, and finally reviewed by the Procurement Officer, who makes the actual decision.

<br>

---

## 2. Bidder-Level Verification Flow (Branch A)

```mermaid
flowchart TD
    A[Bidder Identity + Bidder Documents] --> B[Extract Identifiers]
    B --> C{Determine Applicable<br/>Statutory Checks}
    C --> D[Verification Adapters]
    D --> E[Mock or Authorized Source]
    E --> F[Normalized Results]
    F --> G[Evidence Stored]
```

**In plain words:** Starting from the bidder's identity and documents, the system extracts identifiers (GSTIN, PAN, Udyam number, etc.). Based on the Applicability Matrix, it determines which statutory checks are relevant to this bidder, then routes each one through the appropriate Verification Adapter — which may return a mock (prototype) or authorized (future production) result. Results are normalized into a standard format and stored with evidence.

<br>

---

## 3. Tender-Specific Compliance Flow (Branch B)

```mermaid
flowchart TD
    A[Tender Requirements] --> C[Requirement-to-Evidence Matching]
    B[Bidder Bid / Documents] --> C
    C --> D[Rule Evaluation]
    D --> E{Outcome}
    E --> F[✅ Compliant]
    E --> G[❌ Non-Compliant]
    E --> H[⚠️ Needs Review]
    E --> I[➖ Not Applicable]
```

**In plain words:** This branch takes the tender's specific requirements and matches each one against the evidence found in the bidder's bid documents. Each requirement is evaluated and lands in one of four states — not just pass/fail — because some requirements may simply not apply to this bidder, and some may need more evidence before a clean answer is possible.

<br>

---

## 4. Applicability Engine Flow

```mermaid
flowchart TD
    A[📢 Tender] --> B[Extract Conditions]
    B --> C[Determine Required Checks]
    C --> D[📋 Applicability Matrix]
```

**In plain words:** The tender is scanned for its stated conditions. From these, the system determines exactly which checks are required for this tender — producing the Applicability Matrix that both Branch A and Branch B rely on. This is what prevents the system from blindly running every possible verification on every bid.

<br>

---

## 5. Multi-Portal Verification Flow

```mermaid
flowchart TD
    A[System / Verification Layer] --> B[🔌 Verification Adapter Layer]
    B --> C{Mode?}
    C -->|MOCK| D[Mock Adapter]
    C -->|PRODUCTION| E["Authorized Source Adapter<br/>(future, once approved)"]
    D --> F[Normalized Verification Result]
    E --> F
```

**In plain words:** Whether a verification check is being simulated (mock, for the hackathon prototype) or performed against a real authorized government source (future production, once access is granted), the request goes through the same Adapter Layer and comes back as the same standardized result shape. This is what lets the rest of the system stay identical across both modes.

<br>

---

## 6. DigiLocker / Document Verification Flow

> ⚠️ This diagram deliberately shows **two distinct paths** — document-level validation vs. actual DigiLocker integration — since conflating them is a common mistake. See [`info.md` → Section 11-K](./info.md#k-digilocker--document-verification) for the full explanation.

```mermaid
flowchart TD
    A[Bidder Uploads Document] --> B{What kind of check?}
    B -->|"Document-level validation<br/>(always available)"| C[Extract Metadata & Structure]
    B -->|"DigiLocker integration<br/>(requires official partner onboarding)"| D{Are we an<br/>onboarded DigiLocker<br/>Partner?}
    D -->|No — MVP| E["🧪 Mock DigiLocker Adapter<br/>(clearly labeled DEMO data)"]
    D -->|Yes — future/production| F[Authorized DigiLocker Retrieval Flow]
    C --> G[Normalized Document Result]
    E --> G
    F --> G
    G --> H[Compare with Bidder-Submitted Info]
    H --> I[Store Evidence]
    I --> J[Send to Compliance Engine]

    style E fill:#fff4e5,stroke:#e69500
    style F fill:#e8eaed,stroke:#5f6368,stroke-dasharray: 5 5
```

**In plain words:** Every uploaded document always gets basic document-level validation (checking its structure and extracted metadata). *Separately*, true DigiLocker integration — retrieving or confirming a document at the source — is only possible for an officially onboarded DigiLocker partner organization. Since the hackathon prototype is not such a partner, it uses a clearly-labeled mock adapter instead. Both paths converge into the same normalized result format, which is compared against the bidder's claims, stored as evidence, and passed to the Compliance Engine.

<br>

---

## 7. Blacklisting / Debarment Verification Flow

```mermaid
flowchart TD
    A[Bidder Identifiers: Name + Registration Number] --> B[Select Blacklist Source]
    B --> C[Identifier Matching]
    C --> D{Match Found?}
    D -->|No Match| E[✅ CLEAR]
    D -->|"Potential Match<br/>(name similarity only)"| F[⚠️ NEEDS REVIEW]
    D -->|"Strong Match<br/>(identifier + name)"| G[🚩 FLAGGED]
    D -->|Source Not Accessible| H[SOURCE_UNAVAILABLE]
    F --> I[👤 Human Review Required]
    G --> I

    style F fill:#fff4e5,stroke:#e69500
    style G fill:#fce8e6,stroke:#d93025
```

**In plain words:** The system checks the bidder's identifiers against whatever blacklist/debarment source is applicable (remembering there's no single unified national database — see `info.md` Section 11-L). Because company names alone can be ambiguous (two unrelated companies can share a name), a name-only match is treated as `NEEDS_REVIEW` rather than an automatic flag — only a match on both name *and* a hard identifier (like registration number) is treated as a strong `FLAGGED` result. Either way, human review is required before this affects the final decision.

<br>

---

## 8. Compliance Decision Flow

```mermaid
flowchart TD
    A[Bidder Verification Results] --> C[Compliance Engine]
    B[Bid Compliance Results] --> C
    C --> D[Weighted Scoring]
    D --> E[Compliance Score]
    D --> F[Risk Level]
    E --> G[AI Recommendation Generated]
    F --> G
    G --> H[Presented on Officer Dashboard]
```

**In plain words:** Once both branches' results are in, the Compliance Engine applies weighted scoring (mandatory requirements count more) to produce a Compliance Score and Risk Level. These feed an AI-generated recommendation, all of which is presented together on the officer's dashboard — as inputs to their decision, not as the decision itself.

<br>

---

## 9. Human-in-the-Loop Flow

```mermaid
flowchart TD
    A[System] --> B["Generates: Results, Evidence,<br/>Risk Indicators, AI Recommendation"]
    B --> C[Procurement Officer Review]
    C --> D{Officer Decision}
    D -->|Agrees with findings| E[Accept Result]
    D -->|Needs more information| F[Request Clarification / Review]
    E --> G[👤 Final Authorized Decision]
    F --> G
```

**In plain words:** The system never issues a final verdict on its own — it generates results, evidence, and a recommendation, all reviewed by the officer. The officer can accept the findings or request further clarification (e.g., from the bidder). Either way, the final authorized decision is always recorded as the officer's own action.

<br>

---

## 10. Audit Trail Flow

```mermaid
flowchart TD
    A[Action Occurs] --> B[Verification / Compliance Event]
    B --> C[Timestamp Recorded]
    C --> D[Linked Evidence]
    D --> E[Result Stored]
    E --> F[Officer Action, if any]
    F --> G[📜 Audit Log Entry]
```

**In plain words:** Every meaningful action — a document processed, a check run, a decision made — is captured as an event, timestamped, linked to its evidence and result, and combined with any officer action into a permanent audit record, answering "why was this bid approved or rejected?" for any later review.

