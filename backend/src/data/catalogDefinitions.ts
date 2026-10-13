export interface ProductTypeDefinition {
  type: string;
  category: string;
  subcategory: string;
  emoji: string;
  baseUsdMin: number;
  baseUsdMax: number;
  synonyms: string[];
  tags: string[];
  brands: {
    brand: string;
    models: string[];
  }[];
  variants: string[];
}

export const CATALOG_DEFINITIONS: ProductTypeDefinition[] = [
  // MOBILE & COMPUTER ACCESSORIES
  {
    type: 'phone case',
    category: 'Accessories',
    subcategory: 'Mobile Accessories',
    emoji: '📱',
    baseUsdMin: 12,
    baseUsdMax: 59,
    synonyms: ['cover', 'phone cover', 'protective case', 'silicone case', 'bumper case'],
    tags: ['mobile', 'phone', 'case', 'protection', 'accessory', 'drop protection', 'magsafe'],
    brands: [
      { brand: 'Spigen', models: ['Ultra Hybrid', 'Tough Armor', 'Liquid Air', 'Thin Fit', 'Rugged Armor'] },
      { brand: 'OtterBox', models: ['Defender Series', 'Commuter Series', 'Symmetry Series', 'Fre Series'] },
      { brand: 'Apple', models: ['Silicone Case with MagSafe', 'Clear Case with MagSafe', 'FineWoven Case'] },
      { brand: 'Ringke', models: ['Fusion-X', 'Onyx', 'Air-S', 'Fusion Magnetic'] },
      { brand: 'ESR', models: ['HaloLock Classic', 'Armor Kickstand', 'Cyber Tough'] },
      { brand: 'Caseology', models: ['Parallax', 'Nano Pop', 'Athlex'] }
    ],
    variants: [
      'for iPhone 17 Pro Max (Clear)',
      'for iPhone 17 Pro (Matte Black)',
      'for iPhone 18 Pro Max (Titanium Gray)',
      'for Samsung Galaxy S25 Ultra (Frost Black)',
      'for Google Pixel 9 Pro (Abyssal Navy)',
      'for iPhone 16 Pro (Sierra Blue)'
    ]
  },
  {
    type: 'screen protector',
    category: 'Accessories',
    subcategory: 'Mobile Accessories',
    emoji: '🛡️',
    baseUsdMin: 8,
    baseUsdMax: 35,
    synonyms: ['tempered glass', 'guard', 'screen guard', 'glass protector'],
    tags: ['screen', 'protector', 'tempered glass', 'anti-scratch', 'mobile'],
    brands: [
      { brand: 'Spigen', models: ['GLAS.tR EZ Fit', 'AlignMaster', 'Glas.tR Platinum'] },
      { brand: 'Belkin', models: ['UltraGlass 2', 'ScreenForce TemperedCurve', 'InvisiGlass'] },
      { brand: 'ESR', models: ['Armorite Tempered Glass', 'Full-Coverage Edge Protector'] },
      { brand: 'amFilm', models: ['OneTouch Glass', 'Ultra Clear Guard'] }
    ],
    variants: [
      '2-Pack Tempered Glass for iPhone 17 Pro Max',
      '2-Pack 9H Hardness for iPhone 18 Pro Max',
      'Privacy Glass for Samsung Galaxy S25 Ultra',
      'Matte Anti-Glare for Google Pixel 9 Pro',
      'Ultra Clear 3D Curved for OnePlus 13'
    ]
  },
  {
    type: 'charger',
    category: 'Accessories',
    subcategory: 'Power & Cables',
    emoji: '🔌',
    baseUsdMin: 15,
    baseUsdMax: 89,
    synonyms: ['adapter', 'wall charger', 'power adapter', 'fast charger', 'gan charger'],
    tags: ['charger', 'adapter', 'gan', 'fast charge', 'power', 'usb-c'],
    brands: [
      { brand: 'Anker', models: ['735 Charger GaNPrime 65W', '737 Charger 120W', 'Prime 100W GaN', 'Nano Pro 30W', 'PowerPort III 45W'] },
      { brand: 'Ugreen', models: ['Nexode 65W GaN', 'Nexode 100W 4-Port', 'Nexode Pro 160W Fast Charger', 'Nexode Mini 30W'] },
      { brand: 'Apple', models: ['35W Dual USB-C Port Compact Adapter', '70W USB-C Power Adapter', '20W Fast USB-C Charger'] },
      { brand: 'Samsung', models: ['45W Power Adapter with Cable', '25W Super Fast Charging Adapter', '65W Trio Power Adapter'] },
      { brand: 'Baseus', models: ['Blade 100W GaN5 Pro', 'Super Si Pro 30W Fast Charger'] }
    ],
    variants: [
      '30W Compact USB-C (White)',
      '65W GaN 3-Port (Space Gray)',
      '100W Multi-Port Fast Charger (Black)',
      '140W Ultra-Fast Laptop & Phone Charger (Silver)',
      '45W Super Fast Dual Port (Black)'
    ]
  },
  {
    type: 'type c cable',
    category: 'Accessories',
    subcategory: 'Power & Cables',
    emoji: '⚡',
    baseUsdMin: 8,
    baseUsdMax: 39,
    synonyms: ['usb-c cable', 'usb c wire', 'fast charging cable', 'type-c cord', 'thunderbolt cable'],
    tags: ['cable', 'wire', 'usb-c', 'type c', 'cord', 'fast charging', 'data transfer'],
    brands: [
      { brand: 'Anker', models: ['PowerLine III Flow', '543 USB-C to USB-C Bio-Based', '765 140W Braided Nylon', 'Prime 240W Silicone'] },
      { brand: 'Ugreen', models: ['100W PD Braided Fast Charging Cable', '240W Right Angle Cable', 'Thunderbolt 4 40Gbps Cable'] },
      { brand: 'Apple', models: ['60W Woven USB-C Charge Cable (1m)', '240W USB-C Charge Cable (2m)', 'Thunderbolt 4 Pro Cable'] },
      { brand: 'Belkin', models: ['BoostCharge Braided Type-C (2m)', 'BoostCharge Pro Flex Silicone (1m)'] }
    ],
    variants: [
      '1m (3.3ft) 60W Braided (Black)',
      '2m (6.6ft) 100W Fast Charge (Midnight Blue)',
      '1m 240W Heavy Duty Ultra-Flexible (White)',
      '2m Right Angle 100W Gaming Cord (Gray)',
      '0.8m Thunderbolt 4 40Gbps 8K Video (Black)'
    ]
  },
  {
    type: 'hdmi cable',
    category: 'Accessories',
    subcategory: 'Cables & Interconnects',
    emoji: '📺',
    baseUsdMin: 9,
    baseUsdMax: 45,
    synonyms: ['hdmi wire', 'hdmi cord', 'ultra high speed hdmi', '4k hdmi', '8k hdmi'],
    tags: ['cable', 'hdmi', 'video', 'display', '8k', '4k', 'gaming'],
    brands: [
      { brand: 'Belkin', models: ['UltraHD High Speed 8K HDMI 2.1', 'AV10175bt2M 4K HDR'] },
      { brand: 'Ugreen', models: ['8K HDMI 2.1 Braided 48Gbps', '4K 60Hz HDMI Zinc Alloy'] },
      { brand: 'Anker', models: ['Ultra High Speed HDMI Certified 8K@60Hz', 'Premium Nylon HDMI'] }
    ],
    variants: [
      '2m (6.6ft) 8K HDMI 2.1 48Gbps (Braided Black)',
      '3m (10ft) 4K Ultra HD 60Hz HDR (Gray)',
      '5m (16ft) In-Wall Rated 8K High Speed (Black)'
    ]
  },
  {
    type: 'lightning cable',
    category: 'Accessories',
    subcategory: 'Power & Cables',
    emoji: '⚡',
    baseUsdMin: 10,
    baseUsdMax: 35,
    synonyms: ['iphone cable', 'apple cable', 'lightning cord', 'usb to lightning'],
    tags: ['lightning', 'cable', 'apple', 'iphone', 'mfi certified'],
    brands: [
      { brand: 'Apple', models: ['Lightning to USB Cable (1m)', 'Lightning to USB-C Cable (2m)'] },
      { brand: 'Anker', models: ['PowerLine II Lightning MFi', '321 USB-A to Lightning Nylon'] },
      { brand: 'Belkin', models: ['BoostCharge Braided Lightning (1m)', 'BoostCharge Pro Flex (2m)'] }
    ],
    variants: [
      '1m MFi Certified USB-C to Lightning (White)',
      '2m Heavy Duty Braided Lightning (Black)',
      '1.8m Bio-Based Silicone Flexible (Blue)'
    ]
  },
  {
    type: 'power bank',
    category: 'Accessories',
    subcategory: 'Power & Cables',
    emoji: '🔋',
    baseUsdMin: 22,
    baseUsdMax: 149,
    synonyms: ['portable charger', 'external battery', 'battery pack', 'powerbank', 'magsafe battery'],
    tags: ['battery', 'powerbank', 'portable', 'fast charge', 'usb-c', 'wireless charging'],
    brands: [
      { brand: 'Anker', models: ['737 Power Bank (PowerCore 24K)', 'Prime 20000mAh 200W', '622 Magnetic Battery (MagGo)', '325 Power Bank 20000mAh'] },
      { brand: 'Baseus', models: ['Blade 100W 20000mAh Ultra Thin', 'Magnetic Wireless 10000mAh', 'Adaman 65W 20000mAh Metal'] },
      { brand: 'Xiaomi', models: ['Mi 50W Power Bank 20000mAh', 'Mi Wireless Power Bank 10000mAh', 'Pocket Edition Pro 10000mAh'] },
      { brand: 'Ugreen', models: ['145W 25000mAh Fast Charging Bank', '100W 20000mAh Two-Way Fast Bank'] }
    ],
    variants: [
      '10,000mAh Slim 20W PD (Black)',
      '20,000mAh High Capacity 65W Laptop Charger (Space Gray)',
      '24,000mAh 140W Digital Display Bank (Silver)',
      '5,000mAh Magnetic Wireless MagSafe Pack (White)',
      '30,000mAh Outdoor Rugged Camping Pack (Green)'
    ]
  },
  {
    type: 'pen drive',
    category: 'Storage',
    subcategory: 'Flash Storage',
    emoji: '💾',
    baseUsdMin: 9,
    baseUsdMax: 79,
    synonyms: ['usb flash drive', 'flash drive', 'thumb drive', 'pendrive', 'usb drive', 'jump drive'],
    tags: ['storage', 'usb', 'flash drive', 'pen drive', 'data', 'backup', 'portable'],
    brands: [
      { brand: 'SanDisk', models: ['Ultra Dual Drive Luxe USB Type-C', 'Extreme PRO USB 3.2 Solid State', 'Cruzer Blade', 'Ultra Flair USB 3.0'] },
      { brand: 'Samsung', models: ['Type-C Duo Plus Flash Drive', 'BAR Plus Metal USB 3.1', 'FIT Plus Ultra Compact'] },
      { brand: 'Kingston', models: ['DataTraveler Max 1000MB/s USB-C', 'DataTraveler Exodia Onyx', 'IronKey Keypad 200'] },
      { brand: 'Transcend', models: ['JetFlash 930C Dual Connector', 'JetFlash 790'] }
    ],
    variants: [
      '64GB USB 3.2 Gen 1 (Silver Metal)',
      '128GB Dual Type-C & Type-A (Champagne Gold)',
      '256GB High-Speed 400MB/s (Space Gray)',
      '512GB Ultra Performance Solid State Flash (Titanium)',
      '1TB Ultra-Fast DataTraveler Max (Black)'
    ]
  },
  {
    type: 'sd card',
    category: 'Storage',
    subcategory: 'Memory Cards',
    emoji: '🎴',
    baseUsdMin: 11,
    baseUsdMax: 189,
    synonyms: ['micro sd', 'memory card', 'tf card', 'sdxc', 'camera card'],
    tags: ['storage', 'sd card', 'micro sd', 'memory', 'camera', 'nintendo switch'],
    brands: [
      { brand: 'SanDisk', models: ['Extreme PRO UHS-I V30 A2', 'Ultra microSDXC Class 10', 'High Endurance Video Monitoring'] },
      { brand: 'Samsung', models: ['EVO Plus MicroSDXC', 'PRO Plus Full-Size SDXC', 'PRO Ultimate UHS-I 200MB/s'] },
      { brand: 'Lexar', models: ['Professional 1066x V30 SDXC', 'PLAY MicroSDXC for Gaming'] },
      { brand: 'Kingston', models: ['Canvas Go! Plus V30', 'Canvas Select Plus 100MB/s'] }
    ],
    variants: [
      '64GB MicroSDXC with SD Adapter (A2 V30 4K)',
      '128GB Extreme PRO 200MB/s (Full Size SD)',
      '256GB EVO Plus UHS-I for Action Cams',
      '512GB High Endurance for Dash Cams & Security',
      '1TB High Capacity Gaming MicroSD'
    ]
  },
  {
    type: 'ssd',
    category: 'Storage',
    subcategory: 'Solid State Drives',
    emoji: '💽',
    baseUsdMin: 49,
    baseUsdMax: 320,
    synonyms: ['solid state drive', 'nvme ssd', 'portable ssd', 'external ssd', 'internal ssd', 'ssd 1tb'],
    tags: ['storage', 'ssd', 'nvme', 'fast', 'pc', 'laptop', 'backup'],
    brands: [
      { brand: 'Samsung', models: ['990 PRO PCIe 4.0 NVMe M.2', 'T7 Shield Portable SSD', 'T9 USB 3.2 Gen 2x2 Portable', '980 NVMe'] },
      { brand: 'Crucial', models: ['T500 2TB Gen4 NVMe with Heatsink', 'X9 Pro Portable SSD', 'P3 Plus PCIe 4.0 3D NAND'] },
      { brand: 'Western Digital', models: ['WD_BLACK SN850X NVMe for PS5 & PC', 'My Passport SSD', 'WD Blue SN580'] },
      { brand: 'SanDisk', models: ['Extreme Portable SSD V2 (Rugged IP65)', 'Professional PRO-BLADE Transport'] }
    ],
    variants: [
      '500GB NVMe M.2 PCIe 4.0 Internal SSD',
      '1TB NVMe M.2 High-Speed 7450MB/s with Heatsink',
      '2TB PCIe 4.0 Extreme Gaming Internal SSD',
      '1TB Portable Rugged IP65 External SSD (Type-C)',
      '2TB External Portable Fast Backup Drive (Black)'
    ]
  },
  {
    type: 'hard disk',
    category: 'Storage',
    subcategory: 'External Hard Drives',
    emoji: '💾',
    baseUsdMin: 45,
    baseUsdMax: 199,
    synonyms: ['external hard drive', 'hdd', 'external hdd', 'portable hard drive', 'hard drive'],
    tags: ['storage', 'hdd', 'hard drive', 'backup', 'external', 'terabyte'],
    brands: [
      { brand: 'Western Digital', models: ['My Passport Portable HDD', 'Elements Portable External Drive', 'Black P10 Game Drive'] },
      { brand: 'Seagate', models: ['One Touch Portable HDD with Password Protection', 'Expansion Portable', 'FireCuda Gaming HDD'] },
      { brand: 'Toshiba', models: ['Canvio Basics Portable Drive', 'Canvio Advance Stylish HDD'] }
    ],
    variants: [
      '1TB Portable 2.5-Inch USB 3.0 (Black)',
      '2TB External Backup Drive with Encryption (Blue)',
      '4TB High-Capacity Photo & Media Drive (Silver)',
      '5TB Heavy Duty Game Drive for Consoles (Black)'
    ]
  },
  {
    type: 'mouse',
    category: 'Peripherals',
    subcategory: 'Pointing Devices',
    emoji: '🖱️',
    baseUsdMin: 14,
    baseUsdMax: 159,
    synonyms: ['wireless mouse', 'gaming mouse', 'bluetooth mouse', 'optical mouse', 'ergonomic mouse'],
    tags: ['mouse', 'wireless', 'gaming', 'ergonomic', 'bluetooth', 'computer', 'accessory'],
    brands: [
      { brand: 'Logitech', models: ['MX Master 3S Wireless Performance', 'G502 X PLUS LIGHTSPEED', 'Pebble Mouse 2 M350s', 'Lift Vertical Ergonomic', 'G Pro X Superlight 2'] },
      { brand: 'Razer', models: ['DeathAdder V3 Pro Wireless', 'Viper V3 Pro', 'Basilisk V3 Ergonomic Gaming', 'Orochi V2 Mobile'] },
      { brand: 'Apple', models: ['Magic Mouse (USB-C) Multi-Touch Surface'] },
      { brand: 'Microsoft', models: ['Bluetooth Ergonomic Mouse', 'Modern Mobile Mouse', 'Arc Touch Mouse'] },
      { brand: 'Corsair', models: ['Dark Core RGB Pro SE', 'Katar Pro Wireless Lightweight', 'Scimitar RGB Elite'] }
    ],
    variants: [
      'Wireless Ergonomic Quiet Click (Graphite)',
      'Ultra-Lightweight 60g Wireless Esports Mouse (White)',
      'Multi-Device Bluetooth & 2.4GHz Silent Mouse (Rose Pink)',
      'Vertical Ergonomic Wrist Support Mouse (Off-White)',
      'High Precision 26K DPI RGB Gaming Mouse (Black)'
    ]
  },
  {
    type: 'keyboard',
    category: 'Peripherals',
    subcategory: 'Keyboards',
    emoji: '⌨️',
    baseUsdMin: 22,
    baseUsdMax: 249,
    synonyms: ['mechanical keyboard', 'wireless keyboard', 'gaming keyboard', 'bluetooth keyboard', 'typewriter keyboard'],
    tags: ['keyboard', 'mechanical', 'wireless', 'gaming', 'rgb', 'typing', 'peripherals'],
    brands: [
      { brand: 'Keychron', models: ['Q1 Pro Wireless Custom Mechanical', 'K2 Version 2 75% Layout', 'V1 QMK Hot-Swappable', 'K3 Ultra-Slim Mechanical'] },
      { brand: 'Logitech', models: ['MX Keys S Advanced Wireless Illumination', 'G915 LIGHTSPEED Wireless Mechanical', 'K380 Multi-Device Bluetooth', 'PRO X TKL Rapid'] },
      { brand: 'Razer', models: ['BlackWidow V4 Pro Mechanical', 'Huntsman V3 Pro Analog Gaming', 'DeathStalker V2 Pro Wireless'] },
      { brand: 'Corsair', models: ['K70 RGB PRO Mechanical', 'K100 AIR Wireless Ultra-Thin', 'K65 RGB MINI 60%'] },
      { brand: 'Apple', models: ['Magic Keyboard with Touch ID and Numeric Keypad (USB-C)', 'Magic Keyboard Compact (USB-C)'] }
    ],
    variants: [
      'Wireless Compact 75% Mechanical (Red Switches)',
      'Full Size 100% Backlit Wireless Multi-Device (Space Gray)',
      'RGB Hot-Swappable Gaming Keyboard (Brown Tactile Switches)',
      'Ultra-Thin Low-Profile Mechanical Wireless (White)',
      'Tenkeyless (TKL) Esports Keyboard with Optical Switches'
    ]
  },
  {
    type: 'webcam',
    category: 'Peripherals',
    subcategory: 'Video Capture',
    emoji: '📹',
    baseUsdMin: 29,
    baseUsdMax: 220,
    synonyms: ['web camera', 'streaming camera', 'hd webcam', '4k webcam', 'video conference camera'],
    tags: ['webcam', 'camera', 'streaming', 'video', 'zoom', 'work from home'],
    brands: [
      { brand: 'Logitech', models: ['C920x HD Pro Webcam', 'BRIO 4K Ultra HD Streaming', 'MX Brio Ultra HD 4K', 'StreamCam Full HD 60FPS'] },
      { brand: 'Razer', models: ['Kiyo Pro Full HD with Adaptive Light Sensor', 'Kiyo X USB Streaming', 'Kiyo Pro Ultra 4K'] },
      { brand: 'Elgato', models: ['Facecam Full HD 60FPS', 'Facecam Pro 4K60 Ultra'] },
      { brand: 'Anker', models: ['PowerConf C200 2K Webcam', 'PowerConf C300 Smart Full HD'] }
    ],
    variants: [
      '1080p 60FPS with Dual Noise-Canceling Mics (Black)',
      '4K Ultra HD HDR with AI Auto-Framing & Privacy Shutter',
      '2K Quad HD Ultra-Clear with Built-In Privacy Cover (White)'
    ]
  },
  {
    type: 'laptop bag',
    category: 'Bags',
    subcategory: 'Laptop Cases & Backpacks',
    emoji: '💼',
    baseUsdMin: 24,
    baseUsdMax: 149,
    synonyms: ['laptop backpack', 'briefcase', 'laptop sleeve', 'messenger bag', 'computer bag'],
    tags: ['bag', 'backpack', 'laptop', 'protective', 'travel', 'water resistant', 'office'],
    brands: [
      { brand: 'Samsonite', models: ['GuardIT 2.0 Laptop Backpack', 'Xenon 3.0 Checkpoint Friendly', 'Pro-DLX 6 Business Backpack'] },
      { brand: 'Tomtoc', models: ['360 Protective Laptop Sleeve', 'Travel Backpack 40L Flight Approved', 'UrbanEX Daily Commuter'] },
      { brand: 'Targus', models: ['CitySmart Advanced Multi-Fit', 'Drifter II Heavy Duty Rugged', 'Spruce EcoSmart'] },
      { brand: 'Incase', models: ['City Backpack with Plush Fleece Lining', 'Compact Flight Nylon Sleeve'] },
      { brand: 'Bellroy', models: ['Classic Backpack Plus 24L', 'Tokyo Work Bag Briefcase'] }
    ],
    variants: [
      'for 13-14" Laptops Shockproof Protective Sleeve (Navy Blue)',
      'for 15.6" Laptops Slim Water-Resistant Briefcase (Heather Gray)',
      'for 16-17" Gaming Laptops Multi-Compartment Tech Backpack (Matte Black)',
      'Expandable 35L Carry-On Travel Laptop Backpack with USB Port (Charcoal)'
    ]
  },
  {
    type: 'laptop stand',
    category: 'Accessories',
    subcategory: 'Desk Accessories',
    emoji: '🖥️',
    baseUsdMin: 18,
    baseUsdMax: 79,
    synonyms: ['notebook stand', 'riser', 'computer stand', 'cooling stand', 'desk riser'],
    tags: ['stand', 'laptop', 'ergonomic', 'aluminum', 'desk', 'riser', 'cooling'],
    brands: [
      { brand: 'Rain Design', models: ['mStand Aluminum Riser', 'iLap Lap Stand', 'mStand360 with Swivel Base'] },
      { brand: 'Nulaxy', models: ['C3 Ergonomic Aluminum Stand', 'Dual Axis Height Adjustable Riser'] },
      { brand: 'Twelve South', models: ['Curve Desktop Riser for MacBook', 'ParcSlope Ergonomic Stand'] },
      { brand: 'Ugreen', models: ['Foldable Aluminum Travel Stand', 'Vertical Laptop Stand Dual Slot'] }
    ],
    variants: [
      'Ergonomic Fixed-Angle Premium Aluminum Stand (Silver)',
      'Fully Adjustable Dual-Hinge Height & Angle Riser (Space Gray)',
      'Portable Foldable Ultra-Slim Stand for Travel (Matte Black)',
      'Dual-Slot Vertical Docking Stand for Clamshell Mode (Silver)'
    ]
  },
  {
    type: 'cooling pad',
    category: 'Accessories',
    subcategory: 'Desk Accessories',
    emoji: '❄️',
    baseUsdMin: 19,
    baseUsdMax: 89,
    synonyms: ['laptop cooler', 'cooling fan', 'chill mat', 'laptop fan'],
    tags: ['cooling', 'fan', 'laptop', 'gaming', 'heat dissipation'],
    brands: [
      { brand: 'Targus', models: ['Dual Fan Lap Chill Mat', 'HD3 Gaming Chill Mat'] },
      { brand: 'Klim', models: ['Wind Ultra-Fast Laptop Cooler', 'Ultimate RGB 200mm Fan Riser', 'Cool Metal Vacuum Extractor'] },
      { brand: 'Havit', models: ['HV-F2056 Ultra-Slim 3 Fans Riser', 'RGB Gaming Laptop Cooler 5 Fans'] }
    ],
    variants: [
      'Triple Silent 1100 RPM Fans with Blue LED (for 15-17")',
      '5-Fan High Airflow RGB Adjustable Height Cooler (for 17.3")',
      'Ergonomic Dual Fan Lap Pad with Neoprene Base (Charcoal)'
    ]
  },
  {
    type: 'usb c hub',
    category: 'Accessories',
    subcategory: 'Adapters & Hubs',
    emoji: '🎛️',
    baseUsdMin: 22,
    baseUsdMax: 179,
    synonyms: ['usb hub', 'multiport adapter', 'type c adapter', 'docking station', 'usb-c dock'],
    tags: ['hub', 'adapter', 'usb-c', 'hdmi', 'ethernet', 'dock', 'ports'],
    brands: [
      { brand: 'Anker', models: ['555 USB-C Hub 8-in-1', 'PowerExpand 7-in-1', '568 USB4 Docking Station', '332 USB-C Hub 5-in-1'] },
      { brand: 'Ugreen', models: ['Revodok Pro 9-in-1 Dual 4K HDMI', 'Revodok 6-in-1 USB-C Hub', 'Revodok 10-in-1 Gigabit Ethernet'] },
      { brand: 'Satechi', models: ['Slim Multi-Port V2', 'Type-C Pro Hub Max for MacBook', 'Triple 4K Display Dock'] },
      { brand: 'Belkin', models: ['Connect 7-in-1 USB-C Hub', 'Thunderbolt 4 Core Dock'] }
    ],
    variants: [
      '6-in-1 with 4K HDMI, 100W PD & USB 3.0 (Space Gray)',
      '9-in-1 Dual Monitor 4K HDMI with Gigabit Ethernet (Silver)',
      '7-in-1 Slim Travel Hub with SD Card Reader (Midnight)',
      '11-in-1 Desktop Docking Station with Audio & VGA (Black)'
    ]
  },
  {
    type: 'wifi router',
    category: 'Networking',
    subcategory: 'Wireless Networking',
    emoji: '📡',
    baseUsdMin: 39,
    baseUsdMax: 399,
    synonyms: ['router', 'wireless router', 'mesh wifi', 'gigabit router', 'wifi 6 router', 'wifi 7 router'],
    tags: ['router', 'wifi', 'networking', 'internet', 'mesh', 'gigabit', 'wifi 6'],
    brands: [
      { brand: 'TP-Link', models: ['Archer AX55 AX3000 Wi-Fi 6', 'Deco X55 Mesh Wi-Fi 6 System', 'Archer BE800 Wi-Fi 7 Tri-Band', 'Archer AX23 Dual-Band'] },
      { brand: 'ASUS', models: ['RT-AX86U Pro Dual-Band Gaming Router', 'ROG Rapture GT6 Mesh Gaming', 'RT-AX58U V2'] },
      { brand: 'Netgear', models: ['Nighthawk AX5400 6-Stream', 'Orbi Quad-Band WiFi 6E Mesh System', 'Nighthawk Pro Gaming XR1000'] }
    ],
    variants: [
      'Dual-Band Wi-Fi 6 AX3000 High-Speed Gigabit Router',
      'Tri-Band Wi-Fi 6E Multi-Gig Gaming Router (Quad Antennas)',
      '2-Pack Whole Home Mesh Wi-Fi 6 System (up to 4,500 sq ft)',
      'Next-Gen Tri-Band Wi-Fi 7 19Gbps Ultra Router (10G Ports)'
    ]
  },
  {
    type: 'extension board',
    category: 'Electrical',
    subcategory: 'Power Strips',
    emoji: '🔌',
    baseUsdMin: 14,
    baseUsdMax: 65,
    synonyms: ['power strip', 'surge protector', 'multi outlet', 'spike guard', 'socket board'],
    tags: ['power', 'electrical', 'surge protector', 'strip', 'outlets', 'usb'],
    brands: [
      { brand: 'Belkin', models: ['12-Outlet Surge Protector with 8ft Cord', '6-Outlet Home Series Surge Strip', '8-Outlet Pivot-Plug'] },
      { brand: 'Anker', models: ['PowerExtend 12 Strip with USB Ports', '615 USB Power Strip GaN 65W', '321 Power Strip 3 Outlets'] },
      { brand: 'Schneider Electric', models: ['APC Performance SurgeArrest 8 Outlets', 'Easy UPS Power Strip'] },
      { brand: 'Wipro', models: ['Smart Power Strip with Energy Monitoring', 'Extension Cord 4 Sockets'] }
    ],
    variants: [
      '6-Outlet Surge Protector with 3 USB Charging Ports (2m Cord)',
      '8-Outlet Heavy Duty 2500W Spike Guard with Individual Switches',
      '12-Outlet Wide-Spaced Workshop Power Strip (3m Cord)',
      'Desktop Cube Power Extender with 3 Outlets and 20W PD USB-C'
    ]
  },
  {
    type: 'earphones',
    category: 'Audio',
    subcategory: 'In-Ear Audio',
    emoji: '🎧',
    baseUsdMin: 19,
    baseUsdMax: 299,
    synonyms: ['earbuds', 'in-ear headphones', 'wireless earbuds', 'tws', 'airpods', 'noise cancelling earbuds'],
    tags: ['audio', 'earphones', 'earbuds', 'wireless', 'bluetooth', 'anc', 'music'],
    brands: [
      { brand: 'Sony', models: ['WF-1000XM5 Truly Wireless Noise Canceling', 'LinkBuds S Ultra-Lightweight', 'WF-C700N Affordable ANC'] },
      { brand: 'Apple', models: ['AirPods Pro (2nd Gen with USB-C MagSafe)', 'AirPods 4 with Active Noise Cancellation', 'AirPods 4 Standard'] },
      { brand: 'Bose', models: ['QuietComfort Ultra Earbuds', 'Sport Earbuds Sweat-Resistant'] },
      { brand: 'Samsung', models: ['Galaxy Buds3 Pro with Blade Lights', 'Galaxy Buds3 Ergonomic', 'Galaxy Buds FE'] },
      { brand: 'JBL', models: ['Live Pro 2 TWS True Adaptive ANC', 'Tune Beam True Wireless', 'Wave Buds Compact'] },
      { brand: 'Sennheiser', models: ['MOMENTUM True Wireless 4', 'ACCENTUM True Wireless'] }
    ],
    variants: [
      'True Wireless with Adaptive Active Noise Cancelling (Black)',
      'True Wireless with Spatial Audio & Transparency (White)',
      'High-Resolution LDAC Water-Resistant Sports Earbuds (Silver)',
      'Compact Wireless In-Ear Buds with 32-Hour Battery (Midnight Blue)'
    ]
  },
  {
    type: 'headset',
    category: 'Audio',
    subcategory: 'Over-Ear Headphones',
    emoji: '🎧',
    baseUsdMin: 39,
    baseUsdMax: 549,
    synonyms: ['headphones', 'over ear headphones', 'gaming headset', 'wireless headphones', 'studio headphones'],
    tags: ['audio', 'headset', 'headphones', 'gaming', 'over-ear', 'anc', 'microphone'],
    brands: [
      { brand: 'Sony', models: ['WH-1000XM5 Flagship Noise Canceling', 'WH-CH720N Lightweight Wireless', 'INZONE H9 Wireless Gaming Headset'] },
      { brand: 'Bose', models: ['QuietComfort Ultra Headphones', 'QuietComfort 45 Acoustic Noise Cancelling'] },
      { brand: 'Sennheiser', models: ['MOMENTUM 4 Wireless 60h Battery', 'HD 560S Open-Back Audiophile', 'ACCENTUM Wireless ANC'] },
      { brand: 'SteelSeries', models: ['Arctis Nova Pro Wireless Multi-System', 'Arctis Nova 7 Wireless Gaming', 'Arctis Nova 1'] },
      { brand: 'HyperX', models: ['Cloud III Wireless Gaming Headset', 'Cloud Alpha Wireless 300h Battery', 'Cloud Stinger 2'] }
    ],
    variants: [
      'Flagship Wireless Active Noise Canceling (Black)',
      'Wireless Gaming Headset with AI ClearCast Mic (Matte White)',
      '60-Hour Long Battery Over-Ear Studio Headphones (Copper/Black)',
      'Open-Back Audiophile Hi-Fi Headphones (Space Gray)'
    ]
  },

  // PHONES & TABLETS
  {
    type: 'smartphone',
    category: 'Smartphones',
    subcategory: 'Mobile Phones',
    emoji: '📱',
    baseUsdMin: 199,
    baseUsdMax: 1599,
    synonyms: ['phone', 'mobile', 'cell phone', 'flagship phone', 'android phone', 'iphone'],
    tags: ['phone', 'smartphone', 'mobile', '5g', 'flagship', 'camera phone'],
    brands: [
      { brand: 'Apple', models: ['iPhone 17 Pro Max', 'iPhone 17 Pro', 'iPhone 17', 'iPhone 17 Air', 'iPhone 18 Pro Max', 'iPhone 18 Pro', 'iPhone 18 Ultra', 'iPhone 16'] },
      { brand: 'Samsung', models: ['Galaxy S25 Ultra', 'Galaxy S25 Plus', 'Galaxy S25', 'Galaxy Z Fold6', 'Galaxy Z Flip6', 'Galaxy A55 5G'] },
      { brand: 'Google', models: ['Pixel 9 Pro XL', 'Pixel 9 Pro', 'Pixel 9', 'Pixel 9a', 'Pixel 8a'] },
      { brand: 'OnePlus', models: ['OnePlus 13', 'OnePlus 13R', 'OnePlus Open 2'] },
      { brand: 'Xiaomi', models: ['Xiaomi 15 Pro', 'Xiaomi 15 Ultra', 'Redmi Note 14 Pro+'] }
    ],
    variants: [
      '128GB (Midnight Black)',
      '256GB (Natural Titanium)',
      '512GB (Deep Blue)',
      '1TB Ultra High-Performance Edition (Cosmic White)'
    ]
  },
  {
    type: 'tablet',
    category: 'Computers',
    subcategory: 'Tablets & E-Readers',
    emoji: '📱',
    baseUsdMin: 149,
    baseUsdMax: 1299,
    synonyms: ['ipad', 'pad', 'android tablet', 'drawing tablet', 'graphics tablet'],
    tags: ['tablet', 'ipad', 'screen', 'stylus', 'portable', 'drawing'],
    brands: [
      { brand: 'Apple', models: ['iPad Pro 13-inch M4 Ultra Retina OLED', 'iPad Pro 11-inch M4', 'iPad Air 11-inch M2', 'iPad 10th Generation', 'iPad mini 7'] },
      { brand: 'Samsung', models: ['Galaxy Tab S10 Ultra 14.6" AMOLED', 'Galaxy Tab S10+ 12.4"', 'Galaxy Tab S9 FE with S Pen', 'Galaxy Tab A9+'] },
      { brand: 'Lenovo', models: ['Tab P12 3K Display with Tab Pen Plus', 'Tab M11 Octa-Core'] },
      { brand: 'Microsoft', models: ['Surface Pro 11 Copilot+ PC OLED', 'Surface Go 4 Compact'] }
    ],
    variants: [
      '128GB Wi-Fi (Space Gray)',
      '256GB Wi-Fi + 5G Cellular (Starlight)',
      '512GB Ultra OLED Display with S Pen / Stylus (Silver)',
      '1TB Performance Display with Nano-Texture Glass (Graphite)'
    ]
  },

  // LAPTOPS & COMPUTERS
  {
    type: 'laptop',
    category: 'Computers',
    subcategory: 'Notebooks',
    emoji: '💻',
    baseUsdMin: 399,
    baseUsdMax: 3499,
    synonyms: ['notebook', 'macbook', 'ultrabook', 'gaming laptop', 'workstation laptop'],
    tags: ['laptop', 'notebook', 'macbook', 'computer', 'work', 'gaming', 'portable'],
    brands: [
      { brand: 'Apple', models: ['MacBook Pro 16" M4 Max', 'MacBook Pro 14" M4 Pro', 'MacBook Air 15" M3', 'MacBook Air 13" M3', 'MacBook Air 13" M2'] },
      { brand: 'Dell', models: ['XPS 15 OLED Touch', 'XPS 13 Plus Ultrabook', 'Alienware m16 R2 Gaming', 'Inspiron 16 Plus'] },
      { brand: 'Lenovo', models: ['ThinkPad X1 Carbon Gen 12', 'Legion Pro 7i Gen 9 Gaming', 'Yoga 9i 2-in-1 Dual Screen', 'IdeaPad Slim 5'] },
      { brand: 'ASUS', models: ['ROG Zephyrus G14 OLED Gaming', 'Zenbook 14 OLED Ultra Slim', 'TUF Gaming A15', 'ProArt P16 Studio'] },
      { brand: 'HP', models: ['Spectre x360 14 OLED 2-in-1', 'OMEN Transcend 14 Gaming', 'Envy x360 15'] }
    ],
    variants: [
      '13.6-Inch M3 8-Core CPU 16GB RAM 512GB SSD (Midnight)',
      '14-Inch OLED 120Hz Core Ultra 7 32GB RAM 1TB SSD (Platinum)',
      '15.6-Inch Gaming RTX 4070 AMD Ryzen 9 32GB RAM 1TB SSD (Eclipse Gray)',
      '16-Inch M4 Max 16-Core 64GB Unified Memory 2TB SSD (Space Black)',
      '16-Inch 4K OLED RTX 4080 Creator Workstation 64GB 2TB SSD (Silver)'
    ]
  },
  {
    type: 'desktop',
    category: 'Computers',
    subcategory: 'Desktop PCs',
    emoji: '🖥️',
    baseUsdMin: 499,
    baseUsdMax: 3999,
    synonyms: ['pc', 'desktop pc', 'tower', 'gaming pc', 'all in one pc', 'workstation'],
    tags: ['desktop', 'pc', 'tower', 'gaming', 'workstation', 'all-in-one'],
    brands: [
      { brand: 'Apple', models: ['Mac Studio M2 Ultra', 'Mac mini M4 Pro', 'iMac 24" 4.5K Retina M4'] },
      { brand: 'Dell', models: ['Alienware Aurora R16 Gaming Desktop', 'Inspiron All-in-One 27', 'XPS Desktop Tower'] },
      { brand: 'HP', models: ['OMEN 45L Liquid Cooled Gaming Desktop', 'Pavilion All-in-One 24'] },
      { brand: 'Lenovo', models: ['Legion Tower 7i Gen 8', 'IdeaCentre Tower 14L'] }
    ],
    variants: [
      'All-in-One 24-Inch 4.5K Retina 16GB RAM 512GB SSD (Blue)',
      'Compact Mini PC M4 Pro 24GB Unified Memory 512GB SSD (Silver)',
      'Gaming Tower Intel Core i9 RTX 4090 64GB DDR5 2TB NVMe (Black RGB)',
      'Workstation Studio PC 128GB Memory 4TB SSD (Space Gray)'
    ]
  },
  {
    type: 'monitor',
    category: 'Peripherals',
    subcategory: 'Displays',
    emoji: '🖥️',
    baseUsdMin: 119,
    baseUsdMax: 1499,
    synonyms: ['screen', 'computer monitor', 'display', '4k monitor', 'gaming monitor', 'ultrawide monitor'],
    tags: ['monitor', 'screen', 'display', '4k', 'oled', 'gaming', 'ultrawide'],
    brands: [
      { brand: 'LG', models: ['UltraGear 27" OLED 240Hz 0.03ms', '34" Curved UltraWide WQHD', '27" 4K UHD IPS with USB-C 90W', 'DualUp Monitor with Ergo Stand'] },
      { brand: 'Dell', models: ['UltraSharp 27" 4K USB-C Hub U2724DE', 'UltraSharp 34" Curved Thunderbolt Hub', 'Alienware 32" 4K QD-OLED AW3225QF'] },
      { brand: 'Samsung', models: ['Odyssey OLED G9 49" Curved Dual QHD', 'ViewFinity S9 27" 5K Matte Display', 'Odyssey G7 28" 4K 144Hz'] },
      { brand: 'ASUS', models: ['ROG Swift OLED PG27AQDM 240Hz', 'ProArt Display 27" 4K HDR Color-Accurate', 'TUF Gaming 27" 180Hz'] }
    ],
    variants: [
      '27-Inch 4K UHD 60Hz IPS Color-Accurate USB-C 90W PD (Silver)',
      '27-Inch QHD 240Hz OLED Ultra-Fast Gaming Display (Black)',
      '34-Inch WQHD 165Hz Curved 1000R Ultrawide Monitor (Dark Gray)',
      '32-Inch 4K 144Hz QD-OLED HDR True Black Gaming Monitor (White/Black)',
      '49-Inch Dual QHD 240Hz Super Ultrawide Curved Display (Titanium)'
    ]
  },
  {
    type: 'printer',
    category: 'Peripherals',
    subcategory: 'Printers & Scanners',
    emoji: '🖨️',
    baseUsdMin: 69,
    baseUsdMax: 549,
    synonyms: ['all-in-one printer', 'laser printer', 'inkjet printer', 'color printer', 'scanner printer'],
    tags: ['printer', 'scanner', 'copier', 'wireless', 'laser', 'inkjet', 'home office'],
    brands: [
      { brand: 'HP', models: ['Smart Tank 7301 All-in-One Cartridge-Free', 'Color LaserJet Pro MFP 3301fdw', 'DeskJet 2755e Wireless Color'] },
      { brand: 'Canon', models: ['PIXMA MegaTank G6020 Wireless Inkjet', 'imageCLASS MF267dw II Laser All-in-One', 'MAXIFY GX6021'] },
      { brand: 'Epson', models: ['EcoTank ET-2850 Wireless Supertank', 'EcoTank Photo ET-8550 Wide-Format', 'WorkForce Pro WF-3820'] },
      { brand: 'Brother', models: ['HL-L2350DW Compact Monochrome Laser', 'MFC-L3770CDW Color Laser Multi-Function'] }
    ],
    variants: [
      'Compact Wireless Monochrome Laser Printer with Auto 2-Sided Print',
      'All-in-One Wireless Color Inkjet with Scanner and Mobile App',
      'High-Capacity EcoTank Supertank All-in-One (Includes 2 Years of Ink)',
      'Heavy Duty Office Color Laser Multifunction Copier & Fax'
    ]
  },

  // KITCHEN & HOME
  {
    type: 'water bottle',
    category: 'Kitchen',
    subcategory: 'Drinkware',
    emoji: '🍶',
    baseUsdMin: 12,
    baseUsdMax: 55,
    synonyms: ['bottle', 'flask', 'hydration bottle', 'gym bottle', 'insulated bottle', 'thermos bottle'],
    tags: ['bottle', 'water', 'kitchen', 'hydration', 'insulated', 'stainless steel', 'sports'],
    brands: [
      { brand: 'Hydro Flask', models: ['Wide Mouth with Flex Cap 32oz', 'Standard Mouth with Flex Cap 24oz', 'All Around Travel Tumbler 40oz'] },
      { brand: 'Stanley', models: ['The Quencher H2.0 FlowState Tumbler 40oz', 'IceFlow Flip Straw Tumbler 30oz', 'Classic Vacuum Bottle 1.5qt'] },
      { brand: 'Yeti', models: ['Rambler 26oz Bottle with Chug Cap', 'Rambler 36oz Vacuum Insulated', 'Rambler 20oz Travel Mug'] },
      { brand: 'Milton', models: ['Thermosteel Flip Lid 1000ml', 'Optima 750ml Vacuum Insulated', 'Kool Rover 1500ml'] },
      { brand: 'Contigo', models: ['Autoseal West Loop 16oz', 'Autospout Jackson Chill 24oz'] }
    ],
    variants: [
      '24oz (710ml) Stainless Steel Vacuum Insulated with Straw (Sky Blue)',
      '32oz (950ml) Wide Mouth 24hr Cold / 12hr Hot (Pacific Navy)',
      '40oz (1.2L) Insulated FlowState Tumbler with Ergonomic Handle (Cream)',
      '1000ml (34oz) Leakproof Gym Shaker & Infuser Bottle (Matte Black)'
    ]
  },
  {
    type: 'flask',
    category: 'Kitchen',
    subcategory: 'Drinkware',
    emoji: '🫗',
    baseUsdMin: 15,
    baseUsdMax: 65,
    synonyms: ['vacuum flask', 'thermos', 'thermal flask', 'hot water flask', 'tea flask'],
    tags: ['flask', 'thermos', 'kitchen', 'hot cold', 'vacuum insulated', 'tea', 'coffee'],
    brands: [
      { brand: 'Thermos', models: ['Stainless King 40oz Vacuum Insulated Bottle', 'Compact Beverage Bottle 16oz'] },
      { brand: 'Milton', models: ['Thermosteel Duo Deluxe 1000ml', 'Steel Craft Vacuum Flask 750ml'] },
      { brand: 'Zojirushi', models: ['Stainless Steel Vacuum Mug 16oz', 'Tuff Sports Bottle 1.0L', 'Gourmet Bento Lunch Jar'] },
      { brand: 'Cello', models: ['Inox Stainless Steel 1000ml', 'Lifestyle Hot & Cold Flask'] }
    ],
    variants: [
      '500ml Compact Thermal Flask with Push Button Lid (Rose Gold)',
      '1000ml Double Wall Stainless Steel Vacuum Flask (Matte Steel)',
      '1500ml Large Family Camping Thermal Carafe with Handle (Navy Blue)'
    ]
  },
  {
    type: 'lunch box',
    category: 'Kitchen',
    subcategory: 'Food Storage',
    emoji: '🍱',
    baseUsdMin: 14,
    baseUsdMax: 59,
    synonyms: ['bento box', 'tiffin', 'food container', 'meal prep container', 'lunchbox'],
    tags: ['lunch box', 'bento', 'food storage', 'kitchen', 'leakproof', 'meal prep'],
    brands: [
      { brand: 'Bentgo', models: ['Classic All-in-One Bento Box', 'Modern Leak-Proof Lunch Box', 'Kids Prints 5-Compartment'] },
      { brand: 'Milton', models: ['Executive Stainless Steel Lunch Box 3 Tiffin', 'Double Decker Insulated Lunch Set'] },
      { brand: 'Zojirushi', models: ['Classic Bento Vacuum Lunch Jar', 'Stainless Steel Food Jar 25oz'] },
      { brand: 'Lock & Lock', models: ['3-Piece Airtight Bento Lunch Bag Set', 'Eco Glass Meal Box'] }
    ],
    variants: [
      '3-Compartment Leakproof Bento Box with Cutlery Set (Mint Green)',
      'Stainless Steel 3-Tier Insulated Tiffin with Thermal Bag (Silver/Blue)',
      'Microwave & Dishwasher Safe Modular Meal Prep Box (Matte Black)'
    ]
  },
  {
    type: 'coffee mug',
    category: 'Kitchen',
    subcategory: 'Drinkware',
    emoji: '☕',
    baseUsdMin: 11,
    baseUsdMax: 45,
    synonyms: ['mug', 'travel mug', 'ceramic mug', 'insulated coffee cup', 'tea cup'],
    tags: ['coffee', 'mug', 'cup', 'tea', 'kitchen', 'ceramic', 'insulated'],
    brands: [
      { brand: 'Ember', models: ['Temperature Control Smart Mug 2 (14oz)', 'Travel Mug 2+ with Apple Find My'] },
      { brand: 'Yeti', models: ['Rambler 14oz Stackable Mug with MagSlider', 'Rambler 10oz Lowball'] },
      { brand: 'Stanley', models: ['Classic Legendary Camp Mug 12oz', 'AeroLight Transit Mug 16oz'] },
      { brand: 'Le Creuset', models: ['Stoneware Heritage Mug 14oz', 'Vancouver Mug Set'] }
    ],
    variants: [
      '14oz Ceramic Campfire Style Stoneware Mug (Sage Green)',
      '12oz Stainless Steel Double Wall Vacuum Travel Mug (Matte Black)',
      '14oz Smart Self-Heating Mug with App Temperature Control (White)'
    ]
  },
  {
    type: 'air fryer',
    category: 'Appliances',
    subcategory: 'Small Kitchen Appliances',
    emoji: '🍳',
    baseUsdMin: 49,
    baseUsdMax: 249,
    synonyms: ['airfryer', 'digital air fryer', 'convection fryer', 'oil free fryer'],
    tags: ['air fryer', 'kitchen', 'appliances', 'cooking', 'healthy', 'oil-free'],
    brands: [
      { brand: 'Ninja', models: ['Air Fryer Pro 4-in-1 5-Quart', 'Foodi DualZone 2-Basket 8-Quart', 'Foodi Smart XL 6-in-1 Indoor Grill'] },
      { brand: 'Philips', models: ['Airfryer XXL with Rapid Air Technology 7.2L', 'Essential Airfryer 4.1L Compact Digital'] },
      { brand: 'Cosori', models: ['Pro III Dual Blaze 6.8-Quart Smart', 'TurboBlaze 6.0-Quart 9-in-1', 'Lite 4.0-Quart Air Fryer'] },
      { brand: 'Instant Pot', models: ['Vortex Plus 6-in-1 6-Quart with ClearCook', 'Vortex Slim 4-Quart'] }
    ],
    variants: [
      '4-Quart (3.8L) Digital 4-in-1 Touchscreen Air Fryer (Matte Black)',
      '6-Quart (5.7L) ClearCook Window with OdorErase Technology (Stainless Steel)',
      '8-Quart (7.6L) DualZone 2-Basket Independent Temp Fryer (Dark Charcoal)'
    ]
  },

  // STATIONERY & OFFICE
  {
    type: 'notebook',
    category: 'Stationery',
    subcategory: 'Paper Products',
    emoji: '📓',
    baseUsdMin: 8,
    baseUsdMax: 35,
    synonyms: ['journal', 'notepad', 'diary', 'spiral notebook', 'ruled notebook', 'bullet journal'],
    tags: ['notebook', 'stationery', 'paper', 'journal', 'writing', 'notes', 'office', 'school'],
    brands: [
      { brand: 'Moleskine', models: ['Classic Hard Cover Notebook (Ruled Large)', 'Classic Soft Cover (Dotted)', 'Expanded Ruled 400 Pages'] },
      { brand: 'Leuchtturm1917', models: ['Medium A5 Dotted Hardcover Notebook', 'Master A4+ Ruled Journal'] },
      { brand: 'Rhodia', models: ['Webnotebook A5 Dot Matrix 90g', 'Wirebound Notepad No 16'] },
      { brand: 'Classmate', models: ['Pulse 6-Subject Spiral Notebook 300 Pages', 'Premium Long Book Hardbound'] },
      { brand: 'Oxford', models: ['Black n Red A5 Hardcover Ruled', 'Campus Spiral Project Book'] }
    ],
    variants: [
      'A5 Hardcover 240 Ruled Pages with Inner Pocket & Bookmark (Black)',
      'A5 Dotted Grid 180 Pages for Bullet Journaling & Sketching (Emerald Green)',
      'B5 Spiral Bound 5-Subject Wirebound Notebook 300 Pages (Navy Blue)',
      'A4 Executive Leatherette Bound Meeting Journal (Chestnut Brown)'
    ]
  },
  {
    type: 'pen',
    category: 'Stationery',
    subcategory: 'Writing Instruments',
    emoji: '🖊️',
    baseUsdMin: 5,
    baseUsdMax: 65,
    synonyms: ['ballpoint pen', 'gel pen', 'rollerball pen', 'fountain pen', 'ink pen'],
    tags: ['pen', 'writing', 'stationery', 'office', 'school', 'ink', 'gel'],
    brands: [
      { brand: 'Pilot', models: ['G2 Premium Rolling Ball Gel Pens 0.7mm', 'Metropolitan Collection Fountain Pen', 'Precise V5 RT Deco'] },
      { brand: 'Parker', models: ['Jotter Ballpoint Pen Stainless Steel', 'Vector Fountain Pen with Cartridge', 'IM Rollerball Pen'] },
      { brand: 'Uni-ball', models: ['Signo 207 Retractable Gel Pens', 'Eye Micro UB-150 Liquid Ink Rollerball', 'Jetstream 0.7mm Smooth'] },
      { brand: 'Lamy', models: ['Safari Fountain Pen Medium Nib', 'AL-star Rollerball Pen Metal'] },
      { brand: 'Zebra', models: ['Sarasa Clip 0.5mm Gel Pen 10-Pack', 'Steel F-301 Ballpoint Heavy Duty'] }
    ],
    variants: [
      'Pack of 12 Smooth Black Gel Pens 0.5mm Quick-Dry Ink',
      'Pack of 5 Retractable 0.7mm Medium Point Liquid Ink Rollerball (Blue)',
      'Fine Nib Classic Stainless Steel Fountain Pen with Chrome Trim',
      'Executive Metal Ballpoint Pen with Refillable Ink in Gift Box'
    ]
  },
  {
    type: 'scientific calculator',
    category: 'Stationery',
    subcategory: 'Office Electronics',
    emoji: '🧮',
    baseUsdMin: 16,
    baseUsdMax: 149,
    synonyms: ['calculator', 'math calculator', 'graphing calculator', 'engineering calculator'],
    tags: ['calculator', 'math', 'stationery', 'student', 'engineering', 'school'],
    brands: [
      { brand: 'Casio', models: ['fx-991EX ClassWiz Advanced Scientific', 'fx-82MS 2nd Gen 240 Functions', 'fx-CG50 Color Graphing'] },
      { brand: 'Texas Instruments', models: ['TI-84 Plus CE Color Graphing Calculator', 'TI-30X IIS 2-Line Scientific', 'TI-Nspire CX II CAS'] },
      { brand: 'Sharp', models: ['EL-W516TBS 16-Digit Scientific', 'EL-501X2 131 Functions'] }
    ],
    variants: [
      'Standard 2-Line Display 240 Functions High School Calculator (Black)',
      'Natural Textbook Display 552 Functions Engineering Calculator (White/Silver)',
      'Rechargeable High-Resolution Color Graphing Calculator (Electric Blue)'
    ]
  },

  // BAGS & TRAVEL
  {
    type: 'backpack',
    category: 'Bags',
    subcategory: 'Travel & Casual Bags',
    emoji: '🎒',
    baseUsdMin: 29,
    baseUsdMax: 179,
    synonyms: ['bag', 'travel backpack', 'college bag', 'school bag', 'rucksack', 'daypack'],
    tags: ['bag', 'backpack', 'travel', 'college', 'school', 'daypack', 'outdoor'],
    brands: [
      { brand: 'The North Face', models: ['Jester Backpack 28L', 'Borealis Laptop Daypack 28L', 'Recon Commuter Backpack 30L'] },
      { brand: 'Osprey', models: ['Daylite Plus 20L Everyday Pack', 'Farpoint 40 Travel Pack', 'Nebula 32L Commuter'] },
      { brand: 'Samsonite', models: ['Tectonic 2 Large Backpack', 'Kavya City Commuter 25L'] },
      { brand: 'Fjallraven', models: ['Kanken Classic 16L Vinylon', 'Kanken Laptop 15"'] },
      { brand: 'American Tourister', models: ['Urban Groove 26L School Pack', 'Kam-Liters 30L Casual Bag'] }
    ],
    variants: [
      '20L Lightweight Water-Resistant Everyday Daypack (Forest Green)',
      '28L All-Weather Laptop & College Commuter Backpack (Matte Black)',
      '40L Flight-Approved Carry-On Travel Rucksack with Sternum Strap (Charcoal Gray)'
    ]
  },

  // FASHION & FOOTWEAR
  {
    type: 'running shoes',
    category: 'Footwear',
    subcategory: 'Athletic Shoes',
    emoji: '👟',
    baseUsdMin: 59,
    baseUsdMax: 219,
    synonyms: ['sneakers', 'jogging shoes', 'trainers', 'sports shoes', 'marathon shoes'],
    tags: ['shoes', 'running', 'footwear', 'sports', 'sneakers', 'fitness', 'breathable'],
    brands: [
      { brand: 'Nike', models: ['Air Zoom Pegasus 41', 'Invincible 3 Max Cushion', 'Revolution 7 Road Running', 'Vaporfly 3 Racing'] },
      { brand: 'Adidas', models: ['Ultraboost Light Running Shoes', 'Supernova Rise Everyday Running', 'Adizero Boston 12'] },
      { brand: 'Asics', models: ['Gel-Nimbus 26 Plush Comfort', 'Gel-Kayano 31 Stability', 'Novablast 4 Energetic Bounce'] },
      { brand: 'Hoka', models: ['Clifton 9 Everyday Cushion', 'Bondi 8 Ultra-Cushioned Road', 'Speedgoat 5 Trail'] },
      { brand: 'New Balance', models: ['Fresh Foam X 1080v13', 'FuelCell Rebel v4', '990v6 Made in USA'] },
      { brand: 'Puma', models: ['Velocity Nitro 3', 'Deviate Nitro 2 Carbon Plated'] }
    ],
    variants: [
      'Men US 9 / EU 42.5 Breathable Engineered Mesh (Core Black/White)',
      'Men US 10 / EU 44 Responsive Nitrogen Foam Cushion (Cobalt Blue/Volt)',
      'Women US 7.5 / EU 38.5 High-Comfort Road Running (Pure White/Ice Mint)',
      'Women US 8.5 / EU 39.5 All-Day Cushion Trail Running (Sage Grey/Coral)'
    ]
  },
  {
    type: 'sunglasses',
    category: 'Fashion',
    subcategory: 'Eyewear',
    emoji: '🕶️',
    baseUsdMin: 25,
    baseUsdMax: 249,
    synonyms: ['shades', 'polarized sunglasses', 'aviators', 'wayfarer', 'sun glasses'],
    tags: ['sunglasses', 'eyewear', 'shades', 'fashion', 'uv protection', 'polarized'],
    brands: [
      { brand: 'Ray-Ban', models: ['Classic Aviator Total UV RB3025', 'Original Wayfarer Classic RB2140', 'Clubmaster Classic RB3016', 'Round Metal RB3447'] },
      { brand: 'Oakley', models: ['Holbrook Polarized Prizm Lenses', 'Gascan Wrap Sunglasses', 'Radar EV Path Sports'] },
      { brand: 'Maui Jim', models: ['Ho\'okipa PolarizedPlus2 Rimless', 'Peahi Wrap Frame Polarized'] },
      { brand: 'Hawkers', models: ['One Polarized Classic Black', 'Warwick Geometric Sunglasses'] }
    ],
    variants: [
      'Polarized UV400 Classic Aviator with Gold Metal Frame (Green G-15 Lenses)',
      'Polarized Square Wayfarer Style Frame (Matte Black / Smoke Grey)',
      'Sports Wrap UV400 Hydrophobic Performance Sunglasses (Matte Black / Prizm Sapphire)'
    ]
  },

  // HEALTH & FITNESS
  {
    type: 'yoga mat',
    category: 'Fitness',
    subcategory: 'Yoga & Pilates',
    emoji: '🧘',
    baseUsdMin: 18,
    baseUsdMax: 99,
    synonyms: ['exercise mat', 'fitness mat', 'pilates mat', 'workout mat', 'gym mat'],
    tags: ['yoga', 'mat', 'fitness', 'exercise', 'workout', 'non-slip', 'pilates'],
    brands: [
      { brand: 'Lululemon', models: ['The Mat 5mm Natural Rubber', 'The Reversible Mat 3mm Lightweight'] },
      { brand: 'Manduka', models: ['PRO Yoga Mat 6mm High Density', 'eKO Lite 4mm Eco-Friendly Rubber'] },
      { brand: 'Gaiam', models: ['Premium 6mm Reversible Yoga Mat', 'Dry-Grip Extra Thick Mat'] },
      { brand: 'BalanceFrom', models: ['GoYoga All-Purpose 1/2-Inch Extra Thick', 'Anti-Tear Fitness Mat'] }
    ],
    variants: [
      '6mm Non-Slip TPE Eco-Friendly Exercise Mat with Carrying Strap (Teal/Grey)',
      '5mm Natural Tree Rubber Extra Grip Textured Studio Mat (Deep Purple)',
      '1/2-Inch High Density Memory Foam Joint-Support Workout Mat (Black)'
    ]
  },
  {
    type: 'dog food',
    category: 'Pet Supplies',
    subcategory: 'Dog Food & Treats',
    emoji: '🐕',
    baseUsdMin: 19,
    baseUsdMax: 89,
    synonyms: ['canine food', 'pet food', 'dry dog food', 'kibble', 'puppy food'],
    tags: ['pet', 'dog', 'food', 'kibble', 'dry food', 'puppy', 'adult dog'],
    brands: [
      { brand: 'Royal Canin', models: ['Size Health Nutrition Medium Adult Dry', 'Golden Retriever Adult Breed Specific', 'Mini Puppy Food'] },
      { brand: 'Hill\'s Science Diet', models: ['Adult Large Breed Chicken & Barley', 'Sensitive Stomach & Skin Grain-Inclusive'] },
      { brand: 'Purina Pro Plan', models: ['High Protein Adult 26/16 Shredded Blend', 'Complete Essentials with Probiotics'] },
      { brand: 'Pedigree', models: ['Adult Complete Nutrition Grilled Steak & Veg', 'Puppy Growth & Protection Chicken'] },
      { brand: 'Blue Buffalo', models: ['Life Protection Formula Adult Chicken & Rice', 'Wilderness High Protein Grain-Free'] }
    ],
    variants: [
      '3 kg (6.6 lbs) Bag Real Chicken & Brown Rice Recipe',
      '12 kg (26.4 lbs) Large Breed Active Formula with Omega-6 & Glucosamine',
      '15 kg (33 lbs) Premium High-Protein Grain-Free Kibble for All Life Stages'
    ]
  },

  // RANDOM UNKNOWN ITEM XYZ / FALLBACK BENCHMARK
  {
    type: 'random unknown item xyz',
    category: 'General Goods',
    subcategory: 'Novelty & Miscellaneous',
    emoji: '📦',
    baseUsdMin: 15,
    baseUsdMax: 85,
    synonyms: ['xyz mystery item', 'novelty item xyz', 'generic gadget xyz'],
    tags: ['random', 'unknown', 'item', 'xyz', 'novelty', 'miscellaneous', 'special'],
    brands: [
      { brand: 'GeoTech', models: ['Omni Device XYZ-100', 'Nova Explorer XYZ-200', 'Apex Tool XYZ-300'] },
      { brand: 'Universal', models: ['Smart Companion XYZ Standard', 'Multi-Utility Widget XYZ Pro'] }
    ],
    variants: [
      'Standard Edition (Space Gray)',
      'Pro Developer Kit with Accessories (Matte Black)',
      'Deluxe Travel Pack with Carry Case (Silver Titanium)'
    ]
  }
];
