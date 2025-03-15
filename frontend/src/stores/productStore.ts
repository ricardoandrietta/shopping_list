import { defineStore } from 'pinia';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface Product {
  id: number;
  name: string;
  brand: string | null;
  price: number | null;
  barcode: string | null;
  favorite: boolean;
  user_id: number;
  createdAt: string;
  updatedAt: string;
}

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [] as Product[],
    loading: false,
    error: null as string | null,
    currentFilter: 'all' as 'all' | 'favorite'
  }),
  
  getters: {
    filteredProducts: (state) => {
      if (state.currentFilter === 'favorite') {
        return state.products.filter(product => product.favorite);
      }
      return state.products;
    }
  },
  
  actions: {
    async fetchProducts(filter: 'all' | 'favorite' = 'all') {
      this.loading = true;
      this.error = null;
      this.currentFilter = filter;
      
      try {
        const queryParams = filter === 'favorite' ? '?filter=favorite' : '';
        const response = await axios.get(`${API_URL}/api/products${queryParams}`);
        this.products = response.data;
      } catch (error) {
        console.error('Error fetching products:', error);
        this.error = 'Failed to fetch products';
      } finally {
        this.loading = false;
      }
    },
    
    async getProduct(id: number) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.get(`${API_URL}/api/products/${id}`);
        return response.data;
      } catch (error) {
        console.error('Error fetching product:', error);
        this.error = 'Failed to fetch product';
        return null;
      } finally {
        this.loading = false;
      }
    },
    
    async createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.post(`${API_URL}/api/products`, product);
        this.products.unshift(response.data);
        return response.data;
      } catch (error) {
        console.error('Error creating product:', error);
        this.error = 'Failed to create product';
        return null;
      } finally {
        this.loading = false;
      }
    },
    
    async updateProduct(id: number, product: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.put(`${API_URL}/api/products/${id}`, product);
        const index = this.products.findIndex(p => p.id === id);
        if (index !== -1) {
          this.products[index] = response.data;
        }
        return response.data;
      } catch (error) {
        console.error('Error updating product:', error);
        this.error = 'Failed to update product';
        return null;
      } finally {
        this.loading = false;
      }
    },
    
    async toggleFavorite(id: number) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.patch(`${API_URL}/api/products/${id}/favorite`);
        const index = this.products.findIndex(p => p.id === id);
        if (index !== -1) {
          this.products[index] = response.data;
        }
        return response.data;
      } catch (error) {
        console.error('Error toggling favorite status:', error);
        this.error = 'Failed to toggle favorite status';
        return null;
      } finally {
        this.loading = false;
      }
    },
    
    async deleteProduct(id: number) {
      this.loading = true;
      this.error = null;
      
      try {
        await axios.delete(`${API_URL}/api/products/${id}`);
        this.products = this.products.filter(p => p.id !== id);
        return true;
      } catch (error) {
        console.error('Error deleting product:', error);
        this.error = 'Failed to delete product';
        return false;
      } finally {
        this.loading = false;
      }
    }
  }
}); 