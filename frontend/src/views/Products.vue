<template>
  <div class="container mx-auto px-4 py-6">
    <div class="flex flex-col md:flex-row justify-between items-center mb-6">
      <h1 class="text-2xl font-bold mb-4 md:mb-0">Products</h1>
      <div class="flex space-x-4">
        <div class="flex items-center space-x-2">
          <button 
            @click="setFilter('all')" 
            class="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-4 py-2 rounded-md flex items-center shadow-sm hover:shadow transition-all duration-300"
            :class="currentFilter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'"
          >
            All
          </button>
          <button 
            @click="setFilter('favorite')" 
            class="px-4 py-2 rounded-md transition-all duration-300"
            :class="currentFilter === 'favorite' ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'"
          >
            Favorites
          </button>
        </div>
        <button 
          @click="openAddProductModal" 
          class="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-4 py-2 rounded-md flex items-center shadow-sm hover:shadow transition-all duration-300"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Product
        </button>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="productStore.loading" class="flex justify-center items-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <!-- Error state -->
    <div v-else-if="productStore.error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
      <span class="block sm:inline">{{ productStore.error }}</span>
    </div>

    <!-- Empty state -->
    <div v-else-if="productStore.filteredProducts.length === 0" class="text-center py-8">
      <p class="text-gray-500 text-lg">
        {{ currentFilter === 'favorite' ? 'No favorite products found.' : 'No products found.' }}
      </p>
      <button 
        v-if="currentFilter === 'favorite'" 
        @click="setFilter('all')" 
        class="mt-4 text-blue-500 hover:underline"
      >
        View all products
      </button>
    </div>

    <!-- Products table -->
    <div v-else class="overflow-x-auto">
      <table class="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
        <thead class="bg-gray-100">
          <tr>
            <th class="py-3 px-4 text-left">Name</th>
            <th class="py-3 px-4 text-left hidden md:table-cell">Brand</th>
            <th class="py-3 px-4 text-left hidden md:table-cell">Price</th>
            <th class="py-3 px-4 text-left hidden md:table-cell">Barcode</th>
            <th class="py-3 px-4 text-center">Favorite</th>
            <th class="py-3 px-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in productStore.filteredProducts" :key="product.id" class="border-t border-gray-200 hover:bg-gray-50">
            <td class="py-3 px-4">{{ product.name }}</td>
            <td class="py-3 px-4 hidden md:table-cell">{{ product.brand || '-' }}</td>
            <td class="py-3 px-4 hidden md:table-cell">{{ product.price ? `$${product.price.toFixed(2)}` : '-' }}</td>
            <td class="py-3 px-4 hidden md:table-cell">{{ product.barcode || '-' }}</td>
            <td class="py-3 px-4 text-center">
              <button @click="toggleFavorite(product.id)" class="focus:outline-none">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  class="h-6 w-6" 
                  viewBox="0 0 24 24" 
                  :fill="product.favorite ? 'currentColor' : 'white'"
                  :stroke="product.favorite ? 'currentColor' : '#9CA3AF'"
                  :class="product.favorite ? 'text-yellow-500' : 'text-gray-400'"
                >
                  <path 
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    stroke-width="1.5" 
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </button>
            </td>
            <td class="py-3 px-4 text-center">
              <div class="flex justify-center space-x-2">
                <button 
                  @click="openEditProductModal(product)" 
                  class="text-blue-500 hover:text-blue-700 focus:outline-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
                <button 
                  @click="openAddToShoppingListModal(product)" 
                  class="text-green-500 hover:text-green-700 focus:outline-none"
                  title="Add to Shopping List"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                  </svg>
                </button>
                <button 
                  @click="confirmDelete(product)" 
                  class="text-red-500 hover:text-red-700 focus:outline-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Floating action button (mobile only) -->
    <button 
      @click="openAddProductModal"
      class="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center md:hidden"
      aria-label="Add new product"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    </button>

    <!-- Add/Edit Product Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md transform transition-all animate-fadeIn">
        <div class="flex justify-between items-center border-b border-gray-100 px-8 py-5">
          <h2 class="text-xl font-bold text-gray-800">{{ isEditing ? 'Edit Product' : 'Add New Product' }}</h2>
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
          <form @submit.prevent="submitForm">
            <!-- Name field -->
            <div class="mb-4">
              <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input 
                type="text" 
                id="name" 
                v-model="formData.name" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
            </div>
            
            <!-- Brand field -->
            <div class="mb-4">
              <label for="brand" class="block text-sm font-medium text-gray-700 mb-1">Brand</label>
              <input 
                type="text" 
                id="brand" 
                v-model="formData.brand" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>
            
            <!-- Price field -->
            <div class="mb-4">
              <label for="price" class="block text-sm font-medium text-gray-700 mb-1">Price</label>
              <input 
                type="number" 
                id="price" 
                v-model="formData.price" 
                step="0.01" 
                min="0"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>
            
            <!-- Barcode field -->
            <div class="mb-4">
              <label for="barcode" class="block text-sm font-medium text-gray-700 mb-1">Barcode</label>
              <div class="flex gap-2">
                <input 
                  type="text" 
                  id="barcode" 
                  v-model="formData.barcode" 
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                <router-link to="/products/scan" class="flex items-center justify-center px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-200 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                  Scan
                </router-link>
              </div>
            </div>
            
            <!-- Favorite field -->
            <div class="mb-6">
              <div class="flex items-center">
                <input 
                  type="checkbox" 
                  id="favorite" 
                  v-model="formData.favorite" 
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                >
                <label for="favorite" class="ml-2 block text-sm text-gray-700">Mark as favorite</label>
              </div>
            </div>
            
            <!-- Form buttons -->
            <div class="flex justify-end space-x-4 mt-8">
              <button 
                type="button" 
                @click="closeModal" 
                class="btn btn-secondary px-6"
              >
                Cancel
              </button>
              <button 
                v-if="!isEditing"
                type="button" 
                @click="submitAndContinue" 
                class="btn btn-primary px-6"
              >
                Add & Continue
              </button>
              <button 
                type="submit" 
                class="btn btn-primary px-6"
              >
                {{ isEditing ? 'Update' : 'Add & Exit' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md transform transition-all animate-fadeIn">
        <div class="p-8">
          <div class="flex items-center justify-center mb-6 text-red-500 bg-red-50 rounded-full p-5 w-24 h-24 mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold mb-4 text-center text-gray-800">Delete Product</h2>
          <p class="mb-8 text-gray-600 text-center">Are you sure you want to delete "<span class="font-medium">{{ productToDelete?.name }}</span>"? This action cannot be undone.</p>
          
          <div class="flex justify-center space-x-5">
            <button 
              @click="showDeleteModal = false" 
              class="btn btn-secondary px-8"
            >
              Cancel
            </button>
            <button 
              @click="deleteProduct" 
              class="btn btn-danger px-8"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Add to Shopping List Modal -->
    <div v-if="showShoppingListModal" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md transform transition-all animate-fadeIn">
        <div class="flex justify-between items-center border-b border-gray-100 px-8 py-5">
          <h2 class="text-xl font-bold text-gray-800">Add to Shopping List</h2>
          <button 
            @click="closeShoppingListModal" 
            class="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-8">
          <p class="mb-4 text-gray-600">
            Add "<span class="font-medium">{{ productToAddToList?.name }}</span>" to a shopping list:
          </p>
          
          <div v-if="shoppingListStore.loading" class="flex justify-center py-4">
            <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
          
          <div v-else-if="shoppingListStore.error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <span class="block sm:inline">{{ shoppingListStore.error }}</span>
          </div>
          
          <div v-else-if="shoppingListStore.lists.length === 0" class="text-center py-4">
            <p class="text-gray-500">No shopping lists found.</p>
            <button 
              @click="createNewShoppingList" 
              class="mt-4 text-blue-500 hover:underline"
            >
              Create a new shopping list
            </button>
          </div>
          
          <form v-else @submit.prevent="addToShoppingList">
            <div class="mb-6">
              <label for="shoppingList" class="block text-sm font-medium text-gray-700 mb-1">Select a shopping list *</label>
              <select 
                id="shoppingList" 
                v-model="selectedShoppingListId" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="" disabled>Select a list</option>
                <option v-for="list in shoppingListStore.lists" :key="list.id" :value="list.id">
                  {{ list.title }}
                </option>
              </select>
            </div>
            
            <div class="mb-6">
              <label for="quantity" class="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
              <input 
                type="number" 
                id="quantity" 
                v-model="quantity" 
                min="1" 
                step="1"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
            </div>
            
            <div class="flex justify-end space-x-4 mt-8">
              <button 
                type="button" 
                @click="closeShoppingListModal" 
                class="btn btn-secondary px-6"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                class="btn btn-primary px-6"
                :disabled="!selectedShoppingListId"
              >
                Add to List
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Success Notification -->
    <div 
      v-if="showSuccessNotification" 
      class="fixed bottom-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md transition-all duration-500 transform"
      :class="notificationAnimation"
    >
      <div class="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <p>{{ successMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useProductStore } from '../stores/productStore';
import { useShoppingListStore } from '../stores/shoppingListStore';
import { useGroceryStore } from '../stores/groceryStore';

const productStore = useProductStore();
const shoppingListStore = useShoppingListStore();
const groceryStore = useGroceryStore();
const currentFilter = computed(() => productStore.currentFilter);

// Form state
const showModal = ref(false);
const isEditing = ref(false);
const formData = ref({
  id: null as number | null,
  name: '',
  brand: '',
  price: null as number | null,
  barcode: '',
  favorite: false,
  user_id: 1 // Hardcoded for now
});

// Delete confirmation state
const showDeleteModal = ref(false);
const productToDelete = ref<{ id: number, name: string } | null>(null);

// Shopping list modal state
const showShoppingListModal = ref(false);
const productToAddToList = ref<any>(null);
const selectedShoppingListId = ref<number | null>(null);
const quantity = ref(1);

// Success notification state
const showSuccessNotification = ref(false);
const successMessage = ref('');
const notificationAnimation = ref('translate-y-0 opacity-100');

// Fetch products on component mount
onMounted(async () => {
  await productStore.fetchProducts();
  await shoppingListStore.fetchLists();
});

// Filter functions
const setFilter = (filter: 'all' | 'favorite') => {
  productStore.fetchProducts(filter);
};

// Modal functions
const openAddProductModal = () => {
  isEditing.value = false;
  formData.value = {
    id: null,
    name: '',
    brand: '',
    price: null,
    barcode: '',
    favorite: false,
    user_id: 1
  };
  
  // Check if there's a scanned barcode in localStorage
  const scannedBarcode = localStorage.getItem('scannedProductBarcode');
  if (scannedBarcode) {
    formData.value.barcode = scannedBarcode;
    localStorage.removeItem('scannedProductBarcode');
  }
  
  showModal.value = true;
  
  // Set focus on the name field after the modal is shown
  setTimeout(() => {
    document.getElementById('name')?.focus();
  }, 100);
};

const openEditProductModal = (product: any) => {
  isEditing.value = true;
  formData.value = {
    id: product.id,
    name: product.name,
    brand: product.brand || '',
    price: product.price,
    barcode: product.barcode || '',
    favorite: product.favorite,
    user_id: product.user_id
  };
  
  // Check if there's a scanned barcode in localStorage
  const scannedBarcode = localStorage.getItem('scannedProductBarcode');
  if (scannedBarcode) {
    formData.value.barcode = scannedBarcode;
    localStorage.removeItem('scannedProductBarcode');
  }
  
  showModal.value = true;
  
  // Set focus on the name field after the modal is shown
  setTimeout(() => {
    document.getElementById('name')?.focus();
  }, 100);
};

const closeModal = () => {
  showModal.value = false;
};

// Form submission
const submitForm = async () => {
  if (isEditing.value && formData.value.id) {
    await productStore.updateProduct(formData.value.id, {
      name: formData.value.name,
      brand: formData.value.brand || null,
      price: formData.value.price,
      barcode: formData.value.barcode || null,
      favorite: formData.value.favorite
    });
  } else {
    await productStore.createProduct({
      name: formData.value.name,
      brand: formData.value.brand || null,
      price: formData.value.price,
      barcode: formData.value.barcode || null,
      favorite: formData.value.favorite,
      user_id: formData.value.user_id
    });
  }
  
  closeModal();
};

const submitAndContinue = async () => {
  await productStore.createProduct({
    name: formData.value.name,
    brand: formData.value.brand || null,
    price: formData.value.price,
    barcode: formData.value.barcode || null,
    favorite: formData.value.favorite,
    user_id: formData.value.user_id
  });
  
  // Clear form but keep modal open
  formData.value = {
    id: null,
    name: '',
    brand: '',
    price: null,
    barcode: '',
    favorite: false,
    user_id: 1
  };
  
  // Set focus on the name field after form reset
  setTimeout(() => {
    document.getElementById('name')?.focus();
  }, 100);
};

// Favorite toggle
const toggleFavorite = async (id: number) => {
  await productStore.toggleFavorite(id);
};

// Delete functions
const confirmDelete = (product: any) => {
  productToDelete.value = {
    id: product.id,
    name: product.name
  };
  showDeleteModal.value = true;
};

const deleteProduct = async () => {
  if (productToDelete.value) {
    await productStore.deleteProduct(productToDelete.value.id);
    showDeleteModal.value = false;
    productToDelete.value = null;
  }
};

// Shopping list functions
const openAddToShoppingListModal = (product: any) => {
  productToAddToList.value = product;
  selectedShoppingListId.value = null;
  quantity.value = 1;
  showShoppingListModal.value = true;
};

const closeShoppingListModal = () => {
  showShoppingListModal.value = false;
  productToAddToList.value = null;
  selectedShoppingListId.value = null;
};

const createNewShoppingList = async () => {
  const newList = await shoppingListStore.createList({
    title: 'New Shopping List'
  });
  
  if (newList) {
    selectedShoppingListId.value = newList.id;
  }
};

const addToShoppingList = async () => {
  if (!productToAddToList.value || !selectedShoppingListId.value) return;
  
  const result = await groceryStore.addItem({
    name: productToAddToList.value.name,
    quantity: quantity.value,
    price: productToAddToList.value.price,
    barcode: productToAddToList.value.barcode,
    purchased: false,
    shopping_list_id: selectedShoppingListId.value
  });
  
  if (result) {
    // Show success notification
    const listName = shoppingListStore.lists.find(list => list.id === selectedShoppingListId.value)?.title;
    successMessage.value = `Added ${productToAddToList.value.name} to ${listName}`;
    showSuccessNotification.value = true;
    notificationAnimation.value = 'translate-y-0 opacity-100';
    
    // Hide notification after 3 seconds
    setTimeout(() => {
      notificationAnimation.value = 'translate-y-4 opacity-0';
      setTimeout(() => {
        showSuccessNotification.value = false;
      }, 500);
    }, 3000);
    
    closeShoppingListModal();
  }
};
</script> 