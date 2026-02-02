# Requirements: [Project Name]

This is an example of the output from `/kickoff`.

---

## 1. Introduction

### 1.1 Project Context

**Organization**: [Brief description of who is building this and why]

**Problem Statement**: [Clear articulation of the problem being solved]

**Solution**: [High-level description of what will be built]

**Scope**: [What's in and out of scope]

**Success Criteria**: [How we'll know if the project succeeded]

### 1.2 Key Principles

1. **[Principle 1 Name]**: [Description of guiding principle]
2. **[Principle 2 Name]**: [Description]
3. **[Principle 3 Name]**: [Description]

---

## 2. Glossary

| Term | Definition |
|------|------------|
| **[Term 1]** | [Definition] |
| **[Term 2]** | [Definition] |
| **[Term 3]** | [Definition] |

---

## 3. Requirements

### REQ-1: [Feature Name]

**Traces to**: A1, A3 *(references assumption IDs from ideation.md)*

**User Story**: As a [role], I want to [capability], so that [benefit].

**Acceptance Criteria**:

1. THE System SHALL [required behavior 1].
2. THE System SHALL [required behavior 2].
3. THE System SHOULD [recommended behavior] *(lower priority)*.
4. THE System MAY [optional behavior] *(nice-to-have)*.

---

### REQ-2: [Feature Name]

**Traces to**: A2, A4

**User Story**: As a [role], I want to [capability], so that [benefit].

**Acceptance Criteria**:

1. THE System SHALL [required behavior].
2. THE System SHALL [required behavior].
3. THE System SHALL NOT [prohibited behavior].

---

### REQ-3: [Feature Name]

**Traces to**: A5

**User Story**: As a [role], I want to [capability], so that [benefit].

**Acceptance Criteria**:

1. THE System SHALL [required behavior].
2. THE System SHALL [required behavior].

---

## Notes on Requirements Format

- **SHALL** = Must have for v1
- **SHOULD** = Important but can be deferred if needed
- **MAY** = Nice to have
- **SHALL NOT** = Explicitly prohibited behavior

**Traceability**: Each requirement traces back to assumptions from ideation.md using assumption IDs (A1, A2, etc.). This creates the chain: Assumption → Requirement → Test.
