import React, { useState, useRef } from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FreeTextMultiSelectProps {
  selected: string[];
  onValueChange: (selected: string[]) => void;
  placeholder?: string;
}

export function FreeTextMultiSelect({
  selected = [],
  onValueChange,
  placeholder = "Type and press Enter...",
}: FreeTextMultiSelectProps) {
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const addItem = (value: string) => {
    const trimmedValue = value.trim();
    if (trimmedValue && !selected.includes(trimmedValue)) {
      onValueChange([...selected, trimmedValue]);
    }
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addItem(inputValue);
    } else if (
      e.key === "Backspace" &&
      inputValue === "" &&
      selected.length > 0
    ) {
      const newSelected = [...selected];
      newSelected.pop();
      onValueChange(newSelected);
    }
  };

  const handleBlur = () => {
    addItem(inputValue);
  };

  const handleUnselect = (item: string) => {
    const newSelected = selected.filter((s) => s !== item);
    onValueChange(newSelected);
  };

  return (
    <div className="relative rounded-md border border-input focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
      <div className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent flex items-center gap-2 overflow-x-auto p-2">
        {selected.map((item) => (
          <Badge key={item} variant="default" className="shrink-0">
            {item}
            <button
              className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
              onClick={() => handleUnselect(item)}
            >
              <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
            </button>
          </Badge>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder={selected.length > 0 ? "" : placeholder}
          className="min-w-[100px] flex-1 bg-transparent outline-none placeholder:text-sm placeholder:text-muted-foreground"
        />
      </div>
    </div>
  );
}
