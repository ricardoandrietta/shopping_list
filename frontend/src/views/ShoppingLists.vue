<template>
  <!-- Template starts here -->
  <div class="px-4 sm:px-6 md:px-8 lg:px-10 py-8 bg-gray-100">
    <div class="max-w-7xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800">My Shopping Lists</h1>
        <button 
          @click="showCreateModal = true"
          class="px-4 py-3 cursor-pointer rounded-lg font-medium transition-all duration-300 flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:from-blue-700 hover:to-indigo-800 shadow-sm hover:shadow focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:outline-none px-5 hidden md:flex"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          New List
        </button>
      </div>
      
      <!-- Loading state -->
      <div v-if="loading" class="flex flex-col justify-center items-center py-20">
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
        <p class="text-gray-600 font-medium">Loading your shopping lists...</p>
      </div>
      
      <!-- Error state -->
      <div v-else-if="error" class="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-5 rounded-lg mb-8 max-w-2xl mx-auto shadow-sm">
        <div class="flex items-center mb-1">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 class="font-semibold text-red-800">Error Loading Lists</h3>
        </div>
        <p>{{ error }}</p>
      </div>
      
      <!-- Empty state -->
      <div v-else-if="!lists.length" class="text-center py-16">
        <div class="bg-white rounded-xl shadow-md border border-gray-100 p-10 max-w-md mx-auto">
          <div class="bg-blue-50 rounded-full p-4 w-24 h-24 flex items-center justify-center mx-auto mb-8">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold mb-4 text-gray-800">No Shopping Lists Yet</h2>
          <p class="mb-8 text-gray-600 max-w-xs mx-auto">Create your first shopping list to get started tracking your grocery needs</p>
          <button 
            @click="showCreateModal = true" 
            class="btn btn-primary px-8 py-4 mx-auto cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create Your First List
          </button>
        </div>
      </div>
      
      <!-- Lists display -->
      <div v-else class="flex justify-center w-full">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-10xl mx-auto">
          <div v-for="list in lists" :key="list.id" class="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group w-full max-w-sm">
            <div class="p-6">
              <div class="flex justify-between items-start mb-4">
                <h2 class="text-xl font-semibold truncate text-gray-800 pr-4 max-w-[70%]" :title="list.title">{{ list.title }}</h2>
                <div class="flex space-x-2 ml-auto">
                  <button @click="editList(list)" class="text-gray-400 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-blue-50">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button @click="confirmDelete(list)" class="text-gray-400 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-red-50">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <div class="flex items-center mb-4 text-sm text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span class="truncate">Created: {{ formatDate(list.createdAt) }}</span>
              </div>
              <div>
                <button 
                  @click="openList(list)" 
                  class="flex cursor-pointer items-center justify-center h-10 py-2 shadow-lg bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 rounded-lg text-white font-medium w-full"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  View
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Floating action button (mobile only) -->
    <button 
      @click="showCreateModal = true"
      class="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center md:hidden"
      aria-label="Create new list"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    </button>
    
    <!-- Create/Edit Modal -->
    <div v-if="showCreateModal || showEditModal" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md transform transition-all animate-fadeIn">
        <div class="flex justify-between items-center border-b border-gray-100 px-8 py-5">
          <h2 class="text-xl font-bold text-gray-800">{{ showEditModal ? 'Edit Shopping List' : 'Create New Shopping List' }}</h2>
          <button 
            @click="closeModal" 
            class="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-8">
          <form @submit.prevent="showEditModal ? updateShoppingList() : createShoppingList()">
            <div class="mb-6">
              <label for="title" class="block text-sm font-medium text-gray-700 mb-2">List Title</label>
              <input 
                type="text" 
                id="title" 
                v-model="formData.title" 
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Enter a title for your list"
                required
                autofocus
              >
            </div>
            <div class="flex justify-end space-x-4 mt-8">
              <button 
                type="button"
                @click="closeModal"
                class="btn btn-secondary px-6"
              >
                Cancel
              </button>
              <button 
                type="submit"
                class="btn btn-primary px-6"
              >
                {{ showEditModal ? 'Update' : 'Create' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    
    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md transform transition-all animate-fadeIn">
        <div class="p-8">
          <div class="flex items-center justify-center mb-6 text-red-500 bg-red-50 rounded-full p-5 w-24 h-24 mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold mb-4 text-center text-gray-800">Delete Shopping List</h2>
          <p class="mb-8 text-gray-600 text-center">Are you sure you want to delete "<span class="font-medium">{{ listToDelete?.title }}</span>"? This will also delete all items in this list and cannot be undone.</p>
          <div class="flex justify-center space-x-5">
            <button 
              @click="showDeleteModal = false"
              class="btn btn-secondary px-8"
            >
              Cancel
            </button>
            <button 
              @click="deleteShoppingList"
              class="btn btn-danger px-8"
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