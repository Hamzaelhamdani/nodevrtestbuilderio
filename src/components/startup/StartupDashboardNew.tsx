import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from '../../utils/apiClient';
import { 
  PlusIcon, 
  BarChart3Icon, 
  PackageIcon, 
  ShoppingCartIcon,
  UsersIcon,
  Building2Icon,
  BellIcon,
  SettingsIcon,
  TrendingUpIcon,
  EditIcon,
  EyeIcon,
  TrashIcon,
  FilterIcon,
  SearchIcon,
  LogOutIcon,
  UserIcon
} from "lucide-react";

// Types
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  status: 'active' | 'inactive';
  category: string;
  created_at: string;
  images?: string[]; // Add images field
}

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  created_at: string;
  items: Array<{
    product_name: string;
    quantity: number;
    price: number;
  }>;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  total_spent: number;
  orders_count: number;
  created_at: string;
}

interface DashboardStats {
  totalRevenue: number;
  revenueGrowth: number;
  averageOrderValue: number;
  avgOrderGrowth: number;
  totalProducts: number;
  totalOrders: number;
}

export function StartupDashboardNew({ user }: { user: any }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Data states
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    revenueGrowth: 0,
    averageOrderValue: 0,
    avgOrderGrowth: 0,
    totalProducts: 0,
    totalOrders: 0
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);

  // Modal states
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Load dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('🔄 Loading dashboard data automatically...');
        console.log('🔍 User context:', user);
        
        // Fetch all data in parallel
        const [productsRes, ordersRes, customersRes] = await Promise.all([
          apiClient.get('products'),
          apiClient.get('orders'),
          apiClient.get('customers')
        ]);

        console.log('✅ API responses received:', { productsRes, ordersRes, customersRes });

        setProducts(productsRes.data || []);
        setOrders(ordersRes.data || []);
        setCustomers(customersRes.data || []);

        // Calculate stats
        const totalRevenue = ordersRes.data?.reduce((sum: number, order: Order) => sum + order.total_amount, 0) || 0;
        const totalOrders = ordersRes.data?.length || 0;
        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        setStats({
          totalRevenue,
          revenueGrowth: 12.3, // Mock growth data
          averageOrderValue: avgOrderValue,
          avgOrderGrowth: 8.7, // Mock growth data
          totalProducts: productsRes.data?.length || 0,
          totalOrders
        });

      } catch (err: any) {
        console.error('❌ Auto-load failed:', err);
        setError(err.message || 'Failed to load dashboard data');
        
        // Set empty data on error
        setProducts([]);
        setOrders([]);
        setCustomers([]);
        setStats({
          totalRevenue: 0,
          revenueGrowth: 0,
          averageOrderValue: 0,
          avgOrderGrowth: 0,
          totalProducts: 0,
          totalOrders: 0
        });
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user]); // Reload when user changes

  // Manual retry function
  const handleRetry = async () => {
    setError(null);
    setLoading(true);
    
    try {
      console.log('🔄 Manual retry - Fetching dashboard data...');
      
      // Fetch all data in parallel
      const [productsRes, ordersRes, customersRes] = await Promise.all([
        apiClient.get('products'),
        apiClient.get('orders'),
        apiClient.get('customers')
      ]);

      console.log('✅ Manual retry - API responses received:', { productsRes, ordersRes, customersRes });

      setProducts(productsRes.data || []);
      setOrders(ordersRes.data || []);
      setCustomers(customersRes.data || []);

      // Calculate stats
      const totalRevenue = ordersRes.data?.reduce((sum: number, order: Order) => sum + order.total_amount, 0) || 0;
      const totalOrders = ordersRes.data?.length || 0;
      const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      setStats({
        totalRevenue,
        revenueGrowth: 12.3, // Mock growth data
        averageOrderValue: avgOrderValue,
        avgOrderGrowth: 8.7, // Mock growth data
        totalProducts: productsRes.data?.length || 0,
        totalOrders
      });

    } catch (err: any) {
      console.error('❌ Manual retry failed:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Product management functions
  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowProductModal(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowProductModal(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await apiClient.delete(`products/${productId}`);
        setProducts(products.filter(p => p.id !== productId));
      } catch (err) {
        console.error('Error deleting product:', err);
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="min-h-screen bg-slate-950 text-white flex items-center justify-center"
        style={{
          minHeight: '100vh',
          backgroundColor: '#020617',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div 
          className="text-center p-8"
          style={{
            textAlign: 'center',
            padding: '2rem'
          }}
        >
          <p 
            className="text-red-400 mb-4 text-lg"
            style={{
              color: '#f87171',
              marginBottom: '1rem',
              fontSize: '1.125rem'
            }}
          >
            Erreur: {error}
          </p>
          
          <div 
            className="space-y-4"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              alignItems: 'center'
            }}
          >
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🔄 Retry button clicked');
                handleRetry();
              }}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500'
              }}
              onMouseOver={(e) => {
                (e.target as HTMLElement).style.backgroundColor = '#1d4ed8';
              }}
              onMouseOut={(e) => {
                (e.target as HTMLElement).style.backgroundColor = '#2563eb';
              }}
            >
              🔄 Réessayer
            </button>
            
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('✅ Clear Error button clicked');
                setError(null);
                setLoading(false);
              }}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#16a34a',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500'
              }}
              onMouseOver={(e) => {
                (e.target as HTMLElement).style.backgroundColor = '#15803d';
              }}
              onMouseOut={(e) => {
                (e.target as HTMLElement).style.backgroundColor = '#16a34a';
              }}
            >
              ✅ Effacer l'erreur
            </button>
            
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🚀 Force Dashboard button clicked');
                // Force show dashboard with empty data
                setError(null);
                setLoading(false);
                setProducts([]);
                setOrders([]);
                setCustomers([]);
                setStats({
                  totalRevenue: 0,
                  revenueGrowth: 0,
                  averageOrderValue: 0,
                  avgOrderGrowth: 0,
                  totalProducts: 0,
                  totalOrders: 0
                });
              }}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#7c3aed',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500'
              }}
              onMouseOver={(e) => {
                (e.target as HTMLElement).style.backgroundColor = '#6d28d9';
              }}
              onMouseOut={(e) => {
                (e.target as HTMLElement).style.backgroundColor = '#7c3aed';
              }}
            >
              🚀 Afficher le Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            {user?.name || 'Startup'} Dashboard
          </h1>
          <p className="text-slate-400">
            Manage your products, orders, and customers
          </p>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-slate-800 mb-8">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3Icon },
              { id: 'products', label: 'Products', icon: PackageIcon },
              { id: 'orders', label: 'Orders', icon: ShoppingCartIcon },
              { id: 'customers', label: 'Customers', icon: UsersIcon },
              { id: 'support-structures', label: 'Support Structures', icon: Building2Icon },
              { id: 'notifications', label: 'Notifications', icon: BellIcon },
              { id: 'settings', label: 'Settings', icon: SettingsIcon }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-green-400 text-green-400'
                      : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="Total Revenue"
                value={formatCurrency(stats.totalRevenue)}
                change={`+${stats.revenueGrowth}%`}
                changeType="positive"
                icon={<TrendingUpIcon className="h-5 w-5" />}
              />
              <StatsCard
                title="Average Order Value"
                value={formatCurrency(stats.averageOrderValue)}
                change={`+${stats.avgOrderGrowth}%`}
                changeType="positive"
                icon={<ShoppingCartIcon className="h-5 w-5" />}
              />
              <StatsCard
                title="Total Products"
                value={stats.totalProducts.toString()}
                icon={<PackageIcon className="h-5 w-5" />}
              />
              <StatsCard
                title="Total Orders"
                value={stats.totalOrders.toString()}
                icon={<ShoppingCartIcon className="h-5 w-5" />}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => navigate('/community-discounts')}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
              >
                Manage Discounts
              </button>
              <button
                onClick={handleRetry}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                🔄 Load Data from API
              </button>
              <button
                onClick={() => {
                  // Test direct image access
                  const testUrl = 'http://localhost:5003/api/uploads/images/product-1754075073639-987628845.jpeg';
                  console.log('🧪 Testing image URL:', testUrl);
                  window.open(testUrl, '_blank');
                }}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors"
              >
                🧪 Test Image
              </button>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white">Product Management</h2>
                <p className="text-slate-400">Manage your products and services</p>
              </div>
              <button
                onClick={handleAddProduct}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                <PlusIcon className="h-4 w-4" />
                <span>Add Product</span>
              </button>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <PackageIcon className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400 mb-4">No products found</p>
                  <button
                    onClick={handleAddProduct}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                  >
                    Create your first product
                  </button>
                </div>
              ) : (
                products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onEdit={() => handleEditProduct(product)}
                    onDelete={() => handleDeleteProduct(product.id)}
                    formatCurrency={formatCurrency}
                  />
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Orders Management</h2>
              <p className="text-slate-400">View and manage your orders</p>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCartIcon className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">No orders found</p>
              </div>
            ) : (
              <OrdersTable orders={orders} formatCurrency={formatCurrency} formatDate={formatDate} />
            )}
          </div>
        )}

        {activeTab === 'customers' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Customer Management</h2>
              <p className="text-slate-400">View and manage your customers</p>
            </div>

            {customers.length === 0 ? (
              <div className="text-center py-12">
                <UsersIcon className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">No customers found</p>
              </div>
            ) : (
              <CustomersTable customers={customers} formatCurrency={formatCurrency} formatDate={formatDate} />
            )}
          </div>
        )}

        {/* Other tabs content will be added here */}
        {activeTab === 'support-structures' && (
          <div className="text-center py-12">
            <Building2Icon className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">Support Structures management coming soon</p>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="text-center py-12">
            <BellIcon className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">Notifications management coming soon</p>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="text-center py-12">
            <SettingsIcon className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">Settings management coming soon</p>
          </div>
        )}
      </div>

      {/* Product Modal */}
      {showProductModal && (
        <ProductModal
          isOpen={showProductModal}
          onClose={() => setShowProductModal(false)}
          product={editingProduct}
          onSave={async (productData) => {
            try {
              console.log('🔄 Attempting to save product:', productData);
              console.log('🔗 API endpoint will be: products');
              
              if (editingProduct) {
                // Update existing product
                console.log('📝 Updating product with ID:', editingProduct.id);
                const response = await apiClient.put(`products/${editingProduct.id}`, productData);
                console.log('✅ Update response:', response);
                setProducts(products.map(p => p.id === editingProduct.id ? response.data : p));
                
                // Signal marketplace to refresh
                localStorage.setItem('marketplace-refresh', 'true');
                window.dispatchEvent(new StorageEvent('storage', {
                  key: 'marketplace-refresh',
                  newValue: 'true'
                }));
              } else {
                // Create new product
                console.log('➕ Creating new product');
                const response = await apiClient.post('products', productData);
                console.log('✅ Create response:', response);
                setProducts([response.data, ...products]);
                
                // Signal marketplace to refresh
                localStorage.setItem('marketplace-refresh', 'true');
                window.dispatchEvent(new StorageEvent('storage', {
                  key: 'marketplace-refresh',
                  newValue: 'true'
                }));
              }
              setShowProductModal(false);
              setEditingProduct(null);
              // Refresh data after successful operation
              handleRetry();
            } catch (error: any) {
              console.error('❌ Error saving product:', error);
              console.error('❌ Error details:', {
                message: error.message,
                response: error.response,
                status: error.response?.status,
                data: error.response?.data
              });
              alert('Failed to save product: ' + (error.response?.data?.error || error.message));
            }
          }}
        />
      )}
    </div>
  );
}

// Stats Card Component
function StatsCard({ 
  title, 
  value, 
  change, 
  changeType, 
  icon 
}: { 
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative';
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${
              changeType === 'positive' ? 'text-green-400' : 'text-red-400'
            }`}>
              {change} vs. last month
            </p>
          )}
        </div>
        <div className="text-slate-400">
          {icon}
        </div>
      </div>
    </div>
  );
}

// Product Card Component
function ProductCard({ 
  product, 
  onEdit, 
  onDelete, 
  formatCurrency 
}: { 
  product: Product;
  onEdit: () => void;
  onDelete: () => void;
  formatCurrency: (amount: number) => string;
}) {
  // Helper function to get full image URL
  const getImageUrl = (imageUrl: string) => {
    if (!imageUrl) return null;
    
    // If it's already a full URL, return as is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    // If it's a relative URL starting with /api, construct full URL to bypass proxy issues
    if (imageUrl.startsWith('/api/')) {
      return `http://localhost:5003${imageUrl}`;
    }
    
    // If it's just a filename, construct full URL
    return `http://localhost:5003/api/uploads/images/${imageUrl}`;
  };

  // Debug logging
  console.log('🔍 ProductCard Debug for:', product.name);
  console.log('📸 Product images:', product.images);
  console.log('🔗 First image URL:', product.images?.[0]);
  console.log('🌐 Processed URL:', product.images?.[0] ? getImageUrl(product.images[0]) : 'No image');

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
      {/* Product Image */}
      {product.images && product.images.length > 0 ? (
        <div className="mb-4">
          <img
            src={getImageUrl(product.images[0]) || ''}
            alt={product.name}
            className="w-full aspect-[16/9] object-cover rounded-xl bg-slate-800 border border-slate-700 shadow"
            onLoad={() => {
              console.log('✅ Image loaded successfully for:', product.name);
            }}
            onError={(e) => {
              console.error('❌ Image failed to load for:', product.name);
              console.error('❌ Failed URL:', getImageUrl(product.images?.[0] || ''));
              // Hide the image if it fails to load
              e.currentTarget.style.display = 'none';
              const fallbackIcon = e.currentTarget.parentElement?.querySelector('.fallback-icon');
              if (fallbackIcon) {
                fallbackIcon.classList.remove('hidden');
              }
            }}
          />
          {/* Fallback icon (hidden by default) */}
          <div className="fallback-icon hidden h-32 bg-slate-800 rounded-lg flex items-center justify-center">
            <PackageIcon className="h-8 w-8 text-slate-600" />
          </div>
          {product.images.length > 1 && (
            <div className="flex mt-2 space-x-1">
              {product.images.slice(1, 4).map((image, index) => (
                <img
                  key={index}
                  src={getImageUrl(image) || ''}
                  alt={`${product.name} ${index + 2}`}
                  className="w-8 h-8 object-cover rounded border border-slate-600"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ))}
              {product.images.length > 4 && (
                <div className="w-8 h-8 bg-slate-700 rounded border border-slate-600 flex items-center justify-center">
                  <span className="text-xs text-slate-400">+{product.images.length - 4}</span>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="mb-4 h-32 bg-slate-800 rounded-lg flex items-center justify-center">
          <PackageIcon className="h-8 w-8 text-slate-600" />
        </div>
      )}      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <PackageIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className={`inline-block px-2 py-1 text-xs rounded-full ${
              product.status === 'active' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {product.status}
            </span>
          </div>
        </div>
      </div>
      
      <h3 className="text-white font-semibold mb-2">{product.name}</h3>
      <p className="text-slate-400 text-sm mb-4 line-clamp-2">{product.description}</p>
      
      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl font-bold text-white">{formatCurrency(product.price)}</span>
        <span className="text-sm text-slate-400">{product.stock_quantity} in stock</span>
      </div>
      
      <div className="flex space-x-2">
        <button
          onClick={onEdit}
          className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-sm border border-slate-700 text-slate-300 bg-transparent hover:bg-slate-800 rounded-md transition-colors"
        >
          <EditIcon className="h-3 w-3" />
          <span>Edit</span>
        </button>
        <button
          className="flex items-center justify-center px-3 py-2 text-sm border border-slate-700 text-slate-300 bg-transparent hover:bg-slate-800 rounded-md transition-colors"
        >
          <EyeIcon className="h-3 w-3" />
        </button>
        <button
          onClick={onDelete}
          className="flex items-center justify-center px-3 py-2 text-sm border border-red-500/50 text-red-400 bg-transparent hover:bg-red-500/10 rounded-md transition-colors"
        >
          <TrashIcon className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

// Orders Table Component
function OrdersTable({ 
  orders, 
  formatCurrency, 
  formatDate 
}: { 
  orders: Order[];
  formatCurrency: (amount: number) => string;
  formatDate: (date: string) => string;
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-800/50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                  #{order.id.slice(-8)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-white">{order.customer_name}</div>
                    <div className="text-sm text-slate-400">{order.customer_email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                  {formatDate(order.created_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                  {formatCurrency(order.total_amount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'confirmed' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Customers Table Component
function CustomersTable({ 
  customers, 
  formatCurrency, 
  formatDate 
}: { 
  customers: Customer[];
  formatCurrency: (amount: number) => string;
  formatDate: (date: string) => string;
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Total Spent
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Orders
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                Joined
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-slate-800/50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-white">{customer.name}</div>
                    <div className="text-sm text-slate-400">{customer.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                  {formatCurrency(customer.total_spent)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                  {customer.orders_count}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                  {formatDate(customer.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Product Modal Component
interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  onSave: (data: any) => Promise<void>;
}

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, product, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
    category: 'General',
    type: 'Physical'
  });
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  // Handle image upload with compression
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Limit to 5 images maximum
    const totalImages = images.length + existingImages.length;
    const remainingSlots = 5 - totalImages;
    const filesToAdd = files.slice(0, remainingSlots);

    // Compress and resize images before adding
    filesToAdd.forEach(async (file) => {
      // Check file size (limit to 2MB per file)
      if (file.size > 2 * 1024 * 1024) {
        alert(`Image ${file.name} is too large. Please select images smaller than 2MB.`);
        return;
      }

      const compressedFile = await compressImage(file, 800, 600, 0.7); // Compress to max 800x600 with 70% quality
      setImages(prev => [...prev, compressedFile]);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviewUrls(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(compressedFile);
    });
  };

  // Image compression function
  const compressImage = (file: File, maxWidth: number, maxHeight: number, quality: number): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg', // Convert to JPEG for better compression
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            resolve(file); // Fallback to original if compression fails
          }
        }, 'image/jpeg', quality);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  // Remove image
  const removeImage = (index: number, isExisting: boolean = false) => {
    if (isExisting) {
      setExistingImages(prev => prev.filter((_, i) => i !== index));
    } else {
      setImages(prev => prev.filter((_, i) => i !== index));
      setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
    }
  };

  useEffect(() => {
    if (product) {
      console.log('🔍 ProductModal: Received product for editing:', product);
      console.log('🔍 ProductModal: Product category:', product.category);
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        stock_quantity: product.stock_quantity?.toString() || '',
        category: product.category || 'General',
        type: 'Physical'
      });
      console.log('🔍 ProductModal: Form initialized with category:', product.category || 'General');
      // Reset images for existing product editing
      setImages([]);
      setImagePreviewUrls([]);
      setExistingImages(product.images || []); // Load existing images
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        stock_quantity: '',
        category: 'General',
        type: 'Physical'
      });
      // Reset images for new product
      setImages([]);
      setImagePreviewUrls([]);
      setExistingImages([]);
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.price) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      let imageUrls: string[] = [...existingImages]; // Keep existing images

      // DEBUG: Affiche la catégorie sélectionnée
      console.log('Catégorie envoyée au backend :', formData.category);

      // Upload new images if any
      if (images.length > 0) {
        console.log('📤 Uploading images...');
        
        // Option 1: Upload to a temporary backend endpoint
        const uploadPromises = images.map(async (file) => {
          const formData = new FormData();
          formData.append('image', file);
          
          const response = await fetch('/api/upload-image', {
            method: 'POST',
            body: formData,
          });
          
          if (!response.ok) {
            throw new Error(`Image upload failed: ${response.statusText}`);
          }
          
          const data = await response.json();
          return data.filename;
        });
        
        try {
          const newImageUrls = await Promise.all(uploadPromises);
          imageUrls = [...imageUrls, ...newImageUrls];
          console.log('✅ Images uploaded successfully:', newImageUrls);
        } catch (uploadError) {
          console.warn('⚠️ Image upload failed, creating product without images:', uploadError);
          // Continue with product creation even if image upload fails
        }
      }

      const submitData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock_quantity) || 0,
        category: formData.category,
        type: formData.type,
        image: imageUrls.length > 0 ? imageUrls[0] : null, // Use first image as primary
        images: imageUrls, // Store all image URLs
      };

      console.log('📦 Sending product data:', submitData);
      await onSave(submitData);
    } catch (error) {
      console.error('❌ Product creation failed:', error);
      alert('Failed to create product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h3 className="text-lg font-semibold text-white">
            {product ? 'Edit Product' : 'Add New Product'}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter product name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter product description"
              required
            />
          </div>

          {/* Product Images Section */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Product Images (Max 5)
            </label>
            
            {/* Image Upload Area */}
            <div className="border-2 border-dashed border-slate-600 rounded-lg p-4 text-center">
              <input
                type="file"
                id="image-upload"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={images.length + existingImages.length >= 5}
              />
              <label
                htmlFor="image-upload"
                className={`cursor-pointer ${
                  images.length + existingImages.length >= 5
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:text-blue-400'
                }`}
              >
                <div className="flex flex-col items-center space-y-2">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <p className="text-sm text-slate-400">
                    {images.length + existingImages.length >= 5
                      ? 'Maximum 5 images reached'
                      : 'Click to upload images or drag and drop'
                    }
                  </p>
                  <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB each</p>
                </div>
              </label>
            </div>

            {/* Image Previews */}
            {(imagePreviewUrls.length > 0 || existingImages.length > 0) && (
              <div className="mt-4">
                <p className="text-sm text-slate-400 mb-2">Selected Images:</p>
                <div className="grid grid-cols-3 gap-3">
                  {/* Existing Images */}
                  {existingImages.map((imageUrl, index) => (
                    <div key={`existing-${index}`} className="relative group">
                      <img
                        src={imageUrl}
                        alt={`Existing ${index + 1}`}
                        className="w-full h-20 object-cover rounded-md border border-slate-600"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index, true)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  
                  {/* New Images */}
                  {imagePreviewUrls.map((url, index) => (
                    <div key={`new-${index}`} className="relative group">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-20 object-cover rounded-md border border-slate-600"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index, false)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Price (€) *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Stock Quantity
              </label>
              <input
                type="number"
                value={formData.stock_quantity}
                onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Category
              </label>
              {/* Liste dynamique des catégories, identique à Marketplace */}
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {[
                  "General", "SaaS", "Services", "Hardware", "Marketing", "Design", "Développement", "Éducation", "Santé", "Finance", "IA", "Marketplace", "E-commerce", "Mobilité", "Énergie", "Agriculture", "FoodTech", "LegalTech", "RH", "Tourisme", "Immobilier", "Transport", "Gaming", "Media", "Artisanat", "Mode", "Beauté", "Sport", "Bien-être", "Environnement", "Sécurité", "Logistique", "Assurance", "Crypto", "Blockchain", "Data", "Cloud", "IoT", "Robotics", "Autres"
                ].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Physical">Physical</option>
                <option value="Digital">Digital</option>
                <option value="Subscription">Subscription</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StartupDashboardNew;
