/**
 * Report Synthesis Types
 *
 * Standardized schemas for bug reports, conflicts, and fix plans.
 * Used to normalize output from different test frameworks.
 */

// ============================================
// BUG REPORT SCHEMA
// ============================================

export interface BugReport {
  /** Unique identifier (e.g., PW-001, CY-002, INT-003) */
  id: string;

  /** Which framework found this bug */
  source: 'playwright' | 'cypress' | 'integration' | 'manual';

  /** Where the test ran */
  environment: 'local' | 'staging' | 'production';

  /** Impact level */
  severity: 'critical' | 'high' | 'medium' | 'low';

  /** Type of issue */
  category: 'functional' | 'visual' | 'accessibility' | 'performance' | 'ux';

  /** Maps to UAT checklist item (if applicable) */
  uatSuite?: string;

  /** Page/route where bug was found */
  page: string;

  /** Specific component (if known) */
  component?: string;

  /** Clear description of the issue */
  description: string;

  /** Steps to reproduce */
  steps: string[];

  /** Expected behavior */
  expected: string;

  /** Actual behavior */
  actual: string;

  /** Path to screenshot if captured */
  screenshotPath?: string;

  /** Path to video if captured */
  videoPath?: string;

  /** Files likely needing modification */
  affectedFiles?: string[];

  /** Suggested fix (if obvious) */
  suggestedFix?: string;

  /** Fingerprint for deduplication */
  fingerprint: string;

  /** When the bug was found */
  timestamp: string;

  /** Raw test output/error message */
  rawOutput?: string;
}

// ============================================
// CONFLICT ANALYSIS SCHEMA
// ============================================

export type ConflictType =
  | 'same-file'        // Multiple fixes for same file
  | 'dependency'       // Fix A requires Fix B first
  | 'contradictory'    // Fixes are mutually exclusive
  | 'overwrite-risk';  // Fixes touch overlapping code

export type ConflictSeverity =
  | 'blocking'   // Requires human decision
  | 'warning'    // Can proceed with caution
  | 'info';      // Just informational

export interface Conflict {
  /** Unique conflict identifier */
  id: string;

  /** Type of conflict */
  type: ConflictType;

  /** How serious is this conflict */
  severity: ConflictSeverity;

  /** Bug reports involved in this conflict */
  bugIds: string[];

  /** Files affected by this conflict */
  files: string[];

  /** Human-readable description */
  description: string;

  /** Resolution guidance */
  resolution: {
    recommendation: string;
    fixOrder?: string[];  // If dependency type
    manualReviewRequired: boolean;
  };
}

export interface ConflictAnalysis {
  /** All detected conflicts */
  conflicts: Conflict[];

  /** Dependency graph: fixId -> [dependsOn fixIds] */
  dependencyGraph: Record<string, string[]>;

  /** Topologically sorted fix order */
  suggestedFixOrder: string[];

  /** Summary stats */
  summary: {
    totalConflicts: number;
    blocking: number;
    warning: number;
    info: number;
  };
}

// ============================================
// FIX PLAN SCHEMA
// ============================================

export type Priority = 1 | 2 | 3 | 4;  // 1 = highest

export type Effort = 'small' | 'medium' | 'large';

export interface FixItem {
  /** Priority (1 = highest) */
  priority: Priority;

  /** Bug(s) this fix addresses */
  bugIds: string[];

  /** What to do */
  suggestedFix: string;

  /** Files to modify */
  affectedFiles: string[];

  /** Rough effort estimate */
  estimatedEffort: Effort;

  /** Other fixes that must come first */
  dependencies: string[];

  /** Conflicts affecting this fix */
  conflicts: string[];

  /** True if blocked by unresolved conflict */
  blocked: boolean;

  /** Order constraint from conflict analysis */
  applyAfter: string[];
}

export interface FixItPlan {
  /** When this plan was generated */
  generatedAt: string;

  /** Environment tested */
  environment: string;

  /** Summary stats */
  summary: {
    totalBugs: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    blockedFixes: number;
  };

  /** Ordered list of fixes */
  fixes: FixItem[];

  /** Bugs found by multiple frameworks (high confidence) */
  overlappingBugs: BugReport[];

  /** Bugs found by only one framework */
  uniqueBugs: BugReport[];
}

// ============================================
// UAT EVIDENCE SCHEMA
// ============================================

export interface UATSuiteResult {
  /** Suite name from checklist */
  name: string;

  /** Did all tests pass? */
  passed: boolean;

  /** Test count */
  testsRun: number;
  testsPassed: number;
  testsFailed: number;

  /** Associated bug IDs if failed */
  failedBugIds: string[];

  /** Evidence (screenshots, logs) */
  evidence: string[];
}

export interface UATEvidence {
  /** When generated */
  generatedAt: string;

  /** Overall status */
  allSuitesPassed: boolean;

  /** Per-suite results */
  suites: UATSuiteResult[];

  /** Ready for sign-off? */
  readyForSignoff: boolean;

  /** Blocking issues preventing sign-off */
  blockers: string[];
}

// ============================================
// TEST RESULT PARSING TYPES
// ============================================

export interface PlaywrightResult {
  config: unknown;
  suites: PlaywrightSuite[];
}

export interface PlaywrightSuite {
  title: string;
  file: string;
  specs: PlaywrightSpec[];
}

export interface PlaywrightSpec {
  title: string;
  ok: boolean;
  tests: PlaywrightTest[];
}

export interface PlaywrightTest {
  title: string;
  status: 'passed' | 'failed' | 'skipped';
  results: PlaywrightTestResult[];
}

export interface PlaywrightTestResult {
  status: string;
  error?: { message: string; stack: string };
  attachments?: { name: string; path: string }[];
}

export interface CypressResult {
  stats: {
    tests: number;
    passes: number;
    failures: number;
  };
  results: CypressTestResult[];
}

export interface CypressTestResult {
  title: string;
  fullTitle: string;
  state: 'passed' | 'failed';
  err?: { message: string; stack: string };
}
