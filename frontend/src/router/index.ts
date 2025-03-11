import { createRouter, createWebHistory } from 'vue-router'
import GroceryList from '../views/GroceryList.vue'
import AddGroceryItem from '../views/AddGroceryItem.vue'
import EditGroceryItem from '../views/EditGroceryItem.vue'
import ScanBarcode from '../views/ScanBarcode.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: GroceryList
    },
    {
      path: '/add',
      name: 'add',
      component: AddGroceryItem
    },
    {
      path: '/edit/:id',
      name: 'edit',
      component: EditGroceryItem,
      props: true
    },
    {
      path: '/scan',
      name: 'scan',
      component: ScanBarcode
    }
  ]
})

export default router 