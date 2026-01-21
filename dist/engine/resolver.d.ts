import type { DashboardDeclaration, UserContext, ResolvedDashboard, ResolvedSection, HiddenReason, DashboardSnapshot } from '../types/index.js';
export declare function resolveDashboard(declaration: DashboardDeclaration, context: UserContext): ResolvedDashboard;
export declare function generateSnapshot(resolved: ResolvedDashboard, expirationHours?: number): DashboardSnapshot;
export declare function verifySnapshot(snapshot: DashboardSnapshot): {
    valid: boolean;
    expired: boolean;
    hashMatch: boolean;
};
export declare function evaluateFromSnapshot(snapshot: DashboardSnapshot): ResolvedDashboard | null;
export declare function getVisibleSections(resolved: ResolvedDashboard): ResolvedSection[];
export declare function getHiddenSectionsWithReasons(resolved: ResolvedDashboard): Array<{
    section: ResolvedSection;
    reason: HiddenReason;
}>;
//# sourceMappingURL=resolver.d.ts.map