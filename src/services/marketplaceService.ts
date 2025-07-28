import apiClient from '../utils/apiClient';
import { startupService } from './startupService';

export const marketplaceService = {
  // Get all active products for marketplace
  async getProducts(filters?: {
    search?: string;
    category?: string;
    min_price?: number;
    max_price?: number;
    startup_id?: string;
  }) {
    try {
      return await startupService.getProducts(filters);
    } catch (error) {
      console.error('Error fetching marketplace products:', error);
      return [];
    }
  },

  // Get featured products
  async getFeaturedProducts() {
    try {
      // For now, just get all products - can be enhanced with featured flag
      const products = await this.getProducts();
      return products.slice(0, 8); // Return first 8 as featured
    } catch (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }
  },

  // Get product categories
  async getCategories() {
    try {
      const products = await this.getProducts();
      const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
      return categories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  },

  // Search products
  async searchProducts(query: string) {
    try {
      return await this.getProducts({ search: query });
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  },
};
