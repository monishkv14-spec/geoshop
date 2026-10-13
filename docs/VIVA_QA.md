# 🎓 GeoShop: Comprehensive MSc Viva Examination Q&A

This guide prepares you for your final MSc examination defense. It includes **20 core viva questions** along with technical, architectural, and mathematical explanations.

---

### Q1: What is the core problem GeoShop solves, and what is its business model?
**Answer:**
GeoShop addresses price opacity and tariff disparities across global e-commerce. Consumer electronics and luxury goods often have price discrepancies exceeding 25–40% between countries (e.g. India vs. Japan vs. USA) due to customs duties, regional promotions, and exchange rates. GeoShop serves as a discovery and comparison layer: it does not handle payment processing or inventory; instead, it compares verified platforms (Amazon, Flipkart, MediaMarkt, Rakuten) and safely redirects buyers to official merchant storefronts, operating on potential affiliate referral commissions.

---

### Q2: Why did you choose Three.js for the world globe instead of 2D map libraries like Leaflet or Mapbox?
**Answer:**
1. **True Spherical Geodesics**: A 3D globe avoids the heavy distortion of 2D map projections (e.g., Mercator projections distort high-latitude landmasses like Greenland and Antarctica).
2. **Deal Arcs Representation**: Parabolic 3D Bézier curves arching over the spherical globe visually communicate savings routes between continents far more effectively than flat lines.
3. **Immersive Atmosphere & Rotation**: Custom GLSL Fresnel shaders provide dynamic day/night lighting, specular ocean glint, and country-specific atmosphere color shifts (e.g. Saffron for India, Cyan for US, Crimson for Japan) that elevate UX.
4. **Performance**: Vanilla Three.js runs directly on WebGL hardware acceleration, maintaining a steady 60 FPS on standard modern laptops.

---

### Q3: How do you map 2D geographical Latitude and Longitude to 3D Cartesian coordinates (X, Y, Z)?
**Answer:**
We use spherical coordinate transformation calibrated to standard equirectangular UV mapping:
```typescript
export function latLongToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}
```
`phi` represents the polar angle measured from the North Pole (latitude +90° to -90°), and `theta` represents the azimuthal angle along the equator. The negative X-axis matches the standard Three.js texture coordinate system so that India (20.59° N, 78.96° E) lands precisely on the Indian peninsula.

---

### Q4: How did you resolve the conflict between single-click, double-click, and drag gestures on the 3D globe?
**Answer:**
We implemented a two-stage gesture discriminator:
1. **Drag vs. Click**: On `pointerdown`, we record the initial screen coordinates $(x_0, y_0)$. If the pointer moves more than 5 pixels during the gesture, an `isDragging` flag is set to `true`, suppressing all click handlers on `pointerup`.
2. **Single-Click vs. Double-Click**: When a pin is clicked without dragging, we set a 250ms timeout. If a second click occurs within that 250ms window, the timer is cleared and the double-click event is dispatched (opening the store comparison matrix). If no second click occurs within 250ms, the single-click handler fires (triggering the fly-to camera ease).

---

### Q5: How is the camera fly-to animation implemented without camera shake or jump?
**Answer:**
We use cubic ease-out spherical interpolation. When a marker is selected, we calculate the target camera vector:
$$\mathbf{P}_{\text{target}} = \text{normalize}(\mathbf{P}_{\text{pin}}) \times 15.5$$
In the animation render loop, we track progress over 1,200 milliseconds using:
$$\text{progress} = \min(1, \frac{\Delta t}{1200}), \quad \text{ease} = 1 - (1 - \text{progress})^3$$
$$\mathbf{P}_{\text{cam}}(t) = \text{lerp}(\mathbf{P}_{\text{start}}, \mathbf{P}_{\text{target}}, \text{ease})$$
`OrbitControls.target` is kept locked at the globe center `(0, 0, 0)`, ensuring zero camera shaking or orientation discontinuity.

---

### Q6: How are the 3D Animated Deal Arcs constructed and animated?
**Answer:**
For any selected country, we find all available countries where the normalized USD price is lower. For each destination:
1. We compute the 3D midpoint between source and target:
   $$\mathbf{M} = \frac{\mathbf{P}_{\text{source}} + \mathbf{P}_{\text{target}}}{2}$$
2. We elevate the apex radially based on surface distance:
   $$\mathbf{A}_{\text{apex}} = \text{normalize}(\mathbf{M}) \times R \times (1.12 + \min(0.48, \frac{\text{dist}}{1.8 R}))$$
3. We generate a `QuadraticBezierCurve3(source, apex, target)`.
4. We render an emerald glowing line (`LineBasicMaterial`) and animate a traveling pulse particle along the curve at `t = (time * speed) % 1.0`.
5. We project the 3D apex to 2D screen coordinates using `apex.project(camera)` to position interactive savings badges (`Save X% in Country`).

---

### Q7: Explain the mathematical formula behind the Derived Quality Index (0-100).
**Answer:**
The Quality Index prevents dishonest manipulation by combining 3 weighted components plus safety constraints:
$$\text{Score} = C_{\text{rating}} + C_{\text{volume}} + C_{\text{trust}}$$
1. **Rating Component (40 pts)**:
   $$C_{\text{rating}} = \frac{\text{rating}}{5.0} \times 40$$
2. **Review Volume Component (30 pts, Log-Scaled)**:
   $$C_{\text{volume}} = \min\left(30, \log_{10}(\text{reviewCount} + 1) \times 7.5\right)$$
   *Why log-scale?* The statistical confidence increase from 10 to 1,000 reviews is immense, but the difference between 50,000 and 100,000 reviews has diminishing marginal utility.
3. **Seller Trust Component (30 pts)**:
   $$C_{\text{trust}} = \frac{\text{trustScore}}{5.0} \times 30$$
4. **Safety Penalties**: If return policy is less than 14 days, deduct 10 points. If price gouging risk is flagged (>20% above historical median), deduct 15 points.

---

### Q8: How does the Price Pulse tiering algorithm work?
**Answer:**
For any searched product across all global locations, we calculate the minimum price in USD ($P_{\text{min}}$). Each location's relative percentage difference is calculated:
$$\Delta\% = \frac{P_{\text{loc}} - P_{\text{min}}}{P_{\text{min}}} \times 100$$
- **Green (Cheapest / Best Price)**: $\Delta\% \le 10\%$
- **Amber (Mid-Tier)**: $10\% < \Delta\% \le 30\%$
- **Red (Higher Price / Import Tariffs)**: $\Delta\% > 30\%$

---

### Q9: How do you handle race conditions during rapid user search typing?
**Answer:**
In `App.tsx`, we maintain a request ID reference `searchRequestIdRef`. Every time a user types, the ID is incremented:
```typescript
const reqId = ++searchRequestIdRef.current;
const res = await fetchSearchProducts(query);
if (reqId !== searchRequestIdRef.current) return; // Stale response discarded!
```
If query "iph" takes 400ms to resolve and query "iphone" takes 150ms, the older "iph" response finishes second but is discarded because `reqId !== searchRequestIdRef.current`. This guarantees zero UI flicker and zero out-of-order state overwrites.

---

### Q10: How do you prevent memory leaks and handle React StrictMode double-mounting in Three.js?
**Answer:**
React 18/19 StrictMode mounts, unmounts, and remounts components in development to detect leaks. In `WorldGlobe.tsx`'s `useEffect` return cleanup handler:
1. We cancel the `requestAnimationFrame` ID.
2. We remove all DOM and window event listeners (`resize`, `pointerdown`, `visibilitychange`).
3. We traverse the entire Three.js scene graph and recursively call `.dispose()` on all geometries, materials, and textures.
4. We call `controls.dispose()` and `renderer.dispose()`.
5. We remove `renderer.domElement` from the container DOM.

---

### Q11: Why did you implement code-splitting with `React.lazy` for the 3D Globe?
**Answer:**
Three.js and 3D graphics libraries add approximately 300–400 KB to bundle size. By wrapping `WorldGlobe` in `React.lazy` and `Suspense`, the main bundle stays lightweight (~196 KB gzipped). The browser renders the Navbar, Hero headline, and Search Bar immediately. While the user is reading the title or typing, Vite asynchronously chunks and downloads `WorldGlobe-DyMRqI1L.js`, yielding a 90+ Lighthouse performance score.

---

### Q12: Why did you choose Prisma ORM over raw SQL queries or Mongoose?
**Answer:**
1. **Type Safety & Autocompletion**: Prisma generates TypeScript types directly from the schema (`schema.prisma`), preventing runtime column mismatch errors.
2. **Database Portability**: The project runs on **SQLite** for development with zero external daemon setup, and can switch to **PostgreSQL** in production simply by altering `provider = "postgresql"` and `DATABASE_URL`.
3. **Relational Integrity**: Prisma enforces foreign keys and cascade rules between `Product`, `Location`, `Website`, `Listing`, `SearchHistory`, and `SavedItem`.

---

### Q13: What security headers and protections are implemented on the Express server?
**Answer:**
1. **Helmet**: Secures HTTP response headers, disables `X-Powered-By`, and configures `Cross-Origin-Resource-Policy`.
2. **CORS Allow-List**: Restricts cross-origin requests to trusted client origins.
3. **Rate Limiting**: `express-rate-limit` enforces a 300 requests per 15 minutes limit per IP to guard against DDoS or aggressive scraping.
4. **Input Validation**: All incoming route queries and POST bodies are strictly validated with **Zod schemas** (`createHistorySchema`, `createSavedItemSchema`, `searchQuerySchema`).
5. **No Opener / No Referrer**: All external store redirects use `rel="noopener noreferrer"` to prevent tab-nabbing security exploits.

---

### Q14: How does GeoShop ensure 100% offline functionality?
**Answer:**
Many 3D WebGL tutorials link to external image assets hosted on GitHub raw or unpkg CDNs. If an examiner tests the project without internet or if GitHub raw is blocked, the globe renders black. In GeoShop, all high-resolution Earth textures (`earth_day.jpg`, `earth_normal.jpg`, `earth_specular.jpg`, `earth_clouds.png`) are bundled locally inside `frontend/public/textures/`, and font fallbacks use native system font stacks.

---

### Q15: What happens if a user's machine does not support 3D WebGL hardware acceleration?
**Answer:**
`WorldGlobe.tsx` runs an `isWebGLAvailable()` check before initialization. If WebGL context creation fails, the component renders an accessible 2D fallback grid displaying all 8 global countries with flags, lowest USD prices, store counts, and store comparison triggers—ensuring the application never crashes.

---

### Q16: How is the Command Palette (<kbd>Ctrl+K</kbd>) implemented?
**Answer:**
A global window `keydown` listener intercepts `(e.ctrlKey || e.metaKey) && e.key === 'k'`, preventing default browser URL bar focus and opening `CommandPalette.tsx`. The palette provides instant multi-group fuzzy filtering across catalog products, global country pins, and navigation commands, with full keyboard navigation (Up, Down, Enter, Esc).

---

### Q17: How is currency normalized across 8 different regional currencies?
**Answer:**
All product listings store their price in both their local currency (e.g. ₹134,900 INR, €1,299 EUR, ¥189,800 JPY) and a normalized USD price converted via a fixed exchange-rate table (`EXCHANGE_RATES_TO_USD`). All comparison sorting, Price Pulse tiers, and Deal Arcs calculate differences in USD to maintain mathematical fairness.

---

### Q18: What is the purpose of the 30-day Price Sparkline?
**Answer:**
E-commerce stores frequently use artificial discount banners ("50% OFF") where the baseline price was inflated days prior. GeoShop computes 30-day historical price points and renders an SVG sparkline showing whether the current price is at a historical low, average, or temporary peak, paired with an algorithmic advice hint (`Historical low - buy now` vs `Price is high - consider waiting`).

---

### Q19: How are unit and integration tests structured?
**Answer:**
We use **Vitest** for fast native TypeScript testing:
1. `backend/src/utils/pricing.test.ts`: 11 tests verifying currency conversions, 5-factor Quality Index score boundary checks, price gouging penalties, and Price Pulse tiers.
2. `backend/src/routes/api.test.ts`: 7 integration tests verifying `/api/health`, `/api/products`, `/api/products/search`, `/api/locations`, `/api/websites`, `/api/history`, and `/api/saved`.
All 18 tests execute in under 600ms.

---

### Q20: What are the primary future enhancements for production scaling?
**Answer:**
1. **Live Affiliate API Integration**: Replace mock scraper seed data with direct webhooks into Amazon Creator API, Flipkart Affiliate API, and Best Buy Developer APIs.
2. **Redis Caching**: Cache frequent location availability responses in Redis with a 5-minute TTL to reduce database query load.
3. **GeoIP Auto-Detection**: Use MaxMind GeoIP or browser geolocation to auto-select the user's home country upon opening the application.
