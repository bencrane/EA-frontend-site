import { NextRequest, NextResponse } from "next/server";

interface CSVRow {
  [key: string]: string;
}

interface BatchPayload {
  webhookUrl: string;
  sessionId: string;
  batchId: string;
  batchNumber: number;
  totalBatches: number;
  rows: CSVRow[];
  columnMapping: Record<string, string>;
}

interface N8NPayload {
  sessionId: string;
  batchId: string;
  batchNumber: number;
  totalBatches: number;
  records: Array<{
    rowIndex: number;
    firstName?: string;
    lastName?: string;
    fullName?: string;
    company?: string;
    domain?: string;
    linkedIn?: string;
    originalData: CSVRow;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const body: BatchPayload = await request.json();

    const { webhookUrl, sessionId, batchId, batchNumber, totalBatches, rows, columnMapping } = body;

    // Validate required fields
    if (!webhookUrl) {
      return NextResponse.json(
        { ok: false, error: "Webhook URL is required" },
        { status: 400 }
      );
    }

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        { ok: false, error: "No rows to process" },
        { status: 400 }
      );
    }

    // Validate webhook URL format
    try {
      new URL(webhookUrl);
    } catch {
      return NextResponse.json(
        { ok: false, error: "Invalid webhook URL format" },
        { status: 400 }
      );
    }

    // Transform rows to use mapped column names
    const transformedRecords = rows.map((row, index) => ({
      rowIndex: index,
      firstName: columnMapping.firstName ? row[columnMapping.firstName] : undefined,
      lastName: columnMapping.lastName ? row[columnMapping.lastName] : undefined,
      fullName: columnMapping.fullName ? row[columnMapping.fullName] : undefined,
      company: columnMapping.company ? row[columnMapping.company] : undefined,
      domain: columnMapping.domain ? row[columnMapping.domain] : undefined,
      linkedIn: columnMapping.linkedIn ? row[columnMapping.linkedIn] : undefined,
      originalData: row,
    }));

    // Prepare payload for n8n
    const n8nPayload: N8NPayload = {
      sessionId,
      batchId,
      batchNumber,
      totalBatches,
      records: transformedRecords,
    };

    // Send to n8n webhook
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(n8nPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("n8n webhook error:", response.status, errorText);
      return NextResponse.json(
        {
          ok: false,
          error: `n8n webhook returned status ${response.status}`,
          details: errorText,
        },
        { status: response.status }
      );
    }

    // Try to parse response as JSON
    let responseData;
    const responseText = await response.text();
    try {
      responseData = JSON.parse(responseText);
    } catch {
      // If n8n returns non-JSON (like "Workflow was started"), that's OK
      responseData = { message: responseText };
    }

    return NextResponse.json(
      {
        ok: true,
        data: {
          batchId,
          batchNumber,
          rowsProcessed: rows.length,
          response: responseData,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error sending to n8n:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { ok: false, error: `Failed to send to n8n: ${message}` },
      { status: 500 }
    );
  }
}
