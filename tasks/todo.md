# Supplier Map — Task List

## Phase 1: Project Setup

### Task 1: Initialize Next.js project with TypeScript and Tailwind

**Description:** Create a new Next.js 14+ project with App Router, TypeScript, and Tailwind CSS. Configure path aliases.

**Acceptance criteria:**
- [ ] Next.js project created with `create-next-app`
- [ ] TypeScript enabled
- [ ] Tailwind CSS configured
- [ ] Path alias `@/` maps to `src/`

**Verification:**
- [ ] `npm run dev` starts without errors
- [ ] `npx tsc --noEmit` passes
- [ ] Tailwind classes render correctly

**Dependencies:** None

**Files likely touched:**
- `package.json`
- `tsconfig.json`
- `tailwind.config.ts`
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/globals.css`

**Estimated scope:** Small

---

### Task 2: Define TypeScript interfaces and config

**Description:** Create type definitions for Supplier data and configuration for file paths.

**Acceptance criteria:**
- [ ] `Supplier` interface with name, address, type, coordinates
- [ ] `DATA_PATHS` config for Excel file locations
- [ ] Types exported for use across the app

**Verification:**
- [ ] `npx tsc --noEmit` passes
- [ ] Types can be imported in other files

**Dependencies:** Task 1

**Files likely touched:**
- `src/lib/types.ts`
- `src/lib/config.ts`

**Estimated scope:** XS

---

## Checkpoint: Setup
- [ ] Project runs with `npm run dev`
- [ ] TypeScript compiles without errors

---

## Phase 2: Data Layer

### Task 3: Implement Excel parsing utility

**Description:** Create a function that reads an Excel file from disk and extracts supplier data (name, address) from the expected columns.

**Acceptance criteria:**
- [ ] Reads `.xlsx` files from a given path
- [ ] Extracts `Supplier` and `Address` columns
- [ ] Returns array of supplier objects with type field
- [ ] Throws descriptive error if columns missing

**Verification:**
- [ ] Unit test with sample Excel file passes
- [ ] `npx tsc --noEmit` passes

**Dependencies:** Task 2

**Files likely touched:**
- `src/lib/parseExcel.ts`
- `src/__tests__/parseExcel.test.ts` (optional for MVP)

**Estimated scope:** Small

---

### Task 4: Implement Nominatim geocoding with rate limiting

**Description:** Create a geocoding function that converts addresses to lat/lng coordinates using Nominatim API, respecting the 1 request/second rate limit.

**Acceptance criteria:**
- [ ] Accepts an address string, returns { lat, lng } or null
- [ ] Rate-limited to max 1 request per second
- [ ] Handles API errors gracefully (returns null)
- [ ] Batch function to geocode array of suppliers

**Verification:**
- [ ] Manual test with real address returns coordinates
- [ ] Multiple calls respect rate limit (observe timing)

**Dependencies:** Task 2

**Files likely touched:**
- `src/lib/geocode.ts`

**Estimated scope:** Small

---

### Task 5: Create API route to serve geocoded suppliers

**Description:** Create a Next.js API route that reads both Excel files, geocodes all suppliers, and returns the combined data as JSON.

**Acceptance criteria:**
- [ ] GET `/api/suppliers` returns JSON array
- [ ] Each item has: name, address, type, lat, lng
- [ ] Suppliers marked as `supplier`, sub-suppliers as `sub-supplier`
- [ ] Handles missing files with appropriate error response
- [ ] Caches geocoded results in memory for subsequent requests

**Verification:**
- [ ] `curl http://localhost:3000/api/suppliers` returns valid JSON
- [ ] Second request is fast (cached)

**Dependencies:** Tasks 3, 4

**Files likely touched:**
- `src/app/api/suppliers/route.ts`

**Estimated scope:** Medium

---

## Checkpoint: Data Layer
- [ ] API returns geocoded supplier data as JSON
- [ ] Rate limiting respects Nominatim policy

---

## Phase 3: Map Display

### Task 6: Create basic Leaflet map component

**Description:** Create a map component using react-leaflet that displays an OpenStreetMap centered on Europe.

**Acceptance criteria:**
- [ ] Map renders without SSR errors (dynamic import)
- [ ] Centered on Europe (~50°N, 10°E)
- [ ] Zoom level ~4 (continental view)
- [ ] Map is interactive (pan, zoom)

**Verification:**
- [ ] `npm run dev` shows map on page
- [ ] No console errors about `window` or SSR

**Dependencies:** Task 1

**Files likely touched:**
- `src/components/SupplierMap.tsx`
- `src/app/page.tsx`
- `package.json` (add leaflet, react-leaflet)

**Estimated scope:** Small

---

### Task 7: Add markers with clustering

**Description:** Display supplier locations as markers on the map, with clustering for nearby markers when zoomed out.

**Acceptance criteria:**
- [ ] Each supplier appears as a marker at correct location
- [ ] Nearby markers cluster into numbered groups
- [ ] Clicking cluster zooms to expand
- [ ] Clicking marker shows popup with name and address

**Verification:**
- [ ] Markers appear on map
- [ ] Zooming out shows clusters
- [ ] Zooming in expands clusters to individual markers

**Dependencies:** Tasks 5, 6

**Files likely touched:**
- `src/components/SupplierMap.tsx`
- `src/components/MarkerPopup.tsx`
- `src/hooks/useSuppliers.ts`
- `package.json` (add react-leaflet-cluster)

**Estimated scope:** Medium

---

### Task 8: Add custom marker icons for supplier types

**Description:** Use different colored markers for suppliers (blue) vs sub-suppliers (orange).

**Acceptance criteria:**
- [ ] Supplier markers are blue
- [ ] Sub-supplier markers are orange
- [ ] Colors are distinguishable and accessible
- [ ] Cluster icons show mixed colors or neutral color

**Verification:**
- [ ] Visual inspection shows two distinct marker colors
- [ ] Legend or filter labels match marker colors

**Dependencies:** Task 7

**Files likely touched:**
- `src/components/SupplierMap.tsx`
- `public/markers/supplier.svg`
- `public/markers/sub-supplier.svg`

**Estimated scope:** Small

---

## Checkpoint: Map Display
- [ ] Map renders centered on Europe
- [ ] Markers appear and cluster correctly
- [ ] Different colors for suppliers vs sub-suppliers

---

## Phase 4: Filtering & Polish

### Task 9: Add filter controls

**Description:** Create a filter UI with checkboxes to toggle visibility of suppliers and sub-suppliers.

**Acceptance criteria:**
- [ ] Two checkboxes: "Suppliers" and "Sub-suppliers"
- [ ] Both checked by default
- [ ] Labels colored to match marker colors
- [ ] Filter state managed in React

**Verification:**
- [ ] Checkboxes render and are clickable
- [ ] State changes on click

**Dependencies:** Task 6

**Files likely touched:**
- `src/components/MapFilter.tsx`
- `src/app/page.tsx`

**Estimated scope:** XS

---

### Task 10: Wire up filtering to map markers

**Description:** Connect filter controls to the map so unchecking a type hides those markers.

**Acceptance criteria:**
- [ ] Unchecking "Suppliers" hides all supplier markers
- [ ] Unchecking "Sub-suppliers" hides all sub-supplier markers
- [ ] Clusters update to reflect visible markers only
- [ ] Re-checking shows markers again

**Verification:**
- [ ] Toggle filters, observe markers appear/disappear
- [ ] Cluster counts update correctly

**Dependencies:** Tasks 8, 9

**Files likely touched:**
- `src/components/SupplierMap.tsx`
- `src/hooks/useSuppliers.ts`
- `src/app/page.tsx`

**Estimated scope:** Small

---

### Task 11: Add loading states and error handling

**Description:** Show loading indicator while data is being fetched/geocoded, and display user-friendly errors for failures.

**Acceptance criteria:**
- [ ] Loading spinner or skeleton while fetching
- [ ] Error message if API fails or files not found
- [ ] Graceful handling of suppliers that fail to geocode

**Verification:**
- [ ] Refresh page, see loading state
- [ ] Remove Excel file, see error message

**Dependencies:** Tasks 5, 7

**Files likely touched:**
- `src/app/page.tsx`
- `src/hooks/useSuppliers.ts`
- `src/components/SupplierMap.tsx`

**Estimated scope:** Small

---

## Checkpoint: Complete
- [ ] All acceptance criteria from spec met
- [ ] Filter toggles work correctly
- [ ] Loading and error states display properly
- [ ] Ready for use
