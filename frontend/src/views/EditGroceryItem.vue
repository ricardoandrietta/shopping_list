<template>
  <div class="grocery-container">
    <div class="header-section">
      <router-link :to="`/list/${listId}`" class="back-button">
        <i class="fas fa-arrow-left"></i>
      </router-link>
      <h1 class="page-title">Edit Grocery Item</h1>
    </div>
    
    <!-- Loading state -->
    <div v-if="loading" class="loading-container">
      <div class="loader"></div>
      <p class="loading-text">Loading item details...</p>
    </div>
    
    <!-- Error state -->
    <div v-else-if="error" class="error-container">
      <div class="error-content">
        <i class="fas fa-exclamation-circle error-icon"></i>
        <p class="error-text">{{ error }}</p>
      </div>
    </div>
    
    <div v-else class="form-container">
      <form @submit.prevent="updateItem" class="grocery-form">
        <div class="form-group">
          <label for="name" class="form-label">Item Name</label>
          <input 
            id="name" 
            v-model="form.name" 
            type="text" 
            required
            class="form-input"
          />
        </div>
        
        <div class="form-group">
          <label for="quantity" class="form-label">Quantity</label>
          <input 
            id="quantity" 
            v-model.number="form.quantity" 
            type="number" 
            min="1"
            required
            class="form-input"
          />
        </div>
        
        <div class="form-group">
          <label for="price" class="form-label">Price (optional)</label>
          <input 
            id="price" 
            v-model.number="form.price" 
            type="number" 
            step="0.01"
            min="0"
            class="form-input"
          />
        </div>
        
        <div class="form-group">
          <label for="barcode" class="form-label">Barcode (optional)</label>
          <div class="barcode-container">
            <input 
              id="barcode" 
              v-model="form.barcode" 
              type="text"
              class="form-input barcode-input"
            />
            <router-link :to="`/list/${listId}/scan`" class="scan-button">
              <i class="fas fa-barcode"></i> Scan
            </router-link>
          </div>
        </div>
        
        <div class="form-group">
          <label class="form-label">Status</label>
          <div class="status-toggle">
            <label class="toggle-label">
              <input 
                type="checkbox" 
                v-model="form.purchased"
                class="toggle-input"
              />
              <span class="toggle-text">{{ form.purchased ? 'Purchased' : 'Not Purchased' }}</span>
            </label>
          </div>
        </div>
        
        <div class="form-actions">
          <router-link :to="`/list/${listId}`" class="cancel-button">
            Cancel
          </router-link>
          <button 
            type="submit" 
            class="submit-button"
            :disabled="loading"
          >
            {{ loading ? 'Updating...' : 'Update Item' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGroceryStore } from '../stores/groceryStore'

const props = defineProps<{
  id: string,
  listId: string
}>()

const router = useRouter()
const groceryStore = useGroceryStore()

const form = reactive({
  name: '',
  quantity: 1,
  price: 0,
  barcode: undefined as string | undefined,
  purchased: false,
  shopping_list_id: parseInt(props.listId)
})

const { loading, error, items } = groceryStore

onMounted(async () => {
  // Add Font Awesome if it doesn't exist
  if (!document.getElementById('font-awesome-css')) {
    const link = document.createElement('link');
    link.id = 'font-awesome-css';
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
    document.head.appendChild(link);
  }
  
  if (items.length === 0) {
    await groceryStore.fetchItems(parseInt(props.listId))
  }
  
  const item = items.find(item => item.id === parseInt(props.id))
  if (item) {
    form.name = item.name
    form.quantity = item.quantity
    form.price = item.price
    form.barcode = item.barcode
    form.purchased = item.purchased
  } else {
    router.push(`/list/${props.listId}`)
  }
})

const updateItem = async () => {
  await groceryStore.updateItem(parseInt(props.id), form)
  if (!groceryStore.error) {
    router.push(`/list/${props.listId}`)
  }
}
</script>

<style scoped>
.grocery-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.header-section {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.back-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background-color: #f3f4f6;
  border-radius: 9999px;
  margin-right: 1rem;
  color: #4b5563;
  transition: background-color 0.2s;
}

.back-button:hover {
  background-color: #e5e7eb;
}

.page-title {
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin: 0;
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
  border-top: 3px solid #3b82f6;
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

.form-container {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.grocery-form {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-weight: 500;
  color: #4b5563;
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 1rem;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.barcode-container {
  display: flex;
  gap: 0.5rem;
}

.barcode-input {
  flex: 1;
}

.scan-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1rem;
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  color: #4b5563;
  font-weight: 500;
  text-decoration: none;
  transition: background-color 0.2s;
}

.scan-button:hover {
  background-color: #e5e7eb;
}

.status-toggle {
  margin-top: 0.5rem;
}

.toggle-label {
  display: flex;
  align-items: center;
}

.toggle-input {
  margin-right: 0.5rem;
  width: 1.25rem;
  height: 1.25rem;
}

.toggle-text {
  font-size: 1rem;
  color: #4b5563;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.cancel-button {
  padding: 0.75rem 1.5rem;
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  color: #4b5563;
  font-weight: 500;
  text-decoration: none;
  transition: background-color 0.2s;
}

.cancel-button:hover {
  background-color: #e5e7eb;
}

.submit-button {
  padding: 0.75rem 1.5rem;
  background-color: #3b82f6;
  border: none;
  border-radius: 0.375rem;
  color: white;
  font-weight: 500;
  transition: background-color 0.2s;
}

.submit-button:hover:not(:disabled) {
  background-color: #2563eb;
}

.submit-button:disabled {
  opacity: 0.7;
}

@media (max-width: 640px) {
  .form-actions {
    flex-direction: column;
  }
  
  .cancel-button, .submit-button {
    width: 100%;
    text-align: center;
  }
}
</style> 