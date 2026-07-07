# CVMP - AI Development Instructions

## Project

Collateral Valuation Management Platform (CVMP)

A multi-tenant banking platform for managing:

* Facilities
* Collateral
* Valuation Requests
* Valuer Assignments
* Approvals
* Payments
* Reporting
* Administration

---

## Business Assumptions

Current assumptions:

* One Facility has one Collateral
* One Collateral has one Valuation Request
* One Valuation Request is assigned to one Valuer
* Approval chain is fixed

Current approval flow:

RM
→ CMU
→ CMU Head

---

## Technology Stack

* React 19
* TypeScript
* Vite
* Tailwind CSS v4
* Redux Toolkit
* RTK Query
* React Hook Form
* Zod
* TanStack Table

---

## Architecture Rules

Use feature-based architecture.

Features own:

* pages
* components
* hooks
* services
* schemas
* types

Shared contains:

* reusable UI
* utilities
* constants
* hooks
* API infrastructure

---

## State Management

Use RTK Query for server state.

Use Redux Toolkit only for:

* authentication
* user context
* permissions
* notifications
* UI preferences

Do not duplicate server state in Redux.

---

## Routing

Use React Router.

Use nested layouts.

Required layouts:

* AuthLayout
* MainLayout
* AdminLayout

Support lazy loading.

---

## Permissions

Use permission-based UI.

Never hardcode role checks.

Do NOT use:

if(user.role === "ADMIN")

Use:

PermissionGate

and permission constants.

---

## UI Principles

Enterprise banking application.

Prioritize:

* tables
* workflows
* approvals
* auditability
* reporting

Avoid marketing-style design.

Design for operational efficiency.

---

## Forms

Use:

React Hook Form
+
Zod

All forms must have validation schemas.

---

## Tables

Use TanStack Table.

Tables must support:

* sorting
* filtering
* pagination
* export readiness

---

## Development Workflow

Before generating code:

1. Analyze existing architecture.
2. Explain proposed changes.
3. Ask for approval.
4. Implement changes.

Never generate large unrelated features in one task.

Prefer small incremental changes.
