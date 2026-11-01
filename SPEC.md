# Spec: Supplier Map

## Objective

Build a Next.js web application that reads supplier and sub-supplier data from Excel files stored on disk and visualizes them on an interactive OpenStreetMap. Users can see at a glance where their supply chain is located, filter by supplier type, and explore details via map markers.

**User story:** As a procurement manager, I want to view my suppliers and sub-suppliers on a map with filtering options so I can understand my supply chain geography.

**Acceptance criteria:**
- Application reads two Excel files from configured paths on disk
- Suppliers and sub-suppliers are displayed with distinct marker colors
- Filter controls allow showing/hiding suppliers and sub-suppliers independently
- Each marker shows name and address on click
- Nearby markers cluster when zoomed out
- Map centered on Europe by default
- Handles ~100 suppliers + sub-suppliers combined

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Excel parsing:** `xlsx` (SheetJS)
- **Map:** Leaflet + `react-leaflet` + `react-leaflet-cluster`
- **Geocoding:** Nominatim (OpenStreetMap, free)
- **Package manager:** npm

## Commands

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint
npm run lint

# Type check
npx tsc --noEmit
```

## Project Structure

```
suppliermap/
├── data/
│   ├── suppliers.xlsx        # Supplier Excel file (or symlink)
│   └── sub-suppliers.xlsx    # Sub-supplier Excel file (or symlink)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── suppliers/
│   │   │       └── route.ts  # API route to read & parse Excel files
│   │   ├── layout.tsx        # Root layout
│   │   ├── page.tsx          # Main page with map + filters
│   │   └── globals.css       # Global styles + Tailwind
│   ├── components/
│   │   ├── SupplierMap.tsx   # Leaflet map with clustered markers
│   │   ├── MapFilter.tsx     # Filter toggles for supplier types
│   │   └── MarkerPopup.tsx   # Popup content for markers
│   ├── lib/
│   │   ├── parseExcel.ts     # Excel parsing logic
│   │   ├── geocode.ts        # Nominatim geocoding with rate limiting
│   │   ├── types.ts          # TypeScript interfaces
│   │   └── config.ts         # File paths configuration
│   └── hooks/
│       └── useSuppliers.ts   # Fetch and filter supplier state
├── public/
│   └── markers/
│       ├── supplier.svg      # Blue marker for suppliers
│       └── sub-supplier.svg  # Orange marker for sub-suppliers
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── SPEC.md
```

## Data Format

**Excel files (both use same format):**
| Column | Description |
|--------|-------------|
| `Supplier` | Company/supplier name |
| `Address` | Full address (street, city, country combined) |

**File paths (configured in `src/lib/config.ts`):**
```typescript
export const DATA_PATHS = {
  suppliers: 'data/suppliers.xlsx',
  subSuppliers: 'data/sub-suppliers.xlsx',
};
```

**Map defaults:**
- Initial center: Europe (~50°N, 10°E)
- Initial zoom: ~4 (continental view)
- Marker clustering enabled

**Marker colors:**
- Suppliers: Blue
- Sub-suppliers: Orange

## Code Style

```typescript
// Example: Filter component
'use client';

import { useState } from 'react';

interface MapFilterProps {
  onFilterChange: (filters: { suppliers: boolean; subSuppliers: boolean }) => void;
}

export function MapFilter({ onFilterChange }: MapFilterProps) {
  const [showSuppliers, setShowSuppliers] = useState(true);
  const [showSubSuppliers, setShowSubSuppliers] = useState(true);

  const handleChange = (type: 'suppliers' | 'subSuppliers', value: boolean) => {
    const newFilters = {
      suppliers: type === 'suppliers' ? value : showSuppliers,
      subSuppliers: type === 'subSuppliers' ? value : showSubSuppliers,
    };
    if (type === 'suppliers') setShowSuppliers(value);
    if (type === 'subSuppliers') setShowSubSuppliers(value);
    onFilterChange(newFilters);
  };

  return (
    <div className="flex gap-4 p-4 bg-white rounded shadow">
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={showSuppliers}
          onChange={(e) => handleChange('suppliers', e.target.checked)}
        />
        <span className="text-blue-600">Suppliers</span>
      </label>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={showSubSuppliers}
          onChange={(e) => handleChange('subSuppliers', e.target.checked)}
        />
        <span className="text-orange-600">Sub-suppliers</span>
      </label>
    </div>
  );
}
```

**Conventions:**
- Named exports for components
- `'use client'` directive for interactive components
- Interfaces over types for object shapes
- Path aliases: `@/` maps to `src/`
- Tailwind for styling, no CSS modules
- Async/await over .then() chains
- Server-side file reading via API routes

## Testing Strategy

- **Framework:** Vitest + React Testing Library
- **Location:** `src/__tests__/` or co-located `*.test.ts` files
- **Coverage target:** Not enforced for MVP
- **Test levels:**
  - Unit tests for `parseExcel.ts` and `geocode.ts`
  - Component tests for map and filter rendering
  - No E2E for MVP

```bash
# Run tests
npm test

# Watch mode
npm test -- --watch
```

## Boundaries

### Always
- Handle geocoding failures gracefully (skip marker or show "Location unknown")
- Rate-limit Nominatim requests (max 1 request/second per their policy)
- Show loading state while data is being fetched/geocoded
- Validate Excel structure before processing

### Ask First
- Adding new dependencies beyond those listed
- Changing the Excel column expectations
- Adding database or persistence layer
- Adding authentication
- Changing marker colors or clustering behavior

### Never
- Skip rate limiting on Nominatim (will get IP banned)
- Commit Excel files with real supplier data to git
- Commit node_modules or .next directories

## Success Criteria

1. **Data loads:** App reads both Excel files from configured paths on startup
2. **Parsing works:** Supplier names and addresses are extracted correctly from both files
3. **Map displays:** Interactive OSM map renders centered on Europe
4. **Markers appear:** Suppliers show as blue markers, sub-suppliers as orange
5. **Clustering works:** Nearby markers cluster when zoomed out, expand when zoomed in
6. **Filtering works:** Checkboxes toggle visibility of suppliers and sub-suppliers independently
7. **Popup info:** Clicking a marker shows supplier name and address
8. **Error handling:** Missing files or parse errors show user-friendly message
9. **Performance:** ~100 suppliers geocode and display within reasonable time (respecting rate limits)
