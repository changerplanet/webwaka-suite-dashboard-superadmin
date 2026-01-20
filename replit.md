# WebWaka Super Admin Dashboard (Phase 4B)

## Overview
This is the Super Admin Dashboard for the WebWaka ecosystem - Phase 4B of the Modular Rebuild. It provides declarative dashboard definitions that consume Phase 4A's Dashboard Control Engine.

## Purpose
- Declarative dashboard definitions for Super Admin
- Control metadata (sections, groups, actions)
- Minimal validation UI for testing visibility resolution

## Project Architecture

### Directory Structure
```
src/
├── types/          # TypeScript type definitions
│   └── index.ts    # All interfaces (DashboardDeclaration, UserContext, etc.)
├── dashboards/     # Dashboard declarations (pure data)
│   ├── superadmin.dashboard.ts   # Main dashboard declaration
│   └── superadmin.sections.ts    # 9 section definitions with gating rules
├── engine/         # Resolution engine (Phase 4A consumption)
│   ├── index.ts    # Exports
│   └── resolver.ts # Dashboard resolution, snapshots, verification
├── ui/             # Minimal validation UI
│   └── server.tsx  # Express + React SSR server
├── tests/          # Test suite
│   └── resolver.test.ts  # Hard stop tests proving Phase 4A consumption
└── index.ts        # Main exports
```

### Dashboard Sections
The Super Admin dashboard includes 9 top-level sections:
1. Platform Governance
2. Partners & Tenants
3. Pricing & Plans
4. Incentives & Affiliates (feature-flag gated)
5. Feature Flags & Experiments
6. Branding / Whitelabel (feature-flag gated)
7. Infrastructure & Deployments
8. Audit & Compliance
9. AI / Automation (feature-flag gated)

### Gating System
Each section declares:
- Required permissions (e.g., `platform:governance:read`)
- Required entitlements (e.g., `superadmin-access`)
- Required feature flags (e.g., `ai-features-enabled`)
- Optional time bounds

**Important**: No roles are hardcoded. All visibility is determined by permissions, entitlements, and feature flags.

## Key Technologies
- TypeScript (strict mode)
- Node.js 20
- Express (minimal server)
- React (SSR for validation UI)
- Vitest (testing)

## Running the Project

### Development
```bash
npm run dev
```
Starts the validation UI on port 5000.

### Testing
```bash
npm test
```
Runs all 20 tests including hard stop tests proving:
- Section hidden due to missing permission
- Section hidden due to missing entitlement
- Section gated by feature flag
- Snapshot generation + verification
- Offline evaluation equivalence

### Build
```bash
npm run build
```
Compiles TypeScript to `dist/`.

## Phase 4A Integration
This project consumes Phase 4A's dashboard control patterns:
- `resolveDashboard()` - Resolves visibility for all sections
- `generateSnapshot()` - Creates offline-safe snapshots
- `verifySnapshot()` - Validates snapshot integrity
- `evaluateFromSnapshot()` - Offline evaluation

## API Endpoints
- `GET /` - Validation UI showing resolved dashboard
- `GET /api/dashboard` - JSON response with resolved dashboard data
- `GET /health` - Health check endpoint

## Recent Changes
- 2026-01-20: Initial Phase 4B implementation
  - Created declarative dashboard definitions
  - Implemented 9 Super Admin sections with gating rules
  - Added resolution engine consuming Phase 4A patterns
  - Built minimal validation UI
  - Added comprehensive test suite (20 tests)
