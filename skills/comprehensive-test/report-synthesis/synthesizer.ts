/**
 * Report Synthesizer
 *
 * Combines test results from multiple frameworks into:
 * 1. Unified bug list
 * 2. Overlapping bugs (found by multiple frameworks)
 * 3. Prioritized fix-it plan
 */

import type {
  BugReport,
  FixItPlan,
  FixItem,
  PlaywrightResult,
  CypressResult,
  Priority,
  Effort,
} from './types';
import { detectConflicts, generateConflictReport } from './conflict-detector';

// ============================================
// RESULT PARSERS
// ============================================

/**
 * Parse Playwright JSON results into BugReports
 */
export function parsePlaywrightResults(
  results: PlaywrightResult,
  environment: 'local' | 'staging' | 'production'
): BugReport[] {
  const bugs: BugReport[] = [];
  let counter = 1;

  for (const suite of results.suites || []) {
    for (const spec of suite.specs || []) {
      for (const test of spec.tests || []) {
        if (test.status === 'failed') {
          const result = test.results?.[0];
          const error = result?.error;

          bugs.push({
            id: `PW-${String(counter++).padStart(3, '0')}`,
            source: 'playwright',
            environment,
            severity: inferSeverity(error?.message || ''),
            category: inferCategory(spec.title, error?.message || ''),
            page: extractPage(suite.file),
            component: extractComponent(spec.title),
            description: `${spec.title}: ${test.title}`,
            steps: [`Navigate to ${extractPage(suite.file)}`, 'Run test'],
            expected: 'Test should pass',
            actual: error?.message || 'Test failed',
            screenshotPath: result?.attachments?.find(
              (a) => a.name === 'screenshot'
            )?.path,
            affectedFiles: inferAffectedFiles(suite.file, spec.title),
            fingerprint: generateFingerprint(spec.title, error?.message || ''),
            timestamp: new Date().toISOString(),
            rawOutput: error?.stack,
          });
        }
      }
    }
  }

  return bugs;
}

/**
 * Parse Cypress JSON results into BugReports
 */
export function parseCypressResults(
  results: CypressResult,
  environment: 'local' | 'staging' | 'production'
): BugReport[] {
  const bugs: BugReport[] = [];
  let counter = 1;

  for (const test of results.results || []) {
    if (test.state === 'failed') {
      bugs.push({
        id: `CY-${String(counter++).padStart(3, '0')}`,
        source: 'cypress',
        environment,
        severity: inferSeverity(test.err?.message || ''),
        category: inferCategory(test.fullTitle, test.err?.message || ''),
        page: extractPage(test.fullTitle),
        component: extractComponent(test.title),
        description: test.fullTitle,
        steps: ['Run Cypress test'],
        expected: 'Test should pass',
        actual: test.err?.message || 'Test failed',
        affectedFiles: inferAffectedFiles(test.fullTitle, test.title),
        fingerprint: generateFingerprint(test.fullTitle, test.err?.message || ''),
        timestamp: new Date().toISOString(),
        rawOutput: test.err?.stack,
      });
    }
  }

  return bugs;
}

/**
 * Parse integration test results (Vitest JSON format)
 */
export function parseIntegrationResults(
  results: { testResults: Array<{ name: string; status: string; message?: string }> },
  environment: 'local' | 'staging' | 'production'
): BugReport[] {
  const bugs: BugReport[] = [];
  let counter = 1;

  for (const test of results.testResults || []) {
    if (test.status === 'failed') {
      bugs.push({
        id: `INT-${String(counter++).padStart(3, '0')}`,
        source: 'integration',
        environment,
        severity: 'medium', // Integration tests usually medium priority
        category: 'functional',
        page: extractPage(test.name),
        component: extractComponent(test.name),
        description: test.name,
        steps: ['Run integration test'],
        expected: 'Test should pass',
        actual: test.message || 'Test failed',
        affectedFiles: inferAffectedFiles(test.name, ''),
        fingerprint: generateFingerprint(test.name, test.message || ''),
        timestamp: new Date().toISOString(),
      });
    }
  }

  return bugs;
}

// ============================================
// SYNTHESIS
// ============================================

/**
 * Combine all bug reports and generate fix plan
 */
export function synthesize(
  playwrightBugs: BugReport[],
  cypressBugs: BugReport[],
  integrationBugs: BugReport[],
  environment: 'local' | 'staging' | 'production'
): FixItPlan {
  const allBugs = [...playwrightBugs, ...cypressBugs, ...integrationBugs];

  // Find overlapping bugs (same fingerprint from different sources)
  const { overlapping, unique } = findOverlaps(allBugs);

  // Run conflict detection
  const conflictAnalysis = detectConflicts(allBugs);

  // Generate fix items
  const fixes = generateFixItems(allBugs, conflictAnalysis);

  // Calculate summary
  const summary = {
    totalBugs: allBugs.length,
    critical: allBugs.filter((b) => b.severity === 'critical').length,
    high: allBugs.filter((b) => b.severity === 'high').length,
    medium: allBugs.filter((b) => b.severity === 'medium').length,
    low: allBugs.filter((b) => b.severity === 'low').length,
    blockedFixes: fixes.filter((f) => f.blocked).length,
  };

  return {
    generatedAt: new Date().toISOString(),
    environment,
    summary,
    fixes,
    overlappingBugs: overlapping,
    uniqueBugs: unique,
  };
}

/**
 * Find bugs that appear in multiple frameworks
 */
function findOverlaps(bugs: BugReport[]): {
  overlapping: BugReport[];
  unique: BugReport[];
} {
  const byFingerprint = new Map<string, BugReport[]>();

  for (const bug of bugs) {
    const existing = byFingerprint.get(bug.fingerprint) || [];
    existing.push(bug);
    byFingerprint.set(bug.fingerprint, existing);
  }

  const overlapping: BugReport[] = [];
  const unique: BugReport[] = [];

  for (const [, group] of byFingerprint) {
    if (group.length > 1) {
      // Found by multiple frameworks - high confidence
      overlapping.push(...group);
    } else {
      unique.push(...group);
    }
  }

  return { overlapping, unique };
}

/**
 * Generate ordered fix items from bugs
 */
function generateFixItems(
  bugs: BugReport[],
  conflictAnalysis: ReturnType<typeof detectConflicts>
): FixItem[] {
  const fixes: FixItem[] = [];

  // Group by fingerprint to dedupe
  const grouped = new Map<string, BugReport[]>();
  for (const bug of bugs) {
    const existing = grouped.get(bug.fingerprint) || [];
    existing.push(bug);
    grouped.set(bug.fingerprint, existing);
  }

  for (const [, group] of grouped) {
    const representative = group[0];
    const bugIds = group.map((b) => b.id);

    // Check if blocked by conflict
    const relatedConflicts = conflictAnalysis.conflicts.filter((c) =>
      c.bugIds.some((id) => bugIds.includes(id))
    );
    const blocked = relatedConflicts.some((c) => c.severity === 'blocking');

    // Determine dependencies
    const deps: string[] = [];
    for (const id of bugIds) {
      const idDeps = conflictAnalysis.dependencyGraph[id] || [];
      deps.push(...idDeps);
    }

    fixes.push({
      priority: severityToPriority(representative.severity),
      bugIds,
      suggestedFix:
        representative.suggestedFix || `Fix: ${representative.description}`,
      affectedFiles: representative.affectedFiles || [],
      estimatedEffort: inferEffort(representative),
      dependencies: [...new Set(deps)],
      conflicts: relatedConflicts.map((c) => c.id),
      blocked,
      applyAfter: deps,
    });
  }

  // Sort by priority and dependency order
  return fixes.sort((a, b) => {
    if (a.blocked !== b.blocked) return a.blocked ? 1 : -1;
    return a.priority - b.priority;
  });
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function inferSeverity(errorMessage: string): BugReport['severity'] {
  const msg = errorMessage.toLowerCase();
  if (msg.includes('crash') || msg.includes('error boundary')) return 'critical';
  if (msg.includes('cannot') || msg.includes('failed')) return 'high';
  if (msg.includes('should') || msg.includes('expected')) return 'medium';
  return 'low';
}

function inferCategory(
  title: string,
  errorMessage: string
): BugReport['category'] {
  const combined = `${title} ${errorMessage}`.toLowerCase();
  if (combined.includes('a11y') || combined.includes('accessibility'))
    return 'accessibility';
  if (combined.includes('visual') || combined.includes('screenshot'))
    return 'visual';
  if (combined.includes('performance') || combined.includes('slow'))
    return 'performance';
  if (combined.includes('ux') || combined.includes('user experience'))
    return 'ux';
  return 'functional';
}

function extractPage(path: string): string {
  // Extract page name from file path or test title
  const match = path.match(/(?:pages?|routes?)[/\\](\w+)/i);
  return match ? match[1] : path.split('/').pop() || 'unknown';
}

function extractComponent(title: string): string | undefined {
  // Look for component names in title
  const match = title.match(/(?:<|^)(\w+(?:Form|Button|Modal|Page|Card))/);
  return match ? match[1] : undefined;
}

function inferAffectedFiles(path: string, title: string): string[] {
  const files: string[] = [];

  // Extract file references from path
  if (path.includes('.ts') || path.includes('.tsx')) {
    files.push(path);
  }

  // Look for component references in title
  const componentMatch = title.match(/(\w+(?:Form|Button|Modal|Page|Card))/);
  if (componentMatch) {
    files.push(`src/components/**/${componentMatch[1]}.tsx`);
  }

  return files;
}

function generateFingerprint(title: string, error: string): string {
  // Create a stable fingerprint for deduplication
  const normalized = `${title}:${error}`
    .toLowerCase()
    .replace(/\d+/g, 'N') // Normalize numbers
    .replace(/\s+/g, ' ')
    .trim();

  // Simple hash
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return `FP-${Math.abs(hash).toString(16)}`;
}

function severityToPriority(severity: BugReport['severity']): Priority {
  switch (severity) {
    case 'critical':
      return 1;
    case 'high':
      return 2;
    case 'medium':
      return 3;
    case 'low':
      return 4;
  }
}

function inferEffort(bug: BugReport): Effort {
  const files = bug.affectedFiles?.length || 0;
  if (files > 3) return 'large';
  if (files > 1) return 'medium';
  return 'small';
}

// ============================================
// MARKDOWN REPORT GENERATION
// ============================================

export function generateFixItPlanMarkdown(plan: FixItPlan): string {
  const lines: string[] = [
    '# Fix-It Plan',
    '',
    `Generated: ${plan.generatedAt}`,
    `Environment: ${plan.environment}`,
    '',
    '## Summary',
    '',
    `| Metric | Count |`,
    `|--------|-------|`,
    `| Total Bugs | ${plan.summary.totalBugs} |`,
    `| Critical | ${plan.summary.critical} |`,
    `| High | ${plan.summary.high} |`,
    `| Medium | ${plan.summary.medium} |`,
    `| Low | ${plan.summary.low} |`,
    `| Blocked Fixes | ${plan.summary.blockedFixes} |`,
    '',
  ];

  // Overlapping bugs (high confidence)
  if (plan.overlappingBugs.length > 0) {
    lines.push('## High Confidence Bugs (Found by Multiple Frameworks)', '');
    for (const bug of plan.overlappingBugs) {
      lines.push(`- **${bug.id}** (${bug.source}): ${bug.description}`);
    }
    lines.push('');
  }

  // Prioritized fixes
  lines.push('## Prioritized Fixes', '');

  for (const fix of plan.fixes) {
    const status = fix.blocked ? ' [BLOCKED]' : '';
    lines.push(`### Priority ${fix.priority}${status}: ${fix.bugIds.join(', ')}`);
    lines.push(`- **Fix**: ${fix.suggestedFix}`);
    lines.push(`- **Files**: ${fix.affectedFiles.join(', ') || 'TBD'}`);
    lines.push(`- **Effort**: ${fix.estimatedEffort}`);
    if (fix.dependencies.length > 0) {
      lines.push(`- **Depends on**: ${fix.dependencies.join(', ')}`);
    }
    if (fix.conflicts.length > 0) {
      lines.push(`- **Conflicts**: ${fix.conflicts.join(', ')}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}
