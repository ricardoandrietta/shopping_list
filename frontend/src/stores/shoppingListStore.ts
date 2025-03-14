import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export interface ShoppingList {
  id: number
  title: string
  createdAt: string
  updatedAt: string
}

// Create an axios instance with the correct base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/shopping-lists` : '/api/shopping-lists',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const useShoppingListStore = defineStore('shoppingList', () => {
  const lists = ref<ShoppingList[]>([])
  const currentList = ref<ShoppingList | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed properties
  const totalLists = computed(() => lists.value.length)

  // Actions
  const fetchLists = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get<ShoppingList[]>('/')
      lists.value = response.data
    } catch (err: any) {
      console.error('Error fetching shopping lists:', err)
      error.value = err.message || 'Failed to fetch shopping lists'
    } finally {
      loading.value = false
    }
  }

  const fetchList = async (id: number) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.get<ShoppingList>(`/${id}`)
      currentList.value = response.data
      return response.data
    } catch (err: any) {
      console.error(`Error fetching shopping list ${id}:`, err)
      error.value = err.message || 'Failed to fetch shopping list'
      return null
    } finally {
      loading.value = false
    }
  }

  const createList = async (list: Omit<ShoppingList, 'id' | 'createdAt' | 'updatedAt'>) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.post<ShoppingList>('/', list)
      lists.value.unshift(response.data)
      return response.data
    } catch (err: any) {
      console.error('Error creating shopping list:', err)
      error.value = err.message || 'Failed to create shopping list'
      return null
    } finally {
      loading.value = false
    }
  }

  const updateList = async (id: number, updates: Partial<ShoppingList>) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.put<ShoppingList>(`/${id}`, updates)
      
      // Update in lists array
      const index = lists.value.findIndex(list => list.id === id)
      if (index !== -1) {
        lists.value[index] = response.data
      }
      
      // Update current list if it's the one being edited
      if (currentList.value && currentList.value.id === id) {
        currentList.value = response.data
      }
      
      return response.data
    } catch (err: any) {
      console.error(`Error updating shopping list ${id}:`, err)
      error.value = err.message || 'Failed to update shopping list'
      return null
    } finally {
      loading.value = false
    }
  }

  const deleteList = async (id: number) => {
    loading.value = true
    error.value = null
    
    try {
      await api.delete(`/${id}`)
      
      // Remove from lists array
      lists.value = lists.value.filter(list => list.id !== id)
      
      // Clear current list if it's the one being deleted
      if (currentList.value && currentList.value.id === id) {
        currentList.value = null
      }
      
      return true
    } catch (err: any) {
      console.error(`Error deleting shopping list ${id}:`, err)
      error.value = err.message || 'Failed to delete shopping list'
      return false
    } finally {
      loading.value = false
    }
  }

  const setCurrentList = (list: ShoppingList | null) => {
    currentList.value = list
  }

  return {
    lists,
    currentList,
    loading,
    error,
    totalLists,
    fetchLists,
    fetchList,
    createList,
    updateList,
    deleteList,
    setCurrentList
  }
}) 