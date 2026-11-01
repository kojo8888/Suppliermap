# Supplier Map (Static Version)

A simple, zero-build supplier visualization tool using plain HTML/CSS/JavaScript.

## Structure

```
static-version/
├── index.html          # Main page
├── app.js              # Application logic
├── data/
│   ├── suppliers.xlsx      # Input: supplier data
│   ├── sub-suppliers.xlsx  # Input: sub-supplier data
│   └── suppliers.json      # Output: geocoded data
├── scripts/
│   └── preprocess.js   # Excel → JSON converter
└── package.json        # Scripts and dependencies
```

## Setup

### 1. Install preprocessing dependencies

```bash
npm install
```

### 2. Add your Excel files

Place your Excel files in the `data/` folder:
- `data/suppliers.xlsx`
- `data/sub-suppliers.xlsx`

Each file must have columns: `Supplier` and `Address`

### 3. Run preprocessing

```bash
npm run preprocess
```

This reads the Excel files, geocodes addresses via Nominatim, and outputs `data/suppliers.json`.

**Note:** Geocoding respects Nominatim's 1 request/second rate limit, so ~100 suppliers takes ~100 seconds.

### 4. Serve the application

Option A - Use any static file server:
```bash
npm run serve
# or
python -m http.server 8000
# or
php -S localhost:8000
```

Option B - Open directly in browser:
- Some browsers allow `file://` access, but you may need to start Chrome with `--allow-file-access-from-files`

Option C - Deploy to any web server:
- Copy all files to your web server
- No Node.js required in production

## Features

- Interactive OpenStreetMap
- Marker clustering for dense areas
- Filter by supplier type (suppliers / sub-suppliers)
- Blue markers = suppliers, Orange = sub-suppliers
- Click markers to see name and address

## Browser Support

Works in all modern browsers (Chrome, Firefox, Safari, Edge).

## Dependencies (Runtime)

All loaded from CDN - no local installation needed:
- Leaflet 1.9.4
- Leaflet.markercluster 1.5.3

## Updating Data

When Excel files change:
1. Replace the Excel files in `data/`
2. Run `npm run preprocess`
3. Deploy the updated `suppliers.json`
