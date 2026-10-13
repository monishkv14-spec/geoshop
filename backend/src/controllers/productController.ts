import { Request, Response } from 'express';
import { prisma } from '../config/prisma.js';
import {
  convertToUsd,
  calculatePriceTier,
  calculateQualityIndex,
} from '../utils/pricing.js';
import { productSearchQuerySchema, compareQuerySchema } from '../validators/schemas.js';
import { SearchOrchestrator } from '../providers/SearchOrchestrator.js';
/**
 * Real product image URLs sourced from open CDNs / official press kits.
 * Keyed by exact product name as stored in the database.
 */
const PRODUCT_IMAGES: Record<string, string> = {
  // Smartphones
  'iPhone 17 Pro 256GB':
    'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/iphone-16-pro-model-unselect-gallery-2-202409?wid=640&hei=528&fmt=p-jpg&qlt=80',
  'Samsung Galaxy S25 Ultra 512GB':
    'https://images.samsung.com/is/image/samsung/p6pim/uk/2501/gallery/uk-galaxy-s25-ultra-s938-sm-s938bzthbtu-543544056?$650_519_PNG$',
  'Google Pixel 9 Pro 128GB':
    'https://lh3.googleusercontent.com/3mWE-x_rPL1aEzDCaTFKTCXKHvNkFlB3PJA55TMpIHVFuDcMmVLFCCVHEtFz4d7XSLT_5cHJnlWpjDY=rw-w1440',
  'OnePlus 13 256GB':
    'https://image01.oneplus.net/ebp/202501/06/1-m00-53-d1-rb8bwmc8ykkaajb-aaek4gk3lk0259.png',
  // Laptops
  'MacBook Pro 16" M4 Max':
    'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mbp16-spaceblack-gallery1-202410?wid=640&hei=528&fmt=p-jpg&qlt=80',
  'Dell XPS 15 OLED':
    'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-15-9530/media-gallery/notebook-xps-15-9530-nt-blue-gallery-4.psd?fmt=jpg&pscan=auto&scl=1&hei=402&wid=402',
  'Lenovo ThinkPad X1 Carbon Gen 12':
    'https://p1-ofp.static.pub/fes/cms/2024/02/20/nwmdo26lfrvkzfhsdi5fiwf7o3i7ku858823.png',
  'ASUS ROG Zephyrus G14 Gaming Laptop':
    'https://dlcdnwebimgs.asus.com/gain/27b7f3e1-c27d-41e4-ad2e-0ba5c6fa0735/w800',
  // Audio
  'Sony WH-1000XM5 Wireless Headphones':
    'https://www.sony.com/image/5d02da5df552836db894cead8a68f5f3?fmt=pjpeg&wid=440&bgcolor=FFFFFF&bgc=FFFFFF',
  'Apple AirPods Max (USB-C)':
    'https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/airpods-max-select-202409-midnight?wid=400&hei=400&fmt=jpeg&qlt=90',
  'Bose QuietComfort Ultra Headphones':
    'https://assets.bose.com/content/dam/Bose_DAM/Web/consumer_electronics/global/products/headphones/qc_ultra_headphones/product_silo_images/QCU_HP_BLK_cc_thumbnail.png/jcr:content/renditions/cq5dam.web.1280.1280.png',
  'Sennheiser Momentum 4 Wireless':
    'https://assets.sennheiser.com/img/21474/x1_desktop_Momentum_4_Wireless_Black_Sennheiser.jpg',
  // Gaming
  'PlayStation 5 Pro 2TB':
    'https://gmedia.playstation.com/is/image/SIEPDC/ps5-pro-hero-image-01-en-22aug24?$800px$',
  'Nintendo Switch OLED Model':
    'https://assets.nintendo.com/image/upload/f_auto/q_auto/dpr_2.0/c_scale,w_400/ncom/en_US/switch/site-design-update/hardware/switch/nintendo-switch-oled-model-white-set/gallery/image01',
  'Xbox Series X 1TB Console':
    'https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE4mRni?ver=a266&q=90&m=6&h=705&w=1253&b=%23FFFFFFFF&f=jpg&o=f&aim=true',
  'Steam Deck OLED 1TB':
    'https://cdn.akamai.steamstatic.com/store/home/store_home_share.jpg',
  // Cameras
  'Sony Alpha 7 IV Full-Frame Camera':
    'https://www.sony.com/image/0e6a94b4e7b3f38bbcf56ec1a6c03e3d?fmt=pjpeg&wid=440',
  'Canon EOS R6 Mark II Mirrorless':
    'https://www.usa.canon.com/media/product/cache/2/large_image/800x532/9df78eab33525d08d6e5fb8d27136e95/0/5/0574c0400.jpg',
  'Fujifilm X-T5 Mirrorless Camera':
    'https://fujifilm-x.com/wp-content/uploads/2022/11/x-t5_top_black.png',
  'DJI Osmo Pocket 3 Creator Combo':
    'https://store.dji.com/uploads/product/OP3_combo_main.png',
  // Shoes
  'Nike Air Jordan 1 Retro High OG':
    'https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/f6b2e6f7-f623-4a41-a474-8a42ada10ccf/air-jordan-1-retro-high-og-shoes-BpARGV.png',
  'Adidas Ultraboost Light Running Shoes':
    'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/5c88e0f0c5c04e7db5bf5a7ac12ee04b_9366/Ultraboost_Light_Shoes_White_HQ6339_01_standard.jpg',
  'New Balance 990v6 Made in USA':
    'https://nb.scene7.com/is/image/NB/m990gl6_nb_02_i?$pdpflexf2$&wid=440&hei=440',
  'On Running Cloudmonster Max Cushion':
    'https://images.on-running.com/is/image/on/cloudmonster-m-undyed-white_1?wid=440&hei=440',
};

/** Get image URL for a product name, returning undefined if not mapped */
function getProductImage(name: string): string | undefined {
  return PRODUCT_IMAGES[name];
}

/**
 * GET /api/products
 * List products with optional search query & category filter
 */
export const getProducts = async (req: Request, res: Response) => {
  try {
    const parseResult = productSearchQuerySchema.safeParse(req.query);
    if (!parseResult.success) {
      return res.status(400).json({ success: false, errors: parseResult.error.issues });
    }

    const { q, category } = parseResult.data;
    // Use the orchestrator for unified search (including fallback providers)
    const orchestrator = new SearchOrchestrator();
    const results = await orchestrator.search(q ?? '', undefined, { category });

    // Map to the response shape expected by the frontend
    const formatted = results.map((prod) => ({
      id: prod.id,
      name: prod.name,
      brand: prod.brand,
      category: prod.category,
      imageEmoji: prod.imageEmoji,
      image: prod.image,
      description: prod.description,
      basePriceUsd: prod.basePriceUsd,
      totalListingsCount: prod.totalListingsCount,
      availableCountries: prod.availableCountries,
      minUsdPrice: prod.basePriceUsd,
    }));

    return res.json({
      success: true,
      count: formatted.length,
      data: formatted,
    });
  } catch (error: any) {
    console.error('Error in getProducts:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch products' });
  }
};

/**
 * GET /api/products/search?q=query
 */
export const searchProducts = async (req: Request, res: Response) => {
  return getProducts(req, res);
};

/**
 * GET /api/products/:id
 */
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        listings: {
          include: {
            website: {
              include: {
                location: true,
              },
            },
          },
        },
      },
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const countries = Array.from(
      new Set(product.listings.map((l) => l.website.location.name))
    );
    const usdPrices = product.listings.map((l) => convertToUsd(l.price, l.currency));
    const minUsdPrice = usdPrices.length > 0 ? Math.min(...usdPrices) : 0;

    return res.json({
      success: true,
      data: {
        id: product.id,
        name: product.name,
        brand: product.brand,
        category: product.category,
        imageEmoji: product.imageEmoji,
        image: getProductImage(product.name),
        description: product.description,
        basePriceUsd: minUsdPrice,
        totalListingsCount: product.listings.length,
        availableCountries: countries,
        minUsdPrice,
      },
    });
  } catch (error: any) {
    console.error('Error in getProductById:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch product details' });
  }
};

/**
 * GET /api/products/:id/availability
 * Returns location markers for the 3D world globe with Price Pulse tiers
 */
export const getProductAvailability = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        listings: {
          include: {
            website: {
              include: {
                location: true,
              },
            },
          },
        },
      },
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Group listings by country/location
    const locationMap: Record<
      string,
      {
        locationId: string;
        country: string;
        code: string;
        lat: number;
        lon: number;
        currency: string;
        atmosphereColor: string;
        storeCount: number;
        lowestPrice: number;
        lowestUsdPrice: number;
        stores: string[];
        inStock: boolean;
      }
    > = {};

    product.listings.forEach((listing) => {
      const loc = listing.website.location;
      const priceInUsd = convertToUsd(listing.price, listing.currency);

      if (!locationMap[loc.id]) {
        locationMap[loc.id] = {
          locationId: loc.id,
          country: loc.name,
          code: loc.code,
          lat: loc.lat,
          lon: loc.lon,
          currency: loc.currency,
          atmosphereColor: loc.atmosphereColor,
          storeCount: 0,
          lowestPrice: listing.price,
          lowestUsdPrice: priceInUsd,
          stores: [],
          inStock: false,
        };
      }

      const item = locationMap[loc.id];
      item.storeCount += 1;
      if (listing.price < item.lowestPrice) {
        item.lowestPrice = listing.price;
      }
      if (priceInUsd < item.lowestUsdPrice) {
        item.lowestUsdPrice = priceInUsd;
      }
      if (!item.stores.includes(listing.website.name)) {
        item.stores.push(listing.website.name);
      }
      if (listing.inStock) {
        item.inStock = true;
      }
    });

    const rawMarkers = Object.values(locationMap);

    // Calculate global cheapest price across all locations
    const allUsdPrices = rawMarkers.map((m) => m.lowestUsdPrice);
    const globalMinUsdPrice = allUsdPrices.length > 0 ? Math.min(...allUsdPrices) : 0;
    const globalMaxUsdPrice = allUsdPrices.length > 0 ? Math.max(...allUsdPrices) : 0;

    // Apply Price Pulse tiers to each marker
    const markers = rawMarkers.map((m) => {
      const tierInfo = calculatePriceTier(m.lowestUsdPrice, globalMinUsdPrice);
      return {
        ...m,
        priceTier: tierInfo.tier,
        pulseColor: tierInfo.color,
        relativeDifferencePercent: tierInfo.relativeDifferencePercent,
      };
    });

    // Sort markers with cheapest first
    markers.sort((a, b) => a.lowestUsdPrice - b.lowestUsdPrice);

    const cheapestLocation = markers.length > 0 ? markers[0].country : null;

    return res.json({
      success: true,
      productId: product.id,
      productName: product.name,
      globalMinUsdPrice,
      globalMaxUsdPrice,
      cheapestLocation,
      totalLocationsCount: markers.length,
      markers,
    });
  } catch (error: any) {
    console.error('Error in getProductAvailability:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch product availability' });
  }
};

/**
 * GET /api/products/:id/compare?locationId=...
 * Compare store listings with Quality Index breakdown and price history
 */
export const getProductComparison = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parseResult = compareQuerySchema.safeParse(req.query);
    if (!parseResult.success) {
      return res.status(400).json({ success: false, errors: parseResult.error.issues });
    }

    const { locationId } = parseResult.data;

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const whereListing: any = { productId: id };
    if (locationId) {
      whereListing.website = {
        locationId: locationId,
      };
    }

    const listings = await prisma.listing.findMany({
      where: whereListing,
      include: {
        website: {
          include: {
            location: true,
          },
        },
      },
      orderBy: { price: 'asc' },
    });

    const formattedListings = listings.map((l) => {
      const priceUsd = convertToUsd(l.price, l.currency);
      const qualityIndex = calculateQualityIndex(
        l.rating,
        l.reviewCount,
        l.website.trustScore,
        l.returnDays,
        l.priceHistory,
        l.price
      );

      let parsedHistory: any[] = [];
      try {
        parsedHistory = JSON.parse(l.priceHistory);
      } catch {
        parsedHistory = [];
      }

      const directStoreUrl = `${l.website.baseSearchUrl}${encodeURIComponent(product.name)}`;

      // Currency symbol map
      const CURRENCY_SYMBOLS: Record<string, string> = {
        USD: '$', INR: '₹', GBP: '£', EUR: '€', JPY: '¥',
        AUD: 'A$', AED: 'د.إ', BRL: 'R$', CAD: 'C$', SGD: 'S$', KRW: '₩',
      };

      // Website domain from baseSearchUrl
      let websiteDomain = '';
      try {
        websiteDomain = new URL(l.website.baseSearchUrl).hostname.replace('www.', '');
      } catch {
        websiteDomain = l.website.name.toLowerCase().replace(/\s+/g, '') + '.com';
      }

      // Stock status label
      const stockStatus = l.inStock ? 'In Stock' : 'Out of Stock';

      // Estimated delivery (deterministic based on trustScore bucket)
      const deliveryEst = l.website.trustScore >= 4.8
        ? '2–4 Business Days'
        : l.website.trustScore >= 4.6
          ? '4–7 Business Days'
          : '7–14 Business Days';

      return {
        id: l.id,
        listingId: l.id,
        productId: l.productId,
        productName: product.name,
        productEmoji: product.imageEmoji,
        productImage: getProductImage(product.name),
        brand: product.brand,
        websiteId: l.website.id,
        websiteName: l.website.name,
        websiteDomain,
        sellerTrustScore: l.website.trustScore,
        trustScore: l.website.trustScore,
        locationId: l.website.location.id,
        country: l.website.location.name,
        countryCode: l.website.location.code,
        price: l.price,
        currency: l.currency,
        currencySymbol: CURRENCY_SYMBOLS[l.currency] ?? l.currency,
        priceUsd,
        rating: l.rating,
        reviewCount: l.reviewCount,
        inStock: l.inStock,
        stockStatus,
        deliveryEst,
        returnDays: l.returnDays,
        qualityScore: qualityIndex.score,
        qualityIndex,
        priceHistory: parsedHistory,
        directStoreUrl,
        originalProductUrl: directStoreUrl,
      };
    });


    return res.json({
      success: true,
      productId: product.id,
      productName: product.name,
      count: formattedListings.length,
      data: formattedListings,
    });
  } catch (error: any) {
    console.error('Error in getProductComparison:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch product comparison' });
  }
};
