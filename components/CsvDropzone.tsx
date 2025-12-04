"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, AlertCircle } from "lucide-react";

interface CsvDropzoneProps {
  onFileAccepted: (file: File) => void;
  isLoading?: boolean;
  error?: string | null;
}

export default function CsvDropzone({
  onFileAccepted,
  isLoading = false,
  error = null,
}: CsvDropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileAccepted(acceptedFiles[0]);
      }
    },
    [onFileAccepted]
  );

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.ms-excel": [".csv"],
    },
    maxFiles: 1,
    disabled: isLoading,
  });

  const currentFile = acceptedFiles[0];

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-all duration-200 ease-in-out
          ${isDragActive ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-300 dark:border-gray-600"}
          ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800"}
          ${error ? "border-red-300 bg-red-50 dark:bg-red-900/20" : ""}
        `}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center space-y-4">
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
              <p className="text-gray-600 dark:text-gray-300">Processing file...</p>
            </>
          ) : currentFile ? (
            <>
              <FileText className="h-12 w-12 text-green-500" />
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">{currentFile.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {(currentFile.size / 1024).toFixed(2)} KB
                </p>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Drop a new file to replace
              </p>
            </>
          ) : (
            <>
              <Upload className="h-12 w-12 text-gray-400" />
              {isDragActive ? (
                <p className="text-blue-500 font-medium">Drop your CSV file here</p>
              ) : (
                <>
                  <p className="text-gray-600 dark:text-gray-300">
                    <span className="font-medium text-blue-500">Click to upload</span> or drag and
                    drop
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">CSV files only (max 10MB)</p>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-3 flex items-center space-x-2 text-red-600 dark:text-red-400">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}
