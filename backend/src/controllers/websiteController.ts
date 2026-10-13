import { Request, Response } from 'express';
import { prisma } from '../config/prisma.js';

/**
 * GET /api/websites
 * Fetch all registered shopping websites with location information
 */
export const getWebsites = async (_req: Request, res: Response) => {
  try {
    const websites = await prisma.website.findMany({
      include: {
        location: true,
      },
      orderBy: { name: 'asc' },
    });

    const formatted = websites.map((w) => ({
      id: w.id,
      name: w.name,
      locationId: w.locationId,
      country: w.location.name,
      countryCode: w.location.code,
      currency: w.location.currency,
      baseSearchUrl: w.baseSearchUrl,
      trustScore: w.trustScore,
    }));

    return res.json({
      success: true,
      count: formatted.length,
      data: formatted,
    });
  } catch (error: any) {
    console.error('Error in getWebsites:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch shopping websites' });
  }
};
