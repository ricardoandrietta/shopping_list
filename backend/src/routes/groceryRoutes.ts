import { Router, Request, Response, RequestHandler } from 'express';
import { Repository } from 'typeorm';
import { GroceryItem } from '../entity/GroceryItem';

const router = Router();
let groceryRepository: Repository<GroceryItem>;

export function initializeRepository(repository: Repository<GroceryItem>) {
  groceryRepository = repository;
}

interface GroceryParams {
  id: string;
}

// Get all grocery items
const getAllItems: RequestHandler = async (_req, res) => {
  try {
    const groceries = await groceryRepository.find();
    res.json(groceries);
  } catch (error) {
    console.error('Error fetching grocery items:', error);
    res.status(500).json({ message: 'Error fetching grocery items', error });
  }
};

// Get a single grocery item
const getOneItem: RequestHandler<GroceryParams> = async (req, res): Promise<void> => {
  try {
    const grocery = await groceryRepository.findOne({
      where: { id: parseInt(req.params.id) }
    });
    if (!grocery) {
      res.status(404).json({ message: 'Grocery item not found' });
      return;
    }
    
    res.json(grocery);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching grocery item', error });
  }
};

// Create a new grocery item
const createItem: RequestHandler = async (req, res) => {
  try {
    const newGrocery = groceryRepository.create(req.body);
    const result = await groceryRepository.save(newGrocery);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating grocery item:', error);
    res.status(500).json({ message: 'Error creating grocery item', error });
  }
};
// Update a grocery item
const updateItem: RequestHandler<GroceryParams> = async (req, res): Promise<void> => {
  try {
    const grocery = await groceryRepository.findOne({
      where: { id: parseInt(req.params.id) }
    });
    if (!grocery) {
      res.status(404).json({ message: 'Grocery item not found' });
      return;
    }
    
    groceryRepository.merge(grocery, req.body);
    const result = await groceryRepository.save(grocery);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error updating grocery item', error });
  }
};

// Delete a grocery item
const deleteItem: RequestHandler<GroceryParams> = async (req, res): Promise<void> => {
  try {
    const grocery = await groceryRepository.findOne({
      where: { id: parseInt(req.params.id) }
    });
    if (!grocery) {
      res.status(404).json({ message: 'Grocery item not found' });
      return;
    }
    
    await groceryRepository.remove(grocery);
    res.status(204).send();
    return;
  } catch (error) {
    res.status(500).json({ message: 'Error deleting grocery item', error });
  }
};

// Mark item as purchased
const togglePurchased: RequestHandler<GroceryParams> = async (req, res): Promise<void> => {
  try {
    const grocery = await groceryRepository.findOne({
      where: { id: parseInt(req.params.id) }
    });
    if (!grocery) {
      res.status(404).json({ message: 'Grocery item not found' });
      return;
    }
    
    grocery.purchased = !grocery.purchased;
    const result = await groceryRepository.save(grocery);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error updating purchase status', error });
  }
};

router.get('/', getAllItems);
router.get('/:id', getOneItem);
router.post('/', createItem);
router.put('/:id', updateItem);
router.delete('/:id', deleteItem);
router.patch('/:id/purchase', togglePurchased);

export default router; 