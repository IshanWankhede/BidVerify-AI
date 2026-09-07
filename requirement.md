# requirement.md — Technical Requirements
## BidVerify AI

**Priority key:** P0 = Must have · P1 = Important · P2 = Future

---

## 1. Functional Requirements

| ID | Priority | Description | Acceptance Criteria | Dependencies |
|:---|:---:|:---|:---|:---|
| FR-01 | P0 | Upload tender document | PDF accepted, stored, metadata row created | Phase 5 |
| FR-02 | P0 | Extract structured requirements from tender | Requirements categorized (financial/statutory/technical) and stored | Phase 7 |
| FR-03 | P0 | Generate Applicability Matrix per tender | Only relevant checks marked applicable | Phase 8 |
| FR-04 | P0 | Run Branch A bidder verification via mock providers | Result stored with `is_mock=true` | Phase 10 |
| FR-05 | P0 | Run Branch B bid compliance checks | Result stored, linked to requirement | Phase 11 |
| FR-06 | P0 | Evaluate compliance deterministically | Same input always produces same output | Phase 12 |
| FR-07 | P1 | Detect cross-document name/identifier mismatches | Mismatch flagged as NEEDS_REVIEW, not auto-rejected | Phase 13 |
| FR-08 | P0 | Attach evidence to every result | 100% of results have ≥1 linked evidence row | Phase 14 |
| FR-09 | P1 | Generate RAG-grounded AI recommendation | Every recommendation includes ≥1 citation | Phase 16 |
| FR-10 | P0 | Compute Compliance Score (0–100) | Score reflects weighted mandatory/optional results | Phase 17 |
| FR-11 | P0 | Compute Risk Level | Maps to configurable score bands | Phase 17 |
| FR-12 | P0 | Officer records final decision | One of Approve/Reject/Seek Clarification | Phase 18 |
| FR-13 | P0 | Maintain audit trail | Every state change logged | Phase 19 |
| FR-14 | P1 | Dashboard KPIs | Reflects live counts | Phase 20 |
| FR-15 | P2 | Multi-officer committee review | Not in MVP scope | Future |

---

## 2. Non-Functional Requirements

| ID | Priority | Description | Acceptance Criteria |
|:---|:---:|:---|:---|
| NFR-01 | P0 | AI must never output a final compliance verdict | Code review confirms LLM Interpreter has no verdict-writing method |
| NFR-02 | P0 | Mock data always clearly labeled | `is_mock`/`is_synthetic` flags never null; UI always shows a "MOCK/DEMO" badge |
| NFR-03 | P1 | Response time for bid review load | < 3s for a bid with ≤50 requirements (target, not load-tested guarantee) |
| NFR-04 | P0 | Sensitive identifiers maskable | PAN/GSTIN displayed masked by default in UI |
| NFR-05 | P1 | System availability during demo | No single point of failure in Docker Compose setup for local demo |

---

## 3. Frontend Requirements

| ID | Priority | Description |
|:---|:---:|:---|
| FE-01 | P0 | React + Redux + Tailwind CSS per `design.md` |
| FE-02 | P0 | Bid Verification screen with evidence panel always accessible |
| FE-03 | P1 | Dashboard with 5 KPI cards |
| FE-04 | P1 | Audit timeline view |
| FE-05 | P2 | Responsive tablet layout |

## 4. Backend Requirements

| ID | Priority | Description |
|:---|:---:|:---|
| BE-01 | P0 | FastAPI with modular structure per `Architecture.md` § 5 |
| BE-02 | P0 | Pydantic schemas for all request/response models |
| BE-03 | P0 | SQLAlchemy ORM, no raw SQL string concatenation |
| BE-04 | P1 | Service/repository pattern in every module |

## 5. API Requirements

| ID | Priority | Description |
|:---|:---:|:---|
| API-01 | P0 | All endpoints require JWT except `/auth/login` |
| API-02 | P0 | RBAC enforced at router level |
| API-03 | P1 | Consistent error response format (`{ "error": "...", "code": "..." }`) |
| API-04 | P2 | Rate limiting on auth endpoints |

## 6. Database Requirements

| ID | Priority | Description |
|:---|:---:|:---|
| DB-01 | P0 | Schema matches `database.md` ER diagram |
| DB-02 | P0 | `verification_results` and `compliance_results` remain structurally separate |
| DB-03 | P1 | Indexes on all foreign keys and frequently filtered columns |
| DB-04 | P0 | UUID primary keys throughout |

## 7. AI/ML Requirements

| ID | Priority | Description |
|:---|:---:|:---|
| AI-01 | P0 | LLM Interpreter must only answer from retrieved context (RAG-grounded) |
| AI-02 | P0 | No method in AI layer returns a compliance verdict enum |
| AI-03 | P1 | Confidence score attached to every extraction |

## 8. Document Processing Requirements

| ID | Priority | Description |
|:---|:---:|:---|
| DOC-01 | P0 | Native-text PDFs processed via PyMuPDF/pdfplumber |
| DOC-02 | P0 | Scanned PDFs processed via Tesseract OCR |
| DOC-03 | P1 | Low-confidence extractions flagged, not silently accepted |

## 9. RAG Requirements

| ID | Priority | Description |
|:---|:---:|:---|
| RAG-01 | P0 | Chunking + embedding via Sentence-Transformers |
| RAG-02 | P0 | Vector store: FAISS or ChromaDB |
| RAG-03 | P1 | Every retrieval logged (query, top-k passages, scores) for auditability |

## 10. Compliance Engine Requirements

| ID | Priority | Description |
|:---|:---:|:---|
| CE-01 | P0 | Rule Engine is the sole writer of `compliance_results.outcome` |
| CE-02 | P0 | Supports 5 outcome states (not binary) |
| CE-03 | P1 | Rules configurable per tender (JSON-based) |

## 11. Verification Provider Requirements

| ID | Priority | Description |
|:---|:---:|:---|
| VP-01 | P0 | All providers implement common `VerificationProvider` interface |
| VP-02 | P0 | Provider selection via Factory + config, never hardcoded |
| VP-03 | P0 | Mock providers cover success/not-found/mismatch/invalid-input/unavailable cases |

## 12. Security Requirements

| ID | Priority | Description |
|:---|:---:|:---|
| SEC-01 | P0 | Passwords hashed (bcrypt or equivalent) |
| SEC-02 | P0 | JWT with reasonable expiry |
| SEC-03 | P0 | File upload type/size validation |
| SEC-04 | P1 | CORS restricted to known origins |
| SEC-05 | P2 | Rate limiting |

## 13. Authentication Requirements

| ID | Priority | Description |
|:---|:---:|:---|
| AUTH-01 | P0 | Login issues JWT |
| AUTH-02 | P0 | Token required on all protected endpoints |

## 14. Authorization Requirements

| ID | Priority | Description |
|:---|:---:|:---|
| AUTHZ-01 | P0 | Roles: Procurement Officer, System Administrator (minimum) |
| AUTHZ-02 | P0 | Endpoint-level permission checks |

## 15. File Storage Requirements

| ID | Priority | Description |
|:---|:---:|:---|
| FS-01 | P0 | Local file storage for MVP |
| FS-02 | P2 | Cloud object storage migration path documented |

## 16. Vector Database Requirements

| ID | Priority | Description |
|:---|:---:|:---|
| VDB-01 | P0 | FAISS or ChromaDB, local, no external dependency for MVP |
| VDB-02 | P1 | Index rebuildable independently of relational DB |

## 17. UI/UX Requirements

See `design.md` in full. Summary: evidence-first, desktop-first, no dark patterns implying automated decisions.

## 18. Accessibility Requirements

| ID | Priority | Description |
|:---|:---:|:---|
| ACC-01 | P1 | 4.5:1 minimum contrast |
| ACC-02 | P1 | Status never conveyed by color alone |
| ACC-03 | P2 | Full keyboard navigation audit |

## 19. Testing Requirements

| ID | Priority | Description |
|:---|:---:|:---|
| TEST-01 | P0 | Unit tests for Rule Engine (all outcome states) |
| TEST-02 | P0 | Unit tests for each mock provider's 5 response cases |
| TEST-03 | P1 | One full end-to-end scenario test |

## 20. Deployment Requirements

| ID | Priority | Description |
|:---|:---:|:---|
| DEP-01 | P0 | Docker Compose brings up full stack |
| DEP-02 | P1 | Environment-based config (no hardcoded values) |

## 21. Monitoring / Logging Requirements

| ID | Priority | Description |
|:---|:---:|:---|
| MON-01 | P1 | Application logs for errors and key events |
| MON-02 | P2 | Structured logging (JSON) for future log aggregation |
