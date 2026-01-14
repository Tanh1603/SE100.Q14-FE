"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface Option {
  value: string;
  label: string;
  detail?: string;
}

interface SearchableSelectProps {
  options: Option[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function SearchableSelect({
  options,
  value,
  onValueChange,
  placeholder = "Select...",
  className,
  disabled = false,
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const selectedOption = options.find((option) => option.value === value);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
    option.detail?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between font-normal", !value && "text-muted-foreground", className)}
          disabled={disabled}
        >
          {selectedOption ? (
             <div className="flex flex-col items-start text-left">
                <span className="font-medium">{selectedOption.label}</span>
                {selectedOption.detail && <span className="text-[10px] text-gray-500">{selectedOption.detail}</span>}
             </div>
          ) : (
            placeholder
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px] p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-4 py-3 border-b">
          <DialogTitle className="text-base font-medium">
             {placeholder}
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-2 border-b flex items-center gap-2">
           <Search className="w-4 h-4 text-gray-400" />
           <Input 
              placeholder="Search..." 
              className="border-none shadow-none h-8 focus-visible:ring-0 px-0" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
           />
        </div>

        <ScrollArea className="h-[300px]">
          <div className="p-2">
            {filteredOptions.length === 0 ? (
              <div className="py-6 text-center text-sm text-gray-500">
                No results found.
              </div>
            ) : (
              <div className="space-y-1">
                {filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-md text-sm cursor-pointer transition-colors",
                      value === option.value ? "bg-primary/10 text-primary" : "hover:bg-gray-100 text-gray-900"
                    )}
                    onClick={() => {
                      onValueChange(option.value);
                      setOpen(false);
                      setSearchQuery("");
                    }}
                  >
                    <div className="flex flex-col">
                        <span className="font-medium">{option.label}</span>
                        {option.detail && <span className="text-xs opacity-70">{option.detail}</span>}
                    </div>
                    {value === option.value && <Check className="h-4 w-4" />}
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
