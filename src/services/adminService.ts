import apiClient from '../utils/apiClient';
import { Startup, Structure, AuthUser } from '../types/database';

interface PendingApprovals {
  startups: Startup[];
  structures: Structure[];
}

interface PlatformAnalytics {
  users: Record<string, number>;
  startups: { total: number; approved: number };
  structures: { total: number; approved: number };
  products: { total: number; active: number };
  orders: Record<string, number>;
  revenue: { total: number };
}

export const adminService = {
  // Get pending approvals
  async getPendingApprovals(): Promise<PendingApprovals> {
    try {
      return await apiClient.get('/admin/pending-approvals');
    } catch (error) {
      console.error('Error fetching pending approvals:', error);
      return { startups: [], structures: [] };
    }
  },

  // Approve or reject startup
  async approveStartup(id: string, approved: boolean): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await apiClient.post(`/admin/startups/${id}/approve`, { approved });
      return {
        success: true,
        message: response.message,
      };
    } catch (error) {
      console.error('Error updating startup approval:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update startup approval',
      };
    }
  },

  // Approve or reject structure
  async approveStructure(id: string, approved: boolean): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await apiClient.post(`/admin/structures/${id}/approve`, { approved });
      return {
        success: true,
        message: response.message,
      };
    } catch (error) {
      console.error('Error updating structure approval:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update structure approval',
      };
    }
  },

  // Get platform analytics
  async getPlatformAnalytics(): Promise<PlatformAnalytics> {
    try {
      return await apiClient.get('/admin/analytics');
    } catch (error) {
      console.error('Error fetching platform analytics:', error);
      return {
        users: {},
        startups: { total: 0, approved: 0 },
        structures: { total: 0, approved: 0 },
        products: { total: 0, active: 0 },
        orders: {},
        revenue: { total: 0 },
      };
    }
  },

  // Get all users
  async getAllUsers(): Promise<AuthUser[]> {
    try {
      return await apiClient.get('/admin/users');
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  },

  // Update user approval status
  async updateUserApproval(id: string, approved: boolean): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await apiClient.post(`/admin/users/${id}/approve`, { approved });
      return {
        success: true,
        message: response.message,
      };
    } catch (error) {
      console.error('Error updating user approval:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update user approval',
      };
    }
  },

  // Get dashboard stats
  async getDashboardStats() {
    try {
      const analytics = await this.getPlatformAnalytics();
      const pendingApprovals = await this.getPendingApprovals();
      
      return {
        totalUsers: Object.values(analytics.users).reduce((sum, count) => sum + count, 0),
        totalStartups: analytics.startups.total,
        totalStructures: analytics.structures.total,
        totalProducts: analytics.products.total,
        totalRevenue: analytics.revenue.total,
        pendingStartups: pendingApprovals.startups.length,
        pendingStructures: pendingApprovals.structures.length,
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        totalUsers: 0,
        totalStartups: 0,
        totalStructures: 0,
        totalProducts: 0,
        totalRevenue: 0,
        pendingStartups: 0,
        pendingStructures: 0,
      };
    }
  },
};
