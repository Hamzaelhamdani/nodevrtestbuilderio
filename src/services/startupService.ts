import apiClient from '../utils/apiClient';
import {
  Startup,
  Product,
  StartupWithProducts,
  ProductWithStartup,
  CreateStartupRequest,
  CreateProductRequest,
  StartupKPIs,
  StartupFilters,
  ProductFilters,
} from '../types/database';

export const startupService = {
  // Get all approved startups
  async getStartups(filters?: StartupFilters): Promise<StartupWithProducts[]> {
    try {
      const params: Record<string, any> = {};

      if (filters?.search) params.search = filters.search;
      if (filters?.industry) params.industry = filters.industry;
      if (filters?.stage) params.stage = filters.stage;
      if (filters?.location) params.location = filters.location;

      return await apiClient.get('/startups', params);
    } catch (error) {
      console.error('Error fetching startups:', error);

      // Fallback: Demo data when backend is not available
      const demoStartups = [
        {
          id: "1",
          name: "AI Analytics Pro",
          description: "Advanced AI-powered analytics platform for businesses",
          logo_url: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200",
          website: "https://aianalytics.com",
          industry: "AI/ML",
          stage: "Seed",
          location: "San Francisco, CA",
          team_size: 12,
          created_by: "demo-startup",
          is_approved: true,
          total_funding: 500000,
          created_at: new Date().toISOString(),
          products: [
            {
              id: "1",
              name: "Business Intelligence Dashboard",
              description: "Comprehensive BI dashboard with real-time analytics",
              price: 299.99,
              startup_id: "1",
              is_active: true,
              stock_quantity: 100,
              created_at: new Date().toISOString(),
            },
          ],
        },
        {
          id: "2",
          name: "EcoTrack Solutions",
          description: "Environmental monitoring and sustainability tracking",
          logo_url: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=200",
          website: "https://ecotrack.com",
          industry: "Environment",
          stage: "Series A",
          location: "Berlin, Germany",
          team_size: 25,
          created_by: "demo-startup",
          is_approved: true,
          total_funding: 1200000,
          created_at: new Date().toISOString(),
          products: [
            {
              id: "2",
              name: "Environmental Monitor",
              description: "Real-time environmental data tracking",
              price: 199.99,
              startup_id: "2",
              is_active: true,
              stock_quantity: 50,
              created_at: new Date().toISOString(),
            },
          ],
        },
      ];

      return demoStartups;
    }
  },

  // Get startup by ID
  async getStartup(id: string): Promise<StartupWithProducts | null> {
    try {
      return await apiClient.get(`/startups/${id}`);
    } catch (error) {
      console.error('Error fetching startup:', error);
      return null;
    }
  },

  // Get current user's startup
  async getMyStartup(): Promise<StartupWithProducts | null> {
    try {
      return await apiClient.get('/startups/my/profile');
    } catch (error) {
      console.error('Error fetching my startup:', error);
      return null;
    }
  },

  // Create startup
  async createStartup(startupData: CreateStartupRequest): Promise<{ success: boolean; data?: Startup; message?: string }> {
    try {
      const response = await apiClient.post('/startups', startupData);
      return {
        success: true,
        data: response.startup,
        message: response.message,
      };
    } catch (error) {
      console.error('Error creating startup:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create startup',
      };
    }
  },

  // Update startup
  async updateStartup(updates: Partial<CreateStartupRequest>): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await apiClient.put('/startups/my/profile', updates);
      return {
        success: true,
        message: response.message,
      };
    } catch (error) {
      console.error('Error updating startup:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update startup',
      };
    }
  },

  // Get products with filters
  async getProducts(filters?: ProductFilters): Promise<ProductWithStartup[]> {
    try {
      const params: Record<string, any> = {};

      if (filters?.search) params.search = filters.search;
      if (filters?.category) params.category = filters.category;
      if (filters?.min_price) params.min_price = filters.min_price;
      if (filters?.max_price) params.max_price = filters.max_price;
      if (filters?.startup_id) params.startup_id = filters.startup_id;

      return await apiClient.get('/products', params);
    } catch (error) {
      console.error('Error fetching products:', error);

      // Fallback: Demo products when backend is not available
      const demoProducts = [
        {
          id: "1",
          name: "Business Intelligence Dashboard",
          description: "Comprehensive BI dashboard with real-time analytics",
          price: 299.99,
          category: "Analytics",
          image_urls: ["https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400"],
          startup_id: "1",
          is_active: true,
          stock_quantity: 100,
          created_at: new Date().toISOString(),
          startup: {
            id: "1",
            name: "AI Analytics Pro",
            description: "Advanced AI-powered analytics platform",
            created_by: "demo-startup",
            is_approved: true,
            total_funding: 500000,
            created_at: new Date().toISOString(),
          },
        },
        {
          id: "2",
          name: "Environmental Monitor",
          description: "Real-time environmental data tracking",
          price: 199.99,
          category: "IoT",
          image_urls: ["https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=400"],
          startup_id: "2",
          is_active: true,
          stock_quantity: 50,
          created_at: new Date().toISOString(),
          startup: {
            id: "2",
            name: "EcoTrack Solutions",
            description: "Environmental monitoring platform",
            created_by: "demo-startup",
            is_approved: true,
            total_funding: 1200000,
            created_at: new Date().toISOString(),
          },
        },
        {
          id: "3",
          name: "Smart Security System",
          description: "AI-powered security monitoring",
          price: 249.99,
          category: "Security",
          image_urls: ["https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400"],
          startup_id: "3",
          is_active: true,
          stock_quantity: 75,
          created_at: new Date().toISOString(),
          startup: {
            id: "3",
            name: "SecureAI",
            description: "AI security solutions",
            created_by: "demo-startup",
            is_approved: true,
            total_funding: 800000,
            created_at: new Date().toISOString(),
          },
        },
      ];

      return demoProducts;
    }
  },

  // Get my products
  async getMyProducts(): Promise<Product[]> {
    try {
      return await apiClient.get('/products/my/list');
    } catch (error) {
      console.error('Error fetching my products:', error);
      return [];
    }
  },

  // Create product
  async createProduct(productData: CreateProductRequest): Promise<{ success: boolean; data?: Product; message?: string }> {
    try {
      const response = await apiClient.post('/products', productData);
      return {
        success: true,
        data: response.product,
        message: response.message,
      };
    } catch (error) {
      console.error('Error creating product:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create product',
      };
    }
  },

  // Update product
  async updateProduct(id: string, updates: Partial<CreateProductRequest>): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await apiClient.put(`/products/${id}`, updates);
      return {
        success: true,
        message: response.message,
      };
    } catch (error) {
      console.error('Error updating product:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update product',
      };
    }
  },

  // Delete product
  async deleteProduct(id: string): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await apiClient.delete(`/products/${id}`);
      return {
        success: true,
        message: response.message,
      };
    } catch (error) {
      console.error('Error deleting product:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete product',
      };
    }
  },

  // Get startup KPIs
  async getStartupKPIs(): Promise<StartupKPIs> {
    try {
      return await apiClient.get('/startups/my/kpis');
    } catch (error) {
      console.error('Error fetching startup KPIs:', error);
      return {
        totalProducts: 0,
        totalOrders: 0,
        totalRevenue: 0,
        commissionPaid: 0,
        structuresLinked: 0,
        activeDiscounts: 0,
        averageProductPrice: 0,
      };
    }
  },

  // Get approved startups (alias for getStartups with approved filter)
  async getApprovedStartups(): Promise<StartupWithProducts[]> {
    return this.getStartups({ is_approved: true });
  },
};
