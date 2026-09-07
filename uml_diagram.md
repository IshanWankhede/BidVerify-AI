# uml_diagram.md — UML Diagrams
## BidVerify AI

## 1. Use Case Diagram

```mermaid
flowchart LR
    PO((Procurement Officer))
    SA((System Administrator))
    BD[/Bidder / Bid Data/]
    VP[/Verification Providers/]
    AI[/AI-RAG System/]

    PO --> UC1[Upload Tender]
    PO --> UC2[Review Bid Verification]
    PO --> UC3[View Evidence]
    PO --> UC4[Approve / Reject / Seek Clarification]
    PO --> UC5[View Audit Trail]
    SA --> UC6[Manage Users & Roles]
    SA --> UC7[Configure Verification Mode]
    BD --> UC8[Provide Bid Documents]
    VP --> UC9[Return Verification Result]
    AI --> UC10[Extract Requirements]
    AI --> UC11[Generate Recommendation]
```

## 2. Class Diagram

```mermaid
classDiagram
    class Tender {
        +uuid id
        +string title
        +date submissionDeadline
        +getRequirements() TenderRequirement[]
    }
    class TenderRequirement {
        +uuid id
        +string category
        +string ruleType
        +string ruleValue
        +boolean isMandatory
    }
    class Bidder {
        +uuid id
        +string companyName
        +getIdentifiers() BidderIdentifier[]
    }
    class Bid {
        +uuid id
        +Tender tender
        +Bidder bidder
        +getDocuments() Document[]
    }
    class VerificationProvider {
        <<interface>>
        +verify(identifier, context) VerificationResult
    }
    class RuleEngine {
        +evaluate(requirement, facts) ComplianceResult
    }
    class Evidence {
        +uuid id
        +string documentRef
        +int pageNumber
        +string extractedText
    }
    class ComplianceResult {
        +string outcome
        +string explanation
    }
    class RiskAssessment {
        +float score
        +string riskLevel
    }
    class AIRecommendation {
        +string summaryText
        +Evidence[] citations
    }
    class AuditLog {
        +uuid id
        +string action
        +datetime timestamp
    }

    Tender "1" --> "many" TenderRequirement
    Bid --> Tender
    Bid --> Bidder
    Bidder --> VerificationProvider : verified via
    RuleEngine --> ComplianceResult : produces
    ComplianceResult --> Evidence
    Bid --> RiskAssessment
    Bid --> AIRecommendation
    AIRecommendation --> Evidence : cites
    Bid --> AuditLog
```

## 3. Component Diagram

```mermaid
flowchart TD
    subgraph Frontend
        UI[React UI]
    end
    subgraph API_Layer["API Gateway (FastAPI)"]
        AUTH[Auth Module]
        TEND[Tenders Module]
        BIDM[Bids Module]
    end
    subgraph Intelligence
        DI[Document Intelligence]
        REQ[Requirement Extraction]
        APP[Applicability Engine]
        RAGC[RAG + Vector Store]
    end
    subgraph Verification
        VE[Verification Engine]
        RE[Rule Engine]
        MP[Mock Providers]
    end
    subgraph Storage
        PG[(PostgreSQL)]
        ES[(Evidence Store)]
        AS[Audit Service]
    end

    UI --> AUTH
    UI --> TEND
    UI --> BIDM
    TEND --> DI --> REQ --> APP
    REQ --> RAGC
    BIDM --> VE
    VE --> RE
    VE --> MP
    RE --> ES
    RE --> PG
    VE --> AS
```

## 4. Sequence Diagram — Bid Verification End-to-End

```mermaid
sequenceDiagram
    participant Off as Procurement Officer
    participant UI as Frontend
    participant API as FastAPI
    participant APPE as ApplicabilityEngine
    participant VE as VerificationEngine (Branch A)
    participant BC as BidComplianceService (Branch B)
    participant RE as RuleEngine
    participant EV as EvidenceEngine
    participant AI as AIRecommendation

    Off->>UI: Open Bid
    UI->>API: GET /bids/{id}
    API->>APPE: getApplicabilityMatrix(tender)
    APPE-->>API: checklist
    API->>VE: runBidderVerification(bidder, checklist)
    VE-->>API: VerificationResults
    API->>BC: runBidCompliance(bid, checklist)
    BC-->>API: ComplianceResults
    API->>RE: evaluate(all results)
    RE-->>API: Final outcomes + score + risk
    API->>EV: attachEvidence(outcomes)
    EV-->>API: Evidence-linked results
    API->>AI: generateRecommendation(outcomes)
    AI-->>API: Recommendation + citations
    API-->>UI: Full bid review payload
    UI-->>Off: Display results
    Off->>UI: Approve / Reject / Seek Clarification
    UI->>API: POST /bids/{id}/decision
    API->>API: Write AuditLog
```

## 5. Activity Diagram — Applicability-First Verification

```mermaid
flowchart TD
    Start([Start]) --> A[Upload Tender]
    A --> B[Extract Requirements via RAG]
    B --> C{Requirement Applicable?}
    C -->|Yes| D[Add to Applicability Matrix]
    C -->|No| E[Skip]
    D --> F[Run Relevant Check]
    F --> G[Rule Engine Evaluates]
    G --> H[Attach Evidence]
    H --> I[Update Score & Risk]
    E --> I
    I --> J{More Requirements?}
    J -->|Yes| C
    J -->|No| K[Generate AI Recommendation]
    K --> L[Officer Review]
    L --> End([End])
```
