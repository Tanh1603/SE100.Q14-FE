"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConfigurationService, SystemConfiguration } from "@/lib/configuration.service";
import { Loader2, Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { LoanProductManager } from "./loan-product-manager";

interface ConfigurationEditorProps {
  configs: SystemConfiguration[];
  onUpdate: () => void;
}

// Helper to map known API constants to Human Friendly Vietnamese
const DISPLAY_MAP: Record<string, string> = {
  "LAST_30_DAYS": "30 ngày gần nhất",
  "LAST_7_DAYS": "7 ngày gần nhất",
  "LAST_90_DAYS": "90 ngày gần nhất",
  "TRUE": "Bật (True)",
  "FALSE": "Tắt (False)",
  // Add others as needed
};

// Reverse map for saving
const API_MAP: Record<string, string> = Object.entries(DISPLAY_MAP).reduce((acc, [key, val]) => {
  acc[val] = key;
  return acc;
}, {} as Record<string, string>);

export function ConfigurationEditor({ configs, onUpdate }: ConfigurationEditorProps) {
  // Store RAW values for API consistency, but we'll format them for render
  const [values, setValues] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    configs.forEach(c => map[c.key] = c.value);
    return map;
  });
  const [savingKeys, setSavingKeys] = useState<Set<string>>(new Set());

  // Function to determine how to display the value
  const getDisplayValue = (key: string, rawVal: string) => {
    // 1. Check known mappings
    if (DISPLAY_MAP[rawVal]) return DISPLAY_MAP[rawVal];

    // 2. Check for JSON Array of Strings (e.g. ["CAR", "MOTORBIKE"])
    try {
      if (rawVal.startsWith("[") && rawVal.endsWith("]")) {
        const parsed = JSON.parse(rawVal);
        if (Array.isArray(parsed) && parsed.every(i => typeof i === 'string')) {
          return parsed.join(", "); // Display as comma separated list
        }
      }
    } catch (e) {
      // Ignore parse error, treat as string
    }

    return rawVal;
  };

  // Function to parse user input back to API format
  const parseInputValue = (key: string, inputVal: string, originalRaw: string) => {
    // 1. Check reverse mapping
    if (API_MAP[inputVal]) return API_MAP[inputVal];

    // 2. Check if original was a JSON array of strings
    try {
      if (originalRaw.startsWith("[") && originalRaw.endsWith("]")) {
        // Attempt to split back into array
        const arrayVal = inputVal.split(",").map(s => s.trim()).filter(Boolean);
        // Basic validation: ensure we don't turn "foo" into ["foo"] unless intended
        // Here we assume if the original was JSON array, we want to save as JSON array
        return JSON.stringify(arrayVal);
      }
    } catch (e) {}

    return inputVal;
  };

  const isLoanProductList = (rawVal: string) => {
    try {
      const parsed = JSON.parse(rawVal);
      return Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'object' && 'interestRateMonthly' in parsed[0];
    } catch {
      return false;
    }
  };

  const handleChange = (key: string, displayVal: string, originalRaw: string) => {
    const rawVal = parseInputValue(key, displayVal, originalRaw);
    setValues(prev => ({ ...prev, [key]: rawVal }));
  };

  const handleSave = async (config: SystemConfiguration) => {
    setSavingKeys(prev => new Set(prev).add(config.key));
    try {
      await ConfigurationService.update(config.key, values[config.key]);
      toast.success(`Đã cập nhật ${config.key}`);
      onUpdate();
    } catch (error) {
      toast.error(`Lỗi khi cập nhật ${config.key}`);
    } finally {
      setSavingKeys(prev => {
        const next = new Set(prev);
        next.delete(config.key);
        return next;
      });
    }
  };

  return (
    <div className="grid gap-6">
      {configs.map((config) => {
        const currentValue = values[config.key] || "";
        const originalRaw = config.value; 

        // Special handling for Loan Products JSON
        if (isLoanProductList(originalRaw)) {
           return (
             <div key={config.key} className="p-4 border rounded-lg bg-gray-50/50">
                <Label className="font-semibold text-base mb-2 block">{config.description || config.key}</Label>
                <LoanProductManager 
                    initialValue={currentValue} 
                    configKey={config.key} 
                    onUpdate={onUpdate} 
                />
             </div>
           );
        }

        const displayValue = getDisplayValue(config.key, currentValue);

        return (
          <div key={config.key} className="grid w-full items-center gap-1.5 p-4 border rounded-lg bg-gray-50/50">
            <div className="flex justify-between">
               <Label className="font-semibold text-base">{config.description || config.key}</Label>
               <span className="text-xs font-mono text-gray-400">{config.key}</span>
            </div>
            <div className="flex gap-2 mt-2">
               <Input 
                  value={displayValue} 
                  onChange={(e) => handleChange(config.key, e.target.value, originalRaw)} 
                  className="bg-white"
                  placeholder={config.dataType === "JSON" ? "Nhập danh sách cách nhau bởi dấu phẩy" : ""}
               />
               <Button 
                  size="icon" 
                  onClick={() => handleSave(config)} 
                  disabled={savingKeys.has(config.key) || values[config.key] === config.value}
               >
                  {savingKeys.has(config.key) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
               </Button>
            </div>
            {config.dataType === "JSON" && !config.key.includes("PRODUCT") && (
               <p className="text-[10px] text-muted-foreground">Nhập các giá trị phân cách bằng dấu phẩy (Ví dụ: A, B, C)</p>
            )}
          </div>
        );
      })}
    </div>
  );
}