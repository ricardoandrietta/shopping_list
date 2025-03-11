<template>
  <div class="grocery-container">
    <!-- Main title -->
    <h1 class="page-title">My Grocery List</h1>
    
    <!-- Controls section -->
    <div class="controls-section">
      <router-link to="/add" class="add-button">
        + Add Item
      </router-link>
      
      <div class="search-filter-container">
        <div class="search-container">
          <input 
            type="text" 
            placeholder="Search items..." 
            class="search-input"
            v-model="searchQuery"
          />
          <button class="search-button" @click="searchItems">
            <i class="fas fa-search"></i>
          </button>
        </div>
        
        <div class="filter-sort-container">
          <select v-model="filterStatus" class="filter-select">
            <option value="all">All Items</option>
            <option value="purchased">Purchased</option>
            <option value="not-purchased">Not Purchased</option>
          </select>
          
          <button class="sort-button" @click="toggleSort">
            Sort
          </button>
        </div>
      </div>
    </div>
    
    <!-- Loading state -->
    <div v-if="loading" class="loading-container">
      <div class="loader"></div>
      <p class="loading-text">Loading your grocery items...</p>
    </div>
    
    <!-- Error state -->
    <div v-else-if="error" class="error-container">
      <div class="error-content">
        <i class="fas fa-exclamation-circle error-icon"></i>
        <p class="error-text">{{ error }}</p>
      </div>
    </div>
    
    <!-- Empty state -->
    <div v-else-if="filteredItems.length === 0" class="empty-container">
      <i class="fas fa-shopping-cart empty-icon"></i>
      <p class="empty-text">Your grocery list is empty.</p>
      <router-link to="/add" class="empty-add-button">
        <i class="fas fa-plus"></i>
        Add Your First Item
      </router-link>
    </div>
    
    <!-- Table with items -->
    <div v-else class="table-section">
      <div class="table-container">
        <!-- Desktop table view -->
        <table class="grocery-table desktop-table">
          <thead>
            <tr>
              <th class="status-column">Status</th>
              <th class="item-column">Item</th>
              <th class="quantity-column">Quantity</th>
              <th class="price-column">Price</th>
              <th class="actions-column">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredItems" :key="item.id" class="table-row">
              <td class="status-cell">
                <input 
                  type="checkbox"
                  :checked="item.purchased"
                  @change="togglePurchased(item.id)"
                  class="status-checkbox"
                />
              </td>
              <td class="item-cell" :class="{ 'purchased': item.purchased }">
                {{ item.name }}
              </td>
              <td class="quantity-cell">
                {{ item.quantity }}
              </td>
              <td class="price-cell">
                ${{ item.price ? item.price.toFixed(2) : '0.00' }}
              </td>
              <td class="actions-cell">
                <div class="action-buttons">
                  <router-link :to="`/edit/${item.id}`" class="edit-button" title="Edit">
                    <i class="fas fa-pencil-alt"></i>
                  </router-link>
                  <button @click="deleteItem(item.id)" class="delete-button" title="Delete">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        
        <!-- Mobile card view -->
        <div class="mobile-cards">
          <div 
            v-for="item in filteredItems" 
            :key="item.id" 
            class="item-card"
            :class="{ 'purchased-card': item.purchased }"
          >
            <div class="card-header">
              <div class="card-status">
                <input 
                  type="checkbox"
                  :checked="item.purchased"
                  @change="togglePurchased(item.id)"
                  class="status-checkbox"
                />
              </div>
              <div class="card-title" :class="{ 'purchased': item.purchased }">
                {{ item.name }}
              </div>
            </div>
            
            <div class="card-details">
              <div class="card-detail">
                <span class="detail-label">Quantity:</span>
                <span class="detail-value">{{ item.quantity }}</span>
              </div>
              
              <div class="card-detail">
                <span class="detail-label">Price:</span>
                <span class="detail-value">${{ item.price ? item.price.toFixed(2) : '0.00' }}</span>
              </div>
            </div>
            
            <div class="card-actions">
              <router-link :to="`/edit/${item.id}`" class="edit-button" title="Edit">
                <i class="fas fa-pencil-alt"></i> Edit
              </router-link>
              <button @click="deleteItem(item.id)" class="delete-button" title="Delete">
                <i class="fas fa-trash"></i> Delete
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Pagination -->
      <div class="pagination-container">
        <div class="items-info">
          Showing {{ filteredItems.length }} items
        </div>
        <div class="pagination-controls">
          <button 
            class="page-button previous-button" 
            :disabled="currentPage <= 1"
            @click="prevPage"
          >
            Previous
          </button>
          <button class="page-number current-page">
            {{ currentPage }}
          </button>
          <button 
            class="page-button next-button"
            :disabled="currentPage >= totalPages"
            @click="nextPage"  
          >
            Next
          </button>
        </div>
      </div>
    </div>
    
    <!-- Shopping Summary Section -->
    <div class="summary-section">
      <h2 class="summary-title">Shopping Summary</h2>
      <hr class="summary-divider">
      
      <div class="summary-item">
        <div class="summary-icon">
          <i class="fas fa-shopping-cart"></i>
        </div>
        <div class="summary-content">
          <div class="summary-label">Total Items</div>
          <div class="summary-value">{{ totalItems }}</div>
        </div>
      </div>
      
      <div class="summary-item">
        <div class="summary-icon">
          <i class="fas fa-cart-plus"></i>
        </div>
        <div class="summary-content">
          <div class="summary-label">Items to Buy</div>
          <div class="summary-value">{{ unpurchasedItems }}</div>
        </div>
      </div>
      
      <div class="summary-item">
        <div class="summary-icon">
          <i class="fas fa-check-circle"></i>
        </div>
        <div class="summary-content">
          <div class="summary-label">Items Purchased</div>
          <div class="summary-value">{{ purchasedItems }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useGroceryStore } from '../stores/groceryStore';

const store = useGroceryStore();
const dataLoaded = ref(false);
const searchQuery = ref('');
const filterStatus = ref('all');
const sortDirection = ref('asc');
const currentPage = ref(1);
const itemsPerPage = ref(5);

// Computed properties for reactive data
const items = computed(() => store.items);
const loading = computed(() => store.loading);
const error = computed(() => store.error);
const totalItems = computed(() => store.totalItems);
const purchasedItems = computed(() => store.purchasedItems);
const unpurchasedItems = computed(() => store.unpurchasedItems);

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
  store.togglePurchased(id);
};

const deleteItem = (id) => {
  if (confirm('Are you sure you want to delete this item?')) {
    store.deleteItem(id);
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

const loadData = async () => {
  if (!dataLoaded.value) {
    try {
      await store.fetchItems();
      dataLoaded.value = true;
    } catch (err) {
      console.error('Error loading data:', err);
    }
  }
};

// Load data on component mount
onMounted(() => {
  loadData();
  
  // Add Font Awesome if it doesn't exist
  if (!document.getElementById('font-awesome-css')) {
    const link = document.createElement('link');
    link.id = 'font-awesome-css';
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
    document.head.appendChild(link);
  }
});
</script>

<style scoped>
.grocery-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.page-title {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 1.5rem;
}

.controls-section {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1.5rem;
}

.add-button {
  color: #4361ee;
  font-weight: 500;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  transition: color 0.2s;
}

.add-button:hover {
  color: #2541b2;
}

.search-filter-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  flex: 1;
}

.search-container {
  display: flex;
  max-width: 300px;
}

.search-input {
  border: 1px solid #d1d5db;
  border-radius: 0.25rem 0 0 0.25rem;
  padding: 0.5rem 0.75rem;
  width: 100%;
  font-size: 0.875rem;
}

.search-button {
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
  border-left: none;
  border-radius: 0 0.25rem 0.25rem 0;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.search-button:hover {
  background-color: #e5e7eb;
}

.filter-sort-container {
  display: flex;
  gap: 0.5rem;
}

.filter-select {
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  background-color: white;
  min-width: 120px;
}

.sort-button {
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.sort-button:hover {
  background-color: #e5e7eb;
}

/* Loading state */
.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 0;
}

.loader {
  border: 3px solid #f3f3f3;
  border-radius: 50%;
  border-top: 3px solid #4361ee;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin-right: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  color: #6b7280;
  font-size: 1rem;
}

/* Error state */
.error-container {
  background-color: #fee2e2;
  border-radius: 0.375rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.error-content {
  display: flex;
  align-items: center;
}

.error-icon {
  color: #dc2626;
  font-size: 1.25rem;
  margin-right: 0.75rem;
}

.error-text {
  color: #b91c1c;
  font-size: 0.875rem;
}

/* Empty state */
.empty-container {
  text-align: center;
  padding: 3rem 0;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.empty-icon {
  font-size: 3rem;
  color: #d1d5db;
  margin-bottom: 1rem;
}

.empty-text {
  color: #6b7280;
  font-size: 1.125rem;
  margin-bottom: 1.5rem;
}

.empty-add-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #4361ee;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 500;
  text-decoration: none;
  transition: background-color 0.2s;
}

.empty-add-button:hover {
  background-color: #2541b2;
}

/* Table styles */
.table-section {
  margin-bottom: 2rem;
}

.table-container {
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  background-color: white;
}

.grocery-table {
  width: 100%;
  border-collapse: collapse;
}

.grocery-table th {
  background-color: #f9fafb;
  text-align: left;
  padding: 0.75rem 1rem;
  font-weight: 600;
  color: #4b5563;
  border-bottom: 1px solid #e5e7eb;
}

.status-column {
  width: 80px;
}

.item-column {
  min-width: 200px;
}

.quantity-column, .price-column {
  width: 100px;
  text-align: right;
}

.actions-column {
  width: 100px;
  text-align: center;
}

.table-row {
  border-bottom: 1px solid #e5e7eb;
  transition: background-color 0.15s;
}

.table-row:hover {
  background-color: #f9fafb;
}

.table-row:last-child {
  border-bottom: none;
}

.status-cell {
  padding: 0.75rem 1rem;
  text-align: center;
}

.status-checkbox {
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 0.25rem;
  cursor: pointer;
}

.item-cell {
  padding: 0.75rem 1rem;
  font-weight: 500;
}

.item-cell.purchased {
  text-decoration: line-through;
  color: #9ca3af;
}

.quantity-cell, .price-cell {
  padding: 0.75rem 1rem;
  text-align: right;
}

.actions-cell {
  padding: 0.75rem 1rem;
  text-align: center;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
}

.edit-button, .delete-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.25rem;
  transition: background-color 0.15s;
  cursor: pointer;
}

.edit-button {
  color: #4361ee;
  background-color: #eef2ff;
  border: none;
}

.edit-button:hover {
  background-color: #dbeafe;
}

.delete-button {
  color: #ef4444;
  background-color: #fee2e2;
  border: none;
}

.delete-button:hover {
  background-color: #fecaca;
}

/* Mobile card styles */
.mobile-cards {
  display: none;
}

.item-card {
  border-bottom: 1px solid #e5e7eb;
  padding: 1rem;
}

.item-card:last-child {
  border-bottom: none;
}

.purchased-card {
  background-color: #f9fafb;
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
}

.card-status {
  margin-right: 0.75rem;
}

.card-title {
  font-weight: 600;
  font-size: 1.125rem;
  color: #111827;
}

.card-title.purchased {
  text-decoration: line-through;
  color: #9ca3af;
}

.card-details {
  margin-bottom: 1rem;
  padding-left: 2.25rem;
}

.card-detail {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.detail-label {
  color: #6b7280;
  font-size: 0.875rem;
}

.detail-value {
  font-weight: 500;
}

.card-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.card-actions .edit-button,
.card-actions .delete-button {
  width: auto;
  height: auto;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  gap: 0.25rem;
}

/* Pagination */
.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: #f9fafb;
  border-top: 1px solid #e5e7eb;
}

.items-info {
  font-size: 0.875rem;
  color: #6b7280;
}

.pagination-controls {
  display: flex;
  gap: 0.25rem;
}

.page-button, .page-number {
  padding: 0.375rem 0.75rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  transition: background-color 0.15s;
}

.page-button {
  background-color: white;
  border: 1px solid #d1d5db;
  color: #4b5563;
  cursor: pointer;
}

.page-button:hover:not(:disabled) {
  background-color: #f3f4f6;
}

.page-button:disabled {
  opacity: 0.5;
  cursor: default;
}

.page-number {
  background-color: #4361ee;
  border: 1px solid #4361ee;
  color: white;
  font-weight: 500;
}

/* Responsive design */
@media (max-width: 768px) {
  .desktop-table {
    display: none;
  }
  
  .mobile-cards {
    display: block;
  }
  
  .pagination-container {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .pagination-controls {
    width: 100%;
    justify-content: space-between;
  }
  
  .controls-section {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .search-filter-container {
    width: 100%;
  }
  
  .search-container {
    width: 100%;
    max-width: none;
  }
  
  .filter-sort-container {
    width: 100%;
  }
  
  .filter-select {
    flex: 1;
  }
}

/* Summary section */
.summary-section {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.summary-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
}

.summary-divider {
  border: 0;
  height: 1px;
  background-color: #e5e7eb;
  margin-bottom: 1.5rem;
}

.summary-item {
  display: flex;
  align-items: center;
  margin-bottom: 1.25rem;
}

.summary-item:last-child {
  margin-bottom: 0;
}

.summary-icon {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  margin-right: 1rem;
  font-size: 1rem;
}

.summary-item:nth-child(1) .summary-icon {
  background-color: #eef2ff;
  color: #4361ee;
}

.summary-item:nth-child(2) .summary-icon {
  background-color: #fff7ed;
  color: #ea580c;
}

.summary-item:nth-child(3) .summary-icon {
  background-color: #ecfdf5;
  color: #059669;
}

.summary-content {
  flex: 1;
}

.summary-label {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.summary-value {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
}
</style>