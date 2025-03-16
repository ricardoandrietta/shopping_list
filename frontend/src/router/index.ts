import { createRouter, createWebHistory } from 'vue-router'
import ShoppingLists from '../views/ShoppingLists.vue'
import GroceryList from '../views/GroceryList.vue'
import AddGroceryItem from '../views/AddGroceryItem.vue'
import EditGroceryItem from '../views/EditGroceryItem.vue'
import ScanBarcode from '../views/ScanBarcode.vue'
import Products from '../views/Products.vue'
import ScanProductBarcode from '../views/ScanProductBarcode.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: ShoppingLists
    },
    {
      path: '/list/:id',
      name: 'groceryList',
      component: GroceryList,
      props: true
    },
    {
      path: '/list/:id/add',
      name: 'add',
      component: AddGroceryItem,
      props: true
    },
    {
      path: '/list/:id/edit/:itemId',
      name: 'edit',
      component: EditGroceryItem,
      props: route => ({
        id: route.params.itemId,
        listId: route.params.id
      })
    },
    {
      path: '/list/:id/scan',
      name: 'scan',
      component: ScanBarcode,
      props: true
    },
    {
      path: '/products',
      name: 'products',
      component: Products
    },
    {
      path: '/products/scan',
      name: 'scanProductBarcode',
      component: ScanProductBarcode
    }
  ]
})

export default router 