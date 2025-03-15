import { Router, Request, Response, RequestHandler } from 'express';
import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Product } from '../entity/Product';

const router = Router();
let productRepository: Repository<Product>;

export function initializeRepository(repository: Repository<Product>) {
  productRepository = repository;
}

interface ProductParams {
  id: string;
}

// Get all products
const getAllProducts: RequestHandler = async (req, res) => {
  try {
    const filter = req.query.filter as string;
    
    let products;
    if (filter === 'favorite') {
      products = await productRepository.find({
        where: { favorite: true },
        order: { updatedAt: 'DESC' }
      });
    } else {
      products = await productRepository.find({
        order: { updatedAt: 'DESC' }
      });
    }
    
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
};

// Get a single product
const getOneProduct: RequestHandler<ProductParams> = async (req, res): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const product = await productRepository.findOne({ where: { id } });
    
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Error fetching product' });
  }
};

// Create a new product
const createProduct: RequestHandler = async (req, res) => {
  try {
    const { name, brand, price, barcode, favorite, user_id } = req.body;
    
    if (!name) {
      res.status(400).json({ message: 'Name is required' });
      return;
    }
    
    const product = productRepository.create({
      name,
      brand: brand || null,
      price: price || null,
      barcode: barcode || null,
      favorite: favorite || false,
      user_id: user_id || 1 // Default to user_id 1 for now
    });
    
    await productRepository.save(product);
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Error creating product' });
  }
};

// Update a product
const updateProduct: RequestHandler<ProductParams> = async (req, res): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const { name, brand, price, barcode, favorite } = req.body;
    
    if (!name) {
      res.status(400).json({ message: 'Name is required' });
      return;
    }
    
    const product = await productRepository.findOne({ where: { id } });
    
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    
    product.name = name;
    product.brand = brand || null;
    product.price = price || null;
    product.barcode = barcode || null;
    product.favorite = favorite || false;
    
    await productRepository.save(product);
    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Error updating product' });
  }
};

// Toggle favorite status
const toggleFavorite: RequestHandler<ProductParams> = async (req, res): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const product = await productRepository.findOne({ where: { id } });
    
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    
    product.favorite = !product.favorite;
    await productRepository.save(product);
    res.json(product);
  } catch (error) {
    console.error('Error toggling favorite status:', error);
    res.status(500).json({ message: 'Error toggling favorite status' });
  }
};

// Delete a product
const deleteProduct: RequestHandler<ProductParams> = async (req, res): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    const product = await productRepository.findOne({ where: { id } });
    
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    
    await productRepository.remove(product);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product' });
  }
};

// Routes
router.get('/', getAllProducts);
router.get('/:id', getOneProduct);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.patch('/:id/favorite', toggleFavorite);
router.delete('/:id', deleteProduct);

export default router; 