/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const formatValue = (value: any) => {
  if (value === null || value === undefined) return "-";

  if (typeof value === "string" && !isNaN(Date.parse(value))) {
    return format(new Date(value), "dd/MM/yyyy HH:mm:ss");
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
};

export const AuditLogJsonDiff = ({
  oldValue = {},
  newValue = {},
}: {
  oldValue?: Record<string, any>;
  newValue?: Record<string, any>;
}) => {
  const keys = Array.from(
    new Set([...Object.keys(oldValue), ...Object.keys(newValue)])
  );

  if (!keys.length) {
    return (
      <div className="text-sm text-muted-foreground">
        Không có dữ liệu thay đổi
      </div>
    );
  }

  return (
    <div className="rounded-md border text-sm">
      {keys.map((key) => {
        const oldVal = oldValue[key];
        const newVal = newValue[key];
        const changed =
          JSON.stringify(oldVal) !== JSON.stringify(newVal);

        return (
          <div
            key={key}
            className={cn(
              "grid grid-cols-[200px_1fr] gap-4 border-b px-3 py-2",
              changed ? "bg-muted/30" : ""
            )}
          >
            {/* FIELD */}
            <div className="font-mono text-xs text-muted-foreground">
              {key}
            </div>

            {/* VALUE */}
            <div className="space-y-1">
              {/* OLD */}
              {oldVal !== undefined && (
                <div
                  className={cn(
                    "text-xs",
                    changed
                      ? "text-destructive line-through"
                      : "text-muted-foreground"
                  )}
                >
                  - {formatValue(oldVal)}
                </div>
              )}

              {/* NEW */}
              {newVal !== undefined && (
                <div
                  className={cn(
                    "text-xs",
                    changed ? "text-green-600 font-medium" : ""
                  )}
                >
                  + {formatValue(newVal)}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
