<template>
  <div class="container mx-auto px-4 py-6">
    <div class="flex items-center mb-6">
      <router-link to="/products" class="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full mr-4 text-gray-600 hover:bg-gray-200 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
        </svg>
      </router-link>
      <h1 class="text-2xl font-bold">Scan Product Barcode</h1>
    </div>
    
    <div class="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-8">
      <div id="scanner-container" class="w-full h-64 overflow-hidden rounded-lg mb-6 bg-gray-100"></div>
      
      <div v-if="scannedBarcode" class="flex items-center bg-green-50 rounded-lg p-4 mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600 mr-3" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        <p class="text-sm text-green-800">Scanned Barcode: <strong>{{ scannedBarcode }}</strong></p>
      </div>
      
      <div class="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
        <button 
          @click="stopScanner" 
          class="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button 
          @click="useBarcode" 
          class="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-lg font-medium shadow-sm hover:shadow transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          :disabled="!scannedBarcode"
        >
          Use This Barcode
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { Html5Qrcode } from 'html5-qrcode'

const router = useRouter()
const scannedBarcode = ref<string | null>(null)
let html5QrCode: Html5Qrcode | null = null

onMounted(() => {
  html5QrCode = new Html5Qrcode('scanner-container')
  
  const config = { fps: 10, qrbox: { width: 250, height: 150 } }
  
  html5QrCode.start(
    { facingMode: 'environment' },
    config,
    (decodedText) => {
      scannedBarcode.value = decodedText
    },
    (errorMessage) => {
      console.error(errorMessage)
    }
  ).catch((err) => {
    console.error(`Unable to start scanning: ${err}`)
  })
})

onBeforeUnmount(() => {
  stopScanner()
})

const stopScanner = () => {
  if (html5QrCode && html5QrCode.isScanning) {
    html5QrCode.stop().then(() => {
      console.log('Scanner stopped')
    }).catch((err) => {
      console.error(`Error stopping scanner: ${err}`)
    })
  }
  
  router.push('/products')
}

const useBarcode = () => {
  if (scannedBarcode.value) {
    localStorage.setItem('scannedProductBarcode', scannedBarcode.value)
    stopScanner()
  }
}
</script> 