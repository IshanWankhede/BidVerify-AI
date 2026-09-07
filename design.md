# design.md — UI/UX Design Specification
## BidVerify AI

## 1. Design Philosophy

**"Modern Government Enterprise Dashboard + Evidence-First AI UX."**

The interface must feel like a serious tool a government officer would trust with a real audit — not a startup landing page and not a flashy AI demo. Every screen answers one question first: *"where's the evidence for this?"*

## 2. Design Principles

- **Professional & Trustworthy** — muted, confident color use; no gimmicks.
- **Evidence-Oriented** — every claim is one click from its source.
- **Information-Dense but Organized** — officers review many bids; density is fine if structured well.
- **Desktop-First, Responsive** — primary use is a desk workstation; must still degrade gracefully on tablets.
- **Accessible** — sufficient contrast, keyboard navigation, screen-reader labels.

**Avoid:** glassmorphism, neon colors, gaming-style UI, excessive animation, unnecessary 3D, marketing-style landing-page patterns inside the app.

## 3. Color System

| Token | Hex | Usage |
|:---|:---|:---|
| `--color-primary` | #1F3864 (navy) | Headers, primary buttons, sidebar active state |
| `--color-accent` | #2E74B5 (blue) | Links, secondary actions, info states |
| `--color-success` | #1E8E3E (green) | Compliant, Approved |
| `--color-warning` | #E69500 (amber) | Needs Review, Medium Risk |
| `--color-danger` | #D93025 (red) | Non-Compliant, High Risk, Rejected |
| `--color-neutral-bg` | #F7F9FC | Page background |
| `--color-neutral-border` | #D3D1C7 | Card/table borders |
| `--color-text-primary` | #1C1C1C | Body text |
| `--color-text-secondary` | #5F6368 | Captions, metadata |

## 4. Typography

| Style | Font | Size | Weight |
|:---|:---|:---|:---|
| Page Title | Inter / system sans | 24px | 700 |
| Section Header | Inter | 18px | 700 |
| Body | Inter | 14px | 400 |
| Caption / Metadata | Inter | 12px | 400 |
| Data Table Cell | Inter | 13px | 400–600 |

## 5. Spacing

Base unit: **4px**. Standard spacing scale: 4, 8, 12, 16, 24, 32, 48px. Cards use 16–24px internal padding; sections separated by 32px.

## 6. Borders & Shadows

- Border radius: 8px (cards, inputs), 6px (buttons), 999px (pills/badges).
- Border: 1px solid `--color-neutral-border`.
- Shadow: subtle only — `0 1px 3px rgba(0,0,0,0.08)` on cards; no heavy drop shadows.

## 7. Component System

### Buttons
| Variant | Use |
|:---|:---|
| Primary (navy fill) | Main action (Approve, Submit, Run Verification) |
| Secondary (outline) | Secondary action (Seek Clarification, Cancel) |
| Destructive (red outline/fill) | Reject |
| Ghost/Text | Low-emphasis actions (view details) |

### Cards
White background, 1px border, 8px radius, used for tender/bid summary blocks and dashboard KPIs.

### Tables
Zebra-striped rows optional; sticky header; sortable columns for Tenders/Bids lists (via TanStack Table). Status shown as a colored badge, not plain text.

### Forms
Label above input, inline validation messages (red text, small), required-field asterisk. Built with React Hook Form + Zod (optional supporting libs).

### Badges
Pill-shaped, color-coded by status: `COMPLIANT` (green), `NON_COMPLIANT` (red), `NEEDS_REVIEW` (amber), `NOT_APPLICABLE` (grey), `PENDING` (blue).

### Alerts
Banner-style, left-accent-bar colored by severity (info/warning/danger), used for system messages (e.g., "This verification source is a Mock Provider — demo data only").

### Modals
Centered, max-width 600px, used for confirmations (e.g., "Confirm Reject Decision?") — never used for primary data review (that belongs in full pages/panels).

## 8. Navigation

### Sidebar
- Dashboard
- Tenders
- Bids
- Verification
- Evidence
- Reports
- Audit Logs
- Settings

### Top Bar
- Global search
- Notifications
- User/Role indicator
- System status (shows current `VERIFICATION_MODE`: MOCK or PRODUCTION — always visible, never hidden)

## 9. Screen Specifications

### Dashboard
KPI cards: Total Tenders, Pending Bids, Verified Bids, High-Risk Bids, Average Compliance Score. Below: Recent Activity feed (recent officer actions + system events).

### Tender Detail Screen
Tender metadata → Requirements list → Applicability Matrix (which checks apply, with reason) → Uploaded documents.

### Bid Verification Screen — ⭐ Most Important Screen
Split-panel layout:
- **Left:** Branch A results (Bidder Verification) and Branch B results (Bid Compliance), each requirement shown with its status badge.
- **Right:** Selected requirement's full detail — Compliance Score contribution, Risk flag, AI recommendation snippet, and a button to open the Evidence Viewer.
- **Bottom bar:** Officer decision controls (Approve / Reject / Seek Clarification) — always visible, never requires scrolling to find.

### Evidence Viewer
Document preview (left) with the relevant page shown and evidence text highlighted; extracted text + source metadata (document name, page number, extraction confidence) on the right.

### Risk Visualization
Simple gauge or colored badge (Low/Medium/High/Critical) — not a complex chart. Officers need a glance-read, not analysis.

### Compliance Score Display
Large numeral (0–100) with a thin progress bar colored by band (see `phases.md` § scoring), plus a one-line breakdown ("18/20 applicable checks passed").

### AI Recommendation UI
Distinctly styled panel (light purple/lavender accent, matching the RAG layer's color elsewhere in project docs) labeled **"AI Recommendation — Advisory Only"**, always showing citation links back to source evidence, never presented as a decision.

### Audit Timeline
Vertical timeline, most recent action at top, each entry showing actor, action, timestamp, and a link to the relevant evidence/result.

## 10. Loading / Empty / Error States

- **Loading:** skeleton placeholders matching the shape of the content being loaded (not a generic spinner for full-page loads).
- **Empty:** short message + primary action (e.g., "No tenders yet — Upload your first tender").
- **Error:** inline, specific error message + retry action; never a raw stack trace shown to the officer.

## 11. Responsive Behavior

Desktop-first (primary target ≥1280px). At narrower widths (tablet), the Bid Verification split-panel stacks vertically; sidebar collapses to icons-only.

## 12. Accessibility

- Minimum contrast ratio 4.5:1 for body text.
- All interactive elements keyboard-reachable and focus-visible.
- Status conveyed by color **and** text/icon (never color alone) — important since Compliant/Non-Compliant/Review states must be distinguishable for colorblind users.
- Form inputs have associated `<label>` elements.

## 13. UX Rules

1. Never show an AI-generated statement without a visible citation link.
2. Never let a screen imply a decision has been made until the officer has explicitly clicked Approve/Reject.
3. Always show whether a verification result came from a Mock or Authorized provider.
4. Every numeric score must be accompanied by a plain-language explanation, not just the number.
