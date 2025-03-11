<template>
  <div class="grocery-container">
    <h1 class="page-title">Scan Barcode</h1>
    
    <div class="scanner-container">
      <div id="scanner-container" class="scanner-view"></div>
      
      <div v-if="scannedBarcode" class="barcode-result">
        <i class="fas fa-check-circle success-icon"></i>
        <p class="barcode-text">Scanned Barcode: <strong>{{ scannedBarcode }}</strong></p>
      </div>
      
      <div class="scanner-actions">
        <button 
          @click="stopScanner" 
          class="cancel-button"
        >
          <i class="fas fa-times"></i> Cancel
        </button>
        <button 
          @click="useBarcode" 
          class="submit-button"
          :disabled="!scannedBarcode"
        >
          <i class="fas fa-check"></i> Use This Barcode
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
  // Add Font Awesome if it doesn't exist
  if (!document.getElementById('font-awesome-css')) {
    const link = document.createElement('link');
    link.id = 'font-awesome-css';
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
    document.head.appendChild(link);
  }
  
  html5QrCode = new Html5Qrcode('scanner-container')
  
  const config = { fps: 10, qrbox: { width: 250, height: 150 } }
  
  html5QrCode.start(
    { facingMode: 'environment' },
    config,
    (decodedText) => {
      scannedBarcode.value = decodedText
      // Optionally stop scanning after successful scan
      // stopScanner()
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
  
  router.go(-1) // Go back to previous page
}

const useBarcode = () => {
  // Store the barcode in localStorage to retrieve it in the add/edit form
  if (scannedBarcode.value) {
    localStorage.setItem('scannedBarcode', scannedBarcode.value)
    stopScanner()
  }
}
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

.scanner-container {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.scanner-view {
  width: 100%;
  height: 300px;
  overflow: hidden;
  border-radius: 0.375rem;
  margin-bottom: 1.5rem;
  background-color: #f3f4f6;
}

.barcode-result {
  display: flex;
  align-items: center;
  background-color: #ecfdf5;
  border-radius: 0.375rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.success-icon {
  color: #059669;
  font-size: 1.25rem;
  margin-right: 0.75rem;
}

.barcode-text {
  color: #065f46;
  font-size: 0.875rem;
}

.scanner-actions {
  display: flex;
  justify-content: space-between;
}

.cancel-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #f3f4f6;
  color: #4b5563;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.cancel-button:hover {
  background-color: #e5e7eb;
}

.submit-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
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
  .scanner-actions {
    flex-direction: column;
    gap: 1rem;
  }
  
  .cancel-button, .submit-button {
    width: 100%;
    justify-content: center;
  }
}
</style> 