export interface Permission {
    id: string;
    resource: string;
    action: string;
}
export interface Entitlement {
    id: string;
    feature: string;
    tier?: string;
}
export interface FeatureFlag {
    id: string;
    enabled: boolean;
    rolloutPercentage?: number;
}
export interface TimeBounds {
    validFrom?: Date;
    validUntil?: Date;
}
export interface GatingRule {
    requiredPermissions: string[];
    requiredEntitlements: string[];
    requiredFeatureFlags: string[];
    timeBounds?: TimeBounds;
}
export interface DashboardAction {
    id: string;
    label: string;
    icon?: string;
    gating: GatingRule;
}
export interface DashboardGroup {
    id: string;
    label: string;
    actions: DashboardAction[];
    gating: GatingRule;
}
export interface DashboardSection {
    id: string;
    label: string;
    icon?: string;
    order: number;
    groups: DashboardGroup[];
    gating: GatingRule;
}
export interface DashboardDeclaration {
    id: string;
    type: 'superadmin' | 'partner' | 'tenant';
    version: string;
    sections: DashboardSection[];
    metadata: {
        createdAt: string;
        updatedAt: string;
        author: string;
    };
}
export interface UserContext {
    userId: string;
    tenantId?: string;
    permissions: string[];
    entitlements: string[];
    featureFlags: Record<string, boolean>;
    timestamp: Date;
}
export interface ResolvedDashboard {
    dashboardId: string;
    userId: string;
    resolvedAt: Date;
    sections: ResolvedSection[];
    snapshotHash: string;
}
export interface ResolvedSection {
    id: string;
    label: string;
    icon?: string;
    order: number;
    visible: boolean;
    hiddenReason?: HiddenReason;
    groups: ResolvedGroup[];
}
export interface ResolvedGroup {
    id: string;
    label: string;
    visible: boolean;
    hiddenReason?: HiddenReason;
    actions: ResolvedAction[];
}
export interface ResolvedAction {
    id: string;
    label: string;
    icon?: string;
    visible: boolean;
    hiddenReason?: HiddenReason;
}
export interface HiddenReason {
    type: 'permission' | 'entitlement' | 'feature_flag' | 'time_bounds';
    missing: string[];
    message: string;
}
export interface DashboardSnapshot {
    id: string;
    dashboardId: string;
    userId: string;
    generatedAt: Date;
    expiresAt: Date;
    hash: string;
    data: ResolvedDashboard;
    signature: string;
}
//# sourceMappingURL=index.d.ts.map