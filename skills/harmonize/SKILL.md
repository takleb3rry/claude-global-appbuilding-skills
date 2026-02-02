---
name: harmonize
description: Enforce codebase conventions and add data-testid attributes to interactive elements before E2E testing. Eliminates ~70% of E2E test failures from naming mismatches.
argument-hint: [scan|fix-testids|fix-all]
context: fork
---

# Harmonize

Scan frontend components for convention violations and missing test selectors. Generate a detailed report with impact analysis. User decides what to fix.

## When to Use
- Before running `/comprehensive-test` or E2E tests
- After completing a build phase
- User says "harmonize", "check conventions", "add test ids", "prep for testing"
- Before deployment to catch convention drift

## When NOT to Use
- During active feature development (wait until feature is complete)
- For backend/API code (handled by Drizzle ORM and Zod validation)
- For code style issues (use ESLint/Prettier instead)

---

## Execution Modes

| Command | Action |
|---------|--------|
| `/harmonize` | **Scan only** (default) - Report issues with impact analysis, no changes |
| `/harmonize fix-testids` | Fix ONLY missing data-testid attributes (safe, no side effects) |
| `/harmonize fix-all` | Fix everything including renames (prompts for confirmation) |

**Default is scan-only.** This is intentional - the user should review the report before any changes are made.

---

## Phase 1: Read Conventions

**Goal**: Load project-specific conventions or use sensible defaults.

1. **Check for naming_conventions.md** in project root
2. **If found**, parse for:
   - `data-testid` patterns (look for "Test IDs" or "data-testid" section)
   - Modal callback names (look for "Modal Props" section)
   - Error state naming (look for "Error State" section)
3. **If not found**, use these defaults:

### Default Conventions

```typescript
// data-testid format
data-testid="{component-kebab}-{element-type}[-{qualifier}]"
// Example: entry-form-modal-submit-btn

// Modal callbacks
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;    // NOT onCancel, onDismiss
  onSubmit?: () => void;  // NOT onConfirm
}

// Error state
const [error, setError] = useState<string | null>(null);
const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
// NOT: validationError, errors, errorMessage
```

---

## Phase 2: Scan Files

**Goal**: Find source files and detect convention violations.

1. **Identify the project's primary language/framework** from project files
2. **Glob for source files** relevant to that stack (exclude node_modules, venv, target, etc.)
3. **For each file**, check against conventions documented in naming_conventions.md:
   - Focus on the specific patterns and naming rules defined there
   - Apply judgment about which checks are relevant to each file type
   - For UI components: test selectors, callback naming, component structure
   - For all code: error handling patterns, date field naming, general consistency

### BLOCKING Issues (break tests or cause runtime errors)

Issues that will likely cause test failures or runtime problems based on the conventions defined in naming_conventions.md. Examples:
- Missing test selectors on interactive elements (if conventions require them)
- Wrong callback/prop naming that breaks component contracts
- Naming mismatches between what tests expect and what code provides

### WARNING Issues (inconsistent but may still work)

Deviations from documented conventions that don't necessarily break functionality:
- Inconsistent naming patterns
- Non-standard error state naming
- Style/pattern inconsistencies

---

## Phase 3: Impact Analysis (CRITICAL)

**Goal**: For each issue found, analyze the impact BEFORE suggesting any fix.

### For Missing data-testid (LOW RISK)
- Impact: None - adding attributes doesn't affect existing code
- Risk: LOW
- Auto-fixable: YES

### For Prop Renames (onCancel → onClose) (HIGH RISK)

**MUST grep for all usages before reporting:**

```bash
# Find all files that import this component
grep -r "import.*ComponentName" --include="*.tsx" --include="*.ts"

# Find all usages of the prop being renamed
grep -r "onCancel=" --include="*.tsx" --include="*.ts"
```

**Report must include:**
- File where prop is defined
- All files that use this component
- All files that pass this prop
- Estimated number of call sites affected

### For Variable Renames (validationError → error) (MEDIUM RISK)

**MUST check for:**
- External exports of the variable
- Usage in other files via imports
- Usage in tests

```bash
# Check if variable is exported
grep -n "export.*validationError" file.tsx

# Check for imports in other files
grep -r "import.*validationError" --include="*.tsx" --include="*.ts"
```

---

## Phase 4: Generate Report

**Goal**: Create comprehensive report with all findings, impacts, and risks.

Create `harmonize-report.md` in project root. Example format (component names are illustrative):

```markdown
# Harmonize Report

Generated: {timestamp}
Mode: Scan Only (no changes made)

## Summary

| Category | Count | Risk Level | Auto-fixable |
|----------|-------|------------|--------------|
| Missing data-testid | X | LOW | YES |
| Wrong modal callbacks | X | HIGH | NO (needs review) |
| Wrong error state | X | MEDIUM | NO (needs review) |

**Files scanned**: N
**Total issues**: N
**Recommendation**: {SAFE TO AUTO-FIX / NEEDS MANUAL REVIEW}

---

## BLOCKING Issues

### 1. Missing data-testid

**Risk**: LOW - Adding attributes has no side effects
**Fix command**: `/harmonize fix-testids`

| File | Element | Suggested testid |
|------|---------|------------------|
| EntryFormModal.tsx:45 | `<button>Save</button>` | `entry-form-modal-submit-btn` |
| EntryFormModal.tsx:52 | `<input name="email">` | `entry-form-modal-email-input` |
| EmployeeList.tsx:23 | `<button>Add</button>` | `employee-list-add-btn` |

### 2. Wrong Modal Callbacks

**Risk**: HIGH - Renaming props breaks parent components

#### ConfirmationModal.tsx
- **Issue**: Uses `onCancel` instead of `onClose`
- **Line**: 8 (interface), 24 (destructure), 45 (usage)

**Impact Analysis**:
```
Call sites found (grep results):
- src/pages/DashboardPage.tsx:142 - <ConfirmationModal onCancel={...} />
- src/pages/UserProfilePage.tsx:89 - <ConfirmationModal onCancel={...} />
```

**To fix manually**:
1. Rename prop in ConfirmationModal.tsx (3 locations)
2. Update DashboardPage.tsx:142
3. Update UserProfilePage.tsx:89
4. Run `npx tsc --noEmit` to verify

---

## WARNING Issues

### 1. Wrong Error State Naming

**Risk**: MEDIUM - May affect component logic

#### SettingsModal.tsx
- **Issue**: Uses `validationError` instead of `error`
- **Line**: 16 (declaration), 23, 28, 34, 38, 65-67 (usages)

**Impact Analysis**:
```
External references: None found
Exports: Not exported
Safe to rename within file: YES
```

**To fix manually**:
1. Rename `validationError` → `error` (6 locations in file)
2. Rename `setValidationError` → `setError` (4 locations)
3. Note: Hook already returns `error`, rename to `apiError` first

---

## Recommended Actions

### Safe to auto-fix (run `/harmonize fix-testids`):
- [ ] Add 5 missing data-testid attributes

### Requires manual review:
- [ ] ConfirmationModal.tsx: onCancel → onClose (2 call sites affected)
- [ ] SettingsModal.tsx: validationError → error (internal only)

---

## Post-Fix Verification

After making changes, run:
```bash
# Type check
npx tsc --noEmit

# Run affected tests
npm test -- --grep "ConfirmationModal|SettingsModal"

# Re-run harmonize to verify
/harmonize
```
```

---

## Phase 5: Fix Modes (Only if requested)

### `/harmonize fix-testids` (SAFE)

Only fix missing data-testid attributes:
1. Add `data-testid` to elements listed in report
2. Use suggested IDs from report
3. Update report to show fixed items
4. No prompts needed - these are always safe

### `/harmonize fix-all` (REQUIRES CONFIRMATION)

For each non-testid issue:
1. Show the issue and full impact analysis from report
2. Show all affected call sites (grep results)
3. Ask: "Fix this issue? This will affect N files. [y/n]"
4. If yes:
   - Make the change in the source file
   - List all call sites that need manual update
   - Add to report
5. After all fixes, remind user to:
   - Update call sites manually
   - Run `npx tsc --noEmit`
   - Run tests

---

## Phase 6: Exit

**Always generate/update harmonize-report.md before exiting.**

- **Scan mode**: Exit successfully with summary
- **Fix mode**:
  - If all issues fixed: "PASS: Ready for E2E testing"
  - If issues remain: "WARN: X issues remain - see harmonize-report.md"

---

## Safeguards

1. **Default is read-only** - No changes without explicit fix command
2. **Grep before suggest** - Always show call site impact for renames
3. **Report everything** - Full audit trail in harmonize-report.md
4. **User decides** - Complex fixes require explicit approval
5. **Verify after** - Report includes verification commands

---

## Scope Boundaries

### IN SCOPE
- `data-testid` on interactive elements
- Modal callback naming (onClose, onSubmit)
- Error state naming (error, fieldErrors)

### OUT OF SCOPE (handled by other tools)
- Database column naming → Drizzle ORM
- API field naming → Zod validation
- Code style (handleX, isX, useX) → ESLint
- Formatting → Prettier
