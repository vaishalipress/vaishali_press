"use client";

import { userSchema } from "@/lib/schema";
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
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { handleAxiosError } from "@/lib/error";
import { useCustumQuery } from "@/hooks/use-queries";
import { Loader2, Lock, PlusCircle, Smile, User, X } from "lucide-react";

export default function AddUser() {
    const form = useForm<z.infer<typeof userSchema>>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });
    const [isFormOpen, setIsFormOpen] = useState(false);
    const { addData } = useCustumQuery();
    const { mutate, isPending } = useMutation({
        mutationFn: async (values: z.infer<typeof userSchema>) => {
            const { data } = await axios.post(`/api/user`, values);
            return data;
        },

        onSuccess(data) {
            toast("✅ " + (data?.message as string).toUpperCase());
            if (data.success) {
                addData(["user-list"], data.user);
                form.reset();
            }
        },

        onError: handleAxiosError,
    });

    return (
        <div className="max-w-xl w-full border px-4 py-3 rounded-md shadow-md">
            {!isFormOpen ? (
                <div
                    onClick={() => setIsFormOpen(true)}
                    className="flex items-center gap-3 cursor-pointer"
                >
                    <PlusCircle className="w-6 h-6 text-orange-600" />
                    <span className="uppercase text-orange-700 font-semibold">
                        Add User
                    </span>
                </div>
            ) : (
                <>
                    <div className="flex justify-between">
                        <div className="flex gap-3 items-center mb-5">
                            <PlusCircle className="w-6 h-6 text-orange-600" />
                            <span className="uppercase text-orange-700 font-semibold">
                                Add User
                            </span>
                        </div>
                        <Button
                            variant={"ghost"}
                            size={"icon"}
                            onClick={() => setIsFormOpen(false)}
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit((value) =>
                                mutate(value)
                            )}
                            className="flex flex-col gap-3"
                        >
                            {/* Name */}
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex gap-2 items-center">
                                            <Smile className="text-orange-900 w-4 h-4" />{" "}
                                            <span>Email</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                autoFocus
                                                placeholder="Email"
                                                type="email"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Phone */}
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex gap-2 items-center">
                                            <Lock className="text-zinc-600 w-4 h-4" />{" "}
                                            <span>Password</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Password"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                variant={"secondary"}
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <Loader2 className="animate-spin" />
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <User className="text-green-600 w-5 h-5" />
                                        <span className="text-green-600 font-semibold">
                                            ADD
                                        </span>
                                    </div>
                                )}
                            </Button>
                        </form>
                    </Form>
                </>
            )}
        </div>
    );
}
