<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">My Shopping Lists</h1>
    
    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center items-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
    
    <!-- Error state -->
    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      <p>{{ error }}</p>
    </div>
    
    <!-- Empty state -->
    <div v-else-if="!lists.length" class="text-center py-6">
      <div class="text-gray-500 mb-4 max-w-md mx-auto">
        <div class="text-3xl mb-2">🛒</div>
        <h2 class="text-lg font-semibold mb-2">No Shopping Lists Yet</h2>
        <p class="mb-4 text-sm">Create your first shopping list to get started</p>
        <button 
          @click="showCreateModal = true" 
          class="btn btn-primary px-5"
        >
          Create Your First List
        </button>
      </div>
    </div>
    
    <!-- Lists display -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="list in lists" :key="list.id" class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
        <div class="p-5">
          <div class="flex justify-between items-start mb-3">
            <h2 class="text-xl font-semibold truncate" :title="list.title">{{ list.title }}</h2>
            <div class="flex space-x-2">
              <button @click="editList(list)" class="text-gray-500 hover:text-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button @click="confirmDelete(list)" class="text-gray-500 hover:text-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
          <p class="text-sm text-gray-500 mb-4">Created: {{ formatDate(list.createdAt) }}</p>
          <button 
            @click="openList(list)" 
            class="btn btn-primary w-full"
          >
            View List
          </button>
        </div>
      </div>
    </div>
    
    <!-- Floating action button -->
    <button 
      @click="showCreateModal = true"
      class="fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-lg transition duration-200 flex items-center justify-center"
      aria-label="Create new list"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    </button>
    
    <!-- Create/Edit Modal -->
    <div v-if="showCreateModal || showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div class="p-6">
          <h2 class="text-xl font-bold mb-4">{{ showEditModal ? 'Edit Shopping List' : 'Create New Shopping List' }}</h2>
          <form @submit.prevent="showEditModal ? updateShoppingList() : createShoppingList()">
            <div class="mb-4">
              <label for="title" class="block text-sm font-medium text-gray-700 mb-1">List Title</label>
              <input 
                type="text" 
                id="title" 
                v-model="formData.title" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter a title for your list"
                required
              >
            </div>
            <div class="flex justify-end space-x-3 mt-6">
              <button 
                type="button"
                @click="closeModal"
                class="btn btn-secondary"
              >
                Cancel
              </button>
              <button 
                type="submit"
                class="btn btn-primary"
              >
                {{ showEditModal ? 'Update' : 'Create' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    
    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div class="p-6">
          <h2 class="text-xl font-bold mb-2">Delete Shopping List</h2>
          <p class="text-gray-600 mb-6">Are you sure you want to delete "{{ listToDelete?.title }}"? This will also delete all items in this list and cannot be undone.</p>
          <div class="flex justify-end space-x-3">
            <button 
              @click="showDeleteModal = false"
              class="btn btn-secondary"
            >
              Cancel
            </button>
            <button 
              @click="deleteShoppingList"
              class="btn btn-danger"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useShoppingListStore, type ShoppingList } from '../stores/shoppingListStore'
import { useGroceryStore } from '../stores/groceryStore'

const router = useRouter()
const shoppingListStore = useShoppingListStore()
const groceryStore = useGroceryStore()

// State
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const listToDelete = ref<ShoppingList | null>(null)
const formData = ref({
  title: '',
  id: null as number | null
})

// Computed
const lists = computed(() => shoppingListStore.lists)
const loading = computed(() => shoppingListStore.loading)
const error = computed(() => shoppingListStore.error)

// Lifecycle
onMounted(async () => {
  await shoppingListStore.fetchLists()
})

// Methods
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date)
}

const openList = (list: ShoppingList) => {
  shoppingListStore.setCurrentList(list)
  groceryStore.setCurrentShoppingList(list.id)
  router.push({ name: 'groceryList', params: { id: list.id.toString() } })
}

const editList = (list: ShoppingList) => {
  formData.value = {
    title: list.title,
    id: list.id
  }
  showEditModal.value = true
}

const confirmDelete = (list: ShoppingList) => {
  listToDelete.value = list
  showDeleteModal.value = true
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  formData.value = {
    title: '',
    id: null
  }
}

const createShoppingList = async () => {
  if (!formData.value.title.trim()) return
  
  const newList = await shoppingListStore.createList({
    title: formData.value.title.trim()
  })
  
  if (newList) {
    closeModal()
    openList(newList)
  }
}

const updateShoppingList = async () => {
  if (!formData.value.id || !formData.value.title.trim()) return
  
  const updated = await shoppingListStore.updateList(formData.value.id, {
    title: formData.value.title.trim()
  })
  
  if (updated) {
    closeModal()
  }
}

const deleteShoppingList = async () => {
  if (!listToDelete.value) return
  
  const success = await shoppingListStore.deleteList(listToDelete.value.id)
  
  if (success) {
    showDeleteModal.value = false
    listToDelete.value = null
  }
}
</script> 