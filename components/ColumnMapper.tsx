"use client";

import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface ColumnMapperProps {
  headers: string[];
  initialMapping: Record<string, string>;
  onMappingChange: (mapping: Record<string, string>) => void;
}

const REQUIRED_FIELDS = [
  { key: "firstName", label: "First Name", description: "Contact's first name" },
  { key: "lastName", label: "Last Name", description: "Contact's last name" },
];

const OPTIONAL_FIELDS = [
  { key: "fullName", label: "Full Name", description: "Full name (if first/last not separate)" },
  { key: "company", label: "Company", description: "Company or organization name" },
  { key: "domain", label: "Domain", description: "Company website domain" },
  { key: "linkedIn", label: "LinkedIn URL", description: "LinkedIn profile URL" },
];

export default function ColumnMapper({
  headers,
  initialMapping,
  onMappingChange,
}: ColumnMapperProps) {
  const [mapping, setMapping] = useState<Record<string, string>>(initialMapping);

  useEffect(() => {
    setMapping(initialMapping);
  }, [initialMapping]);

  const handleChange = (fieldKey: string, headerValue: string) => {
    const newMapping = { ...mapping };
    if (headerValue === "") {
      delete newMapping[fieldKey];
    } else {
      newMapping[fieldKey] = headerValue;
    }
    setMapping(newMapping);
    onMappingChange(newMapping);
  };

  const renderSelect = (fieldKey: string, label: string, description: string, required: boolean) => (
    <div key={fieldKey} className="space-y-1">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
      <div className="relative">
        <select
          value={mapping[fieldKey] || ""}
          onChange={(e) => handleChange(fieldKey, e.target.value)}
          className={`
            w-full px-3 py-2 pr-10 border rounded-lg appearance-none
            bg-white dark:bg-gray-800
            text-gray-900 dark:text-gray-100
            border-gray-300 dark:border-gray-600
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            ${!mapping[fieldKey] && required ? "border-orange-300" : ""}
          `}
        >
          <option value="">-- Select column --</option>
          {headers.map((header) => (
            <option key={header} value={header}>
              {header}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );

  const hasNameMapping = mapping.firstName || mapping.lastName || mapping.fullName;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Map Your Columns
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Map your CSV columns to the required fields. At minimum, provide either First Name + Last
          Name OR Full Name.
        </p>
      </div>

      {!hasNameMapping && (
        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
          <p className="text-sm text-orange-800 dark:text-orange-200">
            Please map at least First Name + Last Name, or Full Name to proceed.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Name Fields
          </h4>
          {REQUIRED_FIELDS.map((field) =>
            renderSelect(field.key, field.label, field.description, true)
          )}
          {renderSelect(
            OPTIONAL_FIELDS[0].key,
            OPTIONAL_FIELDS[0].label,
            OPTIONAL_FIELDS[0].description,
            false
          )}
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Company Fields
          </h4>
          {OPTIONAL_FIELDS.slice(1).map((field) =>
            renderSelect(field.key, field.label, field.description, false)
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Current Mapping Summary
        </h4>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
          {Object.entries(mapping).length > 0 ? (
            <ul className="text-sm space-y-1">
              {Object.entries(mapping).map(([key, value]) => (
                <li key={key} className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium text-gray-900 dark:text-gray-100">{key}</span>
                  <span className="mx-2">→</span>
                  <span className="text-blue-600 dark:text-blue-400">{value}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">No columns mapped yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
