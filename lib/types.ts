export interface CSVRow {
  [key: string]: string;
}

export interface ParsedCSV {
  headers: string[];
  rows: CSVRow[];
  totalRows: number;
}

export interface BatchJob {
  id: string;
  status: "pending" | "processing" | "completed" | "failed";
  batchNumber: number;
  totalBatches: number;
  rows: CSVRow[];
  results?: EmailFinderResult[];
  error?: string;
  startedAt?: string;
  completedAt?: string;
}

export interface EmailFinderResult {
  originalRow: CSVRow;
  email?: string;
  confidence?: number;
  status: "found" | "not_found" | "error";
  error?: string;
}

export interface UploadSession {
  id: string;
  fileName: string;
  totalRows: number;
  processedRows: number;
  batches: BatchJob[];
  status: "uploading" | "processing" | "completed" | "failed";
  createdAt: string;
  completedAt?: string;
}

export interface N8NWebhookPayload {
  sessionId: string;
  batchId: string;
  batchNumber: number;
  totalBatches: number;
  rows: CSVRow[];
}

export interface N8NWebhookResponse {
  success: boolean;
  results?: EmailFinderResult[];
  error?: string;
}

export interface ColumnMapping {
  firstName?: string;
  lastName?: string;
  company?: string;
  domain?: string;
  linkedIn?: string;
  [key: string]: string | undefined;
}
