"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { DateRange } from "react-day-picker";

interface SimpleDateRangePickerProps {
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
  className?: string;
}

export function SimpleDateRangePicker({
  date,
  setDate,
  className,
}: SimpleDateRangePickerProps) {
  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDate({
      from: val ? new Date(val) : undefined,
      to: date?.to,
    });
  };

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDate({
      from: date?.from,
      to: val ? new Date(val) : undefined,
    });
  };

  const fromValue = date?.from 
    ? new Date(date.from.getTime() - date.from.getTimezoneOffset() * 60000).toISOString().split("T")[0] 
    : "";
    
  const toValue = date?.to 
    ? new Date(date.to.getTime() - date.to.getTimezoneOffset() * 60000).toISOString().split("T")[0] 
    : "";

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <Input
          type="date"
          value={fromValue}
          onChange={handleFromChange}
          className="h-10 w-40 text-xs"
        />
      </div>
      <span className="text-gray-400">đến</span>
      <div className="relative">
        <Input
          type="date"
          value={toValue}
          onChange={handleToChange}
          className="h-10 w-40 text-xs"
        />
      </div>
    </div>
  );
}
