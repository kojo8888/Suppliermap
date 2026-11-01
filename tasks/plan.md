# Implementation Plan: Supplier Map

## Overview

Build a Next.js application that reads supplier and sub-supplier data from Excel files, geocodes addresses using Nominatim, and displays them on an interactive OpenStreetMap with filtering and clustering.

## Dependency Graph

```
Excel files (data/)
    │
    ├── parseExcel.ts (reads & parses Excel)
    │       │
    │       └── types.ts (Supplier interface)
    │
    ├── geocode.ts (address → coordinates)
    │       │
    │       └── types.ts (GeocodedSupplier interface)
    │
    └── API route (/api/suppliers)
            │
            ├── useSuppliers.ts (fetch hook)
            │       │
            │       └── SupplierMap.tsx (map component)
            │               │
            │               ├── MapFilter.tsx (filter controls)
            │               │
            │               └── MarkerPopup.tsx (popup content)
            │
            └── page.tsx (main page)
```

## Architecture Decisions

1. **Server-side Excel parsing:** Excel files are read via Next.js API route, not client-side. This keeps file paths secure and allows server-side caching.

2. **Geocoding strategy:** Geocode on first request, cache results in memory. Nominatim rate limit (1 req/sec) means ~100 suppliers takes ~100 seconds on cold start. Consider pre-geocoding or progressive loading.

3. **Dynamic imports for Leaflet:** Leaflet requires `window`, so map components use `next/dynamic` with `ssr: false`.

4. **Marker clustering:** Use `react-leaflet-cluster` for grouping nearby markers. Custom icons for supplier types.

## Task List

### Phase 1: Project Setup

- [ ] Task 1: Initialize Next.js project with TypeScript and Tailwind
- [ ] Task 2: Define TypeScript interfaces and config

### Checkpoint: Setup
- [ ] Project runs with `npm run dev`
- [ ] TypeScript compiles without errors

### Phase 2: Data Layer

- [ ] Task 3: Implement Excel parsing utility
- [ ] Task 4: Implement Nominatim geocoding with rate limiting
- [ ] Task 5: Create API route to serve geocoded suppliers

### Checkpoint: Data Layer
- [ ] API returns geocoded supplier data as JSON
- [ ] Rate limiting respects Nominatim policy

### Phase 3: Map Display

- [ ] Task 6: Create basic Leaflet map component
- [ ] Task 7: Add markers with clustering
- [ ] Task 8: Add custom marker icons for supplier types

### Checkpoint: Map Display
- [ ] Map renders centered on Europe
- [ ] Markers appear and cluster correctly
- [ ] Different colors for suppliers vs sub-suppliers

### Phase 4: Filtering & Polish

- [ ] Task 9: Add filter controls
- [ ] Task 10: Wire up filtering to map markers
- [ ] Task 11: Add loading states and error handling

### Checkpoint: Complete
- [ ] All acceptance criteria from spec met
- [ ] Ready for use

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Nominatim rate limiting causes slow initial load | High | Cache geocoded results; show progressive loading; consider pre-geocoding script |
| Leaflet SSR errors | Medium | Use dynamic imports with ssr: false |
| Excel column name mismatch | Medium | Validate columns exist before parsing; show clear error |
| Geocoding failures for some addresses | Medium | Mark failed addresses; show on map with "location unknown" or skip |

## Open Questions

None — all questions resolved in spec phase.
