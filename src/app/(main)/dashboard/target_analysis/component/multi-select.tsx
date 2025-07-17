// components/ui/multi-select.tsx
"use client";

import { useState } from "react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface MultiSelectProps {
    options: { id: string; name: string }[];
    selected: string[];
    onChange: (selected: string[]) => void;
    placeholder?: string;
}

export function MultiSelect({
    options,
    selected,
    onChange,
    placeholder = "Select...",
}: MultiSelectProps) {
    const [open, setOpen] = useState(false);

    const handleSelect = (value: string) => {
        if (selected.includes(value)) {
            onChange(selected.filter((item) => item !== value));
        } else {
            onChange([...selected, value]);
        }
    };

    const handleClear = () => {
        onChange([]);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className="w-fit justify-between"
                    role="combobox"
                    aria-expanded={open}
                >
                    <span className="truncate text-xs">
                        {selected.length > 0
                            ? selected
                                  ?.map(
                                      (value) =>
                                          options.find(
                                              (option) => option.id === value
                                          )?.name
                                  )
                                  .join(", ")
                            : placeholder}
                    </span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-2">
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                            {selected.length} selected
                        </span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClear}
                            className="h-6 px-2"
                        >
                            Clear
                        </Button>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto">
                        {options?.map((option) => (
                            <div
                                key={option.id}
                                className="flex items-center space-x-2 p-2 hover:bg-muted rounded"
                                onClick={() => handleSelect(option.id)}
                            >
                                <Checkbox
                                    checked={selected.includes(option.id)}
                                    onCheckedChange={() =>
                                        handleSelect(option.id)
                                    }
                                />
                                <Label className="cursor-pointer w-full">
                                    {option.name}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
