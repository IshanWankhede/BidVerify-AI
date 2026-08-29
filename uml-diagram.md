<div align="center">

# 📐 UML Diagrams — BidVerify AI
### Class & Sequence Diagrams for the Adapter Pattern and Compliance Flow

[![SIH](https://img.shields.io/badge/SIH-2026-orange?style=for-the-badge)]()
[![Problem Statement](https://img.shields.io/badge/PS%20ID-SIH26100-blue?style=for-the-badge)]()
[![Doc Type](https://img.shields.io/badge/Doc-UML-purple?style=for-the-badge)]()

</div>

<br>

> 💡 These diagrams show the **software structure** implied by [`architecture.md`](./architecture.md) and [`database.md`](./database.md) — useful when the team actually starts writing code. Class/method names here are illustrative starting points, not a fixed contract; adjust to your chosen language/framework.

<br>

## 📑 Contents

1. [Verification Adapter — Class Diagram](#1-verification-adapter--class-diagram)
2. [Bidder vs. Bid Verification — Class Diagram](#2-bidder-vs-bid-verification--class-diagram)
3. [🆕 RAG Layer — Class Diagram](#3-rag-layer--class-diagram)
4. [Sequence: Running a Bidder-Level Check (Branch A)](#4-sequence-running-a-bidder-level-check-branch-a)
5. [Sequence: Evaluating Tender-Specific Compliance (Branch B)](#5-sequence-evaluating-tender-specific-compliance-branch-b)
6. [🆕 Sequence: RAG-Grounded Tender Interpretation](#6-sequence-rag-grounded-tender-interpretation)
7. [Sequence: End-to-End Bid Review](#7-sequence-end-to-end-bid-review)
8. [State Diagram: Compliance Result Lifecycle](#8-state-diagram-compliance-result-lifecycle)

<br>

---

## 1. Verification Adapter — Class Diagram

Shows the **Adapter Pattern** at the core of the Verification Adapter Layer ([`architecture.md` § 8](./architecture.md#8-verification-adapter-layer)) — how mock and future-real providers implement one shared interface.

```mermaid
classDiagram
    class VerificationProvider {
        <<interface>>
        +verify(identifier, context) StandardizedVerificationResult
    }

    class StandardizedVerificationResult {
        +string verification_id
        +string source
        +string check_type
        +string identifier
        +string status
        +float confidence
        +string evidence
        +datetime checked_at
        +string remarks
    }

    class MockGSTProvider {
        +verify(identifier, context) StandardizedVerificationResult
    }
    class RealGSTProvider {
        +verify(identifier, context) StandardizedVerificationResult
    }
    class MockUdyamProvider {
        +verify(identifier, context) StandardizedVerificationResult
    }
    class RealUdyamProvider {
        +verify(identifier, context) StandardizedVerificationResult
    }
    class MockDigiLockerProvider {
        +verify(identifier, context) StandardizedVerificationResult
    }
    class RealDigiLockerProvider {
        +verify(identifier, context) StandardizedVerificationResult
    }
    class MockBlacklistProvider {
        +verify(identifier, context) StandardizedVerificationResult
    }

    class VerificationProviderFactory {
        -string verification_mode
        +getProvider(check_type) VerificationProvider
    }

    VerificationProvider <|.. MockGSTProvider
    VerificationProvider <|.. RealGSTProvider
    VerificationProvider <|.. MockUdyamProvider
    VerificationProvider <|.. RealUdyamProvider
    VerificationProvider <|.. MockDigiLockerProvider
    VerificationProvider <|.. RealDigiLockerProvider
    VerificationProvider <|.. MockBlacklistProvider
    VerificationProvider ..> StandardizedVerificationResult : returns
    VerificationProviderFactory ..> VerificationProvider : creates
```

**Key idea:** `VerificationProviderFactory` is the *only* place in the codebase that decides mock vs. real, based on the `VERIFICATION_MODE` configuration — every caller elsewhere just holds a `VerificationProvider` reference and never knows or cares which concrete class it got.

<br>

---

## 2. Bidder vs. Bid Verification — Class Diagram

Shows the structural separation between **Branch A** and **Branch B**, matching the `VerificationResult` / `ComplianceResult` split in [`database.md`](./database.md#5-the-most-important-distinction-bidder-verification-vs-bid-compliance).

```mermaid
classDiagram
    class Bidder {
        +uuid bidder_id
        +string company_name
        +string registration_number
        +getIdentifiers() BidderIdentifier[]
    }

    class BidderIdentifier {
        +uuid identifier_id
        +string identifier_type
        +string identifier_value
    }

    class BidderVerificationService {
        +runApplicableChecks(bidder, applicability_matrix) VerificationResult[]
    }

    class VerificationResult {
        +uuid result_id
        +string check_type
        +string status
        +float confidence
        +getEvidence() Evidence
    }

    class Tender {
        +uuid tender_id
        +getRequirements() TenderRequirement[]
    }

    class TenderRequirement {
        +uuid requirement_id
        +string rule_type
        +string rule_value
        +boolean is_mandatory
    }

    class Bid {
        +uuid bid_id
        +Bidder bidder
        +Tender tender
        +getDocuments() Document[]
    }

    class BidComplianceService {
        +evaluateRequirements(bid, checklist) ComplianceResult[]
    }

    class ComplianceResult {
        +uuid result_id
        +string outcome
        +string explanation
        +getEvidence() Evidence
    }

    class ComplianceEngine {
        +combine(VerificationResult[], ComplianceResult[]) CompliancePackage
    }

    class Evidence {
        +uuid evidence_id
        +string result_type
        +Document source_document
        +ExtractedField source_field
    }

    Bidder "1" --> "many" BidderIdentifier
    Bidder --> BidderVerificationService : verified by
    BidderVerificationService --> VerificationResult : produces
    Tender "1" --> "many" TenderRequirement
    Bid --> Bidder
    Bid --> Tender
    Bid --> BidComplianceService : evaluated by
    BidComplianceService --> ComplianceResult : produces
    VerificationResult --> Evidence
    ComplianceResult --> Evidence
    ComplianceEngine --> VerificationResult : reads
    ComplianceEngine --> ComplianceResult : reads
```

<br>

---

## 3. RAG Layer — Class Diagram

Shows the retrieval-augmented generation components from [`architecture.md` § 7](./architecture.md#7-rag-retrieval-augmented-generation-layer). Notice `RAGRetriever` and `LLMInterpreter` only ever produce a `RetrievedPassage[]` or a `StructuredRequirementJSON` — neither class has a method that outputs a compliance verdict. That output only ever reaches `RuleEvaluationModule`, which is a completely separate class with no dependency on the LLM.

```mermaid
classDiagram
    class DocumentChunker {
        +chunk(document_text) TextChunk[]
    }

    class VectorStore {
        +index(chunks: TextChunk[]) void
        +similaritySearch(query, top_k) RetrievedPassage[]
    }

    class RAGRetriever {
        +retrieve(query, top_k) RetrievedPassage[]
    }

    class RetrievedPassage {
        +string passage_text
        +string source_document
        +string source_location
        +float relevance_score
    }

    class LLMInterpreter {
        +interpretRequirement(clause_text, context: RetrievedPassage[]) StructuredRequirementJSON
        +explainFinding(finding, context: RetrievedPassage[]) CitedExplanation
    }

    class StructuredRequirementJSON {
        +string rule_type
        +string rule_value
        +boolean is_mandatory
        +RetrievedPassage[] grounding_citations
    }

    class CitedExplanation {
        +string explanation_text
        +RetrievedPassage[] citations
    }

    class RuleEvaluationModule {
        +evaluate(requirement: StructuredRequirementJSON, bidder_facts) ComplianceOutcome
    }

    class ComplianceOutcome {
        <<enumeration>>
        COMPLIANT
        NON_COMPLIANT
        NEEDS_REVIEW
        NOT_APPLICABLE
        PENDING_VERIFICATION
    }

    DocumentChunker --> VectorStore : populates
    RAGRetriever --> VectorStore : queries
    RAGRetriever --> RetrievedPassage : returns
    LLMInterpreter --> RAGRetriever : uses
    LLMInterpreter --> StructuredRequirementJSON : produces
    LLMInterpreter --> CitedExplanation : produces
    RuleEvaluationModule ..> StructuredRequirementJSON : consumes as input
    RuleEvaluationModule --> ComplianceOutcome : produces
    LLMInterpreter ..> ComplianceOutcome : never produces
```

**Key idea — the boundary that matters:** `LLMInterpreter` has no method returning `ComplianceOutcome`, and `RuleEvaluationModule` has no dependency on `LLMInterpreter` at runtime — it only consumes the *data* (`StructuredRequirementJSON`) the RAG layer already produced. This is not a naming convention; it's a hard class-level separation that makes it structurally impossible for a hallucinated LLM response to become a stored compliance verdict.

<br>

---

## 4. Sequence: Running a Bidder-Level Check (Branch A)

```mermaid
sequenceDiagram
    participant O as Officer Dashboard
    participant BVS as BidderVerificationService
    participant AE as ApplicabilityEngine
    participant F as VerificationProviderFactory
    participant P as VerificationProvider (Mock/Real)
    participant DB as Database

    O->>BVS: request verification for Bidder
    BVS->>AE: getApplicableChecks(bidder, tender)
    AE-->>BVS: [GST, UDYAM, PAN, ...]
    loop for each applicable check
        BVS->>F: getProvider(check_type)
        F-->>BVS: VerificationProvider instance
        BVS->>P: verify(identifier, context)
        P-->>BVS: StandardizedVerificationResult
        BVS->>DB: save VerificationResult + Evidence
    end
    BVS-->>O: Branch A results ready
```

<br>

---

## 5. Sequence: Evaluating Tender-Specific Compliance (Branch B)

```mermaid
sequenceDiagram
    participant O as Officer Dashboard
    participant BCS as BidComplianceService
    participant DI as DocumentIntelligenceLayer
    participant RE as RuleEvaluationModule
    participant DB as Database

    O->>BCS: evaluate compliance for Bid
    BCS->>DI: extractFields(bid.documents)
    DI-->>BCS: ExtractedField[]
    loop for each applicable TenderRequirement
        BCS->>RE: evaluate(requirement, extracted_fields)
        RE-->>BCS: outcome (COMPLIANT / NON_COMPLIANT / NEEDS_REVIEW / NOT_APPLICABLE)
        BCS->>DB: save ComplianceResult + Evidence
    end
    BCS-->>O: Branch B results ready
```

<br>

---

## 6. Sequence: RAG-Grounded Tender Interpretation

Shows how a tender clause becomes a `StructuredRequirementJSON` **grounded in retrieved text**, and separately, how an officer's "why was this flagged?" question gets a cited answer — both without ever touching the compliance-decision path.

```mermaid
sequenceDiagram
    participant TU as TenderUnderstandingLayer
    participant DC as DocumentChunker
    participant VS as VectorStore
    participant RAG as RAGRetriever
    participant LLM as LLMInterpreter
    participant AE as ApplicabilityEngine
    participant Off as Procurement Officer
    participant EV as EvidenceLayer

    Note over TU,VS: Indexing (once per tender)
    TU->>DC: chunk(tender_text + rule_excerpts)
    DC->>VS: index(chunks)

    Note over TU,AE: Requirement extraction
    TU->>RAG: retrieve("eligibility clause", top_k=5)
    RAG->>VS: similaritySearch(query, top_k)
    VS-->>RAG: RetrievedPassage[]
    RAG-->>TU: RetrievedPassage[]
    TU->>LLM: interpretRequirement(clause_text, RetrievedPassage[])
    LLM-->>TU: StructuredRequirementJSON (with citations)
    TU->>AE: submit StructuredRequirementJSON

    Note over Off,EV: Later — officer asks "why flagged?"
    Off->>LLM: explainFinding(finding_id)
    LLM->>RAG: retrieve(finding context, top_k=3)
    RAG-->>LLM: RetrievedPassage[]
    LLM-->>Off: CitedExplanation (text + source passages)
    LLM->>EV: store CitedExplanation as Evidence
```

<br>

---

## 7. Sequence: End-to-End Bid Review

```mermaid
sequenceDiagram
    participant Off as Procurement Officer
    participant Dash as Officer Dashboard
    participant RAG as RAG Layer
    participant AE as ApplicabilityEngine
    participant BVS as BidderVerificationService
    participant BCS as BidComplianceService
    participant CE as ComplianceEngine
    participant Risk as RiskScoringLayer
    participant AI as AIRecommendationLayer
    participant DB as Database (incl. AuditLog)

    Off->>Dash: Open Bid for Review
    Dash->>RAG: interpret tender requirements (grounded)
    RAG-->>Dash: StructuredRequirementJSON[] + citations
    Dash->>AE: getApplicabilityMatrix(tender, StructuredRequirementJSON[])
    AE-->>Dash: checklist
    Dash->>BVS: run Branch A checks
    BVS-->>Dash: VerificationResult[]
    Dash->>BCS: run Branch B checks
    BCS-->>Dash: ComplianceResult[]
    Dash->>CE: combine(VerificationResult[], ComplianceResult[])
    CE-->>Dash: CompliancePackage
    Dash->>Risk: score(CompliancePackage)
    Risk-->>Dash: score + risk_level
    Dash->>AI: summarize(CompliancePackage, score, risk_level)
    AI->>RAG: retrieve supporting citations for summary
    RAG-->>AI: RetrievedPassage[]
    AI-->>Dash: recommendation text + citations
    Dash-->>Off: Show full findings + evidence + recommendation
    Off->>Dash: Record Final Decision
    Dash->>DB: save FinalDecision
    Dash->>DB: write AuditLog entries
```

<br>

---

## 8. State Diagram: Compliance Result Lifecycle

Shows the possible states of a single `ComplianceResult` (Branch B) or `VerificationResult` (Branch A) — reinforcing why the system uses more than a binary pass/fail (see [`architecture.md` § 9](./architecture.md#9-compliance-engine)). Note that `RAGRetriever`/`LLMInterpreter` play no role in this diagram at all — they finish their work (producing `StructuredRequirementJSON`) *before* this state machine even starts.

```mermaid
stateDiagram-v2
    [*] --> PENDING_VERIFICATION
    PENDING_VERIFICATION --> NOT_APPLICABLE : Applicability Engine excludes this check
    PENDING_VERIFICATION --> COMPLIANT : Rule/verification passes
    PENDING_VERIFICATION --> NON_COMPLIANT : Rule/verification fails
    PENDING_VERIFICATION --> NEEDS_REVIEW : Evidence unclear/incomplete
    NEEDS_REVIEW --> COMPLIANT : Officer/clarification resolves it
    NEEDS_REVIEW --> NON_COMPLIANT : Officer/clarification resolves it
    COMPLIANT --> [*]
    NON_COMPLIANT --> [*]
    NOT_APPLICABLE --> [*]
```

