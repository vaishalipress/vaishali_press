"use client";

import { clientSchema } from "@/lib/schema";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { districtsAndBlocks } from "@/lib/contants";
import { useState } from "react";

export default function AddClient() {
    const form = useForm<z.infer<typeof clientSchema>>({
        resolver: zodResolver(clientSchema),
        defaultValues: {
            name: "",
            district: "",
            block: "",
            mobile: "",
        },
    });
    const [district, setDistrict] = useState("");

    function onSubmit(values: z.infer<typeof clientSchema>) {
        console.log(values);
    }

    return (
        <div className="max-w-lg border px-4 py-3 rounded-md">
            <h1 className="uppercase font-semibold mb-3">add Clients</h1>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="flex flex-col gap-3"
                >
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* District */}
                    <FormField
                        control={form.control}
                        name="district"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>District</FormLabel>
                                <FormControl>
                                    <Select
                                        value={field.value}
                                        defaultValue={field.value}
                                        onValueChange={(e: string) => {
                                            form.setValue("block", "");
                                            setDistrict(e);
                                            field.onChange(e);
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue
                                                placeholder={"Select district"}
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>
                                                    Districts
                                                </SelectLabel>

                                                {districtsAndBlocks.map((d) => (
                                                    <SelectItem
                                                        key={d.name}
                                                        value={d.name.toLowerCase()}
                                                    >
                                                        {d.name.toUpperCase()}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Block */}
                    <FormField
                        control={form.control}
                        name="block"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Block</FormLabel>
                                <FormControl>
                                    <Select
                                        value={field.value}
                                        onValueChange={(e: string) => {
                                            field.onChange(e);
                                        }}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger>
                                            <SelectValue
                                                placeholder={"Select block"}
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>
                                                    Blocks
                                                </SelectLabel>
                                                {districtsAndBlocks.map((d) => {
                                                    if (
                                                        d.name.toLowerCase() ===
                                                        district
                                                    ) {
                                                        return d.block.map(
                                                            (block) => (
                                                                <SelectItem
                                                                    key={block}
                                                                    value={block.toLowerCase()}
                                                                >
                                                                    {block.toUpperCase()}
                                                                </SelectItem>
                                                            )
                                                        );
                                                    }
                                                })}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Phone */}
                    <FormField
                        control={form.control}
                        name="mobile"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mobile</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="Enter Mobile no."
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" variant={"secondary"}>Submit</Button>
                </form>
            </Form>
        </div>
    );
}
