"use client";

import { CheckCircle, XCircle, Loader2, Clock, AlertTriangle } from "lucide-react";

export interface BatchStatus {
  id: string;
  batchNumber: number;
  totalRows: number;
  status: "pending" | "processing" | "completed" | "failed";
  error?: string;
}

interface ProcessingStatusProps {
  batches: BatchStatus[];
  totalRows: number;
  processedRows: number;
  isProcessing: boolean;
  overallStatus: "idle" | "processing" | "completed" | "failed";
}

export default function ProcessingStatus({
  batches,
  totalRows,
  processedRows,
  isProcessing,
  overallStatus,
}: ProcessingStatusProps) {
  const progressPercentage = totalRows > 0 ? Math.round((processedRows / totalRows) * 100) : 0;

  const completedBatches = batches.filter((b) => b.status === "completed").length;
  const failedBatches = batches.filter((b) => b.status === "failed").length;

  const getStatusIcon = (status: BatchStatus["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "processing":
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      case "pending":
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadgeClass = (status: BatchStatus["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "pending":
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Processing Status
          </h3>
          <div className="flex items-center space-x-2">
            {overallStatus === "processing" && (
              <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
            )}
            {overallStatus === "completed" && (
              <CheckCircle className="h-5 w-5 text-green-500" />
            )}
            {overallStatus === "failed" && (
              <AlertTriangle className="h-5 w-5 text-orange-500" />
            )}
            <span
              className={`text-sm font-medium ${
                overallStatus === "completed"
                  ? "text-green-600 dark:text-green-400"
                  : overallStatus === "failed"
                    ? "text-orange-600 dark:text-orange-400"
                    : "text-gray-600 dark:text-gray-400"
              }`}
            >
              {overallStatus === "idle" && "Ready"}
              {overallStatus === "processing" && "Processing..."}
              {overallStatus === "completed" && "Completed"}
              {overallStatus === "failed" && "Completed with errors"}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ease-out ${
                failedBatches > 0 ? "bg-orange-500" : "bg-blue-500"
              }`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300 drop-shadow">
              {progressPercentage}%
            </span>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="flex justify-between mt-2 text-sm text-gray-600 dark:text-gray-400">
          <span>
            {processedRows.toLocaleString()} / {totalRows.toLocaleString()} rows
          </span>
          <span>
            {completedBatches} / {batches.length} batches
            {failedBatches > 0 && (
              <span className="text-red-500 ml-2">({failedBatches} failed)</span>
            )}
          </span>
        </div>
      </div>

      {/* Batch List */}
      {batches.length > 0 && (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <div className="max-h-64 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-600 dark:text-gray-400">
                    Batch
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600 dark:text-gray-400">
                    Rows
                  </th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600 dark:text-gray-400">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {batches.map((batch) => (
                  <tr
                    key={batch.id}
                    className={`${
                      batch.status === "processing" ? "bg-blue-50 dark:bg-blue-900/10" : ""
                    }`}
                  >
                    <td className="px-4 py-2 text-gray-900 dark:text-gray-100">
                      Batch {batch.batchNumber}
                    </td>
                    <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                      {batch.totalRows} rows
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(batch.status)}
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(batch.status)}`}
                        >
                          {batch.status}
                        </span>
                        {batch.error && (
                          <span className="text-xs text-red-500 truncate max-w-[200px]">
                            {batch.error}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Processing Note */}
      {isProcessing && (
        <p className="text-sm text-gray-500 dark:text-gray-400 italic">
          Processing batches sequentially to avoid rate limiting. Please wait...
        </p>
      )}
    </div>
  );
}
