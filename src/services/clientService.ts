import apiClient from '../utils/apiClient';

interface CreateOrderRequest {
  product_id: number;
  quantity: number;
  delivery_address: string;
  notes?: string;
}

interface Order {
  id: number;
  client_id: number;
  startup_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  total_amount: number;
  status: string;
  order_date: string;
  delivery_address: string;
  notes?: string;
  product_name?: string;
  product_images?: string[];
  startup_name?: string;
}

export const clientService = {
  // Create order
  async createOrder(orderData: CreateOrderRequest): Promise<{ success: boolean; data?: Order; message?: string }> {
    try {
      const response = await apiClient.post('/orders', orderData);
      return {
        success: true,
        data: response.order,
        message: response.message,
      };
    } catch (error) {
      console.error('Error creating order:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create order',
      };
    }
  },

  // Get my orders
  async getMyOrders(): Promise<Order[]> {
    try {
      return await apiClient.get('/orders/my');
    } catch (error) {
      console.error('Error fetching my orders:', error);
      return [];
    }
  },

  // Get order by ID
  async getOrder(id: string): Promise<Order | null> {
    try {
      return await apiClient.get(`/orders/${id}`);
    } catch (error) {
      console.error('Error fetching order:', error);
      return null;
    }
  },
};
