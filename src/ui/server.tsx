import express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { superAdminDashboard } from '../dashboards/superadmin.dashboard.js';
import { resolveDashboard, getVisibleSections, getHiddenSectionsWithReasons } from '../engine/resolver.js';
import type { UserContext, ResolvedDashboard, ResolvedSection } from '../types/index.js';

const app = express();

const mockSuperAdminContext: UserContext = {
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

interface DashboardUIProps {
  resolved: ResolvedDashboard;
  context: UserContext;
}

function SectionCard({ section }: { section: ResolvedSection }) {
  const bgColor = section.visible ? '#e8f5e9' : '#ffebee';
  const borderColor = section.visible ? '#4caf50' : '#f44336';
  const statusIcon = section.visible ? '✓' : '✗';
  const statusText = section.visible ? 'Visible' : 'Hidden';

  return (
    <div style={{
      border: `2px solid ${borderColor}`,
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '12px',
      backgroundColor: bgColor,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, color: '#333' }}>{section.label}</h3>
        <span style={{ 
          padding: '4px 12px', 
          borderRadius: '4px',
          backgroundColor: section.visible ? '#4caf50' : '#f44336',
          color: 'white',
          fontSize: '12px',
          fontWeight: 'bold',
        }}>
          {statusIcon} {statusText}
        </span>
      </div>
      <p style={{ margin: '8px 0 0 0', color: '#666', fontSize: '14px' }}>
        Order: {section.order} | Groups: {section.groups.length}
      </p>
      {!section.visible && section.hiddenReason && (
        <div style={{
          marginTop: '12px',
          padding: '8px 12px',
          backgroundColor: '#fff3e0',
          borderRadius: '4px',
          border: '1px solid #ff9800',
        }}>
          <strong style={{ color: '#e65100' }}>Reason:</strong>
          <span style={{ marginLeft: '8px', color: '#bf360c' }}>
            {section.hiddenReason.message}
          </span>
        </div>
      )}
    </div>
  );
}

function DashboardUI({ resolved, context }: DashboardUIProps) {
  const visibleSections = getVisibleSections(resolved);
  const hiddenWithReasons = getHiddenSectionsWithReasons(resolved);

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Super Admin Dashboard - Phase 4B Validation UI</title>
        <style dangerouslySetInnerHTML={{ __html: `
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
        `}} />
      </head>
      <body>
        <div className="container">
          <div className="header">
            <h1 style={{ margin: 0 }}>WebWaka Super Admin Dashboard</h1>
            <p style={{ margin: '8px 0 0 0', opacity: 0.9 }}>
              Phase 4B - Declarative Control Definitions (Validation UI)
            </p>
          </div>

          <div className="context-info">
            <h3 style={{ marginTop: 0 }}>Current User Context</h3>
            <p><strong>User ID:</strong> <code>{context.userId}</code></p>
            <p><strong>Permissions:</strong> {context.permissions.length} granted</p>
            <p><strong>Entitlements:</strong> {context.entitlements.join(', ') || 'None'}</p>
            <p><strong>Feature Flags:</strong> {Object.entries(context.featureFlags)
              .filter(([_, v]) => v)
              .map(([k]) => k)
              .join(', ') || 'None enabled'}</p>
          </div>

          <div className="stats">
            <div className="stat-card">
              <div className="stat-value">{resolved.sections.length}</div>
              <div className="stat-label">Total Sections</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: '#4caf50' }}>{visibleSections.length}</div>
              <div className="stat-label">Visible Sections</div>
            </div>
            <div className="stat-card">
              <div className="stat-value" style={{ color: '#f44336' }}>{hiddenWithReasons.length}</div>
              <div className="stat-label">Hidden Sections</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{resolved.snapshotHash.slice(0, 8)}...</div>
              <div className="stat-label">Snapshot Hash</div>
            </div>
          </div>

          <h2>All Dashboard Sections</h2>
          <div className="sections-grid">
            {resolved.sections
              .sort((a, b) => a.order - b.order)
              .map(section => (
                <SectionCard key={section.id} section={section} />
              ))}
          </div>

          <div style={{ marginTop: '32px', padding: '16px', background: '#e3f2fd', borderRadius: '8px' }}>
            <h3 style={{ marginTop: 0 }}>Phase 4B Compliance</h3>
            <ul style={{ marginBottom: 0 }}>
              <li>All visibility resolved via Phase 4A engine patterns</li>
              <li>Declarative dashboard definitions (pure data)</li>
              <li>No hardcoded roles - permissions/entitlements/flags only</li>
              <li>Snapshot hash: <code>{resolved.snapshotHash}</code></li>
            </ul>
          </div>
        </div>
      </body>
    </html>
  );
}

app.get('/', (_req, res) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  const resolved = resolveDashboard(superAdminDashboard, mockSuperAdminContext);
  const html = renderToString(<DashboardUI resolved={resolved} context={mockSuperAdminContext} />);
  res.send(`<!DOCTYPE html>${html}`);
});

app.get('/api/dashboard', (_req, res) => {
  res.setHeader('Cache-Control', 'no-cache');
  const resolved = resolveDashboard(superAdminDashboard, mockSuperAdminContext);
  res.json({
    resolved,
    visibleSections: getVisibleSections(resolved).map(s => s.id),
    hiddenSections: getHiddenSectionsWithReasons(resolved).map(h => ({
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
