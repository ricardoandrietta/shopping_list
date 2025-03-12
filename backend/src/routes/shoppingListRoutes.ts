import { Router, Request, Response, RequestHandler } from 'express';
import { Repository } from 'typeorm';
import { ShoppingList } from '../entity/ShoppingList';
import { GroceryItem } from '../entity/GroceryItem';

const router = Router();
let shoppingListRepository: Repository<ShoppingList>;
let groceryItemRepository: Repository<GroceryItem>;

export function initializeRepositories(
  listRepo: Repository<ShoppingList>,
  itemRepo: Repository<GroceryItem>
) {
  shoppingListRepository = listRepo;
  groceryItemRepository = itemRepo;
}

interface ListParams {
  id: string;
}

// Get all shopping lists
const getAllLists: RequestHandler = async (_req, res) => {
  try {
    const lists = await shoppingListRepository.find({
      order: {
        createdAt: 'DESC'
      }
    });
    res.json(lists);
  } catch (error) {
    console.error('Error fetching shopping lists:', error);
    res.status(500).json({ message: 'Error fetching shopping lists', error });
  }
};

// Get a single shopping list
const getOneList: RequestHandler<ListParams> = async (req, res): Promise<void> => {
  try {
    const list = await shoppingListRepository.findOne({
      where: { id: parseInt(req.params.id) },
      relations: ['items']
    });
    
    if (!list) {
      res.status(404).json({ message: 'Shopping list not found' });
      return;
    }
    
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching shopping list', error });
  }
};

// Create a new shopping list
const createList: RequestHandler = async (req, res) => {
  try {
    const newList = shoppingListRepository.create(req.body);
    const result = await shoppingListRepository.save(newList);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating shopping list:', error);
    res.status(500).json({ message: 'Error creating shopping list', error });
  }
};

// Update a shopping list
const updateList: RequestHandler<ListParams> = async (req, res): Promise<void> => {
  try {
    const list = await shoppingListRepository.findOne({
      where: { id: parseInt(req.params.id) }
    });
    
    if (!list) {
      res.status(404).json({ message: 'Shopping list not found' });
      return;
    }
    
    shoppingListRepository.merge(list, req.body);
    const result = await shoppingListRepository.save(list);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error updating shopping list', error });
  }
};

// Delete a shopping list
const deleteList: RequestHandler<ListParams> = async (req, res): Promise<void> => {
  try {
    const list = await shoppingListRepository.findOne({
      where: { id: parseInt(req.params.id) }
    });
    
    if (!list) {
      res.status(404).json({ message: 'Shopping list not found' });
      return;
    }
    
    await shoppingListRepository.remove(list);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting shopping list', error });
  }
};

// Get all items in a shopping list
const getListItems: RequestHandler<ListParams> = async (req, res): Promise<void> => {
  try {
    const items = await groceryItemRepository.find({
      where: { shopping_list_id: parseInt(req.params.id) }
    });
    
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching list items', error });
  }
};

// Register routes
router.get('/', getAllLists);
router.get('/:id', getOneList);
router.post('/', createList);
router.put('/:id', updateList);
router.delete('/:id', deleteList);
router.get('/:id/items', getListItems);

export default router; 