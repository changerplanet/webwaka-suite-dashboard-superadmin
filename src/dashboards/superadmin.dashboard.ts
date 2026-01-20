import type { DashboardDeclaration } from '../types/index.js';
import { allSuperAdminSections } from './superadmin.sections.js';

export const superAdminDashboard: DashboardDeclaration = {
  id: 'superadmin-dashboard',
  type: 'superadmin',
  version: '1.0.0',
  sections: allSuperAdminSections,
  metadata: {
    createdAt: '2026-01-20T00:00:00.000Z',
    updatedAt: '2026-01-20T00:00:00.000Z',
    author: 'WebWaka Phase 4B',
  },
};

export default superAdminDashboard;
