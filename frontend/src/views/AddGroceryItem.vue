<template>
  <div class="px-4 sm:px-6 md:px-8 lg:px-10 py-8 bg-gray-100">
    <div class="max-w-7xl mx-auto">
      <div class="flex items-center mb-6">
        <router-link :to="`/list/${id}`" class="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full mr-4 text-gray-600 hover:bg-gray-200 transition-colors">
          <i class="fas fa-arrow-left"></i>
        </router-link>
        <h1 class="text-3xl font-bold text-gray-800">Add Grocery Item</h1>
      </div>
      
      <div class="bg-white rounded-xl shadow-md border border-gray-100 mb-8">
        <form @submit.prevent="addItem" class="p-6">
          <div class="mb-6">
            <label for="name" class="block text-sm font-medium text-gray-700 mb-2">Item Name</label>
            <input 
              id="name" 
              v-model="form.name" 
              type="text" 
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
          
          <div class="mb-6">
            <label for="quantity" class="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
            <input 
              id="quantity" 
              v-model.number="form.quantity" 
              type="number" 
              min="1"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
          
          <div class="mb-6">
            <label for="price" class="block text-sm font-medium text-gray-700 mb-2">Price (optional)</label>
            <input 
              id="price" 
              v-model.number="form.price" 
              type="number" 
              step="0.01"
              min="0"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
          
          <div class="mb-6">
            <label for="barcode" class="block text-sm font-medium text-gray-700 mb-2">Barcode (optional)</label>
            <div class="flex gap-2">
              <input 
                id="barcode" 
                v-model="form.barcode" 
                type="text"
                class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
              <router-link :to="`/list/${id}/scan`" class="flex items-center justify-center px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-200 transition-colors">
                <i class="fas fa-barcode mr-2"></i> Scan
              </router-link>
            </div>
          </div>
          
          <div class="mb-6">
            <div class="flex items-center">
              <input 
                type="checkbox" 
                id="createProduct" 
                v-model="createProduct" 
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              >
              <label for="createProduct" class="ml-2 block text-sm text-gray-700">
                Also create a product with this information
              </label>
            </div>
            <p class="mt-1 text-sm text-gray-500">
              This will add the item to your products catalog for future use
            </p>
          </div>
          
          <div class="flex justify-end space-x-4 mt-8">
            <router-link :to="`/list/${id}`" class="px-6 py-3 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-200 transition-colors">
              Cancel
            </router-link>
            <button 
              type="button" 
              @click="addItemAndStay"
              class="px-6 py-3 cursor-pointer bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-lg text-white font-medium shadow-sm hover:shadow transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              :disabled="loading"
            >
              {{ loading ? 'Adding...' : 'Add & Continue' }}
            </button>
            <button 
              type="submit" 
              class="px-6 py-3 cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 rounded-lg text-white font-medium shadow-sm hover:shadow transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              :disabled="loading"
            >
              {{ loading ? 'Adding...' : 'Add & Exit' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useGroceryStore } from '../stores/groceryStore'
import { useProductStore } from '../stores/productStore'

const router = useRouter()
const route = useRoute()
const id = computed(() => route.params.id)
const groceryStore = useGroceryStore()
const productStore = useProductStore()

const form = reactive({
  name: '',
  quantity: 1,
  price: 0,
  barcode: undefined as string | undefined,
  purchased: false,
  shopping_list_id: parseInt(route.params.id as string)
})

const createProduct = ref(false)
const { loading } = groceryStore

const addItem = async () => {
  await groceryStore.addItem(form)
  
  if (createProduct.value) {
    await productStore.createProduct({
      name: form.name,
      brand: null,
      price: form.price || null,
      barcode: form.barcode || null,
      favorite: false,
      user_id: 1
    })
  }
  
  if (!groceryStore.error) {
    router.push(`/list/${id.value}`)
  }
}

const addItemAndStay = async () => {
  await groceryStore.addItem(form)
  
  if (createProduct.value) {
    await productStore.createProduct({
      name: form.name,
      brand: null,
      price: form.price || null,
      barcode: form.barcode || null,
      favorite: false,
      user_id: 1
    })
  }
  
  if (!groceryStore.error) {
    // Reset form for a new item
    form.name = ''
    form.quantity = 1
    form.price = 0
    form.barcode = undefined
    form.purchased = false
    createProduct.value = false
    // Focus on the name input for convenience
    setTimeout(() => {
      document.getElementById('name')?.focus()
    }, 100)
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