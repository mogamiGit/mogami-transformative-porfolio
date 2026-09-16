# Feature Specification: Highlight Points Section Design

**Feature Branch**: `001-highlight-points-design`

**Created**: 2026-09-06

**Status**: Draft

**Input**: User description: "necesito mejorar la seccion de HighlightPointsBlock. Ahora mismo no tiene diseño implementado"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visitor reads the portfolio's credibility metrics at a glance (Priority: P1)

A visitor lands on the portfolio home page and scrolls past the hero. They encounter a short row of
headline numbers — years of experience, projects delivered, clients served. Today these render as
unstyled text on the page background, indistinguishable from body copy, so the eye slides past them.
After this change the numbers read as a deliberate, self-contained set of statements: each figure is
the dominant element, its meaning sits directly beneath it, and the group is visually separated from
the surrounding sections so the visitor registers it as a summary of credentials rather than stray
text.

**Why this priority**: This is the entire purpose of the section. Without it the block contributes
nothing the surrounding prose does not already say, and the numbers — the most persuasive content on
the page — are wasted. Every other story in this spec is a refinement of this one.

**Independent Test**: Load the home page on a desktop viewport with the section's current three
points. The section is fully testable on its own: the figures must be visually dominant over their
labels, the group must be perceptibly separated from the blocks above and below, and the treatment
must be recognisable as belonging to the same visual family as the other sections on the page.
Delivers the section's core value with no other story implemented.

**Acceptance Scenarios**:

1. **Given** the home page contains a highlight points section with three points, **When** a visitor
   views it on a desktop viewport, **Then** each point renders as a distinct visual unit whose figure
   is clearly more prominent than its accompanying label.
2. **Given** the section renders alongside the other portfolio sections, **When** a visitor scrolls
   the page, **Then** the section's surface treatment, corner treatment, typography, and accent
   colour are drawn from the same design vocabulary already used by the other content sections.
3. **Given** a visitor views the section, **When** they compare it to the page background, **Then**
   the section is distinguishable from the background rather than blending into it.

---

### User Story 2 - Visitor on a phone reads the same metrics without strain (Priority: P2)

A visitor arrives from a phone. The metrics must remain legible and correctly grouped at small
widths — figures large enough to read at arm's length, labels not truncated mid-word, and no
sideways scrolling introduced by the section.

**Why this priority**: A substantial share of portfolio traffic is mobile, and a stat row is one of
the layouts that degrades worst when it is not adapted — figures shrink, labels wrap awkwardly, and
the grouping breaks down. It is separated from P1 because the desktop treatment delivers value on its
own and can ship first.

**Independent Test**: View the section at a narrow viewport (around 375px wide) with the current
three points. Verify the figures stay legible, each label stays associated with its own figure, and
the page does not scroll horizontally.

**Acceptance Scenarios**:

1. **Given** a viewport around 375px wide, **When** the section renders, **Then** the points reflow
   so that each figure and its label remain visually paired and no content is clipped.
2. **Given** any supported viewport width, **When** the section renders, **Then** the page does not
   gain a horizontal scrollbar because of this section.
3. **Given** a label long enough to wrap, **When** it wraps, **Then** it stays inside its own point's
   bounds and does not overlap a neighbouring point.

---

### User Story 3 - Editor changes the points without breaking the layout (Priority: P3)

The portfolio owner edits the section in the CMS — adding a fourth metric, removing one down to two,
or rewriting a label to something longer than "Years of experience". The section must absorb these
edits and stay balanced, without the editor needing to know how the layout is built.

**Why this priority**: The section's content is already editable; what is missing is a layout that
survives editing. This matters for the owner's day-to-day use but not for the first visitor-facing
improvement, so it follows P1 and P2.

**Independent Test**: Render the section with two, three, four, and five points in turn. Verify each
count produces a balanced arrangement with no orphaned or stretched item, and no empty gap that reads
as a missing card.

**Acceptance Scenarios**:

1. **Given** the section has two points, **When** it renders, **Then** the points are arranged
   without a conspicuous empty slot beside them.
2. **Given** the section has five or more points, **When** it renders, **Then** the points wrap onto
   further rows while keeping consistent sizing and spacing.
3. **Given** an editor saves a label noticeably longer than the existing ones, **When** the section
   renders, **Then** all points retain a consistent height and alignment rather than one growing out
   of step with the rest.

---

### Edge Cases

- **Zero points**: The points list is marked required in the schema, but a draft or a partially
  filled entry can still reach the renderer with an empty or absent list. The section must render
  nothing at all rather than an empty bordered shell or a collapsed strip of whitespace.
- **Single point**: One metric must not stretch to the full content width; it should keep the same
  footprint it would have in a group.
- **Long figure text**: The figure field is free text, so an editor may enter `100%`, `10.000+`, or a
  word rather than a short `+5`. The figure must remain on one line at its intended size, or scale
  down gracefully, without overflowing its own bounds.
- **Missing subtitle on a saved draft**: If a label is absent, the figure must still render correctly
  rather than leaving a misaligned gap that breaks the row's shared baseline.
- **Assistive technology**: Each figure and its label form one statement. They must be exposed as an
  associated pair, not as two unrelated fragments of text read in sequence with no relationship.
- **Text scaling**: With the browser's font size increased substantially, the points must reflow
  rather than overlap or clip.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The section MUST present each highlight point as a discrete visual unit that a visitor
  can distinguish from its neighbours without relying on spacing alone.
- **FR-002**: Within each point, the figure MUST be typographically dominant over its label, such
  that the figure is what a visitor reads first.
- **FR-003**: The section MUST take its surface colour, border treatment, corner radius, typeface,
  and accent colour from the design tokens and shared presentational primitives already used by the
  portfolio's other content sections, introducing no new colour values or one-off styling.
- **FR-004**: The section MUST reflow responsively so the points remain legible and correctly paired
  from a 375px-wide viewport up to the site's maximum content width.
- **FR-005**: The section MUST render a balanced arrangement for any point count from one to six
  without leaving a gap that reads as missing content.
- **FR-006**: The section MUST render nothing when the points list is empty or absent, rather than an
  empty container.
- **FR-007**: Each figure MUST be programmatically associated with its label so assistive technology
  announces them as a single statement.
- **FR-008**: All text in the section MUST meet WCAG 2.1 AA contrast against its own background in
  both the light and dark themes the site already supports.
- **FR-009**: Point content MUST continue to come from the CMS block's existing fields; no figure or
  label may be hardcoded into the rendered output.
- **FR-010**: The section MUST maintain consistent point heights and a shared alignment across a row
  regardless of differing label lengths.
- **FR-011**: The vertical rhythm between this section and the sections above and below it MUST match
  the spacing convention the other sections already use.
- **FR-012**: Any interactive or motion treatment applied to the section MUST be suppressed for
  visitors who have requested reduced motion.

### Key Entities

- **Highlight Point**: A single credibility statement, consisting of a short figure (the headline
  value, e.g. `+5`) and a label naming what the figure counts (e.g. `Years of experience`). Both are
  short free text authored in the CMS. Points are ordered, and their order is meaningful.
- **Highlight Points Section**: An ordered collection of Highlight Points placed in a page's layout.
  A page may contain the section zero or one time in practice, though nothing forbids more.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A first-time visitor shown the home page for five seconds can recall at least one of
  the headline figures — the section registers rather than being scrolled past.
- **SC-002**: The section renders without layout defects (clipping, overlap, horizontal overflow, or
  uneven point heights) at every viewport width from 320px to 1920px.
- **SC-003**: The section renders correctly for every point count from one to six, with no
  arrangement that reads as having a missing item.
- **SC-004**: All text in the section passes WCAG 2.1 AA contrast in both themes, verified by
  automated contrast audit with zero violations.
- **SC-005**: A reviewer comparing the section side by side with the other portfolio sections judges
  it to belong to the same visual system, with no new colours or shape language introduced.
- **SC-006**: An editor can add, remove, or reword a point in the CMS and see a correctly laid out
  result without any code change.
- **SC-007**: A screen reader announces each figure together with its label as one statement, with no
  orphaned numbers.

## Assumptions

- The section's content model is adequate as it stands: an ordered list of figure/label pairs. This
  feature is a presentation change, and no new per-point content field (icon, description, link) is
  assumed to be needed. See Q1 below for the one open question about section-level fields.
- The portfolio's existing presentational card primitive and its variants are the intended basis for
  this section, rather than a new bespoke component. The existing shared design tokens are the source
  of every colour used.
- Both the light and dark themes the site already supports remain in scope; no third theme is
  introduced.
- No numeric count-up or scroll-triggered entrance animation is assumed. If any motion is added
  later, FR-012 governs it. Subtle hover feedback consistent with other sections is permitted but not
  required.
- The figure field remains free text rather than becoming a number, so prefixes and suffixes such as
  `+` and `%` continue to be authored by the editor.
- Six points is treated as the practical upper bound for a balanced layout. Nothing in the schema
  enforces this, and exceeding it is expected to wrap rather than fail.
- This section appears in the home page layout as seeded; it is not assumed to be restricted to the
  home page.
- Existing automated test suites must continue to pass; per the project constitution, a purely
  presentational change does not itself require new tests.

## Clarifications

Both questions raised during specification were answered on 2026-09-06. They are recorded here as
decisions; the requirements above already reflect them.

### C1: Section-level heading — RESOLVED

**Question**: Should the section gain an optional editable label and title above the points, matching
the sibling sections?

**Decision**: Yes. The section gains two optional section-level text fields — a small `label` and a
`title` — authored in the CMS, matching the field naming already used by the Skills and Experience
sections.

**Consequences**:

- This is no longer a purely presentational change. It alters the content schema, so the generated
  types must be regenerated and committed, and the seed content updated.
- Constitution Principle V therefore applies: the schema change needs integration coverage.
- Both fields are optional, so content saved before this change keeps rendering without an edit.

**Derived requirements**: FR-013, FR-014, FR-015 below.

### C2: Visual treatment of a point — RESOLVED

**Question**: Which visual treatment should a single highlight point use?

**Decision**: A bordered card surface per point, with the figure rendered in the site's accent
colour. This is the treatment closest to the presentational card primitive the other card-based
sections already use.

**Consequences**:

- The existing card primitive and its bordered variant are the intended basis; no new surface,
  border, or corner treatment is introduced.
- The known risk, accepted: a row of bordered cards directly beneath the hero is visually heavier
  than the alternatives considered. FR-016 constrains this so the section does not outweigh the
  sections below it.

**Derived requirements**: FR-016 below.

## Requirements (added by clarification)

- **FR-013**: The section MUST accept an optional editor-authored label and an optional
  editor-authored title, displayed above the points.
- **FR-014**: When neither label nor title is authored, the section MUST render the points with no
  empty heading area and no residual vertical gap.
- **FR-015**: Content saved before this change — which has neither field — MUST continue to render
  correctly with no editor intervention and no migration step.
- **FR-016**: The bordered point cards MUST NOT read as heavier than the card-based sections further
  down the page; the border weight, corner treatment, and surface colour MUST be the same values
  those sections already use, not stronger ones.
