# flowchart.md — Process Flowcharts
## BidVerify AI

## 1. Complete System Flow

```mermaid
flowchart TD
    A[Tender + Bid Documents] --> B[Document Intelligence]
    B --> C[Requirement Extraction]
    C --> D[Applicability Engine]
    D --> E["Branch A + Branch B (parallel)"]
    E --> F[Compliance Engine]
    F --> G[Score + Risk]
    G --> H[Evidence + AI Recommendation]
    H --> I[Officer Review]
    I --> J[Approve / Reject / Seek Clarification]
    J --> K[Audit Trail]
```

## 2. Tender Processing Flow

```mermaid
flowchart TD
    A[Upload Tender Document] --> B[Text Extraction / OCR]
    B --> C[Chunking + Embedding]
    C --> D[RAG Retrieval of Relevant Rules]
    D --> E[LLM Interprets Clauses]
    E --> F[Structured Tender Requirements]
    F --> G[Applicability Engine Builds Checklist]
```

## 3. Bid Processing Flow

```mermaid
flowchart TD
    A[Bidder Submits/Links Bid] --> B[Upload Bid Documents]
    B --> C[Document Intelligence]
    C --> D[Extract Bidder Facts]
    D --> E[Branch A: Bidder Verification]
    D --> F[Branch B: Bid Compliance]
    E --> G[Combine into Bid Record]
    F --> G
```

## 4. Document Intelligence Flow

```mermaid
flowchart TD
    A[Document Uploaded] --> B{Native Text or Scanned?}
    B -->|Native| C[PyMuPDF / pdfplumber]
    B -->|Scanned| D[Tesseract OCR]
    C --> E[Clean Text]
    D --> E
    E --> F[spaCy NLP Extraction]
    F --> G[Structured Fields + Chunks for RAG]
```

## 5. Applicability Flow

```mermaid
flowchart TD
    A[Structured Tender Requirements] --> B[Classify Each Requirement]
    B --> C{Applicable to this Tender?}
    C -->|Yes| D[Add to Checklist]
    C -->|No| E[Exclude — Not Applicable]
    D --> F[Applicability Matrix]
    E --> F
```

## 6. Branch A — Bidder Verification Flow

```mermaid
flowchart TD
    A[Bidder Identifiers: GST, PAN, Udyam, MCA, EPFO, ESIC] --> B[For Each Applicable Identifier]
    B --> C[Call VerificationProvider via Factory]
    C --> D{Mock or Authorized?}
    D -->|MVP| E[Mock Provider Response]
    D -->|Future| F[Authorized Provider Response]
    E --> G[Normalize Result]
    F --> G
    G --> H[Store VerificationResult + Evidence]
```

## 7. Branch B — Bid Compliance Flow

```mermaid
flowchart TD
    A[Tender-Specific Requirements] --> B[Match Against Bid Documents]
    B --> C{Requirement Type}
    C -->|Numeric — Turnover| D[Compare Value vs Threshold]
    C -->|Document — Certificate| E[Check Presence + Validity]
    C -->|OEM Authorization| F[Validate Letter Consistency]
    D --> G[Rule Engine Verdict]
    E --> G
    F --> G
    G --> H[Store ComplianceResult + Evidence]
```

## 8. Compliance Scoring Flow

```mermaid
flowchart TD
    A[All Applicable Requirement Results] --> B{Mandatory or Optional?}
    B -->|Mandatory| C[Higher Weight]
    B -->|Optional| D[Lower Weight]
    C --> E[Sum Weighted Pass/Fail]
    D --> E
    E --> F[Compliance Score 0-100]
    F --> G{Score Band}
    G -->|0-39| H[Critical Risk]
    G -->|40-59| I[High Risk]
    G -->|60-79| J[Medium Risk]
    G -->|80-100| K[Low Risk]
```

## 9. Evidence Generation Flow

```mermaid
flowchart TD
    A[Verification/Compliance Result] --> B[Locate Source Document]
    B --> C[Locate Page Number]
    C --> D[Extract Supporting Text]
    D --> E{Is this Mock/Synthetic Data?}
    E -->|Yes| F[Label as MOCK/SYNTHETIC]
    E -->|No| G[Label as Real Source]
    F --> H[Store Evidence Record]
    G --> H
```

## 10. RAG Recommendation Flow

```mermaid
flowchart TD
    A[Officer Opens Bid Review] --> B[Query: Summarize Findings]
    B --> C[RAG Retriever Fetches Relevant Passages]
    C --> D[LLM Drafts Recommendation]
    D --> E[Attach Citations to Each Point]
    E --> F["Display as 'AI Recommendation — Advisory Only'"]
```

## 11. Officer Decision Flow

```mermaid
flowchart TD
    A[Officer Reviews Score, Risk, Evidence, AI Recommendation] --> B{Officer Decision}
    B -->|Satisfied| C[Approve]
    B -->|Not Satisfied| D[Reject]
    B -->|Unclear| E[Seek Clarification]
    C --> F[Write FinalDecision]
    D --> F
    E --> F
    F --> G[Write AuditLog Entry]
```

## 12. Mock Provider Flow

```mermaid
flowchart TD
    A[Verification Request] --> B[ProviderFactory.getProvider]
    B --> C{VERIFICATION_MODE}
    C -->|MOCK| D[Return Synthetic Response]
    C -->|PRODUCTION| E[Call Authorized Provider — Future]
    D --> F[Clearly Tag Response as MOCK/SYNTHETIC]
    E --> G[Tag Response as Authorized Source]
    F --> H[Normalize to StandardVerificationResult]
    G --> H
```
