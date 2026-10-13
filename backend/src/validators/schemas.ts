import { z } from 'zod';

export const productSearchQuerySchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
});

export const compareQuerySchema = z.object({
  locationId: z.string().optional(),
});

export const createHistorySchema = z.object({
  query: z.string().min(1, 'Query must not be empty').max(200),
  productId: z.string().uuid().optional().nullable(),
  locationId: z.string().uuid().optional().nullable(),
});

export const createSavedItemSchema = z.object({
  listingId: z.string().min(1, 'Listing ID is required'),
});
