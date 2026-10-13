import { Request, Response } from 'express';
import { prisma } from '../config/prisma.js';
import { createSavedItemSchema } from '../validators/schemas.js';
import { convertToUsd } from '../utils/pricing.js';

/**
 * GET /api/saved
 * Fetch all saved/bookmarked listings
 */
export const getSavedItems = async (_req: Request, res: Response) => {
  try {
    const items = await prisma.savedItem.findMany({
      orderBy: { savedAt: 'desc' },
      include: {
        listing: {
          include: {
            product: true,
            website: {
              include: {
                location: true,
              },
            },
          },
        },
      },
    });

    const formatted = items.map((item) => {
      const priceUsd = convertToUsd(item.listing.price, item.listing.currency);
      const directStoreUrl = `${item.listing.website.baseSearchUrl}${encodeURIComponent(
        item.listing.product.name
      )}`;

      return {
        id: item.id,
        savedAt: item.savedAt,
        listingId: item.listingId,
        product: {
          id: item.listing.product.id,
          name: item.listing.product.name,
          brand: item.listing.product.brand,
          category: item.listing.product.category,
          imageEmoji: item.listing.product.imageEmoji,
        },
        website: {
          id: item.listing.website.id,
          name: item.listing.website.name,
          country: item.listing.website.location.name,
          countryCode: item.listing.website.location.code,
        },
        price: item.listing.price,
        currency: item.listing.currency,
        priceUsd,
        rating: item.listing.rating,
        reviewCount: item.listing.reviewCount,
        inStock: item.listing.inStock,
        directStoreUrl,
      };
    });

    return res.json({
      success: true,
      count: formatted.length,
      data: formatted,
    });
  } catch (error: any) {
    console.error('Error in getSavedItems:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch saved items' });
  }
};

/**
 * POST /api/saved
 * Save / bookmark a listing
 */
export const addSavedItem = async (req: Request, res: Response) => {
  try {
    const parseResult = createSavedItemSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ success: false, errors: parseResult.error.issues });
    }

    const { listingId } = parseResult.data;

    // Check if listing exists
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    // Check if already saved
    const existing = await prisma.savedItem.findFirst({
      where: { listingId },
    });

    if (existing) {
      return res.json({
        success: true,
        message: 'Item already saved',
        data: existing,
      });
    }

    const saved = await prisma.savedItem.create({
      data: { listingId },
      include: {
        listing: {
          include: {
            product: true,
            website: true,
          },
        },
      },
    });

    return res.status(201).json({
      success: true,
      data: saved,
    });
  } catch (error: any) {
    console.error('Error in addSavedItem:', error);
    return res.status(500).json({ success: false, message: 'Failed to save item' });
  }
};

/**
 * DELETE /api/saved/:id
 * Remove saved item by ID
 */
export const deleteSavedItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const found = await prisma.savedItem.findFirst({
      where: {
        OR: [{ id }, { listingId: id }],
      },
    });

    if (!found) {
      return res.status(404).json({ success: false, message: 'Saved item not found' });
    }

    await prisma.savedItem.delete({
      where: { id: found.id },
    });

    return res.json({
      success: true,
      message: 'Saved item removed successfully',
    });
  } catch (error: any) {
    console.error('Error in deleteSavedItem:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete saved item' });
  }
};
