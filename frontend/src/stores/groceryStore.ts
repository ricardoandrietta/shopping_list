import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

interface GroceryItem {
  id: number
  name: string
  quantity: number
  price: number
  barcode?: string
  purchased: boolean
}

// Create an axios instance with the correct base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/groceries` : '/api/groceries',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const useGroceryStore = defineStore('grocery', () => {
  const items = ref<GroceryItem[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed properties
  const totalItems = computed(() => items.value.length)
  const purchasedItems = computed(() => items.value.filter(item => item.purchased).length)
  const unpurchasedItems = computed(() => items.value.filter(item => !item.purchased).length)

  // Actions
  const fetchItems = async () => {
    loading.value = true
    error.value = null
    
    try {
      console.log('Fetching items from API...')
      const response = await api.get<GroceryItem[]>('/')
      console.log('API response:', response.data)
      items.value = response.data
    } catch (err: any) {
      console.error('Error fetching items:', err)
      error.value = err.message || 'Failed to fetch items'
      
      // Update the debug fetch to use the correct path
      try {
        const statusCheck = await fetch('/api/groceries')
        console.log('API status check:', statusCheck.status, statusCheck.statusText)
      } catch (checkErr) {
        console.error('API unreachable:', checkErr)
      }
    } finally {
      loading.value = false
    }
  }

  const addItem = async (item: Omit<GroceryItem, 'id'>) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.post<GroceryItem>('/', item)
      items.value.push(response.data)
    } catch (err: any) {
      error.value = err.message || 'Failed to add item'
    } finally {
      loading.value = false
    }
  }

  const updateItem = async (id: number, updates: Partial<GroceryItem>) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.put<GroceryItem>(`/${id}`, updates)
      const index = items.value.findIndex(item => item.id === id)
      if (index !== -1) {
        items.value[index] = response.data
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to update item'
    } finally {
      loading.value = false
    }
  }

  const deleteItem = async (id: number) => {
    loading.value = true
    error.value = null
    
    try {
      await api.delete(`/${id}`)
      items.value = items.value.filter(item => item.id !== id)
    } catch (err: any) {
      error.value = err.message || 'Failed to delete item'
    } finally {
      loading.value = false
    }
  }

  const togglePurchased = async (id: number) => {
    const item = items.value.find(item => item.id === id)
    if (item) {
      try {
        await api.patch(`/${id}/purchase`)
        const index = items.value.findIndex(i => i.id === id)
        if (index !== -1) {
          items.value[index].purchased = !items.value[index].purchased
        }
      } catch (err: any) {
        error.value = err.message || 'Failed to toggle purchased status'
      }
    }
  }

  return {
    items,
    loading,
    error,
    totalItems,
    purchasedItems,
    unpurchasedItems,
    fetchItems,
    addItem,
    updateItem,
    deleteItem,
    togglePurchased
  }
}) 