"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveDashboard = resolveDashboard;
exports.generateSnapshot = generateSnapshot;
exports.verifySnapshot = verifySnapshot;
exports.evaluateFromSnapshot = evaluateFromSnapshot;
exports.getVisibleSections = getVisibleSections;
exports.getHiddenSectionsWithReasons = getHiddenSectionsWithReasons;
const crypto_1 = require("crypto");
const SNAPSHOT_SECRET = process.env.SNAPSHOT_SECRET || 'webwaka-phase4b-secret';
function checkTimeBounds(timeBounds, now) {
    if (!timeBounds)
        return true;
    if (timeBounds.validFrom && now < timeBounds.validFrom)
        return false;
    if (timeBounds.validUntil && now > timeBounds.validUntil)
        return false;
    return true;
}
function evaluateGating(gating, context) {
    const missingPermissions = gating.requiredPermissions.filter((p) => !context.permissions.includes(p));
    if (missingPermissions.length > 0) {
        return {
            visible: false,
            hiddenReason: {
                type: 'permission',
                missing: missingPermissions,
                message: `Missing permissions: ${missingPermissions.join(', ')}`,
            },
        };
    }
    const missingEntitlements = gating.requiredEntitlements.filter((e) => !context.entitlements.includes(e));
    if (missingEntitlements.length > 0) {
        return {
            visible: false,
            hiddenReason: {
                type: 'entitlement',
                missing: missingEntitlements,
                message: `Missing entitlements: ${missingEntitlements.join(', ')}`,
            },
        };
    }
    const missingFlags = gating.requiredFeatureFlags.filter((f) => !context.featureFlags[f]);
    if (missingFlags.length > 0) {
        return {
            visible: false,
            hiddenReason: {
                type: 'feature_flag',
                missing: missingFlags,
                message: `Feature flags not enabled: ${missingFlags.join(', ')}`,
            },
        };
    }
    if (!checkTimeBounds(gating.timeBounds, context.timestamp)) {
        return {
            visible: false,
            hiddenReason: {
                type: 'time_bounds',
                missing: ['time_constraint'],
                message: 'Access not available at this time',
            },
        };
    }
    return { visible: true };
}
function resolveAction(action, context) {
    const { visible, hiddenReason } = evaluateGating(action.gating, context);
    return {
        id: action.id,
        label: action.label,
        icon: action.icon,
        visible,
        hiddenReason,
    };
}
function resolveGroup(group, context) {
    const { visible, hiddenReason } = evaluateGating(group.gating, context);
    return {
        id: group.id,
        label: group.label,
        visible,
        hiddenReason,
        actions: group.actions.map((action) => resolveAction(action, context)),
    };
}
function resolveSection(section, context) {
    const { visible, hiddenReason } = evaluateGating(section.gating, context);
    return {
        id: section.id,
        label: section.label,
        icon: section.icon,
        order: section.order,
        visible,
        hiddenReason,
        groups: section.groups.map((group) => resolveGroup(group, context)),
    };
}
function generateHash(data) {
    return (0, crypto_1.createHash)('sha256').update(JSON.stringify(data)).digest('hex');
}
function generateSignature(data) {
    return (0, crypto_1.createHmac)('sha256', SNAPSHOT_SECRET).update(data).digest('hex');
}
function resolveDashboard(declaration, context) {
    const sections = declaration.sections.map((section) => resolveSection(section, context));
    const resolved = {
        dashboardId: declaration.id,
        userId: context.userId,
        resolvedAt: new Date(),
        sections,
        snapshotHash: '',
    };
    resolved.snapshotHash = generateHash(resolved);
    return resolved;
}
function generateSnapshot(resolved, expirationHours = 24) {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + expirationHours * 60 * 60 * 1000);
    const dataForSignature = { ...resolved, snapshotHash: '' };
    const snapshotData = JSON.stringify({
        resolved: dataForSignature,
        generatedAt: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
    });
    const snapshot = {
        id: `snapshot-${generateHash({ resolved, timestamp: now.getTime() }).slice(0, 16)}`,
        dashboardId: resolved.dashboardId,
        userId: resolved.userId,
        generatedAt: now,
        expiresAt,
        hash: resolved.snapshotHash,
        data: resolved,
        signature: generateSignature(snapshotData),
    };
    return snapshot;
}
function verifySnapshot(snapshot) {
    const now = new Date();
    const expired = now > snapshot.expiresAt;
    const dataForHash = { ...snapshot.data, snapshotHash: '' };
    const computedHash = generateHash(dataForHash);
    const hashMatch = computedHash === snapshot.hash;
    const dataForSignature = { ...snapshot.data, snapshotHash: '' };
    const snapshotData = JSON.stringify({
        resolved: dataForSignature,
        generatedAt: snapshot.generatedAt.toISOString(),
        expiresAt: snapshot.expiresAt.toISOString(),
    });
    const expectedSignature = generateSignature(snapshotData);
    const signatureValid = snapshot.signature === expectedSignature;
    return {
        valid: !expired && hashMatch && signatureValid,
        expired,
        hashMatch,
    };
}
function evaluateFromSnapshot(snapshot) {
    const verification = verifySnapshot(snapshot);
    if (!verification.valid) {
        console.warn('Snapshot verification failed:', verification);
        return null;
    }
    return snapshot.data;
}
function getVisibleSections(resolved) {
    return resolved.sections.filter((s) => s.visible);
}
function getHiddenSectionsWithReasons(resolved) {
    return resolved.sections
        .filter((s) => !s.visible && s.hiddenReason)
        .map((s) => ({ section: s, reason: s.hiddenReason }));
}
//# sourceMappingURL=resolver.js.map