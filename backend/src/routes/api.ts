import { Router } from 'express';
import {
  getProducts,
  searchProducts,
  getProductById,
  getProductAvailability,
  getProductComparison,
} from '../controllers/productController.js';
import {
  getLocations,
  getLocationById,
} from '../controllers/locationController.js';
import { getWebsites } from '../controllers/websiteController.js';
import {
  getHistory,
  addHistory,
  deleteHistoryItem,
  clearHistory,
} from '../controllers/historyController.js';
import {
  getSavedItems,
  addSavedItem,
  deleteSavedItem,
} from '../controllers/savedController.js';

const router = Router();

// 1. Health check
router.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'GeoShop Global API',
    version: '1.0.0',
    phase: 'Phase 5 - Production Ready (Complete)',
    timestamp: new Date().toISOString(),
  });
});

// 2. Products & Search
router.get('/products/search', searchProducts);
router.get('/products', getProducts);
router.get('/products/:id', getProductById);
router.get('/products/:id/availability', getProductAvailability);
router.get('/products/:id/compare', getProductComparison);

// 3. Locations
router.get('/locations', getLocations);
router.get('/locations/:id', getLocationById);

// 4. Shopping Websites
router.get('/websites', getWebsites);

// 5. Search History
router.get('/history', getHistory);
router.post('/history', addHistory);
router.delete('/history/:id', deleteHistoryItem);
router.delete('/history', clearHistory);

// 6. Saved / Bookmarked Items
router.get('/saved', getSavedItems);
router.post('/saved', addSavedItem);
router.delete('/saved/:id', deleteSavedItem);

export default router;
