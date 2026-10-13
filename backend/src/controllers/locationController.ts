import { Request, Response } from 'express';
import { prisma } from '../config/prisma.js';

/**
 * GET /api/locations
 * Fetch all locations with website count and coordinates
 */
export const getLocations = async (_req: Request, res: Response) => {
  try {
    const locations = await prisma.location.findMany({
      include: {
        websites: {
          select: {
            id: true,
            name: true,
            trustScore: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    const formatted = locations.map((loc) => ({
      id: loc.id,
      name: loc.name,
      code: loc.code,
      lat: loc.lat,
      lon: loc.lon,
      currency: loc.currency,
      atmosphereColor: loc.atmosphereColor,
      storeCount: loc.websites.length,
      websites: loc.websites,
    }));

    return res.json({
      success: true,
      count: formatted.length,
      data: formatted,
    });
  } catch (error: any) {
    console.error('Error in getLocations:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch locations' });
  }
};

/**
 * GET /api/locations/:id
 */
export const getLocationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const location = await prisma.location.findUnique({
      where: { id },
      include: {
        websites: true,
      },
    });

    if (!location) {
      return res.status(404).json({ success: false, message: 'Location not found' });
    }

    return res.json({
      success: true,
      data: location,
    });
  } catch (error: any) {
    console.error('Error in getLocationById:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch location details' });
  }
};
