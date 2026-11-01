import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';
import { Supplier, SupplierType } from './types';

interface ExcelRow {
  Supplier?: string;
  Address?: string;
}

export function parseExcelFile(
  filePath: string,
  type: SupplierType
): Supplier[] {
  const absolutePath = path.join(process.cwd(), 'data', path.basename(filePath));

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Excel file not found: ${absolutePath}`);
  }

  const fileBuffer = fs.readFileSync(absolutePath);
  const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];

  if (!sheetName) {
    throw new Error(`No sheets found in Excel file: ${filePath}`);
  }

  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json<ExcelRow>(sheet);

  if (rows.length === 0) {
    return [];
  }

  const firstRow = rows[0];
  if (!('Supplier' in firstRow) || !('Address' in firstRow)) {
    const columns = Object.keys(firstRow).join(', ');
    throw new Error(
      `Expected columns "Supplier" and "Address", but found: ${columns}`
    );
  }

  return rows
    .filter((row) => row.Supplier && row.Address)
    .map((row) => ({
      name: row.Supplier!.trim(),
      address: row.Address!.trim(),
      type,
    }));
}
