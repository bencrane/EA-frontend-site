import Papa from "papaparse";
import type { CSVRow, ParsedCSV } from "./types";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_EXTENSIONS = [".csv"];

export interface CSVValidationError {
  type: "file_size" | "file_type" | "parse_error" | "empty_file" | "no_data";
  message: string;
}

export function validateCSVFile(file: File): CSVValidationError | null {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      type: "file_size",
      message: `File size (${(file.size / 1024 / 1024).toFixed(2)}MB) exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
    };
  }

  // Check file extension
  const extension = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    return {
      type: "file_type",
      message: `Invalid file type. Only CSV files are allowed.`,
    };
  }

  return null;
}

export async function parseCSVFile(file: File): Promise<ParsedCSV> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header: string) => header.trim(),
      transform: (value: string) => value.trim(),
      complete: (results) => {
        if (results.errors.length > 0) {
          // Filter out minor errors but keep critical ones
          const criticalErrors = results.errors.filter(
            (e) => e.type === "FieldMismatch" || e.type === "Quotes"
          );
          if (criticalErrors.length > 0) {
            reject(new Error(`CSV parsing error: ${criticalErrors[0].message}`));
            return;
          }
        }

        const rows = results.data as CSVRow[];
        const headers = results.meta.fields || [];

        if (headers.length === 0) {
          reject(new Error("CSV file has no headers"));
          return;
        }

        if (rows.length === 0) {
          reject(new Error("CSV file has no data rows"));
          return;
        }

        resolve({
          headers,
          rows,
          totalRows: rows.length,
        });
      },
      error: (error) => {
        reject(new Error(`Failed to parse CSV: ${error.message}`));
      },
    });
  });
}

export function createBatches<T>(items: T[], batchSize: number): T[][] {
  const batches: T[][] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    batches.push(items.slice(i, i + batchSize));
  }
  return batches;
}

export function normalizeHeader(header: string): string {
  return header
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
}

export function detectColumnMapping(headers: string[]): Record<string, string> {
  const mapping: Record<string, string> = {};
  const normalizedHeaders = headers.map((h) => ({
    original: h,
    normalized: normalizeHeader(h),
  }));

  // Common patterns for each field type
  const patterns: Record<string, RegExp[]> = {
    firstName: [/^first[_\s]?name$/i, /^fname$/i, /^given[_\s]?name$/i, /^first$/i],
    lastName: [/^last[_\s]?name$/i, /^lname$/i, /^surname$/i, /^family[_\s]?name$/i, /^last$/i],
    company: [/^company$/i, /^company[_\s]?name$/i, /^organization$/i, /^org$/i, /^employer$/i],
    domain: [/^domain$/i, /^website$/i, /^company[_\s]?domain$/i, /^url$/i],
    linkedIn: [/^linkedin$/i, /^linkedin[_\s]?url$/i, /^linkedin[_\s]?profile$/i],
    email: [/^email$/i, /^e[_\s]?mail$/i, /^email[_\s]?address$/i],
    fullName: [/^full[_\s]?name$/i, /^name$/i, /^contact[_\s]?name$/i],
  };

  for (const { original, normalized } of normalizedHeaders) {
    for (const [fieldType, regexList] of Object.entries(patterns)) {
      if (!mapping[fieldType]) {
        for (const regex of regexList) {
          if (regex.test(original) || regex.test(normalized)) {
            mapping[fieldType] = original;
            break;
          }
        }
      }
    }
  }

  return mapping;
}

export function exportToCSV(data: CSVRow[], filename: string): void {
  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
