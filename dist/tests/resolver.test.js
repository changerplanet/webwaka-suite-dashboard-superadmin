"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const resolver_js_1 = require("../engine/resolver.js");
const superadmin_dashboard_js_1 = require("../dashboards/superadmin.dashboard.js");
(0, vitest_1.describe)('Dashboard Resolution Engine - Phase 4A Consumption', () => {
    let fullAccessContext;
    let limitedContext;
    let noAccessContext;
    (0, vitest_1.beforeEach)(() => {
        fullAccessContext = {
            userId: 'superadmin-001',
            tenantId: 'platform',
            permissions: [
                'platform:governance:read',
                'platform:settings:manage',
                'platform:config:read',
                'platform:config:write',
                'platform:policies:read',
                'platform:policies:manage',
                'partners:read',
                'tenants:read',
                'partners:manage',
                'partners:list',
                'partners:create',
                'tenants:manage',
                'tenants:list',
                'tenants:create',
                'pricing:read',
                'pricing:plans:manage',
                'pricing:plans:read',
                'pricing:plans:write',
                'incentives:read',
                'affiliates:manage',
                'affiliates:read',
                'affiliates:commissions:write',
                'feature-flags:read',
                'feature-flags:manage',
                'feature-flags:list',
                'feature-flags:write',
                'experiments:manage',
                'experiments:read',
                'branding:read',
                'branding:themes:manage',
                'branding:themes:read',
                'branding:themes:write',
                'infrastructure:read',
                'deployments:manage',
                'deployments:read',
                'deployments:trigger',
                'infrastructure:monitoring:read',
                'infrastructure:metrics:read',
                'audit:read',
                'audit:logs:read',
                'audit:logs:export',
                'compliance:reports:read',
                'compliance:reports:generate',
                'ai:read',
                'ai:models:manage',
                'ai:models:read',
                'ai:models:configure',
                'automation:rules:manage',
                'automation:rules:read',
            ],
            entitlements: [
                'superadmin-access',
                'pricing-management',
                'incentives-management',
                'whitelabel-access',
                'infrastructure-access',
                'audit-access',
                'ai-access',
                'ai-models-access',
                'experiments-access',
            ],
            featureFlags: {
                'incentives-enabled': true,
                'whitelabel-enabled': true,
                'ai-features-enabled': true,
                'automation-enabled': true,
                'experiments-enabled': true,
            },
            timestamp: new Date(),
        };
        limitedContext = {
            userId: 'limited-admin-001',
            tenantId: 'platform',
            permissions: [
                'platform:governance:read',
                'platform:settings:manage',
                'feature-flags:read',
                'feature-flags:manage',
                'audit:read',
                'audit:logs:read',
            ],
            entitlements: [
                'superadmin-access',
                'audit-access',
            ],
            featureFlags: {
                'incentives-enabled': false,
                'whitelabel-enabled': false,
                'ai-features-enabled': false,
            },
            timestamp: new Date(),
        };
        noAccessContext = {
            userId: 'no-access-user',
            tenantId: 'platform',
            permissions: [],
            entitlements: [],
            featureFlags: {},
            timestamp: new Date(),
        };
    });
    (0, vitest_1.describe)('Dashboard Resolution', () => {
        (0, vitest_1.it)('should resolve dashboard with full access context', () => {
            const resolved = (0, resolver_js_1.resolveDashboard)(superadmin_dashboard_js_1.superAdminDashboard, fullAccessContext);
            (0, vitest_1.expect)(resolved).toBeDefined();
            (0, vitest_1.expect)(resolved.dashboardId).toBe('superadmin-dashboard');
            (0, vitest_1.expect)(resolved.userId).toBe('superadmin-001');
            (0, vitest_1.expect)(resolved.sections).toHaveLength(9);
            (0, vitest_1.expect)(resolved.snapshotHash).toBeTruthy();
        });
        (0, vitest_1.it)('should produce deterministic output for same input', () => {
            const context = { ...fullAccessContext, timestamp: new Date('2026-01-20T12:00:00Z') };
            const resolved1 = (0, resolver_js_1.resolveDashboard)(superadmin_dashboard_js_1.superAdminDashboard, context);
            const resolved2 = (0, resolver_js_1.resolveDashboard)(superadmin_dashboard_js_1.superAdminDashboard, context);
            (0, vitest_1.expect)(resolved1.sections.map(s => s.id)).toEqual(resolved2.sections.map(s => s.id));
            (0, vitest_1.expect)(resolved1.sections.map(s => s.visible)).toEqual(resolved2.sections.map(s => s.visible));
        });
        (0, vitest_1.it)('should show all sections for fully entitled user', () => {
            const resolved = (0, resolver_js_1.resolveDashboard)(superadmin_dashboard_js_1.superAdminDashboard, fullAccessContext);
            const visibleSections = (0, resolver_js_1.getVisibleSections)(resolved);
            (0, vitest_1.expect)(visibleSections.length).toBe(9);
            (0, vitest_1.expect)(visibleSections.map(s => s.id)).toContain('platform-governance');
            (0, vitest_1.expect)(visibleSections.map(s => s.id)).toContain('ai-automation');
        });
    });
    (0, vitest_1.describe)('Hard Stop Tests - Gating Verification', () => {
        (0, vitest_1.it)('should hide section due to missing PERMISSION', () => {
            const contextMissingPermission = {
                ...fullAccessContext,
                permissions: fullAccessContext.permissions.filter(p => p !== 'partners:read' && p !== 'tenants:read'),
            };
            const resolved = (0, resolver_js_1.resolveDashboard)(superadmin_dashboard_js_1.superAdminDashboard, contextMissingPermission);
            const partnersSection = resolved.sections.find(s => s.id === 'partners-tenants');
            (0, vitest_1.expect)(partnersSection).toBeDefined();
            (0, vitest_1.expect)(partnersSection.visible).toBe(false);
            (0, vitest_1.expect)(partnersSection.hiddenReason).toBeDefined();
            (0, vitest_1.expect)(partnersSection.hiddenReason.type).toBe('permission');
            (0, vitest_1.expect)(partnersSection.hiddenReason.missing).toContain('partners:read');
        });
        (0, vitest_1.it)('should hide section due to missing ENTITLEMENT', () => {
            const contextMissingEntitlement = {
                ...fullAccessContext,
                entitlements: fullAccessContext.entitlements.filter(e => e !== 'pricing-management'),
            };
            const resolved = (0, resolver_js_1.resolveDashboard)(superadmin_dashboard_js_1.superAdminDashboard, contextMissingEntitlement);
            const pricingSection = resolved.sections.find(s => s.id === 'pricing-plans');
            (0, vitest_1.expect)(pricingSection).toBeDefined();
            (0, vitest_1.expect)(pricingSection.visible).toBe(false);
            (0, vitest_1.expect)(pricingSection.hiddenReason).toBeDefined();
            (0, vitest_1.expect)(pricingSection.hiddenReason.type).toBe('entitlement');
            (0, vitest_1.expect)(pricingSection.hiddenReason.missing).toContain('pricing-management');
        });
        (0, vitest_1.it)('should hide section due to disabled FEATURE FLAG', () => {
            const contextMissingFlag = {
                ...fullAccessContext,
                featureFlags: {
                    ...fullAccessContext.featureFlags,
                    'ai-features-enabled': false,
                },
            };
            const resolved = (0, resolver_js_1.resolveDashboard)(superadmin_dashboard_js_1.superAdminDashboard, contextMissingFlag);
            const aiSection = resolved.sections.find(s => s.id === 'ai-automation');
            (0, vitest_1.expect)(aiSection).toBeDefined();
            (0, vitest_1.expect)(aiSection.visible).toBe(false);
            (0, vitest_1.expect)(aiSection.hiddenReason).toBeDefined();
            (0, vitest_1.expect)(aiSection.hiddenReason.type).toBe('feature_flag');
            (0, vitest_1.expect)(aiSection.hiddenReason.missing).toContain('ai-features-enabled');
        });
        (0, vitest_1.it)('should hide incentives section when incentives-enabled flag is false', () => {
            const resolved = (0, resolver_js_1.resolveDashboard)(superadmin_dashboard_js_1.superAdminDashboard, limitedContext);
            const incentivesSection = resolved.sections.find(s => s.id === 'incentives-affiliates');
            (0, vitest_1.expect)(incentivesSection).toBeDefined();
            (0, vitest_1.expect)(incentivesSection.visible).toBe(false);
            (0, vitest_1.expect)(incentivesSection.hiddenReason.type).toBe('permission');
        });
    });
    (0, vitest_1.describe)('Snapshot Generation and Verification', () => {
        let resolved;
        let snapshot;
        (0, vitest_1.beforeEach)(() => {
            resolved = (0, resolver_js_1.resolveDashboard)(superadmin_dashboard_js_1.superAdminDashboard, fullAccessContext);
            snapshot = (0, resolver_js_1.generateSnapshot)(resolved, 24);
        });
        (0, vitest_1.it)('should generate valid snapshot with all required fields', () => {
            (0, vitest_1.expect)(snapshot.id).toBeTruthy();
            (0, vitest_1.expect)(snapshot.dashboardId).toBe('superadmin-dashboard');
            (0, vitest_1.expect)(snapshot.userId).toBe('superadmin-001');
            (0, vitest_1.expect)(snapshot.generatedAt).toBeInstanceOf(Date);
            (0, vitest_1.expect)(snapshot.expiresAt).toBeInstanceOf(Date);
            (0, vitest_1.expect)(snapshot.hash).toBeTruthy();
            (0, vitest_1.expect)(snapshot.signature).toBeTruthy();
            (0, vitest_1.expect)(snapshot.data).toEqual(resolved);
        });
        (0, vitest_1.it)('should verify valid snapshot successfully', () => {
            const verification = (0, resolver_js_1.verifySnapshot)(snapshot);
            (0, vitest_1.expect)(verification.valid).toBe(true);
            (0, vitest_1.expect)(verification.expired).toBe(false);
            (0, vitest_1.expect)(verification.hashMatch).toBe(true);
        });
        (0, vitest_1.it)('should detect expired snapshot', () => {
            const expiredSnapshot = {
                ...snapshot,
                expiresAt: new Date(Date.now() - 1000),
            };
            const verification = (0, resolver_js_1.verifySnapshot)(expiredSnapshot);
            (0, vitest_1.expect)(verification.expired).toBe(true);
            (0, vitest_1.expect)(verification.valid).toBe(false);
        });
        (0, vitest_1.it)('should detect tampered snapshot (hash mismatch)', () => {
            const tamperedSnapshot = {
                ...snapshot,
                hash: 'tampered-hash-value',
            };
            const verification = (0, resolver_js_1.verifySnapshot)(tamperedSnapshot);
            (0, vitest_1.expect)(verification.hashMatch).toBe(false);
            (0, vitest_1.expect)(verification.valid).toBe(false);
        });
    });
    (0, vitest_1.describe)('Offline Evaluation from Snapshot', () => {
        (0, vitest_1.it)('should evaluate dashboard from valid snapshot (offline-safe)', () => {
            const resolved = (0, resolver_js_1.resolveDashboard)(superadmin_dashboard_js_1.superAdminDashboard, fullAccessContext);
            const snapshot = (0, resolver_js_1.generateSnapshot)(resolved, 24);
            const offlineResolved = (0, resolver_js_1.evaluateFromSnapshot)(snapshot);
            (0, vitest_1.expect)(offlineResolved).not.toBeNull();
            (0, vitest_1.expect)(offlineResolved.dashboardId).toBe(resolved.dashboardId);
            (0, vitest_1.expect)(offlineResolved.sections.length).toBe(resolved.sections.length);
        });
        (0, vitest_1.it)('should produce equivalent results online and from snapshot', () => {
            const resolved = (0, resolver_js_1.resolveDashboard)(superadmin_dashboard_js_1.superAdminDashboard, fullAccessContext);
            const snapshot = (0, resolver_js_1.generateSnapshot)(resolved, 24);
            const offlineResolved = (0, resolver_js_1.evaluateFromSnapshot)(snapshot);
            (0, vitest_1.expect)(offlineResolved).not.toBeNull();
            const onlineVisible = (0, resolver_js_1.getVisibleSections)(resolved);
            const offlineVisible = (0, resolver_js_1.getVisibleSections)(offlineResolved);
            (0, vitest_1.expect)(offlineVisible.map(s => s.id)).toEqual(onlineVisible.map(s => s.id));
            (0, vitest_1.expect)(offlineVisible.map(s => s.visible)).toEqual(onlineVisible.map(s => s.visible));
        });
        (0, vitest_1.it)('should return null for invalid/expired snapshot', () => {
            const resolved = (0, resolver_js_1.resolveDashboard)(superadmin_dashboard_js_1.superAdminDashboard, fullAccessContext);
            const snapshot = (0, resolver_js_1.generateSnapshot)(resolved, 24);
            const expiredSnapshot = {
                ...snapshot,
                expiresAt: new Date(Date.now() - 1000),
            };
            const result = (0, resolver_js_1.evaluateFromSnapshot)(expiredSnapshot);
            (0, vitest_1.expect)(result).toBeNull();
        });
    });
    (0, vitest_1.describe)('Hidden Sections with Reasons', () => {
        (0, vitest_1.it)('should list all hidden sections with their reasons', () => {
            const resolved = (0, resolver_js_1.resolveDashboard)(superadmin_dashboard_js_1.superAdminDashboard, noAccessContext);
            const hiddenWithReasons = (0, resolver_js_1.getHiddenSectionsWithReasons)(resolved);
            (0, vitest_1.expect)(hiddenWithReasons.length).toBeGreaterThan(0);
            hiddenWithReasons.forEach(({ section, reason }) => {
                (0, vitest_1.expect)(section.visible).toBe(false);
                (0, vitest_1.expect)(reason).toBeDefined();
                (0, vitest_1.expect)(['permission', 'entitlement', 'feature_flag', 'time_bounds']).toContain(reason.type);
                (0, vitest_1.expect)(reason.missing.length).toBeGreaterThan(0);
                (0, vitest_1.expect)(reason.message).toBeTruthy();
            });
        });
        (0, vitest_1.it)('should explain why each section is hidden', () => {
            const resolved = (0, resolver_js_1.resolveDashboard)(superadmin_dashboard_js_1.superAdminDashboard, limitedContext);
            const hiddenWithReasons = (0, resolver_js_1.getHiddenSectionsWithReasons)(resolved);
            const pricingHidden = hiddenWithReasons.find(h => h.section.id === 'pricing-plans');
            (0, vitest_1.expect)(pricingHidden).toBeDefined();
            (0, vitest_1.expect)(pricingHidden.reason.message).toContain('Missing');
        });
    });
});
(0, vitest_1.describe)('Phase 4A Engine Contract Compliance', () => {
    (0, vitest_1.it)('declarations are pure data (no functions)', () => {
        const declaration = superadmin_dashboard_js_1.superAdminDashboard;
        const serialized = JSON.stringify(declaration);
        const deserialized = JSON.parse(serialized);
        (0, vitest_1.expect)(deserialized.id).toBe(declaration.id);
        (0, vitest_1.expect)(deserialized.sections.length).toBe(declaration.sections.length);
    });
    (0, vitest_1.it)('declarations are deterministic (same input = same output)', () => {
        const json1 = JSON.stringify(superadmin_dashboard_js_1.superAdminDashboard);
        const json2 = JSON.stringify(superadmin_dashboard_js_1.superAdminDashboard);
        (0, vitest_1.expect)(json1).toBe(json2);
    });
    (0, vitest_1.it)('declarations are serializable', () => {
        (0, vitest_1.expect)(() => JSON.stringify(superadmin_dashboard_js_1.superAdminDashboard)).not.toThrow();
    });
    (0, vitest_1.it)('resolution produces explainable output', () => {
        const context = {
            userId: 'test-user',
            permissions: ['platform:governance:read'],
            entitlements: ['superadmin-access'],
            featureFlags: {},
            timestamp: new Date(),
        };
        const resolved = (0, resolver_js_1.resolveDashboard)(superadmin_dashboard_js_1.superAdminDashboard, context);
        resolved.sections.forEach(section => {
            if (!section.visible) {
                (0, vitest_1.expect)(section.hiddenReason).toBeDefined();
                (0, vitest_1.expect)(section.hiddenReason.message).toBeTruthy();
            }
        });
    });
});
//# sourceMappingURL=resolver.test.js.map