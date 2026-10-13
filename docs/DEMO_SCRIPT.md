# 🎬 GeoShop: 5-Minute Live Viva Demo Script

This script is designed for your final-semester MSc project examination. It guides you through a confident, step-by-step 5-minute walkthrough of the GeoShop platform highlighting the architecture, 3D WebGL mechanics, Price Pulse algorithms, and seamless merchant redirection.

---

## ⏱️ Timing & Flow Overview

| Timestamp | Phase | Key Action & Technical Talking Point |
| :--- | :--- | :--- |
| **00:00 - 00:45** | **Architecture & Concept** | Introduce GeoShop as a discovery & comparison layer, not a seller. Explain the tech stack (React 19, Three.js, Express, Prisma). |
| **00:45 - 01:45** | **Hero & Global Search** | Demonstrate debounced search (`iPhone 17 Pro` / `Laptop`), AI query intent detection, and popular search pills. |
| **01:45 - 02:45** | **3D World Globe Engine** | Showcase the Three.js Earth with bump/specular maps, atmosphere Fresnel shader, orbiting clouds, pin raycasting, and Deal Arcs. |
| **02:45 - 03:45** | **Comparison & Quality Score** | Double-click a pin to open the store comparison matrix, explain 30-day sparklines, timing hints, and the 5-factor Quality Index. |
| **03:45 - 04:30** | **Cross-Country & Redirection**| Toggle 3-country side-by-side mode, click BUY to trigger celebratory confetti, and explain safe redirection (`rel="noopener noreferrer"`). |
| **04:30 - 05:00** | **Database Persistence & QA** | Show saved drawer persisted in SQLite/PostgreSQL, Command Palette (<kbd>Ctrl+K</kbd>), and conclude with test coverage. |

---

## 🎙️ Step-by-Step Walkthrough

### 1. Introduction (00:00 - 00:45)
- **Action**: Open the GeoShop homepage at `http://localhost:5173`.
- **Script**:
  > *"Good morning, examiners. GeoShop is a location-based global product discovery and price-comparison platform. When customers want to buy premium electronics or goods, prices fluctuate wildly across international markets due to tariffs, currency differences, and regional merchant competition. GeoShop provides a 3D Earth discovery layer that maps global store availability, computes a transparent 5-factor Quality Index, and safely redirects buyers to official merchant storefronts like Amazon, Flipkart, MediaMarkt, and Rakuten."*
- **Highlight**: Point to the mission-control dark UI, smooth glassmorphism, and responsive status bar.

---

### 2. Global Search & Autocomplete (00:45 - 01:45)
- **Action**:
  1. Click into the search bar and type `sony`.
  2. Point out the **300ms debounce spinner** and live suggestions dropdown.
  3. Navigate using <kbd>↓</kbd> / <kbd>↑</kbd> arrows and press <kbd>Enter</kbd> (or click the **iPhone** popular pill).
- **Script**:
  > *"Notice how the search is debounced at 300 milliseconds with strict race-condition safety. When typing rapidly, older network promises are discarded so the UI never flickers. Our backend runs intent classification, and the AI Web Discovery HUD displays scanned platforms and geocoded locations."*

---

### 3. Interactive 3D World Globe Engine (01:45 - 02:45)
- **Action**:
  1. Click and drag the globe with the mouse to demonstrate smooth inertia damping.
  2. Release the mouse and wait 4 seconds to observe the **idle auto-rotation resume**.
  3. Single-click on **India 🇮🇳**: the camera smoothly eases to the marker and the atmospheric glow shifts to *Cyber Saffron*.
  4. Point out the **green Deal Arcs** shooting from India to USA 🇺🇸 and Japan 🇯🇵.
- **Script**:
  > *"The 3D globe is built with Three.js and custom GLSL shaders. We bundle photorealistic 2K day, normal, and specular textures locally for 100% offline support. The atmosphere uses a Fresnel shader with additive blending that smoothly shifts color tint to match the selected country. Our Price Pulse algorithm colors pins green for the cheapest, amber for mid-tier, and red for high tariffs. Notice the animated Deal Arcs: because India has higher import duties on phones, parabolic Bézier curves arc over the globe showing real-time savings routes—for example, saving 17% in the United States."*

---

### 4. Multi-Store Comparison & Quality Index (02:45 - 03:45)
- **Action**:
  1. Double-click the India pin (or click *"Compare Stores"* in the atmosphere bar).
  2. The **Product Comparison Modal** opens.
  3. Point out the **Best Price**, **Best Quality**, and **Best Value** winner badges.
  4. Show the **30-day SVG sparkline** and the **"Best time to buy"** timing hint.
  5. Click the **"Breakdown"** button next to Quality Index to open the **QualityInfoModal**.
- **Script**:
  > *"A single click flies the camera, while a double-click triggers the comparison modal, separated by a 250ms gesture discriminator. Each store listing shows the regional price alongside normalized USD equivalents, stock status, and a 30-day price sparkline with a historical timing hint. Here is our derived Quality Index: rather than trusting star ratings alone, we evaluate 40% customer rating, 30% log-scaled review volume, 30% seller trust history, a 30-day return policy guarantee, and anti-price-gouging stability."*

---

### 5. Cross-Country Mode & Merchant Redirection (03:45 - 04:30)
- **Action**:
  1. In the comparison modal header, click **Cross-Country (3)**. Select India 🇮🇳, USA 🇺🇸, and Japan 🇯🇵.
  2. Click **BUY / CONFIRM REDIRECTION** on the Amazon US card.
  3. Watch the celebratory **confetti animation** and the Purchase Decision modal appear.
- **Script**:
  > *"Customers can also compare up to 3 countries side-by-side to evaluate international shipping differentials. When the buyer decides to proceed, clicking BUY triggers celebratory visual feedback and opens the original merchant search URL in a new tab with strict `rel='noopener noreferrer'` protection. GeoShop never impersonates storefronts or takes payment details—we act purely as a trusted discovery engine."*

---

### 6. Command Palette & Database Persistence (04:30 - 05:00)
- **Action**:
  1. Press <kbd>Ctrl+K</kbd> to launch the **Command Palette**. Type `Germany` and press <kbd>Enter</kbd>.
  2. Click the bookmark icon on MediaMarkt Germany to save it.
  3. Open the **Saved Items Drawer** (cart icon in the navbar) to show the item persisted from the Prisma database.
  4. Mention test coverage: 18 unit and integration tests passing in Vitest with code-splitting active.
- **Script**:
  > *"For power users, our mission-control Command Palette accessible via Ctrl+K enables rapid keyboard navigation. Saved items and search queries are persisted directly to our relational database via Prisma ORM. The entire frontend bundle is code-split with lazy-loaded WebGL chunks, and both unit and REST API tests pass cleanly with zero warnings or errors. Thank you, I am now ready for your questions."*
