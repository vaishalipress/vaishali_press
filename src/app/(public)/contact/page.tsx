import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function Contact() {
    return (
        <div className="max-w-[1300px] m-auto flex items-center justify-center text-black h-[91.9vh]">
            <div>
                <h1 className="text-4xl font-bold text-center sm:text-start">
                    Contact us
                </h1>
                <div className="mt-16 sm:mt-10 flex flex-col gap-9">
                    <div className="flex flex-col gap-7">
                        <h2 className="text-3xl font-semibold mb-3 ">Phone</h2>
                        <h3 className="text-2xl font-medium">
                            +91 82943 87193
                        </h3>
                        <p className="text-xl font-normal text-black/85">
                            Mon. – Sat. 10:00 AM – 7:00 PM
                        </p>
                    </div>
                    <Separator />
                    <div className="flex flex-col gap-8">
                        <h2 className="text-3xl font-semibold">Email</h2>
                        <div className="text-xl font-normal">
                            <p>Our email is</p>
                            <p>
                                <span className="font-semibold">
                                    vaishalipressmuz@gmail.com
                                </span>{" "}
                                or you
                            </p>
                            <p>can email us directly here.</p>
                        </div>
                        <Button className="max-w-[500px] py-5 bg-black text-white">
                            <Link href={"mailto:vaishalipressmuz@gmail.com"}>
                                Email us
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
