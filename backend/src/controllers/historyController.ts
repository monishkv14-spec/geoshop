import { Request, Response } from 'express';
import { prisma } from '../config/prisma.js';
import { createHistorySchema } from '../validators/schemas.js';

/**
 * GET /api/history
 * Fetch recent search history
 */
export const getHistory = async (_req: Request, res: Response) => {
  try {
    const history = await prisma.searchHistory.findMany({
      take: 20,
      orderBy: { searchedAt: 'desc' },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            imageEmoji: true,
            category: true,
          },
        },
        location: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });

    return res.json({
      success: true,
      count: history.length,
      data: history,
    });
  } catch (error: any) {
    console.error('Error in getHistory:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch search history' });
  }
};

/**
 * POST /api/history
 * Record a search query
 */
export const addHistory = async (req: Request, res: Response) => {
  try {
    const parseResult = createHistorySchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({ success: false, errors: parseResult.error.issues });
    }

    const { query, productId, locationId } = parseResult.data;

    const record = await prisma.searchHistory.create({
      data: {
        query,
        productId: productId || undefined,
        locationId: locationId || undefined,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            imageEmoji: true,
            category: true,
          },
        },
        location: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },
      },
    });

    return res.status(201).json({
      success: true,
      data: record,
    });
  } catch (error: any) {
    console.error('Error in addHistory:', error);
    return res.status(500).json({ success: false, message: 'Failed to record search history' });
  }
};

/**
 * DELETE /api/history/:id
 * Delete specific history item
 */
export const deleteHistoryItem = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.searchHistory.delete({
      where: { id },
    });

    return res.json({
      success: true,
      message: 'Search history entry deleted',
    });
  } catch (error: any) {
    console.error('Error in deleteHistoryItem:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete search history entry' });
  }
};

/**
 * DELETE /api/history
 * Clear all search history
 */
export const clearHistory = async (_req: Request, res: Response) => {
  try {
    await prisma.searchHistory.deleteMany({});

    return res.json({
      success: true,
      message: 'All search history cleared',
    });
  } catch (error: any) {
    console.error('Error in clearHistory:', error);
    return res.status(500).json({ success: false, message: 'Failed to clear search history' });
  }
};
