<template>
  <div class="grocery-container">
    <h1 class="page-title">Add Grocery Item</h1>
    
    <div class="form-container">
      <form @submit.prevent="addItem" class="grocery-form">
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
            <router-link 
              to="/scan" 
              class="scan-button"
            >
              <i class="fas fa-barcode"></i> Scan
            </router-link>
          </div>
        </div>
        
        <div class="form-actions">
          <router-link 
            to="/" 
            class="cancel-button"
          >
            Cancel
          </router-link>
          <button 
            type="submit" 
            class="submit-button"
            :disabled="loading"
          >
            {{ loading ? 'Adding...' : 'Add Item' }}
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

const router = useRouter()
const groceryStore = useGroceryStore()

const form = reactive({
  name: '',
  quantity: 1,
  price: 0,
  barcode: undefined as string | undefined,
  purchased: false
})

const { loading } = groceryStore

const addItem = async () => {
  await groceryStore.addItem(form)
  if (!groceryStore.error) {
    router.push('/')
  }
}

// Add Font Awesome if it doesn't exist
onMounted(() => {
  if (!document.getElementById('font-awesome-css')) {
    const link = document.createElement('link');
    link.id = 'font-awesome-css';
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
    document.head.appendChild(link);
  }
})
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
  transition: border-color 0.15s, box-shadow 0.15s;
}

.form-input:focus {
  outline: none;
  border-color: #4361ee;
  box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.1);
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
  gap: 0.5rem;
  background-color: #f3f4f6;
  color: #4b5563;
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  text-decoration: none;
  transition: background-color 0.2s;
}

.scan-button:hover {
  background-color: #e5e7eb;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
}

.cancel-button {
  display: inline-flex;
  align-items: center;
  background-color: #f3f4f6;
  color: #4b5563;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 500;
  text-decoration: none;
  transition: background-color 0.2s;
}

.cancel-button:hover {
  background-color: #e5e7eb;
}

.submit-button {
  display: inline-flex;
  align-items: center;
  background-color: #4361ee;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-button:hover:not(:disabled) {
  background-color: #2541b2;
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Responsive design */
@media (max-width: 768px) {
  .form-actions {
    flex-direction: column;
    gap: 1rem;
  }
  
  .cancel-button, .submit-button {
    width: 100%;
    justify-content: center;
  }
}
</style> 