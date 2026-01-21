"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const express_1 = __importDefault(require("express"));
const server_1 = require("react-dom/server");
const superadmin_dashboard_js_1 = require("../dashboards/superadmin.dashboard.js");
const resolver_js_1 = require("../engine/resolver.js");
const app = (0, express_1.default)();
const mockSuperAdminContext = {
    userId: 'demo-superadmin',
    tenantId: 'platform',
    permissions: [
        'platform:governance:read',
        'platform:settings:manage',
        'partners:read',
        'tenants:read',
        'feature-flags:read',
        'audit:read',
        'audit:logs:read',
    ],
    entitlements: [
        'superadmin-access',
        'audit-access',
    ],
    featureFlags: {
        'incentives-enabled': false,
        'ai-features-enabled': false,
    },
    timestamp: new Date(),
};
function SectionCard({ section }) {
    const bgColor = section.visible ? '#e8f5e9' : '#ffebee';
    const borderColor = section.visible ? '#4caf50' : '#f44336';
    const statusIcon = section.visible ? '✓' : '✗';
    const statusText = section.visible ? 'Visible' : 'Hidden';
    return ((0, jsx_runtime_1.jsxs)("div", { style: {
            border: `2px solid ${borderColor}`,
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '12px',
            backgroundColor: bgColor,
        }, children: [(0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, children: [(0, jsx_runtime_1.jsx)("h3", { style: { margin: 0, color: '#333' }, children: section.label }), (0, jsx_runtime_1.jsxs)("span", { style: {
                            padding: '4px 12px',
                            borderRadius: '4px',
                            backgroundColor: section.visible ? '#4caf50' : '#f44336',
                            color: 'white',
                            fontSize: '12px',
                            fontWeight: 'bold',
                        }, children: [statusIcon, " ", statusText] })] }), (0, jsx_runtime_1.jsxs)("p", { style: { margin: '8px 0 0 0', color: '#666', fontSize: '14px' }, children: ["Order: ", section.order, " | Groups: ", section.groups.length] }), !section.visible && section.hiddenReason && ((0, jsx_runtime_1.jsxs)("div", { style: {
                    marginTop: '12px',
                    padding: '8px 12px',
                    backgroundColor: '#fff3e0',
                    borderRadius: '4px',
                    border: '1px solid #ff9800',
                }, children: [(0, jsx_runtime_1.jsx)("strong", { style: { color: '#e65100' }, children: "Reason:" }), (0, jsx_runtime_1.jsx)("span", { style: { marginLeft: '8px', color: '#bf360c' }, children: section.hiddenReason.message })] }))] }));
}
function DashboardUI({ resolved, context }) {
    const visibleSections = (0, resolver_js_1.getVisibleSections)(resolved);
    const hiddenWithReasons = (0, resolver_js_1.getHiddenSectionsWithReasons)(resolved);
    return ((0, jsx_runtime_1.jsxs)("html", { children: [(0, jsx_runtime_1.jsxs)("head", { children: [(0, jsx_runtime_1.jsx)("meta", { charSet: "utf-8" }), (0, jsx_runtime_1.jsx)("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }), (0, jsx_runtime_1.jsx)("title", { children: "Super Admin Dashboard - Phase 4B Validation UI" }), (0, jsx_runtime_1.jsx)("style", { dangerouslySetInnerHTML: { __html: `
          * { box-sizing: border-box; }
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: #f5f5f5;
          }
          .container { max-width: 1200px; margin: 0 auto; }
          .header { 
            background: linear-gradient(135deg, #1a237e 0%, #283593 100%);
            color: white;
            padding: 24px;
            border-radius: 12px;
            margin-bottom: 24px;
          }
          .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 16px;
            margin-bottom: 24px;
          }
          .stat-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            text-align: center;
          }
          .stat-value { font-size: 32px; font-weight: bold; color: #1a237e; }
          .stat-label { color: #666; margin-top: 4px; }
          .sections-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 16px;
          }
          .context-info {
            background: white;
            padding: 16px;
            border-radius: 8px;
            margin-bottom: 24px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          code { 
            background: #e3f2fd; 
            padding: 2px 6px; 
            border-radius: 4px;
            font-size: 12px;
          }
        ` } })] }), (0, jsx_runtime_1.jsx)("body", { children: (0, jsx_runtime_1.jsxs)("div", { className: "container", children: [(0, jsx_runtime_1.jsxs)("div", { className: "header", children: [(0, jsx_runtime_1.jsx)("h1", { style: { margin: 0 }, children: "WebWaka Super Admin Dashboard" }), (0, jsx_runtime_1.jsx)("p", { style: { margin: '8px 0 0 0', opacity: 0.9 }, children: "Phase 4B - Declarative Control Definitions (Validation UI)" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "context-info", children: [(0, jsx_runtime_1.jsx)("h3", { style: { marginTop: 0 }, children: "Current User Context" }), (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "User ID:" }), " ", (0, jsx_runtime_1.jsx)("code", { children: context.userId })] }), (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Permissions:" }), " ", context.permissions.length, " granted"] }), (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Entitlements:" }), " ", context.entitlements.join(', ') || 'None'] }), (0, jsx_runtime_1.jsxs)("p", { children: [(0, jsx_runtime_1.jsx)("strong", { children: "Feature Flags:" }), " ", Object.entries(context.featureFlags)
                                            .filter(([_, v]) => v)
                                            .map(([k]) => k)
                                            .join(', ') || 'None enabled'] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "stats", children: [(0, jsx_runtime_1.jsxs)("div", { className: "stat-card", children: [(0, jsx_runtime_1.jsx)("div", { className: "stat-value", children: resolved.sections.length }), (0, jsx_runtime_1.jsx)("div", { className: "stat-label", children: "Total Sections" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "stat-card", children: [(0, jsx_runtime_1.jsx)("div", { className: "stat-value", style: { color: '#4caf50' }, children: visibleSections.length }), (0, jsx_runtime_1.jsx)("div", { className: "stat-label", children: "Visible Sections" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "stat-card", children: [(0, jsx_runtime_1.jsx)("div", { className: "stat-value", style: { color: '#f44336' }, children: hiddenWithReasons.length }), (0, jsx_runtime_1.jsx)("div", { className: "stat-label", children: "Hidden Sections" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "stat-card", children: [(0, jsx_runtime_1.jsxs)("div", { className: "stat-value", children: [resolved.snapshotHash.slice(0, 8), "..."] }), (0, jsx_runtime_1.jsx)("div", { className: "stat-label", children: "Snapshot Hash" })] })] }), (0, jsx_runtime_1.jsx)("h2", { children: "All Dashboard Sections" }), (0, jsx_runtime_1.jsx)("div", { className: "sections-grid", children: resolved.sections
                                .sort((a, b) => a.order - b.order)
                                .map(section => ((0, jsx_runtime_1.jsx)(SectionCard, { section: section }, section.id))) }), (0, jsx_runtime_1.jsxs)("div", { style: { marginTop: '32px', padding: '16px', background: '#e3f2fd', borderRadius: '8px' }, children: [(0, jsx_runtime_1.jsx)("h3", { style: { marginTop: 0 }, children: "Phase 4B Compliance" }), (0, jsx_runtime_1.jsxs)("ul", { style: { marginBottom: 0 }, children: [(0, jsx_runtime_1.jsx)("li", { children: "All visibility resolved via Phase 4A engine patterns" }), (0, jsx_runtime_1.jsx)("li", { children: "Declarative dashboard definitions (pure data)" }), (0, jsx_runtime_1.jsx)("li", { children: "No hardcoded roles - permissions/entitlements/flags only" }), (0, jsx_runtime_1.jsxs)("li", { children: ["Snapshot hash: ", (0, jsx_runtime_1.jsx)("code", { children: resolved.snapshotHash })] })] })] })] }) })] }));
}
app.get('/', (_req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    const resolved = (0, resolver_js_1.resolveDashboard)(superadmin_dashboard_js_1.superAdminDashboard, mockSuperAdminContext);
    const html = (0, server_1.renderToString)((0, jsx_runtime_1.jsx)(DashboardUI, { resolved: resolved, context: mockSuperAdminContext }));
    res.send(`<!DOCTYPE html>${html}`);
});
app.get('/api/dashboard', (_req, res) => {
    res.setHeader('Cache-Control', 'no-cache');
    const resolved = (0, resolver_js_1.resolveDashboard)(superadmin_dashboard_js_1.superAdminDashboard, mockSuperAdminContext);
    res.json({
        resolved,
        visibleSections: (0, resolver_js_1.getVisibleSections)(resolved).map(s => s.id),
        hiddenSections: (0, resolver_js_1.getHiddenSectionsWithReasons)(resolved).map(h => ({
            id: h.section.id,
            reason: h.reason,
        })),
    });
});
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', phase: '4B', component: 'superadmin-dashboard' });
});
const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Super Admin Dashboard validation UI running on http://0.0.0.0:${PORT}`);
});
//# sourceMappingURL=server.js.map