<template>
  <div class="app-container">
    <header class="header">
      <div class="header-content">
        <router-link to="/" class="logo-link">
          <span class="logo-text">Grocery List App</span>
        </router-link>
      </div>
    </header>
    
    <main class="main-content">
      <router-view />
    </main>
    
    <footer class="footer">
      <div class="footer-content">
        <p class="footer-text">Grocery List App - Made with Vue.js, TypeScript, and SQLite</p>
      </div>
    </footer>
  </div>
</template>

<style>
/* Reset all styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #333;
  background-color: #f5f7fa;
}

.app-container {
  min-height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
}

.header {
  background-color: #3b82f6;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem 0;
}

.header-content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-link {
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: bold;
}

.main-content {
  flex: 1;
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem 1rem;
  width: 100%;
}

.footer {
  background-color: white;
  border-top: 1px solid #e5e7eb;
  padding: 1.5rem 0;
  margin-top: 3rem;
}

.footer-content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

.footer-text {
  text-align: center;
  color: #6b7280;
  font-size: 0.875rem;
}
</style> 