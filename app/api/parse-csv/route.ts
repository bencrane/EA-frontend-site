import { NextRequest, NextResponse } from "next/server";
import Papa from "papaparse";

interface CSVRow {
  [key: string]: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";

    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { ok: false, error: "Content-Type must be multipart/form-data" },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { ok: false, error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.name.toLowerCase().endsWith(".csv")) {
      return NextResponse.json(
        { ok: false, error: "Only CSV files are allowed" },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          ok: false,
          error: `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
        },
        { status: 400 }
      );
    }

    // Read file content
    const text = await file.text();

    // Parse CSV
    const parseResult = Papa.parse<CSVRow>(text, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header: string) => header.trim(),
      transform: (value: string) => value.trim(),
    });

    if (parseResult.errors.length > 0) {
      const criticalErrors = parseResult.errors.filter(
        (e) => e.type === "FieldMismatch" || e.type === "Quotes"
      );
      if (criticalErrors.length > 0) {
        return NextResponse.json(
          {
            ok: false,
            error: `CSV parsing error: ${criticalErrors[0].message}`,
          },
          { status: 400 }
        );
      }
    }

    const headers = parseResult.meta.fields || [];
    const rows = parseResult.data;

    if (headers.length === 0) {
      return NextResponse.json(
        { ok: false, error: "CSV file has no headers" },
        { status: 400 }
      );
    }

    if (rows.length === 0) {
      return NextResponse.json(
        { ok: false, error: "CSV file has no data rows" },
        { status: 400 }
      );
    }

    // Detect column mapping
    const columnMapping = detectColumnMapping(headers);

    return NextResponse.json(
      {
        ok: true,
        data: {
          fileName: file.name,
          headers,
          totalRows: rows.length,
          sampleRows: rows.slice(0, 5), // Send first 5 rows as preview
          columnMapping,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("CSV parsing error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { ok: false, error: `Failed to parse CSV: ${message}` },
      { status: 500 }
    );
  }
}

function detectColumnMapping(headers: string[]): Record<string, string> {
  const mapping: Record<string, string> = {};

  const patterns: Record<string, RegExp[]> = {
    firstName: [/^first[_\s]?name$/i, /^fname$/i, /^given[_\s]?name$/i, /^first$/i],
    lastName: [/^last[_\s]?name$/i, /^lname$/i, /^surname$/i, /^family[_\s]?name$/i, /^last$/i],
    company: [/^company$/i, /^company[_\s]?name$/i, /^organization$/i, /^org$/i, /^employer$/i],
    domain: [/^domain$/i, /^website$/i, /^company[_\s]?domain$/i, /^url$/i, /^company[_\s]?website$/i],
    linkedIn: [/^linkedin$/i, /^linkedin[_\s]?url$/i, /^linkedin[_\s]?profile$/i],
    fullName: [/^full[_\s]?name$/i, /^name$/i, /^contact[_\s]?name$/i],
  };

  for (const header of headers) {
    const normalizedHeader = header.toLowerCase().replace(/[^a-z0-9]/g, "_");

    for (const [fieldType, regexList] of Object.entries(patterns)) {
      if (!mapping[fieldType]) {
        for (const regex of regexList) {
          if (regex.test(header) || regex.test(normalizedHeader)) {
            mapping[fieldType] = header;
            break;
          }
        }
      }
    }
  }

  return mapping;
}
