"use client";

import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

const Login = () => {
    const [isLoading, setIsLoading] = useState(false);
    const params = useSearchParams();
    const error = params.get("error");

    const onSubmit = async (data: FormData) => {
        const userId = data.get("userid");
        const password = data.get("password");
        console.log(userId, password);
        try {
            setIsLoading(true);
            signIn("credentials", { userId, password });
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        }
    };
    return (
        <div className="w-full h-full min-h-full flex justify-center pt-[100px]">
            <div className="flex h-fit w-fit max-w-[350px] flex-1 flex-col  px-8 pt-4 rounded-xl pb-10 shadow-2xl dark:bg-white/5">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col gap-2">
                    <Image
                        className="mx-auto w-auto h-8 drop-shadow-xl"
                        src={"/logo.png"}
                        alt="Vaishali press"
                        width={100}
                        height={100}
                    />
                    <h1 className="text-center">
                        <span className="text-xl text-orange-700 font-semibold">Vaishali</span> <span className="text-xl text-pink-800 font-semibold">Press</span>
                    </h1>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" action={onSubmit}>
                        <div>
                            <label
                                htmlFor="userid"
                                className="block uppercase text-sm font-medium leading-6 text-gray-900 "
                            >
                                User id
                            </label>
                            <div className="mt-2">
                                <input
                                    id="userid"
                                    name="userid"
                                    type="text"
                                    autoComplete="userid"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset bg-white focus:ring-indigo-600 sm:text-sm sm:leading-6  px-5"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label
                                    htmlFor="password"
                                    className="block uppercase text-sm font-medium leading-6 text-gray-900 "
                                >
                                    Password
                                </label>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 bg-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6  px-5 dark:focus:ring-1"
                                />
                            </div>
                        </div>
                        {error && (
                            <p className="text-red-600 capitalize text-center">
                                {error}
                            </p>
                        )}
                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader2 className="animate-spin" />
                                ) : (
                                    "Login"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
