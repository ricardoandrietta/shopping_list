<template>
  <div class="px-4 sm:px-6 md:px-8 lg:px-10 py-8 max-w-7xl mx-auto">
    <!-- Main title with back button -->
    <div class="flex items-center mb-6">
      <router-link to="/" class="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full mr-4 text-gray-600 transition-colors hover:bg-gray-200">
        <i class="fas fa-arrow-left"></i>
      </router-link>
      <h1 class="text-3xl font-bold text-gray-800 m-0">{{ currentList ? currentList.title : 'Shopping List' }}</h1>
    </div>
    
    <!-- Controls section -->
    <div class="flex flex-wrap gap-4 items-center mb-6">
      <router-link :to="`/list/${id}/add`" class="text-blue-600 font-medium no-underline inline-flex items-center transition-colors hover:text-blue-800">
        + Add Item
      </router-link>
      
      <div class="flex flex-wrap gap-2 flex-1">
        <div class="flex max-w-xs">
          <input 
            type="text" 
            placeholder="Search items..." 
            class="border border-gray-300 rounded-l-md py-2 px-3 w-full text-sm"
            v-model="searchQuery"
          />
          <button class="bg-gray-100 border border-gray-300 border-l-0 rounded-r-md py-2 px-3 cursor-pointer transition-colors hover:bg-gray-200" @click="searchItems">
            <i class="fas fa-search"></i>
          </button>
        </div>
        
        <div class="flex gap-2">
          <select v-model="filterStatus" class="border border-gray-300 rounded-md py-2 px-3 text-sm bg-white min-w-[120px]">
            <option value="all">All Items</option>
            <option value="purchased">Purchased</option>
            <option value="not-purchased">Not Purchased</option>
          </select>
          
          <button class="bg-gray-100 border border-gray-300 rounded-md py-2 px-4 cursor-pointer transition-colors hover:bg-gray-200" @click="toggleSort">
            Sort
          </button>
        </div>
      </div>
    </div>
    
    <!-- Loading state -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <div class="border-t-4 border-b-4 border-blue-600 rounded-full w-8 h-8 animate-spin mr-4"></div>
      <p class="text-gray-500 text-base">Loading your grocery items...</p>
    </div>
    
    <!-- Error state -->
    <div v-else-if="error" class="bg-red-100 rounded-md p-4 mb-6">
      <div class="flex items-center">
        <i class="fas fa-exclamation-circle text-red-600 text-xl mr-3"></i>
        <p class="text-red-700 text-sm">{{ error }}</p>
      </div>
    </div>
    
    <!-- Empty state -->
    <div v-else-if="filteredItems.length === 0" class="text-center py-12 bg-white rounded-lg shadow-sm mb-4">
      <i class="fas fa-shopping-cart text-gray-300 text-5xl mb-4"></i>
      <p class="text-gray-500 text-lg mb-6">Your grocery list is empty.</p>
      <button 
        @click="router.push(`/list/${id}/add`)" 
        class="inline-flex items-center justify-center gap-2 py-3 px-8 shadow-lg bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 rounded-lg text-white font-medium transition-all duration-300 cursor-pointer"
      >
        <i class="fas fa-plus"></i>
        Add Your First Item
      </button>
    </div>
    
    <!-- Table with items -->
    <div v-else class="mb-8">
      <div class="rounded-lg overflow-hidden shadow-sm bg-white">
        <!-- Desktop table view -->
        <table class="w-full border-collapse hidden md:table">
          <thead>
            <tr>
              <th class="bg-gray-50 text-left py-3 px-4 font-semibold text-gray-600 border-b border-gray-200 w-20">Status</th>
              <th class="bg-gray-50 text-left py-3 px-4 font-semibold text-gray-600 border-b border-gray-200 min-w-[200px]">Item</th>
              <th class="bg-gray-50 text-right py-3 px-4 font-semibold text-gray-600 border-b border-gray-200 w-[100px]">Quantity</th>
              <th class="bg-gray-50 text-right py-3 px-4 font-semibold text-gray-600 border-b border-gray-200 w-[100px]">Price</th>
              <th class="bg-gray-50 text-center py-3 px-4 font-semibold text-gray-600 border-b border-gray-200 w-[100px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredItems" :key="item.id" class="border-b border-gray-200 last:border-b-0 transition-colors hover:bg-gray-50">
              <td class="py-3 px-4 text-center">
                <input 
                  type="checkbox"
                  :checked="item.purchased"
                  @change="togglePurchased(item.id)"
                  class="w-5 h-5 rounded cursor-pointer"
                />
              </td>
              <td class="py-3 px-4 font-medium" :class="{ 'line-through text-gray-400': item.purchased }">
                {{ item.name }}
              </td>
              <td class="py-3 px-4 text-right">
                {{ item.quantity }}
              </td>
              <td class="py-3 px-4 text-right">
                ${{ item.price ? item.price.toFixed(2) : '0.00' }}
              </td>
              <td class="py-3 px-4 text-center">
                <div class="flex justify-center gap-3">
                  <router-link :to="`/edit/${item.id}`" class="flex items-center justify-center w-8 h-8 text-blue-600 bg-blue-50 rounded transition-colors hover:bg-blue-100 border-none" title="Edit">
                    <i class="fas fa-pencil-alt"></i>
                  </router-link>
                  <button @click="deleteItem(item.id)" class="flex items-center justify-center w-8 h-8 text-red-600 bg-red-50 rounded transition-colors hover:bg-red-100 border-none" title="Delete">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        
        <!-- Mobile card view -->
        <div class="md:hidden">
          <div 
            v-for="item in filteredItems" 
            :key="item.id" 
            class="border-b border-gray-200 last:border-b-0 p-4"
            :class="{ 'bg-gray-50': item.purchased }"
          >
            <div class="flex items-center mb-3">
              <div class="mr-3">
                <input 
                  type="checkbox"
                  :checked="item.purchased"
                  @change="togglePurchased(item.id)"
                  class="w-5 h-5 rounded cursor-pointer"
                />
              </div>
              <div class="font-semibold text-lg text-gray-900" :class="{ 'line-through text-gray-400': item.purchased }">
                {{ item.name }}
              </div>
            </div>
            
            <div class="mb-4 pl-9">
              <div class="flex justify-between mb-2">
                <span class="text-gray-500 text-sm">Quantity:</span>
                <span class="font-medium">{{ item.quantity }}</span>
              </div>
              
              <div class="flex justify-between mb-2">
                <span class="text-gray-500 text-sm">Price:</span>
                <span class="font-medium">${{ item.price ? item.price.toFixed(2) : '0.00' }}</span>
              </div>
            </div>
            
            <div class="flex justify-end gap-3">
              <router-link :to="`/edit/${item.id}`" class="flex items-center justify-center py-2 px-3 text-sm text-blue-600 bg-blue-50 rounded transition-colors hover:bg-blue-100" title="Edit">
                <i class="fas fa-pencil-alt mr-1"></i> Edit
              </router-link>
              <button @click="deleteItem(item.id)" class="flex items-center justify-center py-2 px-3 text-sm text-red-600 bg-red-50 rounded transition-colors hover:bg-red-100" title="Delete">
                <i class="fas fa-trash mr-1"></i> Delete
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Pagination -->
      <div class="flex justify-between items-center py-3 px-4 bg-gray-50 border-t border-gray-200 md:flex-row flex-col gap-3 md:gap-0">
        <div class="text-sm text-gray-500">
          Showing {{ filteredItems.length }} items
        </div>
        <div class="flex gap-1 md:w-auto w-full justify-between">
          <button 
            class="py-1.5 px-3 bg-white border border-gray-300 rounded text-sm text-gray-600 cursor-pointer hover:bg-gray-100 disabled:opacity-50 disabled:cursor-default" 
            :disabled="currentPage <= 1"
            @click="prevPage"
          >
            Previous
          </button>
          <button class="py-1.5 px-3 bg-blue-600 border border-blue-600 rounded text-sm text-white font-medium">
            {{ currentPage }}
          </button>
          <button 
            class="py-1.5 px-3 bg-white border border-gray-300 rounded text-sm text-gray-600 cursor-pointer hover:bg-gray-100 disabled:opacity-50 disabled:cursor-default"
            :disabled="currentPage >= totalPages"
            @click="nextPage"  
          >
            Next
          </button>
        </div>
      </div>
    </div>
    
    <!-- Shopping Summary Section -->
    <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">Shopping Summary</h2>
      <hr class="border-0 h-px bg-gray-200 mb-6">
      
      <div class="flex items-center mb-5">
        <div class="w-10 h-10 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 mr-4 text-base">
          <i class="fas fa-shopping-cart"></i>
        </div>
        <div class="flex-1">
          <div class="text-sm text-gray-500 mb-1">Total Items</div>
          <div class="text-2xl font-semibold text-gray-900">{{ totalItems }}</div>
        </div>
      </div>
      
      <div class="flex items-center mb-5">
        <div class="w-10 h-10 flex items-center justify-center rounded-full bg-orange-50 text-orange-600 mr-4 text-base">
          <i class="fas fa-cart-plus"></i>
        </div>
        <div class="flex-1">
          <div class="text-sm text-gray-500 mb-1">Items to Buy</div>
          <div class="text-2xl font-semibold text-gray-900">{{ unpurchasedItems }}</div>
        </div>
      </div>
      
      <div class="flex items-center">
        <div class="w-10 h-10 flex items-center justify-center rounded-full bg-green-50 text-green-600 mr-4 text-base">
          <i class="fas fa-check-circle"></i>
        </div>
        <div class="flex-1">
          <div class="text-sm text-gray-500 mb-1">Items Purchased</div>
          <div class="text-2xl font-semibold text-gray-900">{{ purchasedItems }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useGroceryStore } from '../stores/groceryStore';
import { useShoppingListStore } from '../stores/shoppingListStore';

const route = useRoute();
const router = useRouter();
const id = computed(() => route.params.id);
const groceryStore = useGroceryStore();
const shoppingListStore = useShoppingListStore();
const dataLoaded = ref(false);
const searchQuery = ref('');
const filterStatus = ref('all');
const sortDirection = ref('asc');
const currentPage = ref(1);
const itemsPerPage = ref(5);

// Computed properties for reactive data
const items = computed(() => groceryStore.items);
const loading = computed(() => groceryStore.loading || shoppingListStore.loading);
const error = computed(() => groceryStore.error || shoppingListStore.error);
const totalItems = computed(() => groceryStore.totalItems);
const purchasedItems = computed(() => groceryStore.purchasedItems);
const unpurchasedItems = computed(() => groceryStore.unpurchasedItems);
const currentList = computed(() => shoppingListStore.currentList);

// Filtered and sorted items
const filteredItems = computed(() => {
  let result = [...items.value];
  
  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(item => 
      item.name.toLowerCase().includes(query)
    );
  }
  
  // Apply status filter
  if (filterStatus.value === 'purchased') {
    result = result.filter(item => item.purchased);
  } else if (filterStatus.value === 'not-purchased') {
    result = result.filter(item => !item.purchased);
  }
  
  // Apply sorting
  result.sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    
    if (sortDirection.value === 'asc') {
      return nameA.localeCompare(nameB);
    } else {
      return nameB.localeCompare(nameA);
    }
  });
  
  return result;
});

// Pagination
const totalPages = computed(() => {
  return Math.ceil(filteredItems.value.length / itemsPerPage.value);
});

const paginatedItems = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  const endIndex = startIndex + itemsPerPage.value;
  return filteredItems.value.slice(startIndex, endIndex);
});

// Methods
const togglePurchased = (id) => {
  groceryStore.togglePurchased(id);
};

const deleteItem = (id) => {
  if (confirm('Are you sure you want to delete this item?')) {
    groceryStore.deleteItem(id);
  }
};

const searchItems = () => {
  currentPage.value = 1; // Reset to first page when searching
};

const toggleSort = () => {
  sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

// Load data
onMounted(async () => {
  if (id.value) {
    // Set the current shopping list ID
    groceryStore.setCurrentShoppingList(parseInt(id.value));
    
    // Fetch the shopping list details
    await shoppingListStore.fetchList(parseInt(id.value));
    
    dataLoaded.value = true;
  }
});
</script>