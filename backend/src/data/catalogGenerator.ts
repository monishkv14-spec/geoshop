import { CATALOG_DEFINITIONS, ProductTypeDefinition } from './catalogDefinitions.js';

export const ADDITIONAL_DEFINITIONS: ProductTypeDefinition[] = [
  // WEARABLES
  {
    type: 'smartwatch',
    category: 'Wearables',
    subcategory: 'Smartwatches',
    emoji: '⌚',
    baseUsdMin: 149,
    baseUsdMax: 799,
    synonyms: ['smart watch', 'fitness tracker', 'apple watch', 'galaxy watch', 'sport watch'],
    tags: ['wearable', 'smartwatch', 'fitness', 'heart rate', 'gps', 'health'],
    brands: [
      { brand: 'Apple', models: ['Watch Series 10 (GPS 46mm)', 'Watch Ultra 2 Rugged Titanium', 'Watch SE (2nd Gen 40mm)'] },
      { brand: 'Samsung', models: ['Galaxy Watch7 44mm Bluetooth', 'Galaxy Watch Ultra 47mm LTE', 'Galaxy Watch FE'] },
      { brand: 'Garmin', models: ['Fenix 8 AMOLED Multisport GPS', 'Forerunner 265 Running Watch', 'Venu 3 Health Smartwatch'] },
      { brand: 'Fitbit', models: ['Charge 6 Advanced Health Tracker', 'Sense 2 Health & Stress Watch', 'Versa 4 Fitness Smartwatch'] }
    ],
    variants: [
      '40mm Aluminum Case with Sport Band (Midnight)',
      '44mm Aluminum Case with Magnetic Link (Silver)',
      '46mm Titanium Case with Cellular Support (Natural Titanium)',
      '49mm Rugged Trail Loop for Ultra Endurance (Orange)'
    ]
  },

  // GAMING
  {
    type: 'gaming console',
    category: 'Gaming',
    subcategory: 'Consoles',
    emoji: '🎮',
    baseUsdMin: 299,
    baseUsdMax: 699,
    synonyms: ['console', 'playstation', 'xbox', 'nintendo', 'ps5', 'steam deck'],
    tags: ['gaming', 'console', 'playstation', 'xbox', 'nintendo', 'controller', '4k'],
    brands: [
      { brand: 'Sony', models: ['PlayStation 5 Pro 2TB', 'PlayStation 5 Slim Digital Edition 1TB', 'PlayStation Portal Remote Player'] },
      { brand: 'Microsoft', models: ['Xbox Series X 1TB Console', 'Xbox Series S 1TB All-Digital', 'Xbox Wireless Controller Robot White'] },
      { brand: 'Nintendo', models: ['Switch OLED Model with White Joy-Con', 'Switch Lite Handheld Gaming', 'Switch Pro Controller'] },
      { brand: 'Valve', models: ['Steam Deck OLED 512GB Handheld', 'Steam Deck OLED 1TB Anti-Glare'] }
    ],
    variants: [
      '1TB Digital Edition Console with DualSense Wireless Controller',
      '2TB Enhanced 4K Ray-Tracing Pro Console',
      '7-Inch OLED Screen Handheld Gaming System (White)'
    ]
  },

  // CAMERAS
  {
    type: 'camera',
    category: 'Cameras',
    subcategory: 'Digital Cameras',
    emoji: '📷',
    baseUsdMin: 349,
    baseUsdMax: 2499,
    synonyms: ['dslr', 'mirrorless camera', 'action camera', 'vlogging camera', 'digital camera'],
    tags: ['camera', 'photo', 'video', 'mirrorless', '4k', 'vlog', 'photography'],
    brands: [
      { brand: 'Sony', models: ['Alpha 7 IV Full-Frame Hybrid 33MP', 'ZV-E10 II Vlogging Mirrorless', 'Alpha 6700 APS-C'] },
      { brand: 'Canon', models: ['EOS R6 Mark II Mirrorless Body', 'EOS R10 Content Creator Kit', 'PowerShot V10 Pocket Vlogging'] },
      { brand: 'Fujifilm', models: ['X-T5 Mirrorless Camera 40MP', 'X100VI Digital Camera Compact', 'X-S20 Content Creation'] },
      { brand: 'GoPro', models: ['HERO13 Black Action Camera 5.3K', 'HERO12 Black Waterproof Action Cam'] },
      { brand: 'DJI', models: ['Osmo Pocket 3 Creator Combo 1-Inch CMOS', 'Osmo Action 4 Standard Combo'] }
    ],
    variants: [
      'Body Only (Matte Black)',
      'with 24-70mm f/4 Standard Zoom Lens Kit',
      'Creator Combo with Wireless Mic & Mini Tripod',
      'Waterproof Action Bundle with Dual Batteries and Chest Mount'
    ]
  },

  // HOME APPLIANCES
  {
    type: 'vacuum cleaner',
    category: 'Appliances',
    subcategory: 'Floor Care',
    emoji: '🧹',
    baseUsdMin: 79,
    baseUsdMax: 899,
    synonyms: ['vacuum', 'cordless vacuum', 'robot vacuum', 'stick vacuum', 'dust buster'],
    tags: ['vacuum', 'cleaning', 'home', 'appliances', 'cordless', 'hepa'],
    brands: [
      { brand: 'Dyson', models: ['V15 Detect Absolute Cordless', 'V8 Extra Lightweight Cordless', 'Gen5detect Absolute Powerful Stick'] },
      { brand: 'Shark', models: ['Stratox Anti Hair Wrap Cordless Stick', 'Navigator Lift-Away Upright'] },
      { brand: 'Roborock', models: ['Q Revo Robot Vacuum and Mop with Dock', 'S8 MaxV Ultra AI Obstacle Avoidance'] },
      { brand: 'iRobot', models: ['Roomba Combo j9+ Self-Emptying Robot', 'Roomba Vac Essential'] }
    ],
    variants: [
      'Cordless Stick Vacuum with HEPA Filtration and Laser Fluffy Head',
      'Robot Vacuum & Sonic Mop with Auto-Empty Wash Dock',
      'Compact Handheld Rechargeable Pet Hair Buster (Silver)'
    ]
  },
  {
    type: 'air purifier',
    category: 'Appliances',
    subcategory: 'Air Quality',
    emoji: '💨',
    baseUsdMin: 59,
    baseUsdMax: 499,
    synonyms: ['air cleaner', 'hepa purifier', 'smart air purifier', 'room purifier'],
    tags: ['air purifier', 'hepa', 'clean air', 'home', 'appliances', 'allergy'],
    brands: [
      { brand: 'Levoit', models: ['Core 300S Smart True HEPA Air Purifier', 'Core 400S Large Room Air Purifier', 'Vital 200S Smart Pet'] },
      { brand: 'Dyson', models: ['Purifier Cool Formaldehyde TP09', 'Purifier Hot+Cool Gen1 HP10'] },
      { brand: 'Philips', models: ['2000i Series Connected Air Purifier', '800 Compact Air Purifier for Bedroom'] },
      { brand: 'Coway', models: ['Airmega AP-1512HH Mighty True HEPA', 'Airmega 250 Smart Room Purifier'] }
    ],
    variants: [
      'True HEPA H13 Filter for Small to Medium Rooms (White)',
      'Smart Wi-Fi Connected Purifier with PM2.5 Laser Monitor (Dark Grey)',
      'Tower Fan & Air Purifier 2-in-1 with 360-Degree Glass HEPA (Silver)'
    ]
  },

  // LIGHTING
  {
    type: 'desk lamp',
    category: 'Lighting',
    subcategory: 'Desk Lighting',
    emoji: '💡',
    baseUsdMin: 19,
    baseUsdMax: 149,
    synonyms: ['lamp', 'reading light', 'monitor light bar', 'table lamp', 'study lamp'],
    tags: ['lighting', 'lamp', 'desk', 'led', 'study', 'reading', 'lightbar'],
    brands: [
      { brand: 'BenQ', models: ['ScreenBar Plus Monitor Light Bar with Dial', 'ScreenBar Halo Wireless Controller', 'WiT e-Reading LED Desk Lamp'] },
      { brand: 'Xiaomi', models: ['Mi Computer Monitor Light Bar', 'Mi Smart LED Desk Lamp 1S'] },
      { brand: 'Baseus', models: ['i-Wok Series Screen Hanging Light', 'Magnetic Stepless Dimming Desk Lamp'] },
      { brand: 'Philips', models: ['Dome LED Desk Light with USB Port', 'Snooze EyeCare Study Table Lamp'] }
    ],
    variants: [
      'ScreenBar Auto-Dimming USB Monitor Light Bar with Wireless Puck',
      'Eye-Caring Architect Adjustable Dual Arm LED Desk Lamp (Matte Black)',
      'Rechargeable Touch-Controlled Bedside & Study Reading Light (Warm White)'
    ]
  },
  {
    type: 'led bulb',
    category: 'Lighting',
    subcategory: 'Light Bulbs',
    emoji: '💡',
    baseUsdMin: 9,
    baseUsdMax: 59,
    synonyms: ['smart bulb', 'light bulb', 'smart light', 'rgb bulb', 'e27 bulb'],
    tags: ['lighting', 'bulb', 'led', 'smart home', 'rgb', 'alexa', 'google home'],
    brands: [
      { brand: 'Philips Hue', models: ['White & Color Ambiance A19 E26/E27', 'White Ambiance Dimmable Warm to Cool', 'Smart Lightstrip Plus 2m'] },
      { brand: 'TP-Link Tapo', models: ['L530E Smart Wi-Fi Multicolor Light Bulb', 'L510E Smart Dimmable Warm White'] },
      { brand: 'Govee', models: ['Wi-Fi RGBWW Smart LED Light Bulbs 4-Pack', 'RGBIC Neon Rope Lights 3m'] },
      { brand: 'Wipro', models: ['Next Smart 9W B22 LED Bulb Multicolor', '12.5W Color Changing Wi-Fi LED'] }
    ],
    variants: [
      'Pack of 2 Smart Wi-Fi Multicolor RGB 800 Lumens (E27 Screw)',
      'Pack of 4 Dimmable Warm White 2700K 9W LED Bulbs (B22 Bayonet)',
      'Smart RGBWW 1100 Lumens Ultra-Bright Entertainment Bulb with App Control'
    ]
  },

  // BEAUTY & PERSONAL CARE
  {
    type: 'face wash',
    category: 'Beauty',
    subcategory: 'Skincare',
    emoji: '🧴',
    baseUsdMin: 8,
    baseUsdMax: 38,
    synonyms: ['cleanser', 'facial cleanser', 'face cleanser', 'face scrub', 'foaming cleanser'],
    tags: ['skincare', 'face wash', 'beauty', 'cleanser', 'hyaluronic', 'dermatology'],
    brands: [
      { brand: 'CeraVe', models: ['Hydrating Facial Cleanser for Normal to Dry Skin', 'Foaming Facial Cleanser with Niacinamide', 'SA Cleanser Salicylic Acid'] },
      { brand: 'La Roche-Posay', models: ['Toleriane Purifying Foaming Face Cleanser', 'Effaclar Medicated Gel Cleanser'] },
      { brand: 'Cetaphil', models: ['Gentle Skin Cleanser Fragrance-Free', 'Daily Facial Cleanser for Sensitive Skin'] },
      { brand: 'Neutrogena', models: ['Hydro Boost Hydrating Cleansing Gel', 'Oil-Free Acne Wash Grapefruit'] },
      { brand: 'The Ordinary', models: ['Squalane Cleanser Gentle Makeup Remover', 'Glycolic Acid 7% Exfoliating Toner'] }
    ],
    variants: [
      '236ml (8 fl oz) Gentle Foaming Hydrating Daily Cleanser',
      '473ml (16 fl oz) Value Pump Salicylic Acid Exfoliating Cleanser',
      '150ml Deep Cleansing Gel with Hyaluronic Acid & Ceramides'
    ]
  },
  {
    type: 'sunscreen',
    category: 'Beauty',
    subcategory: 'Sun Protection',
    emoji: '☀️',
    baseUsdMin: 12,
    baseUsdMax: 45,
    synonyms: ['sunblock', 'sun cream', 'spf 50', 'sunscreen spf 50', 'uv protector'],
    tags: ['sunscreen', 'spf 50', 'sunblock', 'skincare', 'uv', 'beauty'],
    brands: [
      { brand: 'La Roche-Posay', models: ['Anthelios Light Fluid Sunscreen SPF 60', 'Anthelios UVMune 400 Invisible Fluid SPF 50+'] },
      { brand: 'Neutrogena', models: ['Ultra Sheer Dry-Touch Sunscreen SPF 70', 'Hydro Boost Water Gel Sunscreen SPF 50'] },
      { brand: 'Supergoop!', models: ['Unseen Sunscreen SPF 40 Invisible Primer', 'Glowscreen SPF 40 Hydrating Primer'] },
      { brand: 'Beauty of Joseon', models: ['Relief Sun: Rice + Probiotics SPF50+ PA++++', 'Matte Sun Stick with Mugwort'] },
      { brand: 'EltaMD', models: ['UV Clear Broad-Spectrum SPF 46 Facial Sunscreen', 'UV Daily Tinted Moisturizer SPF 40'] }
    ],
    variants: [
      '50ml Broad Spectrum SPF 50+ PA++++ Invisible Finish',
      '88ml Ultra Sheer Non-Greasy Dry-Touch Water Resistant SPF 55',
      '100ml Mineral Zinc Oxide Sensitive Skin Daily Sun Cream SPF 50'
    ]
  },
  {
    type: 'shampoo',
    category: 'Personal Care',
    subcategory: 'Hair Care',
    emoji: '🧴',
    baseUsdMin: 9,
    baseUsdMax: 42,
    synonyms: ['hair cleanser', 'anti dandruff shampoo', 'hair wash', 'clarifying shampoo', 'conditioner'],
    tags: ['hair', 'shampoo', 'haircare', 'personal care', 'scalp', 'sulfate-free'],
    brands: [
      { brand: 'Olaplex', models: ['No. 4 Bond Maintenance Shampoo', 'No. 4P Blonde Enhancer Toning Shampoo'] },
      { brand: 'L\'Oreal Professionnel', models: ['Serie Expert Absolut Repair Molecular', 'Metal Detox Anti-Deposit Cleansing'] },
      { brand: 'Head & Shoulders', models: ['Clinical Strength Dandruff Defense 400ml', 'Classic Clean Anti-Dandruff Daily'] },
      { brand: 'Moroccanoil', models: ['Hydrating Shampoo with Argan Oil', 'Extra Volume Shampoo Fine Hair'] },
      { brand: 'SheaMoisture', models: ['Coconut & Hibiscus Curl & Shine Shampoo', 'Raw Shea Butter Deep Moisturizing'] }
    ],
    variants: [
      '250ml Bond Repair Strengthen & Nourish Sulfate-Free Shampoo',
      '400ml Anti-Dandruff Scalp Care Refreshing Mint Shampoo',
      '1000ml Salon Size Professional Hydrating Argan Oil Shampoo'
    ]
  },

  // TOOLS & AUTOMOTIVE
  {
    type: 'screwdriver set',
    category: 'Tools',
    subcategory: 'Hand Tools',
    emoji: '🪛',
    baseUsdMin: 14,
    baseUsdMax: 79,
    synonyms: ['tool kit', 'precision screwdriver', 'magnetic screwdriver', 'electronics repair kit'],
    tags: ['tools', 'screwdriver', 'repair', 'diy', 'precision', 'hardware'],
    brands: [
      { brand: 'iFixit', models: ['Pro Tech Toolkit 64 Precision Bits', 'Mako Precision Driver Set 64 Bits', 'Minnow Precision Bit Set 16 Bits'] },
      { brand: 'DeWalt', models: ['MaxFit Screwdriver Set 8-Piece', '31-Piece Magnetic Screwdriving Set'] },
      { brand: 'Wiha', models: ['PicoFinish Precision Screwdriver Set', 'Master Technicians ESD Safe 50-Piece'] },
      { brand: 'Xiaomi', models: ['Mijia Wiha Precision Screwdriver 24 Bits', 'Electric Precision Screwdriver Kit'] }
    ],
    variants: [
      '24-in-1 Magnetic Aluminum Precision Repair Bit Set (Space Gray)',
      '64-Piece Multi-Bit Tech Repair Screwdriver Kit in Roll-Up Tool Bag',
      'Dual-Speed Rechargeable Cordless Precision Electric Screwdriver with LED'
    ]
  },
  {
    type: 'car phone mount',
    category: 'Automotive',
    subcategory: 'Interior Accessories',
    emoji: '🚗',
    baseUsdMin: 12,
    baseUsdMax: 59,
    synonyms: ['phone holder', 'car mount', 'magsafe car mount', 'dashboard mount', 'air vent holder'],
    tags: ['car', 'mount', 'holder', 'automotive', 'magsafe', 'phone', 'vent'],
    brands: [
      { brand: 'iOttie', models: ['Easy One Touch 5 Dashboard & Windshield Mount', 'Auto Sense Wireless Car Charger', 'Velox MagSafe Air Vent Mount'] },
      { brand: 'Spigen', models: ['OneTap Pro MagSafe Wireless Car Charger', 'Kuel Signature Dashboard Mount'] },
      { brand: 'Belkin', models: ['BoostCharge Magnetic Wireless Car Charger 15W', 'Car Vent Mount PRO with MagSafe'] },
      { brand: 'ESR', models: ['HaloLock MagSafe Car Mount with CryoBoost Fast Charge', 'Air Vent Magnetic Holder'] }
    ],
    variants: [
      'Air Vent Magnetic MagSafe Holder with 360-Degree Swivel (Matte Black)',
      'Dashboard & Windshield Telescopic Arm Heavy-Duty Suction Mount',
      '15W CryoBoost Fast Wireless Charging Air Vent Phone Holder (Graphite)'
    ]
  },

  // PET SUPPLIES
  {
    type: 'cat food',
    category: 'Pet Supplies',
    subcategory: 'Cat Food & Treats',
    emoji: '🐱',
    baseUsdMin: 14,
    baseUsdMax: 65,
    synonyms: ['dry cat food', 'wet cat food', 'cat kibble', 'feline food', 'kitten food'],
    tags: ['pet', 'cat', 'food', 'kibble', 'wet food', 'feline', 'salmon'],
    brands: [
      { brand: 'Royal Canin', models: ['Indoor Adult Dry Cat Food', 'Hairball Care Digestive Formula', 'Kitten Health Nutrition 2kg'] },
      { brand: 'Hill\'s Science Diet', models: ['Adult Indoor Chicken Recipe Dry', 'Urinary Hairball Control Dry Food'] },
      { brand: 'Purina ONE', models: ['Indoor Advantage Adult Cat Food', 'Tender Selects Blend with Real Salmon'] },
      { brand: 'Whiskas', models: ['Complete Dry Cat Food with Ocean Fish', 'Wet Cat Food Pouch Multipack 12x85g'] },
      { brand: 'Sheba', models: ['Perfect Portions Grain-Free Wet Cat Food Cuts in Gravy', 'Fine Flakes Multipack'] }
    ],
    variants: [
      '2 kg (4.4 lbs) Bag Indoor Healthy Digestion Dry Kibble (Real Chicken)',
      '7 kg (15.4 lbs) Value Pack Grain-Free Salmon & Rice Complete Nutrition',
      '24-Pack Wet Cat Food Pouches Variety Gravy Selection (Tuna, Salmon, Chicken)'
    ]
  },

  // GROCERY & PACKAGED GOODS
  {
    type: 'olive oil',
    category: 'Grocery',
    subcategory: 'Oils & Vinegars',
    emoji: '🫒',
    baseUsdMin: 9,
    baseUsdMax: 45,
    synonyms: ['extra virgin olive oil', 'cooking oil', 'evoo', 'cold pressed olive oil', 'spanish olive oil'],
    tags: ['grocery', 'food', 'oil', 'olive oil', 'cooking', 'organic', 'evoo'],
    brands: [
      { brand: 'Filippo Berio', models: ['Extra Virgin Olive Oil Cold Extracted', 'Pure Olive Oil Mild & Balanced'] },
      { brand: 'California Olive Ranch', models: ['Global Blend Medium Extra Virgin Olive Oil', '100% California Extra Virgin'] },
      { brand: 'Bertolli', models: ['Rich Taste Extra Virgin Olive Oil', 'Extra Light Tasting Olive Oil'] },
      { brand: 'Colavita', models: ['Premium Selection Extra Virgin Olive Oil Italian', 'Organic Cold Pressed EVOO'] },
      { brand: 'Borges', models: ['Extra Virgin Olive Oil Cold Pressed 1L', 'Original Classic Olive Oil'] }
    ],
    variants: [
      '500ml Glass Bottle Cold Pressed First Cold Harvest Extra Virgin',
      '1 Litre Tin Pure Extra Virgin Mediterranean Blend Olive Oil',
      '2 Litres Everyday Non-GMO Cold Extracted High Polyphenol EVOO'
    ]
  }
];

export interface GeneratedCatalogProduct {
  name: string;
  brand: string;
  category: string;
  subcategory: string;
  tags: string;
  aliases: string;
  imageEmoji: string;
  image?: string;
  description: string;
  source: 'Catalog';
  isGenerated: boolean;
  baseUsd: number;
}

/**
 * Combine CATALOG_DEFINITIONS and ADDITIONAL_DEFINITIONS into a large, rich
 * local catalog generator that yields 1,500+ distinct products.
 */
export function generateCatalogProducts(): GeneratedCatalogProduct[] {
  const allDefs = [...CATALOG_DEFINITIONS, ...ADDITIONAL_DEFINITIONS];
  const products: GeneratedCatalogProduct[] = [];

  for (const def of allDefs) {
    for (const b of def.brands) {
      for (const m of b.models) {
        for (const v of def.variants) {
          // Construct realistic product name: Brand + Model + Variant
          const name = `${b.brand} ${m} ${v}`;
          
          // Realistic deterministic price within bounds
          const hash = Math.abs(name.split('').reduce((acc, ch) => acc * 31 + ch.charCodeAt(0), 7));
          const priceSpread = def.baseUsdMax - def.baseUsdMin;
          const price = Math.round((def.baseUsdMin + (hash % 1000) / 1000 * priceSpread) * 100) / 100;

          // Assemble comma-separated tags & aliases
          const tagSet = new Set([
            ...def.tags,
            def.type.toLowerCase(),
            b.brand.toLowerCase(),
            def.category.toLowerCase(),
            def.subcategory.toLowerCase()
          ]);

          const aliasSet = new Set([
            ...def.synonyms,
            `${b.brand.toLowerCase()} ${def.type}`,
            `${b.brand.toLowerCase()} ${m.toLowerCase()}`
          ]);

          products.push({
            name,
            brand: b.brand,
            category: def.category,
            subcategory: def.subcategory,
            tags: Array.from(tagSet).join(', '),
            aliases: Array.from(aliasSet).join(', '),
            imageEmoji: def.emoji,
            description: `Official authentic ${name}. Top tier ${def.subcategory.toLowerCase()} by ${b.brand} featuring high durability, certified standards, and complete manufacturer warranty.`,
            source: 'Catalog',
            isGenerated: false,
            baseUsd: price
          });
        }
      }
    }
  }

  return products;
}
