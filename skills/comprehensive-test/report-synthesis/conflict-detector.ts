/**
 * Conflict Detection Algorithm
 *
 * Analyzes bug reports to identify:
 * 1. Same-file conflicts (multiple fixes for one file)
 * 2. Dependency conflicts (fix A requires fix B first)
 * 3. Contradictory fixes (mutually exclusive)
 * 4. Overwrite risks (overlapping code regions)
 *
 * Outputs a topologically sorted fix order.
 */

import type {
  BugReport,
  Conflict,
  ConflictAnalysis,
  ConflictType,
  ConflictSeverity,
} from './types';

// ============================================
// MAIN DETECTION FUNCTION
// ============================================

export function detectConflicts(bugs: BugReport[]): ConflictAnalysis {
  const conflicts: Conflict[] = [];
  const dependencyGraph: Record<string, string[]> = {};
  let conflictIdCounter = 1;

  // Group bugs by affected file
  const bugsByFile = groupBy(bugs, (b) => b.affectedFiles || []);

  // 1. Detect same-file conflicts
  for (const [file, fileBugs] of Object.entries(bugsByFile)) {
    if (fileBugs.length > 1) {
      // Check for contradictions
      if (hasContradiction(fileBugs)) {
        conflicts.push({
          id: `CONFLICT-${String(conflictIdCounter++).padStart(3, '0')}`,
          type: 'contradictory',
          severity: 'blocking',
          bugIds: fileBugs.map((b) => b.id),
          files: [file],
          description: `Multiple conflicting fixes for ${file}`,
          resolution: {
            recommendation:
              'Manual review required - fixes may be mutually exclusive',
            manualReviewRequired: true,
          },
        });
      } else {
        // Check for overwrite risk
        conflicts.push({
          id: `CONFLICT-${String(conflictIdCounter++).padStart(3, '0')}`,
          type: 'overwrite-risk',
          severity: 'warning',
          bugIds: fileBugs.map((b) => b.id),
          files: [file],
          description: `Fixes touch same file: ${file}`,
          resolution: {
            recommendation: 'Apply fixes sequentially, verify each before next',
            fixOrder: orderBySeverity(fileBugs).map((b) => b.id),
            manualReviewRequired: false,
          },
        });
      }
    }
  }

  // 2. Detect dependency chains
  for (const bug of bugs) {
    const deps = inferDependencies(bug, bugs);
    if (deps.length > 0) {
      dependencyGraph[bug.id] = deps;

      conflicts.push({
        id: `CONFLICT-${String(conflictIdCounter++).padStart(3, '0')}`,
        type: 'dependency',
        severity: 'info',
        bugIds: [bug.id, ...deps],
        files: bug.affectedFiles || [],
        description: `${bug.id} depends on: ${deps.join(', ')}`,
        resolution: {
          recommendation: `Apply in order: ${deps.join(' → ')} → ${bug.id}`,
          fixOrder: [...deps, bug.id],
          manualReviewRequired: false,
        },
      });
    }
  }

  // 3. Topological sort for fix order
  const suggestedFixOrder = topologicalSort(dependencyGraph, bugs);

  // 4. Calculate summary
  const summary = {
    totalConflicts: conflicts.length,
    blocking: conflicts.filter((c) => c.severity === 'blocking').length,
    warning: conflicts.filter((c) => c.severity === 'warning').length,
    info: conflicts.filter((c) => c.severity === 'info').length,
  };

  return {
    conflicts,
    dependencyGraph,
    suggestedFixOrder,
    summary,
  };
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Group bugs by a key extractor (supports arrays)
 */
function groupBy(
  bugs: BugReport[],
  keyFn: (bug: BugReport) => string[]
): Record<string, BugReport[]> {
  const result: Record<string, BugReport[]> = {};

  for (const bug of bugs) {
    const keys = keyFn(bug);
    for (const key of keys) {
      if (!result[key]) {
        result[key] = [];
      }
      result[key].push(bug);
    }
  }

  return result;
}

/**
 * Check if bugs have contradictory fixes
 */
function hasContradiction(bugs: BugReport[]): boolean {
  const fixes = bugs.map((b) => b.suggestedFix?.toLowerCase() || '');

  // Look for opposing actions
  const patterns = [
    { add: /\b(add|create|enable)\b/, remove: /\b(remove|delete|disable)\b/ },
    { show: /\b(show|display|visible)\b/, hide: /\b(hide|hidden)\b/ },
    { enable: /\b(enable|activate)\b/, disable: /\b(disable|deactivate)\b/ },
  ];

  for (const pattern of patterns) {
    const hasAdd = fixes.some((f) => pattern.add.test(f));
    const hasRemove = fixes.some((f) => pattern.remove.test(f));
    if (hasAdd && hasRemove) {
      return true;
    }
  }

  return false;
}

/**
 * Infer dependencies between bugs based on heuristics
 */
function inferDependencies(bug: BugReport, allBugs: BugReport[]): string[] {
  const deps: string[] = [];

  for (const other of allBugs) {
    if (other.id === bug.id) continue;

    // Same component - check for structural dependencies
    if (bug.component && bug.component === other.component) {
      // Accessibility fixes usually need structure first
      if (
        bug.category === 'functional' &&
        other.category === 'accessibility'
      ) {
        deps.push(other.id);
      }

      // Validation depends on field existence
      const bugFix = bug.suggestedFix?.toLowerCase() || '';
      const otherFix = other.suggestedFix?.toLowerCase() || '';

      if (bugFix.includes('validate') && otherFix.includes('add')) {
        deps.push(other.id);
      }
    }

    // File-based dependencies
    const bugFiles = bug.affectedFiles || [];
    const otherFiles = other.affectedFiles || [];

    // If other bug creates a file this bug modifies
    if (
      otherFiles.some((f) => bugFiles.includes(f)) &&
      other.suggestedFix?.toLowerCase().includes('create')
    ) {
      deps.push(other.id);
    }
  }

  return [...new Set(deps)]; // Deduplicate
}

/**
 * Order bugs by severity (critical first)
 */
function orderBySeverity(bugs: BugReport[]): BugReport[] {
  const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  return [...bugs].sort(
    (a, b) => severityOrder[a.severity] - severityOrder[b.severity]
  );
}

/**
 * Topological sort of bugs based on dependency graph
 */
function topologicalSort(
  graph: Record<string, string[]>,
  bugs: BugReport[]
): string[] {
  const allIds = bugs.map((b) => b.id);
  const visited = new Set<string>();
  const result: string[] = [];

  function visit(id: string, ancestors: Set<string>) {
    if (ancestors.has(id)) {
      // Circular dependency - break it
      console.warn(`Circular dependency detected involving ${id}`);
      return;
    }
    if (visited.has(id)) return;

    ancestors.add(id);

    const deps = graph[id] || [];
    for (const dep of deps) {
      visit(dep, new Set(ancestors));
    }

    visited.add(id);
    result.push(id);
  }

  // Visit all nodes
  for (const id of allIds) {
    if (!visited.has(id)) {
      visit(id, new Set());
    }
  }

  return result;
}

// ============================================
// MARKDOWN REPORT GENERATION
// ============================================

export function generateConflictReport(analysis: ConflictAnalysis): string {
  const lines: string[] = [
    '# Conflict Analysis Report',
    '',
    `Generated: ${new Date().toISOString()}`,
    `Total Conflicts: ${analysis.summary.totalConflicts}`,
    `Blocking: ${analysis.summary.blocking} | Warning: ${analysis.summary.warning} | Info: ${analysis.summary.info}`,
    '',
  ];

  // Blocking conflicts
  const blocking = analysis.conflicts.filter((c) => c.severity === 'blocking');
  if (blocking.length > 0) {
    lines.push('## Blocking Conflicts (Require Manual Review)', '');
    for (const conflict of blocking) {
      lines.push(`### ${conflict.id}: ${conflict.description}`);
      lines.push(`- **Type**: ${conflict.type}`);
      lines.push(`- **Files**: ${conflict.files.join(', ')}`);
      lines.push(`- **Bugs**: ${conflict.bugIds.join(', ')}`);
      lines.push(`- **Recommendation**: ${conflict.resolution.recommendation}`);
      lines.push(`- **Action**: MANUAL_REVIEW_REQUIRED`);
      lines.push('');
    }
  }

  // Warning conflicts
  const warnings = analysis.conflicts.filter((c) => c.severity === 'warning');
  if (warnings.length > 0) {
    lines.push('## Warning Conflicts (Can Proceed with Caution)', '');
    for (const conflict of warnings) {
      lines.push(`### ${conflict.id}: ${conflict.description}`);
      lines.push(`- **Type**: ${conflict.type}`);
      lines.push(`- **Files**: ${conflict.files.join(', ')}`);
      lines.push(`- **Bugs**: ${conflict.bugIds.join(', ')}`);
      lines.push(`- **Recommendation**: ${conflict.resolution.recommendation}`);
      if (conflict.resolution.fixOrder) {
        lines.push(
          `- **Suggested Order**: ${conflict.resolution.fixOrder.join(' → ')}`
        );
      }
      lines.push('');
    }
  }

  // Suggested fix order
  lines.push('## Suggested Fix Order', '');
  analysis.suggestedFixOrder.forEach((id, index) => {
    lines.push(`${index + 1}. ${id}`);
  });

  return lines.join('\n');
}
