# User Acceptance Testing (UAT) Checklist

## Overview

This checklist tracks completion of user acceptance testing for all critical workflows.

**Project**: [Project Name]
**Environment**: [Local / Staging / Production]
**Test Date**: [YYYY-MM-DD]

---

## UAT Suites

| Suite | Status | Date | Tester | Notes |
|-------|--------|------|--------|-------|
| Employee Onboarding Flow | [ ] | | | |
| Timesheet Entry Flow | [ ] | | | |
| Supervisor Approval Flow | [ ] | | | |
| Compliance Rejection Flow | [ ] | | | |
| Timesheet Rejection Flow | [ ] | | | |
| Configuration Change Flow | [ ] | | | |
| Reporting Flow | [ ] | | | |
| Document Management Flow | [ ] | | | |
| Session Security Flow | [ ] | | | |
| Employee Archival Flow | [ ] | | | |

---

## Suite Details

### Employee Onboarding Flow
**Critical**: Yes

| Test Case | Pass | Fail | N/A |
|-----------|------|------|-----|
| Create new employee with valid data | [ ] | [ ] | [ ] |
| Set birth date and verify age calculation | [ ] | [ ] | [ ] |
| Assign supervisor | [ ] | [ ] | [ ] |
| Upload required documents | [ ] | [ ] | [ ] |
| Employee receives welcome email | [ ] | [ ] | [ ] |
| Employee can log in | [ ] | [ ] | [ ] |

### Timesheet Entry Flow
**Critical**: Yes

| Test Case | Pass | Fail | N/A |
|-----------|------|------|-----|
| Add time entry with valid data | [ ] | [ ] | [ ] |
| Edit existing time entry | [ ] | [ ] | [ ] |
| Delete time entry | [ ] | [ ] | [ ] |
| Calculate total hours correctly | [ ] | [ ] | [ ] |
| Navigate between weeks | [ ] | [ ] | [ ] |
| Save draft timesheet | [ ] | [ ] | [ ] |
| Submit timesheet for approval | [ ] | [ ] | [ ] |

### Supervisor Approval Flow
**Critical**: Yes

| Test Case | Pass | Fail | N/A |
|-----------|------|------|-----|
| View pending timesheets queue | [ ] | [ ] | [ ] |
| Review timesheet details | [ ] | [ ] | [ ] |
| Approve timesheet | [ ] | [ ] | [ ] |
| Add approval notes | [ ] | [ ] | [ ] |
| Verify status change | [ ] | [ ] | [ ] |
| Employee notified of approval | [ ] | [ ] | [ ] |

### Compliance Rejection Flow
**Critical**: Yes

| Test Case | Pass | Fail | N/A |
|-----------|------|------|-----|
| Exceed daily hour limit | [ ] | [ ] | [ ] |
| See compliance error message | [ ] | [ ] | [ ] |
| Submit blocked when invalid | [ ] | [ ] | [ ] |
| School day rules enforced (minors) | [ ] | [ ] | [ ] |
| Restricted hours enforced (minors) | [ ] | [ ] | [ ] |

### Timesheet Rejection Flow
**Critical**: Yes

| Test Case | Pass | Fail | N/A |
|-----------|------|------|-----|
| Supervisor can reject timesheet | [ ] | [ ] | [ ] |
| Rejection reason required | [ ] | [ ] | [ ] |
| Employee sees rejection notice | [ ] | [ ] | [ ] |
| Employee can edit and resubmit | [ ] | [ ] | [ ] |
| Resubmission appears in queue | [ ] | [ ] | [ ] |

### Configuration Change Flow
**Critical**: No

| Test Case | Pass | Fail | N/A |
|-----------|------|------|-----|
| View existing task codes | [ ] | [ ] | [ ] |
| Add new task code | [ ] | [ ] | [ ] |
| Edit task code | [ ] | [ ] | [ ] |
| Deactivate task code | [ ] | [ ] | [ ] |
| Preview impact of changes | [ ] | [ ] | [ ] |

### Reporting Flow
**Critical**: No

| Test Case | Pass | Fail | N/A |
|-----------|------|------|-----|
| Generate employee report | [ ] | [ ] | [ ] |
| Filter by date range | [ ] | [ ] | [ ] |
| Filter by employee | [ ] | [ ] | [ ] |
| Export to CSV/PDF | [ ] | [ ] | [ ] |
| Print report | [ ] | [ ] | [ ] |

### Document Management Flow
**Critical**: No

| Test Case | Pass | Fail | N/A |
|-----------|------|------|-----|
| Upload document | [ ] | [ ] | [ ] |
| View document list | [ ] | [ ] | [ ] |
| Download document | [ ] | [ ] | [ ] |
| Delete document | [ ] | [ ] | [ ] |
| See status badges | [ ] | [ ] | [ ] |

### Session Security Flow
**Critical**: Yes

| Test Case | Pass | Fail | N/A |
|-----------|------|------|-----|
| Login with valid credentials | [ ] | [ ] | [ ] |
| Login rejected with invalid credentials | [ ] | [ ] | [ ] |
| Session timeout works | [ ] | [ ] | [ ] |
| Redirect to login when expired | [ ] | [ ] | [ ] |
| Protected routes require auth | [ ] | [ ] | [ ] |
| Role-based access enforced | [ ] | [ ] | [ ] |

### Employee Archival Flow
**Critical**: No

| Test Case | Pass | Fail | N/A |
|-----------|------|------|-----|
| Archive employee | [ ] | [ ] | [ ] |
| Archived employee cannot login | [ ] | [ ] | [ ] |
| Historical data preserved | [ ] | [ ] | [ ] |
| Reactivate employee | [ ] | [ ] | [ ] |
| Reactivated employee can login | [ ] | [ ] | [ ] |

---

## Sign-off

### Prerequisites
- [ ] All critical suites passed
- [ ] No blocking bugs
- [ ] Performance acceptable
- [ ] Accessibility audit passed

### Approval

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Product Owner | | | |
| QA Lead | | | |
| Dev Lead | | | |
| Stakeholder | | | |

### Notes

[Add any additional notes, conditions, or caveats here]
