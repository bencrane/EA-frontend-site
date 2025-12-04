"use client";

import { useState, useEffect } from "react";
import { Settings, Eye, EyeOff, Info } from "lucide-react";

interface WebhookSettingsProps {
  webhookUrl: string;
  onWebhookUrlChange: (url: string) => void;
  batchSize: number;
  onBatchSizeChange: (size: number) => void;
  delayBetweenBatches: number;
  onDelayChange: (delay: number) => void;
}

const BATCH_SIZE_OPTIONS = [
  { value: 10, label: "10 rows" },
  { value: 25, label: "25 rows" },
  { value: 50, label: "50 rows" },
  { value: 100, label: "100 rows" },
];

const DELAY_OPTIONS = [
  { value: 0, label: "No delay" },
  { value: 1000, label: "1 second" },
  { value: 2000, label: "2 seconds" },
  { value: 5000, label: "5 seconds" },
];

export default function WebhookSettings({
  webhookUrl,
  onWebhookUrlChange,
  batchSize,
  onBatchSizeChange,
  delayBetweenBatches,
  onDelayChange,
}: WebhookSettingsProps) {
  const [showUrl, setShowUrl] = useState(false);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    if (!webhookUrl) {
      setIsValid(true);
      return;
    }
    try {
      new URL(webhookUrl);
      setIsValid(true);
    } catch {
      setIsValid(false);
    }
  }, [webhookUrl]);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Settings className="h-5 w-5 text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Webhook Settings
        </h3>
      </div>

      {/* Webhook URL Input */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          n8n Webhook URL <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type={showUrl ? "text" : "password"}
            value={webhookUrl}
            onChange={(e) => onWebhookUrlChange(e.target.value)}
            placeholder="https://your-n8n-instance.com/webhook/..."
            className={`
              w-full px-4 py-2 pr-10 border rounded-lg
              bg-white dark:bg-gray-800
              text-gray-900 dark:text-gray-100
              placeholder-gray-400 dark:placeholder-gray-500
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              ${!isValid ? "border-red-500" : "border-gray-300 dark:border-gray-600"}
            `}
          />
          <button
            type="button"
            onClick={() => setShowUrl(!showUrl)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            {showUrl ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {!isValid && webhookUrl && (
          <p className="text-sm text-red-500">Please enter a valid URL</p>
        )}
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Enter the webhook URL from your n8n workflow that will process the email finder requests.
        </p>
      </div>

      {/* Batch Size */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Batch Size
        </label>
        <div className="grid grid-cols-4 gap-2">
          {BATCH_SIZE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onBatchSizeChange(option.value)}
              className={`
                px-4 py-2 text-sm font-medium rounded-lg border transition-colors
                ${
                  batchSize === option.value
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-400"
                }
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Number of records to send per batch. Smaller batches are more reliable but slower.
        </p>
      </div>

      {/* Delay Between Batches */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Delay Between Batches
        </label>
        <div className="grid grid-cols-4 gap-2">
          {DELAY_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onDelayChange(option.value)}
              className={`
                px-4 py-2 text-sm font-medium rounded-lg border transition-colors
                ${
                  delayBetweenBatches === option.value
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-400"
                }
              `}
            >
              {option.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Wait time between batch submissions to avoid rate limiting.
        </p>
      </div>

      {/* Info Box */}
      <div className="flex items-start space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-800 dark:text-blue-200">
          <p className="font-medium mb-1">How it works:</p>
          <ul className="list-disc list-inside space-y-1 text-blue-700 dark:text-blue-300">
            <li>Your CSV data is split into batches</li>
            <li>Each batch is sent to your n8n webhook</li>
            <li>n8n processes records through Anymail Finder</li>
            <li>Results are returned for each batch</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
