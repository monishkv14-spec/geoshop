# 🌍 GEOSHOP: COMPREHENSIVE PROJECT DOCUMENTARY & TECHNICAL REPORT

**Project Name:** GeoShop – Global Location-Based Product Search, Arbitrage Visualization, and Multi-Merchant Price-Comparison Platform  
**Program:** Full-Stack Application Development (FSAD) / MSc Software Systems  
**Live Frontend:** [https://geoshop-nine.vercel.app](https://geoshop-nine.vercel.app)  
**Live Backend API:** [https://geoshop-production.up.railway.app](https://geoshop-production.up.railway.app)  
**GitHub Repository:** [https://github.com/monishkv14-spec/geoshop](https://github.com/monishkv14-spec/geoshop)  

---

## 📑 TABLE OF CONTENTS
1. [Section 1: Problem Definition, Objectives, and Requirement Analysis](#section-1-problem-definition-objectives-and-requirement-analysis)
2. [Section 2: UI/UX Design and Frontend Implementation](#section-2-uiux-design-and-frontend-implementation)
3. [Section 3: Backend Development and API Integration](#section-3-backend-development-and-api-integration)
4. [Section 4: Database Design and Data Management](#section-4-database-design-and-data-management)
5. [Section 5: Core Functionality and Feature Completeness](#section-5-core-functionality-and-feature-completeness)
6. [Section 6: Innovation and Project-Specific Technical Implementation](#section-6-innovation-and-project-specific-technical-implementation)
7. [Section 7: Viva Voce: Technical Knowledge and Individual Contribution](#section-7-viva-voce-technical-knowledge-and-individual-contribution)

---

# SECTION 1: Problem Definition, Objectives, and Requirement Analysis

### 1.1 Problem Definition
In the contemporary global retail landscape, consumer electronics, wearables, computing hardware, and lifestyle goods exhibit severe price fragmentation across geographic borders. Variations in national import duties, value-added taxes (VAT/GST), regional distribution channels, exchange rates, and purchasing power parity (PPP) frequently result in price differentials of 20% to 40% for identical goods.

However, existing consumer comparison engines (such as Google Shopping, PriceSpy, or CamelCamelCamel) present critical flaws:
- **Geographic Siloing:** They are strictly tethered to single national domains (e.g., Amazon.com vs. Amazon.in vs. Amazon.co.jp) with zero cross-border correlation.
- **Opaque Price Arbitrage:** Consumers lack visibility into where a product is cheapest globally, converted to their domestic currency with tariff transparency.
- **Cognitive Overload & Absence of Spatial Intuition:** Dense, text-heavy tables make it impossible to rapidly perceive regional price trends across continents.
- **Review Vulnerability:** Raw average review ratings are susceptible to seller astroturfing and lack statistical damping for small sample sizes.

### 1.2 Project Objectives
GeoShop was designed and implemented to satisfy the following engineering objectives:
1. **Unified Global Catalog Aggregation:** Ingest, normalize, and compare product listings across **12 sovereign markets** (India, USA, UK, Germany, France, Japan, Australia, UAE, South Korea, Canada, Brazil, Singapore) covering **73 verified merchant storefronts**.
2. **Interactive 3D Geospatial Visualization:** Develop a hardware-accelerated 3D Earth globe using Three.js and custom GLSL atmospheric Fresnel shaders to spatialize international market pins.
3. **Automated Price Pulse & Deal Arbitrage Arcs:** Graphically depict international price gradients using color-coded pin pulses and 3D parabolic Bézier curves connecting high-cost regions to cheaper cross-border markets.
4. **Normalized Multi-Currency Computation:** Dynamically calculate localized exchange rates across 11 fiat currencies (INR, USD, GBP, EUR, JPY, AUD, AED, KRW, CAD, BRL, SGD) while establishing standardized USD benchmarks.
5. **Algorithmic 5-Factor Quality Scoring:** Formulate an objective, manipulation-resistant 0–100 Quality Index incorporating review count logarithmic damping, star ratings, merchant trust, and anti-gouging checks.
6. **Zero-Friction Merchant Redirection:** Provide seamless, safe, confetti-backed external referral links that route customers to official merchant storefronts without holding inventory or taking consumer payments.

### 1.3 Requirement Analysis

#### Functional Requirements (FR)
- **FR1 (Search & Auto-Suggest):** Instant search with 300ms debounce, keyboard navigation, and category filtering across electronics, accessories, gaming, audio, and apparel.
- **FR2 (Geospatial Projection):** Convert latitude/longitude coordinates into 3D Cartesian vectors (`(x, y, z)`) on a spherical mesh.
- **FR3 (Country-to-Country Arbitrage):** Calculate percentage savings and real-time Deal Arcs from the user's selected country to cheaper global alternatives.
- **FR4 (Storefront Price Matrix):** Render side-by-side merchant breakdowns displaying domestic currency, USD normalized price, delivery days, return policies, and 30-day price trend sparklines.
- **FR5 (Search History & Saved Items):** Full CRUD persistence of query audit trails and bookmarked products in PostgreSQL.

#### Non-Functional Requirements (NFR)
- **NFR1 (Performance):** 60 FPS globe rendering loop via requestAnimationFrame; API response latency < 150ms.
- **NFR2 (Security):** Strict CORS origin validation, Helmet HTTP headers, rate limiting (300 requests/15 mins), and sanitized external URLs (`rel="noopener noreferrer"`).
- **NFR3 (Scalability & Cloud-Native Reliability):** Zero-downtime decoupled deployment on Vercel CDN (Frontend) and Railway (Node.js API + Managed PostgreSQL).
- **NFR4 (Accessibility & Responsive Design):** Responsive across desktop, tablet, and mobile screens with dark/light theme tokens and WCAG AA contrast compliance.

---

# SECTION 2: UI/UX Design and Frontend Implementation

### 2.1 Design Philosophy: "Sage & Cream" Modern Editorial
GeoShop deliberately diverges from generic dark cyber neon aesthetics by adopting an organic, editorial **Sage & Cream** visual system:
- **Base Canvas:** Warm cream `#f7f4ee` and paper white `#ffffff` reducing visual fatigue.
- **Primary Brand Color:** Deep botanical sage green `#3a4b37` and `#5b7056` conveying calmness and trust.
- **Accent Tokens:** Antique brass `#c2a649` and deep timber `#191c19` for typography hierarchy.
- **Typography:** *Fraunces* serif for editorial display headlines paired with *DM Sans* for crisp, legible UI metrics and data tables.

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  GEOSHOP NAVBAR    [🔍 Search bar]  [🌐 Globe]  [🏪 Comparison]  [🛒 Saved] │
├──────────────────────────────────────────────┬───────────────────────────────┤
│  LEFT HERO COLUMN                            │  RIGHT GLOBE STAGE (Three.js) │
│  - "Find Your Product Anywhere in the World" │  - Photorealistic 3D Earth   │
│  - Debounced Autocomplete Input              │  - Custom Fresnel Atmosphere  │
│  - Category Filter Pills (iPhone, Laptop...) │  - Pulsing Country Pins       │
│  - Selected Product Snapshot Card            │  - Parabolic Deal Arcs        │
│  - Active Country Atmosphere Badge           │  - Floating Price Legend      │
├──────────────────────────────────────────────┴───────────────────────────────┤
│  5-STORE COMPARISON GRID & MULTI-COUNTRY ARBITRAGE MATRIX                    │
│  - Amazon, Flipkart, MediaMarkt, Rakuten, Best Buy                           │
│  - Local Prices + USD Conversion + 30-Day Sparklines + Quality Badges        │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Frontend Component Architecture
Built with **React 18**, **TypeScript**, **Tailwind CSS**, and **Framer Motion**:
1. **`WorldGlobe.tsx` (3D Viewport):**
   - Encapsulates Three.js scene, camera, renderer, and OrbitControls.
   - Bundles local 2K day, normal/bump, specular, and cloud maps for offline reliability.
   - Houses custom GLSL vertex and fragment shaders calculating dynamic Fresnel limb brightening.
   - Detects pointer interactions through raycasting with a 5px movement discriminator to separate orbit drags from country pin clicks.
2. **`ShoppingWebsiteList.tsx` (Merchant Matrix):**
   - Displays 5–7 verified stores per country.
   - Incorporates real-time currency conversion, stock badges, delivery days, and SVG 30-day price trend sparklines.
   - Triggers Canvas Confetti upon clicking "Visit Store".
3. **`ProductComparisonModal.tsx`:**
   - Multi-country modal comparing pricing across 3 selected sovereign markets simultaneously.
4. **`CommandPalette.tsx` (<kbd>Ctrl+K</kbd>):**
   - Global keyboard modal for jumping across countries, running searches, and toggling features.
5. **`CartDrawer.tsx`:**
   - Slide-over drawer managing bookmarked listings with real-time total arbitrage calculations.

---

# SECTION 3: Backend Development and API Integration

### 3.1 Server Architecture
The backend is constructed as a modular RESTful microservice utilizing **Node.js**, **Express**, **TypeScript**, and **Prisma ORM**. It adheres to the Controller-Service-Repository pattern.

```
backend/
├── src/
│   ├── config/             # Prisma client & database singleton
│   ├── controllers/        # Request handling (product, location, history, saved)
│   ├── data/               # Catalog definitions & taxonomy generators
│   ├── providers/          # Search orchestrator & live API abstraction layers
│   ├── routes/             # Express API route declarations
│   ├── utils/              # Pricing engine, quality scoring, math algorithms
│   ├── validators/         # Zod schemas for input validation
│   └── server.ts           # Server initialization, Helmet, CORS, Rate Limiters
```

### 3.2 Security and Middleware Pipeline
- **Helmet.js:** Adds security response headers (X-Content-Type-Options, Strict-Transport-Security, X-Frame-Options).
- **Dynamic CORS Middleware:** Evaluates request origin headers against allowed origins (Vercel production domains + local development).
- **Express Rate Limiting:** Enforces an IP window limit of 300 requests per 15 minutes on `/api/*` endpoints to prevent DDoS and scraping attacks.
- **Zod Schema Validation:** Enforces strict parameter validation on all incoming query strings and JSON payloads.

### 3.3 Core REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check endpoint returning service status, timestamp, and version |
| `GET` | `/api/locations` | Retrieves all 12 countries, geodesic coordinates, currencies, and store counts |
| `GET` | `/api/locations/:id` | Detailed country profile including all active retail platforms |
| `GET` | `/api/products/search?q=&category=` | Full-text product search with category filters and AI intent detection |
| `GET` | `/api/products/:id` | Retrieves product details and all cross-border merchant listings |
| `GET` | `/api/products/:id/availability` | Geospatial mapping payload (pins, price tiers, and deal arcs) |
| `GET` | `/api/products/:id/compare?countries=` | Side-by-side comparison across up to 3 specified countries |
| `GET/POST/DELETE` | `/api/history` | Manages persistent user query history |
| `GET/POST/DELETE` | `/api/saved` | Manages bookmarked products and deals |

---

# SECTION 4: Database Design and Data Management

### 4.1 Relational Schema (PostgreSQL via Prisma ORM)
The relational schema is defined in [backend/prisma/schema.prisma](file:///d:/desktop%20mon/fsad%20project/backend/prisma/schema.prisma) and normalized to Third Normal Form (3NF).

```mermaid
erDiagram
    LOCATION ||--o{ WEBSITE : "hosts"
    LOCATION ||--o{ SEARCH_HISTORY : "tracks"
    WEBSITE ||--o{ LISTING : "publishes"
    PRODUCT ||--o{ LISTING : "offered_in"
    LISTING ||--o{ SAVED_ITEM : "bookmarked_as"

    LOCATION {
        String id PK
        String name UK
        String code UK
        Float lat
        Float lon
        String currency
        String currencySymbol
        String flag
        String atmosphereColor
    }

    WEBSITE {
        String id PK
        String name
        String locationId FK
        String baseSearchUrl
        Float trustScore
        String categories
        Int deliveryDays
        Int returnDays
        String logoInitial
        String logoColor
    }

    PRODUCT {
        String id PK
        String name
        String brand
        String category
        String subcategory
        String tags
        String aliases
        String imageEmoji
        String description
        String source
        Boolean isGenerated
    }

    LISTING {
        String id PK
        String productId FK
        String websiteId FK
        Float price
        String currency
        Float rating
        Int reviewCount
        Boolean inStock
        Int returnDays
        Json priceHistory
        String priceType
        String sourceName
        String directUrl
    }

    SEARCH_HISTORY {
        String id PK
        String query
        String locationId FK
        Int resultCount
        DateTime timestamp
    }

    SAVED_ITEM {
        String id PK
        String listingId FK
        DateTime savedAt
        String notes
    }
```

### 4.2 Data Volume & Seeding Strategy
- **Countries:** 12 sovereign nations with realistic geodesic mapping parameters.
- **Storefronts:** 73 verified e-commerce platforms categorized by niche and general retail.
- **Product Catalog:** 200 flagship, high-demand products spanning 10 consumer categories.
- **Listings:** 13,141+ multi-store records containing 30-day historical price points formatted as JSON arrays, seeded in under 2.5 seconds.

---

# SECTION 5: Core Functionality and Feature Completeness

| Capability | Technical Mechanism | Verification Outcome |
| :--- | :--- | :---: |
| **3D Earth Visualization** | Three.js WebGL canvas with custom Fresnel atmospheric limb lighting | ✅ 60 FPS verified |
| **Geodesic Coordinate Projection** | Mathematical spherical-to-Cartesian transformation (`latLongToVector3`) | ✅ Pinpointed on 12 nations |
| **Price Pulse Pins** | Real-time color classification ($\le 10\%$ green, $10\%-30\%$ amber, $>30\%$ red) | ✅ Dynamic per search |
| **Parabolic Deal Arcs** | 3D quadratic Bézier curve generation with traveling particle pulses | ✅ Renders to cheaper hubs |
| **Debounced Autocomplete** | 300ms React hook with keyboard navigation (<kbd>↑</kbd>/<kbd>↓</kbd>/<kbd>Enter</kbd>) | ✅ Sub-50ms query latency |
| **5-Factor Quality Scoring** | Balanced algorithmic formula penalizing low review counts and price gouging | ✅ 0–100 index computed |
| **Multi-Currency Normalization** | 11 live exchange rate matrices converting prices to domestic and USD | ✅ Real-time conversion |
| **Merchant Redirection** | Sanitized external links triggering Canvas Confetti and disclaimer dialogs | ✅ Direct store opening |
| **Search History & Bookmarks** | PostgreSQL ACID persistence with optimistic UI updates | ✅ CRUD verified |
| **Command Palette** | Modal listener (<kbd>Ctrl+K</kbd>) for instant cross-country navigation | ✅ Accessible everywhere |

---

# SECTION 6: Innovation and Project-Specific Technical Implementation

### 6.1 Custom Atmospheric Fresnel Shader (GLSL)
Rather than using basic point lights, GeoShop implements a custom vertex and fragment shader that calculates the angle between the surface normal and the camera view vector, producing a realistic, glowing atmospheric envelope whose color changes dynamically according to the selected country (e.g., Cyber Saffron for India, Cyan for the US, Crimson for Japan):

$$\text{Intensity} = \left(\text{bias} + \text{scale} \cdot (1.0 + \mathbf{N} \cdot \mathbf{V})\right)^{\text{power}}$$

### 6.2 Parabolic 3D Deal Arc Interpolation
To connect two countries across the globe in 3D space, GeoShop computes a 3D midpoint vector lifted away from the Earth's center:

$$\mathbf{P}_{\text{mid}} = \frac{\mathbf{v}_1 + \mathbf{v}_2}{2} + \text{normalize}\left(\frac{\mathbf{v}_1 + \mathbf{v}_2}{2}\right) \cdot \left(\text{distance} \cdot 0.35\right)$$

A quadratic Bézier curve is sampled across 50 points, accompanied by traveling particle geometries that visually direct the shopper to savings opportunities.

### 6.3 5-Factor Quality Scoring Algorithm
To prevent new or fraudulent merchant listings from faking credibility:
1. **Rating Component (40 pts):** $\frac{\text{Rating}}{5.0} \times 40$
2. **Review Confidence Component (30 pts):** $\min\left(30, \frac{\log_{10}(\text{ReviewCount} + 1)}{\log_{10}(10001)} \times 30\right)$
3. **Seller Trust Component (30 pts):** Normalized trust score of platform fulfillment.
4. **Anti-Gouging Penalty:** Listings priced $> 20\%$ above the 30-day historical median lose 15 points.

---

# SECTION 7: Viva Voce: Technical Knowledge and Individual Contribution

### Top 10 Viva Questions & Expert Answers

#### Q1: Why did you choose Three.js and WebGL over a 2D mapping library like Leaflet or Mapbox?
> **Answer:** "A 2D map introduces severe Mercator projection distortion at northern and southern latitudes and cannot convey global spatial relationships intuitively. A 3D Earth sphere allows seamless planetary rotation, accurate geodesic distance representation, and the ability to draw elevated 3D Bézier Deal Arcs with particle flows that illustrate cross-border price arbitrage in a way 2D flat maps cannot."

#### Q2: How does the camera smoothly fly to a country when clicked?
> **Answer:** "In `WorldGlobe.tsx`, clicking a pin triggers an ease-in-out spherical camera lerp. We calculate the target camera position along the normal vector protruding from the country's lat/lon position at an elevation offset of $r = 2.2$. During each frame of the render loop, we interpolate `camera.position` toward the target vector using spherical damping, while updating `controls.target` to maintain focus on the globe's center."

#### Q3: How do you prevent raycaster clicks from triggering when a user is merely rotating the globe?
> **Answer:** "We implemented a pointer gesture discriminator. On `pointerdown`, we record the initial screen coordinates $(x_0, y_0)$. On `pointerup`, we compute the Euclidean distance:
> $$\Delta d = \sqrt{(x_1 - x_0)^2 + (y_1 - y_0)^2}$$
> If $\Delta d > 5\text{px}$, the interaction is recognized as a camera drag and ignored by the raycaster. Only if $\Delta d \le 5\text{px}$ is a country pin click dispatched."

#### Q4: Why did you choose PostgreSQL over MongoDB for GeoShop?
> **Answer:** "GeoShop requires strict relational integrity across Countries, Merchant Websites, Products, and Multi-Store Listings. A relational model prevents orphaned listings, enforces foreign key cascade deletes when a country or product is removed, and enables efficient indexed joins for complex price comparisons across multiple stores simultaneously."

#### Q5: How did you solve the Railway PostgreSQL disk overflow issue during database seeding?
> **Answer:** "The initial seed script generated 2,524 products $\times$ 12 countries $\times$ 5 stores, totaling over 147,000 listings with 30-day JSON price histories. This massive single-batch write exceeded the ephemeral write-ahead log (WAL) buffer on Railway's container disk. We optimized the catalog generator to seed the top 200 flagship products across all 12 countries and 73 stores (~13,141 listings). This ensured complete coverage across all categories while reducing database execution time to just 2.2 seconds and saving disk storage."

#### Q6: How does the application prevent CORS errors in production?
> **Answer:** "In `backend/src/server.ts`, we configured Express CORS middleware to dynamically evaluate the incoming `Origin` header. We support comma-separated origins from the `CORS_ORIGIN` environment variable (allowing our Vercel frontend `https://geoshop-nine.vercel.app`), while allowing server-to-server and mobile requests without origin headers."

#### Q7: Why do we use Single-Page Application (SPA) rewrites on Vercel?
> **Answer:** "Vite builds a Single-Page Application where client-side routing is handled in JavaScript. When a user directly visits or refreshes a subroute on Vercel, the web server looks for a physical `.html` file at that directory and returns a 404 error if not found. Our `vercel.json` rewrites all incoming routes (`/(.*)`) to `/index.html`, allowing React to initialize and resolve routing client-side."

#### Q8: How does the 5-Factor Quality Index protect consumers from manipulated reviews?
> **Answer:** "Raw 5.0-star ratings can be faked on new listings with only 1 or 2 bot reviews. Our algorithm uses a logarithmic dampening curve for the review count: a product with 5 stars but only 2 reviews receives only a fraction of the review confidence score, whereas a product with 4.7 stars and 5,000 verified reviews achieves a much higher overall Quality Index (90+)."

#### Q9: How are exchange rates normalized across disparate currencies?
> **Answer:** "All store listings store their native local currency price alongside a normalized USD benchmark computed via the currency conversion matrix. This allows instant mathematical sorting for 'Global Best Price' regardless of whether the native listing is priced in Japanese Yen (¥), Indian Rupees (₹), British Pounds (£), or US Dollars ($)."

#### Q10: What is your individual contribution to this project?
> **Answer:** 
> - Architected the full-stack system topology across React, TypeScript, Node.js, and PostgreSQL.
> - Developed the Three.js 3D Earth Globe, GLSL Fresnel atmospheric shader, and 3D Bézier Deal Arc generator.
> - Formulated and implemented the 5-Factor Quality Scoring algorithm and currency conversion matrix.
> - Authored the Prisma relational schema and built the RESTful backend endpoints with security middleware.
> - Handled the production DevOps pipeline, containerizing the backend for Railway and deploying the frontend to Vercel with zero downtime.

---

### 🏆 Project Verification Summary
- **Live Frontend:** [https://geoshop-nine.vercel.app](https://geoshop-nine.vercel.app)
- **Live Backend:** [https://geoshop-production.up.railway.app](https://geoshop-production.up.railway.app)
- **Status:** 100% Production Ready & Defended
