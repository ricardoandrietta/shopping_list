import { createRouter, createWebHistory } from 'vue-router'
import ShoppingLists from '../views/ShoppingLists.vue'
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
    }
  ]
})

export default router 