import apiClient from '../utils/apiClient';
import {
  Structure,
  StructureKPIs,
  StartupStructureLink,
  StartupStructureLinkWithDetails,
  CreateStructureRequest,
  StructureFilters,
  Startup,
} from '../types/database';

export const structureService = {
  // Get all approved structures
  async getStructures(filters?: StructureFilters): Promise<Structure[]> {
    try {
      const params: Record<string, any> = {};
      
      if (filters?.search) params.search = filters.search;
      if (filters?.structure_type) params.structure_type = filters.structure_type;
      if (filters?.location) params.location = filters.location;
      if (filters?.focus_areas) params.focus_areas = filters.focus_areas.join(',');

      return await apiClient.get('/structures', params);
    } catch (error) {
      console.error('Error fetching structures:', error);
      return [];
    }
  },

  // Get structure by ID
  async getStructure(id: string): Promise<Structure | null> {
    try {
      return await apiClient.get(`/structures/${id}`);
    } catch (error) {
      console.error('Error fetching structure:', error);
      return null;
    }
  },

  // Get current user's structure
  async getMyStructure(): Promise<Structure | null> {
    try {
      return await apiClient.get('/structures/my/profile');
    } catch (error) {
      console.error('Error fetching my structure:', error);
      return null;
    }
  },

  // Create structure
  async createStructure(structureData: CreateStructureRequest): Promise<{ success: boolean; data?: Structure; message?: string }> {
    try {
      const response = await apiClient.post('/structures', structureData);
      return {
        success: true,
        data: response.structure,
        message: response.message,
      };
    } catch (error) {
      console.error('Error creating structure:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create structure',
      };
    }
  },

  // Update structure
  async updateStructure(updates: Partial<CreateStructureRequest>): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await apiClient.put('/structures/my/profile', updates);
      return {
        success: true,
        message: response.message,
      };
    } catch (error) {
      console.error('Error updating structure:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update structure',
      };
    }
  },

  // Get structure KPIs
  async getStructureKPIs(): Promise<StructureKPIs> {
    try {
      return await apiClient.get('/structures/my/kpis');
    } catch (error) {
      console.error('Error fetching structure KPIs:', error);
      return {
        startupsSupported: 0,
        invitationsSent: 0,
        invitationsPending: 0,
        invitationsAccepted: 0,
        totalCommissionsEarned: 0,
        totalProductsFromStartups: 0,
        ordersFromSupportedStartups: 0,
        averageStartupResponseTime: 0,
        averageCommissionRate: 0,
      };
    }
  },

  // Get approved structures (alias for getStructures with approved filter)
  async getApprovedStructures(): Promise<Structure[]> {
    return this.getStructures({ is_approved: true });
  },
};
