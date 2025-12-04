import Layout from '@/components/Layout';
import SystemGrid from '@/components/SystemGrid';
import { getLiveSystems } from '@/lib/systems';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function HomePage() {
  const systems = await getLiveSystems();

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Automation Systems Catalog
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our collection of intelligent automation systems designed to
            streamline your business processes and boost productivity.
          </p>
        </div>
        <SystemGrid systems={systems} />
      </div>
    </Layout>
"use client";

import { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { Mail, RefreshCw, Download, AlertCircle } from "lucide-react";
import CsvDropzone from "@/components/CsvDropzone";
import ColumnMapper from "@/components/ColumnMapper";
import DataPreview from "@/components/DataPreview";
import WebhookSettings from "@/components/WebhookSettings";
import ProcessingStatus, { BatchStatus } from "@/components/ProcessingStatus";

interface CSVRow {
  [key: string]: string;
}

interface ParsedData {
  fileName: string;
  headers: string[];
  totalRows: number;
  sampleRows: CSVRow[];
  columnMapping: Record<string, string>;
}

type Step = "upload" | "configure" | "processing" | "complete";

export default function Home() {
  // State
  const [step, setStep] = useState<Step>("upload");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // File data
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [allRows, setAllRows] = useState<CSVRow[]>([]);

  // Configuration
  const [columnMapping, setColumnMapping] = useState<Record<string, string>>({});
  const [webhookUrl, setWebhookUrl] = useState("");
  const [batchSize, setBatchSize] = useState(25);
  const [delayBetweenBatches, setDelayBetweenBatches] = useState(1000);

  // Processing state
  const [sessionId, setSessionId] = useState<string>("");
  const [batches, setBatches] = useState<BatchStatus[]>([]);
  const [processedRows, setProcessedRows] = useState(0);
  const [overallStatus, setOverallStatus] = useState<"idle" | "processing" | "completed" | "failed">("idle");

  // Handle file upload
  const handleFileAccepted = useCallback(async (uploadedFile: File) => {
    setFile(uploadedFile);
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", uploadedFile);

      const response = await fetch("/api/parse-csv", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!result.ok) {
        throw new Error(result.error || "Failed to parse CSV");
      }

      setParsedData(result.data);
      setColumnMapping(result.data.columnMapping);

      // Also parse the full file client-side to have all rows
      const text = await uploadedFile.text();
      const Papa = (await import("papaparse")).default;
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setAllRows(results.data as CSVRow[]);
        },
      });

      setStep("configure");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process file");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Validate configuration
  const isConfigValid = useCallback(() => {
    const hasNameMapping =
      (columnMapping.firstName && columnMapping.lastName) || columnMapping.fullName;
    const hasValidWebhook = webhookUrl && (() => {
      try {
        new URL(webhookUrl);
        return true;
      } catch {
        return false;
      }
    })();

    return hasNameMapping && hasValidWebhook;
  }, [columnMapping, webhookUrl]);

  // Create batches from rows
  const createBatches = useCallback((rows: CSVRow[], size: number): CSVRow[][] => {
    const result: CSVRow[][] = [];
    for (let i = 0; i < rows.length; i += size) {
      result.push(rows.slice(i, i + size));
    }
    return result;
  }, []);

  // Sleep helper
  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  // Start processing
  const handleStartProcessing = useCallback(async () => {
    if (!isConfigValid() || allRows.length === 0) return;

    const newSessionId = uuidv4();
    setSessionId(newSessionId);
    setStep("processing");
    setOverallStatus("processing");
    setProcessedRows(0);

    const rowBatches = createBatches(allRows, batchSize);
    const initialBatches: BatchStatus[] = rowBatches.map((batch, index) => ({
      id: uuidv4(),
      batchNumber: index + 1,
      totalRows: batch.length,
      status: "pending" as const,
    }));

    setBatches(initialBatches);

    let totalProcessed = 0;
    let hasFailures = false;

    // Process batches sequentially
    for (let i = 0; i < rowBatches.length; i++) {
      const batch = rowBatches[i];
      const batchId = initialBatches[i].id;

      // Update batch status to processing
      setBatches((prev) =>
        prev.map((b) => (b.id === batchId ? { ...b, status: "processing" as const } : b))
      );

      try {
        const response = await fetch("/api/send-to-n8n", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            webhookUrl,
            sessionId: newSessionId,
            batchId,
            batchNumber: i + 1,
            totalBatches: rowBatches.length,
            rows: batch,
            columnMapping,
          }),
        });

        const result = await response.json();

        if (!result.ok) {
          throw new Error(result.error || "Failed to send batch");
        }

        // Update batch status to completed
        setBatches((prev) =>
          prev.map((b) => (b.id === batchId ? { ...b, status: "completed" as const } : b))
        );

        totalProcessed += batch.length;
        setProcessedRows(totalProcessed);
      } catch (err) {
        hasFailures = true;
        const errorMessage = err instanceof Error ? err.message : "Unknown error";

        // Update batch status to failed
        setBatches((prev) =>
          prev.map((b) =>
            b.id === batchId ? { ...b, status: "failed" as const, error: errorMessage } : b
          )
        );

        // Continue with next batch despite failure
        totalProcessed += batch.length;
        setProcessedRows(totalProcessed);
      }

      // Delay between batches (except for the last one)
      if (i < rowBatches.length - 1 && delayBetweenBatches > 0) {
        await sleep(delayBetweenBatches);
      }
    }

    setOverallStatus(hasFailures ? "failed" : "completed");
    setStep("complete");
  }, [allRows, batchSize, columnMapping, webhookUrl, delayBetweenBatches, isConfigValid, createBatches]);

  // Reset everything
  const handleReset = useCallback(() => {
    setStep("upload");
    setFile(null);
    setParsedData(null);
    setAllRows([]);
    setColumnMapping({});
    setBatches([]);
    setProcessedRows(0);
    setOverallStatus("idle");
    setSessionId("");
    setError(null);
  }, []);

  // Export results summary
  const handleExportSummary = useCallback(() => {
    const summary = {
      sessionId,
      fileName: parsedData?.fileName,
      totalRows: allRows.length,
      totalBatches: batches.length,
      completedBatches: batches.filter((b) => b.status === "completed").length,
      failedBatches: batches.filter((b) => b.status === "failed").length,
      columnMapping,
      batches: batches.map((b) => ({
        batchNumber: b.batchNumber,
        rowCount: b.totalRows,
        status: b.status,
        error: b.error,
      })),
    };

    const blob = new Blob([JSON.stringify(summary, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `email-finder-session-${sessionId}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [sessionId, parsedData, allRows, batches, columnMapping]);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Email Finder
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Upload CSV and find emails via n8n + Anymail
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[
              { key: "upload", label: "Upload CSV" },
              { key: "configure", label: "Configure" },
              { key: "processing", label: "Processing" },
              { key: "complete", label: "Complete" },
            ].map((s, index) => {
              const isActive = s.key === step;
              const isPast =
                (step === "configure" && index === 0) ||
                (step === "processing" && index <= 1) ||
                (step === "complete" && index <= 2);

              return (
                <div key={s.key} className="flex items-center">
                  <div
                    className={`
                      flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
                      ${isActive ? "bg-blue-500 text-white" : ""}
                      ${isPast ? "bg-green-500 text-white" : ""}
                      ${!isActive && !isPast ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400" : ""}
                    `}
                  >
                    {index + 1}
                  </div>
                  <span
                    className={`ml-2 text-sm font-medium ${
                      isActive
                        ? "text-blue-600 dark:text-blue-400"
                        : isPast
                          ? "text-green-600 dark:text-green-400"
                          : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {s.label}
                  </span>
                  {index < 3 && (
                    <div
                      className={`w-16 md:w-24 h-0.5 mx-4 ${
                        isPast ? "bg-green-500" : "bg-gray-200 dark:bg-gray-700"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          {/* Step 1: Upload */}
          {step === "upload" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Upload Your CSV File
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Upload a CSV file containing contact information. The file should have headers in
                  the first row.
                </p>
              </div>
              <CsvDropzone
                onFileAccepted={handleFileAccepted}
                isLoading={isLoading}
                error={error}
              />
            </div>
          )}

          {/* Step 2: Configure */}
          {step === "configure" && parsedData && (
            <div className="space-y-8">
              {/* File Info */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {parsedData.fileName}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {parsedData.totalRows.toLocaleString()} rows,{" "}
                    {parsedData.headers.length} columns
                  </p>
                </div>
                <button
                  onClick={handleReset}
                  className="flex items-center px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Change file
                </button>
              </div>

              {/* Data Preview */}
              <DataPreview
                headers={parsedData.headers}
                rows={parsedData.sampleRows}
                totalRows={parsedData.totalRows}
              />

              {/* Column Mapping */}
              <ColumnMapper
                headers={parsedData.headers}
                initialMapping={columnMapping}
                onMappingChange={setColumnMapping}
              />

              {/* Webhook Settings */}
              <WebhookSettings
                webhookUrl={webhookUrl}
                onWebhookUrlChange={setWebhookUrl}
                batchSize={batchSize}
                onBatchSizeChange={setBatchSize}
                delayBetweenBatches={delayBetweenBatches}
                onDelayChange={setDelayBetweenBatches}
              />

              {/* Validation Warning */}
              {!isConfigValid() && (
                <div className="flex items-start space-x-3 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-orange-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-orange-800 dark:text-orange-200">
                    <p className="font-medium">Please complete the configuration:</p>
                    <ul className="list-disc list-inside mt-1 text-orange-700 dark:text-orange-300">
                      {!(columnMapping.firstName && columnMapping.lastName) &&
                        !columnMapping.fullName && (
                          <li>Map First Name + Last Name, or Full Name</li>
                        )}
                      {!webhookUrl && <li>Enter your n8n webhook URL</li>}
                    </ul>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStartProcessing}
                  disabled={!isConfigValid()}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Start Processing
                </button>
              </div>
            </div>
          )}

          {/* Step 3 & 4: Processing / Complete */}
          {(step === "processing" || step === "complete") && (
            <div className="space-y-6">
              <ProcessingStatus
                batches={batches}
                totalRows={allRows.length}
                processedRows={processedRows}
                isProcessing={step === "processing"}
                overallStatus={overallStatus}
              />

              {step === "complete" && (
                <div className="flex justify-center space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={handleExportSummary}
                    className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Summary
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex items-center px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Process Another File
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-auto py-6 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>Email Finder powered by n8n + Anymail</p>
      </footer>
    </main>
  );
}
