#!/usr/bin/env node

/**
 * Preprocess Excel files to JSON with geocoding
 *
 * Usage: node scripts/preprocess.js
 *
 * Reads:
 *   - data/suppliers.xlsx
 *   - data/sub-suppliers.xlsx
 *
 * Outputs:
 *   - data/suppliers.json
 */

const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
const RATE_LIMIT_MS = 1100; // Slightly over 1 second to be safe

const DATA_DIR = path.join(__dirname, '..', 'data');

// Rate limiting
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Geocode an address using Nominatim
async function geocodeAddress(address) {
  const params = new URLSearchParams({
    q: address,
    format: 'json',
    limit: '1'
  });

  try {
    const response = await fetch(`${NOMINATIM_URL}?${params}`, {
      headers: {
        'User-Agent': 'SupplierMap/1.0 (preprocessing script)'
      }
    });

    if (!response.ok) {
      console.warn(`  Geocoding failed for "${address}": HTTP ${response.status}`);
      return null;
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      console.warn(`  No results for: ${address}`);
      return null;
    }

    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon)
    };
  } catch (error) {
    console.warn(`  Geocoding error for "${address}": ${error.message}`);
    return null;
  }
}

// Parse Excel file
function parseExcelFile(filePath, type) {
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filePath}`);
    return [];
  }

  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];

  if (!sheetName) {
    console.warn(`No sheets in: ${filePath}`);
    return [];
  }

  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet);

  if (rows.length === 0) {
    return [];
  }

  const firstRow = rows[0];
  if (!('Supplier' in firstRow) || !('Address' in firstRow)) {
    console.error(`Expected columns "Supplier" and "Address", found: ${Object.keys(firstRow).join(', ')}`);
    return [];
  }

  return rows
    .filter(row => row.Supplier && row.Address)
    .map(row => ({
      name: String(row.Supplier).trim(),
      address: String(row.Address).trim(),
      type
    }));
}

// Main processing function
async function main() {
  console.log('Supplier Map - Data Preprocessing\n');

  // Ensure data directory exists
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  // Parse Excel files
  console.log('Reading Excel files...');
  const suppliers = parseExcelFile(path.join(DATA_DIR, 'suppliers.xlsx'), 'supplier');
  const subSuppliers = parseExcelFile(path.join(DATA_DIR, 'sub-suppliers.xlsx'), 'sub-supplier');
  const allSuppliers = [...suppliers, ...subSuppliers];

  console.log(`Found ${suppliers.length} suppliers and ${subSuppliers.length} sub-suppliers\n`);

  if (allSuppliers.length === 0) {
    console.log('No suppliers to process.');
    return;
  }

  // Geocode addresses
  console.log('Geocoding addresses (this may take a while due to rate limiting)...\n');
  const results = [];

  for (let i = 0; i < allSuppliers.length; i++) {
    const supplier = allSuppliers[i];
    console.log(`[${i + 1}/${allSuppliers.length}] ${supplier.name}: ${supplier.address}`);

    const coords = await geocodeAddress(supplier.address);

    if (coords) {
      results.push({
        ...supplier,
        lat: coords.lat,
        lng: coords.lng
      });
      console.log(`  -> ${coords.lat}, ${coords.lng}`);
    } else {
      console.log(`  -> SKIPPED (geocoding failed)`);
    }

    // Rate limit (except for last item)
    if (i < allSuppliers.length - 1) {
      await delay(RATE_LIMIT_MS);
    }
  }

  // Write output
  const outputPath = path.join(DATA_DIR, 'suppliers.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

  console.log(`\nDone! Wrote ${results.length} suppliers to ${outputPath}`);
  console.log(`Skipped ${allSuppliers.length - results.length} suppliers (geocoding failed)`);
}

main().catch(console.error);
