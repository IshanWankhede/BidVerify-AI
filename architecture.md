<div align="center">

# ⚙️ Architecture — BidVerify AI
### System Design & Technology Stack (Two-Branch Model + RAG)

[![SIH](https://img.shields.io/badge/SIH-2026-orange?style=for-the-badge)]()
[![Problem Statement](https://img.shields.io/badge/PS%20ID-SIH26100-blue?style=for-the-badge)]()
[![Doc Type](https://img.shields.io/badge/Doc-Architecture-purple?style=for-the-badge)]()

</div>

<br>

> ⚠️ **This adds a new RAG (Retrieval-Augmented Generation) Layer** — Section 7 below — used for grounded tender-clause retrieval and evidence-backed AI explanations. **RAG is not a replacement for the Compliance Engine.** RAG finds and explains information; the Rule Evaluation Module (Section 9) makes the actual deterministic compliance decision. See the callout in Section 7 for why this boundary is enforced architecturally, not just by convention.

<br>

## 📑 Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Tender Understanding Layer](#2-tender-understanding-layer)
3. [Applicability Engine](#3-applicability-engine)
4. [Bidder Verification Layer](#4-bidder-verification-layer)
5. [Bid & Document Verification Layer](#5-bid-and-document-verification-layer)
6. [Document Intelligence Layer](#6-document-intelligence-layer)
7. [🆕 RAG (Retrieval-Augmented Generation) Layer](#7-rag-retrieval-augmented-generation-layer)
8. [Verification Adapter Layer](#8-verification-adapter-layer)
9. [Compliance Engine](#9-compliance-engine)
10. [Risk & Scoring Layer](#10-risk-and-scoring-layer)
11. [AI Recommendation Layer](#11-ai-recommendation-layer)
12. [Evidence & Explainability Layer](#12-evidence-and-explainability-layer)
13. [Audit Layer](#13-audit-layer)
14. [Human Decision Layer](#14-human-decision-layer)
15. [Security & Privacy Layer](#15-security-and-privacy-layer)
16. [Full Architecture Diagram](#16-full-architecture-diagram)
17. [Technology Stack](#17-technology-stack)
18. [MOCK ↔ PRODUCTION Switching](#18-mock--production-switching)

<br>

---

## 1. Design Philosophy

<table>
<tr>
<td width="20%" valign="top">

### 🧩 1️⃣ Two Branches, One Engine
Bidder-level checks (Branch A) and tender-specific checks (Branch B) run as **separate components** and only combine at the Compliance Engine.

</td>
<td width="20%" valign="top">

### 🔌 2️⃣ Adapters, Never Fakes
Every external verification source is accessed through the **same adapter interface**. Mock and real implementations are interchangeable.

</td>
<td width="20%" valign="top">

### 🎯 3️⃣ Applicability First
The system never blindly runs every possible check. The **Applicability Engine** decides what's relevant, *before* any verification runs.

</td>
<td width="20%" valign="top">

### 🔍 4️⃣ RAG Explains, Rules Decide
Retrieval + LLM understand and explain documents in natural language. **Only the deterministic Rule Engine outputs a compliance verdict.**

</td>
<td width="20%" valign="top">

### 👤 5️⃣ Human Checkpoint, Always
No matter how confident the AI/rule outputs are, the **Officer Dashboard** is the only place a final decision can be recorded.

</td>
</tr>
</table>

<br>

---

## 2. Tender Understanding Layer

**Responsible for:** Reading the tender document, identifying its stated requirements, and extracting eligibility conditions into a structured form.

| Input | Output |
|:---|:---|
| Tender PDF | Structured list of `TenderRequirements` (see [`database.md`](./database.md)) |

Uses the same document-processing pipeline as bidder documents (see [Section 6](#6-document-intelligence-layer)) to get clean text, then hands that text to the **RAG Layer** (see [Section 7](#7-rag-retrieval-augmented-generation-layer)) so the LLM interprets each clause *grounded in* the actual tender text and applicable rulebook excerpts — not from unaided model memory. This is what turns loose tender language into the `Structured Requirement JSON` that the Applicability Engine and Compliance Engine both depend on.

<br>

---

## 3. Applicability Engine

**Responsible for:** Determining *which* checks actually apply to this tender and (where relevant) this bidder — and producing the **Applicability Matrix / Compliance Checklist** that everything downstream depends on.

```mermaid
flowchart LR
    A[Structured Tender Requirements] --> B[Applicability Rules Evaluation]
    B --> C[📋 Applicability Matrix]
    C --> D[Compliance Checklist]
```

**Why this exists as its own layer:** Without it, the system would either (a) run every possible verification on every bid — wasteful and confusing — or (b) require hardcoded, tender-type-specific logic scattered throughout the codebase. Centralizing this decision in one place keeps the rest of the system generic.

<br>

---

## 4. Bidder Verification Layer

> 🆕 **New component versus the pre-two-branch architecture.**

**Responsible for:** Everything under **Branch A** — checks about the *bidder/company itself*, independent of any specific tender.

**Handles:** Udyam/MSME · GST (registration + filing) · PAN · Income Tax compliance · EPFO · ESIC · Startup India · NSIC · Blacklisting/debarment · MCA21 identity · other statutory checks flagged as applicable.

**How it works:** For each applicable check (per the Applicability Matrix), this layer calls the relevant [Verification Adapter](#8-verification-adapter-layer), collects the normalized result, and stores it against the **bidder**, not the specific bid — since a bidder's statutory standing can be reused/referenced across multiple tenders they bid on.

<br>

---

## 5. Bid and Document Verification Layer

> 🆕 **New component, kept explicitly separate from Section 4.**

**Responsible for:** Everything under **Branch B** — checks about whether *this specific bid* satisfies *this specific tender*.

**Handles:** Required document presence · OEM authorization (tender-specific) · turnover threshold · years of experience · technical requirements · local-content declarations · other tender-specific conditions.

**How it works:** For each applicable tender-specific requirement, this layer matches the requirement against extracted bid-document evidence, using the [Rule Evaluation Module](#9-compliance-engine) for deterministic checks (numeric thresholds) and document-comparison logic for qualitative ones (e.g., OEM letter consistency).

<br>

---

## 6. Document Intelligence Layer

**Responsible for:** Turning raw uploaded files into clean, structured, extracted information — shared infrastructure used by both verification branches, the Tender Understanding Layer, and the RAG Layer.

| Sub-component | Job |
|:---|:---|
| Text Extraction | Pull text from native-text PDFs |
| OCR | Read scanned/image-based documents |
| Document Classification | Identify document type (e.g., "GST Certificate") |
| Information Extraction (NLP) | Pull structured fields (e.g., turnover, GSTIN, dates) |
| Chunking | Split cleaned text into retrieval-sized passages for the RAG Layer's vector index |
| Evidence Linking | Tie every extracted field back to its source document/location |

<br>

---

## 7. RAG (Retrieval-Augmented Generation) Layer

> 🆕 **New layer.** This is the answer to "should you use RAG?" — **yes, but scoped narrowly**: RAG retrieves and explains; it never issues a compliance verdict.

**Why RAG, and why *not* let an LLM just "know" the rules:** Tender documents, GFR provisions, GeM's General Terms & Conditions, and category-specific technical specs are long, dense, and vary per tender. An LLM asked to interpret a clause from memory alone can hallucinate a rule that doesn't exist in this tender. RAG fixes this by **forcing the LLM to answer only from retrieved, cited passages** — the same clause text a human reviewer would actually be pointing at.

```mermaid
flowchart TD
    A[📄 Tender Documents] --> C[Chunking + Embedding]
    B[📚 Rules / GFR / GTC / Guidelines] --> C
    C --> D[(Vector Store)]
    D --> E[🔍 RAG Retriever]
    Q[Query: this clause / this check / this flagged item] --> E
    E --> F[Top-k Relevant Passages + Citations]
    F --> G[🤖 LLM / AI Layer]
    G --> H[Understands requirement in context]
    H --> I[Structured Requirement JSON]
    I --> J["⚖️ Rule Engine<br/>(Section 9 — deterministic decision)"]

    style D fill:#f3e8fd,stroke:#8430ce
    style E fill:#f3e8fd,stroke:#8430ce
    style G fill:#e6f1fb,stroke:#2e74b5
    style J fill:#fce8e6,stroke:#d93025
```

**Where RAG is used in this system:**

| Use Case | What Gets Retrieved | Consumed By |
|:---|:---|:---|
| 📄 Tender clause interpretation | Relevant tender passages + matching GFR/GTC rule text | [Tender Understanding Layer](#2-tender-understanding-layer) → produces `Structured Requirement JSON` |
| 📚 Applicable rules/guidelines lookup | Category-specific technical spec excerpts | [Applicability Engine](#3-applicability-engine) — helps decide *which* rule text applies |
| 💬 Tender Q&A (officer asks a question) | Passages from the specific tender document | Officer Dashboard — answered with citations back to tender text |
| 🔎 "Why was this bidder flagged?" explanation | The exact clause/document passage the flag is based on | [Evidence and Explainability Layer](#12-evidence-and-explainability-layer) |
| 📌 Evidence display behind a recommendation | Source passages backing the AI Recommendation | [AI Recommendation Layer](#11-ai-recommendation-layer) |

**Where RAG is explicitly NOT used:**

| Task | Why Not RAG |
|:---|:---|
| GST/PAN/Udyam-style format or threshold checks | These are exact, deterministic comparisons — a rule engine, not a language model, should own them |
| Turnover ≥ required amount | Numeric comparison — no ambiguity to "retrieve" |
| Document expiry date validity | Date comparison — deterministic |
| Mandatory eligibility PASS/FAIL verdict | This is the one decision that must always be reproducible, auditable, and non-probabilistic — see [Section 9](#9-compliance-engine) |

> 🔒 **Architectural guarantee:** The RAG Layer's output (retrieved passages + LLM's structured interpretation) is *input* to the Compliance Engine, never a substitute for it. The Compliance Engine's Rule Evaluation Module is the only component permitted to write a `COMPLIANT` / `NON_COMPLIANT` outcome to the database — see [`database.md`](./database.md) `ComplianceResult` table. RAG/LLM output is stored separately (as `Evidence` and recommendation text), so a probabilistic language-model response can never silently become a compliance verdict.

**Conceptual components:**

```
RAGRetriever
    embed(text_chunks) → VectorStore
    retrieve(query, top_k) → RetrievedPassage[]

LLMInterpreter
    interpret(tender_clause, retrieved_context) → StructuredRequirementJSON
    explain(finding, retrieved_evidence) → citation-backed explanation text
```

**MVP approach:** Index your sample/synthetic tender documents and a small curated set of rule excerpts (e.g., illustrative GFR/GTC clauses relevant to your sample tenders — not a claim of a complete legal corpus) into a local vector store. This is fully demonstrable without any external government API dependency, since it operates entirely on documents already in the system.

<br>

---

## 8. Verification Adapter Layer

**Responsible for:** Providing one consistent interface the Bidder Verification and Bid Verification layers can call, regardless of whether the underlying implementation is mock or real.

> ⚠️ **These are internal software interfaces — not claims that official APIs already exist for every source.** See [`info.md` → Section 11](./info.md#11-verification-source-and-data-acquisition-guide) for what's realistically available per source.

**Conceptual adapter interface:**

```
VerificationProvider
    verify(identifier, context) → StandardizedVerificationResult
```

**Example adapters (conceptual, not asserting real endpoints):**

| Adapter | MVP Implementation | Future Production Implementation |
|:---|:---|:---|
| `UdyamVerificationAdapter` | `MockUdyamProvider` | `RealUdyamProvider` (if/when authorized access exists) |
| `GSTVerificationAdapter` | `MockGSTProvider` | `RealGSTProvider` (via authorized GSP integration) |
| `PANVerificationAdapter` | `MockPANProvider` | `RealPANProvider` (if authorized access exists) |
| `TaxComplianceAdapter` | `MockTaxProvider` | `RealTaxProvider` (requires official authorization) |
| `EPFOAdapter` | `MockEPFOProvider` | `RealEPFOProvider` (requires official authorization) |
| `ESICAdapter` | `MockESICProvider` | `RealESICProvider` (requires official authorization) |
| `StartupIndiaAdapter` | `MockStartupIndiaProvider` | `RealStartupIndiaProvider` |
| `NSICAdapter` | `MockNSICProvider` | `RealNSICProvider` |
| `DigiLockerAdapter` | `MockDigiLockerProvider` | `RealDigiLockerProvider` (requires official partner onboarding) |
| `BlacklistAdapter` | `MockBlacklistProvider` | Org-specific `RealBlacklistProvider(s)` (no single universal source) |
| `MCAAdapter` | `MockMCAProvider` | `RealMCAProvider` (if authorized access exists) |
| `BISAdapter` | `MockBISProvider` | `RealBISProvider` (where relevant/available) |

Every adapter conceptually also supports a **Manual Review Adapter** fallback — for cases where no automated source exists and a human simply records a manual check result.

**Standardized verification result (every adapter returns this same shape):**

```json
{
  "verification_id": "string",
  "source": "string",
  "check_type": "string",
  "identifier": "string",
  "status": "VERIFIED | NOT_VERIFIED | NON_COMPLIANT | NEEDS_REVIEW | NOT_APPLICABLE | SOURCE_UNAVAILABLE | PENDING",
  "confidence": "float",
  "evidence": "string",
  "checked_at": "timestamp",
  "remarks": "string"
}
```

> 🔒 Adapters must not expose sensitive information unnecessarily — only the fields needed for the compliance decision are stored (see [Section 15](#15-security-and-privacy-layer)).

<br>

---

## 9. Compliance Engine

**Responsible for:** Combining results from **both** the Bidder Verification Layer and the Bid/Document Verification Layer into evidence-backed compliance findings.

```mermaid
flowchart TD
    A[Bidder-Level Verification Results] --> C[Compliance Engine]
    B[Tender-Specific Verification Results] --> C
    R[Structured Requirement JSON<br/>from RAG Layer] --> C
    C --> D{Rule Evaluation Module<br/>deterministic}
    D --> E[COMPLIANT]
    D --> F[NON_COMPLIANT]
    D --> G[NEEDS_REVIEW]
    D --> H[NOT_APPLICABLE]
    D --> I[PENDING_VERIFICATION]

    style D fill:#fce8e6,stroke:#d93025
```

**Important:** Outcomes are **not** oversimplified to just compliant/non-compliant. Five states are used because reality includes cases like "not yet checked" (`PENDING_VERIFICATION`) and "doesn't apply to this tender" (`NOT_APPLICABLE`) — collapsing these into a binary would lose important nuance for the officer.

**On RAG's role here:** The RAG Layer supplies the *interpreted requirement* (what the clause means, structured as JSON) as an **input** to this engine. The actual PASS/FAIL/REVIEW logic that consumes that JSON — comparing a number to a threshold, checking a date, checking a required field is present — runs through the **Rule Evaluation Module**, a deterministic, testable, non-probabilistic component. This is the hard boundary described in [Section 7](#7-rag-retrieval-augmented-generation-layer): retrieval and language understanding feed the engine; they never *are* the engine.

<br>

---

## 10. Risk and Scoring Layer

Combines all per-requirement outcomes into:
- **Compliance Score** — a weighted summary (mandatory requirements count more than optional ones).
- **Risk Level** — Low / Medium / High, meant to help an officer triage which bids need the closest attention first.

Both are **decision-support indicators** — see [`info.md` → Section 15](./info.md#15-compliance-score-and-risk-level).

<br>

---

## 11. AI Recommendation Layer

Generates a plain-language summary of findings and a suggested next step (e.g., "recommend requesting clarification on OEM authorization before proceeding") — always evidence-linked, always phrased as a **recommendation**, never as a decision. Uses the **RAG Layer** ([Section 7](#7-rag-retrieval-augmented-generation-layer)) to pull the exact supporting passage for each point in the summary, so every sentence in the recommendation can be traced to a retrieved, cited source rather than generated from the LLM's unaided memory.

<br>

---

## 12. Evidence and Explainability Layer

Ensures every result at every layer — bidder verification, bid verification, compliance outcome, risk score, AI recommendation — carries a traceable link back to its supporting document/field/source response. For RAG-generated explanations specifically (e.g., "why was this bidder flagged?"), this layer stores the **retrieved passage(s) the explanation was grounded in**, alongside the LLM's generated text — so a reviewer can always check the citation, not just trust the sentence. This is enforced structurally through the data model (see [`database.md`](./database.md) `Evidence` table), not just as a UI nicety.

<br>

---

## 13. Audit Layer

Logs every meaningful action across the system — uploads, verification checks, compliance evaluations, RAG queries, officer actions — with a timestamp, to a queryable `AuditLogs` table. Supports later reconstruction of "why was this decision made?"

<br>

---

## 14. Human Decision Layer

The Officer Dashboard where a Procurement Officer reviews all outputs (evidence, compliance results, score, risk, AI recommendation, RAG citations) and records the **final, authoritative decision**. This layer is architecturally guaranteed to be the last step — no automated component, including the RAG/LLM layer, can write a final decision on its own.

<br>

---

## 15. Security and Privacy Layer

| Consideration | Approach |
|:---|:---|
| 🔒 Access control | Documents and extracted data restricted to authorized officer accounts |
| 🗜️ Data minimization | Adapters store only fields necessary for the compliance decision, not entire raw responses |
| 🔐 Sensitive identifiers | PAN/GSTIN-style identifiers should be masked/tokenized/encrypted where feasible, even in the MVP |
| 📚 RAG index scope | The vector store indexes only tender/rule documents already in the system — never external, un-vetted web content — keeping retrieval grounded and auditable |
| 🧪 Demo data hygiene | All mock data must be clearly synthetic, never resembling a real company's actual registration details |
| 🔮 Production considerations | Data-at-rest encryption and formal credential management are noted as future/production requirements, not required for the hackathon prototype |

<br>

---

## 16. Full Architecture Diagram

```mermaid
flowchart TD
    subgraph TENDER_UNDERSTANDING["📢 Tender Understanding Layer"]
        T1[Tender Document]
        T2[Extract Requirements]
    end

    subgraph RAG["🔍 RAG Layer"]
        RAG1[Vector Store]
        RAG2[Retriever]
        RAG3[LLM Interpreter]
    end

    subgraph APPLICABILITY["🎯 Applicability Engine"]
        AP1[Applicability Rules]
        AP2[Compliance Checklist]
    end

    subgraph BIDDER_LAYER["🏢 Bidder Verification Layer<br/>(Branch A)"]
        BV1[Udyam/MSME]
        BV2[GST]
        BV3[PAN / Income Tax]
        BV4[EPFO / ESIC]
        BV5[Startup India / NSIC]
        BV6[Blacklisting]
    end

    subgraph BID_LAYER["📄 Bid & Document Verification Layer<br/>(Branch B)"]
        BD1[Required Documents]
        BD2[OEM Authorization]
        BD3[Turnover / Experience]
        BD4[Local Content]
        BD5[Technical Requirements]
    end

    subgraph DOC_INTEL["🧠 Document Intelligence Layer"]
        DI1[OCR / Text Extraction]
        DI2[Classification]
        DI3[Field Extraction / Chunking]
    end

    subgraph ADAPTERS["🔌 Verification Adapter Layer"]
        AD1[Mock Adapters]
        AD2["Real Adapters<br/>(future, authorized)"]
    end

    subgraph COMPLIANCE["⚖️ Compliance Engine<br/>(deterministic Rule Evaluation)"]
        CE1[Combine Branch A + B + RAG JSON]
        CE2[Per-Requirement Outcome]
    end

    subgraph RISK["📊 Risk & Scoring Layer"]
        R1[Compliance Score]
        R2[Risk Level]
    end

    subgraph AIREC["🤖 AI Recommendation Layer"]
        AI1[Evidence Summary via RAG]
        AI2[Suggested Next Step]
    end

    subgraph HUMAN["👤 Human Decision Layer"]
        H1[Officer Dashboard]
        H2[Final Decision]
    end

    subgraph AUDIT["📜 Audit Layer"]
        AU1[Audit Log]
    end

    T1 --> T2
    DOC_INTEL --> RAG
    T2 --> RAG1
    RAG1 --> RAG2 --> RAG3
    RAG3 --> AP1
    AP1 --> AP2
    AP2 --> BV1 & BV2 & BV3 & BV4 & BV5 & BV6
    AP2 --> BD1 & BD2 & BD3 & BD4 & BD5
    DOC_INTEL --> BIDDER_LAYER
    DOC_INTEL --> BID_LAYER
    BIDDER_LAYER --> ADAPTERS
    ADAPTERS --> CE1
    BID_LAYER --> CE1
    RAG3 -.-> CE1
    CE1 --> CE2 --> R1 & R2
    R1 & R2 --> AI1
    RAG --> AI1
    AI1 --> AI2
    AI2 --> H1 --> H2
    T2 -.-> AU1
    CE2 -.-> AU1
    H2 -.-> AU1

    style BIDDER_LAYER fill:#e8f0fe,stroke:#2e74b5
    style BID_LAYER fill:#fff4e5,stroke:#e69500
    style COMPLIANCE fill:#fce8e6,stroke:#d93025
    style HUMAN fill:#e6f4ea,stroke:#1e8e3e
    style ADAPTERS fill:#f3e8fd,stroke:#8430ce
    style RAG fill:#f3e8fd,stroke:#8430ce
```

<br>

---

## 17. Technology Stack

| Layer | Suggested Technology | Why |
|:---|:---|:---|
| 🖥️ Frontend (Officer Dashboard) | React + Tailwind CSS | Fast to build a clean dashboard within a hackathon timeline |
| ⚙️ Backend / API | Python + FastAPI *(or Node.js + Express)* | Well suited to AI/ML-heavy backends |
| 📄 Document Text Extraction | PyMuPDF / pdfplumber | Reliable for native-text PDFs |
| 🔠 OCR | Tesseract OCR | Free, mature, offline-capable |
| 🧬 NLP / Extraction | spaCy or HuggingFace Transformers | Established structured-field extraction |
| 🔍 RAG — Embeddings | Sentence-Transformers (e.g., a HuggingFace embedding model) | Turns tender/rule text chunks into vectors for retrieval |
| 🔍 RAG — Vector Store | FAISS or ChromaDB | Lightweight, local, no external service dependency for the MVP |
| 🤖 RAG — LLM Interpreter | An instruction-tuned LLM (via API or self-hosted), prompted to answer **only from retrieved context** | Grounded interpretation instead of unaided model memory |
| ⚖️ Rule Evaluation | Custom Python rule engine (JSON-based rules per tender) | Transparent, testable, deterministic — deliberately kept separate from the LLM/RAG layer |
| 🔗 Cross-Document Matching | RapidFuzz | Lightweight fuzzy-matching for name/identifier mismatches |
| 🗄️ Database | PostgreSQL | Fits the relational, multi-entity data model (see `database.md`) |
| 📁 Document Storage | Local file storage (prototype) | Simple for a hackathon; production could use secure object storage |
| 🔌 Adapter Layer | Python abstract classes/interfaces + factory pattern | Enables clean mock ↔ real provider swapping |
| 🔐 Authentication | JWT-based officer login | Standard, simple for a prototype |
| 🐳 Deployment (demo) | Docker Compose | Consistent, easy live-demo setup |

<br>

---

## 18. MOCK ↔ PRODUCTION Switching

The architecture uses **configuration-based provider selection**, not scattered hardcoded logic.

```mermaid
flowchart TD
    CFG["VERIFICATION_MODE config<br/>(MOCK or PRODUCTION)"] --> FACTORY[Provider Factory]
    FACTORY -->|MOCK| MOCKS[MockVerificationProviders]
    FACTORY -->|PRODUCTION| REAL[AuthorizedRealProviders]
    MOCKS --> CE[Compliance Engine]
    REAL --> CE

    style MOCKS fill:#fff4e5,stroke:#e69500
    style REAL fill:#e8eaed,stroke:#5f6368,stroke-dasharray: 5 5
```

A single configuration value (conceptually `VERIFICATION_MODE = MOCK` or `VERIFICATION_MODE = PRODUCTION`) determines, through a **Provider Factory** (dependency-injection style), which set of adapters gets wired in. **The Compliance Engine, Risk Engine, Scoring Logic, AI Recommendation Engine, RAG Layer, and Dashboard never change** between the two modes — only the data source underneath the adapter interface changes. This is the architectural guarantee that makes the "dummy datasets now, real integration later" model actually work without a redesign. The RAG Layer's vector index is populated identically in both modes, since it indexes documents already inside the system rather than an external government source.

<br>

<div align="center">

---

**Next:** Continue to [`database.md`](./database.md) to see the data model that supports this two-branch design 🗄️

</div>
