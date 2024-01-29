"use client";
import * as React from "react";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "./ui/select";

const filters = [
    {
        value: "all",
        label: "All",
    },
    {
        value: "yesterday",
        label: "Yesterday",
    },
    {
        value: "week",
        label: "One Week",
    },
    {
        value: "month",
        label: "One Month",
    },
    {
        value: "custom",
        label: "Custom",
    },
];

export function Filter() {
    const [value, setValue] = React.useState(filters[0].value);

    return (
        <div className="max-w-[150px] w-full">
            <Select
                value={value}
                defaultValue={value}
                onValueChange={(val) => setValue(val)}
            >
                <SelectTrigger>
                    <SelectValue placeholder={"SELECT FILTER"} />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Filters</SelectLabel>

                        {filters?.map((f) => (
                            <SelectItem key={f.value} value={f.value}>
                                {f.label}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
}
