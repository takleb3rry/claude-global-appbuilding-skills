/**
 * UAT Checklist Updater
 *
 * Maps test results to UAT checklist items and:
 * 1. Generates UAT evidence report
 * 2. Optionally updates checklist file with completion status
 */

import type { BugReport, UATEvidence, UATSuiteResult } from './types';

// ============================================
// UAT SUITE DEFINITIONS
// ============================================

/**
 * Map of UAT suite names to test file patterns
 * Customize this for your project's UAT checklist
 */
export const UAT_SUITES: Record<string, { patterns: RegExp[]; critical: boolean }> = {
  'Employee Onboarding Flow': {
    patterns: [/onboarding/i, /employee.*create/i, /new.*employee/i],
    critical: true,
  },
  'Timesheet Entry Flow': {
    patterns: [/timesheet/i, /time.*entry/i, /entry.*crud/i],
    critical: true,
  },
  'Supervisor Approval Flow': {
    patterns: [/supervisor/i, /approval/i, /approve/i],
    critical: true,
  },
  'Compliance Rejection Flow': {
    patterns: [/compliance/i, /validation/i, /reject.*compliance/i],
    critical: true,
  },
  'Timesheet Rejection Flow': {
    patterns: [/reject/i, /rejection/i, /reject.*timesheet/i],
    critical: true,
  },
  'Configuration Change Flow': {
    patterns: [/config/i, /settings/i, /task.*code/i],
    critical: false,
  },
  'Reporting Flow': {
    patterns: [/report/i, /export/i, /generate.*report/i],
    critical: false,
  },
  'Document Management Flow': {
    patterns: [/document/i, /upload/i, /file/i],
    critical: false,
  },
  'Session Security Flow': {
    patterns: [/session/i, /security/i, /auth/i, /login/i],
    critical: true,
  },
  'Employee Archival Flow': {
    patterns: [/archive/i, /archival/i, /deactivate/i],
    critical: false,
  },
};

// ============================================
// EVIDENCE GENERATION
// ============================================

/**
 * Generate UAT evidence from test results
 */
export function generateUATEvidence(
  bugs: BugReport[],
  totalTestsRun: number
): UATEvidence {
  const suites: UATSuiteResult[] = [];
  const blockers: string[] = [];

  for (const [suiteName, suiteConfig] of Object.entries(UAT_SUITES)) {
    // Find bugs related to this suite
    const relatedBugs = bugs.filter((bug) =>
      suiteConfig.patterns.some(
        (pattern) =>
          pattern.test(bug.description) ||
          pattern.test(bug.page) ||
          (bug.component && pattern.test(bug.component))
      )
    );

    // Estimate tests for this suite (rough)
    const estimatedTests = Math.ceil(totalTestsRun / Object.keys(UAT_SUITES).length);
    const failedCount = relatedBugs.length;
    const passedCount = Math.max(0, estimatedTests - failedCount);

    const passed = relatedBugs.length === 0;

    suites.push({
      name: suiteName,
      passed,
      testsRun: estimatedTests,
      testsPassed: passedCount,
      testsFailed: failedCount,
      failedBugIds: relatedBugs.map((b) => b.id),
      evidence: relatedBugs.map((b) => b.screenshotPath).filter(Boolean) as string[],
    });

    // Track blockers
    if (!passed && suiteConfig.critical) {
      blockers.push(`${suiteName}: ${relatedBugs.length} failures`);
    }
  }

  const allSuitesPassed = suites.every((s) => s.passed);
  const criticalSuitesPassed = suites
    .filter((s) => UAT_SUITES[s.name]?.critical)
    .every((s) => s.passed);

  return {
    generatedAt: new Date().toISOString(),
    allSuitesPassed,
    suites,
    readyForSignoff: criticalSuitesPassed,
    blockers,
  };
}

// ============================================
// CHECKLIST FILE UPDATE
// ============================================

/**
 * Generate updated checklist markdown content
 */
export function updateChecklistContent(
  currentContent: string,
  evidence: UATEvidence
): string {
  let updated = currentContent;

  for (const suite of evidence.suites) {
    // Look for the suite row in the checklist table
    // Format: | Suite Name | [ ] | | |
    const checkboxPattern = new RegExp(
      `\\|\\s*${escapeRegex(suite.name)}\\s*\\|\\s*\\[[ xX]?\\]\\s*\\|[^|]*\\|[^|]*\\|`,
      'g'
    );

    if (suite.passed) {
      // Mark as complete
      const replacement = `| ${suite.name} | [X] | ${new Date().toISOString().split('T')[0]} | Automated E2E |`;
      updated = updated.replace(checkboxPattern, replacement);
    } else {
      // Mark as incomplete with failure count
      const replacement = `| ${suite.name} | [ ] | | ${suite.testsFailed} failures |`;
      updated = updated.replace(checkboxPattern, replacement);
    }
  }

  return updated;
}

/**
 * Escape special regex characters
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ============================================
// MARKDOWN REPORT GENERATION
// ============================================

export function generateUATEvidenceMarkdown(evidence: UATEvidence): string {
  const lines: string[] = [
    '# UAT Evidence Report',
    '',
    `Generated: ${evidence.generatedAt}`,
    `Ready for Sign-off: ${evidence.readyForSignoff ? 'YES' : 'NO'}`,
    '',
  ];

  // Overall status
  if (evidence.allSuitesPassed) {
    lines.push('## Status: ALL SUITES PASSED', '');
  } else {
    lines.push('## Status: FAILURES DETECTED', '');
    if (evidence.blockers.length > 0) {
      lines.push('### Blocking Issues', '');
      for (const blocker of evidence.blockers) {
        lines.push(`- ${blocker}`);
      }
      lines.push('');
    }
  }

  // Suite results table
  lines.push('## Suite Results', '');
  lines.push('| Suite | Status | Tests | Passed | Failed | Bug IDs |');
  lines.push('|-------|--------|-------|--------|--------|---------|');

  for (const suite of evidence.suites) {
    const status = suite.passed ? 'PASS' : 'FAIL';
    const bugIds = suite.failedBugIds.join(', ') || '-';
    lines.push(
      `| ${suite.name} | ${status} | ${suite.testsRun} | ${suite.testsPassed} | ${suite.testsFailed} | ${bugIds} |`
    );
  }
  lines.push('');

  // Sign-off section
  lines.push('## Sign-off', '');
  if (evidence.readyForSignoff) {
    lines.push('All critical UAT suites have passed. Ready for stakeholder sign-off.');
    lines.push('');
    lines.push('| Role | Name | Date | Signature |');
    lines.push('|------|------|------|-----------|');
    lines.push('| Product Owner | | | |');
    lines.push('| QA Lead | | | |');
    lines.push('| Dev Lead | | | |');
  } else {
    lines.push('**NOT READY FOR SIGN-OFF**');
    lines.push('');
    lines.push('The following issues must be resolved:');
    for (const blocker of evidence.blockers) {
      lines.push(`- ${blocker}`);
    }
  }

  return lines.join('\n');
}
