import { describe, it, expect, beforeEach } from 'vitest';
import {
  resolveDashboard,
  generateSnapshot,
  verifySnapshot,
  evaluateFromSnapshot,
  getVisibleSections,
  getHiddenSectionsWithReasons,
} from '../engine/resolver.js';
import { superAdminDashboard } from '../dashboards/superadmin.dashboard.js';
import type { UserContext, ResolvedDashboard, DashboardSnapshot } from '../types/index.js';

describe('Dashboard Resolution Engine - Phase 4A Consumption', () => {
  let fullAccessContext: UserContext;
  let limitedContext: UserContext;
  let noAccessContext: UserContext;

  beforeEach(() => {
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

  describe('Dashboard Resolution', () => {
    it('should resolve dashboard with full access context', () => {
      const resolved = resolveDashboard(superAdminDashboard, fullAccessContext);

      expect(resolved).toBeDefined();
      expect(resolved.dashboardId).toBe('superadmin-dashboard');
      expect(resolved.userId).toBe('superadmin-001');
      expect(resolved.sections).toHaveLength(9);
      expect(resolved.snapshotHash).toBeTruthy();
    });

    it('should produce deterministic output for same input', () => {
      const context = { ...fullAccessContext, timestamp: new Date('2026-01-20T12:00:00Z') };
      
      const resolved1 = resolveDashboard(superAdminDashboard, context);
      const resolved2 = resolveDashboard(superAdminDashboard, context);

      expect(resolved1.sections.map(s => s.id)).toEqual(resolved2.sections.map(s => s.id));
      expect(resolved1.sections.map(s => s.visible)).toEqual(resolved2.sections.map(s => s.visible));
    });

    it('should show all sections for fully entitled user', () => {
      const resolved = resolveDashboard(superAdminDashboard, fullAccessContext);
      const visibleSections = getVisibleSections(resolved);

      expect(visibleSections.length).toBe(9);
      expect(visibleSections.map(s => s.id)).toContain('platform-governance');
      expect(visibleSections.map(s => s.id)).toContain('ai-automation');
    });
  });

  describe('Hard Stop Tests - Gating Verification', () => {
    it('should hide section due to missing PERMISSION', () => {
      const contextMissingPermission: UserContext = {
        ...fullAccessContext,
        permissions: fullAccessContext.permissions.filter(
          p => p !== 'partners:read' && p !== 'tenants:read'
        ),
      };

      const resolved = resolveDashboard(superAdminDashboard, contextMissingPermission);
      const partnersSection = resolved.sections.find(s => s.id === 'partners-tenants');

      expect(partnersSection).toBeDefined();
      expect(partnersSection!.visible).toBe(false);
      expect(partnersSection!.hiddenReason).toBeDefined();
      expect(partnersSection!.hiddenReason!.type).toBe('permission');
      expect(partnersSection!.hiddenReason!.missing).toContain('partners:read');
    });

    it('should hide section due to missing ENTITLEMENT', () => {
      const contextMissingEntitlement: UserContext = {
        ...fullAccessContext,
        entitlements: fullAccessContext.entitlements.filter(
          e => e !== 'pricing-management'
        ),
      };

      const resolved = resolveDashboard(superAdminDashboard, contextMissingEntitlement);
      const pricingSection = resolved.sections.find(s => s.id === 'pricing-plans');

      expect(pricingSection).toBeDefined();
      expect(pricingSection!.visible).toBe(false);
      expect(pricingSection!.hiddenReason).toBeDefined();
      expect(pricingSection!.hiddenReason!.type).toBe('entitlement');
      expect(pricingSection!.hiddenReason!.missing).toContain('pricing-management');
    });

    it('should hide section due to disabled FEATURE FLAG', () => {
      const contextMissingFlag: UserContext = {
        ...fullAccessContext,
        featureFlags: {
          ...fullAccessContext.featureFlags,
          'ai-features-enabled': false,
        },
      };

      const resolved = resolveDashboard(superAdminDashboard, contextMissingFlag);
      const aiSection = resolved.sections.find(s => s.id === 'ai-automation');

      expect(aiSection).toBeDefined();
      expect(aiSection!.visible).toBe(false);
      expect(aiSection!.hiddenReason).toBeDefined();
      expect(aiSection!.hiddenReason!.type).toBe('feature_flag');
      expect(aiSection!.hiddenReason!.missing).toContain('ai-features-enabled');
    });

    it('should hide incentives section when incentives-enabled flag is false', () => {
      const resolved = resolveDashboard(superAdminDashboard, limitedContext);
      const incentivesSection = resolved.sections.find(s => s.id === 'incentives-affiliates');

      expect(incentivesSection).toBeDefined();
      expect(incentivesSection!.visible).toBe(false);
      expect(incentivesSection!.hiddenReason!.type).toBe('permission');
    });
  });

  describe('Snapshot Generation and Verification', () => {
    let resolved: ResolvedDashboard;
    let snapshot: DashboardSnapshot;

    beforeEach(() => {
      resolved = resolveDashboard(superAdminDashboard, fullAccessContext);
      snapshot = generateSnapshot(resolved, 24);
    });

    it('should generate valid snapshot with all required fields', () => {
      expect(snapshot.id).toBeTruthy();
      expect(snapshot.dashboardId).toBe('superadmin-dashboard');
      expect(snapshot.userId).toBe('superadmin-001');
      expect(snapshot.generatedAt).toBeInstanceOf(Date);
      expect(snapshot.expiresAt).toBeInstanceOf(Date);
      expect(snapshot.hash).toBeTruthy();
      expect(snapshot.signature).toBeTruthy();
      expect(snapshot.data).toEqual(resolved);
    });

    it('should verify valid snapshot successfully', () => {
      const verification = verifySnapshot(snapshot);

      expect(verification.valid).toBe(true);
      expect(verification.expired).toBe(false);
      expect(verification.hashMatch).toBe(true);
    });

    it('should detect expired snapshot', () => {
      const expiredSnapshot: DashboardSnapshot = {
        ...snapshot,
        expiresAt: new Date(Date.now() - 1000),
      };

      const verification = verifySnapshot(expiredSnapshot);

      expect(verification.expired).toBe(true);
      expect(verification.valid).toBe(false);
    });

    it('should detect tampered snapshot (hash mismatch)', () => {
      const tamperedSnapshot: DashboardSnapshot = {
        ...snapshot,
        hash: 'tampered-hash-value',
      };

      const verification = verifySnapshot(tamperedSnapshot);

      expect(verification.hashMatch).toBe(false);
      expect(verification.valid).toBe(false);
    });
  });

  describe('Offline Evaluation from Snapshot', () => {
    it('should evaluate dashboard from valid snapshot (offline-safe)', () => {
      const resolved = resolveDashboard(superAdminDashboard, fullAccessContext);
      const snapshot = generateSnapshot(resolved, 24);

      const offlineResolved = evaluateFromSnapshot(snapshot);

      expect(offlineResolved).not.toBeNull();
      expect(offlineResolved!.dashboardId).toBe(resolved.dashboardId);
      expect(offlineResolved!.sections.length).toBe(resolved.sections.length);
    });

    it('should produce equivalent results online and from snapshot', () => {
      const resolved = resolveDashboard(superAdminDashboard, fullAccessContext);
      const snapshot = generateSnapshot(resolved, 24);
      const offlineResolved = evaluateFromSnapshot(snapshot);

      expect(offlineResolved).not.toBeNull();
      
      const onlineVisible = getVisibleSections(resolved);
      const offlineVisible = getVisibleSections(offlineResolved!);

      expect(offlineVisible.map(s => s.id)).toEqual(onlineVisible.map(s => s.id));
      expect(offlineVisible.map(s => s.visible)).toEqual(onlineVisible.map(s => s.visible));
    });

    it('should return null for invalid/expired snapshot', () => {
      const resolved = resolveDashboard(superAdminDashboard, fullAccessContext);
      const snapshot = generateSnapshot(resolved, 24);
      const expiredSnapshot: DashboardSnapshot = {
        ...snapshot,
        expiresAt: new Date(Date.now() - 1000),
      };

      const result = evaluateFromSnapshot(expiredSnapshot);

      expect(result).toBeNull();
    });
  });

  describe('Hidden Sections with Reasons', () => {
    it('should list all hidden sections with their reasons', () => {
      const resolved = resolveDashboard(superAdminDashboard, noAccessContext);
      const hiddenWithReasons = getHiddenSectionsWithReasons(resolved);

      expect(hiddenWithReasons.length).toBeGreaterThan(0);
      
      hiddenWithReasons.forEach(({ section, reason }) => {
        expect(section.visible).toBe(false);
        expect(reason).toBeDefined();
        expect(['permission', 'entitlement', 'feature_flag', 'time_bounds']).toContain(reason.type);
        expect(reason.missing.length).toBeGreaterThan(0);
        expect(reason.message).toBeTruthy();
      });
    });

    it('should explain why each section is hidden', () => {
      const resolved = resolveDashboard(superAdminDashboard, limitedContext);
      const hiddenWithReasons = getHiddenSectionsWithReasons(resolved);

      const pricingHidden = hiddenWithReasons.find(h => h.section.id === 'pricing-plans');
      expect(pricingHidden).toBeDefined();
      expect(pricingHidden!.reason.message).toContain('Missing');
    });
  });
});

describe('Phase 4A Engine Contract Compliance', () => {
  it('declarations are pure data (no functions)', () => {
    const declaration = superAdminDashboard;

    const serialized = JSON.stringify(declaration);
    const deserialized = JSON.parse(serialized);

    expect(deserialized.id).toBe(declaration.id);
    expect(deserialized.sections.length).toBe(declaration.sections.length);
  });

  it('declarations are deterministic (same input = same output)', () => {
    const json1 = JSON.stringify(superAdminDashboard);
    const json2 = JSON.stringify(superAdminDashboard);

    expect(json1).toBe(json2);
  });

  it('declarations are serializable', () => {
    expect(() => JSON.stringify(superAdminDashboard)).not.toThrow();
  });

  it('resolution produces explainable output', () => {
    const context: UserContext = {
      userId: 'test-user',
      permissions: ['platform:governance:read'],
      entitlements: ['superadmin-access'],
      featureFlags: {},
      timestamp: new Date(),
    };

    const resolved = resolveDashboard(superAdminDashboard, context);
    
    resolved.sections.forEach(section => {
      if (!section.visible) {
        expect(section.hiddenReason).toBeDefined();
        expect(section.hiddenReason!.message).toBeTruthy();
      }
    });
  });
});
