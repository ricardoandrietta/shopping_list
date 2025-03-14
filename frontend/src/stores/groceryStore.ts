import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export interface GroceryItem {
  id: number
  name: string
  quantity: number
  price: number
  barcode?: string
  purchased: boolean
  shopping_list_id?: number
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
  const currentShoppingListId = ref<number | null>(null)

  // Computed properties
  const totalItems = computed(() => items.value.length)
  const purchasedItems = computed(() => items.value.filter(item => item.purchased).length)
  const unpurchasedItems = computed(() => items.value.filter(item => !item.purchased).length)

  // Actions
  const fetchItems = async (shoppingListId?: number) => {
    loading.value = true
    error.value = null
    
    try {
      console.log('Fetching items from API...')
      const listId = shoppingListId || currentShoppingListId.value
      const url = listId ? `/?listId=${listId}` : '/'
      
      const response = await api.get<GroceryItem[]>(url)
      console.log('API response:', response.data)
      items.value = response.data
    } catch (err: any) {
      console.error('Error fetching items:', err)
      error.value = err.message || 'Failed to fetch items'
      
      // Update the debug fetch to use the correct path
      try {
        const statusCheck = await fetch('/api/groceries')
        console.log('API status check:', statusCheck.status, statusCheck.statusText)
      } catch (debugErr) {
        console.error('Debug fetch failed:', debugErr)
      }
    } finally {
      loading.value = false
    }
  }

  const addItem = async (item: Omit<GroceryItem, 'id'>) => {
    loading.value = true
    error.value = null
    
    // Add the current shopping list ID if it's set
    if (currentShoppingListId.value && !item.shopping_list_id) {
      item.shopping_list_id = currentShoppingListId.value
    }
    
    try {
      const response = await api.post<GroceryItem>('/', item)
      items.value.unshift(response.data)
      return response.data
    } catch (err: any) {
      console.error('Error adding item:', err)
      error.value = err.message || 'Failed to add item'
      return null
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
      return response.data
    } catch (err: any) {
      console.error(`Error updating item ${id}:`, err)
      error.value = err.message || 'Failed to update item'
      return null
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
      return true
    } catch (err: any) {
      console.error(`Error deleting item ${id}:`, err)
      error.value = err.message || 'Failed to delete item'
      return false
    } finally {
      loading.value = false
    }
  }

  const togglePurchased = async (id: number) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.patch<GroceryItem>(`/${id}/purchase`)
      const index = items.value.findIndex(item => item.id === id)
      if (index !== -1) {
        items.value[index] = response.data
      }
      return response.data
    } catch (err: any) {
      console.error(`Error toggling purchased status for item ${id}:`, err)
      error.value = err.message || 'Failed to update purchased status'
      return null
    } finally {
      loading.value = false
    }
  }

  const setCurrentShoppingList = (id: number | null) => {
    currentShoppingListId.value = id
    if (id) {
      fetchItems(id)
    }
  }

  return {
    items,
    loading,
    error,
    currentShoppingListId,
    totalItems,
    purchasedItems,
    unpurchasedItems,
    fetchItems,
    addItem,
    updateItem,
    deleteItem,
    togglePurchased,
    setCurrentShoppingList
  }
}) 