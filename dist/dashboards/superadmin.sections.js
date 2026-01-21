"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allSuperAdminSections = exports.aiAutomationSection = exports.auditComplianceSection = exports.infrastructureSection = exports.brandingWhitelabelSection = exports.featureFlagsSection = exports.incentivesAffiliatesSection = exports.pricingPlansSection = exports.partnersTenantsSection = exports.platformGovernanceSection = void 0;
exports.platformGovernanceSection = {
    id: 'platform-governance',
    label: 'Platform Governance',
    icon: 'shield',
    order: 1,
    gating: {
        requiredPermissions: ['platform:governance:read'],
        requiredEntitlements: ['superadmin-access'],
        requiredFeatureFlags: [],
    },
    groups: [
        {
            id: 'system-settings',
            label: 'System Settings',
            gating: {
                requiredPermissions: ['platform:settings:manage'],
                requiredEntitlements: [],
                requiredFeatureFlags: [],
            },
            actions: [
                {
                    id: 'view-config',
                    label: 'View Configuration',
                    gating: {
                        requiredPermissions: ['platform:config:read'],
                        requiredEntitlements: [],
                        requiredFeatureFlags: [],
                    },
                },
                {
                    id: 'edit-config',
                    label: 'Edit Configuration',
                    gating: {
                        requiredPermissions: ['platform:config:write'],
                        requiredEntitlements: [],
                        requiredFeatureFlags: [],
                    },
                },
            ],
        },
        {
            id: 'policies',
            label: 'Policies',
            gating: {
                requiredPermissions: ['platform:policies:read'],
                requiredEntitlements: [],
                requiredFeatureFlags: [],
            },
            actions: [
                {
                    id: 'manage-policies',
                    label: 'Manage Policies',
                    gating: {
                        requiredPermissions: ['platform:policies:manage'],
                        requiredEntitlements: [],
                        requiredFeatureFlags: [],
                    },
                },
            ],
        },
    ],
};
exports.partnersTenantsSection = {
    id: 'partners-tenants',
    label: 'Partners & Tenants',
    icon: 'users',
    order: 2,
    gating: {
        requiredPermissions: ['partners:read', 'tenants:read'],
        requiredEntitlements: ['superadmin-access'],
        requiredFeatureFlags: [],
    },
    groups: [
        {
            id: 'partner-management',
            label: 'Partner Management',
            gating: {
                requiredPermissions: ['partners:manage'],
                requiredEntitlements: [],
                requiredFeatureFlags: [],
            },
            actions: [
                {
                    id: 'list-partners',
                    label: 'List Partners',
                    gating: {
                        requiredPermissions: ['partners:list'],
                        requiredEntitlements: [],
                        requiredFeatureFlags: [],
                    },
                },
                {
                    id: 'create-partner',
                    label: 'Create Partner',
                    gating: {
                        requiredPermissions: ['partners:create'],
                        requiredEntitlements: [],
                        requiredFeatureFlags: [],
                    },
                },
            ],
        },
        {
            id: 'tenant-management',
            label: 'Tenant Management',
            gating: {
                requiredPermissions: ['tenants:manage'],
                requiredEntitlements: [],
                requiredFeatureFlags: [],
            },
            actions: [
                {
                    id: 'list-tenants',
                    label: 'List Tenants',
                    gating: {
                        requiredPermissions: ['tenants:list'],
                        requiredEntitlements: [],
                        requiredFeatureFlags: [],
                    },
                },
                {
                    id: 'create-tenant',
                    label: 'Create Tenant',
                    gating: {
                        requiredPermissions: ['tenants:create'],
                        requiredEntitlements: [],
                        requiredFeatureFlags: [],
                    },
                },
            ],
        },
    ],
};
exports.pricingPlansSection = {
    id: 'pricing-plans',
    label: 'Pricing & Plans',
    icon: 'credit-card',
    order: 3,
    gating: {
        requiredPermissions: ['pricing:read'],
        requiredEntitlements: ['superadmin-access', 'pricing-management'],
        requiredFeatureFlags: [],
    },
    groups: [
        {
            id: 'plan-configuration',
            label: 'Plan Configuration',
            gating: {
                requiredPermissions: ['pricing:plans:manage'],
                requiredEntitlements: [],
                requiredFeatureFlags: [],
            },
            actions: [
                {
                    id: 'view-plans',
                    label: 'View Plans',
                    gating: {
                        requiredPermissions: ['pricing:plans:read'],
                        requiredEntitlements: [],
                        requiredFeatureFlags: [],
                    },
                },
                {
                    id: 'edit-plans',
                    label: 'Edit Plans',
                    gating: {
                        requiredPermissions: ['pricing:plans:write'],
                        requiredEntitlements: [],
                        requiredFeatureFlags: [],
                    },
                },
            ],
        },
    ],
};
exports.incentivesAffiliatesSection = {
    id: 'incentives-affiliates',
    label: 'Incentives & Affiliates',
    icon: 'gift',
    order: 4,
    gating: {
        requiredPermissions: ['incentives:read'],
        requiredEntitlements: ['superadmin-access', 'incentives-management'],
        requiredFeatureFlags: ['incentives-enabled'],
    },
    groups: [
        {
            id: 'affiliate-programs',
            label: 'Affiliate Programs',
            gating: {
                requiredPermissions: ['affiliates:manage'],
                requiredEntitlements: [],
                requiredFeatureFlags: [],
            },
            actions: [
                {
                    id: 'view-affiliates',
                    label: 'View Affiliates',
                    gating: {
                        requiredPermissions: ['affiliates:read'],
                        requiredEntitlements: [],
                        requiredFeatureFlags: [],
                    },
                },
                {
                    id: 'manage-commissions',
                    label: 'Manage Commissions',
                    gating: {
                        requiredPermissions: ['affiliates:commissions:write'],
                        requiredEntitlements: [],
                        requiredFeatureFlags: [],
                    },
                },
            ],
        },
    ],
};
exports.featureFlagsSection = {
    id: 'feature-flags-experiments',
    label: 'Feature Flags & Experiments',
    icon: 'toggle-right',
    order: 5,
    gating: {
        requiredPermissions: ['feature-flags:read'],
        requiredEntitlements: ['superadmin-access'],
        requiredFeatureFlags: [],
    },
    groups: [
        {
            id: 'flag-management',
            label: 'Flag Management',
            gating: {
                requiredPermissions: ['feature-flags:manage'],
                requiredEntitlements: [],
                requiredFeatureFlags: [],
            },
            actions: [
                {
                    id: 'list-flags',
                    label: 'List Flags',
                    gating: {
                        requiredPermissions: ['feature-flags:list'],
                        requiredEntitlements: [],
                        requiredFeatureFlags: [],
                    },
                },
                {
                    id: 'toggle-flag',
                    label: 'Toggle Flag',
                    gating: {
                        requiredPermissions: ['feature-flags:write'],
                        requiredEntitlements: [],
                        requiredFeatureFlags: [],
                    },
                },
            ],
        },
        {
            id: 'experiments',
            label: 'Experiments',
            gating: {
                requiredPermissions: ['experiments:manage'],
                requiredEntitlements: ['experiments-access'],
                requiredFeatureFlags: ['experiments-enabled'],
            },
            actions: [
                {
                    id: 'view-experiments',
                    label: 'View Experiments',
                    gating: {
                        requiredPermissions: ['experiments:read'],
                        requiredEntitlements: [],
                        requiredFeatureFlags: [],
                    },
                },
            ],
        },
    ],
};
exports.brandingWhitelabelSection = {
    id: 'branding-whitelabel',
    label: 'Branding / Whitelabel',
    icon: 'palette',
    order: 6,
    gating: {
        requiredPermissions: ['branding:read'],
        requiredEntitlements: ['superadmin-access', 'whitelabel-access'],
        requiredFeatureFlags: ['whitelabel-enabled'],
    },
    groups: [
        {
            id: 'theme-management',
            label: 'Theme Management',
            gating: {
                requiredPermissions: ['branding:themes:manage'],
                requiredEntitlements: [],
                requiredFeatureFlags: [],
            },
            actions: [
                {
                    id: 'view-themes',
                    label: 'View Themes',
                    gating: {
                        requiredPermissions: ['branding:themes:read'],
                        requiredEntitlements: [],
                        requiredFeatureFlags: [],
                    },
                },
                {
                    id: 'create-theme',
                    label: 'Create Theme',
                    gating: {
                        requiredPermissions: ['branding:themes:write'],
                        requiredEntitlements: [],
                        requiredFeatureFlags: [],
                    },
                },
            ],
        },
    ],
};
exports.infrastructureSection = {
    id: 'infrastructure-deployments',
    label: 'Infrastructure & Deployments',
    icon: 'server',
    order: 7,
    gating: {
        requiredPermissions: ['infrastructure:read'],
        requiredEntitlements: ['superadmin-access', 'infrastructure-access'],
        requiredFeatureFlags: [],
    },
    groups: [
        {
            id: 'deployment-management',
            label: 'Deployment Management',
            gating: {
                requiredPermissions: ['deployments:manage'],
                requiredEntitlements: [],
                requiredFeatureFlags: [],
            },
            actions: [
                {
                    id: 'view-deployments',
                    label: 'View Deployments',
                    gating: {
                        requiredPermissions: ['deployments:read'],
                        requiredEntitlements: [],
                        requiredFeatureFlags: [],
                    },
                },
                {
                    id: 'trigger-deployment',
                    label: 'Trigger Deployment',
                    gating: {
                        requiredPermissions: ['deployments:trigger'],
                        requiredEntitlements: [],
                        requiredFeatureFlags: [],
                    },
                },
            ],
        },
        {
            id: 'monitoring',
            label: 'Monitoring',
            gating: {
                requiredPermissions: ['infrastructure:monitoring:read'],
                requiredEntitlements: [],
                requiredFeatureFlags: [],
            },
            actions: [
                {
                    id: 'view-metrics',
                    label: 'View Metrics',
                    gating: {
                        requiredPermissions: ['infrastructure:metrics:read'],
                        requiredEntitlements: [],
                        requiredFeatureFlags: [],
                    },
                },
            ],
        },
    ],
};
exports.auditComplianceSection = {
    id: 'audit-compliance',
    label: 'Audit & Compliance',
    icon: 'file-text',
    order: 8,
    gating: {
        requiredPermissions: ['audit:read'],
        requiredEntitlements: ['superadmin-access', 'audit-access'],
        requiredFeatureFlags: [],
    },
    groups: [
        {
            id: 'audit-logs',
            label: 'Audit Logs',
            gating: {
                requiredPermissions: ['audit:logs:read'],
                requiredEntitlements: [],
                requiredFeatureFlags: [],
            },
            actions: [
                {
                    id: 'view-audit-logs',
                    label: 'View Audit Logs',
                    gating: {
                        requiredPermissions: ['audit:logs:read'],
                        requiredEntitlements: [],
                        requiredFeatureFlags: [],
                    },
                },
                {
                    id: 'export-audit-logs',
                    label: 'Export Audit Logs',
                    gating: {
                        requiredPermissions: ['audit:logs:export'],
                        requiredEntitlements: [],
                        requiredFeatureFlags: [],
                    },
                },
            ],
        },
        {
            id: 'compliance-reports',
            label: 'Compliance Reports',
            gating: {
                requiredPermissions: ['compliance:reports:read'],
                requiredEntitlements: [],
                requiredFeatureFlags: [],
            },
            actions: [
                {
                    id: 'generate-report',
                    label: 'Generate Report',
                    gating: {
                        requiredPermissions: ['compliance:reports:generate'],
                        requiredEntitlements: [],
                        requiredFeatureFlags: [],
                    },
                },
            ],
        },
    ],
};
exports.aiAutomationSection = {
    id: 'ai-automation',
    label: 'AI / Automation',
    icon: 'cpu',
    order: 9,
    gating: {
        requiredPermissions: ['ai:read'],
        requiredEntitlements: ['superadmin-access', 'ai-access'],
        requiredFeatureFlags: ['ai-features-enabled'],
    },
    groups: [
        {
            id: 'ai-models',
            label: 'AI Models',
            gating: {
                requiredPermissions: ['ai:models:manage'],
                requiredEntitlements: ['ai-models-access'],
                requiredFeatureFlags: [],
            },
            actions: [
                {
                    id: 'view-models',
                    label: 'View Models',
                    gating: {
                        requiredPermissions: ['ai:models:read'],
                        requiredEntitlements: [],
                        requiredFeatureFlags: [],
                    },
                },
                {
                    id: 'configure-models',
                    label: 'Configure Models',
                    gating: {
                        requiredPermissions: ['ai:models:configure'],
                        requiredEntitlements: [],
                        requiredFeatureFlags: [],
                    },
                },
            ],
        },
        {
            id: 'automation-rules',
            label: 'Automation Rules',
            gating: {
                requiredPermissions: ['automation:rules:manage'],
                requiredEntitlements: [],
                requiredFeatureFlags: ['automation-enabled'],
            },
            actions: [
                {
                    id: 'view-rules',
                    label: 'View Rules',
                    gating: {
                        requiredPermissions: ['automation:rules:read'],
                        requiredEntitlements: [],
                        requiredFeatureFlags: [],
                    },
                },
            ],
        },
    ],
};
exports.allSuperAdminSections = [
    exports.platformGovernanceSection,
    exports.partnersTenantsSection,
    exports.pricingPlansSection,
    exports.incentivesAffiliatesSection,
    exports.featureFlagsSection,
    exports.brandingWhitelabelSection,
    exports.infrastructureSection,
    exports.auditComplianceSection,
    exports.aiAutomationSection,
];
//# sourceMappingURL=superadmin.sections.js.map